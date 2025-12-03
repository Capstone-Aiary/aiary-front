import useKeyboardResizeEffect from "@/src/shared/hooks/use-keyboard-resize-effect";
import { useLocalSearchParams } from "expo-router";
import type React from "react";
import { type ChangeEvent, useCallback, useRef, useState } from "react";
import { useSendMessage } from "../hooks/use-send-message";

function WebChatInput() {
  const { id: threadId } = useLocalSearchParams<{ id: string }>();
  const [chat, setChat] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: sendMessage } = useSendMessage(threadId);

  useKeyboardResizeEffect();

  // 높이 조절 함수 (입력 시 및 초기화 시 사용)
  const adjustHeight = useCallback(() => {
    const elem = textareaRef.current;
    if (!elem) return;

    // 1. 높이를 잠시 auto로 줄여서 지워졌을 때 줄어들게 함
    elem.style.height = "auto";

    // 2. 스크롤 높이만큼 설정하되, 최대 높이(약 3~4줄) 제한
    // 24px(line-height) * 3줄 = 72px 정도가 적당
    const maxHeight = 80;
    elem.style.height = `${Math.min(elem.scrollHeight, maxHeight)}px`;
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setChat(e.target.value);
    adjustHeight();
  };

  const handleSend = useCallback(async () => {
    const messageContent = chat.trim();
    if (!messageContent) return;

    // 전송 후 초기화
    setChat("");

    // 높이도 초기화 (React State 업데이트 후 DOM 반영을 위해 setTimeout 사용 가능하나, 보통은 바로 적용됨)
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px"; // 기본 1줄 높이로 강제 리셋
    }

    try {
      sendMessage(messageContent);
    } catch (error) {
      console.error("Message send error:", error);
    }
  }, [chat, threadId, sendMessage]);

  const styles = {
    container: {
      display: "flex",
      width: "100%",
      minHeight: 80,
      alignItems: "center", // 수직 중앙 정렬
      backgroundColor: "#FFFBF2",
      padding: "12px 20px", // 패딩을 좀 더 넉넉하게 수정
      boxSizing: "border-box",
    },
    inputContainer: {
      position: "relative",
      display: "flex",
      flex: 1,
      alignItems: "flex-end", // 텍스트가 늘어날 때 버튼은 아래에 고정되거나 중앙에 오도록 (취향따라 center로 변경 가능)
      borderRadius: "24px", // 더 둥글게
      backgroundColor: "#fff",
      padding: "12px 12px 12px 20px", // 내부 패딩 확장 (상/하/좌/우)
      boxSizing: "border-box",
      border: "1px solid #E5E5E5",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)", // 그림자 살짝 부드럽게
    },
    chatInput: {
      flex: 1,
      resize: "none",
      overflowY: "auto", // 내용 넘치면 스크롤
      backgroundColor: "transparent",
      margin: 0,
      padding: 0,
      color: "#333",
      fontSize: "16px",
      lineHeight: "24px", // 줄 간격 확보
      border: "none",
      outline: "none", // 아웃라인 제거
      fontFamily: "inherit",
      scrollbarWidth: "none",
      maxHeight: "80px", // CSS단에서도 최대 높이 제한
      height: "24px", // 초기 높이 (line-height와 맞춤)
    },
    sendButton: {
      display: "flex",
      height: 32, // 버튼 크기 살짝 조정
      width: 32,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      backgroundColor: chat.trim() ? "#F88010" : "#E0E0E0", // 입력 없으면 회색 처리 (UX 개선)
      transition: "background-color 0.2s",
      marginLeft: 12, // 간격 넓힘
      border: "none",
      cursor: "pointer",
      padding: 0,
    },
    sendIcon: {
      color: "white",
      fontSize: "14px",
      fontWeight: "600",
      marginTop: "2px", // 시각적 중앙 보정
      marginLeft: "2px",
    },
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.inputContainer as React.CSSProperties}>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={chat}
          onChange={handleChange}
          rows={1}
          placeholder="메시지를 입력하세요..."
          style={styles.chatInput as React.CSSProperties}
        />

        <button
          type="button"
          onClick={handleSend}
          style={styles.sendButton}
          aria-label="Send message"
          disabled={!chat.trim()} // 내용 없으면 클릭 방지
        >
          <div style={styles.sendIcon}>➤</div>
        </button>
      </div>
    </div>
  );
}

export default WebChatInput;
