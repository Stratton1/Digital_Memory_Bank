-- Phase 2: Family connections helper function + search improvements

-- 1. RPC to find a user by email (for family invites)
-- This function is called by the client to look up a user's profile ID by their email.
-- It uses SECURITY DEFINER so it can access auth.users (which clients can't directly query).
-- Returns the user's UUID or null if not found.
CREATE OR REPLACE FUNCTION public.find_user_by_email(lookup_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  found_id uuid;
BEGIN
  SELECT id INTO found_id
  FROM auth.users
  WHERE email = lower(lookup_email)
  LIMIT 1;

  RETURN found_id;
END;
$$;

-- Grant execute to authenticated users only
REVOKE ALL ON FUNCTION public.find_user_by_email(text) FROM public;
GRANT EXECUTE ON FUNCTION public.find_user_by_email(text) TO authenticated;

-- 2. Enable pg_trgm for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 3. Add indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON public.memories(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON public.memories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_title_trgm ON public.memories USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_memories_content_trgm ON public.memories USING gin (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name);
CREATE INDEX IF NOT EXISTS idx_memory_tags_memory_id ON public.memory_tags(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_tags_tag_id ON public.memory_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_family_connections_requester ON public.family_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_family_connections_recipient ON public.family_connections(recipient_id);
CREATE INDEX IF NOT EXISTS idx_shared_memories_shared_with ON public.shared_memories(shared_with_id);
CREATE INDEX IF NOT EXISTS idx_shared_memories_owner ON public.shared_memories(owner_id);
CREATE INDEX IF NOT EXISTS idx_prompt_responses_user ON public.prompt_responses(user_id);
