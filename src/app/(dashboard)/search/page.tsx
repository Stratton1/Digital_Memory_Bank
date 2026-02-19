import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search } from "lucide-react";
import { SearchForm } from "@/components/search/search-form";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let memories: {
    id: string;
    title: string;
    content: string;
    memory_date: string | null;
    location: string | null;
    created_at: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    memory_tags: any[];
  }[] = [];

  if (query) {
    // Full-text search using Postgres text search
    const { data } = await supabase
      .from("memories")
      .select(`
        id,
        title,
        content,
        memory_date,
        location,
        created_at,
        memory_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq("user_id", user.id)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,location.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(50);

    memories = data ?? [];

    // Also search by tag name — find matching tags, then find memories with those tags
    const { data: tagMatches } = await supabase
      .from("tags")
      .select("id")
      .ilike("name", `%${query}%`);

    if (tagMatches && tagMatches.length > 0) {
      const tagIds = tagMatches.map((t) => t.id);
      const { data: taggedMemoryIds } = await supabase
        .from("memory_tags")
        .select("memory_id")
        .in("tag_id", tagIds);

      if (taggedMemoryIds && taggedMemoryIds.length > 0) {
        const existingIds = new Set(memories.map((m) => m.id));
        const newIds = taggedMemoryIds
          .map((tm) => tm.memory_id)
          .filter((id) => !existingIds.has(id));

        if (newIds.length > 0) {
          const { data: taggedMemories } = await supabase
            .from("memories")
            .select(`
              id,
              title,
              content,
              memory_date,
              location,
              created_at,
              memory_tags (
                tags (
                  id,
                  name
                )
              )
            `)
            .eq("user_id", user.id)
            .in("id", newIds)
            .order("created_at", { ascending: false });

          if (taggedMemories) {
            memories = [...memories, ...taggedMemories];
          }
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-3xl font-bold">Search memories</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Find memories by title, content, location, or tag
        </p>
      </div>

      <SearchForm initialQuery={query} />

      {query && (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {memories.length} {memories.length === 1 ? "result" : "results"} for
            &ldquo;{query}&rdquo;
          </p>
          {memories.length > 0 ? (
            <div className="space-y-3">
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
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {memory.content.slice(0, 250)}
                              {memory.content.length > 250 ? "..." : ""}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              {memory.location && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {memory.location}
                                </span>
                              )}
                              {tags.map(
                                (tag: { id: string; name: string }) => (
                                  <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    #{tag.name}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                          <time className="ml-4 shrink-0 text-xs text-muted-foreground">
                            {new Date(
                              memory.memory_date ?? memory.created_at
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
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
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <h3 className="font-medium text-muted-foreground">
                  No memories found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  Try different search terms or check your spelling
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
