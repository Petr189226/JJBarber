# Supabase – voucher objednávky a admin

## ⚠️ PŘED PRVNÍM ODESLÁNÍM VOUCHERU

**Tabulka `voucher_orders` musí existovat v databázi.** Spusť migraci:

```bash
npm run supabase:setup
```

Skript zkopíruje SQL do schránky a otevře Supabase SQL Editor. Vlož (Ctrl+V) a klikni **RUN**.

Bez toho uvidíš chybu: *"Could not find the table 'public.voucher_orders'"*.

---

## 1. Vytvoř projekt na Supabase

1. Jdi na [supabase.com](https://supabase.com) a založ účet
2. **New Project** → vyplň název, heslo DB, region (např. Frankfurt)
3. Po vytvoření: **Project Settings** → **API** → zkopíruj:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 2. Nastav env proměnné

V kořeni projektu vytvoř soubor `.env`:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

(Nepřidávej `.env` do gitu – je v `.gitignore`.)

## 3. Spusť SQL migraci

1. V Supabase: **SQL Editor** → **New query**
2. Zkopíruj obsah `supabase/migrations/001_voucher_orders.sql`
3. Spusť (Run)

## 4. Spusť migraci rolí

1. Spusť `npm run supabase:setup-roles` – zkopíruje SQL do schránky
2. V Supabase SQL Editoru vlož a spusť (Run)
3. Spusť migraci 003: `npm run supabase:setup-roles-003` – zkopíruje SQL, vlož a spusť v Supabase

## 5. Vytvoř prvního Majitele (hlavní účet)

1. V Supabase: **Authentication** → **Users** → **Add user** – zadej e-mail a heslo
2. Zkopíruj **User UID** (klikni na uživatele)
3. **Table Editor** → **admin_roles** → **Insert row**
   - `user_id` = UID z kroku 2
   - `role` = `majitel`

## 6. Admin rozhraní

- **URL:** `https://jjbarbershop.cz/jj-backstage` (skrytá cesta, není v menu)
- **Přihlášení:** e-mail + heslo Majitele
- **Funkce:** seznam objednávek voucherů, změna stavu (Nový / Rozpracováno / Vyřízeno)
- **Přidat správce:** Majitel může vytvářet další Majitele nebo Barbery přímo v adminu
- **Role:** Majitel může měnit stavy voucherů a přidávat správce. Barber má jen náhled (read-only).

**Tip:** Aby nově vytvoření správci mohli hned přihlásit, vypni v Supabase **Authentication** → **Providers** → **Email** → **Confirm email**.

## 7. Edge Function pro přidávání správců (důležité!)

Bez nasazené Edge Function by se při přidání nového správce přepnula session na nového uživatele a Majitel by byl „vyhozen“ z adminu. Edge Function vytváří uživatele na serveru, takže session zůstane.

**Nasazení:**

1. Nainstaluj [Supabase CLI](https://supabase.com/docs/guides/cli): `npm install -g supabase`
2. Přihlas se: `supabase login`
3. Propoj projekt: `supabase link --project-ref jdtijmhosifoccwsgdgx` (nebo tvé project ref)
4. Nastav secret: `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tvůj_service_role_key`  
   (Service role key: Supabase Dashboard → Settings → API → service_role)
5. Nasad funkci: `supabase functions deploy create-admin`

Bez nasazené funkce přidávání správců v adminu nebude fungovat (chyba při volání).

## Kde se databáze spravuje

**Supabase Dashboard** → [app.supabase.com](https://app.supabase.com)

- **Table Editor** – prohlížení a editace dat
- **SQL Editor** – spouštění SQL
- **Authentication** – správa uživatelů
- **Settings** – API klíče, zálohy

## Bez Supabase

Pokud env proměnné nejsou nastavené, formulář voucheru zobrazí chybu. Admin zobrazí hlášku o chybějící konfiguraci.
