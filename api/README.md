# API (PHP + MySQL)

Backend pro přihlášení, objednávky voucherů a správu adminů. Nahraj celou složku `api/` na server (vedle složky s frontendem).

## Nastavení

1. **config.php** – zkopíruj `config.example.php` na `config.php` a vyplň údaje k MySQL z tvého hostingu (phpMyAdmin → vytvoř databázi, uživatel, heslo).

2. **Databáze** – v phpMyAdmin spusť SQL z `schema.sql` (vytvoří tabulky `admin_users` a `voucher_orders`).

3. **První majitel** – jednou zavolej v prohlížeči nebo přes curl:
   - `POST https://tvoje-domena.cz/api/install.php`  
   - Body (JSON): `{ "email": "tvuj@email.cz", "password": "heslo" }`  
   Nebo v phpMyAdmin vlož ručně do `admin_users` (heslo vygeneruj v PHP: `echo password_hash('heslo', PASSWORD_DEFAULT);`).

4. Po vytvoření účtu **smaž nebo přejmenuj** `install.php`, aby ho nikdo nemohl znovu spustit.

## Endpointy

- `POST /api/auth.php` – přihlášení (email, password)
- `GET /api/auth.php` – aktuální uživatel (session)
- `POST /api/auth.php?logout=1` – odhlášení
- `GET /api/orders.php` – seznam objednávek (přihlášení)
- `POST /api/orders.php` – nová objednávka (veřejné)
- `PATCH /api/orders.php` – úprava objednávky (admin_note, status)
- `POST /api/admins.php` – akce: list, create, update-password, update-role, delete (majitel)

Frontend volá tyto URL relativně (`/api/...`), takže musí být na stejné doméně jako React build.
