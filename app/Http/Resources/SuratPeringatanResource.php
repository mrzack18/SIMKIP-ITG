<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SuratPeringatanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nim' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->user->nim ?? $this->mahasiswa->nim),
            'nama' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->user->nama ?? $this->mahasiswa->nama),
            'prodi' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->prodi->nama ?? $this->mahasiswa->prodi_id),
            'angkatan' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->angkatan),
            'level' => $this->level,
            'alasan' => $this->deskripsi,
            'tanggalTerbit' => $this->tanggal_terbit ? $this->tanggal_terbit->format('Y-m-d') : null,
            'batasEvaluasi' => $this->batas_evaluasi ? $this->batas_evaluasi->format('Y-m-d') : '-',
            'status' => $this->status,
            'sisa' => $this->sisa_hari,
        ];
    }
}
