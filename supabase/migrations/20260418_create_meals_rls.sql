-- Meals table RLS policies
-- Created: 2026-04-18
-- Applied via Supabase Dashboard

-- Enable RLS on meals table
alter table public.meals enable row level security;

-- Policy: Users can view own meals
drop policy if exists "Users can view own meals" on public.meals;
create policy "Users can view own meals"
  on public.meals
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert own meals
drop policy if exists "Users can insert own meals" on public.meals;
create policy "Users can insert own meals"
  on public.meals
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policy: Users can delete own meals
drop policy if exists "Users can delete own meals" on public.meals;
create policy "Users can delete own meals"
  on public.meals
  for delete
  using (auth.uid() = user_id);

-- Policy: Users can update own meals
drop policy if exists "Users can update own meals" on public.meals;
create policy "Users can update own meals"
  on public.meals
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);