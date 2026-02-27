-- ============================================================
-- MEMORY BANK: FULL FAMILY TEST SEED
-- ============================================================
-- This script sets up a 3-generation family with partners and siblings.
-- Password for all users: 'password123'

-- Ensure pgcrypto is available for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 0. CLEANUP
-- Remove existing users with these emails to prevent unique constraint violations
-- We explicitly delete profiles first to ensure the 'on_auth_user_created' trigger 
-- doesn't fail due to duplicate keys if the cascade didn't work perfectly.
DELETE FROM public.profiles WHERE id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555',
    '66666666-6666-6666-6666-666666666666',
    '77777777-7777-7777-7777-777777777777'
);

-- This cascades to profiles, memories, etc.
DELETE FROM auth.users WHERE email IN (
    'grandpa@example.com', 'grandma@example.com',
    'mom@example.com', 'dad@example.com', 'uncle@example.com', 'aunt@example.com',
    'kid@example.com'
);

-- 1. USERS (Auth)
-- We use explicit columns for everything to ensure Supabase Auth (GoTrue) accepts the record.
-- instance_id is crucial for some setups.

-- GENERATION 1
-- Grandpa Joe (The Patriarch)
INSERT INTO auth.users (instance_id, id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, is_super_admin)
VALUES ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'grandpa@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Grandpa Joe"}', 'authenticated', 'authenticated', now(), now(), '', '', '', false);

-- Grandma Mary (The Matriarch)
INSERT INTO auth.users (instance_id, id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, is_super_admin)
VALUES ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'grandma@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Grandma Mary"}', 'authenticated', 'authenticated', now(), now(), '', '', '', false);

-- GENERATION 2
-- Sarah Parent (Daughter of Joe & Mary)
INSERT INTO auth.users (instance_id, id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, is_super_admin)
VALUES ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'mom@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sarah Parent"}', 'authenticated', 'authenticated', now(), now(), '', '', '', false);

-- Mike Partner (Husband of Sarah)
INSERT INTO auth.users (instance_id, id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, is_super_admin)
VALUES ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'dad@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mike Partner"}', 'authenticated', 'authenticated', now(), now(), '', '', '', false);

-- Uncle Bob (Son of Joe & Mary, Sibling to Sarah)
INSERT INTO auth.users (instance_id, id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, is_super_admin)
VALUES ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'uncle@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Uncle Bob"}', 'authenticated', 'authenticated', now(), now(), '', '', '', false);

-- Aunt Lisa (Daughter of Joe & Mary, Sibling to Sarah)
INSERT INTO auth.users (instance_id, id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, is_super_admin)
VALUES ('00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'aunt@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Aunt Lisa"}', 'authenticated', 'authenticated', now(), now(), '', '', '', false);

-- GENERATION 3
-- Timmy Child (Son of Sarah & Mike)
INSERT INTO auth.users (instance_id, id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, is_super_admin)
VALUES ('00000000-0000-0000-0000-000000000000', '77777777-7777-7777-7777-777777777777', 'kid@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Timmy Child"}', 'authenticated', 'authenticated', now(), now(), '', '', '', false);


-- 2. PROFILES
-- Ensure profiles exist (triggers usually handle this, but we force update to ensure data is correct)
INSERT INTO public.profiles (id, full_name, bio, date_of_birth) VALUES
('11111111-1111-1111-1111-111111111111', 'Grandpa Joe', 'I love telling stories about the old days.', '1950-01-01'),
('22222222-2222-2222-2222-222222222222', 'Grandma Mary', 'Keeper of the family recipes.', '1952-05-12'),
('33333333-3333-3333-3333-333333333333', 'Sarah Parent', 'Busy mom, love gardening.', '1980-03-15'),
('44444444-4444-4444-4444-444444444444', 'Mike Partner', 'Football fan and grill master.', '1979-08-22'),
('55555555-5555-5555-5555-555555555555', 'Uncle Bob', 'The fun uncle. Always traveling.', '1982-11-30'),
('66666666-6666-6666-6666-666666666666', 'Aunt Lisa', 'Artist and cat lover.', '1985-02-14'),
('77777777-7777-7777-7777-777777777777', 'Timmy Child', 'I like dinosaurs!', '2015-06-01')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, bio = EXCLUDED.bio;


-- 3. FAMILY CONNECTIONS
-- We establish a web of connections. Note: Connections are directional in our schema, 
-- but usually we query them bidirectionally. We'll insert one direction as 'accepted'.

-- Grandpa's Connections
INSERT INTO public.family_connections (requester_id, recipient_id, relationship_label, status) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Wife', 'accepted'), -- to Grandma
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Daughter', 'accepted'), -- to Sarah
('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Son', 'accepted'), -- to Bob
('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'Daughter', 'accepted'), -- to Lisa
('11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 'Grandson', 'accepted') -- to Timmy
ON CONFLICT DO NOTHING;

-- Grandma's Connections (Mirroring Grandpa mostly)
INSERT INTO public.family_connections (requester_id, recipient_id, relationship_label, status) VALUES
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Daughter', 'accepted'),
('22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'Grandson', 'accepted')
ON CONFLICT DO NOTHING;

-- Sarah's Connections (The central node)
INSERT INTO public.family_connections (requester_id, recipient_id, relationship_label, status) VALUES
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Husband', 'accepted'), -- to Mike
('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Brother', 'accepted'), -- to Bob
('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'Sister', 'accepted'), -- to Lisa
('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Son', 'accepted') -- to Timmy
ON CONFLICT DO NOTHING;

-- Mike's Connections
INSERT INTO public.family_connections (requester_id, recipient_id, relationship_label, status) VALUES
('44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'Son', 'accepted')
ON CONFLICT DO NOTHING;


-- 4. SAMPLE MEMORIES
-- Grandpa's Memory
INSERT INTO public.memories (id, user_id, title, content, memory_date, is_private) VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Meeting Grandma', 'It was at the county fair in 1970. She was eating cotton candy.', '1970-07-15', false)
ON CONFLICT DO NOTHING;

-- Sarah's Memory
INSERT INTO public.memories (id, user_id, title, content, memory_date, is_private) VALUES
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Timmy''s First Steps', 'He walked across the living room rug today!', '2016-06-20', false)
ON CONFLICT DO NOTHING;

-- Uncle Bob's Memory (Private)
INSERT INTO public.memories (id, user_id, title, content, memory_date, is_private) VALUES
(gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 'Backpacking Europe', 'The time I got lost in Rome.', '2005-05-10', true)
ON CONFLICT DO NOTHING;