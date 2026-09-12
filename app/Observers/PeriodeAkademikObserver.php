<?php

namespace App\Observers;

use App\Models\Konfigurasi;
use App\Models\PeriodeAkademik;

class PeriodeAkademikObserver
{
    /**
     * CATATAN PENTING (perubahan perilaku):
     *
     * Dulu observer ini memaksa hanya SATU periode aktif — setiap kali sebuah
     * periode diaktifkan, semua periode lain dinonaktifkan. Akibatnya mustahil
     * membuka periode untuk lebih dari satu tahun ajaran sekaligus.
     *
     * Sekarang beberapa periode boleh aktif bersamaan: setiap baris punya flag
     * `is_aktif` sendiri dan tidak saling menonaktifkan. Karena itu tidak ada
     * lagi penulisan ke key konfigurasi `periode_input_*` — key itu hanya bisa
     * menyimpan satu nilai, jadi tidak sanggup mewakili banyak periode.
     *
     * Sumber kebenaran "periode input" sekarang: tabel `periode_akademiks`,
     * dibaca lewat App\Helpers\PeriodeInputHelper.
     */
    public function saved(PeriodeAkademik $periode): void
    {
        // Tidak ada aksi: status aktif sepenuhnya ditentukan kolom is_aktif
        // pada baris periode itu sendiri.
    }

    /**
     * Saat periode terakhir yang aktif dihapus, matikan juga key konfigurasi
     * lama supaya pembaca versi lama tidak melihat "periode terbuka" tanpa
     * periode yang valid. Key ini hanya dipertahankan untuk kompatibilitas.
     */
    public function deleted(PeriodeAkademik $periode): void
    {
        if (! $periode->is_aktif) {
            return;
        }

        $masihAdaYangAktif = PeriodeAkademik::where('is_aktif', true)->exists();

        Konfigurasi::updateOrCreate(
            ['key' => 'periode_input_aktif'],
            [
                'value' => $masihAdaYangAktif ? '1' : '0',
                'label' => 'Periode Input Aktif',
                'tipe'  => 'boolean',
            ]
        );
    }
}
