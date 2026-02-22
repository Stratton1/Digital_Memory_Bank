import { getDailyPrompt } from "@/lib/db/prompts";
import { DailyPromptCard } from "@/components/prompts/daily-prompt-card";

export default async function PromptsPage() {
  const prompt = await getDailyPrompt();

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
    </div>
  );
}
