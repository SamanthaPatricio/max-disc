
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
select cron.schedule('max-disc-email-retry','*/10 * * * *',$job$
 select net.http_post(
  url:='https://imnrzfnloigigilmgbjt.supabase.co/functions/v1/max-disc',
  headers:=jsonb_build_object('Content-Type','application/json','X-Max-Disc-Token',(select backend_token from public.max_disc_config where id=true)),
  body:='{"action":"retry"}'::jsonb,
  timeout_milliseconds:=90000
 )
 where exists (
  select 1 from public.max_disc_results where email_status in ('pending','failed','sending')
  and email_attempts<5
  and (email_next_attempt_at is null or email_next_attempt_at<=now())
  and (email_first_attempt_at is null or email_first_attempt_at>now()-interval '23 hours')
 );
$job$);

