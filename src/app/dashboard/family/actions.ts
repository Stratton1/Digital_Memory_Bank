'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendConnectionRequest(email: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  
  if (normalizedEmail === user.email?.toLowerCase()) {
    return { error: 'You cannot invite yourself' };
  }

  // 1. Find the user by email (using our secure RPC function)
  const { data: recipientId, error: lookupError } = await supabase.rpc('find_user_by_email', {
    lookup_email: normalizedEmail
  });

  if (lookupError || !recipientId) {
    return { error: 'User not found. They must have a Memory Bank account.' };
  }

  // 2. Check for existing connection
  const { data: existing } = await supabase
    .from('family_connections')
    .select('id, status')
    .or(`and(requester_id.eq.${user.id},recipient_id.eq.${recipientId}),and(requester_id.eq.${recipientId},recipient_id.eq.${user.id})`)
    .single();

  if (existing) {
    if (existing.status === 'pending') return { error: 'Connection request already pending' };
    if (existing.status === 'accepted') return { error: 'You are already connected' };
  }

  // 3. Create request
  const { error: insertError } = await supabase
    .from('family_connections')
    .insert({
      requester_id: user.id,
      recipient_id: recipientId,
      relationship_label: 'Family', // Default, can be updated later
      status: 'pending'
    });

  if (insertError) {
    console.error('Connection error:', insertError);
    return { error: 'Failed to send request' };
  }

  revalidatePath('/dashboard/family');
  return { success: true };
}

export async function updateConnectionStatus(connectionId: string, status: 'accepted' | 'declined') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  // Verify ownership (must be recipient to accept/decline)
  const { error } = await supabase
    .from('family_connections')
    .update({ status })
    .eq('id', connectionId)
    .eq('recipient_id', user.id);

  if (error) {
    return { error: 'Failed to update connection' };
  }

  revalidatePath('/dashboard/family');
  return { success: true };
}

export async function cancelRequest(connectionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  // Only requester can cancel
  const { error } = await supabase
    .from('family_connections')
    .delete()
    .eq('id', connectionId)
    .eq('requester_id', user.id)
    .eq('status', 'pending');

  if (error) {
    return { error: 'Failed to cancel request' };
  }

  revalidatePath('/dashboard/family');
  return { success: true };
}
