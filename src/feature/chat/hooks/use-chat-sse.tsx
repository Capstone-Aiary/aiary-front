import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Observable } from "rxjs";
import {
  auditTime,
  delay,
  distinctUntilChanged,
  retryWhen,
  take,
} from "rxjs/operators";

function fromEventSource(url: string) {
  return new Observable<MessageEvent>((subscriber) => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      subscriber.next(event);
    };
    eventSource.onerror = (error) => {
      subscriber.error(error);
      eventSource.close();
    };
    return () => eventSource.close();
  });
}

export function useChatSSE(chatId: string) {
  const queryClient = useQueryClient();
  const botMessageRef = useRef<any>(null);

  useEffect(() => {
    const sse$ = fromEventSource(
      `https://localhost:8000/chat/${chatId}/stream`
    ).pipe(
      auditTime(50),
      distinctUntilChanged((a, b) => a.data === b.data),
      retryWhen((errors) => errors.pipe(delay(2000), take(3)))
    );

    const subscription = sse$.subscribe({
      next: (event) => {
        if (event.data === "[DONE]") {
          queryClient.invalidateQueries({ queryKey: ["chatList", chatId] });
          botMessageRef.current = null;
          return;
        }

        const data = JSON.parse(event.data);
        const delta = data.choices?.[0]?.delta?.content ?? "";

        queryClient.setQueryData(["chatList", chatId], (old: any) => {
          if (!old || !old.pages || old.pages.length === 0) {
            const botMsg = {
              id: "bot-temp",
              chatRoomId: chatId,
              senderId: "bot",
              senderName: "챗봇",
              content: delta,
              createdAt: new Date().toISOString(),
              isStreaming: true,
            };
            botMessageRef.current = botMsg;
            return {
              ...old,
              pages: [{ items: [botMsg], nextCursor: null }],
              pageParams: [],
            };
          }
          const newPages = [...old.pages];
          let botMsg = botMessageRef.current;
          if (!botMsg) {
            botMsg = newPages[0].items.find(
              (msg: any) => msg.id === "bot-temp"
            );
          }
          if (botMsg) {
            botMsg.content += delta;
            botMessageRef.current = botMsg;
            newPages[0].items[0] = { ...botMsg };
          } else {
            botMsg = {
              id: "bot-temp",
              chatRoomId: chatId,
              senderId: "bot",
              senderName: "챗봇",
              content: delta,
              createdAt: new Date().toISOString(),
              isStreaming: true,
            };
            botMessageRef.current = botMsg;
            newPages[0].items.unshift(botMsg);
          }
          return {
            ...old,
            pages: newPages,
          };
        });
      },
      error: () => {
        queryClient.invalidateQueries({ queryKey: ["chatList", chatId] });
        botMessageRef.current = null;
      },
    });

    return () => subscription.unsubscribe();
  }, [chatId, queryClient]);
}
