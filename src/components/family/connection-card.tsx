"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";

interface ConnectionCardProps {
  connection: {
    id: string;
    relationship_label: string;
    status: string;
    created_at: string;
    other_user: {
      id: string;
      full_name: string | null;
    };
    is_incoming: boolean;
  };
}

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const name = connection.other_user.full_name ?? "Unknown";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleAccept() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("family_connections")
      .update({ status: "accepted" })
      .eq("id", connection.id);
    setLoading(false);
    router.refresh();
  }

  async function handleDecline() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("family_connections")
      .update({ status: "declined" })
      .eq("id", connection.id);
    setLoading(false);
    router.refresh();
  }

  async function handleRemove() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("family_connections")
      .delete()
      .eq("id", connection.id);
    setLoading(false);
    router.refresh();
  }

  return (
    <Card className="border-border/50">
      <CardContent className="flex items-center gap-4 pt-6">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 font-medium text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{name}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {connection.relationship_label}
            </Badge>
            {connection.status === "pending" && (
              <Badge variant="outline" className="text-xs">
                {connection.is_incoming ? "Wants to connect" : "Pending"}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {connection.status === "pending" && connection.is_incoming && (
            <>
              <Button
                size="sm"
                onClick={handleAccept}
                disabled={loading}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecline}
                disabled={loading}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Decline
              </Button>
            </>
          )}
          {connection.status === "accepted" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemove}
              disabled={loading}
              className="text-muted-foreground"
            >
              Remove
            </Button>
          )}
          {connection.status === "pending" && !connection.is_incoming && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemove}
              disabled={loading}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
