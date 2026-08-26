<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'    => (string) $this->id,
            'nama'  => $this->name,
            'nim'   => $this->mahasiswa?->nim,
            'role'  => $this->role,
            'prodi' => $this->prodi?->nama ?? $this->mahasiswa?->prodi?->nama,
            'foto'  => $this->foto_profil ? asset('storage/' . $this->foto_profil) : null,
        ];
    }
}
