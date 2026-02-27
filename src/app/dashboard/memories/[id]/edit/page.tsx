import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MemoryForm } from "@/components/memories/memory-form";
import { ArrowLeft } from "lucide-react";

export default async function EditMemoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: memory } = await supabase
    .from("memories")
    .select(`
      id, title, content, memory_date, location, is_private, user_id,
      memory_tags (
        tags (
          name
        )
      ),
      memory_media (
        storage_path,
        display_order
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!memory) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingTags = (memory.memory_tags as any[])
    ?.map((mt) => mt.tags?.name)
    .filter(Boolean) ?? [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingPhotos = ((memory.memory_media as any[]) ?? [])
    .sort((a, b) => a.display_order - b.display_order)
    .map((m) => ({
      path: m.storage_path,
      url: supabase.storage.from("memory-photos").getPublicUrl(m.storage_path).data.publicUrl,
    }));

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/dashboard/memories/${id}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to memory
      </Link>

      <MemoryForm
        mode="edit"
        memoryId={memory.id}
        initialData={{
          title: memory.title,
          content: memory.content ?? "",
          memory_date: memory.memory_date ?? new Date().toISOString().split("T")[0],
          location: memory.location ?? "",
          is_private: memory.is_private ?? true,
          tags: existingTags,
          photos: existingPhotos,
        }}
      />
    </div>
  );
}
