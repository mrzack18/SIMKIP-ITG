<?php

namespace App\Helpers;

use Carbon\Carbon;

class TahunAjaranHelper
{
    /**
     * Parse "Tahun 2024/2025-1" or "2024/2025 Ganjil" to a date range.
     */
    public static function getDateRange(?string $tahunAjaran): ?array
    {
        if (!$tahunAjaran || $tahunAjaran === 'Semua') return null;

        // Normalize format
        $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);

        if (preg_match('/^(\d{4})\/\d{4}\s+(Ganjil|Genap)$/', $tahunAjaran, $matches)) {
            $year1 = (int) $matches[1];
            $year2 = $year1 + 1;
            $semester = $matches[2];

            if ($semester === 'Ganjil') {
                return [
                    Carbon::create($year1, 9, 1)->startOfDay(),
                    Carbon::create($year2, 1, 31)->endOfDay()
                ];
            } else {
                return [
                    Carbon::create($year2, 2, 1)->startOfDay(),
                    Carbon::create($year2, 8, 31)->endOfDay()
                ];
            }
        }

        return null;
    }

    public static function applyDateRangeFilter($query, $columnName, ?string $tahunAjaran)
    {
        $range = self::getDateRange($tahunAjaran);
        if ($range) {
            $query->whereBetween($columnName, [$range[0], $range[1]]);
        }
        return $query;
    }

    public static function applyDateMaxFilter($query, $columnName, ?string $tahunAjaran)
    {
        $range = self::getDateRange($tahunAjaran);
        if ($range) {
            // Only filter up to the END of the academic year
            $query->where($columnName, '<=', $range[1]);
        }
        return $query;
    }

    /**
     * Filter data that has a duration (start & end dates) to see if it overlaps with the academic year.
     * Overlap condition: start <= semester_end AND end >= semester_start
     */
    public static function applyOverlapFilter($query, string $startCol, string $endCol, ?string $tahunAjaran)
    {
        $range = self::getDateRange($tahunAjaran);
        if ($range) {
            $query->where($startCol, '<=', $range[1])
                  ->where($endCol, '>=', $range[0]);
        }
        return $query;
    }

    /**
     * Filter tabel yang MEMILIKI kolom `tahun_ajaran` (mis. ipk_semestrs)
     * dengan membandingkan langsung ke nilai kolom tersebut, bukan ke created_at.
     *
     * Menangani semua varian format yang ada di DB:
     *   - "Tahun 2025/2026-1"   (legacy format dari frontend)
     *   - "2025/2026-1"         (tanpa prefix "Tahun ")
     *   - "2025/2026 Ganjil"    (normalized format)
     *
     * @param  \Illuminate\Database\Query\Builder|\Illuminate\Database\Eloquent\Builder  $query
     */
    public static function applyTahunAjaranFilter($query, string $columnName, ?string $tahunAjaran)
    {
        if (!$tahunAjaran || $tahunAjaran === 'Semua') return $query;

        // Normalisasi ke format readable "2025/2026 Ganjil"
        $normalized = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);

        // Bangun varian legacy "Tahun 2025/2026-1" dari format normalized
        $legacyFormat = null;
        if (preg_match('/^(\d{4}\/\d{4})\s+(Ganjil|Genap)$/', $normalized, $m)) {
            $num = $m[2] === 'Ganjil' ? '1' : '2';
            $legacyFormat = "Tahun {$m[1]}-{$num}";
        }

        // Kumpulkan semua varian yang mungkin cocok
        $variants = array_values(array_unique(array_filter([
            $tahunAjaran,                           // input asli
            $normalized,                            // "2025/2026 Ganjil"
            $legacyFormat,                          // "Tahun 2025/2026-1" (built jika applicable)
            str_replace('Tahun ', '', $tahunAjaran), // "2025/2026-1"
        ])));

        return $query->whereIn($columnName, $variants);
    }

    /**
     * Menghitung semester secara matematis berdasarkan tahun masuk dan tahun ajaran
     */
    public static function calculateSemester(int $angkatan, ?string $tahunAjaran = null): int
    {
        if (!$tahunAjaran || $tahunAjaran === 'Semua') {
            $thn = \App\Models\Konfigurasi::get('tahun_akademik_aktif');
            $sem = \App\Models\Konfigurasi::get('semester_aktif');
            if ($thn && $sem) {
                $tahunAjaran = "$thn $sem";
            } else {
                // Dulu di sini ada fallback ke key konfigurasi
                // `periode_input_tahun_ajaran`. Key itu ditinggalkan karena hanya
                // bisa menyimpan SATU periode, sementara sekarang beberapa tahun
                // ajaran boleh dibuka bersamaan — tidak ada satu TA yang bisa
                // dianggap "yang berlaku". Jadi langsung pakai kalender berjalan.
                $month = (int) date('n');
                $year  = (int) date('Y');
                if ($month >= 8) {
                    $tahunAjaran = "$year/" . ($year + 1) . ' Ganjil';
                } elseif ($month >= 2) {
                    $tahunAjaran = ($year - 1) . "/$year Genap";
                } else {
                    $tahunAjaran = ($year - 1) . "/$year Ganjil";
                }
            }
        }
        
        if (!$tahunAjaran) return 0;

        $ta = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);
        if (preg_match('/^(\d{4})\/\d{4}\s+(Ganjil|Genap)$/', $ta, $matches)) {
            $startYear = (int) $matches[1];
            $termValue = $matches[2] === 'Genap' ? 2 : 1;
            
            $sem = (($startYear - $angkatan) * 2) + $termValue;
            return max(0, $sem);
        }

        return 0;
    }

    /**
     * Kebalikan dari calculateSemester(): turunkan tahun ajaran dari angkatan + semester.
     *
     * Diperlukan karena API LSIPD tidak menyediakan tahun ajaran sama sekali — field
     * `tahun_ajaran` pada responsnya justru berisi "Semester 1", "Semester 2", dst
     * (lihat LsipdSyncService::upsertProgresAkademik()). Satu-satunya sumber yang
     * tersedia adalah `angkatan`, jadi tahun ajaran harus dihitung.
     *
     * Rumusnya cermin dari calculateSemester() di atas, dan sengaja sama persis dengan
     * getTahunAjaran() di BebasTanggunganTestSeeder supaya bolak-baliknya konsisten:
     * calculateSemester(angkatan, tahunAjaranDariSemester(angkatan, n)) === n.
     *
     * CATATAN: ini mengasumsikan mahasiswa maju dua semester per tahun tanpa cuti atau
     * mengulang. Tidak ada cara yang lebih akurat selama upstream tidak mengirim TA.
     *
     * @return string "2022/2023 Ganjil", atau '' bila angkatan/semester tidak masuk akal.
     */
    public static function tahunAjaranDariSemester(int $angkatan, int $semester): string
    {
        if ($angkatan <= 0 || $semester <= 0) {
            return '';
        }

        $tahunAwal = $angkatan + intdiv($semester - 1, 2);
        $label     = ($semester % 2 === 1) ? 'Ganjil' : 'Genap';

        return $tahunAwal . '/' . ($tahunAwal + 1) . ' ' . $label;
    }
}
