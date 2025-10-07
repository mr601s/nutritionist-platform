-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text not null check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create admin_invites table
create table if not exists public.admin_invites (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  token text unique not null,
  invited_by uuid references public.profiles(id) on delete set null,
  used boolean default false,
  used_at timestamp with time zone,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.admin_invites enable row level security;

-- Admin invites policies
create policy "Only admins can view invites"
  on public.admin_invites for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can create invites"
  on public.admin_invites for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update invites"
  on public.admin_invites for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger for profiles updated_at
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();
