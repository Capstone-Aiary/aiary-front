import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "../api";
import type {
  ApiError,
  CreateDiaryRequest,
  Diary,
  PaginatedResponse,
} from "../types";

const diaryKeys = {
  all: ["diaries"] as const,
  lists: () => [...diaryKeys.all, "list"] as const,
  list: (threadId: string) => [...diaryKeys.lists(), { threadId }] as const,
  details: () => [...diaryKeys.all, "detail"] as const,
  detail: (id: string) => [...diaryKeys.details(), id] as const,
};

// 특정 스레드의 일기 목록 조회 (무한 스크롤)
export const useGetDiaries = (threadId: string) => {
  return useInfiniteQuery<
    PaginatedResponse<Diary>,
    Error,
    PaginatedResponse<Diary>,
    ReturnType<typeof diaryKeys.list>,
    string | null
  >({
    queryKey: diaryKeys.list(threadId),
    queryFn: ({ pageParam = null }) =>
      api.getDiaries({ threadId, cursor: pageParam ?? null }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.cursor,
    enabled: !!threadId,
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
