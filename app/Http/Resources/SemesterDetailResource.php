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
            'id'            => $this->id,
            'semester'      => (int) $this->semester,
            'tahun'         => $this->tahun_ajaran,
            'ips'           => (float) $this->ips,
            'ipk'           => (float) $this->ipk,
            'status'        => $this->status,
            'catatan_admin' => $this->catatan_admin,
            'mkBelumLulus'  => $mkBelumLulus,
            'file_khs'      => $this->file_khs ? asset('storage/' . $this->file_khs) : null,
            'mataKuliah'    => MataKuliahResource::collection($this->whenLoaded('mataKuliahs')),
        ];
    }
}
