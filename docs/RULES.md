# Development Rules

These rules govern all development work on the Memory Bank project. Follow them without exception.

---

## 1. Language & Localisation

- **UK English everywhere** — colour, organisation, prioritise, favourite, etc.
- `lang="en-GB"` on the HTML element at all times.
- Dates formatted as `DD Month YYYY` (e.g. "26 February 2026") — never MM/DD/YYYY.
- Currency in GBP (£) when applicable.

## 2. Code Standards

- **TypeScript strict mode** — no `any` unless absolutely unavoidable (add `eslint-disable` comment when forced).
- **Functional components with hooks** — no class components.
- **Server Components by default** — only add `"use client"` when the component genuinely needs browser APIs, state, or effects.
- **Named exports** — `export function MyComponent()`, not `export default`.
- **camelCase** for variables/functions, **PascalCase** for components/types.
- **Descriptive names** — no abbreviations (`getUserProfile`, not `getUsrProf`).
- **Zod validation** on all user input — never trust client data.

## 3. Styling & Design

- **Tailwind CSS v4** with shadcn/ui components — no custom CSS unless Tailwind cannot achieve it.
- **Brand palette**: warm neutrals (cream, soft beige, warm grey) with amber/gold accents. Deep tones (burgundy, forest green) for contrast.
- **Typography**: Lora (serif) for headings, Plus Jakarta Sans (sans-serif) for body.
- **Rounded corners**: `rounded-lg` (0.75rem) default. No sharp edges.
- **Generous whitespace** — content breathes. Never cramped.
- **Gentle animations** — fade-ins, slow transitions. Nothing flashy.
- **Icons**: Lucide (rounded stroke). Friendly, not corporate.
- **Minimum contrast ratio**: 4.5:1. All images must have alt text.

## 4. Architecture

- **Next.js 16 App Router** — use `src/app/` for pages/layouts, `src/components/` for UI.
- **Next.js 16 uses `proxy.ts`** — not `middleware.ts`. Never create a `middleware.ts` file.
- **Supabase for everything backend** — auth, database, storage, RLS. No custom backend.
- **Row Level Security on every table** — users only see their own data + explicitly shared content.
- **Server Actions for mutations** — prefer over client-side Supabase calls where possible.
- **No secrets in client code** — only `NEXT_PUBLIC_` prefixed env vars are exposed to the browser.

## 5. Database

- **Never run raw SQL with user-provided values** — always use parameterised queries via Supabase client.
- **All tables must have RLS enabled** — no exceptions.
- **Migrations are numbered sequentially** — `001_`, `002_`, `003_`, etc. in `supabase/migrations/`.
- **Migrations are additive** — never drop columns or tables without explicit approval.
- **Use `updated_at` triggers** on tables that support editing.
- **UUID primary keys** — never auto-incrementing integers.

## 6. Security

- **Never commit secrets** — `.env.local` is in `.gitignore`. Service role keys never appear in client code.
- **Validate all inputs with Zod** — on both client and server.
- **Escape user content** — React handles this by default; use DOMPurify for any raw HTML.
- **CSRF protection** via Server Actions.
- **Storage policies** — private buckets with RLS. Signed URLs for sharing.
- **No `dangerouslySetInnerHTML`** without DOMPurify sanitisation.

## 7. Git & Deployment

- **Small, focused commits** — one logical change per commit.
- **Descriptive commit messages** — what changed and why, not just "fix bug".
- **Never commit to `main` without a passing build** — run `npm run build` first.
- **Vercel auto-deploys from `main`** — every push is a production deployment.
- **Feature branches for significant work** — only quick fixes go directly to `main`.
- **Never force push to `main`**.
- **Never commit `.env` files, credentials, or API keys**.

## 8. File Organisation

```
src/
├── app/            # Next.js pages and layouts
├── components/     # React components (ui/, memories/, prompts/, layout/, etc.)
├── lib/            # Utilities, Supabase clients, constants, validations
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
└── styles/         # Global CSS
supabase/
└── migrations/     # SQL migration files (numbered)
docs/               # Project documentation
```

- **Components go in subdirectories by domain** — `components/memories/`, `components/prompts/`, etc.
- **UI primitives** (shadcn/ui) go in `components/ui/`.
- **One component per file** — file name matches component name in kebab-case.
- **No circular imports**.

## 9. Testing

- **Manual testing during MVP phase** — automated tests added incrementally.
- **Test on mobile viewport after every UI change** — the primary audience uses mobile.
- **Verify all RLS policies block unauthorised access** before deploying.
- **Run `npm run build` before every commit** — TypeScript errors caught at build time.

## 10. Performance

- **Compress images on upload** — max 2000px wide, JPEG quality 0.8.
- **Use Next.js `<Image>` component** for all images — automatic optimisation.
- **Lazy load below-the-fold content** — don't load what the user can't see.
- **Avoid client-side data fetching where Server Components can be used**.
- **No unnecessary `useEffect`** — if it can be computed during render, do it during render.

## 11. Copy & Tone

- **Warm, encouraging, personal** — "Your memories" not "User content".
- **"Share with family"** not "Send invite".
- **Nexa speaks conversationally** — "What made you smile today?"
- **Error messages are helpful** — "We couldn't save your memory. Please try again." not "Error 500".
- **Empty states are encouraging** — "Your memory vault is empty. Create your first memory!" not "No data found."

## 12. Budget & Services

- **£0 budget until launch** — free tier services only.
- **Supabase free tier**: 500MB database, 1GB storage, 50K monthly active users.
- **Vercel free tier**: 100GB bandwidth, serverless functions.
- **No paid APIs** without explicit approval.
- **Monitor usage** — check Supabase dashboard regularly for approaching limits.

## 13. Documentation

- **CLAUDE.md is the single source of truth** for project definition and technical plan.
- **ROADMAP.md tracks progress** — update after every significant milestone.
- **build_log.md records changes** — what was done and when.
- **Code comments only where logic isn't self-evident** — don't document the obvious.
- **Update docs in the same commit as code changes** — docs should never fall behind.

## 14. Decision-Making

- **Claude decides technical implementation by default** — justify afterwards.
- **Escalate to the user** for: budget decisions, legal/privacy concerns, brand identity, data access.
- **Log significant decisions** in CLAUDE.md decision log with rationale.
- **When in doubt, ship the simpler solution** — complexity can be added later.
