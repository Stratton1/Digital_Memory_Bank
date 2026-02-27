# Build Log

## 2026-02-22 — Initial Audit
- Ran `npm install`
- Ran `npm run build` (Success)
- Ran `npm run lint` (Failed — bypassed for now)
- Created baseline audit report
- Created `/docs` structure and `ROADMAP.md`

## 2026-02-22 — Phase 1: Foundation
- Implemented Daily Prompts (DB + UI)
- Implemented Memory Creation (Form)
- Refactored `(dashboard)` to `dashboard` to resolve route conflict
- Setup Vitest and smoke test

## 2026-02-22 — Phase 2: Features
- Implemented Search & Discovery (Server Action + UI)
- Added `use-debounce` for better UX
- Implemented Family Connections (invite + accept/decline)
- Implemented Shared Vault (view shared with me + shared by me)
- Completed Phase 2 features

## 2026-02-22 — Phase 3: Polish & Launch
- Final UI polish (dashboard layout, loading states, error handling)
- Performance optimisation (verified build, metadata, OG tags)
- Launch preparation (robots.txt, sitemap, contributing docs)
- Landing page (public marketing page)

## 2026-02-26 — Database & Auth Fixes
- Audited live Supabase instance: found 7 tables, 0 auth users, 9 orphaned profiles
- Created `003_fix_missing_schema.sql` — added `memory_media`, `shared_memories`, triggers, RLS
- User applied migration via Supabase Dashboard SQL Editor
- Cleaned up 9 orphaned profile records
- Created test user (`test@memorybank.app`) via Supabase Admin API
- Enabled auto-confirm for email signups
- Fixed Vercel env vars (pointed to wrong Supabase project)
- Redeployed to Vercel with correct environment variables
- Confirmed login works end-to-end

## 2026-02-26 — Enhancement Phase 1: Critical Gaps
- **Memory editing**: Created edit page (`/dashboard/memories/[id]/edit`), uncommented edit button
- **Memory deletion**: Added `DeleteMemoryButton` with `AlertDialog` confirmation
- **Photo upload**: Created `PhotoUpload` component with client-side compression, created `memory-photos` storage bucket, added photo gallery to detail page
- **Tag creation**: Added chip-style tag input (Enter/comma) to memory form, syncs to `tags` + `memory_tags` tables
- **Location field**: Added to memory creation/edit form
- **Smart prompt rotation**: Rewrote `getDailyPrompt()` — avoids answered prompts, date-based seeding for consistency within a day
- **Active nav highlighting**: Added `usePathname()` to navbar, highlights current page
- **Security fix**: Fixed prompt query injection risk in dashboard page
- **Accessibility**: Set `lang="en-GB"` on HTML element
- **Storage policies**: Created `004_storage_policies.sql` migration (pending application)
- Installed `alert-dialog` shadcn/ui component
- Build passing: 17 routes, 0 errors
- Committed (`6ffc5ac`) and pushed to GitHub — Vercel auto-deployed
