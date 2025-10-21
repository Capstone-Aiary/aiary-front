import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { chatSSEService } from "../services/chatSSEService";

export function useChatEvents(threadId: string) {
  const queryClient = useQueryClient();
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (isSubscribedRef.current) {
      return;
    }

    isSubscribedRef.current = true;

    const unsubscribe = chatSSEService.subscribe(threadId, (msg) => {
      queryClient.setQueryData(["chatList", threadId], (old: any) => {
        if (!old)
          return {
            pages: [{ items: [msg], nextCursor: null }],
            pageParams: [],
          };
        const newPages = [...old.pages];
        newPages[0].items.unshift(msg);
        return { ...old, pages: newPages };
      });
    });

    return () => {
      isSubscribedRef.current = false;
      unsubscribe();
    };
  }, [threadId]);
}
