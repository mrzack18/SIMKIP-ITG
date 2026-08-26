<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MahasiswaFactory extends Factory
{
    protected $model = Mahasiswa::class;

    public function definition(): array
    {
        $angkatan = $this->faker->randomElement([2021, 2022, 2023, 2024, 2025]);
        $status = $this->faker->randomElement(['Aktif', 'Aktif', 'Aktif', 'Nonaktif', 'Dicabut', 'Lulus']);
        return [
            'user_id' => User::factory(),
            'nim' => substr($angkatan, 2, 2) . $this->faker->unique()->numerify('####'),
            'nama' => $this->faker->name(),
            'prodi_id' => Prodi::factory(),
            'angkatan' => $angkatan,
            'kategori' => $this->faker->randomElement(['Reguler', 'Reguler', 'Aspirasi']),
            'status' => $status,
            'alasan_nonaktif' => $status === 'Nonaktif' ? $this->faker->randomElement(['Cuti Akademik', 'Masalah Administrasi', 'Kesehatan']) : null,
            'tanggal_nonaktif' => $status === 'Nonaktif' ? $this->faker->date() : null,
            'semester_dicabut' => $status === 'Dicabut' ? $this->faker->randomElement(['Ganjil 2025/2026', 'Genap 2025/2026']) : null,
            'tanggal_dicabut' => $status === 'Dicabut' ? $this->faker->date() : null,
            'alasan_dicabut' => $status === 'Dicabut' ? $this->faker->randomElement(['IPK di Bawah Standar', 'Pelanggaran Berat', 'SP3 Otomatis']) : null,
            'dicabut_oleh' => $status === 'Dicabut' ? $this->faker->randomElement(['Admin Pusat', 'Sistem']) : null,
            'nomor_sk' => 'SK/KIPK/' . $this->faker->numerify('###') . '/' . $angkatan,
            'tanggal_sk' => $this->faker->date(),
            'file_sk' => null,
        ];
    }
}
