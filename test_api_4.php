<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Mahasiswa;
use Illuminate\Support\Facades\DB;

function runTest($role, $uri, $userId = null) {
    echo "\n--- $role: GET $uri ---\n";
    if ($userId) {
        $user = User::find($userId);
    } else {
        $user = User::where('role', $role)->first();
    }
    
    if (!$user) {
        echo "User for role $role not found.\n";
        return;
    }

    $request = Request::create($uri, 'GET');
    $request->headers->set('Accept', 'application/json');
    $request->setUserResolver(fn() => $user);
    app('auth')->guard('sanctum')->setUser($user);

    DB::enableQueryLog();
    $response = app()->handle($request);
    $queries = DB::getQueryLog();
    DB::disableQueryLog();
    
    echo "Status: " . $response->getStatusCode() . "\n";
    $content = json_decode($response->getContent(), true);

    if ($response->getStatusCode() === 200) {
        $count = count($content['data']);
        echo "Total Semester: $count\n";
        if ($count > 0) {
            $sample = $content['data'][0];
            echo "Sample First Item:\n";
            print_r($sample);
            echo "Is 'lulus' a strict boolean? ";
            if (isset($sample['mataKuliah'][0])) {
                $mk = $sample['mataKuliah'][0];
                echo (is_bool($mk['lulus']) ? "YES (" . ($mk['lulus'] ? 'true' : 'false') . ")" : "NO (" . gettype($mk['lulus']) . ")") . "\n";
            } else {
                echo "N/A (No MK)\n";
            }
        } else {
            echo "Empty state returned an empty array [].\n";
        }
    } else {
        echo "Response Error: " . $response->getContent() . "\n";
    }

    echo "Queries executed: " . count($queries) . "\n";
}

// Data Preparation
$admin = User::where('role', 'admin')->first();
$prodiUser = User::where('role', 'prodi')->first();
$warek = User::where('role', 'warek')->first();

// Get a student from the SAME prodi as prodiUser
$mhsSameProdi = Mahasiswa::where('prodi_id', $prodiUser->prodi_id)->whereHas('ipkSemestrs')->first();

// Get a proper Mahasiswa User with IPK
$userWithIpk = User::where('role', 'mahasiswa')->whereHas('mahasiswa.ipkSemestrs')->first();

// Get a student from a DIFFERENT prodi
$mhsDiffProdi = Mahasiswa::where('prodi_id', '!=', $prodiUser->prodi_id)->first();

// Get a student with NO IPK history
$mhsNoIpk = Mahasiswa::doesntHave('ipkSemestrs')->first();
if (!$mhsNoIpk) {
    $mhsNoIpk = Mahasiswa::factory()->create(['prodi_id' => $prodiUser->prodi_id]);
}
// Ensure they have a user account
if (!$mhsNoIpk->user_id) {
    $userNoIpk = User::factory()->create(['role' => 'mahasiswa']);
    $mhsNoIpk->user_id = $userNoIpk->id;
    $mhsNoIpk->save();
} else {
    $userNoIpk = $mhsNoIpk->user;
}

// Tests
runTest('admin', "/api/mahasiswa/{$mhsSameProdi->id}/ipk");
runTest('prodi', "/api/mahasiswa/{$mhsSameProdi->id}/ipk", $prodiUser->id); // SUCCESS
runTest('prodi', "/api/mahasiswa/{$mhsDiffProdi->id}/ipk", $prodiUser->id); // EXPECT 403
runTest('warek', "/api/mahasiswa/{$mhsSameProdi->id}/ipk");

echo "\n>>> Test Mahasiswa Sendiri <<<\n";
runTest('mahasiswa', "/api/ipk", $userWithIpk->id);

echo "\n>>> Test Mahasiswa Sendiri (Tanpa IPK - Empty State) <<<\n";
runTest('mahasiswa', "/api/ipk", $userNoIpk->id);

echo "\n>>> Test Mahasiswa Mengakses ID Orang Lain <<<\n";
runTest('mahasiswa', "/api/mahasiswa/{$mhsSameProdi->id}/ipk", $userNoIpk->id); // EXPECT 403

echo "\n>>> Test Admin Empty State <<<\n";
runTest('admin', "/api/mahasiswa/{$mhsNoIpk->id}/ipk");

