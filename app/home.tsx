import { useRouter } from "expo-router"; // Expo Router를 사용하신다면 Stack 컴포넌트 사용
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const handleSignUp = () => {
    console.log("회원가입 버튼 클릭");
    router.push("/signup");
  };

  const handleLogin = () => {
    console.log("로그인 버튼 클릭");
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/feather-icon.png")} style={styles.icon} />

      <Text style={styles.appName}>Aiary</Text>

      <Text style={styles.slogan}>AI와 함께하는 나의 하루 일기</Text>

      <View style={styles.spacer} />

      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleSignUp}>
        <Text style={styles.primaryButtonText}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleLogin}>
        <Text style={styles.secondaryButtonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  icon: {
    width: 80,
    marginTop: 140,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },

  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  slogan: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 50,
  },
  spacer: {
    flex: 1,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#6A5ACD",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#E0E0E0",
    marginBottom: 40,
  },
  secondaryButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
});
