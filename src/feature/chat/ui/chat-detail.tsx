import { useLocalSearchParams } from "expo-router";
import type React from "react";
import { Platform, View } from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatList from "./chat-list";
import ChatRoomHeader from "./chat-room-header";
import DateDivider from "./date-divider";
import ChatInput from "./input";

function ChatDetail() {
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const date = `${year}년 ${month}월 ${day}일`;
  const keyboard = useAnimatedKeyboard();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          Platform.OS === "android"
            ? 0
            : -keyboard.height.value + insets.bottom - 10,
      },
    ],
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        width: "100%",
        paddingBottom: insets.bottom + 14,
      }}
    >
      <ChatRoomHeader />
      <Animated.View
        style={[
          {
            flex: 1,
            width: "100%",
            backgroundColor: "#FAFAFA",
            alignContent: "center",
            justifyContent: "center",
          },
          animatedStyles,
        ]}
      >
        <>
          <View style={{ height: 15 }} />
          <DateDivider date={date} />
        </>
        <ChatList />

        <ChatInput />
      </Animated.View>
    </View>
  );
}

export default ChatDetail;
