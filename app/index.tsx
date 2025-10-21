import Navigation from "@/src/feature/home/ui/navigation";
import { useCurrentWeather } from "@/src/shared/hooks/use-current-weather";
import SharedHeader from "@/src/shared/ui/shared-header";
import {
  getWeatherColor,
  getWeatherTextColor,
} from "@/src/shared/utils/weather";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

dayjs.locale("ko");

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const todayFormat = dayjs().format("YYYY년 M월 D일 dddd");
  const lat = 36.35;
  const lon = 127.38;

  const { data, isLoading, isError, error } = useCurrentWeather(lat, lon);

  const backgroundColor = isLoading
    ? "#FFFFFF"
    : getWeatherColor(data?.description);
  const textColor = isLoading
    ? "#212121"
    : getWeatherTextColor(data?.description);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SharedHeader>
        <>
          <SharedHeader.Side>
            <SharedHeader.Menu />
          </SharedHeader.Side>
          <SharedHeader.Title title="Aiary" />
          <SharedHeader.Side>
            <SharedHeader.Setting />
          </SharedHeader.Side>
        </>
      </SharedHeader>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingCard}>
          <View style={styles.greetingHeader}>
            <Text style={styles.greetingText}>안녕하세요! 👋</Text>
            <View style={[styles.badge, { backgroundColor }]}>
              <Text style={[styles.weatherText]}>{data?.description}</Text>
            </View>
          </View>
          <Text style={styles.dateText}>{todayFormat}</Text>
          <Text style={styles.descriptionText}>
            오늘도 Aiary와 함께 소중한 하루를 기록해보세요
          </Text>
        </View>
        <Navigation />
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
  badge: {
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
  weatherText: {
    fontSize: 14,

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
