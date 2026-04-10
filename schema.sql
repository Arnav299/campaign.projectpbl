-- Enable RLS
alter table auth.users enable row level security;

-- PROFILES
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- CAMPAIGNS
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  status text check (status in ('draft', 'active', 'paused', 'completed')) default 'draft',
  budget numeric,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz default now()
);
alter table campaigns enable row level security;
create policy "Users can view own campaigns" on campaigns for select using (auth.uid() = user_id);
create policy "Users can insert own campaigns" on campaigns for insert with check (auth.uid() = user_id);
create policy "Users can update own campaigns" on campaigns for update using (auth.uid() = user_id);
create policy "Users can delete own campaigns" on campaigns for delete using (auth.uid() = user_id);

-- COHORTS
create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  definition jsonb not null, 
  created_at timestamptz default now()
);
alter table cohorts enable row level security;
create policy "Users can manage own cohorts" on cohorts for all using (auth.uid() = user_id);

-- TARGETING RULES
create table public.targeting_rules (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  type text check (type in ('contextual', 'brand_safety')),
  key_value text not null,
  operator text check (operator in ('include', 'exclude')),
  created_at timestamptz default now()
);
alter table targeting_rules enable row level security;
create policy "Users manage targeting via campaigns" on targeting_rules for all using (
  exists (select 1 from campaigns where id = targeting_rules.campaign_id and user_id = auth.uid())
);

-- EXPERIMENTS
create table public.experiments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  name text not null,
  type text check (type in ('ab_test', 'multi_arm_bandit')),
  status text default 'draft',
  config jsonb,
  created_at timestamptz default now()
);
alter table experiments enable row level security;
create policy "Users manage experiments via campaigns" on experiments for all using (
  exists (select 1 from campaigns where id = experiments.campaign_id and user_id = auth.uid())
);

-- METRICS
create table public.campaign_metrics (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  date date not null,
  impressions int default 0,
  clicks int default 0,
  conversions int default 0,
  spend numeric default 0,
  unique (campaign_id, date)
);
alter table campaign_metrics enable row level security;
create policy "Users view metrics via campaigns" on campaign_metrics for select using (
  exists (select 1 from campaigns where id = campaign_metrics.campaign_id and user_id = auth.uid())
);

-- Trigger for new user profile
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
