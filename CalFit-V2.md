# CALFIT V2 PRODUCTION READINESS ROADMAP

## Current Foundation (As of April 2026)

### Completed
- [x] Expo SDK 54 migration complete
- [x] Stable onboarding flow: `onboarding -> gender -> measurements -> nutrition -> register`
- [x] Stable email/password login with Supabase Auth
- [x] Supabase v2 backend connected
- [x] `public.profiles` table with RLS and full schema (activity_level, goal, target_calories)
- [x] `public.meals` table with RLS (CRUD operations)
- [x] Session restore works on cold start
- [x] Dashboard driven by real profile data + meal aggregation
- [x] Food search via Open Food Facts API (Edge Function + frontend normalization)
- [x] AI chat via OpenRouter (Edge Function + DeepSeek)
- [x] Dark mode with Light/Dark/System options + AsyncStorage persistence
- [x] Macro calculation from target_calories (50/30/20 split)

### Key Files
- **Edge Functions:** `supabase/functions/nutrition-search/`, `supabase/functions/ai-chat/`
- **Services:** `src/services/supabase.ts`, `src/services/nutritionService.ts`, `src/services/aiService.ts`
- **Theme:** `src/theme/ThemeContext.tsx`, `src/theme/useTheme.ts`, `src/theme/colors.ts`
- **Calculators:** `src/lib/macroCalculator.ts`, `src/lib/calorieCalculator.ts`

---

## P0 - Launch Blockers (Remaining)

- [ ] Require authenticated user tokens for Edge Functions
  Severity: P0 | Security impact: Critical
  Both AI and nutrition Edge Functions use anon key only. Functions do not validate user auth.

- [ ] Reset user-derived local state on logout and account switch
  Severity: P0 | Security impact: Medium
  OnboardingContext is not reset on logout, risking stale data leak across sessions.

- [ ] Harden meals schema and RLS with real migrations
  Severity: P0 | Security impact: High
  Meals policies need canonical migration under `supabase/migrations/`.

- [ ] Add real loading, retry, and empty-state UX for core screens
  Severity: P0 | Security impact: Low
  Core screens rely on basic spinners and plain text errors.

- [ ] Canonicalize Expo release config
  Severity: P0 | Security impact: Medium
  `app.config.ts` and `app.json` may conflict on package IDs.

- [ ] Replace placeholder app assets
  Severity: P0 | Security impact: None
  `/assets/` contains placeholder files.

---

## P1 - Beta Polish

- [ ] Add editable profile screen backed by `public.profiles`
- [ ] Refresh dashboard from meal mutations and tab focus
- [ ] Convert meals and chat from `ScrollView` to `FlatList`
- [ ] Add optimistic meal deletion with rollback or undo
- [ ] Add debounced food search
- [ ] Add portion scaling for food items
- [ ] Add explicit offline fallback UX and "last synced" messaging
- [ ] Add button/request dedupe for meal save, delete, login, signup, and chat send
- [ ] Improve profile null handling and first-run empty states

---

## P2 - Scale Improvements

- [ ] Add repository layer for Supabase and Edge Function access
- [ ] Extract reusable hooks for auth, profile, meals, dashboard, and chat
- [ ] Adopt TanStack Query or equivalent server-state caching
- [ ] Persist chat sessions and rolling message history
- [ ] Add analytics instrumentation for funnel and retention events
- [ ] Add crash reporting with sanitized payloads
- [ ] Add account deletion flow and data cleanup
- [ ] Add user data export flow
- [ ] Add Edge Function latency monitoring and structured backend logging

---

## Resolved Issues (Recent Fixes)

### NaN Bug in Food Search (FIXED)
**Problem:** Frontend expected Nutritionix format (`nf_calories`) but Edge returned Open Food Facts format (`calories`).

**Fix:** 
- Frontend `nutritionService.ts` now maps `food.calories` directly
- Added `safeNumber()` helper to prevent NaN at all layers
- Added fallback for `energy_100g / 4.184` when `energy-kcal_100g` is missing

### API Migration (FIXED)
**Problem:** Nutritionix API no longer provides free access.

**Solution:** Replaced with Open Food Facts API
- Free, no API key required
- 2.5M+ food products
- Normalized via Edge Function

### Dark Mode Architecture (COMPLETED)
**Implementation:**
- `ThemeContext.tsx` - State management + AsyncStorage persistence
- `useTheme.ts` - Hook returning resolved theme
- `colors.ts` - Light/dark color definitions
- Profile settings UI with Light/Dark/System options

### Dashboard Data Flow (COMPLETED)
**Pipeline:**
```
User → meals.tsx → supabase.addMeal() → DB
                              ↓
getTodayMeals() → Dashboard aggregates → Macros + Calories
```

---

## QA Master Checklist

- [x] Test email/password auth flow: login, invalid credentials, sign out, session persistence
- [x] Test onboarding register flow: `onboarding -> gender -> measurements -> nutrition -> register -> dashboard`
- [x] Verify register failure handling
- [x] Test food search returns valid data (no NaN)
- [x] Test meal logging and deletion
- [x] Test dashboard aggregates from real meals
- [x] Test dark mode toggle persists across restarts
- [ ] Verify existing-user login hydrates `public.profiles` and dashboard/profile surfaces
- [ ] Verify logout clears onboarding/profile-derived local state
- [ ] Validate RLS on `public.meals`, `public.profiles`
- [ ] Test app cold start with signed-in and signed-out users
- [ ] Test dashboard refresh after meal add/delete and tab switching
- [ ] Simulate API failures and verify retry UX
- [ ] Test offline behavior for launch, login, meals load, chat send
- [ ] Validate Edge Functions reject unauthenticated requests
- [ ] Build and test on physical Android device

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native + Expo SDK 54 |
| Routing | Expo Router |
| Language | TypeScript |
| UI Components | React Native Paper (Material Design 3) |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| Food Data | Open Food Facts API (free) |
| AI | DeepSeek via OpenRouter |
| Build | EAS Build (New Architecture enabled) |
| Theme | Custom ThemeContext with AsyncStorage |

---

## Recent Commits Summary

```
# Theme System
feat: add light and dark theme color definitions
feat: add useTheme hook for system-based dark mode
feat: add ThemeContext with Light/Dark/System mode and AsyncStorage persistence
refactor: update useTheme hook to use ThemeContext
feat: wrap app with ThemeProvider for theme context
feat: add theme selector with Light/Dark/System options in profile

# Food Search
feat: replace Nutritionix with Open Food Facts API (free alternative)
fix: improve edge function parsing with logging and safe normalization
fix: add safeNumber helper to prevent NaN values in nutrition search
fix: align frontend mapping with Open Food Facts response format
fix: add safe number display and logging in meals UI

# Dashboard
feat: apply theme to dashboard cards, text, and meal items
```
