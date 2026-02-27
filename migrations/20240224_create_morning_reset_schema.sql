-- Morning Reset Database Schema
-- Created: 2026-02-24

-- Create users table
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create sessions table for authentication
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  token text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create morning_routines table
create table public.morning_routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create routine_tasks table
create table public.routine_tasks (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid references public.morning_routines(id) on delete cascade,
  title text not null,
  description text,
  completed boolean default false,
  order_index integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create routine_completions table
create table public.routine_completions (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid references public.morning_routines(id) on delete cascade,
  completed_at timestamp with time zone default now(),
  notes text
);

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.morning_routines enable row level security;
alter table public.routine_tasks enable row level security;
alter table public.routine_completions enable row level security;

-- Add basic indexes for performance
create index on public.morning_routines(user_id);
create index on public.routine_tasks(routine_id);
create index on public.routine_completions(routine_id);