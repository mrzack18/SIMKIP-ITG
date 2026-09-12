<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\DokumenJenis;
use App\Models\Konfigurasi;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\NilaiMutu;
use App\Models\JenisPelanggaran;
use App\Models\PeriodeAkademik;
use App\Models\TahunAjaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KonfigurasiController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Konfigurasi::all()->keyBy('key')]);
    }

    /** Kunci yang boleh ditulis role admin — 5 ambang batas akademik. */
    private const ADMIN_WRITABLE_KEYS = [
        'ipk_minimum',
        'masa_tenggang_sp',
        'max_semester',
        'sks_minimum_semester',
        'sks_minimum_lulus',
    ];

    public function update(Request $request): JsonResponse
    {
        // lsipd tidak dibatasi. Role lain diperlakukan terbatas (fail-closed),
        // supaya menambah role baru ke middleware route tidak diam-diam
        // memberi akses tulis penuh atas konfigurasi global.
        if (! in_array($request->user()?->role, ['lsipd'], true)) {
            $terlarang = array_diff(array_keys($request->all()), self::ADMIN_WRITABLE_KEYS);

            if ($terlarang !== []) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin hanya boleh mengubah ambang batas akademik.',
                    'keys'    => array_values($terlarang),
                ], 403);
            }
        }

        foreach ($request->all() as $key => $value) {
            Konfigurasi::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'label' => $key, 'tipe' => 'text']
            );
        }
        return response()->json(['success' => true, 'message' => 'Konfigurasi disimpan.']);
    }

public function getPeriode(): JsonResponse
    {
        $taAktif = TahunAjaran::where('is_aktif', true)->first();

        return response()->json([
            'success' => true,
            'aktif'   => Konfigurasi::get('periode_input_aktif', '0') === '1',
            'buka'    => Konfigurasi::get('periode_input_buka'),
            'tutup'   => Konfigurasi::get('periode_input_tutup'),
            'tahun_ajaran' => Konfigurasi::get('periode_input_tahun_ajaran'),
            'tahun_akademik' => Konfigurasi::get('tahun_akademik_aktif'),
            'semester'       => Konfigurasi::get('semester_aktif'),
            'tahun_ajaran_options' => $this->buildTahunAjaranOptions(),
            'tahun_ajaran_aktif' => $taAktif
                ? "{$taAktif->tahun_akademik} {$taAktif->semester}"
                : null,
            'nilai_mutu'     => NilaiMutu::all()->keyBy(fn($n) => strtoupper($n->huruf))->map->poin,
        ]);
    }

    // --- Master Prodi ---
    public function indexProdi(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Prodi::all()]);
    }

    public function storeProdi(Request $request): JsonResponse
    {
        $request->validate(['kode' => 'required|unique:prodis,kode', 'nama' => 'required|string']);
        $p = Prodi::create(['kode' => strtoupper($request->kode), 'nama' => $request->nama]);
        return response()->json(['success' => true, 'data' => $p], 201);
    }

    public function updateProdi(Request $request, int $id): JsonResponse
    {
        $p = Prodi::findOrFail($id);
        $p->update($request->only(['nama']));
        return response()->json(['success' => true, 'data' => $p]);
    }

    public function toggleProdi(int $id): JsonResponse
    {
        $p = Prodi::findOrFail($id);
        $p->update(['is_aktif' => ! $p->is_aktif]);
        return response()->json(['success' => true, 'is_aktif' => $p->is_aktif]);
    }

    // --- Master Dokumen Jenis ---
    public function indexDokumenJenis(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => DokumenJenis::with('fields')->orderBy('urutan')->get()]);
    }

    public function storeDokumenJenis(Request $request): JsonResponse
    {
        $request->validate([
            'nama' => 'required|string|unique:dokumen_jenis,nama',
            'kode' => 'required|string|max:20',
            'deskripsi' => 'nullable|string',
        ]);
        $max = DokumenJenis::max('urutan') ?? 0;
        $d = DokumenJenis::create([
            'nama' => $request->nama,
            'kode' => strtoupper($request->kode),
            'deskripsi' => $request->deskripsi,
            'is_wajib' => true,
            'urutan' => $max + 1,
        ]);
        return response()->json(['success' => true, 'data' => $d], 201);
    }

    public function destroyDokumenJenis(int $id): JsonResponse
    {
        DokumenJenis::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Jenis dokumen dihapus.']);
    }

    public function toggleDokumenJenis(int $id): JsonResponse
    {
        $d = DokumenJenis::findOrFail($id);
        $d->update(['is_wajib' => !$d->is_wajib]);
        return response()->json(['success' => true]);
    }

    public function storeDokumenJenisField(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'label' => 'required|string',
            'tipe' => 'required|in:text,number,date,url,dropdown,checkbox',
            'opsi' => 'nullable|array',
            'is_required' => 'boolean'
        ]);

        $dok = DokumenJenis::findOrFail($id);
        $field = $dok->fields()->create($request->only(['label', 'tipe', 'opsi', 'is_required']));

        return response()->json(['success' => true, 'data' => $field]);
    }

    public function destroyDokumenJenisField(int $id): JsonResponse
    {
        \App\Models\DokumenJenisField::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Facade Endpoint ---
    public function indexAll(): JsonResponse
    {
        $konfig = Konfigurasi::all()->keyBy('key')->map->value;
        return response()->json([
            'success' => true,
            'data' => [
                'institusi' => [
                    'nama' => $konfig['nama_institusi'] ?? '',
                    'alamat' => $konfig['alamat_institusi'] ?? '',
                    'telp' => $konfig['telp_institusi'] ?? '',
                    'logo' => $konfig['logo_institusi'] ?? '',
                ],
                'signature' => [
                    'pengelola_nama' => $konfig['pengelola_nama'] ?? 'Encep Jianul Hayat, S.T., M.T.',
                    'pengelola_nip'  => $konfig['pengelola_nip'] ?? '197804202006041001',
                    'warek_nama'     => $konfig['warek_nama'] ?? 'Dr. Rina Kurniawati, S.E., M.Si.',
                    'warek_nip'      => $konfig['warek_nip'] ?? '198203252008012002',
                ],
                'aturan_akademik' => [
                    'ipk_minimum' => $konfig['ipk_minimum'] ?? '3.00',
                    // Ketiga key ini dulu hanya bisa ditulis, tidak pernah dibaca —
                    // akibatnya tab Regulasi selalu kembali ke konstanta setelah simpan.
                    'masa_tenggang_sp' => $konfig['masa_tenggang_sp'] ?? '90',
                    'max_semester' => $konfig['max_semester'] ?? '8',
                    'sks_minimum_semester' => $konfig['sks_minimum_semester'] ?? '18',
                    'sks_minimum_lulus' => $konfig['sks_minimum_lulus'] ?? '144',
                ],
                'periode_aktif' => [
                    'tahun_akademik' => $konfig['tahun_akademik_aktif'] ?? '',
                    'semester' => $konfig['semester_aktif'] ?? '',
                    'tahun_ajaran' => $konfig['periode_input_tahun_ajaran'] ?? '',
                    'buka' => $konfig['periode_input_buka'] ?? '',
                    'tutup' => $konfig['periode_input_tutup'] ?? '',
                    'is_aktif' => ($konfig['periode_input_aktif'] ?? '0') === '1',
                ],
                'nilai_mutu' => NilaiMutu::orderByDesc('poin')->get(),
                'jenis_pelanggaran' => JenisPelanggaran::all(),
                'periode_history' => PeriodeAkademik::orderByDesc('tanggal_buka')->get(),
'tahun_ajaran_options' => $this->buildTahunAjaranOptions(),
            'tahun_ajaran_aktif' => ($taAktifIndex = TahunAjaran::where('is_aktif', true)->first())
                ? $taAktifIndex->tahun_akademik . ' ' . $taAktifIndex->semester
                : null,
                'tahun_ajaran_list'    => TahunAjaran::orderByDesc('tahun_akademik')->orderByDesc('semester')->get(),
                'prodis' => Prodi::all(),
                'dokumens' => DokumenJenis::with('fields')->orderBy('urutan')->get(),
                // Dipakai tab Periode Input sebagai gambaran dampak periode yang aktif.
                'mahasiswa_count_aktif' => Mahasiswa::where('status', 'Aktif')->count(),
            ]
        ]);
    }

    // --- Master Nilai Mutu ---
    public function storeNilaiMutu(Request $request): JsonResponse
    {
        $request->validate(['min' => 'required|numeric', 'max' => 'required|numeric', 'huruf' => 'required|string', 'poin' => 'required|numeric', 'lulus' => 'required|boolean']);
        $n = NilaiMutu::create($request->all());
        return response()->json(['success' => true, 'data' => $n]);
    }
    public function updateNilaiMutu(Request $request, int $id): JsonResponse
    {
        $n = NilaiMutu::findOrFail($id);
        $n->update($request->all());
        return response()->json(['success' => true, 'data' => $n]);
    }
    public function destroyNilaiMutu(int $id): JsonResponse
    {
        NilaiMutu::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Master Jenis Pelanggaran ---
    public function storePelanggaran(Request $request): JsonResponse
    {
        $request->validate(['nama' => 'required|string|unique:jenis_pelanggarans,nama', 'eskalasi' => 'required|string']);
        $j = JenisPelanggaran::create($request->all());
        return response()->json(['success' => true, 'data' => $j]);
    }
    public function updatePelanggaran(Request $request, int $id): JsonResponse
    {
        $j = JenisPelanggaran::findOrFail($id);
        $j->update($request->all());
        return response()->json(['success' => true, 'data' => $j]);
    }
    public function destroyPelanggaran(int $id): JsonResponse
    {
        JenisPelanggaran::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function togglePelanggaran(int $id): JsonResponse
    {
        $j = JenisPelanggaran::findOrFail($id);
        $j->update(['aktif' => !$j->aktif]);
        return response()->json(['success' => true, 'data' => $j]);
    }

    public function indexPelanggaran(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => JenisPelanggaran::orderBy('nama')->get(),
        ]);
    }

    private function buildTahunAjaranOptions(): array
    {
        // Sumber utama: tabel tahun_ajarans (dikelola manual oleh admin mengikuti
        // kalender akademik kampus). Tidak lagi di-generate otomatis dari bulan.
        $options = [];
        // Format opsi: "2025/2026 Ganjil" / "2025/2026 Genap"
        foreach (TahunAjaran::orderByDesc('tahun_akademik')->orderByDesc('semester')->get() as $ta) {
            $options[] = "{$ta->tahun_akademik} {$ta->semester}";
        }
        // Deduplikasi & pertahankan urutan (terbaru duluan)
        return array_values(array_unique($options));
    }

    // --- Master Tahun Ajaran ---
    public function indexTahunAjaran(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => TahunAjaran::orderByDesc('tahun_akademik')->orderByDesc('semester')->get(),
        ]);
    }

    public function storeTahunAjaran(Request $request): JsonResponse
    {
        $data = $request->validate([
            'tahun_akademik' => 'required|string|max:20',
            'semester'       => 'required|in:Ganjil,Genap',
            'is_aktif'       => 'nullable|boolean',
        ]);

        $exists = TahunAjaran::where('tahun_akademik', $data['tahun_akademik'])
            ->where('semester', $data['semester'])
            ->exists();
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => "Tahun ajaran {$data['tahun_akademik']} {$data['semester']} sudah ada.",
            ], 422);
        }

        $isAktif = !empty($data['is_aktif']);
        if ($isAktif) {
            TahunAjaran::query()->update(['is_aktif' => false]);
            $this->syncTahunAjaranAktif($data['tahun_akademik'], $data['semester']);
        }

        $ta = TahunAjaran::create([
            'tahun_akademik' => $data['tahun_akademik'],
            'semester'       => $data['semester'],
            'is_aktif'       => $isAktif,
        ]);

        return response()->json(['success' => true, 'data' => $ta->fresh()], 201);
    }

    public function updateTahunAjaran(Request $request, int $id): JsonResponse
    {
        $ta = TahunAjaran::findOrFail($id);
        $data = $request->validate([
            'tahun_akademik' => 'required|string|max:20',
            'semester'       => 'required|in:Ganjil,Genap',
            'is_aktif'       => 'nullable|boolean',
        ]);

        $dup = TahunAjaran::where('id', '!=', $ta->id)
            ->where('tahun_akademik', $data['tahun_akademik'])
            ->where('semester', $data['semester'])
            ->exists();
        if ($dup) {
            return response()->json([
                'success' => false,
                'message' => "Tahun ajaran {$data['tahun_akademik']} {$data['semester']} sudah ada.",
            ], 422);
        }

        $isAktif = !empty($data['is_aktif']);
        if ($isAktif && !$ta->is_aktif) {
            TahunAjaran::where('id', '!=', $ta->id)->update(['is_aktif' => false]);
            $this->syncTahunAjaranAktif($data['tahun_akademik'], $data['semester']);
        } elseif (!$isAktif && $ta->is_aktif) {
            // TA aktif dinonaktifkan -> tidak ada lagi TA aktif, reset config
            // supaya tahun_akademik_aktif / semester_aktif tidak stale.
            $this->resetTahunAjaranAktif();
        }

        $ta->update([
            'tahun_akademik' => $data['tahun_akademik'],
            'semester'       => $data['semester'],
            'is_aktif'       => $isAktif,
        ]);

        return response()->json(['success' => true, 'data' => $ta->fresh()]);
    }

    public function destroyTahunAjaran(int $id): JsonResponse
    {
        $ta = TahunAjaran::findOrFail($id);

        if ($ta->is_aktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus tahun ajaran yang aktif. Nonaktifkan dulu.',
            ], 422);
        }

        $dipakaiPeriode = PeriodeAkademik::where('tahun_akademik', $ta->tahun_akademik)
            ->where('semester', $ta->semester)
            ->exists();
        if ($dipakaiPeriode) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran sudah dipakai periode input nilai dan tidak dapat dihapus.',
            ], 422);
        }

        $ta->delete();
        return response()->json(['success' => true, 'message' => 'Tahun ajaran dihapus.']);
    }

    public function activateTahunAjaran(int $id): JsonResponse
    {
        $ta = TahunAjaran::findOrFail($id);
        TahunAjaran::where('id', '!=', $ta->id)->update(['is_aktif' => false]);
        $ta->update(['is_aktif' => true]);
        $this->syncTahunAjaranAktif($ta->tahun_akademik, $ta->semester);
        return response()->json(['success' => true, 'data' => $ta->fresh()]);
    }

    public function deactivateTahunAjaran(int $id): JsonResponse
    {
        $ta = TahunAjaran::findOrFail($id);
        if (!$ta->is_aktif) {
            return response()->json(['success' => true, 'data' => $ta->fresh()]);
        }
        $ta->update(['is_aktif' => false]);
        $this->resetTahunAjaranAktif();
        return response()->json(['success' => true, 'data' => $ta->fresh()]);
    }

    /**
     * Hapus status "tahun ajaran aktif" dari konfigurasi. Dipanggil saat TA
     * aktif dinonaktifkan / "status tahun ajaran" dihapus, supaya key
     * tahun_akademik_aktif & semester_aktif tidak menunjuk ke TA yang sudah nonaktif.
     */
    private function resetTahunAjaranAktif(): void
    {
        foreach (['tahun_akademik_aktif', 'semester_aktif'] as $key) {
            Konfigurasi::where('key', $key)->update(['value' => null]);
        }
    }

    private function syncTahunAjaranAktif(string $tahunAkademik, string $semester): void
    {
        Konfigurasi::updateOrCreate(
            ['key' => 'tahun_akademik_aktif'],
            ['value' => $tahunAkademik, 'label' => 'Tahun Akademik Aktif', 'tipe' => 'text']
        );
        Konfigurasi::updateOrCreate(
            ['key' => 'semester_aktif'],
            ['value' => $semester, 'label' => 'Semester Aktif', 'tipe' => 'text']
        );
    }

    // --- Master Periode Akademik ---
    public function indexPeriode(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => PeriodeAkademik::orderByDesc('tanggal_buka')->get(),
        ]);
    }

    public function storePeriode(Request $request): JsonResponse
    {
        $request->validate(['tahun_akademik' => 'required|string', 'semester' => 'required|string', 'tanggal_buka' => 'required|date', 'tanggal_tutup' => 'required|date']);

        // Tahun ajaran harus dibuat manual dulu di "Master Tahun Ajaran"
        $taAda = TahunAjaran::where('tahun_akademik', $request->tahun_akademik)
            ->where('semester', $request->semester)
            ->exists();
        if (!$taAda) {
            return response()->json([
                'success' => false,
                'message' => "Tahun ajaran {$request->tahun_akademik} {$request->semester} belum dibuat. Buat dulu di Master Tahun Ajaran.",
            ], 422);
        }

        $p = PeriodeAkademik::updateOrCreate(
            ['tahun_akademik' => $request->tahun_akademik, 'semester' => $request->semester],
            ['tanggal_buka' => $request->tanggal_buka, 'tanggal_tutup' => $request->tanggal_tutup]
        );
        return response()->json(['success' => true, 'data' => $p]);
    }

    public function updatePeriode(Request $request, int $id): JsonResponse
    {
        $p = PeriodeAkademik::findOrFail($id);
        $p->update($request->all());
        return response()->json(['success' => true, 'data' => $p]);
    }
    public function destroyPeriode(int $id): JsonResponse
    {
        PeriodeAkademik::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
    public function activatePeriode(int $id): JsonResponse
    {
        $p = PeriodeAkademik::findOrFail($id);
        $p->update(['is_aktif' => true]);
        // Sync ke konfigurasi keys dilakukan otomatis oleh PeriodeAkademikObserver::saved
        return response()->json(['success' => true, 'data' => $p->fresh()]);
    }

    // --- Upload Logo Institusi ---
    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate(['logo' => 'required|image|mimes:png,jpg,jpeg,gif,svg|max:2048']);
        $path = $request->file('logo')->store('logos', 'public');
        Konfigurasi::updateOrCreate(
            ['key' => 'logo_institusi'],
            ['value' => '/storage/'.$path, 'label' => 'logo_institusi', 'tipe' => 'text']
        );
        return response()->json(['success' => true, 'url' => '/storage/'.$path]);
    }
}
