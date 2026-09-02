import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Admin\DokumenController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("applyDateRangeFilter($orgQuery, 'organisasis.periode_mulai', $request->tahun_ajaran)",
                          "applyOverlapFilter($orgQuery, 'organisasis.periode_mulai', 'organisasis.periode_selesai', $request->tahun_ajaran)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated DokumenController')
