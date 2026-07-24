import type { Category } from "@prisma/client";

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "STUDY_NOTES", label: "Study & Notes", emoji: "📚" },
  { value: "SOFTWARE_DESIGN", label: "Software & Design", emoji: "🎨" },
  { value: "AI_TOOLS", label: "AI Tools", emoji: "🤖" },
  { value: "LANGUAGE_LEARNING", label: "Language Learning", emoji: "🗣️" },
  { value: "DEVELOPER_TOOLS", label: "Developer Tools", emoji: "💻" },
  { value: "CLOUD_STORAGE", label: "Cloud & Storage", emoji: "☁️" },
  { value: "EXAM_PREP", label: "Exam Prep", emoji: "✍️" },
  { value: "WELLBEING", label: "Wellbeing", emoji: "🌿" },
];

export function categoryLabel(value: Category): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function isCategory(value: string | undefined | null): value is Category {
  return !!value && CATEGORIES.some((c) => c.value === value);
}
