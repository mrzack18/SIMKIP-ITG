<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DokumenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'dokumenJenisId' => $this->dokumen_jenis_id,
            'nama' => $this->whenLoaded('jenis', fn() => $this->jenis->nama),
            'status' => $this->status,
            'tanggal' => $this->created_at->format('d M Y'),
            'catatan' => $this->catatan_admin,
            'fileUrl' => Storage::url($this->path_file),
            'metadata' => $this->metadata,
        ];
    }
}
