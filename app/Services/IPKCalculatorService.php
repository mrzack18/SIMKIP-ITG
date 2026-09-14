<?php

namespace App\Services;

use App\Models\MataKuliah;
use App\Models\IpkSemestr;
use App\Models\Mahasiswa;
use App\Models\NilaiMutu;
use Illuminate\Support\Facades\Cache;

class IPKCalculatorService
{
    /**
     * Nilai huruf netral dari LSIPD: "-" (belum dinilai) dan "T" (dosen belum
     * menginput nilai). Baris tetap bagus ditampilkan di transkrip, tetapi tidak
     * menyumbang bobot maupun SKS ke perhitungan IPS/IPK, dan tidak dianggap
     * sebagai mata kuliah yang belum lulus.
     */
    public const NILAI_HURUF_NETRAL = ['-', 'T'];

    public static function isNilaiNetral(string $nilaiHuruf): bool
    {
        return in_array(strtoupper($nilaiHuruf), self::NILAI_HURUF_NETRAL, true);
    }

    /**
     * Label status satu mata kuliah — aturan tunggal untuk seluruh halaman.
     *
     * Penting: "Belum Lulus" HANYA untuk nilai D dan E. Nilai netral dari LSIPD
     * punya arti sendiri dan tidak boleh disebut "belum lulus":
     * - "-" : mata kuliah belum pernah diambil mahasiswa
     * - "T" : mahasiswa sudah mengambil, dosen belum menginput nilainya
     *
     * Dikembalikan sebagai teks siap tampil supaya aturannya tidak diduplikasi
     * (dan tidak bisa berbeda) di tiap halaman frontend.
     */
    public static function statusMk(string $nilaiHuruf): string
    {
        $nilai = strtoupper(trim($nilaiHuruf));

        return match ($nilai) {
            '-'      => 'MK Belum Diambil',
            'T'      => 'Dosen Belum Menilai',
            'D', 'E' => 'Belum Lulus',
            ''       => 'Belum Dinilai',
            default  => 'Lulus',
        };
    }

    /** Kode status mesin untuk keperluan pewarnaan/ikon di frontend. */
    public static function statusMkKode(string $nilaiHuruf): string
    {
        $nilai = strtoupper(trim($nilaiHuruf));

        return match ($nilai) {
            '-'      => 'belum_diambil',
            'T'      => 'belum_dinilai',
            'D', 'E' => 'belum_lulus',
            ''       => 'kosong',
            default  => 'lulus',
        };
    }

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
            if (self::isNilaiNetral((string) $mk['nilai_huruf'])) {
                continue;
            }
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
            // Alasan wajib diisi mahasiswa saat mengubah Nilai Huruf; simpan null
            // bila kosong supaya kolom nullable tidak terisi string kosong.
            $alasan = isset($mk['alasan_perubahan']) ? trim((string) $mk['alasan_perubahan']) : '';

            return [
                'kode'        => $mk['kode'],
                'nama'        => $mk['nama'],
                'sks'         => (int) $mk['sks'],
                'nilai_huruf' => strtoupper($mk['nilai_huruf']),
                'nilai_mutu'  => self::nilaiMutu($mk['nilai_huruf']),
                'lulus'       => self::isLulus($mk['nilai_huruf']),
                'alasan_perubahan' => $alasan !== '' ? $alasan : null,
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
     *
     * PENTING: bila belum ada satu pun mata kuliah bernilai (A–E), IPS/IPK disimpan
     * sebagai NULL — bukan 0. "0" berarti nilai asli (mis. semua E), sedangkan NULL
     * berarti mahasiswa belum punya nilai sama sekali. Tanpa pemisahan ini, mahasiswa
     * baru (angkatan terbaru) ikut terhitung sebagai "IPK < 3".
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
                if (self::isNilaiNetral((string) $mk->nilai_huruf)) {
                    continue;
                }
                $ipsBobot += $mk->nilai_mutu * $mk->sks;
                $ipsSks += $mk->sks;
            }
            $ips = $ipsSks > 0 ? round($ipsBobot / $ipsSks, 2) : null;

            // --- IPK: kumulatif dari semester 1 sampai semester ini ---
            $uniqueMks = self::getUniqueCoursesUpToSemester($mahasiswaId, $sem->semester);
            $ipkBobot = 0.0;
            $ipkSks = 0;
            foreach ($uniqueMks as $mk) {
                if (self::isNilaiNetral((string) $mk->nilai_huruf)) {
                    continue;
                }
                $ipkBobot += $mk->nilai_mutu * $mk->sks;
                $ipkSks += $mk->sks;
            }
            $ipk = $ipkSks > 0 ? round($ipkBobot / $ipkSks, 2) : null;

            $sem->update(['ipk' => $ipk, 'ips' => $ips]);
        }
    }

    /**
     * Null-kan IPS/IPK pada baris semester yang belum punya mata kuliah bernilai.
     *
     * Dipakai sync LSIPD (yang menulis angka official dari upstream) dan backfill
     * data lama: nilai 0 dari upstream hanyalah placeholder saat transkrip masih
     * kosong. Yang di-null-kan hanya baris tanpa nilai; baris dengan nilai asli 0
     * (semua E) tetap dipertahankan. IPS dilihat per semester, IPK kumulatif s.d.
     * semester tersebut.
     *
     * @return int jumlah baris yang diubah
     */
    public static function bersihkanNilaiTanpaMK(?int $mahasiswaId = null): int
    {
        $query = Mahasiswa::query()->select('id');
        if ($mahasiswaId !== null) {
            $query->whereKey($mahasiswaId);
        }

        $diubah = 0;
        $query->chunkById(200, function ($mahasiswas) use (&$diubah) {
            foreach ($mahasiswas as $mahasiswa) {
                $semesters = IpkSemestr::where('mahasiswa_id', $mahasiswa->id)
                    ->with('mataKuliahs')
                    ->orderBy('semester', 'asc')
                    ->get();

                $adaNilaiKumulatif = false;
                foreach ($semesters as $sem) {
                    $adaNilaiSemester = $sem->mataKuliahs->contains(
                        fn ($mk) => ! self::isNilaiNetral((string) $mk->nilai_huruf)
                    );
                    $adaNilaiKumulatif = $adaNilaiKumulatif || $adaNilaiSemester;

                    $update = [];
                    if (! $adaNilaiSemester && $sem->ips !== null) {
                        $update['ips'] = null;
                    }
                    if (! $adaNilaiKumulatif && $sem->ipk !== null) {
                        $update['ipk'] = null;
                    }
                    if ($update) {
                        $sem->update($update);
                        $diubah++;
                    }
                }
            }
        });

        return $diubah;
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
            // Nilai netral ("-"/"T" = belum dinilai) bukan mata kuliah gagal.
            if (self::isNilaiNetral((string) $mk->nilai_huruf)) {
                continue;
            }

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
