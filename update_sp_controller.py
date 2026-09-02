import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\SPController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_mahasiswa_index = """            "mahasiswa" => (function() use ($req) {
                $m = $req->user()->mahasiswa()->with(["suratPeringatans.mahasiswa.user", "suratPeringatans.mahasiswa.prodi"])->first();
                return response()->json(["success" => true, "data" => \App\Http\Resources\SuratPeringatanResource::collection($m->suratPeringatans)]);
            })(),"""

new_mahasiswa_index = """            "mahasiswa" => (function() use ($req) {
                $m = $req->user()->mahasiswa()->first();
                $query = $m->suratPeringatans()->with(["mahasiswa.user", "mahasiswa.prodi"]);
                \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($query, 'surat_peringatans.created_at', $req->tahun_ajaran);
                return response()->json(["success" => true, "data" => \App\Http\Resources\SuratPeringatanResource::collection($query->get())]);
            })(),"""

content = content.replace(old_mahasiswa_index, new_mahasiswa_index)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated SPController with DateMaxFilter for Mahasiswa")
