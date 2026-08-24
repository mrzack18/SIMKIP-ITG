<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\DokumenJenis;
use App\Models\Konfigurasi;
use App\Models\Prodi;
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
            Konfigurasi::where('key', $key)->update(['value' => $value]);
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
}
