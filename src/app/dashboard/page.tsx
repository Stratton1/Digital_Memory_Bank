import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, MessageCircle, Plus, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Fetch today's prompt (one the user hasn't answered yet)
  const { data: answeredPromptIds } = await supabase
    .from("prompt_responses")
    .select("prompt_id")
    .eq("user_id", user.id);

  const answered = answeredPromptIds?.map((r) => r.prompt_id) ?? [];

  let promptQuery = supabase
    .from("daily_prompts")
    .select("id, question_text, category, depth")
    .limit(1);

  if (answered.length > 0) {
    promptQuery = promptQuery.not("id", "in", `(${answered.map((id) => `"${id}"`).join(",")})`);
  }

  const { data: todaysPrompt } = await promptQuery.single();

  // Fetch recent memories
  const { data: recentMemories } = await supabase
    .from("memories")
    .select("id, title, content, memory_date, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch memory count
  const { count: memoryCount } = await supabase
    .from("memories")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Fetch response count
  const { count: responseCount } = await supabase
    .from("prompt_responses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // "On This Day" — memories from this day in previous years
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const { data: onThisDayMemories } = await supabase
    .from("memories")
    .select("id, title, memory_date")
    .eq("user_id", user.id)
    .not("memory_date", "is", null)
    .order("memory_date", { ascending: false });

  const matchingMemories = (onThisDayMemories ?? []).filter((m) => {
    if (!m.memory_date) return false;
    const d = new Date(m.memory_date);
    return d.getMonth() + 1 === month && d.getDate() === day && d.getFullYear() !== now.getFullYear();
  });

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-serif text-3xl font-bold">
          Hello, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          What would you like to remember today?
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{memoryCount ?? 0}</p>
              <p className="text-sm text-muted-foreground">Memories</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-accent/10 p-2">
              <MessageCircle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{responseCount ?? 0}</p>
              <p className="text-sm text-muted-foreground">Prompts answered</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 pt-6">
            <Link href="/dashboard/memories/new" className="w-full">
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                New memory
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* On This Day */}
      {matchingMemories.length > 0 && (
        <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              <CardTitle className="font-serif text-lg">On this day</CardTitle>
            </div>
            <CardDescription>
              {matchingMemories.length === 1
                ? "You captured a memory on this day in a previous year."
                : `You captured ${matchingMemories.length} memories on this day in previous years.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matchingMemories.slice(0, 3).map((m) => (
                <Link
                  key={m.id}
                  href={`/dashboard/memories/${m.id}`}
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-white/50 px-4 py-3 transition-colors hover:bg-amber-50/50"
                >
                  <span className="font-medium text-sm">{m.title}</span>
                  <Badge variant="outline" className="text-xs text-amber-700 border-amber-200">
                    {new Date(m.memory_date!).getFullYear()}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's prompt */}
      {todaysPrompt && (
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-lg">
                Today&apos;s question from Nexa
              </CardTitle>
            </div>
            <CardDescription>
              <Badge variant="secondary" className="mr-2 capitalize">
                {todaysPrompt.category}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {todaysPrompt.depth}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 font-serif text-xl text-foreground">
              &ldquo;{todaysPrompt.question_text}&rdquo;
            </p>
            <Link href={`/dashboard/prompts?prompt=${todaysPrompt.id}`}>
              <Button variant="default" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Answer this
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recent memories */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Recent memories</h2>
          <Link href="/dashboard/memories">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </div>
        {recentMemories && recentMemories.length > 0 ? (
          <div className="space-y-3">
            {recentMemories.map((memory) => (
              <Link
                key={memory.id}
                href={`/dashboard/memories/${memory.id}`}
              >
                <Card className="border-border/50 transition-colors hover:bg-card/80">
                  <CardContent className="flex items-start justify-between pt-6">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium">{memory.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {memory.content.slice(0, 150)}
                        {memory.content.length > 150 ? "..." : ""}
                      </p>
                    </div>
                    <time className="ml-4 shrink-0 text-xs text-muted-foreground">
                      {memory.memory_date
                        ? new Date(memory.memory_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : new Date(memory.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                    </time>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <h3 className="font-medium text-muted-foreground">
                No memories yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Start preserving your story by creating your first memory.
              </p>
              <Link href="/dashboard/memories/new" className="mt-4">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create your first memory
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
