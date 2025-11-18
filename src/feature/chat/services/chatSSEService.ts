import { Chat } from "../types/chat";

type Callback = (msg: Chat) => void;

class ChatSSEService {
  private subscribers = new Map<string, Set<Callback>>();
  private eventSources = new Map<string, EventSource>();
  private pendingMessages = new Map<string, Chat>();

  startStream(threadId: string): void {
    if (this.eventSources.has(threadId)) {
      return;
    }

    const eventSource = new EventSource(`${process.env.EXPO_PUBLIC_BACKEND_URL}/chat/stream?threadId=${threadId}`);

    this.eventSources.set(threadId, eventSource);

    eventSource.onopen = () => {
      console.log("SSE connected for:", threadId);
    };

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        console.log("Stream completed for:", threadId);
        this.pendingMessages.delete(threadId);

        this.closeStream(threadId);
        return;
      }

      try {
        const chunk = JSON.parse(event.data);

        if (chunk.content) {
          let currentMessage = this.pendingMessages.get(threadId);

          if (!currentMessage) {
            currentMessage = {
              id: `temp-${Date.now()}`,
              threadId: threadId,
              senderId: "",
              senderName: "",
              role: "assistant",
              content: chunk.content,
              createdAt: new Date().toISOString(),
            };
          } else {
            currentMessage = {
              ...currentMessage,
              content: (currentMessage.content || "") + chunk.content,
            };
          }

          this.pendingMessages.set(threadId, currentMessage);

          this.subscribers.get(threadId)?.forEach((cb) => cb(currentMessage!));
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error for:", threadId, error);
      this.closeStream(threadId);
    };
  }

  closeStream(threadId: string): void {
    const eventSource = this.eventSources.get(threadId);
    if (eventSource) {
      eventSource.close();
      this.eventSources.delete(threadId);
      console.log("SSE closed for:", threadId);
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
