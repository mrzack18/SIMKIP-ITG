<?php

namespace Database\Factories;

use App\Models\Prestasi;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PrestasiFactory extends Factory
{
    protected $model = Prestasi::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['Menunggu Validasi', 'Disetujui', 'Ditolak']);
        $tingkat = $this->faker->randomElement(['Internasional', 'Nasional', 'Wilayah']);
        
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'nama_prestasi' => $this->faker->sentence(3),
            'tingkat' => $tingkat,
            'pencapaian' => $this->faker->randomElement(['Juara 1', 'Juara 2', 'Juara 3', 'Finalis', 'Best Presenter']),
            'penyelenggara' => $this->faker->company(),
            'tanggal_mulai' => $this->faker->date(),
            'tanggal_selesai' => $this->faker->date(),
            'tempat' => $this->faker->city(),
            'deskripsi' => $this->faker->paragraph(),
            'link_penyelenggara' => $this->faker->url(),
            'file_sertifikat' => 'sertifikat_' . $this->faker->word() . '.pdf',
            'file_foto' => 'foto_' . $this->faker->word() . '.jpg',
            'status' => $status,
            'catatan_admin' => $status === 'Ditolak' ? 'Dokumen tidak lengkap atau buram' : null,
            'validated_by' => $status !== 'Menunggu Validasi' ? User::factory() : null,
            'validated_at' => $status !== 'Menunggu Validasi' ? now() : null,
        ];
    }
}
