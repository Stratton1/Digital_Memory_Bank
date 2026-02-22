import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

export default async function SharedMemoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Check if this memory was shared with me
  const { data: share } = await supabase
    .from("shared_memories")
    .select(`
      id,
      permission,
      memory:memories (
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
      ),
      owner:profiles!shared_memories_owner_id_fkey (
        id,
        full_name
      )
    `)
    .eq("memory_id", id)
    .eq("shared_with_id", user.id)
    .is("revoked_at", null)
    .maybeSingle();

  if (!share) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memory = share.memory as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const owner = share.owner as any;

  if (!memory) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags = (memory.memory_tags as any[])
    ?.map((mt: { tags: { id: string; name: string } }) => mt.tags)
    .filter(Boolean) ?? [];

  const ownerName = owner?.full_name ?? "Someone";
  const ownerInitials = ownerName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/vault"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to vault
      </Link>

      <article>
        <header className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {ownerInitials}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              Shared by {ownerName}
            </p>
          </div>
          <h1 className="font-serif text-3xl font-bold leading-tight">
            {memory.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {memory.memory_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(memory.memory_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {memory.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {memory.location}
              </span>
            )}
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag: { id: string; name: string }) => (
                <Badge key={tag.id} variant="secondary">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <Separator className="my-6" />

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-foreground">
              {memory.content}
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-xs text-muted-foreground">
          Originally created{" "}
          {new Date(memory.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </article>
    </div>
  );
}
