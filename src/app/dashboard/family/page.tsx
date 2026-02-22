import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { InviteForm } from "@/components/family/invite-form";
import { ConnectionCard } from "@/components/family/connection-card";

export default async function FamilyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch connections where I am the requester
  const { data: sentConnections } = await supabase
    .from("family_connections")
    .select(`
      id,
      relationship_label,
      status,
      created_at,
      recipient:profiles!family_connections_recipient_id_fkey (
        id,
        full_name
      )
    `)
    .eq("requester_id", user.id)
    .neq("status", "declined")
    .order("created_at", { ascending: false });

  // Fetch connections where I am the recipient
  const { data: receivedConnections } = await supabase
    .from("family_connections")
    .select(`
      id,
      relationship_label,
      status,
      created_at,
      requester:profiles!family_connections_requester_id_fkey (
        id,
        full_name
      )
    `)
    .eq("recipient_id", user.id)
    .neq("status", "declined")
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connections = [
    ...(sentConnections ?? []).map((c) => ({
      id: c.id,
      relationship_label: c.relationship_label,
      status: c.status,
      created_at: c.created_at,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      other_user: c.recipient as any as { id: string; full_name: string | null },
      is_incoming: false,
    })),
    ...(receivedConnections ?? []).map((c) => ({
      id: c.id,
      relationship_label: c.relationship_label,
      status: c.status,
      created_at: c.created_at,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      other_user: c.requester as any as { id: string; full_name: string | null },
      is_incoming: true,
    })),
  ];

  const pendingIncoming = connections.filter(
    (c) => c.status === "pending" && c.is_incoming
  );
  const accepted = connections.filter((c) => c.status === "accepted");
  const pendingOutgoing = connections.filter(
    (c) => c.status === "pending" && !c.is_incoming
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-3xl font-bold">Family connections</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Connect with family members to share your memories
        </p>
      </div>

      {/* Invite form */}
      <InviteForm />

      {/* Pending incoming requests */}
      {pendingIncoming.length > 0 && (
        <div>
          <h2 className="mb-3 font-serif text-xl font-semibold">
            Connection requests
          </h2>
          <div className="space-y-3">
            {pendingIncoming.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        </div>
      )}

      {/* Accepted connections */}
      {accepted.length > 0 && (
        <div>
          <h2 className="mb-3 font-serif text-xl font-semibold">
            Your connections ({accepted.length})
          </h2>
          <div className="space-y-3">
            {accepted.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        </div>
      )}

      {/* Pending outgoing */}
      {pendingOutgoing.length > 0 && (
        <div>
          <h2 className="mb-3 font-serif text-xl font-semibold text-muted-foreground">
            Pending requests
          </h2>
          <div className="space-y-3">
            {pendingOutgoing.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {connections.length === 0 && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-serif text-lg font-medium text-muted-foreground">
              No connections yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
              Invite a family member using the form above. Once they accept,
              you&apos;ll be able to share memories with each other.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
