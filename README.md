# J&J Barber Shop

## Struktura

- **Hlavní web** – `/` (index.html). Veřejná stránka: lokace, tým, služby, objednávka voucheru (formulář), recenze, rezervace.
- **Administrace** – `/admin`. Přihlášení, tabulka objednávek voucherů z databáze. U každé objednávky tlačítko **„Vygenerovat voucher“** → stáhne PDF v designu dárkového poukazu (GiftVoucher).

## Spuštění

```bash
npm install
npm run dev
```

Pak: **http://localhost:5173/** = hlavní web, **http://localhost:5173/admin** = administrace.

## Generování voucheru

Když přijde objednávka voucheru (z formuláře na webu) do DB, v administraci u záznamu klikni **„Vygenerovat voucher“**. Vygeneruje se PDF s designem poukazu (fonty Inter, Playfair Display, Cormorant Garamond) a uloží se na disk.
