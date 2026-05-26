This is a large multi-area pass. Here is the plan before I start building.

## 1. Database seed
- Insert profile row (single row with given data).
- Insert ~30 skills, 6 projects, 6 experience entries, 5 achievements — only if tables are empty.

## 2. Public site wiring
The home route already fetches data — I'll verify Hero/About/Skills/Projects/Experience/Achievements/Contact each render real Supabase data, with empty states. Fix profile photo + resume display in About and wire Download Resume / Hire Me / View Work buttons + smooth scroll.

## 3. Admin panel (full CRUD)
Build a shared admin layout with a left sidebar (Dashboard, Profile, Projects, Skills, Experience, Gallery, Achievements, Messages w/ unread badge, Sign out). New routes:
- `/admin/profile` — single-row upsert form + photo + resume upload to Storage
- `/admin/projects` — list + add/edit form (all fields, tag chip input, dynamic highlights list, thumbnail upload, flagship/featured toggles)
- `/admin/skills` — grouped list + add/edit form (proficiency slider, color, category)
- `/admin/experience` — list + add/edit form (responsibilities + tech chips, logo upload)
- `/admin/gallery` — multi-upload grid + delete
- `/admin/achievements` — list + add/edit form
- `/admin/messages` — table view, row → modal with Mark Read / Reply (mailto) / Delete, unread badge, mark-all-read, empty state

All forms use shadcn inputs + react-hook-form-lite pattern (controlled state), Supabase insert/update, toast feedback.

## 4. Contact form improvements
Add field validation (name ≥2, email format, subject ≥3, message ≥20) with inline errors, loading state, success/error inline messages + toast, clear on success. After insert, fire-and-forget call to email notify function.

## 5. Email notifications
Per stack rules I'll create a **TanStack server route** at `/api/public/notify-contact` (not a Supabase Edge Function — that contradicts platform rules). It uses Resend via `RESEND_API_KEY` secret. I'll add the secret via the secrets tool. The route validates input, sends HTML email to sakariyayash04@gmail.com, returns 200 even if Resend not configured (so form never blocks). Public route → no auth needed for the form submission.

## 6. RLS / Storage
RLS already permits public read + admin (has_role) writes. Storage buckets are already public. I'll add storage INSERT policies for authenticated admin uploads (currently missing — uploads will 403 otherwise). One migration.

## Technical notes
- Admin uses `_authenticated`-style guard via in-component check (existing pattern in admin.dashboard.tsx). I'll factor a small `useAdminGuard` hook so every admin page is gated identically.
- All new admin routes follow TanStack flat naming: `admin.profile.tsx`, `admin.projects.tsx`, `admin.projects.$id.tsx`, etc.
- Tag chip / dynamic list inputs as small local components, not new packages.
- No edge functions; email goes through `src/routes/api/public/notify-contact.ts`.

## Order of operations
1. Migration: storage admin write policies.
2. Seed data (single insert call, idempotent via NOT EXISTS).
3. Add RESEND_API_KEY secret (will prompt user).
4. Build shared `AdminLayout` + `useAdminGuard`.
5. Build each admin CRUD page in parallel batches.
6. Update Contact + About + Hero wiring fixes.
7. Build notify-contact server route + wire from Contact form.
8. Verify by reading the dev preview build output and console.

Approve and I'll execute.