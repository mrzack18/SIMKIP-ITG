<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Http\Controllers\Api\Mahasiswa\IPKController;
use App\Models\User;

try {
    $user = User::where('role', 'mahasiswa')->first();
    $controller = new IPKController();
    $request = Request::create('/api/ipk', 'GET');
    $request->setUserResolver(function() use ($user) { return $user; });
    
    $response = $controller->index($request);
    
    echo $response->getContent();
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
