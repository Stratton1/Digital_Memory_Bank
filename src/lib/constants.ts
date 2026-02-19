export const APP_NAME = "Memory Bank";
export const APP_DESCRIPTION =
  "A secure digital memory vault for families. Store stories, photos, and precious moments.";

export const PROMPT_CATEGORIES = [
  "childhood",
  "family",
  "milestones",
  "reflections",
  "gratitude",
  "relationships",
  "career",
  "travel",
  "traditions",
  "lessons",
] as const;

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

export const PROMPT_DEPTHS = ["light", "medium", "deep"] as const;
export type PromptDepth = (typeof PROMPT_DEPTHS)[number];

export const RELATIONSHIP_LABELS = [
  "Mother",
  "Father",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Grandmother",
  "Grandfather",
  "Grandson",
  "Granddaughter",
  "Aunt",
  "Uncle",
  "Cousin",
  "Niece",
  "Nephew",
  "Spouse",
  "Partner",
  "Friend",
  "Other",
] as const;
