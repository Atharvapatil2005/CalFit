create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  gender text check (gender in ('male', 'female')),
  age integer,
  height numeric,
  weight numeric,
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active')),
  goal text check (goal in ('lose_weight', 'maintain_weight', 'gain_weight')),
  health_goal text check (health_goal in ('lose_weight', 'maintain_weight', 'gain_weight')),
  additional_goals text[] not null default '{}',
  dietary_preference text check (dietary_preference in ('none', 'vegetarian', 'vegan', 'pescatarian')),
  dietary_restrictions text[] not null default '{}',
  target_calories integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "allow insert own profile" on public.profiles;
create policy "allow insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
