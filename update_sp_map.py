import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\SPMahasiswa.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific mapping
old_map = """              {[formatTA(taFilter)].map((ta) => ("""

new_map = """              {Array.from(new Set(list.map(s => s.tahunAjaran || "2025/2026 Ganjil"))).map((ta) => ("""

content = content.replace(old_map, new_map)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated SPMahasiswa to map over unique TA")
