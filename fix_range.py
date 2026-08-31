import re

with open('app/Http/Controllers/Api/Admin/MahasiswaController.php', 'r', encoding='utf-8') as f:
    text = f.read()

# For Prestasi:
text = re.sub(r'public function rekapPrestasi(.*?)\\App\\Helpers\\TahunAjaranHelper::applyDateRangeFilter\(\$query, \'created_at\', \$tahunAjaran\)',
              r'public function rekapPrestasi\1\\App\\Helpers\\TahunAjaranHelper::applyDateRangeFilter($query, \'tanggal_mulai\', $tahunAjaran)', text, flags=re.DOTALL)

# For Organisasi:
text = re.sub(r'public function rekapOrganisasi(.*?)\\App\\Helpers\\TahunAjaranHelper::applyDateRangeFilter\(\$query, \'created_at\', \$tahunAjaran\)',
              r'public function rekapOrganisasi\1\\App\\Helpers\\TahunAjaranHelper::applyDateRangeFilter($query, \'periode_mulai\', $tahunAjaran)', text, flags=re.DOTALL)

# For Pelatihan:
text = re.sub(r'public function rekapPelatihan(.*?)\\App\\Helpers\\TahunAjaranHelper::applyDateRangeFilter\(\$query, \'created_at\', \$tahunAjaran\)',
              r'public function rekapPelatihan\1\\App\\Helpers\\TahunAjaranHelper::applyDateRangeFilter($query, \'tanggal_mulai\', $tahunAjaran)', text, flags=re.DOTALL)

with open('app/Http/Controllers/Api/Admin/MahasiswaController.php', 'w', encoding='utf-8') as f:
    f.write(text)

