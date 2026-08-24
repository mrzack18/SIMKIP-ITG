<?php

namespace App\Services;

use App\Models\Mahasiswa;
use App\Models\SuratPeringatan;

class SPValidationService
{
    /**
     * Validasi apakah level SP boleh diterbitkan untuk mahasiswa ini.
     * Return null jika valid, return string error jika tidak valid.
     */
    public static function validate(Mahasiswa $mahasiswa, string $level, string $jenis): ?string
    {
        if ($mahasiswa->status !== 'Aktif') {
            return 'Mahasiswa tidak dalam status Aktif. SP tidak dapat diterbitkan.';
        }

        // Cuti Tanpa Izin → langsung SP3
        if ($jenis === 'Cuti Tanpa Izin' && $level !== 'SP3') {
            return 'Pelanggaran Cuti Tanpa Izin harus langsung SP3.';
        }

        // Dapatkan SP aktif terakhir
        $spTerakhir = $mahasiswa->suratPeringatans()
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->orderByDesc('id')
            ->first();

        $levelOrder = ['SP1' => 1, 'SP2' => 2, 'SP3' => 3];
        $targetOrder = $levelOrder[$level] ?? 0;

        if ($jenis !== 'Cuti Tanpa Izin') {
            if ($spTerakhir === null) {
                // Belum ada SP, harus SP1
                if ($level !== 'SP1') {
                    return 'Mahasiswa belum pernah mendapat SP. SP pertama harus SP1.';
                }
            } else {
                $lastOrder = $levelOrder[$spTerakhir->level] ?? 0;
                if ($targetOrder !== $lastOrder + 1) {
                    $expected = ['SP1' => 'SP2', 'SP2' => 'SP3'][$spTerakhir->level] ?? 'SP berikutnya';
                    return "SP harus berurutan. SP aktif terakhir: {$spTerakhir->level}. SP berikutnya harus: {$expected}.";
                }
            }
        }

        return null; // Valid
    }

    /**
     * Setelah SP3 diterbitkan, update status mahasiswa menjadi Dicabut
     */
    public static function handleSP3(Mahasiswa $mahasiswa): void
    {
        $mahasiswa->update(['status' => 'Dicabut']);
    }
}
