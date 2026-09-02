import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\Pelatihan.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove form.tahunAjaran from handleSubmit
content = content.replace('      formData.append("tahun_ajaran", form.tahunAjaran);\n', '')

# 2. Remove frontend filter
content = content.replace('{items.filter(item => (item.tahunAjaran || "2025/2026 Ganjil") === ta).map(item => (', '{items.map(item => (')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Pelatihan.tsx to remove frontend filter and undefined property")
