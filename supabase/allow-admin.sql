-- Run after creating the admin account in Supabase Authentication → Users.
-- This grants admin access to the account with this Auth user UUID.
insert into public.admin_users (user_id)
values ('09d7f77b-7707-4879-a6ca-9f818525b093'::uuid)
on conflict (user_id) do nothing;
