<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DokumenJenisResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $dokumen = $this->whenLoaded('dokumens') ? $this->dokumens->first() : null;

        return [
            'id' => $dokumen ? (string)$dokumen->id : 'jenis_' . $this->id,
            'dokumenJenisId' => $this->id,
            'kode' => $this->kode,
            'nama' => $this->nama,
            'desc' => $this->deskripsi,
            'status' => $dokumen ? ($dokumen->status === 'Menunggu' ? 'Menunggu Validasi' : $dokumen->status) : 'Belum Diunggah',
            'tanggal' => $dokumen ? $dokumen->created_at->format('d M Y') : null,
            'catatan' => $dokumen ? $dokumen->catatan_admin : null,
            'fileName' => $dokumen ? $dokumen->nama_file : null,
            'fileUrl' => $dokumen ? Storage::url($dokumen->path_file) : null,
            'metadata' => $dokumen ? $dokumen->metadata : null,
            'isWajib' => (bool) $this->is_wajib,
            'fields' => $this->fields ?? [],
        ];
    }
}
