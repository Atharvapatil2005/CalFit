# CALFIT V2 PRODUCTION READINESS ROADMAP

## Current foundation

- [x] Expo SDK 54 migration complete
- [x] Stable onboarding flow: `onboarding -> gender -> measurements -> nutrition -> register`
- [x] Stable email/password login
- [x] Supabase v2 backend connected
- [x] `public.profiles` table exists with RLS
- [x] `public.meals` table exists
- [x] Session restore works on cold start
- [x] Dashboard boot works for signed-in users
- [x] Manual meal logging works
- [x] Supabase Edge Functions exist for AI chat and nutrition search

## P0 - Launch blockers

- [ ] Make dashboard product-correct from real profile plus meals data
  Severity: P0
  Why it blocks beta: [dashboard.tsx](/Users/atharvapatil/;/CalFit/app/(tabs)/dashboard.tsx) still uses hardcoded calorie, macro, water, and exercise targets. Beta users will see misleading guidance even though meals persist correctly.
  Exact files affected: `app/(tabs)/dashboard.tsx`, `src/services/supabase.ts`, new profile/daily goals data access layer, optional new `supabase/migrations/*daily_goals*.sql`
  Database migration needed? Yes, if `public.daily_goals` is added as the source of truth
  Security impact: Low
  QA test steps: Create a user profile with known height/weight/goal; add meals; verify dashboard calorie and macro targets come from DB-backed logic and meal totals update immediately
  Git commit message: `feat: drive dashboard from profile meals and daily goals`
  Rollback plan: Hide personalized targets and show only today meal totals until the goals layer is stable

- [ ] Hydrate and persist profile data for existing signed-in users
  Severity: P0
  Why it blocks beta: Existing users can log in, but the app does not fetch and use their stored `public.profiles` row after login or session restore. Profile editing is effectively absent.
  Exact files affected: `src/services/supabase.ts`, `src/context/AuthContext.tsx`, `app/(tabs)/profile.tsx`, `app/(tabs)/dashboard.tsx`
  Database migration needed? No
  Security impact: Medium, touches health-adjacent profile data
  QA test steps: Log in as an existing user; verify the app fetches profile data on boot; verify profile-backed UI renders without placeholder values; update profile and verify persistence
  Git commit message: `feat: hydrate and sync profile state after login`
  Rollback plan: Keep profile read-only and avoid rendering profile-derived summaries until hydration is stable

- [ ] Reset user-derived local state on logout and account switch
  Severity: P0
  Why it blocks beta: [OnboardingContext.tsx](/Users/atharvapatil/;/CalFit/src/context/OnboardingContext.tsx) is not reset on logout, so stale onboarding data can leak across sessions on shared test devices.
  Exact files affected: `src/context/AuthContext.tsx`, `src/context/OnboardingContext.tsx`, `app/(tabs)/profile.tsx`, root provider setup
  Database migration needed? No
  Security impact: Medium
  QA test steps: Complete onboarding with user A, sign out, sign in as user B, verify onboarding/profile state is cleared and no prior user values remain
  Git commit message: `fix: clear local onboarding and profile state on logout`
  Rollback plan: Force full app reload on logout if targeted cleanup regresses

- [ ] Harden meals schema and RLS with real migrations, not docs-only SQL
  Severity: P0
  Why it blocks beta: Meals policies currently live in [docs/supabase_setup.sql](/Users/atharvapatil/;/CalFit/docs/supabase_setup.sql) rather than a canonical migration under `supabase/migrations`. That creates deployment drift between local assumptions and real projects.
  Exact files affected: new `supabase/migrations/*create_meals*.sql`, `docs/supabase_setup.sql`, `src/services/supabase.ts`
  Database migration needed? Yes
  Security impact: High
  QA test steps: Apply migrations to a clean project; verify insert/select/update/delete are limited to `auth.uid() = user_id`; verify unauthenticated requests fail
  Git commit message: `fix: migrate meals schema and rls into canonical supabase migration`
  Rollback plan: Keep meal logging enabled only on projects that have the verified schema applied

- [ ] Require authenticated user tokens for Edge Functions
  Severity: P0
  Why it blocks beta: [aiService.ts](/Users/atharvapatil/;/CalFit/src/services/aiService.ts) and [nutritionService.ts](/Users/atharvapatil/;/CalFit/src/services/nutritionService.ts) call Edge Functions using the anon key, and the functions do not validate user auth. That is not acceptable for beta traffic or user-scoped features.
  Exact files affected: `src/services/aiService.ts`, `src/services/nutritionService.ts`, `supabase/functions/ai-chat/index.ts`, `supabase/functions/nutrition-search/index.ts`, `supabase/functions/_shared/cors.ts`
  Database migration needed? No
  Security impact: Critical
  QA test steps: Call both functions with a valid user session token and with no token; verify authenticated requests succeed and unauthenticated requests are rejected; verify no provider secrets are exposed
  Git commit message: `security: require authenticated edge function access`
  Rollback plan: Disable AI and nutrition search rather than leaving open anon access

- [ ] Add real loading, retry, and empty-state UX for core screens
  Severity: P0
  Why it blocks beta: Dashboard, meals, chat, and auth flows still rely on basic spinners and plain text errors. That is too brittle for real users on mobile networks.
  Exact files affected: `app/(tabs)/dashboard.tsx`, `app/(tabs)/meals.tsx`, `app/(tabs)/chat.tsx`, `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, shared components in `src/components/`
  Database migration needed? No
  Security impact: Low
  QA test steps: Simulate slow network, offline launch, transient 500s, and request timeouts; verify each screen shows actionable error copy, retry CTA, and first-run empty state
  Git commit message: `feat: add resilient loading retry and empty states`
  Rollback plan: Keep simplified error banners if shared UX components regress

- [ ] Canonicalize Expo release config and package identity
  Severity: P0
  Why it blocks beta: [app.config.ts](/Users/atharvapatil/;/CalFit/app.config.ts) and [app.json](/Users/atharvapatil/;/CalFit/app.json) disagree on package IDs and app identity. Release builds cannot rely on duplicated conflicting config.
  Exact files affected: `app.config.ts`, `app.json`, `eas.json`
  Database migration needed? No
  Security impact: Medium, wrong config can point builds to the wrong backend or package identity
  QA test steps: Build preview and production profiles; verify Android package and iOS bundle ID match the intended release values; verify env injection still works
  Git commit message: `chore: unify expo config and release identifiers`
  Rollback plan: Freeze on one config source and disable production builds until resolved

- [ ] Replace placeholder app assets with real production assets
  Severity: P0
  Why it blocks beta: `/assets/icon.png`, `/assets/adaptive-icon.png`, `/assets/favicon.png`, and `/assets/splash.png` are zero-byte placeholders.
  Exact files affected: `assets/*`, `app.config.ts` or canonical Expo config
  Database migration needed? No
  Security impact: None
  QA test steps: Build app and verify icon, splash, adaptive icon, and store-facing assets render correctly on Android and iPhone
  Git commit message: `chore: add production app icon and splash assets`
  Rollback plan: None, real assets are mandatory for beta distribution

## P1 - Beta polish

- [ ] Add editable profile screen backed by `public.profiles`
- [ ] Add `public.daily_goals` table or equivalent computed goal layer
- [ ] Refresh dashboard from meal mutations and tab focus, not only first mount
- [ ] Convert meals and chat from `ScrollView` to `FlatList`
- [ ] Add optimistic meal deletion with rollback or undo
- [ ] Replace placeholder `app/meals/add.tsx` with a real add-meal experience or remove the route
- [ ] Add dark mode token architecture and persistent theme preference
- [ ] Add button/request dedupe for meal save, delete, login, signup, and chat send
- [ ] Add keyboard-safe and bottom-safe-area pass across auth, meals modal, and chat
- [ ] Improve profile null handling and first-run empty states
- [ ] Add login existing-user profile fetch and post-login hydration checks
- [ ] Add explicit offline fallback UX and “last synced” messaging

## P2 - Scale improvements

- [ ] Add repository layer for Supabase and Edge Function access
- [ ] Extract reusable hooks for auth, profile, meals, dashboard, and chat
- [ ] Adopt TanStack Query or equivalent server-state caching
- [ ] Persist chat sessions and rolling message history
- [ ] Add analytics instrumentation for funnel and retention events
- [ ] Add crash reporting with sanitized payloads
- [ ] Add account deletion flow and data cleanup
- [ ] Add user data export flow
- [ ] Add bundle hygiene and startup performance checks
- [ ] Add Edge Function latency monitoring and structured backend logging

## 7-day solo developer sprint

### Day 1
- Canonicalize release config
- Remove conflicting `app.json` values or delete the duplicate config source
- Pin final package IDs and app identity
- Replace placeholder app assets
- Add startup env validation for required keys and URLs

### Day 2
- Implement `getProfile` and `updateProfile`
- Hydrate profile after login and session restore
- Clear onboarding/profile-derived local state on logout
- Wire profile state into dashboard and profile surfaces

### Day 3
- Add `daily_goals` schema or computed goal service
- Replace hardcoded dashboard targets
- Make dashboard refresh after meal add/delete and on tab focus
- Add empty/loading/error states for dashboard

### Day 4
- Harden meals flow with optimistic updates and retry UX
- Convert meals list to `FlatList`
- Replace or remove placeholder add-meal route
- Validate meals RLS against a real migration-applied project

### Day 5
- Secure Edge Functions with authenticated user tokens
- Remove anon-only proxy assumptions in client services
- Tighten CORS and auth validation
- Add structured non-secret backend error handling

### Day 6
- Implement dark mode token architecture
- Add persistent settings storage
- Finish keyboard/safe-area polish on login, register, meals modal, and chat
- Add duplicate-tap guards and request dedupe

### Day 7
- Add crash reporting
- Add basic analytics
- Wire privacy policy and terms links
- Create test account and beta smoke checklist
- Build EAS preview/internal release and test on a physical Android device

## Recommended Git branch structure

- `main`
  Keep releasable at all times.
- `release/beta-hardening`
  Integration branch for the 7-day push.
- `feat/profile-sync-and-goals`
  Profile hydration, profile editing, daily goals, dashboard correctness.
- `feat/meals-and-dashboard-ux`
  Meals UX, dashboard refresh, empty/loading/retry states.
- `feat/edge-security`
  Edge Function auth, CORS tightening, env validation.
- `chore/release-config-assets`
  Expo config cleanup, icons, splash, EAS, release metadata.
- `feat/observability`
  Crash reporting, analytics, release smoke instrumentation.

## Milestone-based commit plan

- Milestone 1: `chore: unify expo config and add production mobile assets`
- Milestone 2: `feat: hydrate profile after login and clear user state on logout`
- Milestone 3: `feat: add daily goals and drive dashboard from profile plus meals`
- Milestone 4: `fix: refresh dashboard and meals state on mutations and tab focus`
- Milestone 5: `feat: add resilient loading retry empty states and request guards`
- Milestone 6: `security: require authenticated edge function access and migrate meals schema`
- Milestone 7: `feat: add profile editing dark mode and persistent preferences`
- Milestone 8: `chore: prepare internal beta build with crash reporting analytics and legal links`

## QA master checklist

- [x] Test email/password auth flow: login, invalid credentials, sign out, session persistence, expired session recovery
- [x] Test onboarding register flow: `onboarding -> gender -> measurements -> nutrition -> register -> dashboard`
- [x] Verify register failure handling keeps the user on register with a visible error when Supabase Auth Email provider is disabled or signup returns no active session
- [ ] Verify existing-user login hydrates `public.profiles` and dashboard/profile surfaces
- [ ] Verify logout clears onboarding/profile-derived local state
- [ ] Test meal insert/delete flow on real user accounts using migration-backed `public.meals`
- [ ] Validate RLS on `public.meals`, `public.profiles`, `public.daily_goals`, and future chat tables
- [ ] Test Android keyboard behavior on login, register, meals modal/add screen, and chat input
- [ ] Test app cold start with signed-in and signed-out users
- [ ] Test dashboard refresh after meal add/delete and tab switching
- [ ] Simulate API failures for Supabase, AI proxy, and Nutrition proxy and verify retry UX
- [ ] Test offline behavior for launch, login attempt, dashboard load, meals load, and chat send
- [ ] Validate Edge Functions reject unauthenticated requests and accept valid user tokens
- [ ] Validate Expo preview/internal build on a physical Android device

## Release checklist

- [ ] Keep one canonical Expo config source
- [ ] Validate all required environment variables at startup with clear non-secret errors
- [ ] Verify package IDs and bundle identifiers match release targets
- [ ] Replace placeholder privacy and terms links in `app/(tabs)/profile.tsx`
- [ ] Publish real privacy policy and terms pages
- [ ] Add account deletion path and document support process until self-serve deletion exists
- [ ] Complete Play Store Data safety disclosure for profile, nutrition, chat, and account data
- [ ] Create and document a real beta test account
- [ ] Run and install an EAS preview/internal build, then smoke test auth, meals, dashboard, chat, and profile
- [ ] Confirm crash reporting and analytics are enabled only in intended environments
