create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  avatar_url text,
  cover_url text,
  socials jsonb default '{}'::jsonb,
  stacks jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete set null,
  slug text unique not null,
  title text not null,
  subtitle text,
  content text,
  hero_image_url text,
  gallery jsonb default '[]'::jsonb,
  tags text[] default array[]::text[],
  external_link text,
  rating int check (rating between 0 and 5),
  status text default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  content text not null,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

create policy "public_read_posts" on posts for select using (status = 'published');
create policy "public_read_profiles" on profiles for select using (true);
create policy "public_read_comments" on comments for select using (status = 'approved');
