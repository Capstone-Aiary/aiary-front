import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { chatApi } from "../services/chat-api";
import { chatSSEService } from "../services/chatSSEService";
import { Chat } from "../types/chat";

function ChatInput() {
  const { id: threadId } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const [chat, setChat] = useState("");
  const keyboard = useAnimatedKeyboard();

  const animatedKeyboardStyles = useAnimatedStyle(() => ({
    paddingBottom:
      Platform.OS === "android" && keyboard.height.value > 0 ? 16 : 0,
  }));

  const handleSend = useCallback(async () => {
    const messageContent = chat.trim();
    if (!messageContent) return;
    setChat("");
    const optimisticMessage: Chat = {
      id: `temp-${Date.now()}`,
      threadId: threadId,
      content: messageContent,
      createdAt: new Date().toISOString(),
      senderName: "Me",
      senderId: "my-user-id",
      role: "user",
    };
    try {
      const newMessage = await chatApi.sendMessage(threadId, messageContent);

      chatSSEService.broadcast(threadId, optimisticMessage);
    } catch (error) {
      console.error("Message send error:", error);
      chatSSEService.broadcast(threadId, {
        ...optimisticMessage,
        id: `error-${optimisticMessage.id}`,
        isError: true,
      });
    }
  }, [chat, threadId]);

  return (
    <Animated.View
      style={[styles.container, { width }, animatedKeyboardStyles]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          value={chat}
          onChangeText={setChat}
          style={styles.textInput}
          placeholder="오늘 하루는 어땠나요?"
          placeholderTextColor="#B5B5B5"
          numberOfLines={3}
        />
        <Pressable onPress={handleSend} style={styles.send}>
          <Text style={styles.sendIcon}>➤</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,
    alignItems: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  inputContainer: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    paddingHorizontal: 4,
    ...(Platform.OS === "android"
      ? { textAlignVertical: "center" }
      : { paddingVertical: 8 }),
    color: "#000",
  },
  send: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#00CEC8",
    marginLeft: 8,
  },
  sendIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ChatInput;
