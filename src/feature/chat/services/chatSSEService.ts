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
    const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    if (!token) {
      console.error("❌ [SSE] 토큰이 없습니다. 로그인 상태를 확인하세요.");
      this.closeStream(threadId);
      return;
    }

    const url = `${baseUrl}/chat/stream?threadId=${threadId}`;

    const startTime = performance.now();
    let isFirstTokenReceived = false;

    try {
      await fetchEventSource(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,

        async onopen(response) {
          if (response.ok) {
            return;
          } else if (response.status === 401 || response.status === 403) {
            console.error("🚫 [SSE] 인증 실패 (401/403)");
            throw new Error("Unauthorized");
          } else {
            throw new Error(`Connection failed: ${response.status}`);
          }
        },

        onmessage: (event) => {
          try {
            if (event.event === "done") {
              this.closeStream(threadId);
              return;
            }

            if (event.event === "delta") {
              const chunk = JSON.parse(event.data);

              if (chunk.text) {
                if (!isFirstTokenReceived) {
                  const ttfb = performance.now() - startTime;
                  console.log(`⏱️ [Telemetry] TTFB (Latency): ${ttfb.toFixed(2)}ms`);
                  isFirstTokenReceived = true;
                }

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
          } catch (e) {
            console.error("❌ [SSE] 메시지 파싱 에러:", e);
          }
        },

        onerror: (err: any) => {
          console.error("🔥 [SSE] 에러 발생:", err);

          if (err.message === "Unauthorized") {
            this.closeStream(threadId);
            throw err;
          }

          console.log("🔄 [SSE] 일시적 네트워크 오류. 1초 후 재연결을 시도합니다...");
          return 1000;
        },

        onclose: () => {},
      });
    } catch (error) {
      console.error("❌ [SSE] Fetch 실행 중 에러:", error);
      this.closeStream(threadId);
    }
  }

  closeStream(threadId: string): void {
    const controller = this.controllers.get(threadId);
    if (controller) {
      controller.abort();
      this.controllers.delete(threadId);
      this.pendingMessages.delete(threadId);
      console.log(`🛑 [SSE] Stream closed for thread: ${threadId}`);
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
