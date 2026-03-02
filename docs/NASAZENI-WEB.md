# Jak nasadit web na jjbarbershop.cz

Projekt je **statický web** (Next.js s `output: "export"`). Po buildu máte složku `out/` s HTML, CSS a obrázky – žádný server ani databáze nepotřebujete.

---

## Krok 1: Build

Na svém počítači (nebo na CI) spusťte:

```bash
npm install
npm run build
```

Vznikne složka **`out/`**. Její obsah nahrajete na webhosting.

---

## Krok 2: Kam web nasadit (3 možnosti)

### A) Vercel (doporučeno – zdarma, jednoduché)

1. Účet na [vercel.com](https://vercel.com) (např. přes GitHub).
2. **Import projektu**: připojte repozitář (GitHub/GitLab) nebo nahrajte složku projektu.
3. Vercel sám pozná Next.js a spustí `npm run build`. Výstupní složka je `out` (statický export).
4. Po nasazení dostanete adresu typu `vas-projekt.vercel.app`.
5. **Vlastní doména**: V projektu Vercel → Settings → Domains → Add `jjbarbershop.cz` a `www.jjbarbershop.cz`. Vercel vám ukáže, co nastavit v DNS (viz krok 3).

**Výhody:** zdarma, automatické nasazení z Gitu, HTTPS, CDN. Pro tento web stačí free plán.

---

### B) Netlify

1. Účet na [netlify.com](https://netlify.com).
2. **Add new site** → Import z Gitu nebo **Deploy manually** (nahodíte obsah složky `out/`).
3. Build command: `npm run build`, Publish directory: `out`.
4. Doména: Site settings → Domain management → Add custom domain `jjbarbershop.cz`.

Stejně jako u Vercelu pak v nic.cz nastavíte DNS podle pokynů Netlify.

---

### C) Klasický webhosting (např. u poskytovatele u nic.cz)

Pokud máte u nic.cz nebo jinde **webhosting** (FTP / správce souborů):

1. Lokálně spusťte `npm run build`.
2. Obsah složky **`out/`** nahrajte do složky pro web (častěji `public_html`, `www` nebo `htdocs` – záleží na hostingu).
3. Důležité: nahrajte **obsah** složky `out/` (soubor `index.html` musí být v kořeni webu), ne celou složku `out` jako jednu složku.

Na tomto hostingu pak doménu jjbarbershop.cz většinou jen „připojíte“ v panelu (např. nic.cz → Moje domény → jjbarbershop.cz → Nastavení webu / DNS).

---

## Krok 3: Nastavení domény jjbarbershop.cz (nic.cz)

Aby doména ukazovala na váš nasazený web:

1. Přihlaste se na [nic.cz](https://www.nic.cz) → **Moje domény** → vyberte **jjbarbershop.cz**.
2. Otevřete **DNS záznamy** (nebo „Správa zóny“ / „Nastavení DNS“).

**Pokud používáte Vercel nebo Netlify:**

- Vercel/Netlify v sekci Domains napíše něco jako:
  - „Přidejte A záznam: `76.76.21.21`“ (Vercel)  
  - nebo „Přidejte CNAME: `jjbarbershop.cz` → `cname.vercel-dns.com`“.
- V nic.cz tedy:
  - **Pro A záznam:** typ `A`, host `@` (nebo prázdné), hodnota = IP od Vercel/Netlify.
  - **Pro www:** často CNAME `www` → `cname.vercel-dns.com` (nebo ekvivalent u Netlify).
- U **Vercel** můžete místo ručního A/CNAME přepnout doménu na **Vercel nameservery** – v nic.cz u domény zadáte jen dva nameservery, které Vercel ukáže. Pak se DNS spravuje celé ve Vercelu.

**Pokud používáte vlastní webhosting:**

- U domény v nic.cz nastavíte buď **A záznam** na IP serveru hostingu, nebo **přesměrování / alias** podle toho, co váš poskytovatel píše v návodu (často „nastavte A záznam na …“ nebo „použijte naše nameservery“).

Změny DNS se projeví od několika minut do zhruba 24 hodin.

---

## Shrnutí (nejjednodušší cesta)

1. **Kód** mít v Gitu (GitHub/GitLab).
2. **Vercel**: Import projektu z Gitu → automatický build a nasazení.
3. V **Vercel** přidat doménu **jjbarbershop.cz** (a případně **www.jjbarbershop.cz**).
4. V **nic.cz** u domény nastavit DNS podle pokynů Vercelu (A záznam nebo Vercel nameservery).
5. Po propagaci DNS bude jjbarbershop.cz ukazovat na nový web.

---

## Kontrola po nasazení

- Otevřete https://jjbarbershop.cz – měla by být úvodní stránka s hero, pobočkami, službami atd.
- Zkuste odkazy: Rezervovat termín (Reservio), Pobočky, Služby, Ceník, Kontakt, Instagram, Facebook.
- Na mobilu ověřte sticky CTA a menu.

Pokud něco z toho nefunguje, napište, na čem hostujete (Vercel / Netlify / vlastní hosting) a co přesně se děje – dá se to doladit krok za krokem.
