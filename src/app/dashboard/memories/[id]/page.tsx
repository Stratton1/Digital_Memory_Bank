import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Globe, Lock, MapPin } from "lucide-react";
import { DeleteMemoryButton } from "@/components/memories/delete-memory-button";

export default async function MemoryDetailPage({
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

  const { data: memory } = await supabase
    .from("memories")
    .select(`
      *,
      memory_tags (
        tags (
          id,
          name
        )
      ),
      memory_media (
        id,
        storage_path,
        caption,
        display_order
      )
    `)
    .eq("id", id)
    .single();

  if (!memory) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags = (memory.memory_tags as any[])
      ?.map((mt) => mt.tags)
      .filter(Boolean) ?? [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const media = ((memory.memory_media as any[]) ?? [])
    .sort((a, b) => a.display_order - b.display_order);

  const isOwner = memory.user_id === user.id;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/memories"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to memories
      </Link>

      <article>
        <header className="mb-6">
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
            <span className="flex items-center gap-1">
              {memory.is_private ? (
                <>
                  <Lock className="h-4 w-4" />
                  Private
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Visible to connections
                </>
              )}
            </span>
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

        {media.length > 0 && (
          <div className="mb-6 grid gap-3 grid-cols-2 sm:grid-cols-3">
            {media.map((item: { id: string; storage_path: string; caption?: string }) => {
              const { data: { publicUrl } } = supabase.storage
                .from("memory-photos")
                .getPublicUrl(item.storage_path);
              return (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border/50"
                >
                  <Image
                    src={publicUrl}
                    alt={item.caption ?? memory.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
              );
            })}
          </div>
        )}

        <Separator className="my-6" />

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-foreground">
              {memory.content}
            </div>
          </CardContent>
        </Card>

        {isOwner && (
          <div className="mt-6 flex gap-3">
            <Link href={`/dashboard/memories/${memory.id}/edit`}>
              <Button variant="outline">Edit memory</Button>
            </Link>
            <DeleteMemoryButton memoryId={memory.id} />
          </div>
        )}

        <p className="mt-8 text-xs text-muted-foreground">
          Created{" "}
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
