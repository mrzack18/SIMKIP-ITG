<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MataKuliahResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'kode' => $this->kode,
            'nama' => $this->nama,
            'sks' => (int) $this->sks,
            'nilaiHuruf' => $this->nilai_huruf,
            'nilaiMutu' => (float) $this->nilai_mutu,
            'lulus' => (bool) $this->lulus,
        ];
    }
}
