import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Mahasiswa\PelatihanController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

double_resubmit = """    public function resubmit(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = \App\Models\Pelatihan::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();

        if ($p->status !== 'Ditolak') {
            return response()->json(['message' => 'Hanya pelatihan berstatus Ditolak yang dapat diajukan ulang.'], 422);
        }

        $p->update([
            'status'         => 'Menunggu',
            'catatan_admin'  => null,
            'validated_by'   => null,
            'validated_at'   => null,
        ]);

        return response()->json(['message' => 'Pelatihan berhasil diajukan ulang.', 'data' => new \App\Http\Resources\PelatihanResource($p)]);
    }

    public function resubmit(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = \App\Models\Pelatihan::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();

        if ($p->status !== 'Ditolak') {
            return response()->json(['message' => 'Hanya pelatihan berstatus Ditolak yang dapat diajukan ulang.'], 422);
        }

        $p->update([
            'status'         => 'Menunggu',
            'catatan_admin'  => null,
            'validated_by'   => null,
            'validated_at'   => null,
        ]);

        return response()->json(['message' => 'Pelatihan berhasil diajukan ulang.', 'data' => new \App\Http\Resources\PelatihanResource($p)]);
    }"""

single_resubmit = """    public function resubmit(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = \App\Models\Pelatihan::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();

        if ($p->status !== 'Ditolak') {
            return response()->json(['message' => 'Hanya pelatihan berstatus Ditolak yang dapat diajukan ulang.'], 422);
        }

        $p->update([
            'status'         => 'Menunggu',
            'catatan_admin'  => null,
            'validated_by'   => null,
            'validated_at'   => null,
        ]);

        return response()->json(['message' => 'Pelatihan berhasil diajukan ulang.', 'data' => new \App\Http\Resources\PelatihanResource($p)]);
    }"""

content = content.replace(double_resubmit, single_resubmit)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed Api/Mahasiswa/PelatihanController")
