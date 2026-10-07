
create table if not exists public.max_disc_config (
 id boolean primary key default true check(id),
 backend_token text not null check(length(backend_token)>=48),
 created_at timestamptz not null default now()
);
create table if not exists public.max_disc_results (
 id uuid primary key,
 created_at timestamptz not null default now(),
 name text not null check(length(name) between 3 and 120),
 email text not null check(length(email)<=180),
 unit text not null,
 role text not null check(length(role) between 2 and 100),
 goal text not null,
 answers jsonb not null check(jsonb_typeof(answers)='array' and jsonb_array_length(answers)=40),
 result jsonb not null,
 questionnaire_version text not null,
 privacy_version text not null,
 consent_at timestamptz not null default now(),
 payload_hash text not null,
 email_status text not null default 'pending' check(email_status in ('pending','sending','sent','failed')),
 email_attempts integer not null default 0,
 email_first_attempt_at timestamptz,
 email_last_attempt_at timestamptz,
 email_next_attempt_at timestamptz,
 email_sent_at timestamptz,
 email_provider_id text,
 email_error text
);
create index if not exists max_disc_mail_queue on public.max_disc_results (email_status, email_next_attempt_at);
create table if not exists public.max_disc_rate_limits (
 key text primary key,
 bucket timestamptz not null,
 count integer not null
);
alter table public.max_disc_config enable row level security;
alter table public.max_disc_results enable row level security;
alter table public.max_disc_rate_limits enable row level security;
revoke all on public.max_disc_config, public.max_disc_results, public.max_disc_rate_limits from public, anon, authenticated;
grant all on public.max_disc_config, public.max_disc_results, public.max_disc_rate_limits to service_role;

create or replace function public.max_disc_take_rate(p_key text, p_limit integer, p_window integer)
returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer; b timestamptz;
begin
 if p_limit<1 or p_window<60 then return false; end if;
 b:=to_timestamp(floor(extract(epoch from now())/p_window)*p_window);
 insert into public.max_disc_rate_limits as t(key,bucket,count) values(p_key,b,1)
 on conflict(key) do update set bucket=excluded.bucket, count=case when t.bucket=excluded.bucket then t.count+1 else 1 end
 returning count into n;
 delete from public.max_disc_rate_limits where bucket<now()-interval '7 days';
 return n<=p_limit;
end; $$;
revoke execute on function public.max_disc_take_rate(text,integer,integer) from public,anon,authenticated;
grant execute on function public.max_disc_take_rate(text,integer,integer) to service_role;

create or replace function public.max_disc_claim_email(p_id uuid default null)
returns setof public.max_disc_results language sql security invoker set search_path='' as $$
 with candidates as (
 select id from public.max_disc_results
 where (p_id is null or id=p_id)
 and (email_status in ('pending','failed') or (email_status='sending' and email_last_attempt_at<now()-interval '10 minutes'))
 and email_attempts<5
 and (email_next_attempt_at is null or email_next_attempt_at<=now())
 and (email_first_attempt_at is null or email_first_attempt_at>now()-interval '23 hours')
 order by created_at for update skip locked limit 10
 )
 update public.max_disc_results r set email_status='sending', email_attempts=email_attempts+1,
 email_first_attempt_at=coalesce(email_first_attempt_at,now()), email_last_attempt_at=now()
 from candidates c where r.id=c.id returning r.*;
$$;
revoke execute on function public.max_disc_claim_email(uuid) from public,anon,authenticated;
grant execute on function public.max_disc_claim_email(uuid) to service_role;


-- Optional recruitment details; legacy results stay unchanged.
alter table public.max_disc_results add column if not exists recruitment jsonb
 check (recruitment is null or jsonb_typeof(recruitment)='object');
