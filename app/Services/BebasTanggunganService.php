<?php

namespace App\Services;

use App\Models\Konfigurasi;
use App\Models\Mahasiswa;

class BebasTanggunganService
{
    public static function getChecklist(Mahasiswa $mahasiswa): array
    {
        $ipkMin = (float) Konfigurasi::get('ipk_minimum', 3.0);
        $sksMin = (int) Konfigurasi::get('sks_minimum_lulus', 144);

        // 1. Dokumen wajib
        $dokumenChecklist = static::cekDokumen($mahasiswa);

        // 2. IPK terakhir
        $ipkTerakhir = $mahasiswa->ipk_terakhir;
        $ipkOk = $ipkTerakhir >= $ipkMin;

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
        $sksOk = $sksDitempuh >= $sksMin;

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
                [
                    'syarat' => "IPK memenuhi standar (≥ {$ipkMin})",
                    'terpenuhi' => $ipkOk,
                    'keterangan' => $ipkOk ? null : "IPK terakhir: {$ipkTerakhir}",
                ],
                [
                    'syarat' => 'Tidak ada SP aktif',
                    'terpenuhi' => ! $spAktif,
                    'keterangan' => $spAktif ? 'Masih memiliki SP aktif' : null,
                ],
                [
                    'syarat' => "SKS mencukupi ({$sksMin} SKS)",
                    'terpenuhi' => $sksOk,
                    'keterangan' => $sksOk ? null : "SKS lulus: {$sksDitempuh}/{$sksMin}",
                ],
                [
                    'syarat' => 'Tidak ada MK belum lulus',
                    'terpenuhi' => $mkBelumLulus === 0,
                    'keterangan' => $mkBelumLulus > 0 ? "{$mkBelumLulus} MK belum lulus" : null,
                ],
            ],
            'dokumen' => $dokumenChecklist,
            'sks_ditempuh' => $sksDitempuh,
            'sks_minimum' => $sksMin,
            'ipk_terakhir' => $ipkTerakhir,
            'ipk_minimum' => $ipkMin,
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
