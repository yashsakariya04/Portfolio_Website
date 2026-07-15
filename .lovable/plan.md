
# Portfolio Repositioning — "AI Automation Engineer & Solution Architect"

Goal: replace the "final-year student" signal with "working AI Automation Engineer at Pucho.ai" across every surface, in one pass. Content lives in Supabase and is edited in the admin panel, so this plan updates seed data + component copy + layout, not just static text.

## 1. Data updates (seed via one migration)

**profile row**
- `title`: "AI Automation Engineer & Solution Architect"
- `tagline`: "I design and ship AI agents and automation workflows that replace manual business processes — from architecture to deployment."
- `bio`: 60–80 word Pucho.ai-first version from Step 4.
- `current_role`: "AI Automation Executive @ Pucho.ai"
- `availability_status`: "Open to senior AI engineering & solution architect roles"

**experience rows**
- Insert **Pucho.ai — AI Automation Executive (Solution Architect)**, Jul 2026 – Present, marked `is_current = true`, top of stack. Bullets rewritten in owner voice with real metrics: 100+ workflows shipped, 25+ APIs/services integrated, 5 client/internal automation projects, LLM stack (OpenAI, Gemini, LangGraph), Python/FastAPI/Supabase/Postgres.
- Update Infopulse row to past tense, reframed as "foundation" not current.

**skills rows** — retag into 3 tiers via new `tier` column (`core` / `important` / `supporting`), matching Step 5 groupings. Add missing **MCP (Model Context Protocol)**. Drop generic "Machine Learning" / "Generative AI" umbrella tags; merge the 3 consulting tags into "Solution Architecture".

**projects rows** — full case-study fields (already in schema: `long_description`, `architecture_highlights`, `tech_stack`, `is_flagship`) rewritten for the 4 featured projects; the rest demoted (`is_flagship = false`, lower `display_order`) into a "More Projects" tail.

## 2. Schema tweaks (one migration)

- `skills.tier text` with check constraint (`core|important|supporting`), default `supporting`, backfilled from seed.
- `experience.is_current boolean default false`.
- `profile.current_role text`, `profile.current_company text`.

## 3. Component / route changes

**Section order** (`src/routes/index.tsx`): Hero → About → **Experience** → Skills → Projects → Journey → Achievements → Contact. Experience moves above Skills+Projects.

**Hero** (`Hero.tsx`)
- New headline "AI Automation Engineer & Solution Architect".
- New tagline (from profile).
- Add **Current Role chip**: "● Currently: AI Automation Executive @ Pucho.ai" (green pulse dot, links to Experience).
- Add **Download Resume** CTA next to "View My Work" (reads `profile.resume_url`).
- Verify stat counters animate to real DB counts, not stuck at 0+.

**About** (`About.tsx`)
- Rewritten bio (Pucho.ai front-and-center).
- Split into two visually distinct blocks: **Current Role card** (dominant, cyan border, company + title + 2-line "what I do day-to-day") and **Background** (education, CGPA — smaller, muted).
- Hobbies moved to a small muted footer strip inside About, not equal-weight tags.

**Experience** (`Experience.tsx`)
- Vertical timeline; current role gets a "● Current" badge + accent border.
- Owner-voice bullets with metrics rendered as chips (100+ workflows, 25+ integrations, 5 clients).

**Skills** (`Skills.tsx`)
- Replace flat cloud with 3 labeled rows: **Core**, **Important**, **Supporting**, visually distinct (Core is larger + accent, Supporting is muted).
- Keep category filter but default to tier grouping.

**Projects** (`Projects.tsx`)
- Flagship = **AI Action Assistant** with full case-study treatment: business problem → solution → architecture flow (Trigger → Reason → Tool Call → Validate → Action) rendered as icon row → tech stack grouped → business impact → technical challenge.
- Next 3 (HRMS Backend, JusticeAI, Road Damage Detection): same structure in modal, condensed on card.
- Add small architecture-flow strip on card hover for top 4.
- Remaining projects collapsed under "More Projects" toggle.

**New: CurrentRoleCard** (rendered in Hero and/or About) — dated, company-linked, 2 lines of what the role means.

**New: CommunityStrip** (`Community.tsx`, rendered before Contact) — ISA Documentation Co-Lead, NSS Coordinator, open-source. Compact single-row strip, no empty-looking section.

**Contact** (`Contact.tsx`) — remove "Internships" from the "I'm open to" list; keep everything else.

**Footer** — update tagline + current role line so it matches.

## 4. Admin panel

No new pages needed — existing CRUD covers profile/experience/skills/projects/achievements. Add a `tier` dropdown to the Skills admin form and an `is_current` toggle to Experience admin form (~10 lines each).

## 5. Metadata / SEO

Update `__root.tsx` `head()`: title = "Yash Sakariya — AI Automation Engineer & Solution Architect", description mirrors new tagline, og:title/description matched.

## 6. What's explicitly out of scope

- Testimonials, Blog, Speaking, Research sections (would look empty).
- Any change to backend auth, RLS, or edge/server functions.
- GitHub README rewrite (portfolio-only pass; flagged as a follow-up you should do manually).
- Redesign of color/typography system.

## Execution order once approved

1. Migration: schema tweaks (`skills.tier`, `experience.is_current`, `profile.current_role/current_company`).
2. Seed migration: updated profile + Pucho.ai experience + retagged skills + rewritten project long-descriptions.
3. Component edits + section reorder + new CurrentRoleCard / CommunityStrip.
4. Admin form tweaks for `tier` + `is_current`.
5. Root metadata update.
6. Verify: stat counters render real numbers, Pucho.ai appears as current in Hero/About/Experience/Footer, Skills render in 3 tiers, top 4 projects show case-study depth.

Approve and I'll execute all six steps in one build pass.
