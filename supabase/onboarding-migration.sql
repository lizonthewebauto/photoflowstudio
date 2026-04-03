-- Onboarding & Subscription Migration
-- Run this in Supabase SQL Editor

-- Add onboarding tracking to profiles
alter table public.profiles
  add column if not exists onboarding_step int not null default 0,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists stripe_subscription_id text,
  add column if not exists billing_interval text check (billing_interval in ('month', 'year'));

-- Allow profiles insert for the trigger
create policy if not exists "Allow profile insert on signup"
  on public.profiles for insert
  with check (auth.uid() = id);
