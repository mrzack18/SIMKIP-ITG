<?php

namespace App\Services;

class IPKCalculatorService
{
    /** Grade → nilai mutu */
    private static array $gradeMap = [
        'A'  => 4.0,
        'AB' => 3.5,
        'B'  => 3.0,
        'BC' => 2.5,
        'C'  => 2.0,
        'D'  => 1.0,
        'E'  => 0.0,
    ];

    /** Nilai mutu → apakah lulus */
    private static array $lulusGrade = ['A', 'AB', 'B', 'BC', 'C'];

    public static function nilaiMutu(string $nilaiHuruf): float
    {
        return self::$gradeMap[strtoupper($nilaiHuruf)] ?? 0.0;
    }

    public static function isLulus(string $nilaiHuruf): bool
    {
        return in_array(strtoupper($nilaiHuruf), self::$lulusGrade);
    }

    /**
     * Hitung IPK dari array mata kuliah
     * @param array $mks [['sks' => 3, 'nilai_huruf' => 'A'], ...]
     */
    public static function hitungIPK(array $mks): float
    {
        $totalBobot = 0.0;
        $totalSKS   = 0;

        foreach ($mks as $mk) {
            $mutu = self::nilaiMutu($mk['nilai_huruf']);
            $totalBobot += $mutu * $mk['sks'];
            $totalSKS   += $mk['sks'];
        }

        if ($totalSKS === 0) return 0.0;

        return round($totalBobot / $totalSKS, 2);
    }

    /**
     * Siapkan data mata kuliah dengan nilai mutu dan lulus auto-calculated
     */
    public static function prepareMataKuliah(array $mks): array
    {
        return array_map(function ($mk) {
            return [
                'kode'        => $mk['kode'],
                'nama'        => $mk['nama'],
                'sks'         => (int) $mk['sks'],
                'nilai_huruf' => strtoupper($mk['nilai_huruf']),
                'nilai_mutu'  => self::nilaiMutu($mk['nilai_huruf']),
                'lulus'       => self::isLulus($mk['nilai_huruf']),
            ];
        }, $mks);
    }
}
