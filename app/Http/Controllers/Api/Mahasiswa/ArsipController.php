<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArsipController extends Controller
{
    private function getTipe($url)
    {
        if (!$url) return 'pdf'; // fallback per guardrail
        $ext = strtolower(pathinfo($url, PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            return 'img';
        }
        return 'pdf';
    }

    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        if (!$m) return response()->json(['success' => false, 'data' => []]);

        $arsip = collect();

        // 1. Prestasi
        $prestasis = $m->prestasis()->where('status', 'Disetujui')->get();
        foreach ($prestasis as $p) {
            if ($p->file_sertifikat) {
                $arsip->push([
                    'id' => 'prestasi_' . $p->id,
                    'source' => 'prestasi',
                    'nama' => $p->nama_prestasi ?: 'Sertifikat Prestasi',
                    'kategori' => 'Sertifikat Prestasi',
                    'tanggal' => $p->tanggal_mulai ? $p->tanggal_mulai->format('d M Y') : ($p->created_at ? $p->created_at->format('d M Y') : ''),
                    'tipe' => $this->getTipe($p->file_sertifikat),
                    'file_url' => asset('storage/' . $p->file_sertifikat),
                    'status' => 'Disetujui',
                    'tingkat' => $p->tingkat,
                    'pencapaian' => $p->pencapaian,
                    'penyelenggara' => $p->penyelenggara,
                    'tanggalMulai' => $p->tanggal_mulai ? $p->tanggal_mulai->format('d M Y') : null,
                    'tanggalSelesai' => $p->tanggal_selesai ? $p->tanggal_selesai->format('d M Y') : null,
                    'tempat' => $p->tempat,
                    'deskripsi' => $p->deskripsi,
                    'link' => $p->link_penyelenggara,
                ]);
            }
        }

        // 2. Organisasi
        $organisasis = $m->organisasis()->where('status', 'Disetujui')->get();
        foreach ($organisasis as $o) {
            if ($o->file_sk) {
                $arsip->push([
                    'id' => 'organisasi_' . $o->id,
                    'source' => 'organisasi',
                    'nama' => $o->nama ?: 'SK Organisasi',
                    'kategori' => 'Bukti Keaktifan Organisasi',
                    'tanggal' => $o->periode_mulai ? $o->periode_mulai->format('d M Y') : ($o->created_at ? $o->created_at->format('d M Y') : ''),
                    'tipe' => $this->getTipe($o->file_sk),
                    'file_url' => asset('storage/' . $o->file_sk),
                    'status' => 'Disetujui',
                    'namaOrganisasi' => $o->nama,
                    'jabatan' => $o->jabatan,
                    'tanggalMulai' => $o->periode_mulai ? $o->periode_mulai->format('d M Y') : null,
                    'tanggalSelesai' => $o->periode_selesai ? $o->periode_selesai->format('d M Y') : null,
                    'deskripsi' => $o->deskripsi,
                ]);
            }
        }

        // 3. Pelatihan
        $pelatihans = $m->pelatihans()->where('status', 'Disetujui')->get();
        foreach ($pelatihans as $pel) {
            if ($pel->file_sertifikat) {
                $arsip->push([
                    'id' => 'pelatihan_' . $pel->id,
                    'source' => 'pelatihan',
                    'nama' => $pel->nama ?: 'Sertifikat Pelatihan',
                    'kategori' => 'Sertifikat Pelatihan',
                    'tanggal' => $pel->tanggal_mulai ? $pel->tanggal_mulai->format('d M Y') : ($pel->created_at ? $pel->created_at->format('d M Y') : ''),
                    'tipe' => $this->getTipe($pel->file_sertifikat),
                    'file_url' => asset('storage/' . $pel->file_sertifikat),
                    'status' => 'Disetujui',
                    'namaPelatihan' => $pel->nama,
                    'jenis' => $pel->jenis,
                    'penyelenggara' => $pel->penyelenggara,
                    'tanggalMulai' => $pel->tanggal_mulai ? $pel->tanggal_mulai->format('d M Y') : null,
                    'tanggalSelesai' => $pel->tanggal_selesai ? $pel->tanggal_selesai->format('d M Y') : null,
                    'tempat' => $pel->tempat,
                    'deskripsi' => $pel->deskripsi,
                ]);
            }
        }

        // 4. Dokumen
        $dokumens = $m->dokumens()->where('status', 'Disetujui')->with('jenis')->get();
        foreach ($dokumens as $d) {
            if ($d->path_file) {
                // If the name from jenis is SK Penetapan KIP-K it will match CATEGORIES in frontend.
                // Otherwise it will fall back to Dokumen Kewajiban.
                $namaJenis = $d->jenis ? $d->jenis->nama : '';
                $kat = ($namaJenis === 'SK Penetapan KIP-K') ? 'SK Penetapan KIP-K' : 'Dokumen Kewajiban';
                
                $arsip->push([
                    'id' => 'dokumen_' . $d->id,
                    'source' => 'dokumen',
                    'nama' => $namaJenis ?: 'Dokumen Kewajiban',
                    'kategori' => $kat,
                    'tanggal' => $d->created_at ? $d->created_at->format('d M Y') : '',
                    'tipe' => $this->getTipe($d->path_file),
                    'file_url' => asset('storage/' . $d->path_file),
                    'status' => 'Disetujui',
                ]);
            }
        }

        // 5. IPK Semesters (Treated as Approved)
        $ipkSemesters = $m->ipkSemestrs()->get();
        foreach ($ipkSemesters as $ipk) {
            if ($ipk->file_khs) {
                $arsip->push([
                    'id' => 'ipk_' . $ipk->id,
                    'source' => 'ipk',
                    'nama' => 'KHS Semester ' . $ipk->semester . ' - ' . $ipk->tahun_ajaran,
                    'kategori' => 'Kartu Hasil Studi',
                    'tanggal' => $ipk->created_at ? $ipk->created_at->format('d M Y') : '',
                    'tipe' => $this->getTipe($ipk->file_khs),
                    'file_url' => asset('storage/' . $ipk->file_khs),
                    'status' => 'Disetujui',
                ]);
            }
        }

        // 6. Bebas Tanggungan
        $bt = $m->bebasTanggungan()->where('status', 'Disetujui')->first();
        if ($bt) {
            $arsip->push([
                'id' => 'bt_' . $bt->id,
                'source' => 'bebas_tanggungan',
                'nama' => 'Surat Keterangan Penyelesaian Studi',
                'kategori' => 'Surat Surat Penyelesaian',
                'tanggal' => $bt->tanggal_terbit ? $bt->tanggal_terbit->format('d M Y') : ($bt->updated_at ? $bt->updated_at->format('d M Y') : ''),
                'tipe' => 'pdf', // Explicitly PDF for Bebas Tanggungan generated file
                'file_url' => url('/api/bebas-tanggungan/pdf'),
                'status' => 'Disetujui',
            ]);
        }

        // Sort by tanggal descending. We'll use strtotime.
        $sorted = $arsip->sortByDesc(function ($item) {
            return strtotime($item['tanggal']);
        })->values();

        return response()->json(['success' => true, 'data' => $sorted]);
    }
}
