"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RELATIONSHIP_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send } from "lucide-react";

export function InviteForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("Friend");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter an email address.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    // Can't invite yourself
    if (trimmedEmail === user.email) {
      setError("You can't send a connection request to yourself.");
      setLoading(false);
      return;
    }

    // Find the recipient by email in auth — we look up their profile
    // We need to find a user with this email. We'll search profiles via a lookup.
    // Since we can't query auth.users directly, we check if there's a profile
    // linked to this email by checking the user's email in a different way.
    // The simplest approach: look up the user by email from profiles perspective.
    // Actually, we need to use a different approach — look up by email in the users table
    // via an RPC or just try to match.

    // For MVP: we search for the user's profile by joining with auth.
    // Since we can't query auth.users from client, we'll use a simple approach:
    // Look up by email using Supabase's admin-free pattern.
    // We'll need to store email on profiles or use a server action.

    // Pragmatic approach: check if user exists by looking up their profile
    // We'll need the user's auth email, so let's use the profiles table.
    // Since profiles doesn't store email, we need to query differently.

    // Best MVP approach: use Supabase auth.admin would require service role.
    // Instead, we'll create the connection with just the email, and the recipient
    // can claim it when they sign up / log in. But our schema uses recipient_id (UUID).

    // Simplest correct approach: search for a user who has this email.
    // We can do this via a Supabase RPC function or by storing email on profiles.
    // For now, let's try looking up via the auth metadata approach - actually
    // the cleanest MVP path is to use an RPC.

    // Alternative: just query profiles and show an error if not found.
    // The user must already have an account. This is fine for MVP.

    // We'll use an edge function or RPC later. For now, search by email
    // using the approach of checking a view or stored email.

    // Actually, let's just do a simple lookup via Supabase RPC.
    // For MVP: the recipient must already have an account.
    // We'll call a database function that finds user ID by email.
    const { data: recipientData, error: lookupError } = await supabase
      .rpc("find_user_by_email", { lookup_email: trimmedEmail });

    if (lookupError || !recipientData) {
      setError(
        "No account found with that email. They'll need to sign up first."
      );
      setLoading(false);
      return;
    }

    const recipientId = recipientData as string;

    // Check if connection already exists
    const { data: existing } = await supabase
      .from("family_connections")
      .select("id, status")
      .or(
        `and(requester_id.eq.${user.id},recipient_id.eq.${recipientId}),and(requester_id.eq.${recipientId},recipient_id.eq.${user.id})`
      )
      .limit(1)
      .maybeSingle();

    if (existing) {
      if (existing.status === "pending") {
        setError("A connection request already exists with this person.");
      } else if (existing.status === "accepted") {
        setError("You're already connected with this person.");
      } else {
        setError("A previous request was declined. Please try again later.");
      }
      setLoading(false);
      return;
    }

    // Create connection request
    const { error: insertError } = await supabase
      .from("family_connections")
      .insert({
        requester_id: user.id,
        recipient_id: recipientId,
        relationship_label: relationship,
        status: "pending",
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess(`Connection request sent! They'll see it when they log in.`);
    setEmail("");
    setLoading(false);
    router.refresh();
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Invite a family member</CardTitle>
        <CardDescription>
          Send a connection request to someone who already has an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="invite-email">Their email address</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="family@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <select
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {RELATIONSHIP_LABELS.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="gap-2">
            <Send className="h-4 w-4" />
            {loading ? "Sending..." : "Send request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
