# CALFIT V2 STABILIZATION CHECKLIST

## P0 - Launch blockers

- [x] Unify Supabase into one singleton client
  Severity: P0
  Why it breaks production: Auth state and DB calls use different Supabase clients and storage backends, causing session drift and inconsistent behavior.
  Exact files affected: `src/lib/supabase.ts`, `src/services/supabase.ts`, `src/context/AuthContext.tsx`, `app/(auth)/login.tsx`, `app/login-callback.tsx`, any remaining imports of either client
  Database migration needed? No
  Security impact: Medium, reduces accidental use of wrong project/config
  QA test steps: Log in, kill app, relaunch, verify session persists; add/delete meal; sign out; verify all screens use the same user state
  Git commit message: `refactor: unify supabase client into single singleton`
  Rollback plan: Restore previous client split and revert import changes if auth fails in smoke test

- [x] Fix auth bootstrap and session restore
  Severity: P0
  Why it breaks production: App redirects before initial session restore completes, so signed-in users can be bounced to login on cold start.
  Exact files affected: `src/context/AuthContext.tsx`, `app/_layout.tsx`, optionally `app/index.tsx`
  Database migration needed? No
  Security impact: Low
  QA test steps: Log in, force close app, reopen, verify direct landing on dashboard; sign out and reopen, verify landing on login; test expired session path
  Git commit message: `fix: restore auth session before router redirects`
  Rollback plan: Revert auth bootstrap changes and temporarily use explicit login-only flow

- [ ] Fix meals RLS ownership insert issue
  Severity: P0
  Why it breaks production: Meal inserts omit `user_id` while RLS requires row ownership, so food logging can fail for real users.
  Exact files affected: `app/(tabs)/meals.tsx`, `src/services/supabase.ts`, `docs/supabase_setup.sql`
  Database migration needed? Yes
  Security impact: High, fixes ownership enforcement on `public.meals`
  QA test steps: Insert meal as authenticated user; verify row contains correct `user_id`; verify another user cannot read/update/delete it; verify unauthenticated insert fails
  Git commit message: `fix: enforce meal ownership with auth uid defaults and rls`
  Rollback plan: Revert migration and client insert payload changes, then temporarily disable add-meal UI until fixed

- [x] Remove broken routes and dead onboarding paths
  Severity: P0
  Why it breaks production: Several taps navigate to screens that do not exist or to wrong absolute paths, causing immediate user-facing failures.
  Exact files affected: `app/(auth)/login.tsx`, `app/(auth)/profile.tsx`, `app/(auth)/_layout.tsx`, `app/(auth)/onboarding.tsx`, `app/(onboarding)/_layout.tsx`, `app/(onboarding)/goals.tsx`, `app/(onboarding)/nutrition.tsx`, route targets across `app/`
  Database migration needed? No
  Security impact: Low
  QA test steps: Tap every CTA from login through onboarding and profile; verify no route throws, no dead-end screen, no missing route warning
  Git commit message: `fix: remove dead routes and normalize onboarding navigation`
  Rollback plan: Restore previous route tree if new flow blocks entry, but keep broken CTAs hidden

- [ ] Fix login callback and OAuth redirect consistency
  Severity: P0
  Why it breaks production: Redirect URI path, callback screen path, and fallback route are inconsistent, so OAuth sign-in is unreliable.
  Exact files affected: `src/services/supabase.ts`, `app/login-callback.tsx`, `app.config.ts`, Supabase Auth redirect settings for the project
  Database migration needed? No
  Security impact: Medium
  QA test steps: Run Google sign-in on Android device; verify redirect returns to app; verify session exists; verify logout/login repeat works; verify bad callback falls back safely
  Git commit message: `fix: align oauth redirect uri and login callback route`
  Rollback plan: Disable Google sign-in button and keep email/password auth only

- [x] Remove exposed API keys from client-side
  Severity: P0
  Why it breaks production: OpenRouter and Nutritionix keys are shipped in the app bundle and can be extracted and abused.
  Exact files affected: `src/services/aiService.ts`, `src/services/nutritionService.ts`, `app.config.ts`, `.env`
  Database migration needed? No
  Security impact: Critical
  QA test steps: Verify app no longer contains provider secrets; verify AI and nutrition requests only hit backend/Edge Functions; rotate exposed keys after deploy
  Git commit message: `security: remove provider api keys from mobile client`
  Rollback plan: Temporarily disable AI and Nutritionix features rather than re-exposing keys

- [x] Remove secret logging from AI and Nutrition services
  Severity: P0
  Why it breaks production: Request metadata and key prefixes are written to logs, which can leak sensitive information on devices and crash tools.
  Exact files affected: `src/services/aiService.ts`, `src/services/nutritionService.ts`, `src/context/AuthContext.tsx`, `app/_layout.tsx`, `app/(auth)/login.tsx`, `app/login-callback.tsx`, `app/(tabs)/meals.tsx`
  Database migration needed? No
  Security impact: High
  QA test steps: Exercise auth, AI, and meals flows in dev and release mode; verify logs contain no tokens, emails, or session dumps
  Git commit message: `security: remove sensitive runtime logging`
  Rollback plan: Restore minimal sanitized logs only if urgently needed for debugging

## P1 - Product correctness

- [ ] Create `public.profiles` table and profile sync flow
  Severity: P1
  Why it breaks production: User attributes for onboarding, goals, and personalization are not persisted anywhere durable.
  Exact files affected: New migration under `supabase/migrations` or SQL source replacing `docs/supabase_setup.sql`, `app/(auth)/profile.tsx`, `app/(auth)/gender.tsx`, `app/(auth)/measurements.tsx`, `app/(auth)/nutrition.tsx`, `src/types/auth.ts`
  Database migration needed? Yes
  Security impact: Medium, introduces health-adjacent PII that must be protected by RLS
  QA test steps: Complete onboarding; verify profile row created/updated; verify user can only read own profile; verify relaunch restores profile-driven UI
  Git commit message: `feat: add profiles table and persist onboarding profile data`
  Rollback plan: Keep UI fields local-only and hide personalized summaries

- [ ] Create `public.daily_goals` table
  Severity: P1
  Why it breaks production: Calorie and macro targets are hardcoded, so dashboard accuracy is false.
  Exact files affected: New DB migration, `app/(tabs)/dashboard.tsx`, new goal service/hook under `src/`
  Database migration needed? Yes
  Security impact: Low
  QA test steps: Create goal row; load dashboard; verify calorie, protein, carbs, and fat targets match DB values; verify updates reflect immediately
  Git commit message: `feat: add daily goals table for calorie and macro targets`
  Rollback plan: Revert to static targets while hiding personalized messaging

- [ ] Replace dashboard placeholders with real data summaries
  Severity: P1
  Why it breaks production: Dashboard currently mixes hardcoded values with partial meal data and misleads users.
  Exact files affected: `app/(tabs)/dashboard.tsx`, `src/services/supabase.ts` or replacement repository/hook
  Database migration needed? No
  Security impact: Low
  QA test steps: Add meals across meal types; verify totals, per-meal buckets, remaining calories, and empty state all render correctly
  Git commit message: `feat: drive dashboard summaries from meals and daily goals`
  Rollback plan: Show a simplified total-only dashboard if summary logic regresses

- [ ] Add meal history with date-range queries
  Severity: P1
  Why it breaks production: Users cannot review past meals, which is a core tracking requirement.
  Exact files affected: New `app/meals/history.tsx`, `app/(tabs)/meals.tsx`, service/repository methods in `src/`
  Database migration needed? No
  Security impact: Low
  QA test steps: Seed meals across multiple days; open history; verify filtering, grouping, and pagination; verify only current user data appears
  Git commit message: `feat: add meal history screen with date range filtering`
  Rollback plan: Hide history entry point and keep today-only meals view

- [ ] Add proper loading, error, and success states across screens
  Severity: P1
  Why it breaks production: API failures currently look like blank or stale UI with only console errors.
  Exact files affected: `app/(tabs)/dashboard.tsx`, `app/(tabs)/meals.tsx`, `app/(tabs)/chat.tsx`, `app/(auth)/login.tsx`, shared components in `src/components/`
  Database migration needed? No
  Security impact: Low
  QA test steps: Simulate slow network and server errors; verify spinner, retry CTA, and friendly error copy; verify success feedback after meal add/delete
  Git commit message: `feat: add explicit loading and error states across core screens`
  Rollback plan: Keep existing screens and remove shared state wrappers if rendering breaks

- [ ] Add retry UX for failed AI, Supabase, and Nutritionix requests
  Severity: P1
  Why it breaks production: Transient failures are terminal for the user session.
  Exact files affected: `app/(tabs)/chat.tsx`, `app/(tabs)/meals.tsx`, dashboard data hook/service files in `src/`
  Database migration needed? No
  Security impact: Low
  QA test steps: Fail first request then restore network; verify retry button succeeds without duplicate inserts/messages
  Git commit message: `feat: add retry actions for recoverable network failures`
  Rollback plan: Disable retry buttons and fall back to reload-based recovery

- [ ] Add empty states for dashboard, meals, history, and chat
  Severity: P1
  Why it breaks production: Blank screens create confusion and look broken for new users.
  Exact files affected: `app/(tabs)/dashboard.tsx`, `app/(tabs)/meals.tsx`, new history screen, `app/(tabs)/chat.tsx`, shared UI in `src/components/`
  Database migration needed? No
  Security impact: Low
  QA test steps: Test brand-new account with no meals and no chat history; verify clear CTA-driven empty states
  Git commit message: `feat: add first-run empty states for core product surfaces`
  Rollback plan: Revert to minimal placeholder text if custom empty components fail

- [ ] Persist chat sessions and messages
  Severity: P1
  Why it breaks production: Conversations reset on navigation or app restart.
  Exact files affected: New DB tables `public.chat_sessions`, `public.chat_messages`; `app/(tabs)/chat.tsx`; AI service/repository files in `src/`
  Database migration needed? Yes
  Security impact: Medium, stores sensitive nutrition conversation history under RLS
  QA test steps: Send messages, background app, relaunch, verify conversation restored; verify user isolation with second account
  Git commit message: `feat: persist chat sessions and message history`
  Rollback plan: Keep local in-memory chat only and hide history expectations

- [ ] Add AI context retention using rolling message history
  Severity: P1
  Why it breaks production: Chat is currently stateless and low quality.
  Exact files affected: `app/(tabs)/chat.tsx`, `src/services/aiService.ts`, `src/config/ai.ts`
  Database migration needed? No
  Security impact: Medium, more user content sent to backend/provider
  QA test steps: Ask follow-up questions referencing prior meal or assistant response; verify context is retained and no duplicate prior messages are sent
  Git commit message: `feat: add rolling conversation context to ai chat`
  Rollback plan: Cap to shorter context window or single-turn mode if token costs spike

- [ ] Prepare dark mode design tokens
  Severity: P1
  Why it breaks production: Current app is hardcoded light mode with inconsistent styling and no theme readiness.
  Exact files affected: `src/constants/theme.ts`, `app/(tabs)/profile.tsx`, screens with hardcoded colors under `app/`, including `app/meals/add.tsx`
  Database migration needed? No
  Security impact: None
  QA test steps: Toggle device dark mode and in-app setting stub; verify text contrast, surfaces, icons, and cards remain readable
  Git commit message: `feat: prepare semantic theme tokens for dark mode`
  Rollback plan: Leave dark mode disabled but keep semantic token structure

## P2 - Production architecture

- [ ] Move AI requests to Supabase Edge Functions
  Severity: P2
  Why it breaks production: Provider key management and safety controls do not belong in the mobile client.
  Exact files affected: `src/services/aiService.ts`, new `supabase/functions/ai-chat`, app config/env wiring
  Database migration needed? No
  Security impact: Critical improvement
  QA test steps: Verify mobile app calls Edge Function only; verify provider key absent from bundle; verify auth token passed and validated
  Git commit message: `refactor: move ai chat to edge function proxy`
  Rollback plan: Disable AI feature while restoring previous endpoint integration internally

- [ ] Move Nutritionix requests to Supabase Edge Functions
  Severity: P2
  Why it breaks production: Client-side third-party key usage is insecure and costly.
  Exact files affected: `src/services/nutritionService.ts`, new `supabase/functions/nutrition-search`
  Database migration needed? No
  Security impact: Critical improvement
  QA test steps: Search food from app; verify Edge Function is hit; confirm no Nutritionix keys appear in app build
  Git commit message: `refactor: proxy nutritionix requests through edge function`
  Rollback plan: Temporarily disable search and keep manual meal entry only

- [ ] Reorganize codebase into feature-based folders
  Severity: P2
  Why it breaks production: Current structure hides ownership and slows solo maintenance.
  Exact files affected: `app/`, `src/services/`, `src/context/`, `src/types/`, new `src/features/*` layout
  Database migration needed? No
  Security impact: Low
  QA test steps: Run smoke test across auth, meals, dashboard, chat, and profile after folder moves; verify route imports still resolve
  Git commit message: `refactor: reorganize app into feature-based modules`
  Rollback plan: Revert folder moves if Metro or route resolution becomes unstable

- [ ] Add repository layer for Supabase and API access
  Severity: P2
  Why it breaks production: Screens currently depend on transport details and duplicate mapping logic.
  Exact files affected: Replace direct callers in `app/(tabs)/dashboard.tsx`, `app/(tabs)/meals.tsx`, `app/(tabs)/chat.tsx`, repositories under `src/features/*/repositories`
  Database migration needed? No
  Security impact: Low
  QA test steps: Verify all user flows still work after repository extraction; unit test repository methods against mocked responses
  Git commit message: `refactor: introduce repository layer for data access`
  Rollback plan: Inline repository calls back into services if abstraction causes regressions

- [ ] Extract reusable hooks for auth, meals, dashboard, and chat
  Severity: P2
  Why it breaks production: Async logic is duplicated and hard to maintain.
  Exact files affected: New hooks under `src/features/*/hooks`, current screens in `app/(tabs)` and `app/(auth)`
  Database migration needed? No
  Security impact: Low
  QA test steps: Confirm hooks properly refresh on focus, cleanup on unmount, and prevent stale state updates
  Git commit message: `refactor: extract reusable hooks for core product flows`
  Rollback plan: Revert individual hook adoption screen by screen

- [ ] Adopt TanStack Query or Zustand for shared state
  Severity: P2
  Why it breaks production: Current local state strategy duplicates fetches and creates stale UI.
  Exact files affected: `package.json`, root providers in `app/_layout.tsx`, data-heavy screens and hooks in `src/`
  Database migration needed? No
  Security impact: Low
  QA test steps: Verify cache invalidation after meal add/delete, tab switch persistence, and reduced duplicate fetches
  Git commit message: `refactor: adopt tanstack query for server state management`
  Rollback plan: Keep library installed but revert screens to direct hooks if cache behavior is unstable

- [ ] Add analytics instrumentation
  Severity: P2
  Why it breaks production: Launch without funnel data slows debugging and product iteration.
  Exact files affected: Root app provider setup, auth screens, meals flow, dashboard CTA points, chat send action
  Database migration needed? No
  Security impact: Medium, requires event minimization and PII review
  QA test steps: Verify key events fire once; verify no secrets or health text body are sent unintentionally
  Git commit message: `feat: add analytics events for core user funnels`
  Rollback plan: Disable analytics provider via env flag

- [ ] Add crash reporting
  Severity: P2
  Why it breaks production: Silent mobile crashes are hard to diagnose post-launch.
  Exact files affected: Root setup in `app/_layout.tsx`, native config if needed, shared error boundary files
  Database migration needed? No
  Security impact: Medium, requires log scrubbing
  QA test steps: Trigger test exception; verify crash captured without secrets or session data
  Git commit message: `feat: add crash reporting and global error boundary`
  Rollback plan: Disable crash SDK via config while keeping boundary in place

- [ ] Publish real privacy policy and wire in-app links
  Severity: P2
  Why it breaks production: Health-adjacent data collection without an accessible policy is a store and trust risk.
  Exact files affected: `app/(tabs)/profile.tsx`, hosted policy URL/config
  Database migration needed? No
  Security impact: High compliance impact
  QA test steps: Tap privacy and terms links; verify live documents open correctly on device
  Git commit message: `chore: wire real privacy policy and terms links`
  Rollback plan: Remove dead links until legal copy is live

- [ ] Add account deletion flow
  Severity: P2
  Why it breaks production: Users need a path to remove health and profile data.
  Exact files affected: `app/(tabs)/profile.tsx`, backend deletion function, DB RLS-aware cascade policy for `profiles`, `daily_goals`, `meals`, `chat_sessions`, `chat_messages`
  Database migration needed? Yes
  Security impact: High
  QA test steps: Delete account; verify auth user, `public.profiles`, `public.daily_goals`, `public.meals`, `public.chat_sessions`, `public.chat_messages` are removed or anonymized per policy
  Git commit message: `feat: add account deletion flow and data cleanup`
  Rollback plan: Hide deletion CTA until backend deletion is stable

- [ ] Add user data export flow
  Severity: P2
  Why it breaks production: Users should be able to export profile, meals, goals, and chat records.
  Exact files affected: `app/(tabs)/profile.tsx`, export backend function, repository/export service in `src/`
  Database migration needed? No
  Security impact: High
  QA test steps: Request export; verify returned file contains only current user data from `profiles`, `daily_goals`, `meals`, `chat_sessions`, `chat_messages`
  Git commit message: `feat: add user data export flow`
  Rollback plan: Remove export CTA while keeping backend function internal

## QA master checklist

- [ ] Test email/password auth flow: login, invalid credentials, sign out, session persistence, expired session recovery
- [ ] Test meal insert/delete flow on real user accounts using `public.meals`
- [ ] Validate RLS on `public.meals`, `public.profiles`, `public.daily_goals`, `public.chat_sessions`, and `public.chat_messages`
- [ ] Test Android keyboard behavior on login, meals modal/add screen, and chat input
- [ ] Test app cold start with signed-in and signed-out users
- [ ] Test tab switching consistency for dashboard, meals, chat, and profile without stale state
- [ ] Simulate API failures for Supabase, AI proxy, and Nutritionix proxy and verify error/retry UX
- [ ] Test offline behavior for launch, login attempt, dashboard load, meals load, and chat send
- [ ] Validate Expo production build on Android release profile and smoke test on a physical device

## Release checklist

- [ ] Validate all required environment variables at startup and fail fast with clear non-secret errors
- [ ] Remove duplicate Expo config sources and keep one canonical config from `app.config.ts`
- [ ] Run and install a release build, then smoke test auth, meals, dashboard, and chat
- [ ] Verify package IDs and bundle identifiers match target release values in Expo and native Android config
- [ ] Replace placeholder privacy and terms links in `app/(tabs)/profile.tsx`
- [ ] Complete Play Store Data safety disclosure for profile, nutrition, chat, and account data
