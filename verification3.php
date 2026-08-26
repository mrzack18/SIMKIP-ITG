<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;

function runRequest($method, $uri, $data = [], $token = null) {
    $req = Request::create($uri, $method, $data);
    if ($token) {
        $req->headers->set('Authorization', 'Bearer ' . $token);
    }
    $req->headers->set('Accept', 'application/json');
    $response = app()->handle($req);
    return [
        'status' => $response->getStatusCode(),
        'content' => json_decode($response->getContent(), true)
    ];
}

echo "=== 1. LOGIN ADMIN ===\n";
$res = runRequest('POST', '/api/auth/login', [
    'username' => 'admin',
    'password' => 'admin123'
]);
echo "Status: " . $res['status'] . "\n";
echo "Response Keys: " . implode(', ', array_keys($res['content'] ?? [])) . "\n";
if (isset($res['content']['redirectPath'])) echo "redirectPath exists: Yes\n";
if (isset($res['content']['user'])) echo "User Role: " . $res['content']['user']['role'] . "\n";

$adminToken = $res['content']['token'] ?? null;

echo "\n=== 2. AUTH ME (ADMIN) ===\n";
$resMe = runRequest('GET', '/api/auth/me', [], $adminToken);
echo "Status: " . $resMe['status'] . "\n";
if (isset($resMe['content']['user'])) echo "User Role: " . $resMe['content']['user']['role'] . "\n";

echo "\n=== 3. MAHASISWA ROUTE (ADMIN) ===\n";
$resMhs = runRequest('GET', '/api/mahasiswa', [], $adminToken);
echo "Status: " . $resMhs['status'] . "\n";
if (isset($resMhs['content']['total'])) echo "Total Data: " . $resMhs['content']['total'] . "\n";

