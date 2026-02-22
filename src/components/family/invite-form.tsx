'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { sendConnectionRequest } from "@/app/dashboard/family/actions";

export function InviteForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Step 1: Client-side validataion
      if (!email.includes('@')) {
        toast.error("Please enter a valid email address.");
        return;
      }

      // Step 2: Call Server Action
      const result = await sendConnectionRequest(email);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success) {
        toast.success("Invitation sent successfully!");
        setEmail('');
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg">
      <Input
        type="email"
        placeholder="Enter family member's email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1"
      />
      <Button type="submit" disabled={loading} className="gap-2">
        <UserPlus className="h-4 w-4" />
        {loading ? 'Sending...' : 'Invite'}
      </Button>
    </form>
  );
}
