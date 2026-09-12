<?php

use App\Helpers\TahunAjaranHelper;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Perbaiki kolom `ipk_semestrs.tahun_ajaran` yang berisi "Semester 1".."Semester 8".
 *
 * Penyebabnya di hulu, bukan di aplikasi ini: API LSIPD mengirim field bernama
 * `tahun_ajaran` yang isinya justru "Semester N", dan sync menyalinnya apa adanya.
 * Upstream tidak menyediakan tahun ajaran sama sekali — sudah diperiksa pada
 * /kipk/transkrip (hanya semester/ips/ipk per baris; ringkasan hanya ipk+sks;
 * transkrip hanya kdmk/nakmk/sksmk/nlakh) maupun /kipk/mahasiswa (hanya biodata
 * + angkatan). Jadi nilainya diturunkan dari `mahasiswas.angkatan` memakai
 * TahunAjaranHelper::tahunAjaranDariSemester() — rumus yang sama dengan yang
 * sekarang dipakai LsipdSyncService, sehingga data lama dan data hasil sync
 * berikutnya konsisten.
 *
 * Yang ikut sembuh: TahunAjaranHelper::applyTahunAjaranFilter() pada
 * `ipk_semestrs.tahun_ajaran` (dipakai antrean dokumen KHS di
 * Admin\DokumenController) selama ini tidak pernah cocok, karena kolom yang
 * dibandingkan dengan "2025/2026 Ganjil" isinya "Semester 5".
 *
 * Pada instalasi baru yang datanya dari seeder, `like 'Semester %'` tidak
 * mengenai apa pun sehingga migration ini tidak berefek — itu memang yang
 * diinginkan.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Peta angkatan diambil sekali: hanya ratusan baris, dan jauh lebih murah
        // daripada JOIN berulang per batch.
        $angkatanPerMahasiswa = DB::table('mahasiswas')->pluck('angkatan', 'id');

        // chunkById, BUKAN chunk: kolom yang sedang diubah adalah kolom yang dipakai
        // sebagai filter, jadi paging berbasis offset akan melompati baris begitu
        // baris sebelumnya tidak lagi cocok dengan filternya.
        DB::table('ipk_semestrs')
            ->where('tahun_ajaran', 'like', 'Semester %')
            ->chunkById(500, function ($rows) use ($angkatanPerMahasiswa) {
                foreach ($rows as $row) {
                    $angkatan = (int) ($angkatanPerMahasiswa[$row->mahasiswa_id] ?? 0);
                    $ta = TahunAjaranHelper::tahunAjaranDariSemester($angkatan, (int) $row->semester);

                    if ($ta === '') {
                        continue; // angkatan tidak diketahui — biarkan apa adanya
                    }

                    DB::table('ipk_semestrs')
                        ->where('id', $row->id)
                        ->update(['tahun_ajaran' => $ta]);
                }
            });
    }

    /**
     * Sengaja tidak mengembalikan nilai lama.
     *
     * "Semester N" tidak memuat informasi tahun ajaran apa pun, jadi tidak ada yang
     * layak dipulihkan. Mengembalikannya juga tidak bisa dilakukan dengan aman:
     * satu-satunya penanda baris mana yang diubah migration ini adalah "nilainya
     * sama dengan hasil turunan", dan baris yang memang sudah benar sejak awal
     * (mis. dari seeder) akan ikut dirusak oleh tebakan itu.
     *
     * Kalau memang perlu dikembalikan, nilai lamanya bisa dihitung ulang — bentuknya
     * persis sama untuk setiap baris, tidak bergantung pada apa pun selain kolom
     * `semester`:
     *
     *     UPDATE ipk_semestrs SET tahun_ajaran = CONCAT('Semester ', semester);
     */
    public function down(): void
    {
        // tidak ada yang dikerjakan — lihat keterangan di atas.
    }
};
