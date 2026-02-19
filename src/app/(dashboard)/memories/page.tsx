import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MapPin, Plus } from "lucide-react";

export default async function MemoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch all memories with their tags
  const { data: memories } = await supabase
    .from("memories")
    .select(`
      id,
      title,
      content,
      memory_date,
      location,
      is_private,
      created_at,
      memory_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Your memories</h1>
          <p className="mt-1 text-muted-foreground">
            {memories?.length ?? 0} memories preserved
          </p>
        </div>
        <Link href="/dashboard/memories/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New memory
          </Button>
        </Link>
      </div>

      {memories && memories.length > 0 ? (
        <div className="space-y-4">
          {memories.map((memory) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tags = (memory.memory_tags as any[])
              ?.map((mt) => mt.tags)
              .filter(Boolean) ?? [];

            return (
              <Link
                key={memory.id}
                href={`/dashboard/memories/${memory.id}`}
              >
                <Card className="border-border/50 transition-colors hover:bg-card/80">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-lg font-semibold">
                          {memory.title}
                        </h3>
                        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                          {memory.content.slice(0, 250)}
                          {memory.content.length > 250 ? "..." : ""}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {memory.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {memory.location}
                            </span>
                          )}
                          {tags.map((tag: { id: string; name: string }) => (
                            <Badge
                              key={tag.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              #{tag.name}
                            </Badge>
                          ))}
                        </div>
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
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-serif text-lg font-medium text-muted-foreground">
              No memories yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
              Every family has a story worth telling. Start with a single moment
              — your first memory, a favourite holiday, or something that made
              you laugh today.
            </p>
            <Link href="/dashboard/memories/new" className="mt-6">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create your first memory
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
