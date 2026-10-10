<?php

namespace App\Services;

use App\Exports\DataAkademikExport;
use App\Exports\GenericArrayExport;
use App\Exports\LaporanExport;
use App\Exports\MahasiswaExport;
use App\Exports\MahasiswaProfilExport;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExcelExportService
{
    /**
     * Stream a generic Excel file with given headers & rows.
     * Used for read-only exports (e.g. WAREK mahasiswa list).
     */
    public static function stream(string $filename, array $headers, array $rows): BinaryFileResponse
    {
        return Excel::download(
            new GenericArrayExport($headers, $rows),
            $filename,
            \Maatwebsite\Excel\Excel::XLSX
        );
    }

    /**
     * Export a generic list to Excel (.xlsx) or PDF (via dompdf).
     */
    public static function exportList(string $filename, array $headers, array $rows, string $format = 'xlsx'): BinaryFileResponse
    {
        $export = new GenericArrayExport($headers, $rows);

        if (strtolower($format) === 'pdf') {
            return Excel::download(
                $export,
                $filename,
                \Maatwebsite\Excel\Excel::DOMPDF,
                ['Content-Type' => 'application/pdf']
            );
        }

        return Excel::download(
            $export,
            $filename,
            \Maatwebsite\Excel\Excel::XLSX,
            ['Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        );
    }

    /**
     * Export laporan profil lengkap satu mahasiswa (multi-sheet).
     */
    public static function exportProfilMahasiswa(Mahasiswa $mahasiswa): BinaryFileResponse
    {
        $safeNama = preg_replace('/[^A-Za-z0-9]+/', '_', $mahasiswa->nama);
        $filename = "Profil_KIP-K_{$mahasiswa->nim}_{$safeNama}.xlsx";

        return Excel::download(
            new MahasiswaProfilExport($mahasiswa),
            $filename,
            \Maatwebsite\Excel\Excel::XLSX,
            ['Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        );
    }

    /**
     * Export rekap Data Akademik & Non-Akademik.
     * xlsx => multi-sheet; pdf => sheet pertama via dompdf.
     *
     * @param  array  $sheets  tiap item: ['title' => string, 'headers' => array, 'rows' => array]
     */
    public static function exportRekapAkademik(string $filename, array $sheets, string $format = 'xlsx'): BinaryFileResponse
    {
        $format = strtolower($format);

        if ($format === 'pdf') {
            $first = $sheets[0] ?? ['title' => 'Data', 'headers' => [], 'rows' => []];

            return Excel::download(
                new GenericArrayExport($first['headers'], $first['rows'], $first['title']),
                $filename,
                \Maatwebsite\Excel\Excel::DOMPDF,
                ['Content-Type' => 'application/pdf']
            );
        }

        return Excel::download(
            new DataAkademikExport($sheets),
            $filename,
            \Maatwebsite\Excel\Excel::XLSX,
            ['Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        );
    }

    /**
     * Export data mahasiswa untuk halaman Ekspor Laporan (Prodi)
     * Format sesuai form filter di EksporLaporan.tsx
     */
    public static function exportMahasiswaProdi(int $prodiId, array $filters): BinaryFileResponse
    {
        $prodi = Prodi::findOrFail($prodiId);

        $angkatan = $filters['angkatan'] ?? 'Semua';
        $kategori = $filters['kategori'] ?? 'Semua';
        $tahunAk = str_replace('/', '-', $filters['tahun_akademik'] ?? 'TA');
        $semester = $filters['semester'] ?? '';
        $format = strtolower($filters['format'] ?? 'xlsx');

        $filename = "KIP-K_{$prodi->kode}_{$tahunAk}_{$semester}";
        if ($angkatan !== 'Semua') {
            $filename .= "_Angkatan{$angkatan}";
        }
        if ($kategori !== 'Semua') {
            $filename .= "_{$kategori}";
        }

        $exportFormat = \Maatwebsite\Excel\Excel::XLSX;
        $contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        if ($format === 'pdf') {
            $filename .= '.pdf';
            $exportFormat = \Maatwebsite\Excel\Excel::DOMPDF;
            $contentType = 'application/pdf';
        } else {
            $filename .= '.xlsx';
        }

        return Excel::download(
            new MahasiswaExport($prodiId, $prodi->nama, $filters),
            $filename,
            $exportFormat,
            ['Content-Type' => $contentType]
        );
    }

    /**
     * Export laporan umum untuk admin (semua prodi)
     */
    public static function exportLaporanAdmin(array $filters = []): BinaryFileResponse
    {
        $filename = 'Laporan_KIP-K_'.now()->format('d-m-Y').'.xlsx';

        return Excel::download(
            new LaporanExport($filters),
            $filename,
            \Maatwebsite\Excel\Excel::XLSX
        );
    }
}
