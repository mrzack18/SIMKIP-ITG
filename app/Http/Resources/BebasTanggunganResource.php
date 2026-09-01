<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BebasTanggunganResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $statusMap = [
            'Menunggu'  => 'menunggu',
            'Diproses'  => 'menunggu',
            'Disetujui' => 'diterbitkan',
            'Ditolak'   => 'ditolak',
        ];

        // Summary fields for the list view — computed from eager-loaded relations
        $m          = $this->mahasiswa;
        $semester   = $m ? $m->ipkSemestrs->count() : 0;
        $spBersih   = $m ? $m->suratPeringatans->isEmpty() : true;

        // Dokumen progress: approved mandatory docs out of total mandatory document types configured
        $docsTotal = \App\Models\DokumenJenis::where('is_wajib', true)->count();
        $docsOk    = 0;
        if ($m && $m->relationLoaded('dokumens')) {
            // Of the mandatory jenis, which ones have an approved document?
            $wajibIds = \App\Models\DokumenJenis::where('is_wajib', true)->pluck('id')->toArray();
            $byJenis  = $m->dokumens->groupBy('dokumen_jenis_id');
            $docsOk = $byJenis->filter(function ($group) use ($wajibIds) {
                $latest = $group->sortByDesc('created_at')->first();
                return $latest && $latest->status === 'Disetujui' && in_array($latest->dokumen_jenis_id, $wajibIds);
            })->count();
        }

        return [
            'id'           => $this->id,
            'status'       => $statusMap[$this->status] ?? 'menunggu',
            'tanggalAjukan'=> $this->tanggal_ajukan?->format('d M Y'),
            'catatanAdmin' => $this->catatan_admin,
            'nomorSurat'   => $this->nomor_surat,
            'tanggalTerbit'=> $this->tanggal_terbit?->format('d M Y'),
            // Summary fields
            'semester'     => $semester,
            'spBersih'     => $spBersih,
            'docsOk'       => $docsOk,
            'docsTotal'    => $docsTotal,
            'rejectionHistory' => $this->whenLoaded('histories', fn() => $this->histories->map(fn($h) => [
                'tgl'    => $h->created_at->format('d M Y'),
                'catatan'=> $h->catatan,
                'oleh'   => $h->reviewedBy?->name ?? 'Sistem',
            ])),
            // Nested mahasiswa
            'mahasiswa'    => $this->whenLoaded('mahasiswa', fn() => new MahasiswaResource($this->mahasiswa)),
        ];
    }
}
