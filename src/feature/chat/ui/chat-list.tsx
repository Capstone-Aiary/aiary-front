import { useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { FlatList, Keyboard, View } from "react-native";

import { useChatList } from "../hooks/use-chat-list";
import type { Chat } from "../types/chat";
import DateDivider from "./date-divider";
import ChatMessage from "./message/chat-message";

type ChatListItem =
  | { type: "message"; data: Chat }
  | { type: "date"; data: { date: string; id: string } };

const ChatList = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatList(id);

  const chatList = data?.pages.flatMap((page) => page.items) ?? [];
  const [forceUpdate, setForceUpdate] = useState(0);

  const sortedChatList = useMemo(() => {
    const sorted = [...chatList]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .reverse();
    return sorted;
  }, [chatList, forceUpdate]);

  const chatListWithDateDividers = useMemo(() => {
    const items: ChatListItem[] = [];

    for (let i = 0; i < sortedChatList.length; i++) {
      const currentMessage = sortedChatList[i];
      const nextMessage = sortedChatList[i + 1];

      const currentDate = new Date(currentMessage.createdAt);
      const nextDate = nextMessage ? new Date(nextMessage.createdAt) : null;

      items.push({
        type: "message",
        data: currentMessage,
      });

      if (!nextDate || !isSameDay(currentDate, nextDate)) {
        items.push({
          type: "date",
          data: {
            date: formatDate(currentDate),
            id: `date-${currentDate.toDateString()}`,
          },
        });
      }
    }

    return items;
  }, [sortedChatList]);

  console.log("chatList", chatListWithDateDividers);

  const renderItem = ({ item }: { item: ChatListItem }) => {
    console.log("data", item);
    if (item.type === "date") {
      return <DateDivider date={item.data.date} />;
    }

    return <ChatMessage item={item.data} />;
  };

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const scrollViewRef = useRef<FlatList<ChatListItem>>(null);

  return (
    <FlatList
      data={chatListWithDateDividers}
      renderItem={renderItem}
      keyExtractor={(item) => item.data.id}
      onTouchStart={handlePress}
      inverted
      style={{
        paddingHorizontal: 16,
        width: "100%",
        flex: 1,
      }}
      contentContainerStyle={{
        gap: 10,
        flexGrow: 1,
      }}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.7}
      ref={scrollViewRef}
      ListFooterComponent={<View style={{ height: 20 }} />}
      ListHeaderComponent={<View style={{ height: 20 }} />}
      automaticallyAdjustContentInsets={false}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="never"
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 80,
      }}
      automaticallyAdjustKeyboardInsets={true}
    />
  );
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1.getTime() === d2.getTime();
};
const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) {
    return "오늘";
  }
  if (isSameDay(date, yesterday)) {
    return "어제";
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

export default ChatList;
