<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::updateOrCreate(
            ['username' => 'admin_kemahasiswaan'],
            [
                'name' => 'Super Admin Kemahasiswaan',
                'email' => 'admin@itg.ac.id',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'admin',
                'is_password_changed' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
