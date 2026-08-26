<?php
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Route;

function simulateApi($method, $uri, $role, $username = null) {
    echo "--- $role: $method $uri ---\n";
    require_once __DIR__.'/vendor/autoload.php';
    $app = require __DIR__.'/bootstrap/app.php';
    $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    
    $user = null;
    if ($username) {
        $user = User::where('username', $username)->first();
    } else {
        $user = User::where('role', $role)->first();
    }
    
    if (!$user) {
        echo "User not found for role $role\n\n";
        return;
    }

    $request = Request::create($uri, $method);
    $request->headers->set('Accept', 'application/json');
    \Illuminate\Support\Facades\Auth::login($user);
    $response = app()->handle($request);
    
    echo "Status: " . $response->getStatusCode() . "\n";
    $content = json_decode($response->getContent(), true);
    
    if (isset($content['data']) && is_array($content['data']) && !isset($content['data']['id'])) {
        // List response
        echo "Total items: " . count($content['data']) . "\n";
        if (count($content['data']) > 0) {
            echo "Sample first item:\n";
            print_r($content['data'][0]);
        }
        if (isset($content['total'])) {
            echo "Pagination Data: Total={$content['total']}, Page={$content['page']}, Limit={$content['limit']}, TotalPages={$content['totalPages']}\n";
        }
    } else {
        // Detail response or error
        print_r($content);
    }
    echo "\n";
}

// SP Filter Verification
simulateApi('GET', '/api/mahasiswa?spFilter=SP1', 'admin');
simulateApi('GET', '/api/mahasiswa?spFilter=SP2', 'admin');
simulateApi('GET', '/api/mahasiswa?spFilter=SP3', 'admin');
simulateApi('GET', '/api/mahasiswa?spFilter=Tanpa SP', 'admin');

// Trend Delta Verification
echo "\n--- VERIFIKASI TREND DELTA ---\n";
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$mahasiswa = App\Models\Mahasiswa::withDetails()->whereHas('ipkSemestrs', function($q) {
    // Cari mahasiswa yang punya minimal 2 semester
}, '>=', 2)->first();

if ($mahasiswa) {
    echo "NIM: {$mahasiswa->nim}\n";
    $ipkHistory = $mahasiswa->ipkSemestrs()->reorder()->orderByDesc('semester')->take(2)->get();
    
    $semesterTerbaru = $ipkHistory->first();
    $semesterSebelumnya = $ipkHistory->last();
    
    echo "Semester Terbaru: {$semesterTerbaru->semester} (IPK: {$semesterTerbaru->ipk})\n";
    echo "Semester Sebelumnya: {$semesterSebelumnya->semester} (IPK: {$semesterSebelumnya->ipk})\n";
    
    $expectedDelta = round($semesterTerbaru->ipk - $semesterSebelumnya->ipk, 2);
    echo "Expected trendDelta: {$expectedDelta}\n";
    echo "Actual trendDelta (dari Resource): {$mahasiswa->trend_delta_calc}\n";
    
    if (abs($expectedDelta - $mahasiswa->trend_delta_calc) < 0.01) {
        echo "VERDICT: MATCH\n";
    } else {
        echo "VERDICT: MISMATCH\n";
    }
} else {
    echo "Tidak ditemukan mahasiswa dengan >= 2 semester.\n";
}
