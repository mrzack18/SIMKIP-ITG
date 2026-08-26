<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
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

$prodiUser = User::where('role', 'prodi')->first();
$prodiToken = $prodiUser->createToken('test')->plainTextToken;
echo "=== PRODI MAHASISWA ROUTE ===\n";
$resP = runRequest('GET', '/api/mahasiswa', [], $prodiToken);
echo "Status: " . $resP['status'] . "\n";
if (isset($resP['content']['total'])) echo "Total Data: " . $resP['content']['total'] . "\n";

$mhsUser = User::where('role', 'mahasiswa')->first();
$mhsToken = $mhsUser->createToken('test')->plainTextToken;
echo "=== MHS MAHASISWA ROUTE (SHOULD 403) ===\n";
$resM = runRequest('GET', '/api/mahasiswa', [], $mhsToken);
echo "Status: " . $resM['status'] . "\n";

echo "=== MHS IPK ROUTE ===\n";
$resMIpk = runRequest('GET', '/api/ipk', [], $mhsToken);
echo "Status: " . $resMIpk['status'] . "\n";

