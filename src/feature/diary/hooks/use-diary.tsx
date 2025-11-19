import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  return useMutation<Diary, ApiError, CreateDiaryRequest>({
    mutationFn: api.createDiary,
    onSuccess: (data) => {
      // 성공 시 해당 스레드의 일기 목록 캐시를 무효화
      queryClient.invalidateQueries({
        queryKey: diaryKeys.list(data.threadId),
      });
    },
  });
};
