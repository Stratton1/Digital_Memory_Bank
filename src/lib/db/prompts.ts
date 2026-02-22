import { createClient } from "@/lib/supabase/server";

export async function getDailyPrompt() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_prompts")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching daily prompt:", error);
    return null;
  }

  return data;
}
