<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Surat Keterangan Penyelesaian Studi - {{ $mahasiswa['nama'] }}</title>

    <style>
        @page {
            size: A4;
            margin: 3.8cm 2.54cm 2.54cm 2.54cm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.35;
            color: #000;
            margin: 0;
            padding: 0;
        }

        p {
            margin: 0 0 6pt;
            text-align: justify;
        }

        /* ================= KOP SURAT ================= */
        .page-header {
            position: fixed;
            top: -3.0cm;
            left: 0;
            right: 0;
            width: 100%;
            height: 2.8cm;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: middle;
        }

        .logo {
            width: 75pt;
            text-align: left;
        }

        .logo img {
            width: 65pt;
            height: auto;
        }

        .header-text {
            text-align: center;
            padding-right: 40pt; /* Menyeimbangkan posisi teks agar persis di tengah */
        }

        .header-text p {
            text-align: center;
            margin: 0;
        }

        .kop-kementerian {
            font-size: 10pt;
            font-weight: bold;
            line-height: 1.2;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .kop-judul-1 {
            font-size: 11pt;
            font-weight: bold;
            line-height: 1.2;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .kop-judul-2 {
            font-size: 14pt;
            font-weight: bold;
            line-height: 1.25;
            margin: 2pt 0 !important;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .kop-alamat {
            font-size: 9pt;
            line-height: 1.2;
        }

        /* Garis Kop Surat Resmi */
        .kop-line-bold {
            margin-top: 5pt;
            border-bottom: 2.2pt solid #000;
        }

        .kop-line-thin {
            margin-top: 1.5pt;
            border-bottom: 0.8pt solid #000;
        }

        /* ================= TABEL NOMOR & TANGGAL ================= */
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12pt;
        }

        .meta-table td {
            vertical-align: top;
            padding: 1.5pt 0;
        }

        .meta-label {
            width: 65pt;
        }

        .meta-separator {
            width: 12pt;
            text-align: center;
        }

        .meta-content {
            text-align: left;
        }

        .date-cell {
            text-align: right;
            vertical-align: top;
            width: 200pt;
        }

        /* ================= TUJUAN SURAT ================= */
        .to-section {
            margin-bottom: 12pt;
        }

        .to-section p {
            text-align: left;
            margin-bottom: 2pt;
        }

        /* ================= ISI SURAT ================= */
        .body-section {
            margin-bottom: 10pt;
        }

        .body-section p {
            text-indent: 36pt;
            margin-bottom: 8pt;
            text-align: justify;
        }

        .body-section p.no-indent {
            text-indent: 0;
        }

        /* Tabel Detail Mahasiswa */
        .student-details {
            margin: 6pt 0 10pt 36pt;
        }

        .student-details table {
            border-collapse: collapse;
            width: 100%;
        }

        .student-details td {
            padding: 2pt 0;
            vertical-align: top;
        }

        .detail-label {
            width: 100pt;
        }

        .detail-separator {
            width: 12pt;
            text-align: center;
        }

        /* List Kewajiban */
        .kewajiban-list {
            margin: 4pt 0 8pt 36pt;
            padding-left: 18pt;
        }

        .kewajiban-list li {
            margin-bottom: 3pt;
            line-height: 1.3;
            text-align: justify;
        }

        /* ================= TANDA TANGAN ================= */
        .signature-section {
            width: 100%;
            margin-top: 20pt;
            page-break-inside: avoid;
        }

        .signature-table {
            width: 100%;
            border-collapse: collapse;
        }

        .signature-spacer {
            width: 50%;
        }

        .signature-block {
            width: 50%;
            text-align: center; /* Rata tengah simetris */
            vertical-align: top;
        }

        .signature-block p {
            text-align: center;
            margin-bottom: 2pt;
            line-height: 1.25;
            text-indent: 0;
        }

        .signature-space {
            height: 55pt; /* Ruang TTD basah/stempel */
        }

        .signature-name {
            font-weight: bold;
            text-decoration: underline;
        }

        .signature-nidn {
            font-size: 11pt;
        }

        strong {
            font-weight: bold;
        }
    </style>
</head>

<body>

    {{-- KOP SURAT --}}
    <header class="page-header">
        <table class="header-table">
            <tr>
                <td class="logo">
                    <img src="{{ $logoPath }}" alt="Logo ITG">
                </td>
                <td class="header-text">
                    <p class="kop-judul-1">BIRO KEMAHASISWAAN DAN HUBUNGAN MASYARAKAT</p>
                    <p class="kop-judul-2">INSTITUT TEKNOLOGI GARUT</p>
                    <p class="kop-alamat">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
                    <p class="kop-alamat">Telp. (0262) 2800433 | Website: www.itg.ac.id</p>
                </td>
            </tr>
        </table>

        <div class="kop-line-bold"></div>
        <div class="kop-line-thin"></div>
    </header>

    {{-- NOMOR, LAMPIRAN, PERIHAL & TANGGAL --}}
    <table class="meta-table">
        <tr>
            <td class="meta-label">Nomor</td>
            <td class="meta-separator">:</td>
            <td class="meta-content">
                {{ $nomor_surat ?? '—' }}
            </td>
            <td class="date-cell">
                Garut, {{ $tanggal_terbit ?? '—' }}
            </td>
        </tr>
        <tr>
            <td class="meta-label">Lampiran</td>
            <td class="meta-separator">:</td>
            <td class="meta-content" colspan="2">-</td>
        </tr>
        <tr>
            <td class="meta-label">Perihal</td>
            <td class="meta-separator">:</td>
            <td class="meta-content" colspan="2">
                <strong>Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K</strong>
            </td>
        </tr>
    </table>

    {{-- TUJUAN SURAT --}}
    <div class="to-section">
        <p>Kepada Yth.</p>
        <p>
            <strong>{{ $mahasiswa['nama'] }}</strong>
        </p>
        <p>di Tempat</p>
    </div>

    {{-- ISI SURAT --}}
    <div class="body-section">
        <p class="no-indent">Dengan hormat,</p>

        <p>
            Yang bertanda tangan di bawah ini, Pengelola Kartu Indonesia Pintar Kuliah (KIP-K) Institut Teknologi Garut, menerangkan dengan sesungguhnya bahwa:
        </p>

        <div class="student-details">
            <table>
                <tr>
                    <td class="detail-label">Nama</td>
                    <td class="detail-separator">:</td>
                    <td><strong>{{ $mahasiswa['nama'] }}</strong></td>
                </tr>
                <tr>
                    <td class="detail-label">NIM</td>
                    <td class="detail-separator">:</td>
                    <td>{{ $mahasiswa['nim'] }}</td>
                </tr>
                <tr>
                    <td class="detail-label">Program Studi</td>
                    <td class="detail-separator">:</td>
                    <td>{{ $mahasiswa['prodi'] }}</td>
                </tr>
                <tr>
                    <td class="detail-label">Angkatan</td>
                    <td class="detail-separator">:</td>
                    <td>{{ $mahasiswa['angkatan'] }}</td>
                </tr>
                <tr>
                    <td class="detail-label">Semester</td>
                    <td class="detail-separator">:</td>
                    <td>{{ $mahasiswa['semester'] }}</td>
                </tr>
            </table>
        </div>

        <p class="no-indent" style="margin-bottom: 4pt;">
            Telah <strong>menyelesaikan seluruh kewajiban sebagai penerima Kartu Indonesia Pintar Kuliah (KIP-K)</strong> di Institut Teknologi Garut, yang meliputi:
        </p>

        <ol class="kewajiban-list">
            @foreach($dokumens as $dok)
                <li>{{ $dok['nama'] }} — diverifikasi tanggal {{ $dok['tanggal'] }}</li>
            @endforeach
            <li>Indeks Prestasi Kumulatif (IPK) rata-rata <strong>{{ $rata_ipk }}</strong> (memenuhi standar minimum KIP-K &ge; 3,00)</li>
            <li>Tidak memiliki riwayat Surat Peringatan (SP) aktif</li>
        </ol>

        <p>
            Demikian surat keterangan ini diterbitkan untuk dapat dipergunakan sebagaimana mestinya.
        </p>
    </div>

    {{-- TANDA TANGAN --}}
    <div class="signature-section">
        <table class="signature-table">
            <tr>
                <td class="signature-spacer"></td>
                <td class="signature-block">
                    <p>Kepala BKHM,</p>

                    <div class="signature-space"></div>

                    <p class="signature-name">
                        {{ $pengelola_nama ?? 'Encep Jianul Hayat, S.T., M.T.' }}
                    </p>
                    <p class="signature-nidn">
                        NIP. {{ $pengelola_nip ?? '197501012000031001' }}
                    </p>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>