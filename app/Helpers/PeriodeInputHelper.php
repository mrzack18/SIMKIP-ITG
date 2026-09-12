<?php

namespace App\Helpers;

use App\Models\PeriodeAkademik;
use Carbon\Carbon;

/**
 * Aturan tunggal "periode input nilai" untuk seluruh aplikasi.
 *
 * Sumber kebenarannya adalah tabel `periode_akademiks`, BUKAN key konfigurasi
 * `periode_input_*`. Alasannya: satu periode = satu tahun ajaran, sedangkan key
 * konfigurasi hanya bisa menyimpan satu nilai — sehingga mustahil ada lebih dari
 * satu tahun ajaran yang dibuka bersamaan. Key `periode_input_*` lama ditinggalkan
 * (tidak lagi ditulis maupun dibaca) dan bisa dibersihkan kapan saja.
 *
 * Beberapa tahun ajaran boleh aktif sekaligus: setiap baris punya flag `is_aktif`
 * sendiri dan tidak lagi saling menonaktifkan.
 */
class PeriodeInputHelper
{
    /** Samakan format tahun ajaran dari berbagai sumber. */
    public static function normalisasi(string $ta): string
    {
        return trim(str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $ta));
    }

    /**
     * Periode yang sedang aktif untuk satu tahun ajaran.
     *
     * @param string|null $tahunAjaran Format apa pun yang dipakai filter frontend
     *                                 ("Tahun 2025/2026-1") maupun format internal
     *                                 ("2025/2026 Ganjil"). null / "Semua" = tanpa filter.
     */
    public static function untukTahunAjaran(?string $tahunAjaran): ?PeriodeAkademik
    {
        $query = PeriodeAkademik::where('is_aktif', true);

        if ($tahunAjaran === null || $tahunAjaran === '' || $tahunAjaran === 'Semua') {
            // Tanpa filter: pakai periode aktif mana pun yang tanggalnya paling
            // relevan (buka terbaru) supaya halaman tetap punya acuan.
            return $query->orderByDesc('tanggal_buka')->first();
        }

        $ta = self::normalisasi($tahunAjaran);

        // Format kolom: "2025/2026 Ganjil" (tahun_akademik + spasi + semester).
        return $query->whereRaw("CONCAT(tahun_akademik, ' ', semester) = ?", [$ta])->first();
    }

    /** Semua periode aktif (boleh lebih dari satu). */
    public static function semuaAktif()
    {
        return PeriodeAkademik::where('is_aktif', true)
            ->orderByDesc('tanggal_buka')
            ->get();
    }

    /**
     * Pesan alasan sebuah periode belum/tidak bisa dipakai, atau null bila boleh.
     *
     * Dipisah dari pencarian periode supaya pemanggil bisa membedakan:
     * - belum ada periode aktif untuk TA itu  -> "belum dibuka"
     * - ada tapi tanggalnya belum mulai       -> "belum dibuka, dibuka pada ..."
     * - ada tapi sudah lewat                  -> "sudah ditutup pada ..."
     */
    public static function alasanTidakBisa(?PeriodeAkademik $periode, ?string $tahunAjaran, ?Carbon $now = null): ?string
    {
        $now = $now ?: Carbon::now();
        $ta  = ($tahunAjaran === null || $tahunAjaran === 'Semua')
            ? ''
            : self::normalisasi($tahunAjaran);

        if (! $periode) {
            return $ta !== ''
                ? "Periode input untuk {$ta} belum dibuka. Hubungi pengelola untuk membukanya."
                : 'Periode input nilai sedang tidak aktif.';
        }

        if ($now->lt($periode->tanggal_buka)) {
            return 'Periode input nilai belum dibuka. Dibuka pada '
                . $periode->tanggal_buka->format('d M Y') . '.';
        }

        if ($now->gt($periode->tanggal_tutup)) {
            return 'Periode input nilai sudah ditutup pada '
                . $periode->tanggal_tutup->format('d M Y') . '.';
        }

        return null;
    }
}
