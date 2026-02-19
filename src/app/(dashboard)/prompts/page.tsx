import { createClient } from "@/lib/supabase/server";
import { PromptCard } from "@/components/prompts/prompt-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default async function PromptsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch answered prompt IDs
  const { data: answeredData } = await supabase
    .from("prompt_responses")
    .select("prompt_id")
    .eq("user_id", user.id);

  const answeredIds = answeredData?.map((r) => r.prompt_id) ?? [];

  // Fetch an unanswered prompt
  let promptQuery = supabase
    .from("daily_prompts")
    .select("id, question_text, category, depth")
    .limit(1);

  if (answeredIds.length > 0) {
    promptQuery = promptQuery.not("id", "in", `(${answeredIds.join(",")})`);
  }

  const { data: currentPrompt } = await promptQuery.single();

  // Fetch recent responses
  const { data: recentResponses } = await supabase
    .from("prompt_responses")
    .select(`
      id,
      response_text,
      created_at,
      converted_to_memory_id,
      daily_prompts (
        question_text,
        category
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-3xl font-bold">Daily prompts</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Nexa has a question for you. Take a moment to reflect and share your
          story.
        </p>
      </div>

      {/* Current prompt */}
      {currentPrompt ? (
        <PromptCard prompt={currentPrompt} />
      ) : (
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="py-12 text-center">
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-primary/50" />
            <h3 className="font-serif text-lg font-medium">
              You&apos;ve answered all the prompts!
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Impressive. More prompts are being added soon.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Previous responses */}
      {recentResponses && recentResponses.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif text-xl font-semibold">
            Your previous reflections
          </h2>
          <div className="space-y-3">
            {recentResponses.map((response) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const prompt = response.daily_prompts as any;

              return (
                <Card key={response.id} className="border-border/50">
                  <CardContent className="pt-6">
                    {prompt && (
                      <div className="mb-2 flex items-center gap-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          &ldquo;{prompt.question_text}&rdquo;
                        </p>
                        <Badge
                          variant="outline"
                          className="shrink-0 capitalize"
                        >
                          {prompt.category}
                        </Badge>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-foreground">
                      {response.response_text}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <time className="text-xs text-muted-foreground">
                        {new Date(response.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </time>
                      {response.converted_to_memory_id && (
                        <Badge variant="secondary" className="text-xs">
                          Saved as memory
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
