import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Chat } from "../../types/chat";
import { formatToAmPm } from "../../utils/time";
import ChatBalloon from "./chat-balloon";

interface ChatMessageProps {
  item: Chat;
}

function ChatMessage({ item }: ChatMessageProps) {
  const isAI = item.role !== "user";
  const isMe = item.role === "user";
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isMe ? "row-reverse" : "row",
        },
      ]}
    >
      {isAI && (
        <View style={styles.aiAvatar}>
          <Text style={styles.aiAvatarText}>🤖</Text>
        </View>
      )}
      <View
        style={[
          styles.balloonContainer,
          { alignItems: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        <ChatBalloon isMe={isMe ?? false} message={item.content} />
        <View
          style={[
            styles.infoContainer,
            { flexDirection: isMe ? "row-reverse" : "row" },
          ]}
        >
          <Text style={styles.time}>{formatToAmPm(item.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
    alignItems: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#00D9D4",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  aiAvatarText: {
    fontSize: 18,
  },
  balloonContainer: {
    gap: 4,
    flex: 1,
  },
  time: {
    color: "#B5B5B5",
    fontSize: 11,
    lineHeight: 16,
  },
  infoContainer: {
    gap: 4,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default ChatMessage;
