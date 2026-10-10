<?php

namespace App\Http\Resources;

use App\Services\IPKCalculatorService;
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
            $mkBelumLulus = $this->mataKuliahs
                ->where('lulus', false)
                ->reject(fn ($mk) => IPKCalculatorService::isNilaiNetral((string) $mk->nilai_huruf))
                ->count();
        }

        return [
            'id' => $this->id,
            'semester' => (int) $this->semester,
            'tahun' => $this->tahun_ajaran,
            'ips' => $this->ips !== null ? (float) $this->ips : null,
            'ipk' => $this->ipk !== null ? (float) $this->ipk : null,
            'status' => $this->status,
            'catatan_admin' => $this->catatan_admin,
            'mkBelumLulus' => $mkBelumLulus,
            'file_khs' => $this->file_khs ? asset('storage/'.$this->file_khs) : null,
            'mataKuliah' => MataKuliahResource::collection($this->whenLoaded('mataKuliahs')),
        ];
    }
}
