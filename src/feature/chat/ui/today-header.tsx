import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TodayHeader = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return (
    <View style={styles.container}>
      {/* 날짜 표시 */}
      <Text style={styles.dateText}>
        오늘은 {month}월 {day}일입니다 ☀️
      </Text>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>+ 새 채팅 시작</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>종료 후 일기 생성</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  dateText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  startButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#e0f0ff",
    borderRadius: 6,
  },
  startButtonText: {
    color: "#3399ff",
    fontWeight: "500",
  },
  createButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#5c5cff",
    borderRadius: 6,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default TodayHeader;
