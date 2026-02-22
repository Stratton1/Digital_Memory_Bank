'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateConnectionStatus, cancelRequest } from "@/app/dashboard/family/actions";

interface Connection {
  id: string;
  relationship_label: string;
  status: string; // Changed from literal to string to match Supabase return
  created_at: string;
  other_user: {
    id: string;
    full_name: string | null;
  };
  is_incoming: boolean;
}

export function ConnectionCard({ connection }: { connection: Connection }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'accept' | 'decline' | 'cancel') => {
    setLoading(true);
    try {
      let result;
      if (action === 'accept') {
        result = await updateConnectionStatus(connection.id, 'accepted');
      } else if (action === 'decline') {
        result = await updateConnectionStatus(connection.id, 'declined');
      } else if (action === 'cancel') {
        result = await cancelRequest(connection.id);
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          action === 'accept' ? "Connection accepted!" :
          action === 'decline' ? "Request declined." :
          "Request cancelled."
        );
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const name = connection.other_user.full_name || 'Unknown User';
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="border-border/50 transition-all hover:bg-card/50">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium truncate">{name}</h3>
            {connection.status === 'accepted' && (
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                Connected
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {connection.relationship_label}
            {connection.status === 'pending' && (
              <span className="italic"> • {connection.is_incoming ? 'Requesting to connect' : 'Invite sent'}</span>
            )}
          </p>
        </div>

        <div className="flex gap-2">
          {connection.status === 'pending' && connection.is_incoming && (
            <>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => handleAction('accept')}
                disabled={loading}
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleAction('decline')}
                disabled={loading}
              >
                Decline
              </Button>
            </>
          )}

          {connection.status === 'pending' && !connection.is_incoming && (
            <Button 
              size="sm" 
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => handleAction('cancel')}
              disabled={loading}
            >
              Cancel
            </Button>
          )}

           {connection.status === 'accepted' && (
             <Button 
             size="sm" 
             variant="ghost"
             className="text-muted-foreground"
             disabled
           >
             Message
           </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
