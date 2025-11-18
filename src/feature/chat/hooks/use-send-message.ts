import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../services/chat-api"; // 메시지 전송 API
import { Chat } from "../types/chat";
import { useChatEvents } from "./use-chat-event";

export function useSendMessage(threadId: string) {
  const queryClient = useQueryClient();
  const { startStreaming } = useChatEvents(threadId);
  return useMutation({
    mutationFn: (content: string) => chatApi.sendMessage(threadId, content), // 1. 실제 API 호출

    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: ["chatList", threadId] });

      const previousChatList = queryClient.getQueryData(["chatList", threadId]);

      const optimisticMessage: Chat = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content: content,
        createdAt: new Date().toISOString(),
        threadId: "",
        senderId: "",
        senderName: "",
      };

      queryClient.setQueryData(["chatList", threadId], (oldData: any) => {
        if (!oldData) {
          return {
            pages: [{ items: [optimisticMessage], nextCursor: null }],
            pageParams: [""],
          };
        }

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          items: [optimisticMessage, ...newPages[0].items],
        };

        return { ...oldData, pages: newPages };
      });

      return { previousChatList };
    },
    onSuccess: (data: Chat) => {
      startStreaming();
    },

    onError: (err, newTodo, context) => {
      if (context?.previousChatList) {
        queryClient.setQueryData(["chatList", threadId], context.previousChatList);
      }
    },
  });
}
