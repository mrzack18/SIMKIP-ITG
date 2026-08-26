<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SemesterDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'semester' => (int) $this->semester,
            'tahun' => $this->tahun_ajaran,
            'ipk' => (float) $this->ipk,
            'mataKuliah' => MataKuliahResource::collection($this->whenLoaded('mataKuliahs')),
        ];
    }
}
