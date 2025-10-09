import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { chatSSEService } from "../services/chatSSEService";
import { Chat } from "../types/chat";

export function useChatEvents(threadId: string) {
  const queryClient = useQueryClient();
  const botMessageRef = useRef<Chat | null>(null);

  useEffect(() => {
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

    return () => unsubscribe();
  }, [threadId, queryClient]);
}
