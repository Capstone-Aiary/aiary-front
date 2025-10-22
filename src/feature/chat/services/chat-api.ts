import { Chat } from "../types/chat";

const BASE_URL = "http://localhost:3000/api";

function handleApiError(res: Response) {
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res;
}

export const chatApi = {
  async fetchChatList(threadId: string, cursor?: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/threads/${threadId}/messages?cursor=${cursor ?? ""}`);
    handleApiError(res);
    return res.json();
  },

  async sendMessage(threadId: string, content: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, content }),
    });
    handleApiError(res);
    return res.json();
  },

  async updateMessage(messageId: string, content: string): Promise<Chat> {
    const res = await fetch(`${BASE_URL}/chat/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    handleApiError(res);
    return res.json();
  },

  async deleteMessage(messageId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/chat/messages/${messageId}`, {
      method: "DELETE",
    });
    handleApiError(res);
  },
};



