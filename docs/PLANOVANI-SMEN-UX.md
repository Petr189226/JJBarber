# Plánovač směn – UX tok

## Přehled

- **Stránka:** `/admin/smeny`
- **Layout:** Levý panel (seznam barberů + vyhledávání) | Hlavní oblast (kalendář týden/měsíc + editor)

## Režimy editace

### 1) Jednoduchý režim (výchozí)

- Po výběru barbera se zobrazí **týdenní mřížka**: 7 řádků (Po–Ne), každý řádek:
  - Přepínač **Pracuje / Volno**
  - Pokud Pracuje: pole **Od** a **Do** (HH:mm), volitelně **Pauza** (od–do)
- Tlačítka:
  - **Použít na další 4 týdny** – uloží šablonu a označí ji jako platnou od dneška na 4 týdny (výjimky se negenerují, šablona se jen uloží)
  - **Použít od data…** – výběr data, šablona platí od toho data (ukládáme jen šablonu)
- Uložení = **PUT šablona** (týdenní vzor pro barbera). Rezervace pak berou intervaly z šablony + výjimky.

### 2) Pokročilý režim

- Kalendář s **časovou osou** (např. 6:00–22:00), dny v sloupcích.
- **Drag & drop** bloky: přetáhnutí změní začátek/konec nebo den.
- Možnost **více intervalů** v jednom dnu (dělená směna): přidat blok, rozměnit.
- Dvojklik na blok = editace času (vstupní pole).

## Rychlé akce (nad kalendářem / v panelu)

- **Zkopírovat minulý týden** – načte šablonu z DB (už uloženou) a přepíše aktuální týdenní šablonu v editoru (ne do budoucna, jen do formuláře).
- **Uložit jako šablonu** – uloží aktuální týdenní vzor jako šablonu (PUT).
- **Načíst šablonu** – načte uloženou šablonu do editoru.
- **Přidat výjimku** – otevře dialog: rozsah dat (jednodenní nebo od–do), typ (Volno / Vlastní hodiny), pokud vlastní hodiny pak intervaly, volitelný důvod.

## Výjimky

- Dialog **Přidat výjimku**:
  - Datum nebo **Od data** – **Do data**
  - Typ: **Volno** | **Vlastní hodiny**
  - Při Vlastní hodiny: seznam intervalů (Od–Do) pro každý den v rozsahu, nebo jeden vzor pro všechny dny
  - Důvod (volitelné)
- Zobrazení v kalendáři: dny s výjimkou mají jinou barvu (volno = šedá, vlastní hodiny = tečka nebo popisek).

## Validace (inline + API)

- Konec ≥ začátek u každého intervalu.
- Pauza uvnitř pracovní doby.
- Překrývající se intervaly v jednom dni → chybová zpráva u dne nebo u bloku.
- Minimální délka směny (např. 30 min) – konfigurovatelná konstanta, API vrací srozumitelnou chybu.

## Tablet

- Levý panel při malé šířce jako skládací (hamburger) nebo horní dropdown (výběr barbera).
- Kalendář scrollovatelný horizontálně, tlačítka pod ním větší (min 44px).
