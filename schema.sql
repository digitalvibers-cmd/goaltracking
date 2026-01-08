-- Create Profiles table (extension of auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  updated_at timestamp with time zone
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );


-- Create Goals table
create type goal_category as enum ('Personal', 'Business', 'Health', 'Education', 'Other');
create type goal_status as enum ('Active', 'Completed', 'OnHold');

create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  category goal_category default 'Personal',
  status goal_status default 'Active',
  deadline timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.goals enable row level security;

create policy "Users can CRUD their own goals."
  on goals for all
  using ( auth.uid() = user_id );


-- Create Metrics table
create table public.metrics (
  id uuid default gen_random_uuid() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  title text not null, -- e.g. "Money Saved"
  target_value numeric not null,
  current_value numeric default 0,
  unit text, -- e.g. "EUR", "kg"
  created_at timestamp with time zone default now()
);

alter table public.metrics enable row level security;

create policy "Users can CRUD their own metrics."
  on metrics for all
  using ( 
    auth.uid() in (
      select user_id from public.goals where id = goal_id
    )
  );


-- Create Activities table
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  title text not null,
  description text,
  is_recurring boolean default false,
  recurrence_pattern text, -- JSON string or simple text e.g. "Mon, Wed"
  scheduled_at timestamp with time zone,
  is_completed boolean default false,
  google_calendar_event_id text,
  created_at timestamp with time zone default now()
);

alter table public.activities enable row level security;

create policy "Users can CRUD their own activities."
  on activities for all
  using ( 
    auth.uid() in (
      select user_id from public.goals where id = goal_id
    )
  );
