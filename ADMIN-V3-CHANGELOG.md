# Admin v3 – Production UX Upgrade

## Struktura komponent

```
AdminApp
├── Header (top bar)
│   ├── Logo + název
│   ├── Role badge (Majitel/Barber)
│   └── Akce: Přidat správce, Web, Odhlásit
├── Main
│   ├── NoRole / Barber info
│   ├── Fetch error alert
│   ├── Alerts (staré nové, bez telefonu)
│   ├── KPI Dashboard (6 karet)
│   ├── Filter toolbar
│   │   ├── Search
│   │   ├── Stav, Pobočka
│   │   ├── Date presets (Dnes, Týden, Měsíc, 30 dní)
│   │   ├── Od/Do datum
│   │   ├── Jen nové
│   │   └── Refresh, Reset, Export CSV
│   ├── Bulk actions bar (když vybráno)
│   ├── Tabulka objednávek
│   │   ├── Checkbox sloupec (majitel)
│   │   ├── ID, Datum, Jméno, Email, Telefon, Služba, Pobočka, Stav
│   │   └── Akční menu (⋯)
│   └── Add admin formulář
├── Detail drawer (side panel)
│   ├── Header (ID, status, jméno)
│   ├── Detail data
│   ├── Poznámka zákazníka
│   ├── Admin poznámka (majitel)
│   └── Akce: Vyřízené, E-mail, Zavolat, Tisk voucheru
└── Overlays (dropdown, action menu)
```

## Co se změnilo

### 1. Layout
- **max-width: 1920px** (bylo 1600px) – širší pracovní plocha
- **px-8** na desktopu – méně prázdnoty na velkých monitorech

### 2. Top bar
- **Přidat správce** – sekundární button s border (outline style)
- **Web** – text link bez výrazného stylu
- **Odhlásit** – ghost/text action
- **Role** – badge s border, oddělený od loga

### 3. KPI karty
- **Větší čísla** (text-2xl), tabular-nums
- **Barevná logika**: nové=modrá, vyřízeno=zelená, čeká=amber, tržby=zlatá
- **Storno** vyloučeno z tržeb a průměru

### 4. Filter toolbar
- **Quick date presets**: Dnes, Týden, Měsíc, 30 dní
- Presety nastaví Od/Do automaticky
- Ruční změna data zruší preset

### 5. Tabulka
- **Hover**: hover:bg-[#141414]
- **Selected state**: vybraný řádek má ring a tmavší pozadí
- **Zebra rows**: střídání bg-[#0d0d0d] / bg-[#0a0a0a]
- **Checkbox sloupec** pro bulk akce (majitel)

### 6. Akce v tabulce
- **Three-dots menu (⋯)** místo jen ikony oka
- Položky: Detail, Změnit stav, Poznámka, Tisk voucheru
- Změnit stav otevře status dropdown v příslušném sloupci

### 7. Status systém
- **Nový status: Storno** (červená badge)
- Stavy: Nový, Rozpracováno, Čeká na platbu, Vyřízeno, Storno
- Storno vyloučeno z tržeb

### 8. Bulk akce
- **Checkbox** u každého řádku + select all v hlavičce
- **Bulk bar** při výběru: Export vybraných, Změnit stav, Zrušit výběr
- Bulk změna stavu – select s volbami

### 9. Detail drawer
- **Tisk voucheru** – nové tlačítko, otevře print dialog s voucherem
- Označit jako vyřízené skryto pro storno

### 10. Empty / edge states
- **Žádné objednávky** vs **Žádné výsledky** – rozdílné zprávy
- Tlačítko „Zrušit filtry“ při prázdných výsledcích

## Migrace databáze

Pro status **Storno** je potřeba spustit migraci:

```bash
supabase db push
# nebo ručně v SQL:
# alter table voucher_orders drop constraint if exists voucher_orders_status_check;
# alter table voucher_orders add constraint voucher_orders_status_check
#   check (status in ('new', 'pending', 'done', 'awaiting_payment', 'storno'));
```

Soubor: `supabase/migrations/005_add_storno_status.sql`

## UX rozhodnutí

1. **Širší layout** – admin na velkých monitorech působil utopeně; 1920px lépe využívá prostor
2. **Sekundární button** – „Přidat správce“ je hlavní akce, ale ne primární (primární je práce s objednávkami)
3. **Quick presets** – většina filtrů je „dnes“ nebo „tento týden“; presety šetří čas
4. **Three-dots menu** – standardní pattern pro akce u řádku; škáluje lépe než jedna ikona
5. **Bulk akce** – připraveno pro růst objemu; export a změna stavu jsou nejčastější
6. **Storno** – reálný workflow; vyloučení z tržeb dává smysl
7. **Selected row** – vizuální feedback, že drawer patří k řádku
