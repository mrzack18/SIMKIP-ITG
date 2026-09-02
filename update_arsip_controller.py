import os

filepath = r'c:\laragon\www\SIMKIP-ITG\app\Http\Controllers\Api\Mahasiswa\ArsipController.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Add helper for max date filter
# For Prestasi
q_prestasi = "$prestasis = $m->prestasis()->where('status', 'Disetujui');\n        \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($prestasis, 'created_at', $request->tahun_ajaran);\n        $prestasis = $prestasis->get();"
content = content.replace("$prestasis = $m->prestasis()->where('status', 'Disetujui')->get();", q_prestasi)

# For Organisasi
q_organisasi = "$organisasis = $m->organisasis()->where('status', 'Disetujui');\n        \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($organisasis, 'created_at', $request->tahun_ajaran);\n        $organisasis = $organisasis->get();"
content = content.replace("$organisasis = $m->organisasis()->where('status', 'Disetujui')->get();", q_organisasi)

# For Pelatihan
q_pelatihan = "$pelatihans = $m->pelatihans()->where('status', 'Disetujui');\n        \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($pelatihans, 'created_at', $request->tahun_ajaran);\n        $pelatihans = $pelatihans->get();"
content = content.replace("$pelatihans = $m->pelatihans()->where('status', 'Disetujui')->get();", q_pelatihan)

# For Dokumen
q_dokumen = "$dokumens = $m->dokumens()->where('status', 'Disetujui')->with('jenis');\n        \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($dokumens, 'created_at', $request->tahun_ajaran);\n        $dokumens = $dokumens->get();"
content = content.replace("$dokumens = $m->dokumens()->where('status', 'Disetujui')->with('jenis')->get();", q_dokumen)

# For IPK
q_ipk = "$ipkSemesters = $m->ipkSemestrs();\n        \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($ipkSemesters, 'created_at', $request->tahun_ajaran);\n        $ipkSemesters = $ipkSemesters->get();"
content = content.replace("$ipkSemesters = $m->ipkSemestrs()->get();", q_ipk)

# For Bebas Tanggungan
q_bt = "$btQuery = $m->bebasTanggungan()->where('status', 'Disetujui');\n        \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($btQuery, 'created_at', $request->tahun_ajaran);\n        $bt = $btQuery->first();"
content = content.replace("$bt = $m->bebasTanggungan()->where('status', 'Disetujui')->first();", q_bt)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ArsipController to apply DateMaxFilter")
