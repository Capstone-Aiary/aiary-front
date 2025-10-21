import SharedHeader from "@/src/shared/ui/shared-header";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useCreateDiary } from "../hooks/use-create-diary";
import ChatHeaderActions from "./chat-header-actions";
function ChatRoomHeader() {
  const todayFormat = dayjs().format("오늘은 M월 D일입니다 ✨");
  const mutation = useCreateDiary();
  const { id } = useLocalSearchParams<{ id: string }>();
  const handleSubmitDiary = () => {
    if (!id) {
      return;
    }
    mutation.mutate({ threadId: id, title: "오늘의 일기", mood: "무난함" });
  };
  return (
    <>
      <SharedHeader>
        <>
          <SharedHeader.Side>
            <SharedHeader.Back />
          </SharedHeader.Side>
          <SharedHeader.Title title="채팅" />
          <SharedHeader.Side>
            <SharedHeader.Setting />
          </SharedHeader.Side>
        </>
      </SharedHeader>

      <ChatHeaderActions date={todayFormat} onCreateDiary={handleSubmitDiary} />
    </>
  );
}

export default ChatRoomHeader;
