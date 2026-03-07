# Oprava date filtru – root cause a změny

## Root cause

**Problém:** Quick filter „Dnes“ zobrazoval včerejší datum v date inputech.

**Příčina:** `Date.prototype.toISOString()` vrací datum v **UTC**. Při volání `today.toISOString().slice(0, 10)` na objektu `new Date(year, month, date)` (lokální půlnoc) dojde k převodu na UTC:

- V ČR (UTC+1): 5. března 00:00 local = 4. března 23:00 UTC
- `toISOString().slice(0, 10)` → `"2025-03-04"` místo `"2025-03-05"`

**Off-by-one day:** V timezonech východně od UTC (např. ČR, CET) se lokální půlnoc zobrazí jako předchozí den v UTC.

## Co bylo změněno

### 1. Nový modul `src/app/admin/utils/dateFilter.ts`

- **`formatLocalDateForInput(d)`** – formátuje `Date` do `YYYY-MM-DD` pomocí `getFullYear()`, `getMonth()`, `getDate()` (vše lokální)
- **`getLocalToday()`** – vrací dnešní datum v lokální timezone
- **`getStartOfDayLocal(dateStr)`** – parsuje `YYYY-MM-DD` na začátek dne v lokální timezone (timestamp)
- **`getEndOfDayLocal(dateStr)`** – parsuje `YYYY-MM-DD` na konec dne v lokální timezone (timestamp)
- **`getPresetRange(preset)`** – vrací `{ from, to, preset }` pro Dnes, Týden, Měsíc, 30 dní
- **`detectPresetFromRange(from, to)`** – určí aktivní preset z hodnot Od/Do
- **`isDateRangeValid(from, to)`** – ověří, že Od ≤ Do

### 2. Úpravy v AdminApp

- `applyDatePreset()` používá `getPresetRange()` a `formatLocalDateForInput()` místo `toISOString().slice(0, 10)`
- Filtrování používá `getStartOfDayLocal()` a `getEndOfDayLocal()` místo `new Date(str).setHours()`
- Ruční změna Od/Do volá `detectPresetFromRange()` pro synchronizaci preset stavu
- Přidán preset „Vlastní“ při custom rozsahu
- Validace Od > Do: červený border, text „Od musí být před Do“, filtr se neaplikuje

### 3. Testy

- `dateFilter.test.ts` – 16 testů pro formátování, presety, detekci, validaci a timezone edge case

## Ošetření timezone problému

1. **Žádné `toISOString().slice(0, 10)`** pro lokální datum – vždy `formatLocalDateForInput()` s `getFullYear()`, `getMonth()`, `getDate()`
2. **Parsování `YYYY-MM-DD`** – `new Date(y, m-1, d)` místo `new Date(dateStr)` (parsování bez času je UTC)
3. **Hranice dne** – začátek `00:00:00.000`, konec `23:59:59.999` v lokální timezone
4. **Source of truth** – `filterDateFrom` a `filterDateTo` jsou jediný zdroj; preset je odvozený stav

## Doporučení pro další filtry

1. **Lokální datum** – pro `input type="date"` vždy formátovat přes `getFullYear()`, `getMonth()`, `getDate()`
2. **Parsování** – `new Date("YYYY-MM-DD")` je UTC půlnoc; pro lokální den použít `new Date(y, m-1, d)`
3. **Utility modul** – date logiku držet v odděleném modulu s testy
4. **Vitest fake timers** – pro testy závislé na čase použít `vi.setSystemTime()`
5. **Validace** – kontrolovat Od ≤ Do a při neplatném rozsahu filtr neaplikovat
