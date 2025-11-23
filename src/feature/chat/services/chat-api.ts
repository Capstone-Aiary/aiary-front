import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Chat } from "../types/chat";

type Callback = (msg: Chat) => void;

class ChatSSEService {
  private subscribers = new Map<string, Set<Callback>>();
  private controllers = new Map<string, AbortController>();
  private pendingMessages = new Map<string, Chat>();

  async startStream(threadId: string): Promise<void> {
    if (this.controllers.has(threadId)) {
      return;
    }

    const controller = new AbortController();
    this.controllers.set(threadId, controller);

    const token = localStorage.getItem("accessToken");
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/chat/stream?threadId=${threadId}`;

    await fetchEventSource(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,

      // 1. 연결 성공 시
      async onopen(response) {
        if (response.ok) {
          console.log(`SSE Connection OPENED for thread: ${threadId}`);
          return; // 성공
        } else if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized");
        } else {
          throw new Error(`Failed to connect: ${response.status}`);
        }
      },

      // 2. 메시지 수신
      onmessage: (event) => {
        try {
          if (event.event === "done") {
            console.log("Stream completed for:", threadId);
            this.closeStream(threadId);
            return;
          }

          if (event.event === "delta") {
            const chunk = JSON.parse(event.data);

            if (chunk.text) {
              let currentMessage = this.pendingMessages.get(threadId);

              if (!currentMessage) {
                currentMessage = {
                  id: `temp-${Date.now()}`,
                  threadId: threadId,
                  senderId: "ai",
                  senderName: "AI Assistant",
                  role: "assistant",
                  content: chunk.text,
                  createdAt: new Date().toISOString(),
                };
              } else {
                currentMessage = {
                  ...currentMessage,
                  content: (currentMessage.content || "") + chunk.text,
                };
              }

              this.pendingMessages.set(threadId, currentMessage);
              this.broadcast(threadId, currentMessage);
            }
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      },

      // 3. 에러 발생 시
      onerror: (err: any) => {
        console.error("SSE Error:", err);

        if (err.message === "Unauthorized") {
          this.closeStream(threadId);
          throw err; // 재연결 안 함
        }
      },

      // 4. 연결 종료 시
      onclose: () => {
        console.log("Connection closed by server");
      },
    });
  }

  closeStream(threadId: string): void {
    const controller = this.controllers.get(threadId);
    if (controller) {
      controller.abort();
      this.controllers.delete(threadId);
      this.pendingMessages.delete(threadId);
      console.log("CLOSING SSE for:", threadId);
    }
  }

  subscribe(threadId: string, callback: Callback): () => void {
    if (!this.subscribers.has(threadId)) {
      this.subscribers.set(threadId, new Set());
    }

    const threadCallbacks = this.subscribers.get(threadId)!;
    threadCallbacks.add(callback);

    const currentMsg = this.pendingMessages.get(threadId);
    if (currentMsg) {
      callback(currentMsg);
    }

    return () => {
      threadCallbacks.delete(callback);
      if (threadCallbacks.size === 0) {
        this.subscribers.delete(threadId);
      }
    };
  }

  private broadcast(threadId: string, msg: Chat) {
    this.subscribers.get(threadId)?.forEach((cb) => cb(msg));
  }
}

export const chatSSEService = new ChatSSEService();
