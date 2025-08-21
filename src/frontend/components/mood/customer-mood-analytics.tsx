import { ContentCard } from "../cards/content-card.tsx";
import { useMoodAnaltyics } from "./api.ts";
import { MoodAnalytics } from "./mood-analytics.tsx";

export function CustomerMoodAnalytics() {
  const moodApi = useMoodAnaltyics();
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-black mb-4">
        Customer Mood Analytics
      </h2>
      <ContentCard>
        <MoodAnalytics
          data={moodApi.data}
          isLoading={moodApi.isLoading}
          error={moodApi.error || undefined}
        />
      </ContentCard>
    </div>
  );
}
