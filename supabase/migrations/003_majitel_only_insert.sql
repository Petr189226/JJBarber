-- Majitel se vytváří jen v Supabase. Jen majitel může přidávat správce (majitel nebo barber).
-- Spusť v Supabase SQL Editor.

drop policy if exists "First user or majitel can insert" on admin_roles;
create policy "Majitel can insert roles" on admin_roles
  for insert with check (
    exists (select 1 from admin_roles where user_id = auth.uid() and role = 'majitel')
  );
