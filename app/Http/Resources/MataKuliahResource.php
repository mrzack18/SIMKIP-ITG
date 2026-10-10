<?php

namespace App\Http\Resources;

use App\Services\IPKCalculatorService;
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
            'alasanPerubahan' => $this->alasan_perubahan,
            // Label status mengikuti aturan tunggal di IPKCalculatorService:
            // "Belum Lulus" hanya untuk D/E, sedangkan "-" dan "T" punya makna
            // sendiri. Dikirim dari server supaya aturannya tidak diduplikasi.
            'status' => IPKCalculatorService::statusMk((string) $this->nilai_huruf),
            'statusKode' => IPKCalculatorService::statusMkKode((string) $this->nilai_huruf),
            'netral' => IPKCalculatorService::isNilaiNetral((string) $this->nilai_huruf),
        ];
    }
}
