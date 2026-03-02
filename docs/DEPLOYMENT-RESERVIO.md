# Nasazení čistého webu (Reservio)

Tato varianta obsahuje **pouze veřejný web** s odkazy na [Reservio](https://j-j-barbershop.reservio.com/). Žádný admin, žádná databáze.

## Proměnné prostředí

- **`RESERVIO_ONLY=1`** – zapne režim „pouze web“: `/admin` a `/api/admin/*` vrací 404, odkaz „Admin“ se nikde nezobrazuje, landing data jsou statická (Strašnice, Vršovice + služby z demo dat).
- **`NEXT_PUBLIC_BOOKING_URL=https://j-j-barbershop.reservio.com/`** – všechny odkazy na rezervaci vedou na Reservio. Pobočky: Strašnice → `.../j-j-barber-shop-strasnice`, Vršovice → `.../j-j-barber-shop`.

## Lokální spuštění (port 3001)

```bash
npm run dev:reservio
```

Bez Dockeru i bez databáze. Otevři http://localhost:3001.

## Build pro produkci

```bash
npm run build:reservio
```

Výstup je v `.next-reservio/`. Spuštění:

```bash
npm run start:reservio
```

## Nasazení na doménu (Vercel / jiný host)

1. Nastav env v dashboardu:
   - `RESERVIO_ONLY=1`
   - `NEXT_PUBLIC_BOOKING_URL=https://j-j-barbershop.reservio.com/`
2. Build command: `npm run build` (stačí, env zajistí reservio režim)  
   nebo přímo `npm run build:reservio` a jako output dir u Vercel uvést `.next-reservio` (pokud host podporuje vlastní output dir).
3. Na většině hostů stačí `next build` s těmito env – build pak běží v reservio režimu.

## Co v tomto režimu funguje

- Úvodní stránka (hero, pobočky, služby, ceník, J&J tým, recenze, dárkový poukaz, kontakt)
- Stránka `/voucher` (objednávka dárkového poukazu – vyžaduje API a DB; pokud nechceš, můžeš route odstranit nebo zobrazit jen informaci)
- Stránka `/privacy` (zásady ochrany osobních údajů)
- Odkaz na zrušení rezervace `/booking/cancel?token=...` (z e-mailu – pokud používáš vlastní odesílání)

## Co v tomto režimu nefunguje / není dostupné

- `/admin` a vše pod ním → 404
- `/api/admin/*` → 404
- Interní rezervační wizard `/booking` → přesměrování na Reservio
- Data z databáze – pobočky a služby jsou z pevně definovaných demo dat (Strašnice, Vršovice + běžné služby)
