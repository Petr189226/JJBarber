<?php
/**
 * POST: { "email", "password" } → přihlášení
 * GET: → aktuální uživatel (session)
 * POST s ?logout=1 → odhlášení
 */
require __DIR__ . '/db.php';

session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (isset($_GET['logout']) && $_GET['logout']) {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    echo json_encode(['ok' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Neautorizován']);
        exit;
    }
    echo json_encode([
        'user' => [
            'id'    => $_SESSION['user_id'],
            'email' => $_SESSION['email'] ?? '',
            'role'  => $_SESSION['role'] ?? 'barber',
        ],
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$email = trim((string) ($input['email'] ?? ''));
$password = (string) ($input['password'] ?? '');

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'E-mail a heslo jsou povinné']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, email, password_hash, role FROM admin_users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$row = $stmt->fetch();

if (!$row || !password_verify($password, $row['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Neplatný e-mail nebo heslo']);
    exit;
}

$_SESSION['user_id'] = $row['id'];
$_SESSION['email'] = $row['email'];
$_SESSION['role'] = $row['role'];

echo json_encode([
    'user' => [
        'id'    => $row['id'],
        'email' => $row['email'],
        'role'  => $row['role'],
    ],
]);
