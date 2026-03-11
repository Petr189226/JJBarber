<?php
/**
 * Jednorázově: vytvoří tabulky a volitelně prvního majitele.
 * Volání: POST s { "email": "tvuj@email.cz", "password": "heslo" } nebo GET pro jen vytvoření tabulek.
 * Po použití smaž nebo chraň heslem (např. přejmenuj na install.lock).
 */
require __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

$schema = file_get_contents(__DIR__ . '/schema.sql');
// Odstranit komentáře a prázdné řádky; rozdělit po ;
$statements = array_filter(
    array_map('trim', explode(';', preg_replace('/--.*$/m', '', $schema))),
    fn($s) => $s !== ''
);

foreach ($statements as $sql) {
    if (strpos($sql, 'CREATE') === 0 || strpos($sql, 'CREATE INDEX') === 0) {
        $pdo->exec($sql);
    }
}

$created = ['tables' => true];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $email = trim((string) ($input['email'] ?? ''));
    $password = (string) ($input['password'] ?? '');
    if ($email && strlen($password) >= 6) {
        $stmt = $pdo->query('SELECT 1 FROM admin_users LIMIT 1');
        if ($stmt->fetch()) {
            $created['admin'] = 'Už existuje alespoň jeden účet. Přidej další v admin rozhraní.';
        } else {
            $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff));
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $pdo->prepare('INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)')->execute([$id, $email, $hash, 'majitel']);
            $created['admin'] = 'Vytvořen první majitel: ' . $email;
        }
    }
}

echo json_encode($created);
