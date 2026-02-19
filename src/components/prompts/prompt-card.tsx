"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Send, SkipForward, Sparkles } from "lucide-react";

interface PromptCardProps {
  prompt: {
    id: string;
    question_text: string;
    category: string;
    depth: string;
  };
}

export function PromptCard({ prompt }: PromptCardProps) {
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveAsMemory, setSaveAsMemory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!response.trim()) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    let memoryId: string | null = null;

    // Optionally save as a memory first
    if (saveAsMemory) {
      const { data: memory, error: memoryError } = await supabase
        .from("memories")
        .insert({
          user_id: user.id,
          title: prompt.question_text,
          content: response,
          is_private: true,
        })
        .select("id")
        .single();

      if (memoryError) {
        setError(memoryError.message);
        setLoading(false);
        return;
      }
      memoryId = memory?.id ?? null;
    }

    // Save the prompt response
    const { error: responseError } = await supabase
      .from("prompt_responses")
      .insert({
        user_id: user.id,
        prompt_id: prompt.id,
        response_text: response,
        converted_to_memory_id: memoryId,
      });

    if (responseError) {
      setError(responseError.message);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  async function handleSkip() {
    // We simply refresh to get a different prompt
    // In practice, we'd track skipped prompts, but for MVP just refresh
    router.refresh();
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="font-serif text-lg">Nexa asks...</CardTitle>
        </div>
        <CardDescription>
          <Badge variant="secondary" className="mr-2 capitalize">
            {prompt.category}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {prompt.depth}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-serif text-2xl leading-relaxed text-foreground">
          &ldquo;{prompt.question_text}&rdquo;
        </p>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Take your time... there's no wrong answer."
          rows={5}
          className="resize-y bg-background"
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!response.trim() || loading}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {loading ? "Saving..." : "Submit"}
          </Button>

          <Button
            variant={saveAsMemory ? "default" : "outline"}
            size="sm"
            onClick={() => setSaveAsMemory(!saveAsMemory)}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            {saveAsMemory ? "Will save as memory" : "Also save as memory?"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="ml-auto gap-2 text-muted-foreground"
          >
            <SkipForward className="h-4 w-4" />
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
