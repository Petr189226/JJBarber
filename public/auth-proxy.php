<?php
/**
 * Auth proxy: přeposílá přihlášení na Supabase, když prohlížeč nemůže volat supabase.co přímo (síť/firewall).
 * Nahraj na server spolu s adminem.
 *
 * Nastavení: Pokud hosting nepodporuje env, nastav níže $CONFIG_URL a $CONFIG_ANON_KEY.
 * Použití: POST s JSON tělem { "email": "...", "password": "..." }
 * Odpověď: stejný JSON jako Supabase /auth/v1/token (access_token, refresh_token, user, …)
 */

$CONFIG_URL = 'https://dtijmhosifocowsgdgx.supabase.co';
$CONFIG_ANON_KEY = 'sb_publishable_BJ1pMwsKOK0pRw7lWPBLqg_vEVbkWud';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*'));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['ok' => true, 'message' => 'auth-proxy ready']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$supabaseUrl = getenv('SUPABASE_URL') ?: $CONFIG_URL ?: 'https://dtijmhosifocowsgdgx.supabase.co';
$supabaseKey = getenv('SUPABASE_ANON_KEY') ?: $CONFIG_ANON_KEY;

if (!$supabaseKey) {
    http_response_code(500);
    echo json_encode(['error' => 'SUPABASE_ANON_KEY not configured on server']);
    exit;
}

$body = file_get_contents('php://input');
$data = json_decode($body, true);
if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing email or password']);
    exit;
}

$tokenUrl = rtrim($supabaseUrl, '/') . '/auth/v1/token?grant_type=password';
$ch = curl_init($tokenUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        'email' => $data['email'],
        'password' => $data['password'],
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey,
    ],
    CURLOPT_TIMEOUT => 15,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    http_response_code(502);
    echo json_encode(['error' => 'Proxy request failed: ' . $curlErr]);
    exit;
}

http_response_code($httpCode);
echo $response;
