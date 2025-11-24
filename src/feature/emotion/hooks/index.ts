import { useQuery } from "@tanstack/react-query";
import { useGetDiaries } from "../../diary/hooks/use-diary";
import { EmotionReportResponse } from "../type";
import { getEmotionReport } from "../type/api";

export const useEmotionReport = (diaryId: string) => {
  return useQuery<EmotionReportResponse | null>({
    queryKey: ["emotionReport", diaryId],
    queryFn: () => getEmotionReport(diaryId),
    enabled: !!diaryId,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

export const useRecentEmotionReport = () => {
  const { data: diaries, isLoading: isListLoading, isError: isListError } = useGetDiaries();

  const latestDiaryId = diaries && diaries.length > 0 ? diaries[0].id : null;

  const {
    data: report,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useQuery<EmotionReportResponse | null>({
    queryKey: ["emotionReport", latestDiaryId],
    queryFn: () => getEmotionReport(latestDiaryId!), // non-null assertion safe due to enabled
    enabled: !!latestDiaryId,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isListLoading || (!!latestDiaryId && isReportLoading);
  const isError = isListError || isReportError;

  return {
    report,
    latestDiaryId,
    isLoading,
    isError,
    hasDiaries: !!(diaries && diaries.length > 0),
  };
};
