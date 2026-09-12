<?php

namespace App\Helpers;

use App\Models\Konfigurasi;

/**
 * Satu titik baca untuk ambang batas akademik yang bisa diatur di tab Regulasi.
 *
 * Dua hal yang sengaja diatur di sini dan tidak boleh diduplikasi di pemanggil:
 *
 * 1. **Key `*_aktif` yang belum ada dianggap AKTIF.** Jadi basis data yang sudah
 *    berjalan tetap berperilaku persis seperti sebelum fitur flag ada, dan baris
 *    flag baru muncul sendiri begitu toggle-nya disentuh.
 *
 * 2. **Pembacaan `*JikaAktif()` mengembalikan `null` saat aturannya dinonaktifkan**
 *    — bukan nilai default (flag jadi tak berefek) dan bukan 0 (`max_semester = 0`
 *    berarti SEMUA mahasiswa melanggar). `null` memaksa tiap pemanggil memutuskan
 *    secara eksplisit dan tidak bisa diam-diam masuk aritmetika.
 */
class AturanAkademik
{
    /** Ambang yang bisa dikonfigurasi beserta nilai bawakannya. */
    private const RULES = [
        'ipk_minimum'       => ['default' => '3.00', 'label' => 'IPK Minimum'],
        'masa_tenggang_sp'  => ['default' => '90',   'label' => 'Masa Tenggang SP'],
        'max_semester'      => ['default' => '8',    'label' => 'Batas Semester Studi'],
        'sks_minimum_lulus' => ['default' => '144',  'label' => 'Total SKS Kelulusan'],
    ];

    /** @var array<string, string|null>|null Cache per-request, diisi sekali oleh semua(). */
    private static ?array $cache = null;

    /** Daftar key ambang yang dikenal. */
    public static function keys(): array
    {
        return array_keys(self::RULES);
    }

    public static function label(string $key): string
    {
        return self::RULES[$key]['label'] ?? $key;
    }

    /**
     * Apakah aturan ini sedang diberlakukan?
     *
     * Sengaja `=== '1'`, bukan `!== '0'`: nilai kosong/rusak/null harus jatuh ke
     * NONAKTIF, bukan ke aktif. (PDO menyimpan boolean `false` sebagai string
     * kosong pada kolom text, jadi `!== '0'` akan salah menilainya aktif.)
     */
    public static function aktif(string $key): bool
    {
        // `?? '1'` = key flag yang BELUM ADA dianggap aktif. Inilah yang menjaga
        // basis data lama berperilaku persis seperti sebelum fitur flag ada.
        return (self::nilaiMentah("{$key}_aktif") ?? '1') === '1';
    }

    /** Ambang mentah, tanpa menghiraukan flag. Selalu ada nilainya. */
    public static function nilai(string $key): string
    {
        $v = self::nilaiMentah($key);

        return $v ?? (self::RULES[$key]['default'] ?? '');
    }

    /** Ambang bila aturannya hidup; null bila sedang dinonaktifkan. */
    public static function nilaiJikaAktif(string $key): ?string
    {
        return self::aktif($key) ? self::nilai($key) : null;
    }

    public static function angka(string $key): float
    {
        return (float) self::nilai($key);
    }

    /** Versi bertipe untuk konsumen aritmetika. Null = aturan mati, lewati pemeriksaan. */
    public static function angkaJikaAktif(string $key): ?float
    {
        $v = self::nilaiJikaAktif($key);

        return $v === null ? null : (float) $v;
    }

    public static function bilangan(string $key): int
    {
        return (int) self::nilai($key);
    }

    public static function bilanganJikaAktif(string $key): ?int
    {
        $v = self::nilaiJikaAktif($key);

        return $v === null ? null : (int) $v;
    }

    /**
     * Semua aturan sekaligus dalam SATU query — untuk indexAll() dan siapa pun
     * yang butuh lebih dari satu nilai.
     *
     * @return array<string, array{nilai: string, aktif: bool, label: string}>
     */
    public static function semua(): array
    {
        self::muatCache();

        $out = [];
        foreach (self::RULES as $key => $meta) {
            $out[$key] = [
                'nilai' => self::nilai($key),
                'aktif' => self::aktif($key),
                'label' => $meta['label'],
            ];
        }

        return $out;
    }

    /**
     * Buang cache per-request.
     *
     * WAJIB dipanggil setelah menulis key ambang/flag dalam request yang sama,
     * kalau tidak pembacaan berikutnya akan mengembalikan nilai lama. Saat ini
     * pemanggilnya adalah KonfigurasiController::update().
     */
    public static function lupakanCache(): void
    {
        self::$cache = null;
    }

    /**
     * Baca semua key yang relevan sekali jalan, lalu layani dari memori.
     *
     * Sengaja TIDAK memakai Cache:: atau config() lintas request: pengelola
     * konfigurasi mengubah ambang lalu langsung membuka halaman lain, dan
     * perubahan itu harus terlihat saat itu juga.
     */
    private static function muatCache(): void
    {
        if (self::$cache !== null) {
            return;
        }

        $keys = [];
        foreach (self::RULES as $key => $_) {
            $keys[] = $key;
            $keys[] = "{$key}_aktif";
        }

        self::$cache = Konfigurasi::whereIn('key', $keys)->pluck('value', 'key')->all();
    }

    private static function nilaiMentah(string $key): ?string
    {
        self::muatCache();
        $v = self::$cache[$key] ?? null;

        return $v === null ? null : (string) $v;
    }
}
