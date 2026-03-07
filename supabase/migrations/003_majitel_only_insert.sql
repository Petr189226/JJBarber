drop policy if exists "First user or majitel can insert" on admin_roles;
create policy "Majitel can insert roles" on admin_roles
  for insert with check (
    exists (select 1 from admin_roles where user_id = auth.uid() and role = 'majitel')
  );
