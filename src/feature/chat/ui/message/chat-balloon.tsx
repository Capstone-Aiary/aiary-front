import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface ChatBalloonProps {
  message: string;
  isMe: boolean;
}

function ChatBalloon({
  message,

  isMe,
}: ChatBalloonProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isMe ? "#7A4AE1" : "#fff",
          borderTopRightRadius: isMe ? 6 : 18,
          borderTopLeftRadius: !isMe ? 6 : 18,
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },

      android: {
        elevation: 3,
      },
    }),
  },
  messageText: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 21,
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 12,
  },
  loadingContainer: {
    width: 240,
    height: 240,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#9A93AA",
    fontWeight: "400",
  },
  imageContainer: {
    position: "relative",
  },
  uploadIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  uploadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  errorIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  errorText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ChatBalloon;
