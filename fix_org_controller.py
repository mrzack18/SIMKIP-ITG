import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Mahasiswa\OrganisasiController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the last closing brace and insert the resubmit method right before it
last_brace_index = -1
for i in range(len(lines)-1, -1, -1):
    if lines[i].strip() == '}':
        last_brace_index = i
        break

resubmit_code = """
    public function resubmit(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $o = \App\Models\Organisasi::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();

        if ($o->status !== 'Ditolak') {
            return response()->json(['message' => 'Hanya organisasi berstatus Ditolak yang dapat diajukan ulang.'], 422);
        }

        $o->update([
            'status'         => 'Menunggu',
            'catatan_admin'  => null,
            'validated_by'   => null,
            'validated_at'   => null,
        ]);

        return response()->json(['message' => 'Organisasi berhasil diajukan ulang.', 'data' => new \App\Http\Resources\OrganisasiResource($o)]);
    }
"""

if last_brace_index != -1:
    lines.insert(last_brace_index, resubmit_code)
    
with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)
    
print("Fixed OrganisasiController.php")
