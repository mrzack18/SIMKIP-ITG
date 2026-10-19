<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
    @page {
        margin: 2cm 2cm 2cm 2cm;
    }
    body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.4;
        color: #111827;
        margin: 0;
        padding: 0;
    }
    p { margin: 0; }

    /* HEADER / KOP (Judul di atas, Logo di bawahnya, Tanpa Garis) */
    .cover-top {
        text-align: center;
        margin-bottom: 20pt;
    }
    .judul-laporan {
        font-size: 14pt;
        font-weight: bold;
        text-transform: uppercase;
        color: #0f172a;
        margin-bottom: 4pt;
        line-height: 1.4;
    }
    .sub-judul-laporan {
        font-size: 10.5pt;
        font-weight: bold;
        color: #2563eb;
        text-transform: uppercase;
        margin-bottom: 16pt;
    }
    .logo-container {
        margin-bottom: 12pt;
    }
    .cover-logo {
        height: 7cm;
        width: auto;
        margin: 0 auto 6pt auto;
        display: block;
    }
    .kop-instansi {
        font-size: 16pt;
        font-weight: bold;
        text-transform: uppercase;
        color: #1e3a8a;
    }
    .kop-alamat {
        font-size: 12pt;
        color: #4b5563;
        margin-top: 2pt;
    }

    /* META CONTAINER — Berada persis di tengah halaman & tanpa kotak */
    .meta-container {
        text-align: center;
        margin: 15pt auto 20pt auto;
    }
    .meta-table {
        margin: 0 auto;
        border-collapse: collapse;
        text-align: left;
        width: auto;
    }
    .meta-table td {
        padding: 3.5pt 6pt;
        vertical-align: top;
        font-size: 10.5pt;
    }
    .meta-table .label {
        font-weight: bold;
        color: #111827;
        white-space: nowrap;
    }
    .meta-table .colon {
        text-align: center;
        color: #111827;
        padding: 3.5pt 2pt;
    }
    .meta-table .value {
        color: #111827;
        white-space: nowrap;
    }

    /* CATATAN */
    .catatan {
        width: 85%;
        margin: 0 auto 15pt auto;
        background: #fffbe3;
        border: 1pt solid #fde047;
        border-left: 4pt solid #eab308;
        padding: 8pt 10pt;
        font-size: 9.5pt;
        border-radius: 2pt;
    }
    .catatan-success {
        background: #f0fdf4;
        border: 1pt solid #bbf7d0;
        border-left: 4pt solid #22c55e;
    }
    .catatan strong {
        display: block;
        margin-bottom: 2pt;
    }

    /* SIGNATURE — 2 kolom rata tengah */
    .ttd-row {
        display: table;
        width: 100%;
        margin-top: 25pt;
    }
    .ttd-col {
        display: table-cell;
        width: 50%;
        text-align: center;
        vertical-align: top;
    }
    .ttd-space { height: 45pt; }
    .signature-name {
        font-weight: bold;
        text-decoration: underline;
        margin-top: 2pt;
    }
    .signature-nip {
        font-size: 9pt;
    }

    /* PAGE BREAK & REKAP */
    .page-break { page-break-before: always; }
    .rekap-title {
        text-align: center;
        font-size: 12pt;
        font-weight: bold;
        margin-bottom: 12pt;
        text-transform: uppercase;
    }
    table.rekap {
        width: 100%;
        border-collapse: collapse;
        font-size: 8.5pt;
    }
    table.rekap th {
        background: #1e3a8a;
        color: white;
        padding: 5pt 3pt;
        border: 0.5pt solid #1e3a8a;
        text-align: center;
        font-size: 8pt;
        font-weight: bold;
        text-transform: uppercase;
    }
    table.rekap td {
        padding: 4pt 3pt;
        border: 0.5pt solid #cbd5e1;
        vertical-align: middle;
    }
    table.rekap tr:nth-child(even) td { background: #f8fafc; }
    table.rekap td.center { text-align: center; }
    .empty {
        text-align: center;
        padding: 16pt;
        color: #64748b;
        font-style: italic;
    }
    .footer {
        margin-top: 15pt;
        font-size: 8pt;
        color: #64748b;
        text-align: right;
        border-top: 0.5pt solid #e2e8f0;
        padding-top: 4pt;
    }
</style>
</head>
<body>

    {{-- HALAMAN 1: COVER PAGE --}}
    <div class="cover-top">
        <!-- 1. Logo dan Institusi di bawah judul (Tanpa Garis) -->
        <div class="logo-container">
            <img src="{{ $logoPath }}" class="cover-logo" alt="Logo ITG">
            <p class="kop-instansi">{{ \App\Models\Konfigurasi::get('nama_institusi', 'Institut Teknologi Garut') }}</p>
            <p class="kop-alamat">{{ \App\Models\Konfigurasi::get('alamat_institusi', 'Jl. Mayor Syamsu No. 1, Garut 44151') }}</p>
        </div>

        <!-- 2. Judul di paling atas -->
        <p class="judul-laporan">{{ $laporan->judul }}</p>
        <p class="sub-judul-laporan">PROGRAM KARTU INDONESIA PINTAR KULIAH (KIP-K)</p>

    </div>

    <!-- 3. Metadata (Di tengah & tanpa kotak) -->
    <div class="meta-container">
        <table class="meta-table">
            <tr>
                <td class="label">Tahun Akademik</td>
                <td class="colon">:</td>
                <td class="value">{{ $laporan->tahun_akademik }}</td>
            </tr>
            <tr>
                <td class="label">Semester</td>
                <td class="colon">:</td>
                <td class="value">{{ $laporan->semester }}</td>
            </tr>
            <tr>
                <td class="label">Tanggal Dibuat</td>
                <td class="colon">:</td>
                <td class="value">{{ $laporan->tanggal_laporan?->format('d F Y') ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Status Berkas</td>
                <td class="colon">:</td>
                <td class="value"><strong>{{ $laporan->status }}</strong></td>
            </tr>
            <tr>
                <td class="label">Dibuat Oleh</td>
                <td class="colon">:</td>
                <td class="value">{{ $laporan->dibuatOleh?->name ?? '-' }}</td>
            </tr>
        </table>
    </div>

    @php
        $warekReview = $laporan->reviews->where('aksi', 'Disetujui')->first();
    @endphp

    {{-- SIGNATURE (Rata tengah masing-masing kolom) --}}
    <div class="ttd-row">
        <div class="ttd-col">
            <p>Garut, {{ $dicetak_at }}</p>
            <p>Pengelola KIP-K,</p>
            <div class="ttd-space"></div>
            <p class="signature-name">{{ $laporan->dibuatOleh?->name ?? '________________' }}</p>
            <p class="signature-nip">NIDN. {{ \App\Models\Konfigurasi::get('pengelola_nip', '197804202006041001') }}</p>
        </div>
        <div class="ttd-col">
            <p>Mengetahui,</p>
            <p>Wakil Rektor III,</p>
            <div class="ttd-space"></div>
            <p class="signature-name">{{ $warek_nama ?? '________________' }}</p>
            <p class="signature-nip">NIP. {{ $warek_nip ?? '-' }}</p>
        </div>
    </div>


    {{-- HALAMAN 2+: REKAP MAHASISWA --}}
    <div class="page-break"></div>

    <div class="rekap-title">
        Rekapitulasi {{ $jenisLabel }} Mahasiswa Penerima KIP-K<br>
        <span style="font-size: 9.5pt; font-weight: normal; text-transform: none; color: #475569;">
            Periode {{ $laporan->periode }} — TA {{ $laporan->tahun_akademik }}
        </span>
    </div>

    @if($laporan->catatan_laporan)
    <div class="catatan">
        <strong style="color: #854d0e;">Catatan Pengelola KIP-K:</strong>
        <p style="color: #713f12;">{{ $laporan->catatan_laporan }}</p>
    </div>
    @endif

    @if($warekReview)
    <div class="catatan catatan-success">
        <strong style="color: #166534;">Disetujui Oleh Wakil Rektor III:</strong>
        <p style="color: #15803d;">{{ $warekReview->warek?->name }} pada {{ $warekReview->reviewed_at?->format('d F Y H:i') }}</p>
    </div>
    @endif

    @if(count($rows) === 0)
        <div class="empty">Tidak ada data {{ strtolower($jenisLabel) }} untuk periode ini.</div>
    @else
        <table class="rekap">
            <thead>
                <tr>
                    <th style="width: 6mm;">No</th>
                    @foreach($columns as $key => $header)
                        <th>{{ $header }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach($rows as $i => $row)
                <tr>
                    <td class="center">{{ $i + 1 }}</td>
                    @foreach($columns as $key => $header)
                        <td>{{ $row[$key] ?? '-' }}</td>
                    @endforeach
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">
        Dicetak pada {{ $dicetak_at }} — SIMKIP-ITG
    </div>

</body>
</html>