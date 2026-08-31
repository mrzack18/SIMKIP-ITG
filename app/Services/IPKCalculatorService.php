<?php

namespace App\Services;

use App\Models\MataKuliah;
use App\Models\IpkSemestr;
use App\Models\NilaiMutu;
use Illuminate\Support\Facades\Cache;

class IPKCalculatorService
{
    private static function getNilaiMutuMap(): array
    {
        return Cache::remember('nilai_mutu_map', 3600, function () {
            return NilaiMutu::all()->keyBy(fn($n) => strtoupper($n->huruf))->toArray();
        });
    }

    public static function nilaiMutu(string $nilaiHuruf): float
    {
        $map = self::getNilaiMutuMap();
        $key = strtoupper($nilaiHuruf);
        return isset($map[$key]) ? (float) $map[$key]['poin'] : 0.0;
    }

    public static function isLulus(string $nilaiHuruf): bool
    {
        $map = self::getNilaiMutuMap();
        $key = strtoupper($nilaiHuruf);
        return isset($map[$key]) ? (bool) $map[$key]['lulus'] : false;
    }

    /**
     * Hitung IPS dari array mata kuliah
     * @param array $mks [['sks' => 3, 'nilai_huruf' => 'A'], ...]
     */
    public static function hitungIPS(array $mks): float
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

    /**
     * Get unique courses for a student up to a specific semester
     */
    public static function getUniqueCoursesUpToSemester(int $mahasiswaId, int $maxSemester): array
    {
        $allMKs = MataKuliah::whereHas('ipkSemestr', function($q) use ($mahasiswaId, $maxSemester) {
            $q->where('mahasiswa_id', $mahasiswaId)->where('semester', '<=', $maxSemester);
        })
        ->join('ipk_semestrs', 'mata_kuliahs.ipk_semester_id', '=', 'ipk_semestrs.id')
        ->select('mata_kuliahs.*', 'ipk_semestrs.semester as semester')
        ->orderBy('ipk_semestrs.semester', 'asc')
        ->get();

        $uniqueMks = [];
        foreach ($allMKs as $mk) {
            // Replace old entry with the newer one (since ordered by semester asc)
            $uniqueMks[strtoupper($mk->kode)] = $mk;
        }

        return $uniqueMks;
    }

    /**
     * Recalculate IPK Kumulatif and IPS per semester for all semesters of a student.
     * IPK = kumulatif dari semester 1 sampai N (rata-rata berbobot seluruh MK lulus)
     * IPS = nilai semester itu saja (rata-rata berbobot MK semester tersebut saja)
     */
    public static function recalculateAllIPK(int $mahasiswaId): void
    {
        $semesters = IpkSemestr::where('mahasiswa_id', $mahasiswaId)
            ->with('mataKuliahs')
            ->orderBy('semester', 'asc')
            ->get();

        foreach ($semesters as $sem) {
            // --- IPS: hitung dari mata kuliah semester ini saja ---
            $ipsBobot = 0.0;
            $ipsSks = 0;
            foreach ($sem->mataKuliahs as $mk) {
                $ipsBobot += $mk->nilai_mutu * $mk->sks;
                $ipsSks += $mk->sks;
            }
            $ips = $ipsSks > 0 ? round($ipsBobot / $ipsSks, 2) : 0.0;

            // --- IPK: kumulatif dari semester 1 sampai semester ini ---
            $uniqueMks = self::getUniqueCoursesUpToSemester($mahasiswaId, $sem->semester);
            $ipkBobot = 0.0;
            $ipkSks = 0;
            foreach ($uniqueMks as $mk) {
                $ipkBobot += $mk->nilai_mutu * $mk->sks;
                $ipkSks += $mk->sks;
            }
            $ipk = $ipkSks > 0 ? round($ipkBobot / $ipkSks, 2) : 0.0;

            $sem->update(['ipk' => $ipk, 'ips' => $ips]);
        }
    }

    /**
     * Dapatkan mata kuliah yang bernilai D/E yang belum lulus (Carry-Over)
     */
    public static function getCarryOver(int $mahasiswaId): array
    {
        // Get unique courses up to the latest semester (using an arbitrarily large maxSemester)
        $uniqueMks = self::getUniqueCoursesUpToSemester($mahasiswaId, 999);
        $carryOver = [];
        
        foreach ($uniqueMks as $mk) {
            if (!self::isLulus($mk->nilai_huruf)) {
                $carryOver[] = [
                    'kode' => $mk->kode,
                    'nama' => $mk->nama,
                    'sks' => $mk->sks,
                    'nilaiHuruf' => $mk->nilai_huruf,
                    'semesterAwal' => "Semester " . $mk->semester,
                ];
            }
        }
        
        // Sort by semester ascending
        usort($carryOver, fn($a, $b) => $a['semesterAwal'] <=> $b['semesterAwal']);
        return $carryOver;
    }
}
