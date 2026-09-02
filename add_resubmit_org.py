import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Mahasiswa\OrganisasiController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

resubmit_code = """
    public function resubmit(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $o = \App\Models\Organisasi::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();

        if ($o->status !== 'Ditolak') {
            return response()->json(['message' => 'Hanya organisasi berstatus Ditolak yang dapat diajukan ulang.'], 422);
        }

        $o->update([
            'status'         => 'Menunggu', // matches schema enum
            'catatan_admin'  => null,
            'validated_by'   => null,
            'validated_at'   => null,
        ]);

        return response()->json(['message' => 'Organisasi berhasil diajukan ulang.', 'data' => new \App\Http\Resources\OrganisasiResource($o)]);
    }
"""

content = content.replace("}\n", resubmit_code + "}\n")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added resubmit to OrganisasiController")
