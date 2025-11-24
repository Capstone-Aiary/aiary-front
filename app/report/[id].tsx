import { useEmotionReportData } from "@/src/feature/emotion/hooks";
import { EmotionScores } from "@/src/feature/emotion/type";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

const EMOTION_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  joy: { label: "기쁨", color: "#FFB74D", icon: "happy" },
  calm: { label: "평온함", color: "#4DB6AC", icon: "tranquility" },
  tiredness: { label: "피로", color: "#90A4AE", icon: "tired" },
  anxiety: { label: "불안", color: "#B39DDB", icon: "anxiety" },
  sadness: { label: "슬픔", color: "#64B5F6", icon: "sad" },
  anger: { label: "분노", color: "#E57373", icon: "angry" },
};

const EmotionCard = ({ type, value }: { type: string; value: number }) => {
  const config = EMOTION_CONFIG[type] || { label: type, color: "#ccc", icon: "❓" };
  const percentage = Math.round(value * 100);

  return (
    <View style={styles.smallCard}>
      <View style={styles.iconCircle}>
        <Text style={{ fontSize: 24 }}>{config.icon}</Text>
      </View>
      <Text style={styles.cardLabel}>{config.label}</Text>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: config.color }]} />
      </View>
      <Text style={[styles.percentageText, { color: config.color }]}>{percentage}%</Text>
    </View>
  );
};

const ReportScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { report, isLoading, hasDiaries, isError } = useEmotionReportData(id);
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFB74D" />
      </View>
    );
  }

  if (!hasDiaries) {
    return (
      <View style={styles.center}>
        <Text>작성된 일기가 없습니다.</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>데이터를 불러오는데 실패했습니다.</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>분석 중입니다 ⏳</Text>
        <Text style={styles.subText}>AI가 일기의 감정을 분석하고 있어요.</Text>
        <Text style={styles.subText}>잠시 후 다시 확인해주세요.</Text>
      </View>
    );
  }

  const { emotions, dominantEmotion, overallMoodScore, recommendation, createdAt } = report;
  const domConfig = EMOTION_CONFIG[dominantEmotion] || EMOTION_CONFIG["calm"];
  const dateStr = new Date(createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>감정 리포트</Text>
        <Text style={styles.headerDate}>{dateStr}</Text>
      </View>

      <View style={styles.scoreCard}>
        <View style={[styles.scoreCircle, { borderColor: domConfig.color }]}>
          <Text style={styles.scoreText}>{Math.round(overallMoodScore * 100)}</Text>
        </View>
        <Text style={styles.scoreTitle}>오늘의 종합 기분</Text>
        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationText}>{recommendation}</Text>
        </View>
      </View>

      <View style={[styles.mainCard, { backgroundColor: "#E0F7FA" }]}>
        <View style={{ marginBottom: 10 }}>
          <Image
            source={require(`@/assets/images/${domConfig.icon}.png`)}
            style={{ width: 64, height: 64, overflow: "hidden", borderRadius: 32 }}
          />
        </View>
        <Text style={styles.mainCardTitle}>가장 강한 감정</Text>
        <Text style={[styles.mainCardEmotion, { color: domConfig.color }]}>{domConfig.label}</Text>

        <View style={styles.progressBarBgLarge}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.round(emotions[dominantEmotion as keyof EmotionScores] * 100)}%`,
                backgroundColor: domConfig.color,
              },
            ]}
          />
        </View>
        <Text style={styles.percentageTextLarge}>
          {Math.round(emotions[dominantEmotion as keyof EmotionScores] * 100)}%
        </Text>
      </View>

      <View style={styles.gridContainer}>
        {Object.keys(emotions).map((key) => (
          <EmotionCard key={key} type={key} value={emotions[key as keyof EmotionScores]} />
        ))}
      </View>

      <View style={styles.insightCard}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>💡</Text>
          <Text style={styles.insightTitle}>오늘의 인사이트</Text>
        </View>
        <Text style={styles.insightText}>• {recommendation}</Text>
        <Text style={styles.insightText}>• {domConfig.label}이(가) 가장 두드러진 하루였습니다.</Text>
        {overallMoodScore > 0.7 && <Text style={styles.insightText}>• 긍정적인 에너지가 충만한 상태입니다!</Text>}
        {emotions.tiredness > 0.5 && <Text style={styles.insightText}>• 피로도가 높으니 휴식을 취해보세요.</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F0",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9F0",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerDate: {
    fontSize: 14,
    color: "#E57373",
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  recommendationBox: {
    backgroundColor: "#FFF3E0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: "100%",
  },
  recommendationText: {
    color: "#F57C00",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  mainCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  mainCardTitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  mainCardEmotion: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressBarBgLarge: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 4,
    marginBottom: 5,
  },
  percentageTextLarge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  smallCard: {
    width: (SCREEN_WIDTH - 50) / 2,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  progressBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  insightCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  insightText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    lineHeight: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  subText: { fontSize: 14, color: "#888" },
});

export default ReportScreen;
