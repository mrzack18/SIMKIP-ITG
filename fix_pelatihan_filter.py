import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Mahasiswa\PelatihanController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_index = """    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        if (!$m) return response()->json(['data' => []]);

        $query = $m->pelatihans()->latest();
        if ($request->jenis && $request->jenis !== 'Semua') $query->where('jenis', $request->jenis);
        
        $data = $query->get();
        return response()->json([
            'data' => \App\Http\Resources\PelatihanResource::collection($data)
        ]);
    }"""

new_index = """    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        if (!$m) return response()->json(['data' => []]);

        $query = $m->pelatihans()->latest();
        \App\Helpers\TahunAjaranHelper::applyDateRangeFilter($query, 'tanggal_mulai', $request->tahun_ajaran);
        if ($request->jenis && $request->jenis !== 'Semua') $query->where('jenis', $request->jenis);
        
        $data = $query->get();
        return response()->json([
            'data' => \App\Http\Resources\PelatihanResource::collection($data)
        ]);
    }"""

content = content.replace(old_index, new_index)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated PelatihanController index method")
