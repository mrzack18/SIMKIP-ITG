<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DokumenQueueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // This resource expects an object with standard properties aliased in the SQL query, or mapped before passing.
        // We will assume the controller maps the properties to standard names before passing to the resource.
        return [
            'id' => $this['id'],
            'mahasiswas_id' => $this['mahasiswas_id'] ?? null,
            'nim' => $this['nim'],
            'nama' => $this['nama'],
            'prodi' => $this['prodi'],
            'jenis' => $this['jenis'],
            'tanggalUpload' => $this['tanggalUpload'],
            'status' => $this['status'],
        ];
    }
}
