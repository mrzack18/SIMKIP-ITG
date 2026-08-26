<?php

namespace Database\Factories;

use App\Models\MataKuliah;
use App\Models\IpkSemestr;
use Illuminate\Database\Eloquent\Factories\Factory;

class MataKuliahFactory extends Factory
{
    protected $model = MataKuliah::class;

    public function definition(): array
    {
        $nilai = $this->faker->randomElement([
            ['huruf' => 'A', 'mutu' => 4.0, 'lulus' => true],
            ['huruf' => 'B', 'mutu' => 3.0, 'lulus' => true],
            ['huruf' => 'C', 'mutu' => 2.0, 'lulus' => true],
            ['huruf' => 'D', 'mutu' => 1.0, 'lulus' => false],
            ['huruf' => 'E', 'mutu' => 0.0, 'lulus' => false],
        ]);

        return [
            'ipk_semester_id' => IpkSemestr::factory(),
            'kode' => strtoupper($this->faker->bothify('IF###')),
            'nama' => $this->faker->words(3, true),
            'sks' => $this->faker->numberBetween(2, 4),
            'nilai_huruf' => $nilai['huruf'],
            'nilai_mutu' => $nilai['mutu'],
            'lulus' => $nilai['lulus'],
        ];
    }
}
