import { Chat } from "../types/chat";

type OnUpdate = (msg: Chat) => void;
type OnComplete = () => void;
type OnError = (err: any) => void;

class ChatSSEService {
  private activeSources = new Map<string, EventSource>();
  private messageBuffer = new Map<string, Chat>();

  startStream(threadId: string, onUpdate: OnUpdate, onComplete?: OnComplete, onError?: OnError): () => void {
    this.stopStream(threadId);

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/chat/stream?threadId=${threadId}`;
    const eventSource = new EventSource(url);

    this.activeSources.set(threadId, eventSource);

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        this.finalizeStream(threadId);
        onComplete?.();
        return;
      }

      try {
        const chunk = JSON.parse(event.data);
        if (chunk.content) {
          this.handleChunk(threadId, chunk.content, onUpdate);
        }
      } catch (error) {
        console.error(error);
      }
    };

    eventSource.onerror = (error) => {
      this.finalizeStream(threadId);
      onError?.(error);
    };

    return () => this.stopStream(threadId);
  }

  stopStream(threadId: string) {
    this.finalizeStream(threadId);
  }

  private finalizeStream(threadId: string) {
    const source = this.activeSources.get(threadId);
    if (source) {
      source.close();
      this.activeSources.delete(threadId);
    }
    this.messageBuffer.delete(threadId);
  }

  private handleChunk(threadId: string, newContent: string, onUpdate: OnUpdate) {
    let currentMessage = this.messageBuffer.get(threadId);
    console.log("Received chunk:", newContent);
    if (!currentMessage) {
      currentMessage = {
        id: `ai-${Date.now()}`,
        threadId: threadId,
        senderId: "ai",
        senderName: "Assistant",
        role: "assistant",
        content: newContent,
        createdAt: new Date().toISOString(),
      };
    } else {
      currentMessage = {
        ...currentMessage,
        content: (currentMessage.content || "") + newContent,
      };
    }

    this.messageBuffer.set(threadId, currentMessage);
    onUpdate(currentMessage);
  }
}

export const chatSSEService = new ChatSSEService();
