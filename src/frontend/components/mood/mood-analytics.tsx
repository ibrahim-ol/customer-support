import { MoodCategory } from "../../../types/mood.ts";
import { type MoodAnalyticsData } from "../../../types/responses.ts";
import { getMoodColor, getMoodEmoji, getSentimentColor } from "../utils.tsx";
import { ActionableInsights } from "./actionable-insights.tsx";

interface MoodAnalyticsProps {
  data: MoodAnalyticsData | null | undefined;
  isLoading?: boolean;
  error?: string;
}

export function MoodAnalytics({ data, isLoading, error }: MoodAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="text-red-600">
          Error loading mood analytics: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
        <div className="text-gray-600">No mood data available</div>
      </div>
    );
  }

  const totalSentiment =
    data.sentimentBreakdown.positive +
    data.sentimentBreakdown.negative +
    data.sentimentBreakdown.neutral;

  return (
    <div className="space-y-6">
      {/* Overall Sentiment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-lg border ${getSentimentColor("positive")}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Positive Sentiment</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-bold">
                  {data.sentimentBreakdown.positive}
                </p>
                <p className="ml-2 text-sm">
                  (
                  {totalSentiment > 0
                    ? Math.round(
                        (data.sentimentBreakdown.positive / totalSentiment) *
                          100,
                      )
                    : 0}
                  %)
                </p>
              </div>
            </div>
            <div className="text-2xl">🟢</div>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${getSentimentColor("negative")}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Negative Sentiment</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-bold">
                  {data.sentimentBreakdown.negative}
                </p>
                <p className="ml-2 text-sm">
                  (
                  {totalSentiment > 0
                    ? Math.round(
                        (data.sentimentBreakdown.negative / totalSentiment) *
                          100,
                      )
                    : 0}
                  %)
                </p>
              </div>
            </div>
            <div className="text-2xl">🔴</div>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${getSentimentColor("neutral")}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Neutral Sentiment</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-bold">
                  {data.sentimentBreakdown.neutral}
                </p>
                <p className="ml-2 text-sm">
                  (
                  {totalSentiment > 0
                    ? Math.round(
                        (data.sentimentBreakdown.neutral / totalSentiment) *
                          100,
                      )
                    : 0}
                  %)
                </p>
              </div>
            </div>
            <div className="text-2xl">⚫</div>
          </div>
        </div>
      </div>

      {/* Mood Trends */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Conversation Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-2xl font-bold text-green-600">
              {data.moodTrends.improving}
            </div>
            <div className="text-sm text-green-600">Improving</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl mb-2">📉</div>
            <div className="text-2xl font-bold text-red-600">
              {data.moodTrends.declining}
            </div>
            <div className="text-sm text-red-600">Declining</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">➡️</div>
            <div className="text-2xl font-bold text-gray-600">
              {data.moodTrends.stable}
            </div>
            <div className="text-sm text-gray-600">Stable</div>
          </div>
        </div>
      </div>

      {/* Current Mood Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Current Customer Moods
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(
            Object.entries(data.currentMoodDistribution) as [
              MoodCategory,
              number,
            ][]
          ).map(([mood, count]) => (
            <div
              key={mood}
              className={`p-3 rounded-lg border text-center ${getMoodColor(mood)}`}
            >
              <div className="text-xl mb-1">{getMoodEmoji(mood)}</div>
              <div className="text-lg font-bold">{count}</div>
              <div className="text-xs capitalize">{mood}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Mood Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Overall Mood Distribution
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Total entries: {data.totalMoodEntries})
          </span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(
            Object.entries(data.overallMoodDistribution) as [
              MoodCategory,
              number,
            ][]
          ).map(([mood, count]) => (
            <div
              key={mood}
              className={`p-3 rounded-lg border text-center ${getMoodColor(mood)}`}
            >
              <div className="text-xl mb-1">{getMoodEmoji(mood)}</div>
              <div className="text-lg font-bold">{count}</div>
              <div className="text-xs capitalize">{mood}</div>
              <div className="text-xs text-gray-500 mt-1">
                {data.totalMoodEntries > 0
                  ? Math.round((count / data.totalMoodEntries) * 100)
                  : 0}
                %
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Insights */}
      {data && <ActionableInsights data={data} borderType="light" />}
    </div>
  );
}
