import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.homeIcon}>🏠</Text>
          <Text style={styles.headerText}>Home</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingCard}>
          <View style={styles.greetingHeader}>
            <Text style={styles.greetingText}>안녕하세요! 👋</Text>
            <View style={styles.sunnyBadge}>
              <Text style={styles.sunnyIcon}>☀️</Text>
              <Text style={styles.sunnyText}>맑음</Text>
            </View>
          </View>
          <Text style={styles.dateText}>2025년 9월 15일 월요일</Text>
          <Text style={styles.descriptionText}>
            오늘도 Aiary와 함께 소중한 하루를 기록해보세요
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/chat")}
          style={styles.featureCard}
        >
          <View style={[styles.iconContainer, styles.purpleBackground]}>
            <Text style={styles.featureIcon}>💬</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Aiary - 채팅 시작하기</Text>
            <Text style={styles.featureDescription}>
              오늘의 날씨와 날짜를 반영으로 AI와 함께 일기를 작성해보세요
            </Text>
            <Text style={styles.actionLink}>시작하기 →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard}>
          <View style={[styles.iconContainer, styles.cyanBackground]}>
            <Text style={styles.featureIcon}>📄</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Aiary - 일기 목록</Text>
            <Text style={styles.featureDescription}>
              이전에 작성한 일기 항목들을 확인하고 관리해보세요
            </Text>
            <Text style={styles.actionLink}>보러가기 →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard}>
          <View style={[styles.iconContainer, styles.lavenderBackground]}>
            <Text style={styles.featureIcon}>📋</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Aiary - 추가 기능</Text>
            <Text style={styles.featureDescription}>
              Aiary의 확장된 기능들을 탐색하고 활용해보세요
            </Text>
            <Text style={styles.actionLink}>탐색하기 →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard}>
          <View style={[styles.iconContainer, styles.pinkBackground]}>
            <Text style={styles.featureIcon}>📊</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>오늘의 감정 분석</Text>
            <Text style={styles.featureDescription}>
              일기를 통해 오늘의 감정 동향을 분석하고 인사이트를 얻어보세요
            </Text>
            <Text style={styles.actionLink}>분석하기 →</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkIcon}>✓</Text>
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>작성한 일기</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.fireIcon}>🔥</Text>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>연속 기록</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  homeIcon: {
    fontSize: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  greetingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  greetingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "700",
  },
  sunnyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  sunnyIcon: {
    fontSize: 16,
  },
  sunnyText: {
    fontSize: 14,
    color: "#F57C00",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
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
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
  },
  checkmark: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkIcon: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "700",
  },
  fireIcon: {
    position: "absolute",
    top: 12,
    left: 12,
    fontSize: 20,
  },
});

export default HomeScreen;
