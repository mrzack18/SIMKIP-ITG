<?php

namespace App\Observers;

use App\Models\PeriodeAkademik;
use App\Models\Konfigurasi;

class PeriodeAkademikObserver
{
    /**
     * Single source of truth untuk "periode input nilai yang sedang aktif".
     *
     * Hanya mengelola keys `periode_input_*`. Keys `tahun_akademik_aktif` /
     * `semester_aktif` TIDAK disentuh di sini — itu milik eksklusif status
     * tahun ajaran di "Master Tahun Ajaran" (syncTahunAjaranAktif), supaya
     * aktivasi periode tidak menimpa semester akademik berjalan.
     */
    public function saved(PeriodeAkademik $periode): void
    {
        if ($periode->is_aktif) {
            // Nonaktifkan semua periode lain
            PeriodeAkademik::where('id', '!=', $periode->id)
                ->where('is_aktif', true)
                ->update(['is_aktif' => false]);

            Konfigurasi::updateOrCreate(
                ['key' => 'periode_input_aktif'],
                ['value' => '1', 'label' => 'Periode Input Aktif', 'tipe' => 'boolean']
            );
            Konfigurasi::updateOrCreate(
                ['key' => 'periode_input_buka'],
                ['value' => $periode->tanggal_buka->format('Y-m-d'), 'label' => 'Tanggal Buka', 'tipe' => 'date']
            );
            Konfigurasi::updateOrCreate(
                ['key' => 'periode_input_tutup'],
                ['value' => $periode->tanggal_tutup->format('Y-m-d'), 'label' => 'Tanggal Tutup', 'tipe' => 'date']
            );
            Konfigurasi::updateOrCreate(
                ['key' => 'periode_input_tahun_ajaran'],
                ['value' => $periode->tahun_akademik . ' ' . $periode->semester, 'label' => 'Periode Input TA', 'tipe' => 'text']
            );
        }
    }

    /**
     * Jika record aktif dihapus, nonaktifkan semua flag periode di konfigurasi
     * supaya mahasiswa tidak lagi melihat "periode terbuka" tapi tanpa TA valid.
     */
    public function deleted(PeriodeAkademik $periode): void
    {
        if ($periode->is_aktif) {
            Konfigurasi::updateOrCreate(
                ['key' => 'periode_input_aktif'],
                ['value' => '0', 'label' => 'Periode Input Aktif', 'tipe' => 'boolean']
            );
        }
    }
}
