import { useLocalSearchParams } from "expo-router";
import { useMemo, useRef } from "react";
import { FlatList, Keyboard, View } from "react-native";
import { useChatEvents, useChatList } from "../hooks/use-chat";
import type { Chat } from "../types/chat";
import DateDivider from "./date-divider";
import ChatMessage from "./message/chat-message";

type ChatListItem =
  | { type: "message"; data: Chat }
  | { type: "date"; data: { date: string; id: string } };

const ChatList = () => {
  const { id: threadId } = useLocalSearchParams<{ id: string }>();
  //  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  const { data } = useChatList(threadId);
  useChatEvents(threadId);

  const chatList = data?.items ?? [];
  const sortedChatList = useMemo(
    () =>
      [...chatList]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .reverse(),
    [chatList]
  );

  const chatListWithDateDividers = useMemo(() => {
    const items: ChatListItem[] = [];
    for (let i = 0; i < sortedChatList.length; i++) {
      const currentMessage = sortedChatList[i];
      const nextMessage = sortedChatList[i + 1];
      const currentDate = new Date(currentMessage.createdAt);
      const nextDate = nextMessage ? new Date(nextMessage.createdAt) : null;

      items.push({ type: "message", data: currentMessage });

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

  const renderItem = ({ item }: { item: ChatListItem }) =>
    item.type === "date" ? (
      <DateDivider date={item.data.date} />
    ) : (
      <ChatMessage item={item.data} />
    );

  const scrollViewRef = useRef<FlatList<ChatListItem>>(null);

  return (
    <FlatList
      data={chatListWithDateDividers}
      renderItem={renderItem}
      keyExtractor={(item) => item.data.id}
      onTouchStart={() => Keyboard.dismiss()}
      inverted
      style={{ paddingHorizontal: 16, width: "100%", flex: 1 }}
      contentContainerStyle={{ gap: 12, flexGrow: 1 }}
      //onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
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
      automaticallyAdjustKeyboardInsets
    />
  );
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    ).getTime() ===
    new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime()
  );
};

const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "오늘";
  if (isSameDay(date, yesterday)) return "어제";
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const mockChatData: Chat[] = [
  {
    id: "1",
    content:
      "안녕하세요! 오늘 하루는 어떠셨나요? 무엇이든 편하게 이야기해 주세요.",
    isMe: false,
    createdAt: new Date(2025, 6, 31, 14, 30).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "2",
    content:
      "오늘 회사에서 프로젝트 발표가 있었어요. 많이 떨렸지만 잘 마무리했어요!",
    isMe: true,
    createdAt: new Date(2025, 6, 31, 14, 32).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "3",
    content:
      "와, 정말 수고하셨어요! 떨리는 마음을 잘 이겨내고 발표를 잘 마치셨다니 대단해요. 어떤 프로젝트였나요?",
    isMe: false,
    createdAt: new Date(2025, 6, 31, 14, 33).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "4",
    content:
      "새로운 UI/UX 리뉴얼 프로젝트였어요. 팀원들과 함께 3개월 동안 준비했던 거예요.",
    isMe: true,
    createdAt: new Date(2025, 6, 31, 14, 35).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "5",
    content:
      "3개월이나! 정말 긴 시간 동안 준비하셨네요. 발표 후 팀원들이나 상사분들의 반응은 어땠나요?",
    isMe: false,
    createdAt: new Date(2025, 6, 31, 14, 36).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "6",
    content:
      "다들 긍정적으로 봐주셨어요. 특히 디자인 퀄리티를 많이 칭찬해주셨어요.",
    isMe: true,
    createdAt: new Date(2025, 6, 31, 14, 38).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "7",
    content:
      "정말 뿌듯하셨겠어요! 오늘 같은 성취감을 느낀 날은 스스로에게 작은 보상을 해주는 것도 좋을 것 같아요. 😊",
    isMe: false,
    createdAt: new Date(2025, 6, 31, 14, 40).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "8",
    content: "맞아요! 저녁에 좋아하는 디저트 먹으러 가려고요 ㅎㅎ",
    isMe: true,
    createdAt: new Date(2025, 6, 31, 14, 41).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  // 어제 데이터
  {
    id: "9",
    content: "안녕하세요! 오늘은 어떤 하루를 보내셨나요?",
    isMe: false,
    createdAt: new Date(2025, 6, 30, 20, 15).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "10",
    content: "오늘은 좀 피곤했어요. 내일 발표 준비 때문에 야근했거든요.",
    isMe: true,
    createdAt: new Date(2025, 6, 30, 20, 17).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "11",
    content:
      "발표 준비로 힘드셨겠어요. 충분한 휴식도 중요하니 오늘은 푹 쉬시길 바라요!",
    isMe: false,
    createdAt: new Date(2025, 6, 30, 20, 18).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "12",
    content: "네, 감사합니다. 일찍 자려고요.",
    isMe: true,
    createdAt: new Date(2025, 6, 30, 20, 20).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  // 며칠 전 데이터
  {
    id: "13",
    content: "주말은 어떻게 보내셨어요?",
    isMe: false,
    createdAt: new Date(2025, 6, 28, 10, 0).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "14",
    content:
      "친구들이랑 캠핑 다녀왔어요! 날씨도 좋고 정말 힐링되는 시간이었어요.",
    isMe: true,
    createdAt: new Date(2025, 6, 28, 10, 2).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "15",
    content:
      "캠핑이라니 정말 좋았겠네요! 자연 속에서 보내는 시간은 언제나 특별하죠. 어디로 가셨나요?",
    isMe: false,
    createdAt: new Date(2025, 6, 28, 10, 3).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
  {
    id: "16",
    content: "강원도 쪽으로 갔어요. 밤하늘 별도 정말 많이 보였어요!",
    isMe: true,
    createdAt: new Date(2025, 6, 28, 10, 5).toISOString(),
    threadId: "",
    senderId: "",
    senderName: "",
  },
];

export const getMockChatsByThreadId = (threadId: string): Chat[] => {
  return mockChatData;
};

export const addMockChat = (chat: Chat): void => {
  mockChatData.unshift(chat);
};

export default ChatList;
