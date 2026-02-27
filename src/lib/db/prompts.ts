import { createClient } from "@/lib/supabase/server";

/**
 * Gets today's prompt for a specific user.
 * Avoids prompts the user has already answered and uses date-based
 * seeding so the same user sees the same prompt throughout the day.
 */
export async function getDailyPrompt(userId?: string) {
  const supabase = await createClient();

  // If no userId, just return the first available prompt
  if (!userId) {
    const { data } = await supabase
      .from("daily_prompts")
      .select("*")
      .limit(1)
      .single();
    return data;
  }

  // Get IDs of prompts the user has already answered
  const { data: answeredRows } = await supabase
    .from("prompt_responses")
    .select("prompt_id")
    .eq("user_id", userId);

  const answeredIds = answeredRows?.map((r) => r.prompt_id) ?? [];

  // Fetch all unanswered prompts
  let query = supabase
    .from("daily_prompts")
    .select("*")
    .order("category")
    .order("id");

  if (answeredIds.length > 0) {
    query = query.not("id", "in", `(${answeredIds.map((id) => `"${id}"`).join(",")})`);
  }

  const { data: prompts } = await query;

  if (!prompts || prompts.length === 0) {
    // All prompts answered — wrap around and show the oldest-answered one
    const { data: oldestResponse } = await supabase
      .from("prompt_responses")
      .select("prompt_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (oldestResponse) {
      const { data } = await supabase
        .from("daily_prompts")
        .select("*")
        .eq("id", oldestResponse.prompt_id)
        .single();
      return data;
    }

    return null;
  }

  // Use a date-based seed so the prompt stays the same all day for this user
  const today = new Date().toISOString().split("T")[0];
  const seed = hashString(`${userId}-${today}`);
  const index = Math.abs(seed) % prompts.length;

  return prompts[index];
}

/** Simple string hash for deterministic daily selection. */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}
