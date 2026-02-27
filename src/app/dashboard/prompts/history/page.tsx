import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default async function PromptHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: responses } = await supabase
    .from("prompt_responses")
    .select(`
      id,
      response_text,
      created_at,
      daily_prompts (
        question_text,
        category
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/prompts"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to today&apos;s prompt
          </Link>
          <h1 className="font-serif text-3xl font-bold">Your reflections</h1>
          <p className="mt-1 text-muted-foreground">
            {responses?.length ?? 0} prompts answered
          </p>
        </div>
      </div>

      {responses && responses.length > 0 ? (
        <div className="space-y-4">
          {responses.map((response) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const prompt = response.daily_prompts as any;
            return (
              <Card key={response.id} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-amber-600">
                      {prompt?.category ?? "Prompt"}
                    </span>
                    <time className="text-xs text-muted-foreground">
                      {new Date(response.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <p className="font-serif text-lg font-medium text-foreground">
                    &ldquo;{prompt?.question_text ?? "Unknown prompt"}&rdquo;
                  </p>
                  <div className="mt-3 rounded-lg bg-amber-50/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {response.response_text}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageCircle className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-serif text-lg font-medium text-muted-foreground">
              No reflections yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
              Answer your first daily prompt to start building your collection of reflections.
            </p>
            <Link href="/dashboard/prompts" className="mt-6">
              <Button className="gap-2">
                <MessageCircle className="h-4 w-4" />
                See today&apos;s prompt
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
