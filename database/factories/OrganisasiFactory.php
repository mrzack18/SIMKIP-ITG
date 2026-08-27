<?php

namespace Database\Factories;

use App\Models\Organisasi;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrganisasiFactory extends Factory
{
    protected $model = Organisasi::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['Menunggu', 'Disetujui', 'Ditolak']);

        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'nama' => 'Himpunan Mahasiswa ' . $this->faker->word(),
            'jenis' => $this->faker->randomElement(['Organisasi', 'Kepanitiaan', 'Kegiatan']),
            'jabatan' => $this->faker->randomElement(['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Anggota']),
            'periode_mulai' => $this->faker->date(),
            'periode_selesai' => $this->faker->date(),
            'deskripsi' => $this->faker->paragraph(),
            'file_sk' => 'sk_organisasi_' . $this->faker->word() . '.pdf',
            'foto_kegiatan' => 'foto_kegiatan_' . $this->faker->word() . '.jpg',
            'status' => $status,
            'catatan_admin' => $status === 'Ditolak' ? 'SK tidak valid' : null,
            'validated_by' => $status !== 'Menunggu' ? User::factory() : null,
            'validated_at' => $status !== 'Menunggu' ? now() : null,
        ];
    }
}
