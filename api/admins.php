<?php
/**
 * Vyžaduje přihlášeného majitele.
 * POST body: { "action": "list" | "update-password" | "update-role" | "delete" | "create", ... }
 */
require __DIR__ . '/db.php';

session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Neautorizován']);
    exit;
}

$stmt = $pdo->prepare('SELECT role FROM admin_users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$me = $stmt->fetch();
if (!$me || $me['role'] !== 'majitel') {
    http_response_code(403);
    echo json_encode(['error' => 'Pouze majitel může spravovat účty']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = (string) ($input['action'] ?? '');

if ($action === 'list') {
    $stmt = $pdo->query('SELECT id AS user_id, email, role, created_at AS last_sign_in_at FROM admin_users ORDER BY created_at');
    $admins = $stmt->fetchAll();
    foreach ($admins as &$a) {
        $a['last_sign_in_at'] = null;
    }
    echo json_encode(['admins' => $admins]);
    exit;
}

if ($action === 'update-password') {
    $userId = $input['user_id'] ?? '';
    $newPassword = (string) ($input['new_password'] ?? '');
    if (!$userId || strlen($newPassword) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Chybí user_id nebo nové heslo (min. 6 znaků)']);
        exit;
    }
    $hash = password_hash($newPassword, PASSWORD_DEFAULT);
    $pdo->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')->execute([$hash, $userId]);
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'delete') {
    $userId = $input['user_id'] ?? '';
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'Chybí user_id']);
        exit;
    }
    if ($userId === $_SESSION['user_id']) {
        http_response_code(400);
        echo json_encode(['error' => 'Nemůžeš odstranit sám sebe']);
        exit;
    }
    $pdo->prepare('DELETE FROM admin_users WHERE id = ?')->execute([$userId]);
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'update-role') {
    $userId = $input['user_id'] ?? '';
    $newRole = (string) ($input['new_role'] ?? '');
    if (!$userId || !in_array($newRole, ['majitel', 'barber'], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Chybí user_id nebo new_role (majitel/barber)']);
        exit;
    }
    if ($userId === $_SESSION['user_id']) {
        http_response_code(400);
        echo json_encode(['error' => 'Nemůžeš změnit roli sám sobě']);
        exit;
    }
    $pdo->prepare('UPDATE admin_users SET role = ? WHERE id = ?')->execute([$newRole, $userId]);
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'create') {
    $email = trim((string) ($input['email'] ?? ''));
    $password = (string) ($input['password'] ?? '');
    $role = (string) ($input['role'] ?? 'barber');
    if (!$email || !$password || !in_array($role, ['majitel', 'barber'], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Chybí email, heslo nebo role (majitel/barber)']);
        exit;
    }
    $existing = $pdo->prepare('SELECT id FROM admin_users WHERE email = ?');
    $existing->execute([$email]);
    if ($existing->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Účet s tímto e-mailem již existuje']);
        exit;
    }
    $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff));
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $pdo->prepare('INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)')->execute([$id, $email, $hash, $role]);
    echo json_encode(['success' => true, 'userId' => $id]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Neplatná akce. Použij action: list | update-password | update-role | delete | create']);
