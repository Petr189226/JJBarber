# Kompletní návod – co udělat teď

## Část 1: Získat service_role key v Supabase

1. Jsi na stránce **Project Overview** (jak na tvém obrázku).
2. V **levém menu** dole klikni na **Project Settings** (ikona ozubeného kolečka).
3. V nastavení v levém menu klikni na **API**.
4. Sjeď dolů – uvidíš sekci **Project API keys** nebo **Legacy API Keys**.
5. Najdi řádek **service_role** (ne anon, ne publishable).
6. Klikni na **Reveal** nebo ikonu oka – zobrazí se dlouhý klíč (začíná obvykle `eyJ...`).
7. Klikni na ikonu **kopírovat** a ulož si ho (do poznámek, do souboru – budeš ho potřebovat v kroku 11).

---

## Část 2: Nainstalovat Supabase CLI

V terminálu (Terminal.app nebo VS Code):

```bash
brew install supabase/tap/supabase
```

Počkej, až se nainstaluje.

---

## Část 3: Přihlásit se do Supabase

```bash
supabase login
```

Otevře se prohlížeč – přihlas se svým Supabase účtem a povol přístup.

---

## Část 4: Propojit projekt

V terminálu (musíš být ve složce projektu):

```bash
cd /Users/petr/jj-barbershop
supabase link --project-ref jdtijmhosifoccwsgdgx
```

Když se zeptá na databázové heslo, zadej heslo k PostgreSQL z tvého Supabase projektu (Settings → Database → Database password).

---

## Část 5: Nastavit service_role key jako secret

Vlož sem klíč z kroku 1 (celý, v uvozovkách pokud obsahuje speciální znaky):

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="tvůj_zkopírovaný_service_role_klíč"
```

Příklad (nahraď skutečnou hodnotou):
```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs..."
```

---

## Část 6: Nasadit Edge Function

```bash
supabase functions deploy create-admin
```

Počkej, až se nasadí. Mělo by se zobrazit „Deployed successfully“.

---

## Část 7: Ověřit .env

V kořeni projektu (`/Users/petr/jj-barbershop`) zkontroluj soubor `.env`. Měl by obsahovat:

```
VITE_SUPABASE_URL=https://jdtijmhosifoccwsgdgx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_BJ1pMwsKOK0pRw7lWPBLqg_vEVbkWud
```

Pokud `.env` neexistuje, vytvoř ho a vlož tyto řádky.

---

## Část 8: Znovu nasadit web

```bash
cd /Users/petr/jj-barbershop
npm run build
node scripts/zip-for-websupport.mjs
```

Rozbal ZIP z plochy a nahraj obsah do `public_html` přes FileZilla.

---

## Shrnutí – co máš po všech krocích

- Edge Function `create-admin` nasazená v Supabase
- Web s novým buildem nahraný na hosting
- Přidávání správců v adminu funguje bez odhlašování

---

## Když něco nejde

**„supabase: command not found“**  
→ Zkus znovu `brew install supabase/tap/supabase` a restartuj terminál.

**„Project not linked“**  
→ Spusť znovu `supabase link --project-ref jdtijmhosifoccwsgdgx`.

**„Chyba při přidávání správce“**  
→ Ověř, že Edge Function je nasazená: Supabase Dashboard → Edge Functions → měla by tam být `create-admin`.

**„Nastav SUPABASE_SERVICE_ROLE_KEY“**  
→ Znovu spusť `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tvůj_klíč` s platným service_role klíčem.
