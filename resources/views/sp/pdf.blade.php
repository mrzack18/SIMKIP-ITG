<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Surat Peringatan {{ $sp->level }}</title>

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
    width: 50%; /* Memberi ruang di sebelah kiri */
}

.signature-block {
    width: 50%;
    text-align: center; /* RATA TENGAH untuk seluruh isi blok tanda tangan */
    vertical-align: top;
}

.signature-block p {
    text-align: center; /* Rata tengah tiap baris teks */
    margin: 0 0 2pt 0;
    line-height: 1.25;
    text-indent: 0;
}

.signature-space {
    height: 55pt; /* Ruang untuk TTD basah / stempel */
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
                    <p class="kop-judul-1">
                        BIRO KEMAHASISWAAN DAN HUBUNGAN MASYARAKAT
                    </p>
                    <p class="kop-judul-2">
                        INSTITUT TEKNOLOGI GARUT
                    </p>
                    <p class="kop-alamat">
                        Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151
                    </p>
                    <p class="kop-alamat">
                        Telp. (0262) 2800433 | Website: www.itg.ac.id
                    </p>
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
                {{ $sp->nomor_surat ?? '—' }}
            </td>
            <td class="date-cell">
                Garut, {{ $sp->tanggal_terbit ? $sp->tanggal_terbit->translatedFormat('d F Y') : '—' }}
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
                <strong>Surat Peringatan {{ str_replace('SP', '', $sp->level) }}</strong>
            </td>
        </tr>
    </table>

    {{-- TUJUAN SURAT --}}
    <div class="to-section">
        <p>Kepada Yth.</p>
        <p>
            <strong>{{ $mahasiswa->user->nama ?? $mahasiswa->nama }}</strong>
        </p>
        <p>di Tempat</p>
    </div>

    {{-- ISI SURAT --}}
    <div class="body-section">
        <p class="no-indent">Dengan hormat,</p>

        <p>
            Berdasarkan hasil evaluasi dan ketentuan yang berlaku bagi penerima Kartu Indonesia Pintar Kuliah (KIP-K), dengan ini kami menyampaikan Surat Peringatan <strong>{{ str_replace('SP', '', $sp->level) }}</strong> kepada Saudara atas pelanggaran atau kondisi akademik sebagai berikut:
        </p>

        <div class="student-details">
            <table>
                <tr>
                    <td class="detail-label">Nama</td>
                    <td class="detail-separator">:</td>
                    <td>
                        <strong>{{ $mahasiswa->user->nama ?? $mahasiswa->nama }}</strong>
                    </td>
                </tr>
                <tr>
                    <td class="detail-label">NIM</td>
                    <td class="detail-separator">:</td>
                    <td>{{ $mahasiswa->user->nim ?? $mahasiswa->nim }}</td>
                </tr>
                <tr>
                    <td class="detail-label">Program Studi</td>
                    <td class="detail-separator">:</td>
                    <td>{{ $mahasiswa->prodi->nama ?? '—' }}</td>
                </tr>
            </table>
        </div>

        <p class="no-indent" style="margin-bottom: 8pt;">
            <strong>Dasar pemberian peringatan:</strong> {{ $sp->deskripsi }}
        </p>

        @if($sp->level === 'SP1')
            <p>
                Berdasarkan hasil evaluasi akademik semester berjalan, Saudara diberikan Surat Peringatan Pertama (SP-1). Saudara diharapkan segera melakukan perbaikan terhadap kondisi tersebut paling lambat tanggal <strong>{{ $sp->batas_evaluasi ? $sp->batas_evaluasi->translatedFormat('d F Y') : '—' }}</strong>. Apabila tidak terdapat perbaikan sesuai ketentuan, evaluasi lanjutan dapat dilakukan untuk menentukan penerbitan surat peringatan berikutnya.
            </p>
        @elseif($sp->level === 'SP2')
            <p>
                Berdasarkan evaluasi lanjutan setelah penerbitan Surat Peringatan Pertama (SP-1), Saudara diberikan Surat Peringatan Kedua (SP-2). Saudara diminta segera berkonsultasi dengan pembimbing akademik dan melakukan perbaikan sesuai ketentuan yang berlaku paling lambat tanggal <strong>{{ $sp->batas_evaluasi ? $sp->batas_evaluasi->translatedFormat('d F Y') : '—' }}</strong>.
            </p>
        @else
            <p>
                Berdasarkan evaluasi lanjutan setelah penerbitan surat peringatan sebelumnya, Saudara diberikan Surat Peringatan Ketiga (SP-3). Saudara diminta segera menghubungi pengelola KIP-K untuk memperoleh arahan dan menindaklanjuti kondisi tersebut sesuai ketentuan yang berlaku. Evaluasi lebih lanjut dapat berakibat pada pencabutan status sebagai penerima KIP-K sesuai prosedur yang berlaku.
            </p>
        @endif

        <p>
            Demikian surat peringatan ini disampaikan agar menjadi perhatian dan ditindaklanjuti sebagaimana mestinya. Kami berharap Saudara dapat melakukan perbaikan untuk mendukung kelangsungan studi dan pemenuhan kewajiban sebagai penerima manfaat KIP-K.
        </p>
    </div>

    {{-- TANDA TANGAN --}}
    <div class="signature-section">
        <table class="signature-table">
            <tr>
                <td class="signature-spacer"></td>
                <td class="signature-block">
                    <p>
                        {{ $sp->penandatangan_jabatan ?? 'Biro Kemahasiswaan dan Hubungan Masyarakat' }},
                    </p>

                    <div class="signature-space"></div>

                    <p class="signature-name">
                        {{ $sp->penandatangan_nama ?? 'Encep Jianul Hayat, S.T., M.T.' }}
                    </p>
                    <p class="signature-nidn">
                        NIDN. {{ $sp->penandatangan_nidn ?? '0420067402' }}
                    </p>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>