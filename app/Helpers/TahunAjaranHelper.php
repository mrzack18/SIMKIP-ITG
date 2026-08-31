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
     * Menghitung semester secara matematis berdasarkan tahun masuk dan tahun ajaran
     */
    public static function calculateSemester(int $angkatan, ?string $tahunAjaran = null): int
    {
        if (!$tahunAjaran || $tahunAjaran === 'Semua') {
            $thn = \App\Models\Konfigurasi::get('tahun_akademik_aktif', '2025/2026');
            $sem = \App\Models\Konfigurasi::get('semester_aktif', 'Genap');
            $tahunAjaran = "$thn $sem";
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
}
