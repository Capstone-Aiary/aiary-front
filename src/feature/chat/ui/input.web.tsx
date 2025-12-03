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

  // 높이 조절 함수
  const adjustHeight = useCallback(() => {
    const elem = textareaRef.current;
    if (!elem) return;

    elem.style.height = "auto";
    const maxHeight = 100;
    elem.style.height = `${Math.min(elem.scrollHeight, maxHeight)}px`;
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setChat(e.target.value);
    adjustHeight();
  };

  const handleSend = useCallback(async () => {
    const messageContent = chat.trim();
    if (!messageContent) return;

    setChat("");

    // 전송 후 높이 초기화 (기본 높이로 돌아가게 설정)
    if (textareaRef.current) {
      // 패딩이 포함된 초기 높이로 설정 (lineHeight 24px + paddingY 24px = 48px)
      // 혹은 'auto'로 두면 placeholder 높이에 맞춰짐
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
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
      alignItems: "center",
      backgroundColor: "#FFFBF2",
      padding: "10px 16px",
      boxSizing: "border-box",
    },
    inputContainer: {
      position: "relative",
      display: "flex",
      flex: 1,
      alignItems: "center",
      borderRadius: "30px",
      backgroundColor: "#fff",
      // 컨테이너 패딩은 최소화 (버튼과의 간격 정도만)
      padding: "6px 8px 6px 6px",
      boxSizing: "border-box",
      border: "1px solid #E5E5E5",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    },
    chatInput: {
      flex: 1,
      resize: "none",
      overflowY: "auto",
      backgroundColor: "transparent",
      margin: 0,
      color: "#333",
      fontSize: "16px",
      lineHeight: "24px",
      border: "none",
      outline: "none",
      fontFamily: "inherit",
      scrollbarWidth: "none",
      boxSizing: "border-box",
      padding: "12px 0px 12px 16px",
      maxHeight: "100px",
    },
    sendButton: {
      display: "flex",
      height: 36,
      width: 36,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      backgroundColor: chat.trim() ? "#F88010" : "#E0E0E0",
      transition: "background-color 0.2s",
      marginLeft: 8, // 인풋과의 간격
      border: "none",
      cursor: "pointer",
      padding: 0,
    },
    sendIcon: {
      color: "white",
      fontSize: "15px",
      fontWeight: "600",
      marginLeft: "2px",
      marginTop: "1px",
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
          disabled={!chat.trim()}
        >
          <div style={styles.sendIcon}>➤</div>
        </button>
      </div>
    </div>
  );
}

export default WebChatInput;
