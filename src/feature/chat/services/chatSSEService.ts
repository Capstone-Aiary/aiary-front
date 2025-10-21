// services/chatSSEService.ts
import { Chat } from "../types/chat";

type Callback = (msg: Chat) => void;

class ChatSSEService {
  private subscribers = new Map<string, Set<Callback>>();
  private eventSources = new Map<string, EventSource>();
  private pendingConnections = new Map<string, Promise<void>>();

  subscribe(threadId: string, callback: Callback): () => void {
    console.log("SUBSCRIBE called for thread:", threadId);
    
    if (this.eventSources.has(threadId)) {
      console.log("⚠️ Cleaning up existing connection");
      const existingSource = this.eventSources.get(threadId);
      existingSource?.close();
      this.eventSources.delete(threadId);
    }

    if (!this.subscribers.has(threadId)) {
      this.subscribers.set(threadId, new Set());
    }

    const threadCallbacks = this.subscribers.get(threadId)!;
    threadCallbacks.add(callback);

    if (this.pendingConnections.has(threadId)) {
      console.log("⏳ Connection already pending, waiting...");
      this.pendingConnections.get(threadId)!.then(() => {
        console.log("✅ Pending connection resolved");
      });
      
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
    console.log("CREATING NEW EventSource for:", threadId);
    
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(
        `http://localhost:8080/chat/stream?threadId=${threadId}`
      );

      this.eventSources.set(threadId, eventSource);

      eventSource.onopen = () => {
        console.log("✅ EventSource opened successfully:", threadId);
        resolve();
      };

      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") return;
        
        try {
          const msg: Chat = JSON.parse(event.data);
          this.subscribers.get(threadId)?.forEach((cb) => cb(msg));
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };
eventSource.onerror = (error) => {
        console.error("❌ EventSource error:", threadId, error);
        
       
        if (error instanceof MessageEvent && error.data) {
          try {
            const errorData = JSON.parse(error.data);
            if (errorData.type === "IllegalStateException" && errorData.message === "thread finalized") {
              console.warn(`🛑 Permanent error: ${errorData.message}. Closing connection for ${threadId} permanently.`);
              
              
              eventSource.close(); 
              
             
              this.eventSources.delete(threadId);
              this.subscribers.delete(threadId);
              
            
              reject(new Error(errorData.message));
              return; 
            }
          } catch (e) {
          
          }
        }
        
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log("Connection closed, cleaning up...");
          
          this.eventSources.delete(threadId);
          this.subscribers.delete(threadId);
          
          reject(error);
        }
        
       
      };
    });
  }

  private createUnsubscribe(threadId: string, callback: Callback): () => void {
    return () => {
      console.log("UNSUBSCRIBE called for thread:", threadId);
      
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
    console.log('Broadcasting to subscribers:', this.subscribers.get(threadId)?.size || 0);
    this.subscribers.get(threadId)?.forEach((cb) => cb(msg));
  }

  getStatus() {
    return {
      activeSources: Array.from(this.eventSources.keys()),
      subscriberCounts: Array.from(this.subscribers.entries()).map(([key, set]) => ({
        threadId: key,
        count: set.size
      })),
      pendingConnections: Array.from(this.pendingConnections.keys())
    };
  }
}

export const chatSSEService = new ChatSSEService();