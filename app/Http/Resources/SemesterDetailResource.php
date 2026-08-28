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
        $mkBelumLulus = 0;
        if ($this->relationLoaded('mataKuliahs')) {
            $mkBelumLulus = $this->mataKuliahs->where('lulus', false)->count();
        }

        return [
            'semester' => (int) $this->semester,
            'tahun' => $this->tahun_ajaran,
            'ips' => (float) $this->ips,
            'ipk' => (float) $this->ipk,
            'mkBelumLulus' => $mkBelumLulus,
            'mataKuliah' => MataKuliahResource::collection($this->whenLoaded('mataKuliahs')),
        ];
    }
}
