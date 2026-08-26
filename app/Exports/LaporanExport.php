<?php

namespace App\Exports;

use App\Models\Mahasiswa;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection(): \Illuminate\Support\Collection
    {
        return Mahasiswa::with(['prodi', 'ipkSemestrs', 'suratPeringatans', 'dokumens'])
            ->when(! empty($this->filters['prodi_id']), fn($q) => $q->where('prodi_id', $this->filters['prodi_id']))
            ->orderBy('angkatan')->orderBy('nim')
            ->get();
    }

    public function headings(): array
    {
        return ['NIM', 'Nama', 'Program Studi', 'Angkatan', 'Kategori', 'Status', 'Semester', 'IPK Terakhir', 'SP Aktif', 'Dokumen Disetujui'];
    }

    public function map($m): array
    {
        $ipkSemesters = $m->ipkSemestrs->sortBy('semester')->values();
        $ipkTerakhir  = (float) ($ipkSemesters->last()?->ipk ?? 0);
        $spAktif      = $m->suratPeringatans->whereIn('status', ['Aktif', 'Masa Tenggang'])->sortByDesc('level')->first();
        $dokSetujui   = $m->dokumens->where('status', 'Disetujui')->unique('dokumen_jenis_id')->count();

        return [
            $m->nim,
            $m->nama,
            $m->prodi?->nama ?? '-',
            $m->angkatan,
            $m->kategori,
            $m->status,
            $ipkSemesters->count(),
            number_format($ipkTerakhir, 2),
            $spAktif?->level ?? '-',
            $dokSetujui,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        $lastCol = 'J';
        $lastRow = $sheet->getHighestRow();

        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '263F93']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '1a2d6a']]],
        ]);

        for ($row = 2; $row <= $lastRow; $row++) {
            $fill = ($row % 2 === 0) ? 'F0F4FF' : 'FFFFFF';
            $sheet->getStyle("A{$row}:{$lastCol}{$row}")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $fill]],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_HAIR, 'color' => ['rgb' => 'D1D5DB']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);
        }

        $sheet->freezePane('A2');
        return [];
    }

    public function title(): string
    {
        return 'Laporan KIP-K';
    }
}
