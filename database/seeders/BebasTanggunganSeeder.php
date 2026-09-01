<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mahasiswa;
use App\Models\BebasTanggungan;
use App\Models\BebasTanggunganHistory;
use App\Models\User;
use Carbon\Carbon;

class BebasTanggunganSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        // Ambil mahasiswa angkatan 2022 dan 2023
        $mahasiswas = Mahasiswa::whereIn('angkatan', ['2022', '2023'])->get();

        if ($mahasiswas->isEmpty()) {
            echo "  ⚠ Tidak ada mahasiswa angkatan 2022/2023. Lewati.\n";
            return;
        }

        // Kelompokkan berdasarkan angkatan + archetype (excellent=indeks 0, struggling=indeks 1, mixed=indeks 2)
        $groups = $mahasiswas->groupBy(function ($m) {
            return $m->angkatan;
        });

        // Status yang akan diberikan
        // Archetype excellent (seq % 3 == 1)  → Disetujui (sudah menyelesaikan semua)
        // Archetype struggling (seq % 3 == 2)  → Menunggu / Ditolak
        // Archetype mixed (seq % 3 == 0)      → Menunggu / Ditolak
        $seqCounter = [];

        foreach ($groups as $ta => $mhsList) {
            $seqCounter[$ta] = 0;
            foreach ($mhsList as $mhs) {
                $seqCounter[$ta]++;
                $seq = $seqCounter[$ta];
                $mod3 = $seq % 3; // 1=excellent, 2=struggling, 0=mixed

                $tanggalAjukan = $this->getTanggalAjukan($ta, $mod3);
                $status = $this->getStatus($mod3);
                $reviewedBy = $admin?->id;

                // Cek apakah sudah ada record
                $exists = BebasTanggungan::where('mahasiswa_id', $mhs->id)->exists();
                if ($exists) {
                    echo "  — {$mhs->nim} ({$ta}) sudah punya record, lewati.\n";
                    continue;
                }

                $bt = BebasTanggungan::create([
                    'mahasiswa_id'  => $mhs->id,
                    'tanggal_ajukan'=> $tanggalAjukan,
                    'status'        => $status,
                    'reviewed_by'   => in_array($status, ['Disetujui', 'Ditolak']) ? $reviewedBy : null,
                    'reviewed_at'   => in_array($status, ['Disetujui', 'Ditolak']) ? $tanggalAjukan->copy()->addDays(rand(3, 14)) : null,
                    'tanggal_terbit'=> $status === 'Disetujui' ? $tanggalAjukan->copy()->addDays(rand(5, 15)) : null,
                    'catatan_admin' => $status === 'Ditolak' ? $this->getAlasanDitolak($mhs, $mod3) : null,
                ]);

                // Generate nomor surat untuk yang disetujui
                if ($status === 'Disetujui') {
                    $nomor = 'SKPS/KIP-K/ITG/' . strtoupper($tanggalAjukan->format('m/Y')) . '/' . str_pad($bt->id, 3, '0', STR_PAD_LEFT);
                    $bt->update(['nomor_surat' => $nomor]);
                }

                // Buat history untuk yang ditolak
                if ($status === 'Ditolak') {
                    $alasan = $this->getAlasanDitolak($mhs, $mod3);
                    BebasTanggunganHistory::create([
                        'bebas_tanggungan_id' => $bt->id,
                        'status'      => 'Ditolak',
                        'catatan'     => $alasan,
                        'reviewed_by'  => $reviewedBy,
                    ]);

                    // Buat juga record baru (dia apply ulang) dengan status Menunggu
                    $applyUlang = BebasTanggungan::create([
                        'mahasiswa_id'  => $mhs->id,
                        'tanggal_ajukan'=> Carbon::now()->subDays(rand(5, 20)),
                        'status'        => 'Menunggu',
                    ]);
                    echo "  ✓ {$mhs->nim} — ditolak, apply ulang (id:{$applyUlang->id})\n";
                }

                echo "  ✓ {$mhs->nim} ({$ta}) — status: {$status} (id:{$bt->id})\n";
            }
        }

        echo "\nBebasTanggunganSeeder done.\n";
    }

    private function getTanggalAjukan(string $ta, int $mod3): Carbon
    {
        $taInt = (int) $ta;

        if ($ta === '2022') {
            // TA 2022 mengajukan di semester 8 = 2025/2026 Genap → sekitar Feb 2026
            return Carbon::create(2026, 2, rand(5, 20));
        } else {
            // TA 2023 mengajukan di semester 6 = 2025/2026 Genap → sekitar Mar 2026
            return Carbon::create(2026, 3, rand(1, 15));
        }
    }

    private function getStatus(int $mod3): string
    {
        // mod3=1 (excellent): hampir semua disetujui
        // mod3=2 (struggling): 60% ditolak, 40% menunggu
        // mod3=0 (mixed): 70% menunggu, 30% menunggu dengan alasan perlu perbaikan
        if ($mod3 === 1) {
            $r = rand(1, 10);
            return $r <= 9 ? 'Disetujui' : 'Menunggu'; // 90% disetujui
        } elseif ($mod3 === 2) {
            $r = rand(1, 10);
            return $r <= 6 ? 'Ditolak' : 'Menunggu'; // 60% ditolak
        } else {
            return 'Menunggu'; // mixed → masih menunggu review
        }
    }

    private function getAlasanDitolak(Mahasiswa $mhs, int $mod3): string
    {
        $alasanList = [
            'Dokumen KHS semester terakhir belum diunggah sepenuhnya.',
            'Masih memiliki tanggungan organisasi dan belum menyelesaikan administrasi kemahasiswaan.',
            'IPK terakhir belum memenuhi batas minimum 2.75 untuk penyelesaian studi.',
            'Surat keterangan bebas pinjaman perpustakaan belum dilengkapi.',
            'Masih ada kewajiban follow-up dari divisi kemahasiswaan.',
            'Sertifikat pelatihan wajib belum lengkap.',
        ];

        // Specific reasons by archetype
        if ($mod3 === 2) {
            $specific = [
                'Terdapat riwayat Surat Peringatan yang belum dicharKAN closed-loop.',
                'Dokumen pendukung perbaikan IPK belum memenuhi standar audit akademik.',
                'Keterangan dokter untuk cuti akademik semester lalu belum divalidasi.',
            ];
            return $this->randomEl($specific);
        }

        return $this->randomEl($alasanList);
    }

    private function randomEl(array $arr): string
    {
        return $arr[array_rand($arr)];
    }
}
