<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PelatihanResource extends JsonResource
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
            'nama' => $this->nama,
            'jenis' => $this->jenis,
            'penyelenggara' => $this->penyelenggara,
            'tanggalMulai' => $this->tanggal_mulai ? $this->tanggal_mulai->format('Y-m-d') : null,
            'tanggalSelesai' => $this->tanggal_selesai ? $this->tanggal_selesai->format('Y-m-d') : null,
            'tempat' => $this->tempat,
            'deskripsi' => $this->deskripsi,
            'sertifikat' => $this->file_sertifikat ? url(Storage::url($this->file_sertifikat)) : null,
            'fotoKegiatan' => $this->foto_kegiatan ? url(Storage::url($this->foto_kegiatan)) : null,
            'status' => $this->status,
            'catatanAdmin' => $this->catatan_admin,
        ];
    }
}
