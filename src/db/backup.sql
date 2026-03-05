create table public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text,
  album text,
  duration_sec integer,
  source text not null,
  source_id text,
  youtube_url text,
  storage_path text not null,
  file_size bigint,
  mime_type text default 'audio/mpeg',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.playlist_items (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid references public.playlists(id) on delete cascade,
  song_id uuid references public.songs(id) on delete cascade,
  position integer not null,
  added_at timestamptz default now()
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  song_id uuid references public.songs(id) on delete cascade,
  created_at timestamptz default now()
);