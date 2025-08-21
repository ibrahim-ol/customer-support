import { MoodCategory } from "../../../types/mood.ts";
import { getMoodColor, getMoodEmoji } from "../utils.tsx";

export function MoodBadge({ mood }: { mood: MoodCategory }) {
  return (
    <span
      className={`relative text-xs px-2 py-0.5 rounded cursor-default border ${getMoodColor(
        mood,
      )} group`}
    >
      {getMoodEmoji(mood)}
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        Mood: {mood}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></span>
      </span>
    </span>
  );
}
