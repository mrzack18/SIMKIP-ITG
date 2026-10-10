<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10pt;
            color: #1a1a1a;
            line-height: 1.4;
            padding: 24pt;
        }

        .header {
            display: table;
            width: 100%;
            border-bottom: 2pt solid #263F93;
            padding-bottom: 10pt;
            margin-bottom: 14pt;
        }
        .header-logo { display: table-cell; width: 60pt; vertical-align: middle; }
        .header-logo img { width: 52pt; height: 52pt; }
        .header-text { display: table-cell; text-align: center; vertical-align: middle; }
        .header-text .instansi { font-size: 9pt; font-weight: bold; text-transform: uppercase; }
        .header-text .kampus { font-size: 15pt; font-weight: bold; color: #263F93; margin: 2pt 0; }
        .header-text .alamat { font-size: 8pt; color: #555; }

        .judul { text-align: center; margin-bottom: 12pt; }
        .judul h1 {
            font-size: 13pt;
            text-transform: uppercase;
            text-decoration: underline;
            color: #263F93;
        }

        .section { margin-bottom: 12pt; }
        .section h2 {
            font-size: 10.5pt;
            color: #263F93;
            border-bottom: 1pt solid #cbd5e1;
            padding-bottom: 3pt;
            margin-bottom: 6pt;
            text-transform: uppercase;
        }

        table.info { width: 100%; border-collapse: collapse; }
        table.info td { padding: 2.5pt 6pt; font-size: 9.5pt; vertical-align: top; }
        table.info td.label { width: 120pt; color: #475569; font-weight: bold; }
        table.info td.sep { width: 8pt; }

        table.data { width: 100%; border-collapse: collapse; }
        table.data th {
            background: #263F93;
            color: #ffffff;
            font-size: 8.5pt;
            text-align: left;
            padding: 5pt 4pt;
            border: 0.5pt solid #1B2F73;
        }
        table.data td {
            font-size: 8.5pt;
            padding: 4pt;
            border: 0.5pt solid #cbd5e1;
            vertical-align: top;
        }
        table.data tr:nth-child(even) td { background: #f8fafc; }
        table.data td.center { text-align: center; }

        .empty { font-size: 8.5pt; color: #64748b; font-style: italic; padding: 3pt 0; }

        .footer {
            margin-top: 14pt;
            font-size: 8pt;
            color: #64748b;
            text-align: right;
            border-top: 1pt solid #e2e8f0;
            padding-top: 6pt;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="header-logo">
            <img src="{{ $logoPath }}" alt="ITG">
        </div>
        <div class="header-text">
            <div class="instansi">Institut Teknologi Garut</div>
            <div class="kampus">Sistem Informasi Manajemen KIP-K</div>
            <div class="alamat">Jl. Mayor Syamsu No. 1, Jayaraga, Garut — Jawa Barat</div>
        </div>
    </div>

    <div class="judul">
        <h1>Laporan Profil Mahasiswa Penerima KIP-K</h1>
    </div>

    {{-- A. Identitas --}}
    <div class="section">
        <h2>A. Identitas Mahasiswa</h2>
        <table class="info">
            <tr>
                <td class="label">NIM</td><td class="sep">:</td><td>{{ $mahasiswa->nim }}</td>
                <td class="label">Program Studi</td><td class="sep">:</td><td>{{ $mahasiswa->prodi->nama ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Nama</td><td class="sep">:</td><td>{{ $mahasiswa->nama }}</td>
                <td class="label">Angkatan</td><td class="sep">:</td><td>{{ $mahasiswa->angkatan }}</td>
            </tr>
            <tr>
                <td class="label">Kategori Kepesertaan</td><td class="sep">:</td><td>{{ $mahasiswa->kategori ?? '-' }}</td>
                <td class="label">Status</td><td class="sep">:</td><td>{{ $mahasiswa->status ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Semester Berjalan</td><td class="sep">:</td><td>{{ $mahasiswa->semester_aktif }}</td>
                <td class="label">IPK Terakhir</td><td class="sep">:</td>
                <td>{{ $mahasiswa->ipk_calc !== null ? number_format((float) $mahasiswa->ipk_calc, 2) : '-' }}</td>
            </tr>
            @if($mahasiswa->nik)
            <tr><td class="label">NIK</td><td class="sep">:</td><td colspan="4">{{ $mahasiswa->nik }}</td></tr>
            @endif
            @if($mahasiswa->nisn)
            <tr><td class="label">NISN</td><td class="sep">:</td><td colspan="4">{{ $mahasiswa->nisn }}</td></tr>
            @endif
            @if($mahasiswa->tempat_lahir || $mahasiswa->tanggal_lahir)
            <tr>
                <td class="label">Tempat/Tgl Lahir</td><td class="sep">:</td><td colspan="4">
                    {{ $mahasiswa->tempat_lahir ?? '-' }}, {{ $mahasiswa->tanggal_lahir?->format('d M Y') ?? '-' }}
                </td>
            </tr>
            @endif
            @if($mahasiswa->jenis_kelamin)
            <tr><td class="label">Jenis Kelamin</td><td class="sep">:</td><td colspan="4">{{ $mahasiswa->jenis_kelamin }}</td></tr>
            @endif
            @if($mahasiswa->no_hp)
            <tr><td class="label">No. HP</td><td class="sep">:</td><td colspan="4">{{ $mahasiswa->no_hp }}</td></tr>
            @endif
            @if($mahasiswa->alamat)
            <tr><td class="label">Alamat</td><td class="sep">:</td><td colspan="4">{{ $mahasiswa->alamat }}</td></tr>
            @endif
            @if($mahasiswa->nama_ayah || $mahasiswa->nama_ibu)
            <tr>
                <td class="label">Nama Orang Tua</td><td class="sep">:</td><td colspan="4">
                    {{ $mahasiswa->nama_ayah ?? '-' }} (Ayah) / {{ $mahasiswa->nama_ibu ?? '-' }} (Ibu)
                </td>
            </tr>
            @endif
        </table>
    </div>

    {{-- B. SK --}}
    <div class="section">
        <h2>B. Data SK Penetapan KIP-K</h2>
        <table class="info">
            <tr>
                <td class="label">Nomor SK</td><td class="sep">:</td><td>{{ $mahasiswa->nomor_sk ?? '-' }}</td>
                <td class="label">Tanggal SK</td><td class="sep">:</td>
                <td>{{ $mahasiswa->tanggal_sk?->format('d M Y') ?? '-' }}</td>
            </tr>
        </table>
    </div>

    {{-- C. Riwayat IPK --}}
    <div class="section">
        <h2>C. Riwayat IPK per Semester</h2>
        @if($ipkList->count() === 0)
            <div class="empty">Belum ada data IPK.</div>
        @else
            <table class="data">
                <thead>
                    <tr>
                        <th style="width: 30pt; text-align: center;">No</th>
                        <th>Semester</th>
                        <th>IPK</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($ipkList as $i => $s)
                        <tr>
                            <td class="center">{{ $i + 1 }}</td>
                            <td>Semester {{ $s->semester }}</td>
                            <td>{{ $s->ipk !== null ? number_format((float) $s->ipk, 2) : '-' }}</td>
                            <td>{{ $s->status ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    {{-- D. Prestasi --}}
    <div class="section">
        <h2>D. Prestasi</h2>
        @if($prestasis->count() === 0)
            <div class="empty">Belum ada data prestasi.</div>
        @else
            <table class="data">
                <thead>
                    <tr>
                        <th style="width: 30pt; text-align: center;">No</th>
                        <th>Nama Prestasi</th>
                        <th>Tingkat</th>
                        <th>Pencapaian</th>
                        <th>Penyelenggara</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($prestasis as $i => $p)
                        <tr>
                            <td class="center">{{ $i + 1 }}</td>
                            <td>{{ $p->nama_prestasi }}</td>
                            <td>{{ $p->tingkat ?? '-' }}</td>
                            <td>{{ $p->pencapaian ?? '-' }}</td>
                            <td>{{ $p->penyelenggara ?? '-' }}</td>
                            <td>{{ $p->tanggal_mulai?->format('d M Y') ?? '-' }}</td>
                            <td>{{ $p->status ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    {{-- E. Organisasi --}}
    <div class="section">
        <h2>E. Organisasi</h2>
        @if($organisasis->count() === 0)
            <div class="empty">Belum ada data organisasi.</div>
        @else
            <table class="data">
                <thead>
                    <tr>
                        <th style="width: 30pt; text-align: center;">No</th>
                        <th>Nama Organisasi</th>
                        <th>Jenis</th>
                        <th>Jabatan</th>
                        <th>Periode</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($organisasis as $i => $o)
                        <tr>
                            <td class="center">{{ $i + 1 }}</td>
                            <td>{{ $o->nama }}</td>
                            <td>{{ $o->jenis ?? '-' }}</td>
                            <td>{{ $o->jabatan ?? '-' }}</td>
                            <td>{{ $o->periode_mulai?->format('d M Y') ?? '-' }} s.d. {{ $o->periode_selesai?->format('d M Y') ?? '-' }}</td>
                            <td>{{ $o->status ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    {{-- F. Pelatihan --}}
    <div class="section">
        <h2>F. Pelatihan</h2>
        @if($pelatihans->count() === 0)
            <div class="empty">Belum ada data pelatihan.</div>
        @else
            <table class="data">
                <thead>
                    <tr>
                        <th style="width: 30pt; text-align: center;">No</th>
                        <th>Nama Pelatihan</th>
                        <th>Jenis</th>
                        <th>Penyelenggara</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($pelatihans as $i => $p)
                        <tr>
                            <td class="center">{{ $i + 1 }}</td>
                            <td>{{ $p->nama }}</td>
                            <td>{{ $p->jenis ?? '-' }}</td>
                            <td>{{ $p->penyelenggara ?? '-' }}</td>
                            <td>{{ $p->tanggal_mulai?->format('d M Y') ?? '-' }}</td>
                            <td>{{ $p->status ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    {{-- G. Dokumen --}}
    <div class="section">
        <h2>G. Kelengkapan Dokumen</h2>
        @if($dokumens->count() === 0)
            <div class="empty">Belum ada data dokumen.</div>
        @else
            <table class="data">
                <thead>
                    <tr>
                        <th style="width: 30pt; text-align: center;">No</th>
                        <th>Jenis Dokumen</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($dokumens as $i => $d)
                        <tr>
                            <td class="center">{{ $i + 1 }}</td>
                            <td>{{ $d->jenis->nama ?? '-' }}</td>
                            <td>{{ $d->status ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    {{-- H. Riwayat SP --}}
    <div class="section">
        <h2>H. Riwayat Surat Peringatan</h2>
        @if($spList->count() === 0)
            <div class="empty">Tidak ada riwayat surat peringatan.</div>
        @else
            <table class="data">
                <thead>
                    <tr>
                        <th style="width: 30pt; text-align: center;">No</th>
                        <th>Level</th>
                        <th>Jenis Pelanggaran</th>
                        <th>Tanggal Terbit</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($spList as $i => $s)
                        <tr>
                            <td class="center">{{ $i + 1 }}</td>
                            <td>{{ $s->level }}</td>
                            <td>{{ $s->jenis_pelanggaran ?? '-' }}</td>
                            <td>{{ $s->tanggal_terbit?->format('d M Y') ?? '-' }}</td>
                            <td>{{ $s->status ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    <div class="footer">
        Dicetak pada {{ $dicetak_at }} — SIMKIP-ITG
    </div>

</body>
</html>
