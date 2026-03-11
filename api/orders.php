<?php
/**
 * GET: seznam objednávek (vyžaduje přihlášení)
 * POST: nová objednávka (veřejné – formulář voucheru)
 * PATCH: aktualizace (admin_note, status) – vyžaduje přihlášení
 */
require __DIR__ . '/db.php';

session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$isAuth = !empty($_SESSION['user_id']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!$isAuth) {
        http_response_code(401);
        echo json_encode(['error' => 'Neautorizován']);
        exit;
    }
    $stmt = $pdo->query('SELECT id, name, surname, email, phone, service, branch, note, status, admin_note, voucher_number, created_at FROM voucher_orders ORDER BY created_at DESC');
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r['created_at'] = date('c', strtotime($r['created_at']));
    }
    echo json_encode($rows);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $name = trim((string) ($input['name'] ?? ''));
    $surname = trim((string) ($input['surname'] ?? '')) ?: null;
    $email = trim((string) ($input['email'] ?? ''));
    $phone = trim((string) ($input['phone'] ?? '')) ?: null;
    $service = trim((string) ($input['service'] ?? ''));
    $branch = trim((string) ($input['branch'] ?? ''));
    $note = trim((string) ($input['note'] ?? '')) ?: null;

    if (!$name || !$email || !$service || !$branch) {
        http_response_code(400);
        echo json_encode(['error' => 'Jméno, e-mail, služba a pobočka jsou povinné']);
        exit;
    }

    $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff));
    $voucherNumber = 'V' . date('Y') . '-' . strtoupper(substr(str_replace('-', '', $id), 0, 6));

    $stmt = $pdo->prepare('INSERT INTO voucher_orders (id, name, surname, email, phone, service, branch, note, voucher_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$id, $name, $surname, $email, $phone, $service, $branch, $note, $voucherNumber]);

    echo json_encode(['id' => $id, 'voucher_number' => $voucherNumber]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    if (!$isAuth) {
        http_response_code(401);
        echo json_encode(['error' => 'Neautorizován']);
        exit;
    }
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $id = trim((string) ($input['id'] ?? ''));
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Chybí id objednávky']);
        exit;
    }
    $updates = [];
    $params = [];
    if (array_key_exists('admin_note', $input)) {
        $updates[] = 'admin_note = ?';
        $params[] = $input['admin_note'] === null || $input['admin_note'] === '' ? null : (string) $input['admin_note'];
    }
    if (isset($input['status']) && in_array($input['status'], ['new', 'pending', 'done', 'awaiting_payment'], true)) {
        $updates[] = 'status = ?';
        $params[] = $input['status'];
    }
    if (empty($updates)) {
        echo json_encode(['ok' => true]);
        exit;
    }
    $params[] = $id;
    $sql = 'UPDATE voucher_orders SET ' . implode(', ', $updates) . ' WHERE id = ?';
    $pdo->prepare($sql)->execute($params);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
