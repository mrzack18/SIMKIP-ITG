<?php

namespace Database\Factories;

use App\Models\Prodi;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProdiFactory extends Factory
{
    protected $model = Prodi::class;

    public function definition(): array
    {
        return [
            'kode' => $this->faker->unique()->numerify('PRD###'),
            'nama' => $this->faker->randomElement([
                'Teknik Informatika', 'Sistem Informasi', 'Teknik Industri', 'Teknik Sipil', 'Arsitektur'
            ]),
            'is_aktif' => true,
        ];
    }
}
