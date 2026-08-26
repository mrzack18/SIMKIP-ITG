<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            color: #1a1a1a;
            line-height: 1.5;
            padding: 30pt;
        }

        .header {
            display: table;
            width: 100%;
            border-bottom: 2pt solid #263F93;
            padding-bottom: 12pt;
            margin-bottom: 20pt;
        }
        .header-logo {
            display: table-cell;
            width: 70pt;
            vertical-align: middle;
        }
        .header-logo img {
            width: 60pt;
            height: 60pt;
        }
        .header-text {
            display: table-cell;
            text-align: center;
            vertical-align: middle;
        }
        .header-text .instansi {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .header-text .kampus {
            font-size: 16pt;
            font-weight: bold;
            color: #263F93;
            margin: 3pt 0;
        }
        .header-text .alamat {
            font-size: 9pt;
            color: #555;
        }

        .judul {
            text-align: center;
            margin-bottom: 20pt;
        }
        .judul h1 {
            font-size: 14pt;
            text-transform: uppercase;
            text-decoration: underline;
        }
        .judul .nomor {
            font-size: 11pt;
            margin-top: 3pt;
        }

        .meta {
            margin-bottom: 20pt;
        }
        .meta table {
            width: 100%;
        }
        .meta td {
            padding: 3pt 0;
            vertical-align: top;
        }
        .meta .label {
            width: 120pt;
            color: #555;
        }

        .catatan {
            background: #f8f9fa;
            border: 1pt solid #dee2e6;
            padding: 12pt;
            margin-bottom: 20pt;
            border-radius: 4pt;
        }
        .catatan h3 {
            font-size: 11pt;
            margin-bottom: 6pt;
            color: #263F93;
        }
        
        .ttd {
            margin-top: 40pt;
            text-align: right;
        }
        .ttd p {
            margin-bottom: 3pt;
        }
        .ttd .nama {
            font-weight: bold;
            text-decoration: underline;
            margin-top: 50pt;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="header-logo">
            <img src="{{ $logoPath }}" alt="Logo ITG">
        </div>
        <div class="header-text">
            <div class="instansi">Kementerian Pendidikan, Kebudayaan, Riset dan Teknologi</div>
            <div class="kampus">Institut Teknologi Garut</div>
            <div class="alamat">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151 &middot; www.itg.ac.id</div>
        </div>
    </div>

    <div class="judul">
        <h1>{{ $laporan->judul }}</h1>
        <div class="nomor">Nomor: {{ $laporan->nomor_surat }}</div>
    </div>

    <div class="meta">
        <table>
            <tr>
                <td class="label">Tahun Akademik</td>
                <td>: <strong>{{ $laporan->tahun_akademik }}</strong></td>
            </tr>
            <tr>
                <td class="label">Semester</td>
                <td>: <strong>{{ $laporan->semester }}</strong></td>
            </tr>
            <tr>
                <td class="label">Periode Laporan</td>
                <td>: <strong>{{ $laporan->periode }}</strong></td>
            </tr>
            <tr>
                <td class="label">Tanggal Laporan</td>
                <td>: <strong>{{ $laporan->tanggal_laporan?->format('d F Y') }}</strong></td>
            </tr>
            <tr>
                <td class="label">Status</td>
                <td>: <strong>{{ $laporan->status }}</strong></td>
            </tr>
            <tr>
                <td class="label">Dibuat Oleh</td>
                <td>: <strong>{{ $laporan->dibuatOleh?->name }}</strong></td>
            </tr>
        </table>
    </div>

    @if($laporan->catatan_laporan)
    <div class="catatan">
        <h3>Catatan Pengelola KIP-K:</h3>
        <p>{!! nl2br(e($laporan->catatan_laporan)) !!}</p>
    </div>
    @endif

    @php
        $warekReview = $laporan->reviews->where('aksi', 'Disetujui')->first();
    @endphp

    @if($warekReview)
    <div class="catatan" style="background: #f0fdf4; border-color: #bbf7d0;">
        <h3 style="color: #166534;">Disetujui Oleh Warek:</h3>
        <p><strong>{{ $warekReview->warek?->name }}</strong> pada tanggal {{ $warekReview->reviewed_at?->format('d F Y H:i') }}</p>
    </div>
    @endif

    <div class="ttd">
        <p>Garut, {{ $dicetak_at }}</p>
        <p>Sistem Informasi Manajemen KIP-K ITG</p>
    </div>

</body>
</html>
