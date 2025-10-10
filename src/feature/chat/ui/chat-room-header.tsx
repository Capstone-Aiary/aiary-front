import SharedHeader from "@/src/shared/ui/shared-header";
import dayjs from "dayjs";
import React from "react";
import ChatHeaderActions from "./chat-header-actions";
function ChatRoomHeader() {
  const todayFormat = dayjs().format("오늘은 M월 D일입니다 ✨");
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

      <ChatHeaderActions
        date={todayFormat}
        onCreateDiary={() => console.log("일기 생성")}
      />
    </>
  );
}

export default ChatRoomHeader;
