import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { chatSSEService } from "../services/chatSSEService";
import { Chat } from "../types/chat";

export function useChatEvents(threadId: string) {
  const queryClient = useQueryClient();
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (isSubscribedRef.current) {
      return;
    }

    isSubscribedRef.current = true;
    const unsubscribe = chatSSEService.subscribe(threadId, (msg: Chat) => {
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

        const newData = {
          ...oldData,
          pages: newPages,
        };

        return newData;
      });
    });

    return () => {
      isSubscribedRef.current = false;
      unsubscribe();
    };
  }, [threadId]);
}
