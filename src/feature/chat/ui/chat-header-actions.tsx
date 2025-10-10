import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatHeaderActionsProps {
  date?: string;
  onNewChat?: () => void;
  onCreateDiary?: () => void;
}

const ChatHeaderActions = ({
  date = "오늘은 10월 11일입니다 ✨",
  onNewChat,
  onCreateDiary,
}: ChatHeaderActionsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createDiaryButton}
          onPress={onCreateDiary}
        >
          <Text style={styles.createDiaryIcon}>📄</Text>
          <Text style={styles.createDiaryText}>종료 후 일기 생성</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  dateText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  newChatButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#00CEC8",
    backgroundColor: "#FFFFFF",
  },
  newChatIcon: {
    fontSize: 18,
    color: "#00CEC8",
    fontWeight: "600",
    marginRight: 6,
  },
  newChatText: {
    fontSize: 14,
    color: "#00CEC8",
    fontWeight: "600",
  },
  createDiaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#5B5FED",
    shadowColor: "#5B5FED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createDiaryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  createDiaryText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default ChatHeaderActions;
