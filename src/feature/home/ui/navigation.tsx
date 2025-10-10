import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function Navigation() {
  const router = useRouter();
  return NAVIGATION_LIST.map((item, index) => (
    <Pressable
      onPress={() => router.push(item.path)}
      style={styles.featureCard}
    >
      <View style={[styles.iconContainer, styles[item.background]]}>
        <Text style={styles.featureIcon}>{item.icon}</Text>
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
        <Text style={styles.actionLink}>{item.actionLink}</Text>
      </View>
    </Pressable>
  ));
}

const styles = StyleSheet.create({
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  purpleBackground: {
    backgroundColor: "#7C5CFF",
  },
  cyanBackground: {
    backgroundColor: "#00C9CC",
  },
  lavenderBackground: {
    backgroundColor: "#A78BFA",
  },
  pinkBackground: {
    backgroundColor: "#F472B6",
  },
  featureIcon: {
    fontSize: 28,
  },
  featureContent: {
    flex: 1,
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: "#999",
    lineHeight: 18,
    marginBottom: 8,
  },
  actionLink: {
    fontSize: 14,
    color: "#5B7FFF",
    fontWeight: "600",
  },
});

export default Navigation;

const NAVIGATION_LIST = [
  {
    path: "/chat",
    icon: "💬",
    title: "Aiary - 채팅 시작하기",
    description: "오늘의 날씨와 날짜를 반영으로 AI와 함께 일기를 작성해보세요",
    actionLink: "시작하기 →",
    background: "purpleBackground",
  },
  {
    path: "/",
    icon: "📄",
    title: "Aiary - 일기 목록",
    description: "이전에 작성한 일기 항목들을 확인하고 관리해보세요",
    actionLink: "보러가기 →",
    background: "cyanBackground",
  },
  {
    path: "/",
    icon: "📋",
    title: "Aiary - 추가 기능",
    description: "이전에 작성한 일기 항목들을 확인하고 관리해보세요",
    actionLink: "탐색하기 →",
    background: "lavenderBackground",
  },
  {
    path: "/",
    icon: "📊",
    title: "오늘의 감정 분석",
    description:
      "일기를 통해 오늘의 감정 동향을 분석하고 인사이트를 얻어보세요",
    actionLink: "분석하기 →",
    background: "pinkBackground",
  },
] as const;
