// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useRef } from "react";
// import { chatApi } from "../services/chat-api";
// import { chatSSEService } from "../services/chatSSEService";
// import { Chat, ChatListPage } from "../types/chat";

// export function useChatList(threadId: string) {
//   return useInfiniteQuery<ChatListPage>({
//     queryKey: ["chatList", threadId],
//     queryFn: ({ pageParam }) =>
//       chatApi.fetchChatList(threadId, pageParam as string),
//     getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
//     initialPageParam: "",
//   });
// }

// export function useChatEvents(threadId: string) {
//   const queryClient = useQueryClient();
//   const botMessageRef = useRef<Chat | null>(null);

//   useEffect(() => {
//     const unsubscribe = chatSSEService.subscribe(threadId, (msg) => {
//       queryClient.setQueryData(["chatList", threadId], (old: any) => {
//         if (!old || !old.pages || old.pages.length === 0) {
//           return {
//             pages: [{ items: [msg], nextCursor: null }],
//             pageParams: [],
//           };
//         }
//         const newPages = [...old.pages];
//         newPages[0].items.unshift(msg);
//         return { ...old, pages: newPages };
//       });
//     });

//     return () => unsubscribe();
//   }, [threadId, queryClient]);
// }

// hooks/use-chat.ts 수정 버전
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Chat } from "../types/chat";
import { mockChatData } from "../ui/chat-list";

interface ChatPage {
  items: Chat[];
  nextCursor?: string;
  hasMore: boolean;
}

// Mock API 함수들
const fetchChatList = async (
  threadId: string,
  cursor?: string
): Promise<ChatPage> => {
  // 실제 API 대신 목 데이터 반환
  await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션

  return {
    items: mockChatData,
    hasMore: false,
  };
};

export const useChatList = (threadId: string) => {
  return useQuery({
    queryKey: ["chats", threadId],
    queryFn: () => fetchChatList(threadId),
  });
};

export const useChatEvents = (threadId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // SSE 이벤트 리스너 대신 mock 데이터 사용
    console.log("Chat events subscribed for thread:", threadId);

    return () => {
      console.log("Chat events unsubscribed");
    };
  }, [threadId, queryClient]);
};
