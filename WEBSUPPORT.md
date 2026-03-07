# Nasazení J&J Barber Shop na Websupport

## 1. Co máš připravené

- **`jj-barbershop-websupport.zip`** – archiv se všemi soubory webu (vytvořen po `npm run build`)
- **`.htaccess`** – už je v archivu, zajišťuje správné fungování SPA (hash odkazy)

## 2. Postup nasazení

### Krok 1: Rozbal archiv
Rozbal `jj-barbershop-websupport.zip` – uvnitř bude:
```
index.html
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
public_html/.htaccess
public_html/assets/...
public_html/hero-768.webp
...
```

### Krok 3: Propojit doménu
V nastavení hostingu přiřaď svou doménu k tomuto účtu (pokud ještě není).

---

## 3. Po nasazení (volitelně)

### Meta tagy pro sociální sítě
V `index.html` jsou zatím URL na vercel.app. Až budeš mít vlastní doménu, můžeš v projektu upravit v `index.html`:
- `og:url` → `https://tvoje-domena.cz`
- `og:image` → `https://tvoje-domena.cz/hero-1280.webp`
- `twitter:image` → stejně

Pak znovu spusť `npm run build` a nahraj nový obsah.

---

## 4. Jak aktualizovat web v budoucnu

```bash
cd /Users/petr/jj-barbershop
npm run build
```

Vznikne nová složka `dist/`. Nahraj její obsah do `public_html` (přepíše staré soubory).

---

## 5. Kontrola

Po nahrání otevři svou doménu v prohlížeči. Měl bys vidět:
- Hero sekci s „Tvůj barber shop na Praze 10“
- Pobočky, Tým, Ceník, Recenze, Rezervace
- Tlačítko Rezervovat termín (odkaz na Reservio)
