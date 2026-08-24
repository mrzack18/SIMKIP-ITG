<?php

namespace App\Exports;

use App\Models\DokumenJenis;
use App\Models\Mahasiswa;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MahasiswaExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    ShouldAutoSize,
    WithTitle
{
    protected array $filters;
    protected array $columns;
    protected int $prodiId;
    protected string $prodiNama;

    public function __construct(int $prodiId, string $prodiNama, array $filters)
    {
        $this->prodiId   = $prodiId;
        $this->prodiNama = $prodiNama;
        $this->filters   = $filters;

        // Kolom yang selalu ada
        $this->columns = ['NIM', 'Nama Mahasiswa', 'Angkatan', 'Kategori', 'Status', 'Semester', 'IPK Terakhir'];

        // Kolom opsional berdasarkan parameter
        if ($filters['sertakan_ipk'] ?? false) {
            foreach (range(1, 8) as $sem) {
                $this->columns[] = "IPK Sem {$sem}";
            }
        }
        if ($filters['sertakan_dokumen'] ?? false) {
            $jenisList = DokumenJenis::where('is_wajib', true)->orderBy('urutan')->pluck('nama');
            foreach ($jenisList as $nama) {
                $this->columns[] = "Dok: {$nama}";
            }
            $this->columns[] = 'Dokumen (Total)';
        }
        if ($filters['sertakan_sp'] ?? false) {
            $this->columns[] = 'SP Aktif';
            $this->columns[] = 'Riwayat SP';
        }
    }

    public function collection()
    {
        $query = Mahasiswa::with([
            'prodi',
            'ipkSemestrs',
            'dokumens.jenis',
            'suratPeringatans',
        ])->where('prodi_id', $this->prodiId);

        if (! empty($this->filters['angkatan']) && $this->filters['angkatan'] !== 'Semua') {
            $query->where('angkatan', $this->filters['angkatan']);
        }
        if (! empty($this->filters['kategori']) && $this->filters['kategori'] !== 'Semua') {
            $query->where('kategori', $this->filters['kategori']);
        }

        return $query->orderBy('angkatan')->orderBy('nim')->get();
    }

    public function headings(): array
    {
        return $this->columns;
    }

    public function map($mahasiswa): array
    {
        $ipkSemesters = $mahasiswa->ipkSemestrs->sortBy('semester')->values();
        $ipkTerakhir  = (float) ($ipkSemesters->last()?->ipk ?? 0);
        $semesterAktif = $ipkSemesters->count();

        $spAktif = $mahasiswa->suratPeringatans
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->sortByDesc('level')
            ->first();

        $row = [
            $mahasiswa->nim,
            $mahasiswa->nama,
            $mahasiswa->angkatan,
            $mahasiswa->kategori,
            $mahasiswa->status,
            $semesterAktif,
            number_format($ipkTerakhir, 2),
        ];

        // IPK per semester (s1-s8)
        if ($this->filters['sertakan_ipk'] ?? false) {
            for ($sem = 1; $sem <= 8; $sem++) {
                $entry = $ipkSemesters->firstWhere('semester', $sem);
                $row[] = $entry ? number_format((float) $entry->ipk, 2) : '-';
            }
        }

        // Status dokumen per jenis
        if ($this->filters['sertakan_dokumen'] ?? false) {
            $jenisList = DokumenJenis::where('is_wajib', true)->orderBy('urutan')->get();
            $disetujui = 0;
            foreach ($jenisList as $jenis) {
                $dok = $mahasiswa->dokumens
                    ->where('dokumen_jenis_id', $jenis->id)
                    ->where('status', 'Disetujui')
                    ->first();
                $row[] = $dok ? 'Disetujui' : '-';
                if ($dok) $disetujui++;
            }
            $row[] = "{$disetujui}/{$jenisList->count()}";
        }

        // SP
        if ($this->filters['sertakan_sp'] ?? false) {
            $row[] = $spAktif ? $spAktif->level : '-';
            $spHistory = $mahasiswa->suratPeringatans->pluck('level')->implode(', ');
            $row[] = $spHistory ?: '-';
        }

        return $row;
    }

    public function styles(Worksheet $sheet): array
    {
        $lastCol = $this->indexToCol(count($this->columns));
        $lastRow = $sheet->getHighestRow();

        // Header row style
        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '263F93']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '1a2d6a']]],
        ]);

        // Data rows alternating
        for ($row = 2; $row <= $lastRow; $row++) {
            $fill = ($row % 2 === 0) ? 'F0F4FF' : 'FFFFFF';
            $sheet->getStyle("A{$row}:{$lastCol}{$row}")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $fill]],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_HAIR, 'color' => ['rgb' => 'D1D5DB']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);
        }

        // Freeze header
        $sheet->freezePane('A2');

        return [];
    }

    public function title(): string
    {
        return 'Data Mahasiswa KIP-K';
    }

    /** Convert numeric column index (1-based) to Excel letter (A, B, … Z, AA …) */
    private function indexToCol(int $index): string
    {
        $col = '';
        while ($index > 0) {
            $index--;
            $col = chr(65 + ($index % 26)) . $col;
            $index = intdiv($index, 26);
        }
        return $col;
    }
}
