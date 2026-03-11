-- Spusť jednorázově v phpMyAdmin nebo mysql klientu (po vytvoření databáze).

CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('majitel','barber') NOT NULL DEFAULT 'barber',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voucher_orders (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NULL,
  service VARCHAR(255) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  note TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'new',
  admin_note TEXT NULL,
  voucher_number VARCHAR(64) NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_voucher_orders_created_at ON voucher_orders(created_at DESC);

-- Prvního majitele vytvoř ručně (nahraď e-mail a heslo):
-- INSERT INTO admin_users (id, email, password_hash, role) VALUES
-- (UUID(), 'tvuj@email.cz', '$2y$10$...', 'majitel');
-- Heslo vygeneruj např. v PHP: echo password_hash('tvoje_heslo', PASSWORD_DEFAULT);
