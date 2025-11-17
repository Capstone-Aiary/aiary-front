// app/login.tsx
import { useLogin } from "@/src/feature/auth/hooks/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending } = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("입력 오류", "사용자 이름과 비밀번호를 입력하세요.");
      return;
    }

    login(
      { user_name: email, password },
      {
        onSuccess: (data) => {
          Alert.alert("로그인 성공", "Aiary에 오신 것을 환영합니다!");
          router.replace("/");
        },
        onError: (error) => {
          Alert.alert("로그인 실패", error.message || "사용자 이름 또는 비밀번호를 확인해주세요.");
        },
      }
    );
  };

  const handleGoToSignUp = () => {
    router.push("/signup");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="feather" size={50} color="#6A5ACD" />
        </View>

        <Text style={styles.title}>Aiary에 다시 오신 것을 환영합니다</Text>
        <Text style={styles.subtitle}>당신의 하루를 기록하고 감정을 분석해보세요.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>사용자 이름</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="사용자 이름을 입력하세요"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleLogin} disabled={isPending}>
            <Text style={styles.primaryButtonText}>로그인</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupPrompt}>
          <Text style={styles.signupText}>계정이 없으신가요?</Text>
          <TouchableOpacity onPress={handleGoToSignUp}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    width: "100%",
    textAlign: "left",
    fontSize: 15,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#6A5ACD",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupPrompt: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 15,
    color: "#666",
    marginRight: 5,
  },
  signupLink: {
    fontSize: 15,
    color: "#6A5ACD",
    fontWeight: "bold",
  },
});
