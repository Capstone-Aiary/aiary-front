import { useSignUp } from "@/src/feature/auth/hooks/auth";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  // 입력 값 상태
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState(""); // UI상 '유저이름'
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 에러 메시지 상태 관리
  const [errors, setErrors] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { mutate: signUp, isPending } = useSignUp();

  // 유효성 검사 함수
  const validate = () => {
    let isValid = true;
    const newErrors = {
      nickname: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요.";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "유저이름을 입력해주세요.";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = () => {
    if (!validate()) return;

    signUp(
      { nickname, user_name: email, password },
      {
        onSuccess: () => {
          alert("회원가입 성공\n\n환영합니다!");
          router.replace("/login");
        },
        onError: (error) => {
          alert("회원가입 실패" + (error?.message ? `\n\n${error.message}` : ""));
        },
      }
    );
  };

  const handleGoToLogin = () => {
    router.replace("/login");
  };

  const handleChange = (field: keyof typeof errors, value: string, setter: (val: string) => void) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topCircle} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>당신의 이야기를 시작하세요</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={[styles.input, errors.nickname ? styles.inputError : null]}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor="#aaa"
              value={nickname}
              onChangeText={(text) => handleChange("nickname", text, setNickname)}
              autoCapitalize="none"
            />
            {errors.nickname ? <Text style={styles.errorText}>{errors.nickname}</Text> : null}

            <Text style={styles.label}>유저이름</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="유저이름을 입력해주세요"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={(text) => handleChange("email", text, setEmail)}
              autoCapitalize="none"
              // keyboardType="email-address" // 유저이름이 이메일 형식이 아니라면 제거 가능
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            {/* 비밀번호 필드 */}
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={(text) => handleChange("password", text, setPassword)}
              secureTextEntry
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              placeholder="비밀번호를 다시 입력해주세요"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text, setConfirmPassword)}
              secureTextEntry
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp} disabled={isPending}>
              <Text style={styles.primaryButtonText}>{isPending ? "처리중..." : "시작하기"}</Text>
            </TouchableOpacity>

            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
              <TouchableOpacity onPress={handleGoToLogin}>
                <Text style={styles.loginLink}>로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF2",
  },
  topCircle: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#FFF5E0",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#eee",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#F88010",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    shadowColor: "#F88010",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginPrompt: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9EB",
    paddingVertical: 20,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  loginText: {
    fontSize: 15,
    color: "#666",
    marginRight: 6,
  },
  loginLink: {
    fontSize: 15,
    color: "#F88010",
    fontWeight: "bold",
  },
});
