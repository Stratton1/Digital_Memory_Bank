import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen,
  Lock,
  MapPin,
  Share2,
} from "lucide-react";
import { ShareMemoryButton } from "@/components/vault/share-memory-button";

export default async function VaultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch memories shared WITH me
  const { data: sharedWithMe } = await supabase
    .from("shared_memories")
    .select(`
      id,
      permission,
      created_at,
      memory:memories (
        id,
        title,
        content,
        memory_date,
        location,
        created_at
      ),
      owner:profiles!shared_memories_owner_id_fkey (
        id,
        full_name
      )
    `)
    .eq("shared_with_id", user.id)
    .is("revoked_at", null)
    .order("created_at", { ascending: false });

  // Fetch memories I've shared with others
  const { data: sharedByMe } = await supabase
    .from("shared_memories")
    .select(`
      id,
      permission,
      created_at,
      memory:memories (
        id,
        title
      ),
      shared_with:profiles!shared_memories_shared_with_id_fkey (
        id,
        full_name
      )
    `)
    .eq("owner_id", user.id)
    .is("revoked_at", null)
    .order("created_at", { ascending: false });

  // Fetch my non-private memories for sharing
  const { data: myMemories } = await supabase
    .from("memories")
    .select("id, title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch accepted connections for sharing
  const { data: sentConns } = await supabase
    .from("family_connections")
    .select("recipient:profiles!family_connections_recipient_id_fkey (id, full_name)")
    .eq("requester_id", user.id)
    .eq("status", "accepted");

  const { data: recvConns } = await supabase
    .from("family_connections")
    .select("requester:profiles!family_connections_requester_id_fkey (id, full_name)")
    .eq("recipient_id", user.id)
    .eq("status", "accepted");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connections = [
    ...(sentConns ?? []).map((c) => c.recipient as any as { id: string; full_name: string | null }),
    ...(recvConns ?? []).map((c) => c.requester as any as { id: string; full_name: string | null }),
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Share2 className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-3xl font-bold">Shared vault</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Share memories with family and see what they&apos;ve shared with you
        </p>
      </div>

      {/* Share a memory */}
      {connections.length > 0 && myMemories && myMemories.length > 0 && (
        <ShareMemoryButton
          memories={myMemories}
          connections={connections}
        />
      )}

      {connections.length === 0 && (
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              To share memories, first{" "}
              <Link href="/dashboard/family" className="font-medium underline underline-offset-4 hover:text-foreground">
                connect with family members
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      )}

      {/* Shared with me */}
      <div>
        <h2 className="mb-4 font-serif text-xl font-semibold">
          Shared with you
        </h2>
        {sharedWithMe && sharedWithMe.length > 0 ? (
          <div className="space-y-3">
            {sharedWithMe.map((share) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const memory = share.memory as any;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const owner = share.owner as any;
              if (!memory) return null;

              const ownerName = owner?.full_name ?? "Someone";
              const ownerInitials = ownerName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <Link
                  key={share.id}
                  href={`/dashboard/vault/${memory.id}`}
                >
                  <Card className="border-border/50 transition-colors hover:bg-card/80">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                            {ownerInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">
                            Shared by {ownerName}
                          </p>
                          <h3 className="mt-1 font-serif text-lg font-semibold">
                            {memory.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {memory.content?.slice(0, 200)}
                            {memory.content?.length > 200 ? "..." : ""}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            {memory.location && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {memory.location}
                              </span>
                            )}
                            <time className="text-xs text-muted-foreground">
                              {new Date(
                                memory.memory_date ?? memory.created_at
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </time>
                          </div>
                        </div>
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
              <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <h3 className="font-medium text-muted-foreground">
                No shared memories yet
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
                When family members share memories with you, they&apos;ll
                appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Shared by me */}
      {sharedByMe && sharedByMe.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif text-xl font-semibold text-muted-foreground">
            Memories you&apos;ve shared
          </h2>
          <div className="space-y-2">
            {sharedByMe.map((share) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const memory = share.memory as any;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const person = share.shared_with as any;
              if (!memory) return null;

              return (
                <div
                  key={share.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{memory.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Shared with {person?.full_name ?? "someone"}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    <Lock className="mr-1 h-3 w-3" />
                    {share.permission}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
