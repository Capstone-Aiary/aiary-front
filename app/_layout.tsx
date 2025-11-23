import apiClient from "@/src/shared/api/axios";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";
const queryClient = new QueryClient();

const fetchUserInfo = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) return null;

  try {
    const { data } = await apiClient.get("/user/me");

    return data;
  } catch (error) {
    console.log("세션 만료됨");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments(); // 현재 URL 경로 파악용

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login" || segments[0] === "signup" || segments[0] === "index";

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/home");
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />

        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="diary/index" options={{ headerShown: false }} />
        <Stack.Screen name="diary/[id]" options={{ headerShown: false }} />

        <Stack.Screen name="setting" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
