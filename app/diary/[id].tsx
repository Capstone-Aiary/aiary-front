import SharedHeader from "@/src/shared/ui/shared-header";
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
          <Text style={styles.diaryText}>
            오늘은 정말 특별한 하루였다. 아침에 일어나서 창문을 열었을 때 들어온
            신선한 공기가 하루의 시작을 알렸다. 커피 한 잔과 함께 시작한 아침은
            평온했고, 마음속 깊은 곳에서부터 감사함이 올라왔다.
          </Text>

          <Text style={styles.diaryText}>
            오후에는 오랜만에 친구와 만나 이야기를 나눴다. 서로의 근황을
            공유하며 웃고, 때로는 진지한 대화도 나눴다. 시간이 어떻게 흘렀는지
            모를 정도로 즐거웠다. 이런 순간 들이 삶을 더욱 풍요롭게 만드는 것을
            새삼 느꼈다.
          </Text>

          <Text style={styles.diaryText}>
            저녁에는 혼자만의 시간을 가지며 책을 읽었다. 책 속의 문장들이 마음에
            깊이 와닿 았고, 새로운 관점을 얻을 수 있었다. 하루 를 마무리하며
            오늘 경험한 모든 것들에 대해 생각해보니, 작은 일상 속에서도 많은
            의미를 찾을 수 있다는 것을 깨달았다.
          </Text>

          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>
              "평범한 하루였지만, 그 속에서 찾은 작은 행복들이 나를 더욱
              성장시켜주었다."
            </Text>
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
