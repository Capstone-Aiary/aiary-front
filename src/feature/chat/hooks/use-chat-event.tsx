import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { chatSSEService } from "../services/chatSSEService";
import { Chat } from "../types/chat";

export function useChatEvents(threadId: string) {
  const queryClient = useQueryClient();
  const cleanupRef = useRef<(() => void) | null>(null);

  const startStreaming = useCallback(() => {
    if (!threadId) return;

    if (cleanupRef.current) cleanupRef.current();

    const cleanup = chatSSEService.startStream(
      threadId,
      (msg: Chat) => {
        queryClient.setQueryData(["chatList", threadId], (oldData: any) => {
          console.log("Stream Update Triggered!", msg.content, oldData);
          if (!oldData) {
            return {
              pages: [{ items: [msg], nextCursor: null }],
              pageParams: [""],
            };
          }

          const newPages = [...oldData.pages];
          const firstPage = { ...newPages[0] };
          const newItems = [...firstPage.items];

          const msgIndex = newItems.findIndex((item: Chat) => item.id === msg.id);

          if (msgIndex !== -1) {
            newItems[msgIndex] = msg;
          } else {
            newItems.unshift(msg);
          }

          firstPage.items = newItems;
          newPages[0] = firstPage;

          return {
            ...oldData,
            pages: newPages,
          };
        });
      },
      () => {},
      (error) => {
        console.error(error);
      }
    );

    cleanupRef.current = cleanup;
  }, [threadId, queryClient]);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  return { startStreaming };
}
