<?php

namespace App\Services;

use App\Exports\MahasiswaExport;
use App\Exports\LaporanExport;
use App\Models\Prodi;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExcelExportService
{
    /**
     * Export data mahasiswa untuk halaman Ekspor Laporan (Prodi)
     * Format sesuai form filter di EksporLaporan.tsx
     */
    public static function exportMahasiswaProdi(int $prodiId, array $filters): BinaryFileResponse
    {
        $prodi = Prodi::findOrFail($prodiId);

        $angkatan = $filters['angkatan'] ?? 'Semua';
        $kategori = $filters['kategori'] ?? 'Semua';
        $tahunAk  = str_replace('/', '-', $filters['tahun_akademik'] ?? 'TA');
        $semester = $filters['semester'] ?? '';

        $filename = "KIP-K_{$prodi->kode}_{$tahunAk}_{$semester}";
        if ($angkatan !== 'Semua') $filename .= "_Angkatan{$angkatan}";
        if ($kategori !== 'Semua') $filename .= "_{$kategori}";
        $filename .= '.xlsx';

        return Excel::download(
            new MahasiswaExport($prodiId, $prodi->nama, $filters),
            $filename,
            \Maatwebsite\Excel\Excel::XLSX,
            ['Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        );
    }

    /**
     * Export laporan umum untuk admin (semua prodi)
     */
    public static function exportLaporanAdmin(array $filters = []): BinaryFileResponse
    {
        $filename = 'Laporan_KIP-K_' . now()->format('d-m-Y') . '.xlsx';

        return Excel::download(
            new LaporanExport($filters),
            $filename,
            \Maatwebsite\Excel\Excel::XLSX
        );
    }
}
