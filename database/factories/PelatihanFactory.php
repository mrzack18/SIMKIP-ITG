<?php

namespace Database\Factories;

use App\Models\Pelatihan;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PelatihanFactory extends Factory
{
    protected $model = Pelatihan::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['Menunggu', 'Disetujui', 'Ditolak']);

        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'nama' => 'Pelatihan ' . $this->faker->words(2, true),
            'jenis' => $this->faker->randomElement(['Akademik', 'Non-Akademik']),
            'penyelenggara' => $this->faker->company(),
            'tanggal_mulai' => $this->faker->date(),
            'tanggal_selesai' => $this->faker->date(),
            'tempat' => $this->faker->city(),
            'deskripsi' => $this->faker->paragraph(),
            'file_sertifikat' => 'sertifikat_' . $this->faker->word() . '.pdf',
            'foto_kegiatan' => 'foto_kegiatan_' . $this->faker->word() . '.jpg',
            'status' => $status,
            'catatan_admin' => $status === 'Ditolak' ? 'Sertifikat tidak sesuai standar' : null,
            'validated_by' => $status !== 'Menunggu' ? User::factory() : null,
            'validated_at' => $status !== 'Menunggu' ? now() : null,
        ];
    }
}
