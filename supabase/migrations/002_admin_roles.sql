-- Role správců: majitel (může měnit stav), barber (jen náhled)
-- Spusť v Supabase SQL Editor po 001_voucher_orders.sql

create table if not exists admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('majitel', 'barber'))
);

alter table admin_roles enable row level security;

-- Čtení: přihlášení vidí svou roli
drop policy if exists "Users can read own role" on admin_roles;
create policy "Users can read own role" on admin_roles
  for select using (auth.uid() = user_id);

-- První uživatel si může nastavit majitel (tabulka prázdná)
-- Majitel může přidat barbera nebo dalšího majitele
drop policy if exists "First user or majitel can insert" on admin_roles;
create policy "First user or majitel can insert" on admin_roles
  for insert with check (
    (user_id = auth.uid() and role = 'majitel' and not exists (select 1 from admin_roles))
    or
    (exists (select 1 from admin_roles where user_id = auth.uid() and role = 'majitel'))
  );

-- voucher_orders: jen majitel může UPDATE
drop policy if exists "Authenticated can read and update" on voucher_orders;
drop policy if exists "Authenticated can read" on voucher_orders;
create policy "Authenticated can read" on voucher_orders
  for select using (auth.role() = 'authenticated');

drop policy if exists "Majitel can update voucher status" on voucher_orders;
create policy "Majitel can update voucher status" on voucher_orders
  for update using (
    exists (select 1 from admin_roles where user_id = auth.uid() and role = 'majitel')
  )
  with check (
    exists (select 1 from admin_roles where user_id = auth.uid() and role = 'majitel')
  );
