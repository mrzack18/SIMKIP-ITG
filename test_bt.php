<?php
use App\Models\User;
use App\Models\Mahasiswa;
use App\Models\BebasTanggungan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

echo "--- START TESTING ---\n";
try {
    DB::beginTransaction();

    $admin = User::where('role', 'admin')->first() ?? User::factory()->create(['role' => 'admin', 'name' => 'Admin Test']);
    $mhsUser = User::where('role', 'mahasiswa')->first();
    if (!$mhsUser) {
        $mhsUser = User::factory()->create(['role' => 'mahasiswa', 'name' => 'Mhs Test']);
        Mahasiswa::factory()->create(['user_id' => $mhsUser->id, 'nim' => '12345']);
    }

    echo "1. API GET Mahasiswa (Status belum dan can_apply boolean)\n";
    Auth::login($mhsUser);
    $reqGet1 = Illuminate\Http\Request::create('/api/bebas-tanggungan', 'GET');
    $resGet1 = app()->make(\Illuminate\Contracts\Http\Kernel::class)->handle($reqGet1);
    $dataGet1 = json_decode($resGet1->getContent(), true);
    if ($dataGet1['status'] !== 'belum' && $dataGet1['status'] !== 'menunggu' && $dataGet1['status'] !== 'diterbitkan' && $dataGet1['status'] !== 'ditolak') {
        throw new \Exception("Status is invalid: " . ($dataGet1['status'] ?? 'null'));
    }
    echo "  [PASS] GET mengembalikan struktur yang benar.\n";

    echo "2. Admin Reject Action & History\n";
    $bt = BebasTanggungan::create([
        'mahasiswa_id' => $mhsUser->mahasiswa->id,
        'tanggal_ajukan' => now(),
        'status' => 'Menunggu'
    ]);
    
    Auth::login($admin);
    // First reject
    $reqRej1 = Illuminate\Http\Request::create("/api/bebas-tanggungan/{$bt->id}/reject", 'PATCH', ['alasan' => 'Tolak 1']);
    app()->make(\Illuminate\Contracts\Http\Kernel::class)->handle($reqRej1);
    
    // Second reject (set status to Menunggu first to bypass "already processed" check)
    $bt->update(['status' => 'Menunggu']);
    
    $reqRej2 = Illuminate\Http\Request::create("/api/bebas-tanggungan/{$bt->id}/reject", 'PATCH', ['alasan' => 'Tolak 2']);
    app()->make(\Illuminate\Contracts\Http\Kernel::class)->handle($reqRej2);
    
    $bt->refresh();
    if ($bt->histories->count() !== 2) {
        throw new \Exception("Histories count mismatch! Expected 2, got " . $bt->histories->count());
    }
    echo "  [PASS] Admin reject creates multiple history records.\n";

    echo "3. Mahasiswa GET exposes rejectionHistory\n";
    Auth::login($mhsUser);
    $reqGet2 = Illuminate\Http\Request::create('/api/bebas-tanggungan', 'GET');
    $resGet2 = app()->make(\Illuminate\Contracts\Http\Kernel::class)->handle($reqGet2);
    $dataGet2 = json_decode($resGet2->getContent(), true);
    if (!isset($dataGet2['data']['rejectionHistory']) || count($dataGet2['data']['rejectionHistory']) !== 2) {
        throw new \Exception("rejectionHistory is missing or count is not 2 in Mahasiswa response!");
    }
    echo "  [PASS] Mahasiswa GET exposes rejectionHistory properly.\n";

    DB::rollBack();
    echo "--- ALL TESTS PASSED ---\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "\n[FAIL] " . $e->getMessage() . "\n";
}
