import { useGetDiary } from "@/src/feature/diary/hooks/use-diary";
import SharedHeader from "@/src/shared/ui/shared-header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const DiaryDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data } = useGetDiary(id);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "2024년 11월 17일";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SharedHeader>
        <SharedHeader.Side>
          <SharedHeader.Back />
        </SharedHeader.Side>
        <SharedHeader.Title title="오늘의 일기" subtitle={formatDate(data?.createdAt)} />
        <SharedHeader.Side>
          <></>
        </SharedHeader.Side>
      </SharedHeader>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="feather" size={20} color="#F88010" />
            <Text style={styles.cardTitle}>{data?.title || "좋은 일이 있었던 하루"}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.bodyText}>
            {data?.content ||
              "오늘은 정말 특별한 하루였다. 아침부터 기분이 좋았는데, 그 이유를 곰곰히 생각해보니 어제 밤 친구와 나눈 따뜻한 대화 때문인 것 같다.\n\n점심시간에는 오랫동안 보지 못했던 선배를 우연히 만났다. 반가운 마음에 함께 커피를 마시며 근황을 나눴는데, 서로의 변화된 모습을 보며 시간의 흐름을 느꼈다."}
          </Text>

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              {data?.summary ||
                "이런 소소하지만 소중한 순간들이 모여서 행복한 하루를 만드는구나. 감사한 마음으로 오늘을 마무리한다."}
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF2",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#F4F1EB",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    minHeight: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 28,
    color: "#4B5563",
    fontWeight: "400",
    marginBottom: 30,
  },
  summaryContainer: {
    marginTop: "auto",
    paddingTop: 20,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#D97706",
    fontWeight: "500",
  },
});

export default DiaryDetailScreen;
