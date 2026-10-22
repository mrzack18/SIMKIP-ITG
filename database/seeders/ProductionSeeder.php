<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProductionSeeder extends Seeder
{
    /**
     * Seeder akun awal untuk production.
     *
     * Hanya membuat 5 akun: admin, warek3, prodi, mahasiswa, dan lsipd.
     * Password default semua akun: "password" (wajib diganti saat login pertama).
     *
     * Jalankan: php artisan db:seed --class=ProductionSeeder --force
     */
    public function run(): void
    {
        $password = Hash::make('password');

        $prodi = Prodi::firstOrCreate(
            ['kode' => '06'],
            ['nama' => 'Teknik Informatika', 'is_aktif' => true],
        );

        $this->account('admin', 'Administrator SIMKIP', 'admin@itg.ac.id', 'admin', $password);
        $this->account('warek3', 'Wakil Rektor III', 'warek3@itg.ac.id', 'warek', $password);
        $this->account('prodi', 'Kaprodi Teknik Informatika', 'prodi@itg.ac.id', 'prodi', $password, $prodi->id);

        $mahasiswaUser = $this->account(
            'mahasiswa',
            'Mahasiswa SIMKIP',
            'mahasiswa@student.itg.ac.id',
            'mahasiswa',
            $password,
            $prodi->id,
        );

        Mahasiswa::updateOrCreate(
            ['user_id' => $mahasiswaUser->id],
            [
                'nim' => '0000001',
                'nama' => 'Mahasiswa SIMKIP',
                'prodi_id' => $prodi->id,
                'angkatan' => now()->year,
                'kategori' => 'Reguler',
                'status' => 'Aktif',
                'nomor_sk' => 'SK-PROD-0000001',
                'tanggal_sk' => now()->toDateString(),
            ],
        );

        $this->account('lsipd', 'Operator LSIPD', 'lsipd@itg.ac.id', 'lsipd', $password);
    }

    private function account(
        string $username,
        string $name,
        string $email,
        string $role,
        string $password,
        ?int $prodiId = null,
    ): User {
        $user = User::updateOrCreate(
            ['username' => $username],
            [
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'role' => $role,
                'prodi_id' => $prodiId,
                'is_password_changed' => false,
            ],
        );

        // is_active tidak termasuk fillable User, jadi ditulis langsung.
        $user->forceFill(['is_active' => true])->save();

        return $user->refresh();
    }
}
