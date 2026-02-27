# Project Summary

- **Status**: Enhancement Phase 1 (Critical Gaps) — In Progress
- **Build**: Passing (Next.js 16.1.6, Turbopack)
- **Tests**: Passing (Vitest)
- **Deployment**: Vercel (auto-deploy from `main`)
- **Database**: Supabase (`chysractptwlqapoxaes`)
- **Last Commit**: `6ffc5ac` (2026-02-26)

## Features Implemented

### Core (Phases 1-3)
- Authentication (email + Google OAuth)
- Daily Prompts (100 curated questions, smart rotation)
- Memory Creation (rich form with title, date, location, story, tags, photos, privacy toggle)
- Memory Editing (dedicated edit page, pre-populated form)
- Memory Deletion (confirmation dialog)
- Memory Timeline (list view with metadata)
- Memory Detail View (content, photos gallery, tags, edit/delete actions)
- Search & Discovery (fuzzy text + tag filtering)
- Family Connections (invite + accept/decline)
- Shared Vault (access control + shared views)
- Landing Page (public marketing page)

### Enhancement Phase 1 (2026-02-26)
- Photo upload with client-side compression (Supabase Storage)
- Tag creation & assignment (chip-style input, syncs to DB)
- Location field on memory form
- Smart prompt rotation (avoids answered, date-seeded)
- Active navigation link highlighting
- Security: fixed prompt query injection
- Accessibility: `lang="en-GB"` on HTML element

## Tech Stack
- **Frontend**: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: Supabase (Auth, PostgreSQL, Storage, RLS)
- **Hosting**: Vercel (free tier)
- **Fonts**: Lora (serif headings) + Plus Jakarta Sans (body)

## Site Structure
- `/` — Landing Page
- `/login`, `/signup` — Authentication
- `/dashboard` — Dashboard Home (daily prompt, stats, recent memories)
- `/dashboard/memories` — Memory Timeline
- `/dashboard/memories/new` — Create Memory
- `/dashboard/memories/[id]` — Memory Detail
- `/dashboard/memories/[id]/edit` — Edit Memory
- `/dashboard/prompts` — Daily Reflections
- `/dashboard/search` — Search & Discovery
- `/dashboard/family` — Family Connections
- `/dashboard/vault` — Shared Vault
- `/dashboard/settings` — User Settings

## Database Tables
`profiles`, `memories`, `memory_media`, `memory_tags`, `tags`, `daily_prompts`, `prompt_responses`, `family_connections`, `shared_memories`

## Pending Action
Run `supabase/migrations/004_storage_policies.sql` in Supabase Dashboard SQL Editor to enable photo uploads.

See `/docs` for detailed documentation.
