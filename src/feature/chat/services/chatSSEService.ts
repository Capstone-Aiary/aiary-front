// services/chatSSEService.ts
import { Chat } from "../types/chat";

type Callback = (msg: Chat) => void;

class ChatSSEService {
  private subscribers = new Map<string, Set<Callback>>();
  private eventSources = new Map<string, EventSource>();
  private pendingMessages = new Map<string, Chat>();

  startStream(threadId: string): void {
    if (this.eventSources.has(threadId)) {
      console.log("SSE already connected for:", threadId);
      return;
    }

    const eventSource = new EventSource(`${process.env.EXPO_PUBLIC_BACKEND_URL}/chat/stream?threadId=${threadId}`);

    this.eventSources.set(threadId, eventSource);

    eventSource.onopen = () => {
      console.log(`SSE Connection OPENED for thread: ${threadId}`);
    };

    eventSource.addEventListener("delta", (event) => {
      console.log("data (delta):", event.data);
      try {
        const chunk = JSON.parse(event.data);

        if (chunk.type === "delta" && chunk.text) {
          let currentMessage = this.pendingMessages.get(threadId);

          if (!currentMessage) {
            currentMessage = {
              id: `temp-${Date.now()}`,
              threadId: threadId,
              senderId: "",
              senderName: "",
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
          this.subscribers.get(threadId)?.forEach((cb) => cb(currentMessage!));
        }
      } catch (error) {
        console.error("Error parsing delta message:", error);
      }
    });

    eventSource.addEventListener("done", (event) => {
      console.log("data (done):", event.data);
      try {
        const chunk = JSON.parse(event.data);
        if (chunk.type === "done") {
          console.log("Stream completed for:", threadId);
          this.pendingMessages.delete(threadId);

          this.closeStream(threadId);
        }
      } catch (error) {
        console.error("Error parsing done message:", error);
      }
    });

    eventSource.onmessage = (event) => {
      console.log("data (default message):", event.data);
    };

    eventSource.onerror = (error) => {
      console.error("SSE CONNECTION DROPPED (onerror executed):", error);

      if (error instanceof MessageEvent && error.data) {
        try {
          const errorData = JSON.parse(error.data);
          if (errorData.type === "IllegalStateException" && errorData.message === "thread finalized") {
            this.closeStream(threadId);
            return;
          }
        } catch (e) {}
      }

      if (eventSource.readyState === EventSource.CLOSED) {
        this.closeStream(threadId);
      }
    };
  }

  closeStream(threadId: string): void {
    const eventSource = this.eventSources.get(threadId);
    if (eventSource) {
      eventSource.close();
      this.eventSources.delete(threadId);
      console.log("CLOSING EventSource for:", threadId);
    }
  }

  subscribe(threadId: string, callback: Callback): () => void {
    if (!this.subscribers.has(threadId)) {
      this.subscribers.set(threadId, new Set());
    }

    const threadCallbacks = this.subscribers.get(threadId)!;
    threadCallbacks.add(callback);

    return () => {
      threadCallbacks.delete(callback);

      if (threadCallbacks.size === 0) {
        this.subscribers.delete(threadId);
      }
    };
  }

  broadcast(threadId: string, msg: Chat) {
    this.subscribers.get(threadId)?.forEach((cb) => cb(msg));
  }

  getStatus() {
    return {
      activeSources: Array.from(this.eventSources.keys()),
      subscriberCounts: Array.from(this.subscribers.entries()).map(([key, set]) => ({
        threadId: key,
        count: set.size,
      })),
    };
  }
}

export const chatSSEService = new ChatSSEService();
