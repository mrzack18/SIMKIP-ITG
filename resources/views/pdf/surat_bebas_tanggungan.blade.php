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
        }

        .outer-border {
            border: 2.5pt solid #263F93;
            border-radius: 6pt;
            margin: 8pt;
            padding: 1pt;
        }
        .inner-border {
            border: 1pt solid #263F93;
            border-radius: 4pt;
            padding: 18pt 22pt;
        }

        /* KOP */
        .kop {
            display: table;
            width: 100%;
            border-bottom: 2pt solid #263F93;
            padding-bottom: 12pt;
            margin-bottom: 14pt;
        }
        .kop-logo {
            display: table-cell;
            width: 60pt;
            vertical-align: middle;
        }
        .kop-logo img {
            width: 54pt;
            height: 54pt;
        }
        .kop-text {
            display: table-cell;
            text-align: center;
            vertical-align: middle;
        }
        .kop-text .instansi {
            font-size: 8pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5pt;
        }
        .kop-text .nama-kampus {
            font-size: 15pt;
            font-weight: bold;
            letter-spacing: 1pt;
            color: #263F93;
        }
        .kop-text .alamat {
            font-size: 8pt;
            color: #555;
            margin-top: 1pt;
        }

        /* JUDUL */
        .judul {
            text-align: center;
            margin-bottom: 14pt;
        }
        .judul h1 {
            font-size: 12pt;
            font-weight: bold;
            text-decoration: underline;
            text-transform: uppercase;
            letter-spacing: 1pt;
        }

        /* NOMOR SURAT */
        .nomor-surat {
            margin-bottom: 12pt;
        }
        .nomor-surat table {
            width: 100%;
        }
        .nomor-surat td.label { width: 70pt; font-size: 10pt; color: #333; }
        .nomor-surat td.sep   { width: 10pt; text-align: center; }
        .nomor-surat td.value { font-size: 10pt; font-weight: bold; }

        /* KEPADA */
        .kepada {
            margin-bottom: 12pt;
            font-size: 10pt;
        }

        /* BODY */
        .body-text {
            font-size: 10.5pt;
            margin-bottom: 10pt;
            text-align: justify;
        }

        /* DATA MAHASISWA */
        .data-mhs {
            background: #f5f5f5;
            border: 1pt solid #d0d0d0;
            border-radius: 4pt;
            padding: 10pt 14pt;
            margin-bottom: 12pt;
        }
        .data-mhs table { width: 100%; }
        .data-mhs td.lbl { width: 80pt; font-size: 10pt; color: #555; }
        .data-mhs td.sp  { width: 10pt; }
        .data-mhs td.val { font-size: 10pt; font-weight: bold; }

        /* KEWAJIBAN LIST */
        .kewajiban {
            margin-bottom: 12pt;
            font-size: 10.5pt;
        }
        .kewajiban ol {
            padding-left: 18pt;
            margin-top: 5pt;
        }
        .kewajiban li {
            margin-bottom: 3pt;
        }

        /* PENUTUP */
        .penutup { font-size: 10.5pt; margin-bottom: 16pt; text-align: justify; }

        /* TTD */
        .ttd {
            display: table;
            width: 100%;
            margin-top: 16pt;
        }
        .ttd-col {
            display: table-cell;
            width: 50%;
            text-align: center;
            font-size: 10pt;
        }
        .ttd-col .space { height: 52pt; }
        .ttd-col .nama { font-weight: bold; text-decoration: underline; }
        .ttd-col .nip  { font-size: 9pt; color: #555; }
    </style>
</head>
<body>
<div class="outer-border">
    <div class="inner-border">

        <!-- KOP SURAT -->
        <div class="kop">
            <div class="kop-logo">
                <img src="{{ $logoPath }}" alt="Logo ITG">
            </div>
            <div class="kop-text">
                <div class="instansi">Kementerian Pendidikan, Kebudayaan, Riset dan Teknologi</div>
                <div class="nama-kampus">Institut Teknologi Garut</div>
                <div class="alamat">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</div>
                <div class="alamat">Telp. (0262) 540895 &middot; www.itg.ac.id &middot; info@itg.ac.id</div>
            </div>
        </div>

        <!-- JUDUL -->
        <div class="judul">
            <h1>Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K</h1>
        </div>

        <!-- NOMOR SURAT -->
        <div class="nomor-surat">
            <table>
                @foreach([['Nomor', $nomor_surat], ['Lampiran', '—'], ['Perihal', 'Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K']] as [$k, $v])
                <tr>
                    <td class="label">{{ $k }}</td>
                    <td class="sep">:</td>
                    <td class="value" style="{{ $k !== 'Lampiran' ? 'font-weight:bold' : '' }}">{{ $v }}</td>
                </tr>
                @endforeach
            </table>
        </div>

        <!-- KEPADA -->
        <div class="kepada">
            <p>Kepada Yth.</p>
            <p><strong>{{ $mahasiswa['nama'] }}</strong></p>
            <p>NIM: {{ $mahasiswa['nim'] }}</p>
            <p>Program Studi {{ $mahasiswa['prodi'] }}</p>
            <p><em>di Tempat</em></p>
        </div>

        <!-- PEMBUKA -->
        <p class="body-text">Dengan hormat,</p>
        <p class="body-text">
            Yang bertanda tangan di bawah ini, Pengelola KIP-K Institut Teknologi Garut, menerangkan dengan sesungguhnya bahwa:
        </p>

        <!-- DATA MAHASISWA -->
        <div class="data-mhs">
            <table>
                @foreach([
                    ['Nama', $mahasiswa['nama']],
                    ['NIM', $mahasiswa['nim']],
                    ['Program Studi', $mahasiswa['prodi']],
                    ['Angkatan', $mahasiswa['angkatan']],
                    ['Semester', $mahasiswa['semester']],
                ] as [$k, $v])
                <tr>
                    <td class="lbl">{{ $k }}</td>
                    <td class="sp">:</td>
                    <td class="val">{{ $v }}</td>
                </tr>
                @endforeach
            </table>
        </div>

        <!-- KEWAJIBAN -->
        <p class="body-text">
            Telah <strong>menyelesaikan seluruh kewajiban sebagai penerima Kartu Indonesia Pintar Kuliah (KIP-K)</strong>
            di Institut Teknologi Garut, yang meliputi:
        </p>
        <div class="kewajiban">
            <ol>
                @foreach($dokumens as $dok)
                <li>{{ $dok['nama'] }} — diverifikasi {{ $dok['tanggal'] }}</li>
                @endforeach
                <li>Indeks Prestasi Kumulatif (IPK) rata-rata {{ $rata_ipk }} — memenuhi standar minimum KIP-K (&ge;&nbsp;3,00)</li>
                <li>Tidak memiliki riwayat Surat Peringatan aktif</li>
            </ol>
        </div>

        <!-- PENUTUP -->
        <p class="penutup">Demikian surat keterangan ini diterbitkan untuk dapat digunakan sebagaimana mestinya.</p>

        <!-- TTD -->
        <div class="ttd">
            <div class="ttd-col">
                <p>Garut, {{ $tanggal_terbit }}</p>
                <p>Pengelola KIP-K,</p>
                <div class="space"></div>
                <p class="nama">{{ $pengelola_nama }}</p>
                <p class="nip">NIP. {{ $pengelola_nip }}</p>
            </div>
            <div class="ttd-col">
                <p>Mengetahui,</p>
                <p>Wakil Rektor,</p>
                <div class="space"></div>
                <p class="nama">{{ $warek_nama }}</p>
                <p class="nip">NIP. {{ $warek_nip }}</p>
            </div>
        </div>

    </div>
</div>
</body>
</html>
