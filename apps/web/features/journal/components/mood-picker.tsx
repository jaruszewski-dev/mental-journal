"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const MOODS = [
  { value: 1, emoji: "😞" },
  { value: 2, emoji: "😕" },
  { value: 3, emoji: "😐" },
  { value: 4, emoji: "🙂" },
  { value: 5, emoji: "😊" },
] as const;

type MoodPickerProps = {
  value?: number;
  onChange: (mood: number | undefined) => void;
};

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  const t = useTranslations("composer.mood");

  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-xs text-muted-foreground">{t("label")}</span>
      {MOODS.map(({ value: mood, emoji }) => (
        <button
          key={mood}
          type="button"
          title={t(String(mood) as "1" | "2" | "3" | "4" | "5")}
          className={cn(
            "cursor-pointer rounded-md px-1.5 py-1 text-lg transition-all",
            value === mood
              ? "scale-110 bg-accent ring-1 ring-sand"
              : "opacity-50 hover:opacity-80",
          )}
          onClick={() => onChange(value === mood ? undefined : mood)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
