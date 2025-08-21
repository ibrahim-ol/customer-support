import { MoodAnalyticsData } from "../../../types/responses.ts";
import { useFetch } from "../../hooks/useApi.ts";

export function useMoodAnaltyics() {
  const moodApi = useFetch<MoodAnalyticsResponse>(
    "/admin/api/mood-analytics",
    true,
  );
  return {
    ...moodApi,
    data: moodApi.data?.data,
  };
}

interface MoodAnalyticsResponse {
  success: boolean;
  data: MoodAnalyticsData;
}
