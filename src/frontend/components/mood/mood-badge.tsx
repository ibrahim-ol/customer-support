import { MoodCategory } from "../../../types/mood.ts";
import { getMoodColor, getMoodEmoji } from "../utils.tsx";

export function MoodBadge({ mood }: { mood: MoodCategory }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded cursor-default border ${getMoodColor(
        mood,
      )}`}
      title={`Mood: ${mood}`}
    >
      {getMoodEmoji(mood)}
    </span>
  );
}
