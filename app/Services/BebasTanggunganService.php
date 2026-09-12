<?php

namespace App\Services;

use App\Helpers\AturanAkademik;
use App\Models\Mahasiswa;

class BebasTanggunganService
{
    public static function getChecklist(Mahasiswa $mahasiswa): array
    {
        // Null = aturan itu sedang dinonaktifkan di tab Regulasi, dan pemeriksaannya
        // harus dilewati — bukan dibandingkan dengan nilai bawaan.
        $ipkMin = AturanAkademik::angkaJikaAktif('ipk_minimum');
        $sksMin = AturanAkademik::bilanganJikaAktif('sks_minimum_lulus');

        // 1. Dokumen wajib
        $dokumenChecklist = static::cekDokumen($mahasiswa);

        // 2. IPK terakhir
        $ipkTerakhir = $mahasiswa->ipk_terakhir;
        $ipkOk = $ipkMin === null || $ipkTerakhir >= $ipkMin;

        // 3. SP Aktif
        $spAktif = $mahasiswa->suratPeringatans()
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->exists();

        // 4. SKS
        $sksDitempuh = $mahasiswa->ipkSemestrs()
            ->with('mataKuliahs')
            ->get()
            ->flatMap(fn($s) => $s->mataKuliahs)
            ->where('lulus', true)
            ->sum('sks');
        $sksOk = $sksMin === null || $sksDitempuh >= $sksMin;

        // 5. MK belum lulus
        $mkBelumLulus = $mahasiswa->ipkSemestrs()
            ->with('mataKuliahs')
            ->get()
            ->flatMap(fn($s) => $s->mataKuliahs)
            ->where('lulus', false)
            ->count();

        $allDokumenOk = collect($dokumenChecklist)->every(fn($d) => $d['status'] === 'Disetujui');

        return [
            'checklist' => [
                [
                    'syarat' => 'Semua dokumen wajib disetujui',
                    'terpenuhi' => $allDokumenOk,
                    'keterangan' => $allDokumenOk ? null : 'Ada dokumen yang belum disetujui',
                ],
                // Saat aturan mati, angkanya dibuang dari kalimat: menulis
                // "≥ 3.25" padahal ambang itu tidak diberlakukan adalah
                // keterangan yang menyesatkan. Jumlah dan urutan baris TIDAK
                // berubah — ada filter frontend yang bergantung padanya.
                [
                    'syarat' => $ipkMin === null
                        ? 'IPK memenuhi standar'
                        : "IPK memenuhi standar (≥ {$ipkMin})",
                    'terpenuhi' => $ipkOk,
                    'keterangan' => $ipkMin === null
                        ? 'Ambang batas IPK sedang dinonaktifkan'
                        : ($ipkOk ? null : "IPK terakhir: {$ipkTerakhir}"),
                ],
                [
                    'syarat' => 'Tidak ada SP aktif',
                    'terpenuhi' => ! $spAktif,
                    'keterangan' => $spAktif ? 'Masih memiliki SP aktif' : null,
                ],
                // Kata "SKS" wajib tetap ada di `syarat` — admin/BebasTanggunganDetail.tsx
                // memfilter baris ini dengan `!c.syarat.includes("SKS")`.
                [
                    'syarat' => $sksMin === null
                        ? 'SKS mencukupi'
                        : "SKS mencukupi ({$sksMin} SKS)",
                    'terpenuhi' => $sksOk,
                    'keterangan' => $sksMin === null
                        ? 'Ambang batas SKS sedang dinonaktifkan'
                        : ($sksOk ? null : "SKS lulus: {$sksDitempuh}/{$sksMin}"),
                ],
                [
                    'syarat' => 'Tidak ada MK belum lulus',
                    'terpenuhi' => $mkBelumLulus === 0,
                    'keterangan' => $mkBelumLulus > 0 ? "{$mkBelumLulus} MK belum lulus" : null,
                ],
            ],
            'dokumen' => $dokumenChecklist,
            'sks_ditempuh' => $sksDitempuh,
            // Angka mentah, bukan null: field ini bertipe number di frontend dan
            // null di sana muncul sebagai NaN. Status aktifnya dikirim terpisah.
            'sks_minimum' => AturanAkademik::bilangan('sks_minimum_lulus'),
            'sks_minimum_aktif' => $sksMin !== null,
            'ipk_terakhir' => $ipkTerakhir,
            'ipk_minimum' => AturanAkademik::angka('ipk_minimum'),
            'ipk_minimum_aktif' => $ipkMin !== null,
            // Rumus ini tidak berubah: $ipkOk dan $sksOk sudah bernilai true saat
            // aturannya dinonaktifkan, jadi tidak ada yang terblokir karenanya.
            'can_apply' => $allDokumenOk && $ipkOk && !$spAktif && $sksOk && $mkBelumLulus === 0,
        ];
    }

    private static function cekDokumen(Mahasiswa $mahasiswa): array
    {
        $jenisWajib = \App\Models\DokumenJenis::where('is_wajib', true)->orderBy('urutan')->get();
        $result = [];

        foreach ($jenisWajib as $jenis) {
            $dok = $mahasiswa->dokumens()
                ->where('dokumen_jenis_id', $jenis->id)
                ->latest()
                ->first();

            $result[] = [
                'jenis_id' => $jenis->id,
                'nama' => $jenis->nama,
                'status' => $dok?->status,
                'tanggal_upload' => $dok?->created_at?->format('d M Y'),
                'catatan' => $dok?->catatan_admin,
            ];
        }

        return $result;
    }
}
