import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDailyPrompt } from "@/lib/db/prompts";
import { DailyPromptCard } from "@/components/prompts/daily-prompt-card";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export default async function PromptsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const prompt = await getDailyPrompt(user?.id);

  // Get count of answered prompts
  const { count: answeredCount } = await supabase
    .from("prompt_responses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id ?? "");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-slate-800">
          Daily Reflections
        </h1>
        <p className="text-muted-foreground text-lg">
          A new question every day to help you document your story.
        </p>
      </div>

      <DailyPromptCard prompt={prompt} />

      {(answeredCount ?? 0) > 0 && (
        <div className="text-center">
          <Link href="/dashboard/prompts/history">
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              <History className="h-4 w-4" />
              View your {answeredCount} past reflections
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
