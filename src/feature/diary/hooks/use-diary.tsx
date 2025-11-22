import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as api from "../api";
import type { ApiError, CreateDiaryRequest, Diary, DiarySummary } from "../types";

const diaryKeys = {
  all: ["diaries"] as const,
  lists: () => [...diaryKeys.all, "list"] as const,
  list: (threadId: string) => [...diaryKeys.lists(), { threadId }] as const,
  details: () => [...diaryKeys.all, "detail"] as const,
  detail: (id: string) => [...diaryKeys.details(), id] as const,
};

export const useGetDiaries = () => {
  return useQuery<DiarySummary[], Error>({
    queryKey: ["diary", "list"],
    queryFn: api.getDiaryList,
  });
};

// 일기 단건 조회
export const useGetDiary = (diaryId: string) => {
  return useQuery<Diary, ApiError>({
    queryKey: diaryKeys.detail(diaryId),
    queryFn: () => api.getDiaryById(diaryId),
    enabled: !!diaryId,
  });
};

// 일기 생성
export const useCreateDiary = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<Diary, ApiError, CreateDiaryRequest>({
    mutationFn: api.createDiary,
    onSuccess: (data) => {
      router.push(`/diary/${data.diaryId}`);
    },
  });
};
