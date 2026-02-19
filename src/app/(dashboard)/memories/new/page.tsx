"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { memorySchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Globe, Lock, Plus, X } from "lucide-react";
import Link from "next/link";

export default function NewMemoryPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const tag = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (tag && !tags.includes(tag) && tags.length < 20) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      memoryDate: (formData.get("memoryDate") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      isPrivate,
      tags,
    };

    const result = memorySchema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to create a memory.");
      setLoading(false);
      return;
    }

    // Create the memory
    const { data: memory, error: memoryError } = await supabase
      .from("memories")
      .insert({
        user_id: user.id,
        title: data.title,
        content: data.content,
        memory_date: data.memoryDate || null,
        location: data.location || null,
        is_private: data.isPrivate,
      })
      .select("id")
      .single();

    if (memoryError) {
      setError(memoryError.message);
      setLoading(false);
      return;
    }

    // Handle tags
    if (tags.length > 0 && memory) {
      for (const tagName of tags) {
        // Upsert tag
        let { data: existingTag } = await supabase
          .from("tags")
          .select("id")
          .eq("name", tagName)
          .single();

        if (!existingTag) {
          const { data: newTag } = await supabase
            .from("tags")
            .insert({ name: tagName })
            .select("id")
            .single();
          existingTag = newTag;
        }

        if (existingTag) {
          await supabase.from("memory_tags").insert({
            memory_id: memory.id,
            tag_id: existingTag.id,
          });

        }
      }
    }

    router.push(`/dashboard/memories/${memory.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard/memories"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to memories
        </Link>
        <h1 className="font-serif text-3xl font-bold">New memory</h1>
        <p className="mt-1 text-muted-foreground">
          Capture a moment worth remembering
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="sr-only">Create a memory</CardTitle>
          <CardDescription className="sr-only">
            Fill in the details of your memory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Give your memory a title..."
                required
                className="font-serif text-lg"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Your memory</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Tell the story... What happened? How did it feel? Who was there?"
                required
                rows={8}
                className="resize-y"
              />
            </div>

            {/* Date and location row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="memoryDate">When did this happen?</Label>
                <Input
                  id="memoryDate"
                  name="memoryDate"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Where?</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., London, UK"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag and press Enter..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pl-2"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="flex items-center gap-3">
                {isPrivate ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Globe className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {isPrivate ? "Private" : "Visible to connections"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPrivate
                      ? "Only you can see this memory"
                      : "Family connections can view this memory"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPrivate(!isPrivate)}
              >
                {isPrivate ? "Make visible" : "Make private"}
              </Button>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Save memory"}
              </Button>
              <Link href="/dashboard/memories">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
