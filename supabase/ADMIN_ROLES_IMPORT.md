# Import admin_roles z CSV

## 1. Získej své User UID

1. V Supabase jdi na **Authentication** → **Users**
2. Klikni na svůj účet (např. majitel@jjbarbershop.cz)
3. Zkopíruj **User UID** (např. `f949073d-fddd-4cd4-80d0-d82b0bd6e4d1`)

## 2. Uprav CSV

Otevři `admin_roles_import.csv` a nahraď `00000000-0000-0000-0000-000000000001` svým UID (např. `f949073d-fddd-4cd4-80d0-d82b0bd6e4d1`).

## 3. Import v Supabase

1. **Table Editor** → **admin_roles**
2. Klikni **Import data from CSV** nebo přetáhni soubor
3. Vyber upravený CSV
4. Zkontroluj mapování sloupců a importuj

## Více řádků (Majitel + Barber)

Pro více správců přidej řádky:

```csv
user_id,role
uid-majitele-1,majitel
uid-barbera-1,barber
uid-barbera-2,barber
```
