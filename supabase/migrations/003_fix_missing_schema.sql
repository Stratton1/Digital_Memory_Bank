-- ============================================================
-- Migration 003: Add missing tables, functions, policies, indexes
-- This is ADDITIVE ONLY — safe to run on an existing database.
-- ============================================================

-- 1. HELPER FUNCTION: update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- 2. Ensure handle_new_user uses COALESCE for safety
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (DROP IF EXISTS + CREATE to be idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. MEMORY MEDIA table
CREATE TABLE IF NOT EXISTS public.memory_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.memory_media ENABLE ROW LEVEL SECURITY;

-- RLS policies for memory_media (use DO block to avoid errors if they already exist)
DO $$ BEGIN
  CREATE POLICY "Users can view media for their memories"
    ON public.memory_media FOR SELECT
    USING (memory_id IN (SELECT id FROM public.memories WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can add media to their memories"
    ON public.memory_media FOR INSERT
    WITH CHECK (memory_id IN (SELECT id FROM public.memories WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete media from their memories"
    ON public.memory_media FOR DELETE
    USING (memory_id IN (SELECT id FROM public.memories WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS memory_media_memory_id_idx ON public.memory_media(memory_id);

-- 4. SHARED MEMORIES table
CREATE TABLE IF NOT EXISTS public.shared_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  shared_with_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  permission TEXT DEFAULT 'view' NOT NULL CHECK (permission IN ('view', 'comment')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT no_self_share CHECK (owner_id != shared_with_id)
);

ALTER TABLE public.shared_memories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Owners can view their shares"
    ON public.shared_memories FOR SELECT
    USING (auth.uid() = owner_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Recipients can view shares with them"
    ON public.shared_memories FOR SELECT
    USING (auth.uid() = shared_with_id AND revoked_at IS NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Owners can create shares"
    ON public.shared_memories FOR INSERT
    WITH CHECK (auth.uid() = owner_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Owners can update/revoke shares"
    ON public.shared_memories FOR UPDATE
    USING (auth.uid() = owner_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS shared_memories_owner_idx ON public.shared_memories(owner_id);
CREATE INDEX IF NOT EXISTS shared_memories_shared_with_idx ON public.shared_memories(shared_with_id);
CREATE INDEX IF NOT EXISTS shared_memories_memory_idx ON public.shared_memories(memory_id);

-- 5. Add updated_at to family_connections if missing
DO $$ BEGIN
  ALTER TABLE public.family_connections ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DROP TRIGGER IF EXISTS family_connections_updated_at ON public.family_connections;
CREATE TRIGGER family_connections_updated_at
  BEFORE UPDATE ON public.family_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6. Add updated_at triggers on tables that may be missing them
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS memories_updated_at ON public.memories;
CREATE TRIGGER memories_updated_at
  BEFORE UPDATE ON public.memories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS prompt_responses_updated_at ON public.prompt_responses;
CREATE TRIGGER prompt_responses_updated_at
  BEFORE UPDATE ON public.prompt_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 7. Cross-referencing RLS policies (for shared content viewing)
-- Allow viewing connected family members' profiles
DO $$ BEGIN
  CREATE POLICY "Users can view connected family profiles"
    ON public.profiles FOR SELECT
    USING (
      id IN (
        SELECT recipient_id FROM public.family_connections
        WHERE requester_id = auth.uid() AND status = 'accepted'
        UNION
        SELECT requester_id FROM public.family_connections
        WHERE recipient_id = auth.uid() AND status = 'accepted'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow viewing memories shared with you
DO $$ BEGIN
  CREATE POLICY "Users can view shared memories"
    ON public.memories FOR SELECT
    USING (
      id IN (
        SELECT memory_id FROM public.shared_memories
        WHERE shared_with_id = auth.uid() AND revoked_at IS NULL
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow viewing media on shared memories
DO $$ BEGIN
  CREATE POLICY "Users can view media for shared memories"
    ON public.memory_media FOR SELECT
    USING (
      memory_id IN (
        SELECT memory_id FROM public.shared_memories
        WHERE shared_with_id = auth.uid() AND revoked_at IS NULL
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow viewing tags on shared memories
DO $$ BEGIN
  CREATE POLICY "Users can view tags on shared memories"
    ON public.memory_tags FOR SELECT
    USING (
      memory_id IN (
        SELECT memory_id FROM public.shared_memories
        WHERE shared_with_id = auth.uid() AND revoked_at IS NULL
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 8. find_user_by_email RPC (for family invites)
CREATE OR REPLACE FUNCTION public.find_user_by_email(lookup_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  found_id UUID;
BEGIN
  SELECT id INTO found_id
  FROM auth.users
  WHERE email = lower(lookup_email)
  LIMIT 1;
  RETURN found_id;
END;
$$;

REVOKE ALL ON FUNCTION public.find_user_by_email(TEXT) FROM public;
GRANT EXECUTE ON FUNCTION public.find_user_by_email(TEXT) TO authenticated;

-- 9. Enable pg_trgm for fuzzy search + indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_memories_title_trgm ON public.memories USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_memories_content_trgm ON public.memories USING gin (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS memories_user_id_idx ON public.memories(user_id);
CREATE INDEX IF NOT EXISTS memories_memory_date_idx ON public.memories(memory_date);
CREATE INDEX IF NOT EXISTS memories_created_at_idx ON public.memories(created_at DESC);
CREATE INDEX IF NOT EXISTS tags_name_idx ON public.tags(name);
CREATE INDEX IF NOT EXISTS family_connections_requester_idx ON public.family_connections(requester_id);
CREATE INDEX IF NOT EXISTS family_connections_recipient_idx ON public.family_connections(recipient_id);
CREATE INDEX IF NOT EXISTS prompt_responses_user_idx ON public.prompt_responses(user_id);
CREATE INDEX IF NOT EXISTS prompt_responses_prompt_idx ON public.prompt_responses(prompt_id);

-- 10. Ensure tags has usage_count column
DO $$ BEGIN
  ALTER TABLE public.tags ADD COLUMN usage_count INTEGER DEFAULT 0 NOT NULL;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- 11. Add no_self_connection constraint to family_connections if missing
DO $$ BEGIN
  ALTER TABLE public.family_connections ADD CONSTRAINT no_self_connection CHECK (requester_id != recipient_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 12. Add status check constraint to family_connections if missing
DO $$ BEGIN
  ALTER TABLE public.family_connections ADD CONSTRAINT family_connections_status_check CHECK (status IN ('pending', 'accepted', 'declined'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
