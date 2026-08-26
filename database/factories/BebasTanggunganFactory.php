<?php

namespace Database\Factories;

use App\Models\BebasTanggungan;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BebasTanggunganFactory extends Factory
{
    protected $model = BebasTanggungan::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['Menunggu', 'Diproses', 'Disetujui', 'Ditolak']);
        
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'tanggal_ajukan' => $this->faker->date(),
            'status' => $status,
            'catatan_admin' => $status === 'Ditolak' ? 'Terdapat tunggakan administrasi.' : null,
            'reviewed_by' => in_array($status, ['Disetujui', 'Ditolak']) ? User::factory() : null,
            'reviewed_at' => in_array($status, ['Disetujui', 'Ditolak']) ? now() : null,
            'nomor_surat' => $status === 'Disetujui' ? 'SK-BT/' . $this->faker->numerify('###') : null,
            'tanggal_terbit' => $status === 'Disetujui' ? $this->faker->date() : null,
        ];
    }
}
