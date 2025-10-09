import { addMockChat, mockChatData } from './../ui/chat-list';
// import { Chat, ChatListPage } from "../types/chat";

// const BASE_URL = "http://localhost:8080";

// function handleApiError(res: Response) {
//   if (!res.ok) {
//     throw new Error(`API Error: ${res.status} ${res.statusText}`);
//   }
//   return res;
// }

// export const chatApi = {
//   async fetchChatList(threadId: string, cursor?: string): Promise<ChatListPage> {
//     const res = await fetch(`${BASE_URL}/threads/${threadId}/messages?cursor=${cursor ?? ""}`);
//     handleApiError(res);
//     return res.json();
//   },

//   async sendMessage(threadId: string, content: string): Promise<Chat> {
//     const res = await fetch(`${BASE_URL}/chat/messages`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ threadId, content }),
//     });
//     handleApiError(res);
//     return res.json();
//   },

//   async updateMessage(messageId: string, content: string): Promise<Chat> {
//     const res = await fetch(`${BASE_URL}/chat/messages/${messageId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content }),
//     });
//     handleApiError(res);
//     return res.json();
//   },

//   async deleteMessage(messageId: string): Promise<void> {
//     const res = await fetch(`${BASE_URL}/chat/messages/${messageId}`, {
//       method: "DELETE",
//     });
//     handleApiError(res);
//   },
// };



import type { Chat } from "../types/chat";

export const chatApi = {
  sendMessage: async (threadId: string, content: string): Promise<Chat> => {
    // 네트워크 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));

    const newMessage: Chat = {
      id: `msg-${Date.now()}`,
      content,
      isMe: true,
      createdAt: new Date().toISOString(),
      threadId: '',
      senderId: '',
      senderName: ''
    };

    addMockChat(newMessage);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: Chat = {
        id: `msg-${Date.now()}-ai`,
        content: "네, 잘 들었어요! 더 자세히 말씀해주시겠어요?",
        isMe: false,
        createdAt: new Date().toISOString(),
        threadId: '',
        senderId: '',
        senderName: ''
      };
      addMockChat(aiResponse);
    }, 1000);

    return newMessage;
  },

  getChatList: async (threadId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockChatData;
  },
};