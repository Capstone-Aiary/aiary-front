import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface ChatBalloonProps {
  message: string;
  isMe: boolean;
}

function ChatBalloon({ message, isMe }: ChatBalloonProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isMe ? "#5B5FED" : "#fff",
          borderTopRightRadius: isMe ? 4 : 18,
          borderTopLeftRadius: !isMe ? 4 : 18,
        },
      ]}
    >
      <Text style={[styles.messageText, { color: isMe ? "#fff" : "#000" }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "70%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  messageText: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
  },
});

export default ChatBalloon;
