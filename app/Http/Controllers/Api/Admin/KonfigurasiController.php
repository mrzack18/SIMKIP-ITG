<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\DokumenJenis;
use App\Models\Konfigurasi;
use App\Models\Prodi;
use App\Models\NilaiMutu;
use App\Models\JenisPelanggaran;
use App\Models\PeriodeAkademik;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KonfigurasiController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Konfigurasi::all()->keyBy('key')]);
    }

    public function update(Request $request): JsonResponse
    {
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
        return response()->json([
            'success' => true,
            'aktif'   => Konfigurasi::get('periode_input_aktif', '0') === '1',
            'buka'    => Konfigurasi::get('periode_input_buka'),
            'tutup'   => Konfigurasi::get('periode_input_tutup'),
            'tahun_ajaran' => Konfigurasi::get('periode_input_tahun_ajaran'),
            'tahun_akademik' => Konfigurasi::get('tahun_akademik_aktif'),
            'semester'       => Konfigurasi::get('semester_aktif'),
            'tahun_ajaran_options' => $this->buildTahunAjaranOptions(),
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
                'prodis' => Prodi::all(),
                'dokumens' => DokumenJenis::with('fields')->orderBy('urutan')->get(),
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

    // --- Master Periode Akademik ---
    public function indexPeriode(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => PeriodeAkademik::orderByDesc('tanggal_buka')->get(),
        ]);
    }

    private function buildTahunAjaranOptions(): array
    {
        // Generate 5 tahun ajaran: 3 sebelum, current, 1 setelah
        $aktif = Konfigurasi::get('tahun_akademik_aktif', '2025/2026');
        $options = [];
        if (preg_match('/^(\d{4})\/(\d{4})$/', $aktif, $m)) {
            $startYear = (int) $m[1];
            for ($y = $startYear - 3; $y <= $startYear + 1; $y++) {
                $y2 = $y + 1;
                $options[] = "$y/$y2 Ganjil";
                $options[] = "$y/$y2 Genap";
            }
        }
        return $options;
    }

    public function storePeriode(Request $request): JsonResponse
    {
        $request->validate(['tahun_akademik' => 'required|string', 'semester' => 'required|string', 'tanggal_buka' => 'required|date', 'tanggal_tutup' => 'required|date']);
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
