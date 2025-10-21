import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SharedHeaderProps {
  children: React.ReactNode;
}

function SharedHeader({ children }: SharedHeaderProps) {
  return <View style={styles.header}>{children}</View>;
}

function HeaderSide({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}

function PlaceHoder() {
  return <View style={styles.placeholder} />;
}

function BackButton() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.navigate("/")} style={styles.backButton}>
      <Text style={styles.backIcon}>←</Text>
    </Pressable>
  );
}

function SettingButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/setting")}
      style={styles.settingsButton}
    >
      <Text style={styles.settingsIcon}>⚙️</Text>
    </Pressable>
  );
}

function HeaderTitle({ title }: { title: string }) {
  return (
    <View style={styles.headerTitle}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

function MenuButton() {
  return (
    <Pressable style={styles.menuButton}>
      <Text style={styles.menuIcon}>☰</Text>
    </Pressable>
  );
}

SharedHeader.Side = HeaderSide;
SharedHeader.Menu = MenuButton;
SharedHeader.Setting = SettingButton;
SharedHeader.PlaceHoder = PlaceHoder;
SharedHeader.Back = BackButton;
SharedHeader.Title = HeaderTitle;

const styles = StyleSheet.create({
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
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: "#333",
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
  placeholder: {
    width: 40,
  },
  title: {
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
});

export default SharedHeader;
