<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin
        User::firstOrCreate(['username' => 'admin'], [
            'name' => 'Encep Jianul Hayat',
            'username' => 'admin',
            'email' => 'admin@itg.ac.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_password_changed' => true,
        ]);

        // 2. Warek III
        User::firstOrCreate(['username' => 'warek3'], [
            'name' => 'Dr. Rina Kurniawati, S.E., M.Si.',
            'username' => 'warek3',
            'email' => 'warek3@itg.ac.id',
            'password' => Hash::make('warek123'),
            'role' => 'warek',
            'is_password_changed' => true,
        ]);

        // 3. Prodi TI
        $prodiTI = Prodi::where('kode', 'TI')->first();
        User::firstOrCreate(['username' => 'prodi_ti'], [
            'name' => 'Kaprodi Teknik Informatika',
            'username' => 'prodi_ti',
            'email' => 'prodi.ti@itg.ac.id',
            'password' => Hash::make('prodi123'),
            'role' => 'prodi',
            'prodi_id' => $prodiTI?->id,
            'is_password_changed' => true,
        ]);

        // 4. Prodi SI
        $prodiSI = Prodi::where('kode', 'SI')->first();
        User::firstOrCreate(['username' => 'prodi_si'], [
            'name' => 'Kaprodi Sistem Informasi',
            'username' => 'prodi_si',
            'email' => 'prodi.si@itg.ac.id',
            'password' => Hash::make('prodi123'),
            'role' => 'prodi',
            'prodi_id' => $prodiSI?->id,
            'is_password_changed' => true,
        ]);

        // 5. Mahasiswa (sample 5 orang)
        $mahasiswaSamples = [
            ['nim' => '2206001', 'nama' => 'Ahmad Rifaldi',  'prodi' => 'TI', 'angkatan' => 2022, 'kategori' => 'Reguler'],
            ['nim' => '2206015', 'nama' => 'Budi Setiawan',  'prodi' => 'TI', 'angkatan' => 2022, 'kategori' => 'Reguler'],
            ['nim' => '2206033', 'nama' => 'Citra Dewi',     'prodi' => 'TI', 'angkatan' => 2022, 'kategori' => 'Aspirasi'],
            ['nim' => '2306005', 'nama' => 'Eka Saputra',    'prodi' => 'TI', 'angkatan' => 2023, 'kategori' => 'Reguler'],
            ['nim' => '2306018', 'nama' => 'Fani Rahayu',    'prodi' => 'SI', 'angkatan' => 2023, 'kategori' => 'Aspirasi'],
        ];

        foreach ($mahasiswaSamples as $data) {
            $prodi = Prodi::where('kode', $data['prodi'])->first();

            $user = User::firstOrCreate(['username' => $data['nim']], [
                'name' => $data['nama'],
                'username' => $data['nim'],
                'email' => strtolower(str_replace(' ', '.', $data['nama'])) . '@student.itg.ac.id',
                'password' => Hash::make('kip' . $data['nim'] . '2026'),
                'role' => 'mahasiswa',
                'is_password_changed' => false,
            ]);

            Mahasiswa::firstOrCreate(['nim' => $data['nim']], [
                'user_id' => $user->id,
                'nim' => $data['nim'],
                'nama' => $data['nama'],
                'prodi_id' => $prodi?->id,
                'angkatan' => $data['angkatan'],
                'kategori' => $data['kategori'],
                'status' => 'Aktif',
                'nomor_sk' => 'SK/KIP-K/ITG/' . $data['angkatan'] . '/' . $data['nim'],
                'tanggal_sk' => $data['angkatan'] . '-09-01',
            ]);
        }
    }
}
