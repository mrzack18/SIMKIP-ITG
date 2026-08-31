<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SuratPeringatanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nim' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->user->nim ?? $this->mahasiswa->nim),
            'nama' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->user->nama ?? $this->mahasiswa->nama),
            'prodi' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->prodi->nama ?? $this->mahasiswa->prodi_id),
            'angkatan' => $this->whenLoaded('mahasiswa', fn() => $this->mahasiswa->angkatan),
            'level' => $this->level,
            'alasan' => $this->deskripsi,
            'tanggalTerbit' => $this->tanggal_terbit ? $this->tanggal_terbit->format('Y-m-d') : null,
            'batasEvaluasi' => $this->batas_evaluasi ? $this->batas_evaluasi->format('Y-m-d') : null,
            'status' => $this->getHistoricalStatus($request->tahun_ajaran),
            'sisa' => $this->getHistoricalSisaHari($request->tahun_ajaran),
            // Additional mapping for Mahasiswa Frontend
            'nomorSurat' => $this->nomor_surat,
            'tanggal' => $this->tanggal_terbit ? $this->tanggal_terbit->translatedFormat('d F Y') : null,
            'sisaHari' => $this->getHistoricalSisaHari($request->tahun_ajaran),
            'tahunAjaran' => $this->getTahunAjaranFromDate($this->tanggal_terbit),
        ];
    }

    private function getTahunAjaranFromDate($date) {
        if (!$date) return null;
        $month = (int) $date->format('m');
        $year = (int) $date->format('Y');
        
        if ($month >= 2 && $month <= 8) {
            return ($year - 1) . '/' . $year . ' Genap';
        } elseif ($month == 1) {
            return ($year - 1) . '/' . $year . ' Ganjil';
        } else {
            return $year . '/' . ($year + 1) . ' Ganjil';
        }
    }

    private function getHistoricalStatus($tahunAjaranFilter) {
        if (!$tahunAjaranFilter || $tahunAjaranFilter === 'Semua') {
            return $this->status;
        }

        $range = \App\Helpers\TahunAjaranHelper::getDateRange($tahunAjaranFilter);
        if (!$range) return $this->status;

        $startOfAcademicYear = $range[0];

        if (in_array($this->status, ['Aktif', 'Masa Tenggang'])) {
            return $this->status;
        }

        // If it's Selesai, check if it was still active during this historical semester
        if ($this->status === 'Selesai' && $this->updated_at && $startOfAcademicYear <= $this->updated_at) {
            return 'Aktif';
        }

        return $this->status;
    }

    private function getHistoricalSisaHari($tahunAjaranFilter) {
        if (!$tahunAjaranFilter || $tahunAjaranFilter === 'Semua') {
            return $this->sisa_hari;
        }

        $range = \App\Helpers\TahunAjaranHelper::getDateRange($tahunAjaranFilter);
        if (!$range) return $this->sisa_hari;

        $endOfAcademicYear = $range[1];

        if (!$this->batas_evaluasi) return 0;

        // If the academic year has fully passed the batas evaluasi, remaining days is 0.
        if ($endOfAcademicYear > $this->batas_evaluasi) return 0;

        // Calculate days remaining from the perspective of the end of that academic year
        $diff = $endOfAcademicYear->diffInDays($this->batas_evaluasi, false);
        return (int) max(0, $diff);
    }
}
