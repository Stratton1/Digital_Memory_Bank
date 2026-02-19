"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Share2 } from "lucide-react";

interface ShareMemoryButtonProps {
  memories: { id: string; title: string }[];
  connections: { id: string; full_name: string | null }[];
}

export function ShareMemoryButton({
  memories,
  connections,
}: ShareMemoryButtonProps) {
  const router = useRouter();
  const [selectedMemory, setSelectedMemory] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleShare() {
    if (!selectedMemory || !selectedPerson) return;
    setError(null);
    setSuccess(null);
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

    // Check if already shared
    const { data: existing } = await supabase
      .from("shared_memories")
      .select("id")
      .eq("memory_id", selectedMemory)
      .eq("shared_with_id", selectedPerson)
      .is("revoked_at", null)
      .maybeSingle();

    if (existing) {
      setError("This memory is already shared with that person.");
      setLoading(false);
      return;
    }

    const { error: shareError } = await supabase
      .from("shared_memories")
      .insert({
        memory_id: selectedMemory,
        owner_id: user.id,
        shared_with_id: selectedPerson,
        permission: "view",
      });

    if (shareError) {
      setError(shareError.message);
      setLoading(false);
      return;
    }

    const memoryTitle =
      memories.find((m) => m.id === selectedMemory)?.title ?? "Memory";
    const personName =
      connections.find((c) => c.id === selectedPerson)?.full_name ?? "them";
    setSuccess(`Shared "${memoryTitle}" with ${personName}.`);
    setSelectedMemory("");
    setSelectedPerson("");
    setLoading(false);
    router.refresh();
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Share a memory</CardTitle>
        <CardDescription>
          Choose a memory and a family member to share it with
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Memory</Label>
              <select
                value={selectedMemory}
                onChange={(e) => setSelectedMemory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a memory...</option>
                {memories.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Share with</Label>
              <select
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a person...</option>
                {connections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name ?? "Unknown"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            onClick={handleShare}
            disabled={!selectedMemory || !selectedPerson || loading}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            {loading ? "Sharing..." : "Share memory"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
