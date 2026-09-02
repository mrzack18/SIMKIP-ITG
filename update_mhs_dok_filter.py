import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Mahasiswa\DokumenController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_index = """    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        
        $jenis = DokumenJenis::with(['fields', 'dokumens' => function ($q) use ($m) {
            $q->where('mahasiswa_id', $m->id)->latest();
        }])->orderBy('urutan')->get();

        return response()->json([
            'success' => true,
            'data'    => \App\Http\Resources\DokumenJenisResource::collection($jenis),
        ]);
    }"""

new_index = """    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        
        $jenis = DokumenJenis::with(['fields', 'dokumens' => function ($q) use ($m, $request) {
            $q->where('mahasiswa_id', $m->id);
            if ($request->tahun_ajaran) {
                \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($q, 'created_at', $request->tahun_ajaran);
            }
            $q->latest();
        }])->orderBy('urutan')->get();

        return response()->json([
            'success' => true,
            'data'    => \App\Http\Resources\DokumenJenisResource::collection($jenis),
        ]);
    }"""

content = content.replace(old_index, new_index)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Mahasiswa/DokumenController index method")
