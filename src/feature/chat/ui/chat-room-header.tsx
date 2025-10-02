import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function ChatRoomHeader() {
  const router = useRouter();
  const [isVisible, setVisible] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={[styles.container]}>
      <Pressable onPress={() => {}}>뒤로가기</Pressable>
      <Image
        source={
          "https://i.pinimg.com/736x/7b/04/b1/7b04b1f4d147f8951aa39ff976d9c209.jpg"
        }
        style={styles.profileImage}
      />
      <View style={styles.profileContainer}>
        <Text style={styles.name}>맹구</Text>
        <View style={styles.schoolContainer}></View>
      </View>
      <Pressable
        style={{
          width: 36,
          height: 36,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setVisible(true)}
      >
        <Text>메뉴 </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 68,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  profileImage: {
    width: 34,
    marginLeft: 7,
    marginRight: 10,
    height: 34,
    borderRadius: 34,
  },
  headerIcon: {
    width: 24,
    height: 24,

    tintColor: "#000",
  },
  profileContainer: {
    flex: 1,

    gap: 2,
  },
  name: {
    color: "#000",
    fontWeight: 700,
    fontFamily: "Pretendard-ExtraBold",
    fontSize: 18,
    lineHeight: 19,
  },
  school: {
    color: "#767676",
    fontSize: 13,
    lineHeight: 19,
  },
  schoolContainer: {
    flexDirection: "row",
    gap: 2,
  },
});

export default ChatRoomHeader;
