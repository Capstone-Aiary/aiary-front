// services/chatSSEService.ts
import { Chat } from "../types/chat";

type Callback = (msg: Chat) => void;

class ChatSSEService {
  private subscribers = new Map<string, Set<Callback>>();
  private eventSources = new Map<string, EventSource>();
  private pendingConnections = new Map<string, Promise<void>>();
  private pendingMessages = new Map<string, Chat>();
  subscribe(threadId: string, callback: Callback): () => void {
    if (!this.subscribers.has(threadId)) {
      this.subscribers.set(threadId, new Set());
    }

    const threadCallbacks = this.subscribers.get(threadId)!;
    threadCallbacks.add(callback);

    if (this.pendingConnections.has(threadId)) {
      return this.createUnsubscribe(threadId, callback);
    }
    if (this.eventSources.has(threadId)) {
      return this.createUnsubscribe(threadId, callback);
    }

    if (!this.eventSources.has(threadId)) {
      const connectionPromise = this.createConnection(threadId);
      this.pendingConnections.set(threadId, connectionPromise);
      connectionPromise.finally(() => {
        this.pendingConnections.delete(threadId);
      });
    }

    return this.createUnsubscribe(threadId, callback);
  }

  private async createConnection(threadId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(`http://localhost:3000/api/chat/stream?threadId=${threadId}`);

      this.eventSources.set(threadId, eventSource);

      eventSource.onopen = () => {
        resolve();
      };
      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          this.pendingMessages.delete(threadId);
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
        if (error instanceof MessageEvent && error.data) {
          try {
            const errorData = JSON.parse(error.data);
            if (errorData.type === "IllegalStateException" && errorData.message === "thread finalized") {
              eventSource.close();

              this.eventSources.delete(threadId);
              this.subscribers.delete(threadId);

              reject(new Error(errorData.message));
              return;
            }
          } catch (e) {}
        }

        if (eventSource.readyState === EventSource.CLOSED) {
          this.eventSources.delete(threadId);
          this.subscribers.delete(threadId);

          reject(error);
        }
      };
    });
  }

  private createUnsubscribe(threadId: string, callback: Callback): () => void {
    return () => {
      const threadCallbacks = this.subscribers.get(threadId);
      threadCallbacks?.delete(callback);

      if (threadCallbacks?.size === 0) {
        console.log("CLOSING EventSource for:", threadId);
        const eventSource = this.eventSources.get(threadId);
        eventSource?.close();
        this.eventSources.delete(threadId);
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
      pendingConnections: Array.from(this.pendingConnections.keys()),
    };
  }
}

export const chatSSEService = new ChatSSEService();
