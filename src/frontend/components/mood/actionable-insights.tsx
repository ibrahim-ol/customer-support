import { type MoodAnalyticsData } from "../../../types/responses.ts";

export function ActionableInsights({
  data,
  borderType,
}: {
  data: MoodAnalyticsData;
  borderType: "light" | "heavy";
}) {
  const totalSentiment =
    data.sentimentBreakdown.positive +
    data.sentimentBreakdown.negative +
    data.sentimentBreakdown.neutral;

  return (
    <div
      className={[
        "bg-white p-6 border ",
        borderType === "light" ? "border-gray-200 rounded-lg " : "border-black",
      ].join(" ")}
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Actionable Insights
      </h3>
      <div className="space-y-3">
        {/* High Priority Issues */}
        {data.sentimentBreakdown.negative >
          data.sentimentBreakdown.positive && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-lg">⚠️</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">
                  High Negative Sentiment Detected
                </h4>
                <p className="text-sm text-red-700">
                  {Math.round(
                    (data.sentimentBreakdown.negative / totalSentiment) * 100,
                  )}
                  % of interactions show negative sentiment. Consider reviewing
                  escalation procedures and agent training.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Angry Customers Alert */}
        {data.overallMoodDistribution.angry > 0 && (
          <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-orange-400 text-lg">😠</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-orange-800">
                  Angry Customers Need Attention
                </h4>
                <p className="text-sm text-orange-700">
                  {data.overallMoodDistribution.angry} customers expressed
                  anger. Review these conversations for potential escalation or
                  service recovery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Declining Trends */}
        {data.moodTrends.declining > data.moodTrends.improving && (
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-lg">📉</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">
                  Mood Declining in Conversations
                </h4>
                <p className="text-sm text-yellow-700">
                  {data.moodTrends.declining} conversations show declining mood
                  trends. Review conversation flows and response quality.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Positive Feedback */}
        {data.sentimentBreakdown.positive > data.sentimentBreakdown.negative &&
          data.moodTrends.improving > data.moodTrends.declining && (
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-400 text-lg">✅</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">
                    Strong Performance Indicators
                  </h4>
                  <p className="text-sm text-green-700">
                    Positive sentiment leads negative by{" "}
                    {Math.abs(
                      data.sentimentBreakdown.positive -
                        data.sentimentBreakdown.negative,
                    )}{" "}
                    interactions, and {data.moodTrends.improving} conversations
                    show improving mood trends.
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* No Critical Issues */}
        {data.overallMoodDistribution.angry === 0 &&
          data.sentimentBreakdown.negative <=
            data.sentimentBreakdown.positive &&
          data.moodTrends.declining <= data.moodTrends.improving && (
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400 text-lg">👍</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    No Critical Issues Detected
                  </h4>
                  <p className="text-sm text-blue-700">
                    Customer mood indicators are within healthy ranges. Continue
                    monitoring for trends.
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
