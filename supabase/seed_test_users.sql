-- Set up 3 Test Users (Parent, Grandparent, Child)
-- Password for all: 'password123' (You'll need to create these users manually in Auth > Users first, or use this SQL if you have superuser access)

-- IMPORTANT: Supabase Auth users are usually created via the API or Dashboard. 
-- However, we can insert into auth.users IF we have the right permissions (superuser).
-- If this fails, create users manually in the dashboard with these emails and UIDs.

-- 1. Create Identities (Simulated)
-- We will use fixed UUIDs for easy referencing.
-- Parent: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
-- Grandparent: b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22
-- Child: c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33

INSERT INTO auth.users (instance_id, id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token, recovery_token, email_change_token_new, is_super_admin)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'parent@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sarah Parent"}', now(), now(), 'authenticated', 'authenticated', '', '', '', false),
  ('00000000-0000-0000-0000-000000000000', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'grandpa@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Grandpa Joe"}', now(), now(), 'authenticated', 'authenticated', '', '', '', false),
  ('00000000-0000-0000-0000-000000000000', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'child@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Timmy Child"}', now(), now(), 'authenticated', 'authenticated', '', '', '', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Profiles (This should happen automatically via triggers, but let's ensure it)
INSERT INTO public.profiles (id, full_name, bio, date_of_birth)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sarah Parent', 'Mom of two, love gardening and history.', '1985-06-15'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Grandpa Joe', 'Retired engineer. Telling stories is my favorite hobby.', '1950-01-20'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Timmy Child', 'I like dinosaurs and space!', '2015-09-10')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 3. Create Family Connections
-- Sarah <-> Grandpa (Parent/Child relationship)
INSERT INTO public.family_connections (requester_id, recipient_id, relationship_label, status)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Father', 'accepted')
ON CONFLICT DO NOTHING;

-- Sarah <-> Timmy (Parent/Child relationship)
INSERT INTO public.family_connections (requester_id, recipient_id, relationship_label, status)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Son', 'accepted')
ON CONFLICT DO NOTHING;

-- Grandpa <-> Timmy (Grandparent/Grandchild relationship)
INSERT INTO public.family_connections (requester_id, recipient_id, relationship_label, status)
VALUES 
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Grandson', 'accepted')
ON CONFLICT DO NOTHING;

-- 4. Add some sample memories for Grandpa
INSERT INTO public.memories (id, user_id, title, content, memory_date, location, is_private)
VALUES
  (gen_random_uuid(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'The Moon Landing', 'I remember watching it on a tiny black and white TV with the whole neighborhood. It was magical.', '1969-07-20', 'Houston, TX', false),
  (gen_random_uuid(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'First Car', 'A 1965 Mustang. Cherry red. Saved up all summer for it.', '1968-06-01', 'Detroit, MI', true)
ON CONFLICT DO NOTHING;
