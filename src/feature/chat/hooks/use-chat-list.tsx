import { useInfiniteQuery } from "@tanstack/react-query";
import { ChatListPage } from "../types/chat";

export function useChatList(chatId: string) {
  return useInfiniteQuery<ChatListPage>({
    queryKey: ["chatList", chatId],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `https://localhost:8000/chat/${chatId}/list?cursor=${pageParam ?? ""}`
      );
      return res.json();
    },
    initialPageParam: "",
    getNextPageParam: (lastPage: { nextCursor?: string }) =>
      lastPage.nextCursor,
  });
}
