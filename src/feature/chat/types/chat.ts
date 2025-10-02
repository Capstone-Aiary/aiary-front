export type Chat = {
  id: string;                
  chatRoomId: string;        
  senderId: string;          
  senderName: string;        
  content: string;           
  createdAt: string;
  isMe: boolean;
};

export type ChatListPage = {
	items: Chat[];
	nextCursor?: string;
}
export type ChatSSEMessage = Chat;