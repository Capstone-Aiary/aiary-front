import { useGetDiary } from "@/src/feature/diary/hooks/use-diary";
import SharedHeader from "@/src/shared/ui/shared-header";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DiaryDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data } = useGetDiary(id);
  console.log(data);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SharedHeader>
        <>
          <SharedHeader.Side>
            <SharedHeader.Menu />
          </SharedHeader.Side>
          <SharedHeader.Title title="일기" />
          <SharedHeader.Side>
            <SharedHeader.Setting />
          </SharedHeader.Side>
        </>
      </SharedHeader>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>오늘 하루의 소중한 기록</Text>

        <View style={styles.diaryCard}>
          <Text style={styles.diaryText}>{data?.content}</Text>

          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{data?.summary}"</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonIcon}>+</Text>
          <Text style={styles.primaryButtonText}>새 채팅 시작하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonIcon}>☰</Text>
          <Text style={styles.secondaryButtonText}>일기 목록 보기</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  },
  homeIcon: {
    fontSize: 24,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  diaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  diaryText: {
    fontSize: 15,
    lineHeight: 26,
    color: "#333",
    marginBottom: 20,
    fontWeight: "400",
  },
  quoteContainer: {
    backgroundColor: "#F0F4FF",
    borderLeftWidth: 4,
    borderLeftColor: "#5B5FED",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#5B5FED",
    fontWeight: "500",
    fontStyle: "italic",
  },
  primaryButton: {
    backgroundColor: "#5B5FED",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#5B5FED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginRight: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#00CEC8",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00CEC8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DiaryDetailScreen;
