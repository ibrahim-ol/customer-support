import { MoodCategory } from "../../types/mood.ts";

export const getMoodEmoji = (mood: MoodCategory): string => {
  const emojis: Record<MoodCategory, string> = {
    happy: "😊",
    frustrated: "😤",
    confused: "😕",
    angry: "😠",
    satisfied: "😌",
    neutral: "😐",
    excited: "🤩",
    disappointed: "😞",
    curious: "🤔",
  };
  return emojis[mood];
};

export const getMoodColor = (mood: MoodCategory): string => {
  const colors: Record<MoodCategory, string> = {
    happy: "text-green-600 bg-green-50",
    frustrated: "text-orange-600 bg-orange-50",
    confused: "text-yellow-600 bg-yellow-50",
    angry: "text-red-600 bg-red-50",
    satisfied: "text-blue-600 bg-blue-50",
    neutral: "text-gray-600 bg-gray-50",
    excited: "text-purple-600 bg-purple-50",
    disappointed: "text-indigo-600 bg-indigo-50",
    curious: "text-pink-600 bg-pink-50",
  };
  return colors[mood];
};

export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case "positive":
      return "text-green-600 bg-green-50";
    case "negative":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};
