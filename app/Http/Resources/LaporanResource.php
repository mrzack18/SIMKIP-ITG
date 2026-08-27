<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LaporanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'nomorSurat'     => $this->nomor_surat,
            'judul'          => $this->judul,
            'periode'        => $this->periode,
            'tahunAkademik'  => $this->tahun_akademik,
            'semester'       => $this->semester,
            'tanggalLaporan' => $this->tanggal_laporan?->format('Y-m-d'),
            'catatan'        => $this->catatan_laporan,
            'cakupan'        => $this->cakupan,
            'angkatan'       => $this->angkatan,
            'prodi'          => $this->prodi,
            'tujuanProdi'    => (bool) $this->tujuan_prodi,
            'tujuanWarek'    => (bool) $this->tujuan_warek,
            'status'         => $this->status,
            'dibuatOleh'     => $this->whenLoaded('dibuatOleh', fn() => $this->dibuatOleh->name),
            'catatanWarek'   => $this->whenLoaded('latestReview', fn() => $this->latestReview->catatan),
            'submittedAt'    => $this->submitted_at?->format('Y-m-d H:i:s'),
        ];
    }
}
