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
        .header-logo {
            display: table-cell;
            width: 60pt;
            vertical-align: middle;
        }
        .header-logo img { width: 52pt; height: 52pt; }
        .header-text {
            display: table-cell;
            text-align: center;
            vertical-align: middle;
        }
        .header-text .instansi {
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .header-text .kampus {
            font-size: 15pt;
            font-weight: bold;
            color: #263F93;
            margin: 2pt 0;
        }
        .header-text .alamat { font-size: 8pt; color: #555; }

        .judul {
            text-align: center;
            margin-bottom: 10pt;
        }
        .judul h1 {
            font-size: 13pt;
            text-transform: uppercase;
            text-decoration: underline;
            color: #263F93;
        }

        .filters {
            width: 100%;
            margin-bottom: 10pt;
            border: 1pt solid #cbd5e1;
            background: #f8fafc;
        }
        .filters td {
            padding: 3pt 8pt;
            font-size: 9pt;
            border-bottom: 1pt solid #e2e8f0;
        }
        .filters tr:last-child td { border-bottom: none; }
        .filters .label {
            width: 90pt;
            color: #475569;
            font-weight: bold;
        }

        table.data {
            width: 100%;
            border-collapse: collapse;
        }
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

        .empty {
            text-align: center;
            padding: 24pt;
            color: #64748b;
            font-style: italic;
            border: 1pt solid #cbd5e1;
        }

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
        <h1>{{ $judul }}</h1>
    </div>

    @if(count($filters) > 0)
    <table class="filters">
        @foreach($filters as $label => $value)
        <tr>
            <td class="label">{{ $label }}</td>
            <td>: {{ $value }}</td>
        </tr>
        @endforeach
        <tr>
            <td class="label">Jumlah Data</td>
            <td>: {{ count($rows) }} catatan</td>
        </tr>
    </table>
    @endif

    @if(count($rows) === 0)
        <div class="empty">Tidak ada data yang sesuai dengan filter yang dipilih.</div>
    @else
        <table class="data">
            <thead>
                <tr>
                    <th style="width: 22pt; text-align: center;">No</th>
                    @foreach($headers as $header)
                        <th>{{ $header }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach($rows as $i => $row)
                    <tr>
                        <td class="center">{{ $i + 1 }}</td>
                        @foreach($row as $cell)
                            <td>{{ $cell ?? '-' }}</td>
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
