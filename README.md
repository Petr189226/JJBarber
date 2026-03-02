# J&J Barber Shop – web

Prezentační web: hero, pobočky (s fotkami), služby, ceník, tým, recenze, dárkový poukaz, kontakt. Všechny odkazy na rezervaci vedou na [Reservio](https://j-j-barbershop.reservio.com/).

Žádná administrace, žádná databáze.

## Spuštění

```bash
npm install
npm run dev
```

Otevřete [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Vznikne složka `out/` se statickými soubory (HTML, CSS, JS, obrázky).

## Nasazení na web

### 1) Vercel (doporučeno)

1. Nahraj projekt na [GitHub](https://github.com).
2. Jdi na [vercel.com](https://vercel.com), přihlas se (např. přes GitHub).
3. **Add New** → **Project** → vyber repozitář.
4. **Root Directory** nech prázdné, **Framework** Next.js. Klikni **Deploy**.
5. Po nasazení dostaneš adresu typu `tvoj-projekt.vercel.app`. V nastavení můžeš přidat vlastní doménu.

Žádné nastavování serveru, Vercel se postará o build i hostování.

### 2) Klasický hosting (FTP / správce souborů)

1. Lokálně spusť: `npm run build`.
2. Do kořene webu na hostingu nahraj **celý obsah složky `out/`** (všechny soubory a složky z `out`, včetně `_next`, `barbers`, `branches` atd.).
3. Nastav na hostingu výchozí soubor na `index.html` (většinou už je).
4. Pokud máš doménu (např. `jjbarber.cz`), nasměruj ji na tento hosting.

### 3) Netlify

1. Účet na [netlify.com](https://netlify.com).
2. **Sites** → **Add new site** → **Import an existing project** → připoj GitHub.
3. **Build command:** `npm run build`  
   **Publish directory:** `out`  
4. **Deploy**. Netlify ti dá adresu a můžeš připojit vlastní doménu.
