# Nasazení J&J Barber Shop na Websupport

## 1. Co máš připravené

- **`jj-barbershop-websupport.zip`** – archiv se všemi soubory webu (vytvořen po `npm run deploy-websupport`)
- **`.htaccess`** – už je v archivu, zajišťuje správné fungování SPA (hash odkazy)

### Supabase (voucher + admin)

Pro fungování voucher formuláře a admin stránky potřebuješ mít v projektu soubor **`.env`** s hodnotami Supabase:

```
VITE_SUPABASE_URL=https://jdtijmhosifoccwsgdgx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (tvůj anon key)
```

Získej je v Supabase Dashboard → **Settings** → **API**. Před buildem musí být `.env` na místě – hodnoty se vloží do buildu při kompilaci.

## 2. Postup nasazení

### Krok 1: Rozbal archiv
Rozbal `jj-barbershop-websupport.zip` – uvnitř bude:
```
index.html
jj-backstage/   (fallback pro /jj-backstage)
.htaccess
assets/          (JS, CSS)
hero-*.webp, hero.png
logo-*.webp, logo.png
location-*.png
map-*.webp
team/            (fotky barberů)
favicon.ico, favicon-*.png
apple-touch-icon.png
```

### Krok 2: Nahrát na Websupport
1. Přihlas se do Websupport → **Hostingy** → svůj hosting
2. Otevři **Správce souborů** nebo se připoj přes **FTP/SFTP**
3. Přejdi do složky **`public_html`** (nebo **`www`**)
4. **Smaž** obsah, který tam je (pokud nějaký je)
5. **Nahraj** všechny soubory z rozbaleného archivu – včetně složek `assets/` a `team/`

Důležité: soubory musí být přímo v `public_html`, ne v podsložce. Tedy:
```
public_html/index.html
public_html/jj-backstage/index.html
public_html/.htaccess
public_html/assets/...
public_html/hero-768.webp
...
```

**FileZilla:** Zapni zobrazení skrytých souborů (Server → Force showing hidden files), aby se nahrál `.htaccess`. Bez něj funguje SPA díky složce `jj-backstage/`.

### Krok 3: Propojit doménu
V nastavení hostingu přiřaď svou doménu k tomuto účtu (pokud ještě není).

---

## 3. Doména

Web je připraven pro **jjbarbershop.cz**. Meta tagy, OG obrázky a canonical URL už odkazují na tuto doménu.

---

## 4. Jak aktualizovat web v budoucnu

```bash
cd /Users/petr/jj-barbershop
npm run deploy-websupport
```

Vznikne `jj-barbershop-websupport.zip`. Rozbal ho a nahraj obsah do `public_html` (přepíše staré soubory).

---

## 5. Kontrola

Po nahrání otevři svou doménu v prohlížeči. Měl bys vidět:
- Hero sekci s „Tvůj barber shop na Praze 10“
- Pobočky, Tým, Ceník, Recenze, Rezervace
- Tlačítko Rezervovat termín (odkaz na Reservio)
- Dárkový poukaz (formulář) – pokud máš `.env` s Supabase
- Admin: `https://jjbarbershop.cz/jj-backstage` – přihlášení pro správu voucherů (skrytá cesta)
