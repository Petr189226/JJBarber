create table if not exists voucher_orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  surname text,
  email text not null,
  phone text,
  service text not null,
  branch text not null,
  note text,
  status text not null default 'new' check (status in ('new', 'pending', 'done')),
  created_at timestamptz default now()
);

alter table voucher_orders enable row level security;

drop policy if exists "Anyone can insert voucher orders" on voucher_orders;
create policy "Anyone can insert voucher orders" on voucher_orders
  for insert with check (true);

drop policy if exists "Authenticated can read and update" on voucher_orders;
create policy "Authenticated can read and update" on voucher_orders
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists voucher_orders_created_at_idx on voucher_orders (created_at desc);
