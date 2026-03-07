# Supabase – co kam vložit

## 1. Soubor `.env` (v kořeni projektu)

Vytvoř nebo uprav soubor `.env`:

```
VITE_SUPABASE_URL=https://jdtijmhosifoccwsgdgx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_BJ1pMwsKOK0pRw7lWPBLqg_vEVbkWud
```

## 2. Edge Function – service_role key (Supabase Secrets)

Pro nasazení funkce `create-admin` potřebuješ **service_role** key (ne publishable):

1. Supabase Dashboard → **Settings** → **API**
2. V sekci **Legacy API Keys** nebo **Project API keys** najdi **service_role**
3. Klikni **Reveal** a zkopíruj hodnotu
4. Spusť v terminálu:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=zkopírovaná_hodnota
```

## 3. Nasazení Edge Function

```bash
brew install supabase/tap/supabase
supabase login
supabase link --project-ref jdtijmhosifoccwsgdgx
supabase functions deploy create-admin
```

---

**Poznámka:** Database URL (`postgresql://...`) se používá jen pro přímé připojení k databázi (např. migrace). Pro web a admin stačí URL + klíče výše.
