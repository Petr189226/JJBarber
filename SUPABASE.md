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

## 4. Vytvoř admin účet

1. V Supabase: **Authentication** → **Users** → **Add user**
2. Zadej e-mail a heslo (např. tvůj firemní e-mail)
3. Tímto účtem se přihlásíš na `/admin`

## 5. Admin rozhraní

- **URL:** `https://jjbarbershop.cz/jj-backstage` (skrytá cesta, není v menu)
- **Přihlášení:** e-mail + heslo z kroku 4
- **Funkce:** seznam objednávek voucherů, změna stavu (Nový / Rozpracováno / Vyřízeno)
- **Přidat dalšího správce:** v adminu rozbal „Přidat dalšího správce“ – majitelé si vytvoří účty pro kolegy přímo v UI, bez přístupu do Supabase
- **Role:** Majitel může měnit stavy voucherů a přidávat správce. Barber má jen náhled (read-only).

**Migrace rolí:** Po prvním nastavení spusť `npm run supabase:setup-roles` a v Supabase SQL Editoru spusť migraci. První přihlášený správce si pak v adminu nastaví „Nastavit jako majitel“.

**Tip:** Aby nově vytvoření správci mohli hned přihlásit, vypni v Supabase **Authentication** → **Providers** → **Email** → **Confirm email**.

## Kde se databáze spravuje

**Supabase Dashboard** → [app.supabase.com](https://app.supabase.com)

- **Table Editor** – prohlížení a editace dat
- **SQL Editor** – spouštění SQL
- **Authentication** – správa uživatelů
- **Settings** – API klíče, zálohy

## Bez Supabase

Pokud env proměnné nejsou nastavené, formulář voucheru zobrazí chybu. Admin zobrazí hlášku o chybějící konfiguraci.
