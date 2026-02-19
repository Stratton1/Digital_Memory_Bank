# Memory Bank

**A secure digital memory vault for families.**
Preserve stories, photos, and precious moments. Share them with the people who matter most.

Last updated: 2026-02-19
This file is the canonical guide for this repo.

---

## A) User Profile Summary

- **Goal:** Build and launch a digital memory vault where families store, organise, and share their memories — guided by a friendly AI companion called Nexa.
- **Success looks like:** A live web app where users can sign up, create tagged memories (text + photos), answer daily prompts, view a timeline, and share memories with family.
- **Technical comfort:** Non-technical. I describe goals and give feedback; Claude handles all technical decisions and implementation.
- **Priorities:** Ship fast, spend nothing until launch, warm and polished feel.
- **Constraints:** £0 budget until launch (free-tier services only). UK context (UK English throughout). Brand direction: warm and nostalgic.
- **Decision handling:** Claude decides by default. Only escalate if it's a budget, legal, brand identity, or privacy/data decision that only the user can make.

---

## B) Communication Rules

- **UK English only** — organisation, colour, prioritise, etc.
- **Ask 1–2 questions at a time** — wait for answers before continuing.
- **Decide by default** — justify afterwards in plain English (2–5 bullets max).
- **Updates format:** What changed → Why → What's next.
- **Uncertainty:** Log assumptions, validate with minimal clarification. Don't guess at business intent.

---

## C) Product Definition

### Problem Statement
Families accumulate a lifetime of stories, photos, and memories — but these are scattered across phones, hard drives, social media, and fading photo albums. There's no dedicated, secure place to preserve them meaningfully and share them across generations.

### Target Users
- **Primary (65%):** Digital Memory Keepers (30–55, tech-savvy, family-oriented) and Family Historians (40–65, interested in genealogy and preservation).
- **Secondary (25%):** Young Parents (25–40, documenting milestones, sharing with extended family).
- **Tertiary (10%):** Extended Family Members (all ages, viewing and occasionally contributing).

### Primary User Journeys
1. **Sign up & set up profile** — Create account, add name, bio, avatar.
2. **Answer a daily prompt** — See today's Nexa question, write a response, optionally save it as a memory.
3. **Create a memory** — Write a story, add photos, tag it, set the date, choose privacy.
4. **Browse the timeline** — Scroll through memories chronologically, filter by tags or dates.
5. **Share with family** — Invite a family member, share specific memories, view what's been shared with you.

### MVP Scope (must-have)
- Authentication (email + Google OAuth)
- Memory creation (rich text + photo upload + tags + date + privacy toggle)
- Hashtag system (create, filter, search)
- Daily prompts (curated question bank, smart rotation)
- Memory timeline (chronological, filterable)
- Family connections (invite, accept/decline)
- Shared vault (permission-based sharing)
- Landing page (public marketing page)
- Responsive design (mobile + desktop)

### Out of Scope (non-goals for MVP)
- Video/audio recording
- Full AI companion with LLM
- Family tree visualisation
- Premium subscriptions / payments
- Native mobile app
- Computer vision / face recognition
- Time-locked vault messages

### Post-MVP Ideas
- Audio recording via browser MediaRecorder
- Video upload
- Nexa AI companion (LLM-powered, personalised prompts)
- Family tree interactive visualisation
- Vault messages (time-locked / event-triggered)
- Premium tier + Stripe payments
- Email digests and notifications
- Memory books (printable compilations)

---

## D) Look & Feel

### Brand Direction: Warm & Nostalgic
Like opening a family photo album. Cosy, inviting, gentle, personal.

| Element | Direction |
|---------|-----------|
| Colour palette | Warm neutrals (cream, soft beige, warm grey) with amber/gold accents. Deep tones (burgundy, forest green) for contrast |
| Typography | Lora (serif) for headings, Plus Jakarta Sans (sans-serif) for body. Generous line height |
| Shapes | Rounded corners (0.75rem default). Soft shadows. No sharp edges |
| Imagery | Warm photo treatments. Subtle grain/texture to evoke film photography |
| Spacing | Generous whitespace. Content breathes. Never cramped |
| Animations | Gentle, slow transitions. Fade-ins. Nothing flashy |
| Icons | Lucide (rounded stroke). Friendly, not corporate |
| Overall | Feels like a warm, safe space — not a tech product |

### Accessibility Baseline
- Keyboard navigable throughout
- Minimum contrast ratio 4.5:1
- Readable typography (16px base, generous line height)
- Alt text on all images
- Focus indicators on interactive elements

### Copy Style
- Warm, encouraging, personal
- "Your memories" not "User content"
- "Share with family" not "Send invite"
- Nexa speaks conversationally: "What made you smile today?"

---

## E) Technical Plan

### Platform & Stack
- **Platform:** Web (Next.js 16, App Router) — fastest to build and deploy, no app store approval
- **Hosting:** Vercel (free tier) — zero-config deployment, global CDN
- **Backend:** Supabase (free tier) — auth, PostgreSQL database, file storage, realtime
- **Styling:** Tailwind CSS v4 + shadcn/ui — rapid development, accessible components
- **Language:** TypeScript throughout
- **Validation:** Zod for all user input
- **AI Prompts (MVP):** Curated question bank (~100 questions, 10 categories, 3 depths). Designed for drop-in LLM replacement later

### Architecture
```
┌────────────────────────────┐
│   Vercel (Free Tier)       │
│   Next.js 16 App Router    │
│   SSR + Server Actions     │
└──────────┬─────────────────┘
           │ HTTPS
┌──────────▼─────────────────┐
│   Supabase (Free Tier)     │
│   Auth │ PostgreSQL │ Storage│
│   Row Level Security (RLS) │
└────────────────────────────┘
```

### Data Model (key entities)
- **profiles** — user identity (name, bio, avatar)
- **memories** — the core content (title, text, date, location, privacy)
- **memory_media** — photos attached to memories
- **tags** — hashtags for categorisation
- **memory_tags** — links memories to tags
- **family_connections** — relationships between users
- **shared_memories** — permission-based sharing
- **daily_prompts** — curated Nexa questions
- **prompt_responses** — user answers to prompts

### Security & Privacy
- Supabase Auth (email + OAuth)
- Row Level Security on every table — users only see their own data + explicitly shared content
- Secrets in `.env.local` only (never committed)
- Supabase Storage policies — private buckets, signed URLs for sharing
- Zod validation on all inputs
- React escaping + DOMPurify for rich text
- CSRF protection via Server Actions
- Minimal data collection, no analytics trackers

### Deployment
- Push to GitHub → Vercel auto-deploys
- Preview deployments on branches
- Production on `main` branch
- Database migrations applied via Supabase dashboard or CLI

---

## F) Engineering Standards

### Repo Structure
```
src/
├── app/            # Next.js pages and layouts
├── components/     # React components (ui/, memories/, prompts/, etc.)
├── lib/            # Utilities, Supabase clients, constants, validations
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
└── styles/         # Global CSS
supabase/
└── migrations/     # SQL migration files
```

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Server Components by default; `"use client"` only when needed
- Named exports (not default exports) for components
- camelCase for variables/functions, PascalCase for components/types
- Descriptive names — no abbreviations

### Testing
- Manual testing during MVP phase
- Automated tests added in Phase 2+
- Verify all RLS policies block unauthorised access
- Test on mobile viewport after every change

### Linting & Formatting
- ESLint with Next.js config
- `npm run lint` must pass before commits

### Documentation
- CLAUDE.md is the single source of truth
- Code comments only where logic isn't self-evident
- Decision log for significant choices

### Git Hygiene
- Small, focused commits
- Descriptive commit messages (what changed and why)
- Never commit secrets or `.env` files
- Feature branches for significant work

---

## G) Execution & Delivery

### Phase Plan

| Phase | Focus | Done When |
|-------|-------|-----------|
| 0 | Foundation | Blank app deploys to Vercel, Supabase connected, auth works |
| 1 | Core Features | User can sign up, answer prompts, create memories, browse timeline |
| 2 | Sharing & Polish | Family connections, shared vault, search, landing page, mobile polish |
| 3 | Post-Launch | Audio/video, AI companion, family tree, payments |

### Demo Checkpoints
- **End of Phase 0:** "Here's the app running live. You can sign up and log in."
- **End of Phase 1:** "Here's the full memory creation + timeline flow. Try creating a memory."
- **End of Phase 2:** "Here's the sharing system. Try inviting someone and sharing a memory."

### Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Supabase free tier limits hit early | Monitor usage; upgrade when revenue justifies |
| Image storage fills 1 GB | Compress images on upload; defer video to paid tier |
| Daily prompts feel repetitive | 100 prompts across categories + smart rotation avoids repeats |
| User expects full AI from day one | Landing page and onboarding set clear expectations |

### Stop Points (must check with user)
- Before choosing brand colours/fonts (user dictates brand)
- Before any decision that affects who can access data
- Before spending any money (hosting, APIs, services)
- Before making the app public / launching

---

## H) Templates

### Decision Log
| Date | Decision | Why | Consequences |
|------|----------|-----|-------------|
| 2026-02-19 | Next.js 16 + Supabase + Vercel | All free tier, fastest to ship, modern stack | Tied to these platforms; migration possible but not trivial |
| 2026-02-19 | Curated prompts for MVP, not LLM | £0 budget; LLM APIs cost money | Nexa feels guided but not truly conversational until Phase 3 |
| 2026-02-19 | Warm & nostalgic brand direction | User preference | Cream/amber palette, serif headings, rounded shapes |

### Change Log
| Date | Summary | Files | Notes | Next |
|------|---------|-------|-------|------|
| 2026-02-19 | Phase 0 foundation setup | All initial files | Project initialised from scratch | Connect Supabase, deploy to Vercel |

### Issue / Task Template
```
Goal: [What needs to happen]
Acceptance criteria: [How we know it's done]
Approach: [High-level steps]
Notes: [Dependencies, blockers, context]
```

### Assumptions Template
| Assumption | Why Reasonable | How to Validate | Owner |
|------------|---------------|-----------------|-------|
| Users will primarily use mobile browsers | Target demographic uses phones for personal content | Analytics after launch | Claude |
| 100 curated prompts is enough for MVP | Users answer ~1/day; 100 covers 3+ months | Monitor if users exhaust prompts | Claude |
| 1 GB storage is sufficient pre-launch | Text + compressed photos; no video in MVP | Monitor Supabase storage dashboard | Claude |
