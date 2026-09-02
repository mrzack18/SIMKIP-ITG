import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Mahasiswa\OrganisasiController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_index = """    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        if (!$m) return response()->json(['data' => []]);

        $data = $m->organisasis()->latest()->get();
        return response()->json([
            'data' => \App\Http\Resources\OrganisasiResource::collection($data)
        ]);
    }"""

new_index = """    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        if (!$m) return response()->json(['data' => []]);

        $query = $m->organisasis();
        \App\Helpers\TahunAjaranHelper::applyOverlapFilter($query, 'organisasis.periode_mulai', 'organisasis.periode_selesai', $request->tahun_ajaran);

        $data = $query->latest()->get();
        return response()->json([
            'data' => \App\Http\Resources\OrganisasiResource::collection($data)
        ]);
    }"""

content = content.replace(old_index, new_index)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated OrganisasiController index method")
