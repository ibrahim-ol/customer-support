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
