import os

# Facade
filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\PelatihanController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()
last_brace_index = -1
for i in range(len(lines)-1, -1, -1):
    if lines[i].strip() == '}':
        last_brace_index = i
        break
resubmit_code = """
    public function resubmit(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsPelatihan::class)->resubmit($req, $id);
        abort(403);
    }
"""
if last_brace_index != -1:
    lines.insert(last_brace_index, resubmit_code)
with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)

# Mahasiswa Controller
filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Mahasiswa\PelatihanController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()
last_brace_index = -1
for i in range(len(lines)-1, -1, -1):
    if lines[i].strip() == '}':
        last_brace_index = i
        break
resubmit_code = """
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
    }
"""
if last_brace_index != -1:
    lines.insert(last_brace_index, resubmit_code)
with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Updated both PelatihanControllers")
