# Supabase – voucher objednávky a admin

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

## 4. Vytvoř admin účet

1. V Supabase: **Authentication** → **Users** → **Add user**
2. Zadej e-mail a heslo (např. tvůj firemní e-mail)
3. Tímto účtem se přihlásíš na `/admin`

## 5. Admin rozhraní

- **URL:** `https://tvojedomena.cz/admin`
- **Přihlášení:** e-mail + heslo z kroku 4
- **Funkce:** seznam objednávek voucherů, změna stavu (Nový / Rozpracováno / Vyřízeno)

## Kde se databáze spravuje

**Supabase Dashboard** → [app.supabase.com](https://app.supabase.com)

- **Table Editor** – prohlížení a editace dat
- **SQL Editor** – spouštění SQL
- **Authentication** – správa uživatelů
- **Settings** – API klíče, zálohy

## Bez Supabase

Pokud env proměnné nejsou nastavené, formulář voucheru zobrazí chybu. Admin zobrazí hlášku o chybějící konfiguraci.
