<?php

namespace App\Exports;

use App\Models\Mahasiswa;
use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MahasiswaProfilExport implements WithMultipleSheets, Export
{
    protected Mahasiswa $mahasiswa;

    public function __construct(Mahasiswa $mahasiswa)
    {
        $this->mahasiswa = $mahasiswa;
    }

    public function sheets(): array
    {
        $m = $this->mahasiswa;

        $ipkRows = $m->ipkSemestrs->sortBy('semester')->values()->map(fn($s) => [
            'Semester ' . $s->semester,
            $s->ipk !== null ? number_format((float) $s->ipk, 2) : '-',
            $s->status ?? '-',
        ])->all();

        $prestasiRows = $m->prestasis->values()->map(fn($p) => [
            $p->nama_prestasi,
            $p->tingkat ?? '-',
            $p->pencapaian ?? '-',
            $p->penyelenggara ?? '-',
            $p->tanggal_mulai?->format('d M Y') ?? '-',
            $p->status ?? '-',
        ])->all();

        $organisasiRows = $m->organisasis->values()->map(fn($o) => [
            $o->nama,
            $o->jenis ?? '-',
            $o->jabatan ?? '-',
            ($o->periode_mulai?->format('d M Y') ?? '-') . ' s.d. ' . ($o->periode_selesai?->format('d M Y') ?? '-'),
            $o->status ?? '-',
        ])->all();

        $pelatihanRows = $m->pelatihans->values()->map(fn($p) => [
            $p->nama,
            $p->jenis ?? '-',
            $p->penyelenggara ?? '-',
            $p->tanggal_mulai?->format('d M Y') ?? '-',
            $p->status ?? '-',
        ])->all();

        $dokumenRows = $m->dokumens->values()->map(fn($d) => [
            $d->jenis->nama ?? '-',
            $d->status ?? '-',
        ])->all();

        $spRows = $m->suratPeringatans->values()->map(fn($s) => [
            $s->level,
            $s->jenis_pelanggaran ?? '-',
            $s->tanggal_terbit?->format('d M Y') ?? '-',
            $s->status ?? '-',
        ])->all();

        return [
            new GenericArrayExport(['Label', 'Nilai'], $this->profilRows(), 'Profil'),
            new GenericArrayExport(['Semester', 'IPK', 'Status'], $ipkRows, 'Riwayat IPK'),
            new GenericArrayExport(['Nama Prestasi', 'Tingkat', 'Pencapaian', 'Penyelenggara', 'Tanggal', 'Status'], $prestasiRows, 'Prestasi'),
            new GenericArrayExport(['Nama Organisasi', 'Jenis', 'Jabatan', 'Periode', 'Status'], $organisasiRows, 'Organisasi'),
            new GenericArrayExport(['Nama Pelatihan', 'Jenis', 'Penyelenggara', 'Tanggal', 'Status'], $pelatihanRows, 'Pelatihan'),
            new GenericArrayExport(['Jenis Dokumen', 'Status'], $dokumenRows, 'Dokumen'),
            new GenericArrayExport(['Level', 'Jenis Pelanggaran', 'Tanggal Terbit', 'Status'], $spRows, 'Riwayat SP'),
        ];
    }

    private function profilRows(): array
    {
        $m = $this->mahasiswa;

        $rows = [
            ['NIM', $m->nim],
            ['Nama', $m->nama],
            ['Program Studi', $m->prodi->nama ?? '-'],
            ['Angkatan', (string) $m->angkatan],
            ['Kategori Kepesertaan', $m->kategori ?? '-'],
            ['Status', $m->status ?? '-'],
            ['Semester Berjalan', (string) $m->semester_aktif],
            ['IPK Terakhir', $m->ipk_calc !== null ? number_format((float) $m->ipk_calc, 2) : '-'],
            ['Nomor SK', $m->nomor_sk ?? '-'],
            ['Tanggal SK', $m->tanggal_sk?->format('d M Y') ?? '-'],
        ];

        $optional = [
            'NIK'            => $m->nik,
            'NISN'           => $m->nisn,
            'Tempat Lahir'   => $m->tempat_lahir,
            'Tanggal Lahir'  => $m->tanggal_lahir?->format('d M Y'),
            'Jenis Kelamin'  => $m->jenis_kelamin,
            'No. HP'         => $m->no_hp,
            'Alamat'         => $m->alamat,
            'Nama Ayah'      => $m->nama_ayah,
            'Nama Ibu'       => $m->nama_ibu,
        ];

        foreach ($optional as $label => $value) {
            if (!empty($value)) {
                $rows[] = [$label, $value];
            }
        }

        return $rows;
    }
}
