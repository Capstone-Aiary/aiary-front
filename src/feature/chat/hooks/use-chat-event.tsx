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
          if (!oldData) {
            return {
              pages: [{ items: [msg], nextCursor: null }],
              pageParams: [""],
            };
          }

          let messageExists = false;

          const newPages = oldData.pages.map((page: any) => {
            const newItems = page.items.map((item: Chat) => {
              if (item.id === msg.id) {
                messageExists = true;
                return msg;
              }
              return item;
            });
            return { ...page, items: newItems };
          });

          if (!messageExists) {
            newPages[0] = {
              ...newPages[0],
              items: [msg, ...newPages[0].items],
            };
          }

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
