<?php

namespace Database\Factories;

use App\Models\SuratPeringatan;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SuratPeringatanFactory extends Factory
{
    protected $model = SuratPeringatan::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['Aktif', 'Selesai', 'Masa Tenggang']);
        $terbit = $this->faker->dateTimeBetween('-1 year', 'now');
        
        $batas = clone $terbit;
        if ($status === 'Aktif') {
            $batas->modify('+6 months');
        } elseif ($status === 'Selesai') {
            $batas->modify('-1 month');
        } else {
            // Masa tenggang (almost due)
            $batas->modify('+5 days');
        }

        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'level' => $this->faker->randomElement(['SP1', 'SP2', 'SP3']),
            'jenis_pelanggaran' => $this->faker->randomElement(['Akademik', 'Non-Akademik', 'Cuti Tanpa Izin']),
            'deskripsi' => $this->faker->sentence(),
            'tanggal_terbit' => $terbit,
            'batas_evaluasi' => $batas,
            'status' => $status,
            'diterbitkan_oleh' => User::factory(),
            'catatan' => $this->faker->paragraph(),
        ];
    }
}
