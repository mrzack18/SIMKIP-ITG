<?php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Mahasiswa;
use App\Models\BebasTanggungan;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BebasTanggunganTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_get_mahasiswa_belum_dan_can_apply()
    {
        $mhsUser = User::factory()->create(['role' => 'mahasiswa', 'name' => 'Mhs Test']);
        Mahasiswa::factory()->create(['user_id' => $mhsUser->id, 'nim' => '12345']);

        $response = $this->actingAs($mhsUser)->getJson('/api/bebas-tanggungan');

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertArrayHasKey('status', $data);
        $this->assertArrayHasKey('can_apply', $data);
        $this->assertEquals('belum', $data['status']);
    }

    public function test_admin_reject_history()
    {
        $admin = User::factory()->create(['role' => 'admin', 'name' => 'Admin Test']);
        $mhsUser = User::factory()->create(['role' => 'mahasiswa', 'name' => 'Mhs Test']);
        Mahasiswa::factory()->create(['user_id' => $mhsUser->id, 'nim' => '12345']);

        $bt = BebasTanggungan::create([
            'mahasiswa_id' => $mhsUser->mahasiswa->id,
            'tanggal_ajukan' => now(),
            'status' => 'Menunggu'
        ]);

        // First reject
        $res1 = $this->actingAs($admin)->patchJson("/api/bebas-tanggungan/{$bt->id}/reject", ['alasan' => 'Tolak 1']);
        $res1->assertStatus(200);

        // Reset to Menunggu for testing second reject
        $bt->update(['status' => 'Menunggu']);

        // Second reject
        $res2 = $this->actingAs($admin)->patchJson("/api/bebas-tanggungan/{$bt->id}/reject", ['alasan' => 'Tolak 2']);
        $res2->assertStatus(200);

        $bt->refresh();
        $this->assertCount(2, $bt->histories);

        // Test GET Mahasiswa exposes histories
        $response = $this->actingAs($mhsUser)->getJson('/api/bebas-tanggungan');
        $data = $response->json();
        $this->assertCount(2, $data['data']['rejectionHistory']);
    }
}
