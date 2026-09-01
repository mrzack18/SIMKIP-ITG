<?php

namespace Database\Factories;

use App\Models\IpkSemestr;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

class IpkSemestrFactory extends Factory
{
    protected $model = IpkSemestr::class;

    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'semester' => $this->faker->numberBetween(1, 8),
            'tahun_ajaran' => $this->faker->randomElement(['2022/2023', '2023/2024', '2024/2025']) . ' ' . $this->faker->randomElement(['Ganjil', 'Genap']),
            'ipk' => $this->faker->randomFloat(2, 2.0, 4.0),
            'file_khs' => null,
            'status' => $this->faker->randomElement(['Menunggu', 'Disetujui', 'Ditolak']),
            'catatan_admin' => null,
        ];
    }
}
