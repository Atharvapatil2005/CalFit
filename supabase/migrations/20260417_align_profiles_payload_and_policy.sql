alter table public.profiles
add column if not exists activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active'));

alter table public.profiles
add column if not exists goal text check (goal in ('lose_weight', 'maintain_weight', 'gain_weight'));

drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "allow insert own profile" on public.profiles;

create policy "allow insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);
