<?php

namespace Database\Factories;

use App\Models\Dokumen;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DokumenFactory extends Factory
{
    protected $model = Dokumen::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['Menunggu', 'Disetujui', 'Ditolak']);
        
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'dokumen_jenis_id' => $this->faker->numberBetween(1, 4), // Assuming DokumenJenisSeeder provides these
            'nama_file' => 'dokumen_' . $this->faker->word() . '.pdf',
            'path_file' => 'dokumen/path_dummy_' . $this->faker->word() . '.pdf',
            'ukuran' => $this->faker->numberBetween(100, 5000), // in KB
            'status' => $status,
            'catatan_admin' => $status === 'Ditolak' ? 'File buram' : null,
            'approved_by' => $status !== 'Menunggu' ? User::factory() : null,
            'approved_at' => $status !== 'Menunggu' ? now() : null,
        ];
    }
}
