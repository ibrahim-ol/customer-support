export const MOOD_ENUM = [
  "happy",
  "frustrated",
  "confused",
  "angry",
  "satisfied",
  "neutral",
  "excited",
  "disappointed",
  "curious",
] as const;

export type MoodCategory = (typeof MOOD_ENUM)[number];

// Sentiment breakdown
export const positiveMoods: MoodCategory[] = ["happy", "satisfied", "excited"];
export const negativeMoods: MoodCategory[] = [
  "angry",
  "frustrated",
  "disappointed",
];
export const neutralMoods: MoodCategory[] = ["neutral", "confused", "curious"];
