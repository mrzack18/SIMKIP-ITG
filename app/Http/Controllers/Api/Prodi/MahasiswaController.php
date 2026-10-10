<?php

namespace App\Http\Controllers\Api\Prodi;

use App\Helpers\TahunAjaranHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\MahasiswaResource;
use App\Http\Resources\OrganisasiResource;
use App\Http\Resources\PelatihanResource;
use App\Http\Resources\PrestasiResource;
use App\Models\DokumenJenis;
use App\Models\Mahasiswa;
use App\Services\BebasTanggunganService;
use App\Services\ExcelExportService;
use App\Services\IPKCalculatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MahasiswaController extends Controller
{
    private function getProdiId(Request $request): int
    {
        return (int) ($request->user()->prodi_id ?? 0);
    }

    public function index(Request $request): JsonResponse
    {
        $prodiId = $this->getProdiId($request);
        \Log::info('PRODI DEBUG', ['user_id' => $request->user()->id ?? null, 'role' => $request->user()->role ?? null, 'prodi_id' => $prodiId]);

        if (! $prodiId) {
            return response()->json(['success' => false, 'message' => 'Prodi tidak ditemukan untuk user ini.'], 403);
        }

        $ta = ($request->tahun_ajaran && $request->tahun_ajaran !== 'Semua') ? $request->tahun_ajaran : null;
        $query = Mahasiswa::withDetails($ta)->with(['suratPeringatans'])->where('prodi_id', $prodiId);

        if ($request->search) {
            $q = $request->search;
            $query->where(fn ($qb) => $qb->where('nim', 'like', "%$q%")->orWhere('nama', 'like', "%$q%"));
        }
        if ($request->angkatan && $request->angkatan !== 'Semua') {
            $query->where('angkatan', $request->angkatan);
        }
        if ($request->kategori && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }
        if ($request->status && $request->status !== 'Semua Status') {
            if ($ta && $request->status === 'Aktif') {
                // Historically active, skip strict current status filter
            } else {
                $query->where('status', $request->status);
            }
        }
        if ($request->kipFilter && $request->kipFilter !== 'Semua') {
            $kategori = $request->kipFilter === 'KIP-K Reguler' ? 'Reguler' : 'Aspirasi';
            $query->where('kategori', $kategori);
        }

        // Apply SP Filter
        if ($request->spFilter && $request->spFilter !== 'Semua') {
            if ($request->spFilter === 'Tanpa SP') {
                $query->whereDoesntHave('suratPeringatans', fn ($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang']));
            } else {
                $query->whereHas('suratPeringatans', fn ($q) => $q->where('level', $request->spFilter)->whereIn('status', ['Aktif', 'Masa Tenggang']));
            }
        }

        // IPK Filter
        if ($request->ipkFilter && $request->ipkFilter !== 'Semua') {
            if ($request->ipkFilter === 'Di Bawah Standar (< 3.0)') {
                $query->having('ipk_calc', '<', 3.0);
            } elseif ($request->ipkFilter === 'Di Atas Standar (≥ 3.0)') {
                $query->having('ipk_calc', '>=', 3.0);
            }
        }

        // Sorting — Prodi uses NIM A-Z as default
        if ($request->sortBy) {
            switch ($request->sortBy) {
                case 'NIM (A-Z)':          $query->orderBy('nim');
                    break;
                case 'NIM (Z-A)':          $query->orderByDesc('nim');
                    break;
                case 'Nama (A-Z)':         $query->orderBy('nama');
                    break;
                case 'Nama (Z-A)':         $query->orderByDesc('nama');
                    break;
                case 'IPK (Tertinggi)':    $query->orderByRaw('ipk_calc IS NULL')->orderByDesc('ipk_calc');
                    break;
                case 'IPK (Terendah)':     $query->orderByRaw('ipk_calc IS NULL')->orderBy('ipk_calc');
                    break;
                case 'IPK Tertinggi → Terendah': $query->orderByRaw('ipk_calc IS NULL')->orderByDesc('ipk_calc');
                    break;
                case 'IPK Terendah → Tertinggi': $query->orderByRaw('ipk_calc IS NULL')->orderBy('ipk_calc');
                    break;
                case 'Nama A–Z':           $query->orderBy('nama');
                    break;
                case 'Angkatan Terbaru':   $query->orderByDesc('angkatan');
                    break;
                default:                   $query->orderByRaw('ipk_calc IS NULL')->orderByDesc('ipk_calc');
                    break;
            }
        } else {
            $query->orderByRaw('ipk_calc IS NULL')->orderByDesc('ipk_calc');
        }

        $limit = (int) ($request->limit ?? 10);
        $page = (int) ($request->page ?? 1);

        $total = $query->count();
        $data = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'data' => MahasiswaResource::collection($data),
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'totalPages' => (int) ceil($total / $limit),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $prodiId = $this->getProdiId($request);
        $m = Mahasiswa::withDetails()
            ->where('prodi_id', $prodiId)
            ->findOrFail($id);

        return response()->json(['data' => new MahasiswaResource($m)]);
    }

    /**
     * Get the complete profile (mahasiswa + ipk history + prestasi + organisasi + pelatihan + dokumen + sp + bebas-tanggungan)
     * for the Prodi MahasiswaDetail page.
     */
    public function detail(Request $request, int $id): JsonResponse
    {
        $prodiId = $this->getProdiId($request);
        $ta = $request->tahun_ajaran && $request->tahun_ajaran !== 'Semua' ? $request->tahun_ajaran : null;
        $m = Mahasiswa::with([
            'prodi',
            'user.contactHistories',
            'ipkSemestrs' => fn ($q) => $q->with('mataKuliahs'),
            'dokumens' => fn ($q) => TahunAjaranHelper::applyDateMaxFilter($q, 'dokumens.created_at', $ta)->with('jenis'),
            'suratPeringatans' => fn ($q) => TahunAjaranHelper::applyDateMaxFilter($q, 'surat_peringatans.tanggal_terbit', $ta)->orderByDesc('tanggal_terbit'),
            'prestasis' => fn ($q) => TahunAjaranHelper::applyDateMaxFilter($q, 'prestasis.tanggal_mulai', $ta),
            'organisasis' => fn ($q) => TahunAjaranHelper::applyDateMaxFilter($q, 'organisasis.periode_mulai', $ta),
            'pelatihans' => fn ($q) => TahunAjaranHelper::applyDateMaxFilter($q, 'pelatihans.tanggal_mulai', $ta),
            'bebasTanggungan' => fn ($q) => TahunAjaranHelper::applyDateMaxFilter($q, 'bebas_tanggungans.tanggal_ajukan', $ta),
        ])
            ->where('prodi_id', $prodiId)
            ->findOrFail($id);

        // Filter riwayat semester: batasi ke semester tujuan tahun ajaran
        // terpilih (tanpa filter => tahun ajaran aktif sekarang; hasil 0 =
        // kosong) & buang baris tanpa nilai (ips NULL). Baris dengan IPS asli
        // 0 (semua nilai E) tetap ditampilkan.
        $ipkList = $m->ipkSemestrs;
        $semesterTujuan = TahunAjaranHelper::calculateSemester((int) $m->angkatan, $ta);
        $ipkList = $ipkList->filter(fn ($s) => (int) $s->semester <= $semesterTujuan)->values();
        $m->setRelation('ipkSemestrs', $ipkList->filter(fn ($s) => $s->ips !== null)->values());

        // Compute IPK stats
        $ipkHistory = $m->ipkSemestrs;
        $ipkValues = $ipkHistory->pluck('ipk')->filter(fn ($x) => $x !== null)->map(fn ($x) => (float) $x);
        $ipkHighest = $ipkValues->count() > 0 ? $ipkValues->max() : null;
        $ipkLowest = $ipkValues->count() > 0 ? $ipkValues->min() : null;
        $ipkAvg = $ipkValues->count() > 0 ? round($ipkValues->avg(), 2) : null;
        $ipkMaxSem = $ipkValues->count() > 0 ? (int) $ipkHistory->sortByDesc('ipk')->first()->semester : null;
        $ipkMinSem = $ipkValues->count() > 0 ? (int) $ipkHistory->sortBy('ipk')->first()->semester : null;
        $ipkTerakhir = ($lastSem = $ipkHistory->sortByDesc('semester')->first()) && $lastSem->ipk !== null
            ? (float) $lastSem->ipk
            : null;

        // MK yang belum lulus (aggregate status perbaikan: lulus di semester lain atau belum)
        $mkBelumLulus = $ipkHistory->flatMap(fn ($s) => $s->mataKuliahs->where('lulus', false))
            ->filter(fn ($mk) => ! IPKCalculatorService::isNilaiNetral((string) $mk->nilai_huruf))
            ->groupBy('kode')
            ->map(fn ($group) => [
                'kode' => $group->first()->kode,
                'nama' => $group->first()->nama,
                'sks' => (int) $group->first()->sks,
                'nilai' => $group->first()->nilai_huruf ?? '-',
                'semesterAwal' => (int) $group->min('ipk_semester.semester'),
                'lulusDiSem' => null,
                'statusPerbaikan' => 'belum',
            ])
            ->values();

        // Detect MK yang sudah diperbaiki (muncul di semester lain dengan lulus = true)
        foreach ($mkBelumLulus as &$mk) {
            $repaired = $ipkHistory->flatMap(fn ($s) => $s->mataKuliahs)
                ->where('kode', $mk['kode'])
                ->where('lulus', true)
                ->first();
            if ($repaired) {
                $mk['lulusDiSem'] = (int) $repaired->ipk_semester_id;
                $repairedSem = $ipkHistory->firstWhere('id', $repaired->ipk_semester_id);
                if ($repairedSem) {
                    $mk['lulusDiSem'] = (int) $repairedSem->semester;
                    $mk['statusPerbaikan'] = 'lulus';
                }
            }
        }

        // Dokumen Kewajiban: list all wajib + the student's upload status
        $dokumenWajib = DokumenJenis::where('is_wajib', true)
            ->orderBy('urutan')
            ->get()
            ->map(function ($j) use ($m) {
                $dok = $m->dokumens->firstWhere('dokumen_jenis_id', $j->id);
                $status = 'Belum Diunggah';
                if ($dok) {
                    $status = match ($dok->status) {
                        'Disetujui' => 'Disetujui',
                        'Ditolak' => 'Ditolak',
                        'Menunggu' => 'Menunggu',
                        'Menunggu Validasi' => 'Menunggu Validasi',
                        default => 'Belum Diunggah',
                    };
                }

                return [
                    'id' => $j->id,
                    'nama' => $j->nama,
                    'status' => $status,
                    'tanggal' => $dok?->created_at?->format('d M Y'),
                    'catatan' => $dok?->catatan_admin,
                    'deskripsi' => $j->deskripsi,
                    'tipe' => $j->is_wajib ? 'Dokumen Wajib' : 'Dokumen Pendukung',
                    'fileUrl' => $dok?->path_file ? url('storage/'.$dok->path_file) : null,
                ];
            });

        $dokumenDisetujui = $dokumenWajib->where('status', 'Disetujui')->count();

        // Bebas Tanggungan Checklist (reuse service)
        $checklist = BebasTanggunganService::getChecklist($m);

        // IPK Chart data
        $ipkChart = $ipkHistory->sortBy('semester')->values()->map(fn ($s) => [
            'semester' => (int) $s->semester,
            'ipk' => $s->ipk !== null ? (float) $s->ipk : null,
        ]);

        // Prestasi, Organisasi, Pelatihan already via MahasiswaResource-like map
        $mapFiles = fn ($path) => $path ? url('storage/'.$path) : null;

        $prestasi = PrestasiResource::collection($m->prestasis);
        $organisasi = OrganisasiResource::collection($m->organisasis);
        $pelatihan = PelatihanResource::collection($m->pelatihans);

        $sp = $m->suratPeringatans->map(fn ($sp) => [
            'id' => $sp->id,
            'level' => $sp->level,
            'nomorSurat' => $sp->nomor_surat,
            'tanggal' => $sp->tanggal_terbit?->translatedFormat('d F Y'),
            'tanggalRaw' => $sp->tanggal_terbit?->format('Y-m-d'),
            'alasan' => $sp->deskripsi,
            'batasEvaluasi' => $sp->batas_evaluasi?->translatedFormat('d F Y'),
            'status' => $sp->status,
            'sisaHari' => $sp->sisa_hari,
            'jenisPelanggaran' => $sp->jenis_pelanggaran,
            'catatan' => $sp->catatan,
            'diterbitkanOleh' => $sp->diterbitkan_oleh,
            'createdAt' => $sp->created_at?->format('Y-m-d'),
        ])->values();

        $bebas = $m->bebasTanggungan ? [
            'id' => $m->bebasTanggungan->id,
            'status' => $m->bebasTanggungan->status,
            'tanggal' => $m->bebasTanggungan->created_at?->format('d M Y'),
        ] : null;

        $contactHistories = $m->user?->contactHistories?->map(fn ($c) => [
            'nomor' => $c->no_hp,
            'sem' => $c->keterangan,
            'aktif' => true,
            'status' => 'Aktif',
            'tanggal' => $c->created_at?->format('d M Y'),
        ]) ?? [];

        return response()->json([
            'success' => true,
            'mahasiswa' => [
                'id' => $m->id,
                'nim' => $m->nim,
                'nama' => $m->nama,
                'prodi' => $m->prodi?->nama,
                'prodiId' => $m->prodi_id,
                'angkatan' => (int) $m->angkatan,
                'kategori' => $m->kategori,
                'status' => $m->status,
                'semester' => TahunAjaranHelper::calculateSemester((int) $m->angkatan),
                'semesterDicabut' => $m->status === 'Dicabut' ? $m->semester_dicabut : null,
                'tanggalDicabut' => $m->status === 'Dicabut' && $m->tanggal_dicabut ? $m->tanggal_dicabut->format('d M Y') : null,
                'alasanDicabut' => $m->status === 'Dicabut' ? $m->alasan_dicabut : null,
                'tempatLahir' => $m->tempat_lahir,
                'tanggalLahir' => $m->tanggal_lahir?->format('d M Y'),
                'jenisKelamin' => $m->jenis_kelamin,
                'alamat' => $m->alamat,
                'namaAyah' => $m->nama_ayah,
                'namaIbu' => $m->nama_ibu,
                'telAyah' => $m->tel_ayah,
                'telIbu' => $m->tel_ibu,
                'nik' => $m->nik,
                'nisn' => $m->nisn,
                'email' => $m->user?->email,
                'noHp' => $m->user?->no_hp,
                'fotoProfil' => $m->user?->foto_profil ? url('storage/'.$m->user->foto_profil) : null,
                'contactHistories' => $contactHistories,
                'ipkTerakhir' => $ipkTerakhir,
                'ipkTertinggi' => $ipkHighest,
                'ipkTerendah' => $ipkLowest,
                'ipkRataRata' => $ipkAvg,
                'ipkSemTertinggi' => $ipkMaxSem,
                'ipkSemTerendah' => $ipkMinSem,
                'spAktif' => $sp->whereIn('status', ['Aktif', 'Masa Tenggang'])->sortByDesc('level')->first(),
            ],
            'ipk_history' => $ipkHistory->sortBy('semester')->values()->map(fn ($s) => [
                'semester' => (int) $s->semester,
                'tahun' => $s->tahun_ajaran,
                'ips' => $s->ips !== null ? (float) $s->ips : null,
                'ipk' => $s->ipk !== null ? (float) $s->ipk : null,
                'mkBelumLulus' => $s->mataKuliahs
                    ->where('lulus', false)
                    ->reject(fn ($mk) => IPKCalculatorService::isNilaiNetral((string) $mk->nilai_huruf))
                    ->count(),
                'mataKuliah' => $s->mataKuliahs->map(fn ($mk) => [
                    'kode' => $mk->kode,
                    'nama' => $mk->nama,
                    'sks' => (int) $mk->sks,
                    'nilaiHuruf' => $mk->nilai_huruf,
                    'nilaiMutu' => (float) $mk->nilai_mutu,
                    'lulus' => (bool) $mk->lulus,
                    // Label status dari aturan tunggal IPKCalculatorService, supaya
                    // "Belum Lulus" tetap hanya untuk D/E dan "-"/"T" punya label sendiri.
                    'status' => IPKCalculatorService::statusMk((string) $mk->nilai_huruf),
                    'statusKode' => IPKCalculatorService::statusMkKode((string) $mk->nilai_huruf),
                    'netral' => IPKCalculatorService::isNilaiNetral((string) $mk->nilai_huruf),
                ])->values(),
            ]),
            'ipk_chart' => $ipkChart,
            'mk_belum_lulus' => $mkBelumLulus,
            'dokumen_kewajiban' => $dokumenWajib->values(),
            'dokumen_summary' => [
                'total_wajib' => $dokumenWajib->count(),
                'total_disetujui' => $dokumenDisetujui,
                'lengkap' => $dokumenDisetujui === $dokumenWajib->count(),
            ],
            'syarat_penyelesaian' => collect($checklist['checklist'])->map(fn ($c) => [
                'nama' => $c['syarat'],
                'terpenuhi' => (bool) $c['terpenuhi'],
                'keterangan' => $c['keterangan'],
            ])->values(),
            'checklist_meta' => [
                'ipk_minimum' => $checklist['ipk_minimum'],
                'ipk_terakhir' => $checklist['ipk_terakhir'],
                'sks_ditempuh' => $checklist['sks_ditempuh'],
                'sks_minimum' => $checklist['sks_minimum'],
                'can_apply' => (bool) $checklist['can_apply'],
            ],
            'bebas_tanggungan' => $bebas,
            'prestasi' => $prestasi,
            'organisasi' => $organisasi,
            'pelatihan' => $pelatihan,
            'sp' => $sp,
        ]);
    }

    public function ekspor(Request $request): JsonResponse
    {
        $prodiId = $this->getProdiId($request);
        $query = Mahasiswa::with(['prodi', 'ipkSemestrs', 'dokumens.jenis', 'suratPeringatans'])
            ->where('prodi_id', $prodiId);

        if ($request->angkatan && $request->angkatan !== 'Semua') {
            $query->where('angkatan', $request->angkatan);
        }
        if ($request->kategori && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }
        if ($request->status && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        $data = $query->get()->map(fn ($m) => [
            'nim' => $m->nim,
            'nama' => $m->nama,
            'angkatan' => $m->angkatan,
            'kategori' => $m->kategori,
            'status' => $m->status,
            'ipk' => $m->ipk_terakhir,
            'semester' => $m->semester_aktif,
            'sp' => $m->sp_aktif ?? '-',
            'ipk_per_semester' => $m->ipkSemestrs->map(fn ($s) => [
                'sem' => $s->semester,
                'ipk' => $s->ipk !== null ? (float) $s->ipk : null,
            ]),
        ]);

        return response()->json(['success' => true, 'data' => $data, 'total' => $data->count()]);
    }

    /**
     * Preview rows untuk halaman Ekspor Laporan.
     */
    public function eksporPreview(Request $request): JsonResponse
    {
        $prodiId = $this->getProdiId($request);
        $query = Mahasiswa::with(['ipkSemestrs', 'dokumens.jenis', 'suratPeringatans'])
            ->where('prodi_id', $prodiId);

        if ($request->angkatan && $request->angkatan !== 'Semua') {
            $query->where('angkatan', $request->angkatan);
        }
        if ($request->kategori && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }
        if ($request->status && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        $rows = $query->orderBy('nim')->take(50)->get()->map(function ($m) {
            $ipk = $m->ipk_terakhir;
            $sem = $m->semester_aktif;
            $sp = $m->sp_aktif;
            $jenis = DokumenJenis::where('is_wajib', true)->count();
            $diset = $m->dokumens->where('status', 'Disetujui')
                ->whereIn('dokumen_jenis_id', DokumenJenis::where('is_wajib', true)->pluck('id'))
                ->unique('dokumen_jenis_id')->count();

            return [
                'nim' => $m->nim,
                'nama' => $m->nama,
                'angkatan' => (int) $m->angkatan,
                'kategori' => $m->kategori,
                'ipkTerakhir' => $ipk !== null ? (float) $ipk : null,
                'semester' => (int) $sem,
                'sp' => $sp ? (int) filter_var($sp, FILTER_SANITIZE_NUMBER_INT) : 0,
                'dokumenLengkap' => "{$diset}/{$jenis}",
            ];
        })->values();

        $ipkRows = $rows->pluck('ipkTerakhir')->filter(fn ($v) => $v !== null);
        $summary = [
            'totalMahasiswa' => $rows->count(),
            'rataIpk' => $ipkRows->count() > 0 ? round($ipkRows->avg(), 2) : null,
            'mahasiswaDenganSp' => $rows->where('sp', '>', 0)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $rows,
            'summary' => $summary,
        ]);
    }

    public function exportDownload(Request $request)
    {
        $prodiId = $this->getProdiId($request);

        $filters = [
            'angkatan' => $request->angkatan,
            'kategori' => $request->kategori,
            'tahun_akademik' => $request->tahun_akademik,
            'semester' => $request->semester,
            'sertakan_ipk' => filter_var($request->sertakan_ipk, FILTER_VALIDATE_BOOLEAN),
            'sertakan_dokumen' => filter_var($request->sertakan_dokumen, FILTER_VALIDATE_BOOLEAN),
            'sertakan_sp' => filter_var($request->sertakan_sp, FILTER_VALIDATE_BOOLEAN),
            'format' => $request->format ?? 'xlsx',
        ];

        return ExcelExportService::exportMahasiswaProdi($prodiId, $filters);
    }
}
