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

        // Dapatkan semua SP yang pernah diterima mahasiswa (aktif maupun selesai)
        $receivedLevels = $mahasiswa->suratPeringatans()
            ->pluck('level')
            ->unique()
            ->values()
            ->toArray();

        // Tidak boleh menerbitkan SP level yang sudah pernah diterima
        if (in_array($level, $receivedLevels)) {
            return "Mahasiswa ini sudah pernah menerima {$level}. Setiap tingkat SP hanya dapat diterbitkan sekali.";
        }

        // SP3 hanya boleh diterbitkan jika mahasiswa sudah memiliki SP1 dan SP2
        if ($level === 'SP3' && (!in_array('SP1', $receivedLevels) || !in_array('SP2', $receivedLevels))) {
            $missing = [];
            if (!in_array('SP1', $receivedLevels)) $missing[] = 'SP1';
            if (!in_array('SP2', $receivedLevels)) $missing[] = 'SP2';
            return 'SP3 hanya dapat diterbitkan setelah mahasiswa memiliki SP1 dan SP2. Belum terpenuhi: ' . implode(' dan ', $missing) . '.';
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
