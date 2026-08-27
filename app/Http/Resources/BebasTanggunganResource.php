<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BebasTanggunganResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $statusMap = [
            'Menunggu' => 'menunggu',
            'Diproses' => 'menunggu',
            'Disetujui' => 'diterbitkan',
            'Ditolak'  => 'ditolak',
        ];
        
        return [
            'id'            => $this->id,
            'status'        => $statusMap[$this->status] ?? 'menunggu',
            'tanggalAjukan' => $this->tanggal_ajukan?->format('d M Y'),
            'catatanAdmin'  => $this->catatan_admin,
            'nomorSurat'    => $this->nomor_surat,
            'tanggalTerbit' => $this->tanggal_terbit?->format('d M Y'),
            'mahasiswa'     => $this->whenLoaded('mahasiswa', fn() => new MahasiswaResource($this->mahasiswa)),
        ];
    }
}
