// import { Chat } from "../types/chat";

// type Callback = (msg: Chat) => void;

// export class ChatSSEService {
//   private subscribers = new Map<string, Callback>();

//   subscribe(threadId: string, callback: Callback) {
//     this.subscribers.set(threadId, callback);

//     const eventSource = new EventSource(`http://localhost:8080/chat/stream?threadId=${threadId}`);

//     eventSource.onmessage = (event) => {
//       if (event.data === "[DONE]") return;
//       const msg: Chat = JSON.parse(event.data);
//       callback(msg);
//     };

//     eventSource.onerror = () => eventSource.close();

//     return () => {
//       this.subscribers.delete(threadId);
//       eventSource.close();
//     };
//   }

//   broadcast(threadId: string, msg: Chat) {
//     this.subscribers.get(threadId)?.(msg);
//   }
// }

// export const chatSSEService = new ChatSSEService();

import type { Chat } from "../types/chat";

class ChatSSEService {
  broadcast(threadId: string, message: Chat) {
    console.log("Broadcasting message:", message);
    // Mock: 실제로는 이벤트를 브로드캐스트하지만 여기서는 로그만 출력
  }

  subscribe(threadId: string, callback: (message: Chat) => void) {
    console.log("Subscribed to thread:", threadId);
    // Mock: 실제 SSE 구독 대신 빈 함수 반환
    return () => {
      console.log("Unsubscribed from thread:", threadId);
    };
  }
}

export const chatSSEService = new ChatSSEService();