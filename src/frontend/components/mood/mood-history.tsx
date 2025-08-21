import { MoodCategory } from "../../../types/mood.ts";
import { getMoodColor, getMoodEmoji, getMoodScore } from "../utils.tsx";

interface MoodHistoryEntry {
  id: string;
  mood: MoodCategory;
  messageId: string | null;
  createdAt: string;
}

interface MoodHistoryData {
  conversationId: string;
  currentMood: MoodCategory | null;
  moodHistory: MoodHistoryEntry[];
  totalEntries: number;
  moodChanged: boolean;
}

interface MoodHistoryProps {
  data: MoodHistoryData;
  isLoading?: boolean;
  error?: string;
}

export function MoodHistory({ data, isLoading, error }: MoodHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="text-red-600">Error loading mood history: {error}</div>
      </div>
    );
  }

  if (!data || data.totalEntries === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">😐</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No mood history available
        </h3>
        <p className="text-gray-600">
          Mood tracking will appear here as the conversation progresses
        </p>
      </div>
    );
  }

  const getMoodTrendIcon = (
    currentMood: MoodCategory,
    previousMood?: MoodCategory,
  ): string => {
    if (!previousMood) return "";

    const scoreDiff = getMoodScore(currentMood) - getMoodScore(previousMood);
    if (scoreDiff > 0) return "📈";
    if (scoreDiff < 0) return "📉";
    return "➡️";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      {data.currentMood && (
        <div
          className={`p-4 rounded-lg border ${getMoodColor(data.currentMood)}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getMoodEmoji(data.currentMood)}</div>
              <div>
                <h3 className="font-semibold text-lg">Current Mood</h3>
                <p className="text-sm capitalize font-medium">
                  {data.currentMood}
                </p>
              </div>
            </div>
            {data.moodChanged && (
              <div className="text-sm font-medium px-2 py-1 bg-white bg-opacity-50 rounded">
                Recently Changed
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mood Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mood Timeline</h3>
          <span className="text-sm text-gray-500">
            {data.totalEntries} mood{" "}
            {data.totalEntries === 1 ? "entry" : "entries"}
          </span>
        </div>

        <div className="space-y-3">
          {data.moodHistory.map((entry, index) => {
            const previousEntry = data.moodHistory[index + 1];
            const trendIcon = getMoodTrendIcon(entry.mood, previousEntry?.mood);

            return (
              <div
                key={entry.id}
                className="flex items-start space-x-3 relative"
              >
                {/* Timeline line */}
                {index < data.moodHistory.length - 1 && (
                  <div className="absolute left-4 top-10 w-0.5 h-8 bg-gray-200"></div>
                )}

                {/* Mood indicator */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${getMoodColor(entry.mood)} relative z-10`}
                >
                  <span className="text-sm">{getMoodEmoji(entry.mood)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium capitalize ${getMoodColor(entry.mood).split(" ")[0]}`}
                      >
                        {entry.mood}
                      </span>
                      {trendIcon && (
                        <span className="text-xs" title="Mood trend">
                          {trendIcon}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>

                  {entry.messageId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Triggered by message interaction
                    </p>
                  )}

                  {index === 0 && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      Most recent
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {data.totalEntries}
              </div>
              <div className="text-xs text-gray-500">Total Changes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {data.moodHistory.length > 0
                  ? Math.round(
                      (data.moodHistory.length / data.totalEntries) * 100,
                    )
                  : 0}
                %
              </div>
              <div className="text-xs text-gray-500">Variability</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {
                  data.moodHistory.filter((entry) =>
                    ["happy", "satisfied", "excited"].includes(entry.mood),
                  ).length
                }
              </div>
              <div className="text-xs text-gray-500">Positive</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {
                  data.moodHistory.filter((entry) =>
                    ["angry", "frustrated", "disappointed"].includes(
                      entry.mood,
                    ),
                  ).length
                }
              </div>
              <div className="text-xs text-gray-500">Negative</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
