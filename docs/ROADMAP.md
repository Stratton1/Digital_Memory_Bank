# Project Roadmap

## Current Status
- **Phase**: Enhancement Phase 1 (Critical Gaps) — In Progress
- **Active Task**: Completing Phase 1 enhancements, moving to Phase 2 (Core Experience Polish)
- **Last Deployment**: 2026-02-26 (`6ffc5ac`) — Vercel auto-deploy from `main`
- **Pending Action**: Run `004_storage_policies.sql` in Supabase Dashboard to enable photo uploads

---

## Known Issues & Resolutions

### Resolved: Supabase Auth Seeding (Login 400 Error)
- **Issue**: Manually inserting users into `auth.users` via SQL caused login failures.
- **Cause**: Missing GoTrue internal fields (`instance_id`, `aud`, `raw_app_meta_data`).
- **Resolution**: Use Supabase Admin API (`POST /auth/v1/admin/users`) for user creation.

### Resolved: Wrong Supabase URL on Vercel (2026-02-26)
- **Issue**: Vercel env vars pointed to a dead Supabase project (`ymlnkdtslgwhhbdinlrn`).
- **Resolution**: Replaced with correct project ref (`chysractptwlqapoxaes`) for both production and preview environments.

### Resolved: Next.js 16 Middleware Naming (2026-02-26)
- **Issue**: Created `src/middleware.ts` but Next.js 16 uses `proxy.ts` instead.
- **Resolution**: Deleted `middleware.ts`; `src/proxy.ts` already handles Supabase session refresh.

### Resolved: Missing Database Tables (2026-02-26)
- **Issue**: `memory_media` and `shared_memories` tables were missing from live database.
- **Resolution**: Created and applied `003_fix_missing_schema.sql` as an additive migration.

---

## Phase 1: Cleanup & Foundation (Complete)
- [x] Fix lint configuration
- [x] Add basic unit tests (Vitest setup + Smoke test)
- [x] Setup CI/CD (GitHub Actions)
- [x] Standardise documentation structure
- [x] Refactor folder structure (moved (dashboard) to dashboard)

## Phase 2: Feature Development (Complete)
- [x] Implement daily prompt logic (DB + UI)
- [x] Enhance memory creation flow (Form + Submit)
- [x] Search & Discovery (server-side search, text + tags, debounce UI)
- [x] Family Connections (invite system, accept/decline)
- [x] Shared Vault (shared memories view, access control)
- [x] Navigation & Polish (active states, empty states)

## Phase 3: Polish & Launch (Complete)
- [x] Final UI polish (Dashboard layout, Loading states, Error handling)
- [x] Performance optimisation (Verified build, Metadata)
- [x] Launch preparation (Robots.txt, Sitemap, Contributing docs)

---

## Enhancement Phase 1: Critical Gaps (In Progress)
**Focus:** Fixing broken features and adding missing core functionality.

- [x] Memory editing — edit page + uncommented edit button
- [x] Photo upload — client-side compression, Supabase Storage bucket, gallery on detail page
- [x] Tag creation & assignment — chip-style input (Enter/comma), syncs to tags + memory_tags
- [x] Location field — added to memory creation/edit form
- [x] Smart prompt rotation — avoids answered prompts, date-based seeding for daily consistency
- [x] Memory deletion — confirmation dialog with AlertDialog component
- [x] Active nav link highlighting — current page highlighted in navbar
- [x] Fix prompt query injection — properly quote UUIDs in Supabase `.not()` filter
- [x] Set `lang="en-GB"` on HTML element for UK English accessibility
- [x] Storage policies migration (004) for memory-photos bucket
- [ ] Favicon & app icons

## Enhancement Phase 2: Core Experience Polish (Next)
**Focus:** Making the existing features feel complete and professional.

- [ ] Empty state illustrations (memories, vault, family)
- [ ] Loading skeletons for all data pages
- [ ] Memory card redesign (thumbnail, tags, location on timeline)
- [ ] Character count on memory form textarea
- [ ] Toast notifications for all user actions
- [ ] Profile page enhancements (avatar upload, bio, stats)
- [ ] Settings page improvements (change password, delete account)
- [ ] Mobile-first responsive polish
- [ ] Error boundaries with friendly error pages
- [ ] "On This Day" widget on dashboard
- [ ] Memory search improvements (date range, location filter)
- [ ] Pagination or infinite scroll on memories list
- [ ] Prompt response history page
- [ ] Breadcrumb navigation

## Enhancement Phase 3: Engagement & Delight (Planned)
**Focus:** Features that keep users coming back.

- [ ] Memory statistics dashboard (word count, streaks, most-used tags)
- [ ] Prompt streak tracker
- [ ] Memory sharing improvements (share dialog, permissions)
- [ ] Email notifications (shared memories, family invites)
- [ ] Onboarding flow for new users
- [ ] Keyboard shortcuts
- [ ] Dark mode / theme switcher
- [ ] Rich text editor for memory content
- [ ] Memory templates ("First Day of School", "Holiday", etc.)

## Enhancement Phase 4: Power Features (Planned)
**Focus:** Advanced features for power users and compliance.

- [ ] Data export (JSON + photos ZIP)
- [ ] Privacy policy and terms of service pages
- [ ] Cookie consent banner
- [ ] Account deletion flow
- [ ] Memory backup reminders
- [ ] API rate limiting
- [ ] Content moderation
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## Post-Launch Phase 1: Deepening the Story (Future)
**Focus:** Enhancing the richness and emotional depth of individual memories.

### 1. Oral History (Voice Memos)
- [ ] Research: Evaluate browser `MediaRecorder` API vs. dedicated libraries
- [ ] Backend: Create storage bucket for audio files
- [ ] UI: Add "Record Audio" button to Memory Form
- [ ] Playback: Implement custom audio player in Memory Detail view
- [ ] Transcription: Integrate OpenAI Whisper for auto-transcription

### 2. Soundtrack of Life
- [ ] Integration: Research Spotify/Apple Music Embed APIs
- [ ] Database: Add `song_url` and `song_metadata` columns to `memories`
- [ ] UI: Add "Add Song" search input to Memory Form
- [ ] Display: Render embedded player on Memory Detail view

### 3. Time Capsules
- [ ] Database: Add `unlock_date` column to `memories`
- [ ] Logic: Update RLS policies to prevent read access before `unlock_date`
- [ ] UI: Add "Lock until..." date picker to Memory Form
- [ ] Notification: Scheduled job to email user when a capsule unlocks

### 4. Scanned Photo Restoration
- [ ] Service: Investigate Replicate or similar API for restoration models
- [ ] Backend: Create API route for image upload and processing
- [ ] UI: Add "Restore Photo" action to uploaded images
- [ ] Comparison: Implement "Before/After" slider

### 5. Photo Mini-Animation (Live Photos)
- [ ] Service: Research cinemagraph/depth map generation
- [ ] Implementation: Apply subtle Ken Burns effect to static images
- [ ] UI: Toggle "Animate" on memory detail view

---

## Post-Launch Phase 2: Strengthening Connections (Future)
**Focus:** Turning the vault into a living social graph.

### 6. Interactive Family Tree
### 7. Reactions & Comments
### 8. Prompt Exchange
### 9. Legacy Contacts
### 10. Guest Access (Share Links)

---

## Post-Launch Phase 3: Nexa Intelligence (Future)
**Focus:** Leveraging AI to organise, surface, and enrich content.

### 11. Nexa Interview Mode
### 12. "On This Day"
### 13. Auto-Tagging
### 14. Smart Curated Albums
### 15. Sentiment Timeline

---

## Post-Launch Phase 4: Advanced Discovery (Future)
**Focus:** New ways to navigate and visualise the memory bank.

### 16. Map View
### 17. Calendar View
### 18. Bulk Import
### 19. Advanced Filtering
### 20. Physical Print Integration

---

## Post-Launch Phase 5: Platform Maturity (Future)
**Focus:** Reliability, portability, and personalisation.

### 21. Memory Book Export
### 22. PWA (Offline Mode)
### 23. Biometric Vault
### 24. Thematic Skins
### 25. Data Takeout
