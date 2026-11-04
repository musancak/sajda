-- Sajda „Gemeinsam“ (Supabase-Projekt istanbul-guide, eigenes Schema sajda, von außen nur über die zwei Funktionen erreichbar)
-- Anonyme Zähler ohne Konto und ohne IP; der Ort wird auf ganze Grad gerundet (~100 km).
-- Einmal im Supabase-SQL-Editor ausführen (oder als Migration).
create schema if not exists sajda;
revoke all on schema sajda from public, anon, authenticated;

create table if not exists sajda.ereignisse(
  id bigserial primary key,
  zeit timestamptz not null default now(),
  art text not null check (art in ('gebet','kaza')),
  anzahl smallint not null default 1,
  lat smallint check (lat between -90 and 90),
  lon smallint check (lon between -180 and 180)
);
create index if not exists ereignisse_zeit on sajda.ereignisse(zeit);
alter table sajda.ereignisse enable row level security;

create table if not exists sajda.summen(art text primary key, gesamt bigint not null default 0);
alter table sajda.summen enable row level security;
insert into sajda.summen values ('gebet',0),('kaza',0) on conflict do nothing;

create or replace function public.sajda_melden(p_art text, p_anzahl int default 1, p_lat numeric default null, p_lon numeric default null)
returns void language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if p_art not in ('gebet','kaza') then raise exception 'art'; end if;
  n := case when p_art='gebet' then 1 else greatest(-3, least(3, coalesce(p_anzahl,1))) end;
  if n = 0 then return; end if;
  -- grobe Bremse gegen Massen-Aufrufe: höchstens 600 Meldungen pro Minute insgesamt
  if (select count(*) from sajda.ereignisse where zeit > now() - interval '1 minute') >= 600 then return; end if;
  insert into sajda.ereignisse(art, anzahl, lat, lon)
  values (p_art, n,
    case when p_lat between -90 and 90 then round(p_lat)::smallint end,
    case when p_lon between -180 and 180 then round(p_lon)::smallint end);
  update sajda.summen set gesamt = greatest(0, gesamt + n) where art = p_art;
  -- Einzelmeldungen nur 7 Tage aufheben, die Summen bleiben
  delete from sajda.ereignisse where zeit < now() - interval '7 days';
end $$;

create or replace function public.sajda_stand()
returns json language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'kaza', (select gesamt from sajda.summen where art='kaza'),
    'gebete', (select gesamt from sajda.summen where art='gebet'),
    'heute', (select count(*) from sajda.ereignisse where art='gebet' and zeit > now() - interval '24 hours'),
    'kazaWoche', (select coalesce(sum(anzahl),0) from sajda.ereignisse where art='kaza' and zeit > now() - interval '7 days'),
    'punkte', coalesce((select json_agg(json_build_object('lat',lat,'lon',lon,'n',n,'min',m)) from (
        select lat, lon, count(*) n, floor(extract(epoch from now() - max(zeit))/60)::int m
        from sajda.ereignisse where art='gebet' and lat is not null and zeit > now() - interval '24 hours'
        group by lat, lon) p), '[]'::json)
  ) $$;

revoke all on function public.sajda_melden(text,int,numeric,numeric) from public;
revoke all on function public.sajda_stand() from public;
grant execute on function public.sajda_melden(text,int,numeric,numeric) to anon, authenticated;
grant execute on function public.sajda_stand() to anon, authenticated;
