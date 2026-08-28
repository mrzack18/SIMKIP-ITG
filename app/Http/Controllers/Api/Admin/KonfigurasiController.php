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
            'tahun_akademik' => Konfigurasi::get('tahun_akademik_aktif'),
            'semester'       => Konfigurasi::get('semester_aktif'),
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
        return response()->json(['success' => true, 'data' => DokumenJenis::orderBy('urutan')->get()]);
    }

    public function storeDokumenJenis(Request $request): JsonResponse
    {
        $request->validate(['nama' => 'required|string|unique:dokumen_jenis,nama']);
        $max = DokumenJenis::max('urutan') ?? 0;
        $d = DokumenJenis::create(['nama' => $request->nama, 'is_wajib' => true, 'urutan' => $max + 1]);
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
        $d->update(['is_wajib' => ! $d->is_wajib]);
        return response()->json(['success' => true, 'is_wajib' => $d->is_wajib]);
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
                ],
                'signature' => [
                    'pengelola_nama' => $konfig['pengelola_nama'] ?? 'Encep Jianul Hayat, S.T., M.T.',
                    'pengelola_nip'  => $konfig['pengelola_nip'] ?? '197804202006041001',
                    'warek_nama'     => $konfig['warek_nama'] ?? 'Dr. Rina Kurniawati, S.E., M.Si.',
                    'warek_nip'      => $konfig['warek_nip'] ?? '198203252008012002',
                ],
                'regulasi' => [
                    ['id' => 1, 'nama' => 'IPK Minimum', 'deskripsi' => 'Batas minimum IPK yang harus dicapai mahasiswa KIP-K per semester', 'nilai' => $konfig['ipk_minimum'] ?? '3.00', 'tipe' => 'number', 'aktif' => true],
                    ['id' => 2, 'nama' => 'Masa Tenggang SP', 'deskripsi' => 'Jumlah hari yang diberikan kepada mahasiswa untuk memperbaiki pelanggaran setelah SP diterbitkan', 'nilai' => $konfig['masa_tenggang_sp'] ?? '90', 'tipe' => 'number', 'aktif' => true],
                    ['id' => 3, 'nama' => 'Batas Semester Studi', 'deskripsi' => 'Jumlah semester maksimum yang diperbolehkan untuk penerima KIP-K', 'nilai' => $konfig['max_semester'] ?? '8', 'tipe' => 'number', 'aktif' => true],
                    ['id' => 4, 'nama' => 'Minimum SKS per Semester', 'deskripsi' => 'Jumlah SKS minimum yang harus diambil mahasiswa per semester', 'nilai' => $konfig['sks_minimum_semester'] ?? '18', 'tipe' => 'number', 'aktif' => true],
                    ['id' => 5, 'nama' => 'Total SKS Kelulusan', 'deskripsi' => 'Total SKS minimum untuk syarat kelulusan', 'nilai' => $konfig['sks_minimum_lulus'] ?? '144', 'tipe' => 'number', 'aktif' => true],
                ],
                'nilai_mutu' => NilaiMutu::orderByDesc('poin')->get(),
                'jenis_pelanggaran' => JenisPelanggaran::all(),
                'periode_history' => PeriodeAkademik::orderByDesc('tanggal_buka')->get(),
                'prodis' => Prodi::all(),
                'dokumens' => DokumenJenis::orderBy('urutan')->get(),
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

    // --- Master Periode Akademik ---
    public function storePeriode(Request $request): JsonResponse
    {
        $request->validate(['tahun_akademik' => 'required|string', 'semester' => 'required|string', 'tanggal_buka' => 'required|date', 'tanggal_tutup' => 'required|date']);
        $p = PeriodeAkademik::create($request->all());
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
        PeriodeAkademik::query()->update(['is_aktif' => false]);
        $p->update(['is_aktif' => true]);

        // Sync compatibility for old konfigurasis keys used by other modules
        Konfigurasi::where('key', 'periode_input_aktif')->update(['value' => '1']);
        Konfigurasi::where('key', 'periode_input_buka')->update(['value' => $p->tanggal_buka->format('Y-m-d')]);
        Konfigurasi::where('key', 'periode_input_tutup')->update(['value' => $p->tanggal_tutup->format('Y-m-d')]);
        Konfigurasi::where('key', 'tahun_akademik_aktif')->update(['value' => $p->tahun_akademik]);
        Konfigurasi::where('key', 'semester_aktif')->update(['value' => $p->semester]);

        return response()->json(['success' => true, 'data' => $p]);
    }
}
