<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Http\Controllers\Api\Admin\DataAkademikController;

try {
    $controller = new DataAkademikController();
    $request = Request::create('/api/admin/akademik/ipk', 'GET');
    $response = $controller->indexIPK($request);
    
    echo "Status Code: " . $response->getStatusCode() . "\n";
    $content = json_decode($response->getContent(), true);
    if(isset($content['success']) && $content['success'] === true) {
        echo "Data Akademik API returns SUCCESS.\n";
        if(count($content['data']) > 0) {
            echo "First Student IPK Terakhir: " . $content['data'][0]['ipk_terakhir'] . "\n";
        }
    } else {
        echo "Data Akademik API FAILED.\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
