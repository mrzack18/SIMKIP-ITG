<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MahasiswaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $spList = [];
        if ($this->relationLoaded('suratPeringatans')) {
            $range = \App\Helpers\TahunAjaranHelper::getDateRange($request->tahun_ajaran);
            foreach ($this->suratPeringatans as $surat) {
                if ($range && $surat->tanggal_terbit <= $range[1]) {
                    $spList[] = [
                        'level' => $surat->level,
                        'status' => $surat->status
                    ];
                } elseif (!$range) {
                    $spList[] = [
                        'level' => $surat->level,
                        'status' => $surat->status
                    ];
                }
            }
        }

        return [
            'id' => $this->id,
            'nim' => $this->nim,
            'nama' => $this->nama,
            'prodi' => $this->prodi_nama ?? ($this->relationLoaded('prodi') ? $this->prodi->nama : ''),
            'angkatan' => (int) $this->angkatan,
            'kategori' => $this->kategori,
            'status' => $this->getHistoricalStatus($request->tahun_ajaran),
            
            // Calculated fields (aliased from query)
            'ipk' => $this->ipk_calc !== null ? (float)$this->ipk_calc : null,
            'trendDelta' => ($this->ipk_calc !== null && $this->prev_ipk_calc !== null) ? (float)($this->ipk_calc - $this->prev_ipk_calc) : 0,
            'semester' => \App\Helpers\TahunAjaranHelper::calculateSemester((int) $this->angkatan, $request->tahun_ajaran),
            'sp' => $this->sp_calc ?? null,
            'spList' => count($spList) > 0 ? $spList : null,
            'mk_belum_lulus' => (int)($this->mk_belum_lulus ?? 0),

            // Additional DB Fields
            'nik' => $this->nik,
            'nisn' => $this->nisn,
            'tempatLahir' => $this->tempat_lahir,
            'tanggalLahir' => $this->tanggal_lahir ? $this->tanggal_lahir->format('d M Y') : null,
            'jenisKelamin' => $this->jenis_kelamin,
            'alamat' => $this->alamat,
            'namaAyah' => $this->nama_ayah,
            'namaIbu' => $this->nama_ibu,
            'telAyah' => $this->tel_ayah,
            'telIbu' => $this->tel_ibu,

            // Personal Information (from user)
            'email' => $this->whenLoaded('user', fn() => $this->user->email),
            'noHp' => $this->whenLoaded('user', fn() => $this->user->no_hp),
            'fotoProfil' => $this->whenLoaded('user', fn() => $this->user->foto_profil ? asset('storage/' . $this->user->foto_profil) : null),
            'contactHistories' => $this->whenLoaded('user', function () {
                return $this->user->relationLoaded('contactHistories') ? $this->user->contactHistories->map(function($ch) {
                    return [
                        'nomor' => $ch->no_hp,
                        'sem' => $ch->keterangan ?? $ch->created_at->format('d M Y'),
                        'aktif' => false
                    ];
                }) : [];
            }),

            // Status fields mapping
            'semesterDicabut' => $this->status === 'Dicabut' ? $this->semester_dicabut : null,
            'tanggalDicabut' => $this->status === 'Dicabut' && $this->tanggal_dicabut ? $this->tanggal_dicabut->format('d M Y') : null,
            'alasanDicabut' => $this->status === 'Dicabut' ? $this->alasan_dicabut : null,
            'dicabutOleh' => $this->status === 'Dicabut' ? $this->dicabut_oleh : null,
            
            'alasanNonaktif' => $this->status === 'Nonaktif' ? $this->alasan_nonaktif : null,
            'tanggalNonaktif' => $this->status === 'Nonaktif' && $this->tanggal_nonaktif ? $this->tanggal_nonaktif->format('d M Y') : null,
        ];
    }

    private function getHistoricalStatus($tahunAjaran)
    {
        if (!$tahunAjaran || $tahunAjaran === 'Semua' || $this->status === 'Aktif') {
            return $this->status;
        }

        // If historically filtered, and they were revoked/nonaktif, 
        // we check if their revocation date was AFTER the requested academic year.
        // If they were revoked AFTER this year ended, they were 'Aktif' during this year!
        $range = \App\Helpers\TahunAjaranHelper::getDateRange($tahunAjaran);
        if ($range) {
            $endOfYear = $range[1];
            if ($this->tanggal_nonaktif && $this->tanggal_nonaktif > $endOfYear) {
                return 'Aktif';
            }
            if ($this->tanggal_dicabut && $this->tanggal_dicabut > $endOfYear) {
                return 'Aktif';
            }
        }
        
        return $this->status;
    }
}
