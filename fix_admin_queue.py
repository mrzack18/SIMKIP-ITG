import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Admin\DokumenController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    r"\App\Helpers\TahunAjaranHelper::applyDateRangeFilter($presQuery, 'prestasis.tanggal_mulai', $request->tahun_ajaran);",
    r"\App\Helpers\TahunAjaranHelper::applyDateRangeFilter($presQuery, 'prestasis.created_at', $request->tahun_ajaran);"
)

content = content.replace(
    r"\App\Helpers\TahunAjaranHelper::applyOverlapFilter($orgQuery, 'organisasis.periode_mulai', 'organisasis.periode_selesai', $request->tahun_ajaran);",
    r"\App\Helpers\TahunAjaranHelper::applyDateRangeFilter($orgQuery, 'organisasis.created_at', $request->tahun_ajaran);"
)

content = content.replace(
    r"\App\Helpers\TahunAjaranHelper::applyDateRangeFilter($pelQuery, 'pelatihans.tanggal_mulai', $request->tahun_ajaran);",
    r"\App\Helpers\TahunAjaranHelper::applyDateRangeFilter($pelQuery, 'pelatihans.created_at', $request->tahun_ajaran);"
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated DokumenController to use created_at")
