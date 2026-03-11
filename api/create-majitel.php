<?php
/**
 * Jednorázově vytvoří účet: e-mail "majitel", heslo "majitel", role majitel.
 * V prohlížeči otevři: https://petrchajda.cz/api/create-majitel.php
 * Po použití tento soubor SMAŽ z serveru.
 */
require __DIR__ . '/db.php';

header('Content-Type: text/html; charset=utf-8');

$email = 'majitel';
$password = 'majitel';
$role = 'majitel';

$stmt = $pdo->prepare('SELECT id FROM admin_users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo '<p>Účet <strong>' . htmlspecialchars($email) . '</strong> již existuje. Přihlaste se tímto účtem.</p>';
    echo '<p><a href="/admin.html">→ Admin přihlášení</a></p>';
    exit;
}

$id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff));
$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo->prepare('INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)')->execute([$id, $email, $hash, $role]);

echo '<p><strong>Účet vytvořen.</strong></p>';
echo '<p>Přihlášení: <strong>' . htmlspecialchars($email) . '</strong> / heslo: <strong>' . htmlspecialchars($password) . '</strong></p>';
echo '<p><a href="/admin.html">→ Přejít na přihlášení</a></p>';
echo '<p style="color:red;margin-top:2em;">Po přihlášení tento soubor (create-majitel.php) ze serveru SMAŽTE.</p>';
