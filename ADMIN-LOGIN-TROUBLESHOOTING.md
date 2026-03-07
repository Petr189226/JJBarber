# Admin login – "Failed to fetch" troubleshooting

## Příznaky
- Chyba "Failed to fetch" při přihlášení
- V DevTools → Network: `token?grant_type=password` (failed), často s preflight (OPTIONS)

## Možné příčiny a řešení

### 1. Supabase URL Configuration
V **Supabase Dashboard** → **Authentication** → **URL Configuration**:

- **Site URL**: Nastavte na produkční URL (např. `https://vasadomena.cz`)
- **Redirect URLs**: Přidejte:
  - `https://vasadomena.cz/**`
  - `https://vasadomena.cz/admin`
  - `https://vasadomena.cz/admin/`

### 2. Ad blocker / rozšíření prohlížeče
- Vypněte ad blocker (uBlock, AdBlock atd.)
- Zkuste anonymní/inkognito okno
- Zkuste jiný prohlížeč

### 3. Síť / firewall
- Zkuste jinou síť (mobilní data místo WiFi)
- Zkuste jiné zařízení
- Ověřte, že `https://jdtijmhosifocswsgdgx.supabase.co` je dostupný (otevřete v prohlížeči)

### 4. Supabase stav
- [Supabase Status](https://status.supabase.com) – zkontrolujte výpadky
- V minulosti byly problémy s billingem – mohly ovlivnit auth

### 5. Mixed content
- Stránka musí být na **HTTPS** (ne HTTP)
- Pokud je admin na HTTP, požadavky na Supabase (HTTPS) mohou být blokovány

### 6. DevTools – další diagnostika
V Console zkuste:
```js
fetch('https://jdtijmhosifocswsgdgx.supabase.co/auth/v1/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```
Pokud selže – problém je síťový nebo CORS.
