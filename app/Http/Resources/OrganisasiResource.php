<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class OrganisasiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nim' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->nim),
            'mahasiswaNama' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->nama),
            'prodi' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->prodi->nama ?? ''),
            'angkatan' => $this->whenLoaded('mahasiswa', fn() => (int) $this->mahasiswa->angkatan),
            'kipk' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->kategori),
            'jenis' => $this->jenis,
            'nama' => $this->nama,
            'jabatan' => $this->jabatan,
            'mulai' => $this->periode_mulai ? $this->periode_mulai->format('Y-m') : null,
            'selesai' => $this->periode_selesai ? $this->periode_selesai->format('Y-m') : null,
            'deskripsi' => $this->deskripsi,
            'fileSk' => $this->file_sk ? url(Storage::url($this->file_sk)) : null,
            'fotoKegiatan' => $this->foto_kegiatan ? url(Storage::url($this->foto_kegiatan)) : null,
            'status' => $this->status,
            'catatanAdmin' => $this->catatan_admin,
        ];
    }
}
