-- Rode este arquivo uma vez no SQL Editor do Supabase.

create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  usuario text not null unique,
  xp integer not null default 0,
  sequencia integer not null default 0,
  atualizado_em timestamptz not null default now()
);

create table if not exists public.progresso (
  user_id uuid primary key references auth.users (id) on delete cascade,
  dados jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);

alter table public.perfis enable row level security;
alter table public.progresso enable row level security;

-- Ranking: qualquer pessoa logada vê usuário, xp e sequência de todos.
drop policy if exists "perfis visiveis para logados" on public.perfis;
create policy "perfis visiveis para logados" on public.perfis
  for select to authenticated using (true);

drop policy if exists "atualiza o proprio perfil" on public.perfis;
create policy "atualiza o proprio perfil" on public.perfis
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Progresso: cada pessoa só enxerga e altera o seu.
drop policy if exists "progresso proprio" on public.progresso;
create policy "progresso proprio" on public.progresso
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
