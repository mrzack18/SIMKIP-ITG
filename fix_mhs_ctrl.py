import re

with open('app/Http/Controllers/Api/Admin/MahasiswaController.php', 'r', encoding='utf-8') as f:
    text = f.read()

new_methods = """
    public function getCatatanInternal(Request $request, int $id): JsonResponse
    {
        $tahunAjaran = $request->query('tahun_ajaran');
        $query = \App\Models\CatatanInternal::where('mahasiswa_id', $id);
        
        if ($tahunAjaran) {
            $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);
            $query->where('tahun_ajaran', $tahunAjaran);
        }
        
        $catatan = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $catatan]);
    }

    public function storeCatatanInternal(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'kategori' => 'required|string',
            'deskripsi' => 'required|string',
        ]);

        $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $request->tahun_ajaran);

        $catatan = \App\Models\CatatanInternal::create([
            'mahasiswa_id' => $id,
            'tahun_ajaran' => $tahunAjaran,
            'kategori' => $request->kategori,
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json(['success' => true, 'data' => $catatan]);
    }
"""

text = re.sub(
    r'(public function rekapAkademik)',
    new_methods + r'\n    \1',
    text
)

with open('app/Http/Controllers/Api/Admin/MahasiswaController.php', 'w', encoding='utf-8') as f:
    f.write(text)
