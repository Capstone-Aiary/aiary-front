import { useSignUp } from "@/src/feature/auth/hooks/auth";
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

export default function SignUpScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: signUp, isPending } = useSignUp();

  const handleSignUp = () => {
    if (!nickname || !email || !password || !confirmPassword) {
      Alert.alert("입력 오류", "모든 필드를 채워주세요.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("비밀번호 오류", "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    signUp(
      { nickname, user_name: email, password },
      {
        onSuccess: () => {
          Alert.alert("회원가입 성공", "환영합니다!");
          router.replace("/login");
        },
        onError: (error) => {
          Alert.alert("회원가입 실패", error.message || "다시 시도해주세요.");
        },
      }
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToLogin = () => {
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Stack.Screen
          options={{
            title: "회원가입",
            headerShown: true,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={handleGoBack} style={{ marginLeft: 10 }}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
              </TouchableOpacity>
            ),
          }}
        />

        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="account-plus" size={50} color="#6A5ACD" />
        </View>

        <Text style={styles.title}>계정 만들기</Text>
        <Text style={styles.subtitle}>새로운 계정을 만들어 시작해보세요.</Text>

        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder="사용하실 닉네임을 입력하세요"
          value={nickname}
          onChangeText={setNickname}
          autoCapitalize="none"
        />

        <Text style={styles.label}>사용자 이름 (이메일)</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { marginTop: 30 }]}
          onPress={handleSignUp}
          disabled={isPending}
        >
          <Text style={styles.primaryButtonText}>가입하기</Text>
        </TouchableOpacity>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
          <TouchableOpacity onPress={handleGoToLogin}>
            <Text style={styles.loginLink}>로그인</Text>
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
    backgroundColor: "#fff",
    padding: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    width: "100%",
    textAlign: "left",
    fontSize: 15,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
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
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginPrompt: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    color: "#666",
    marginRight: 5,
  },
  loginLink: {
    fontSize: 15,
    color: "#6A5ACD",
    fontWeight: "bold",
  },
});
