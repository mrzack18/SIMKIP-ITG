import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\Profil.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove TahunAjaranFilter import (since we remove it from MahasiswaProfil)
content = content.replace(
    'import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";\n',
    ''
)

# 2. Remove taFilter state in MahasiswaProfil
content = content.replace(
    '  const [taFilter, setTaFilter] = useState(getCurrentTahunAjaran());\n\n',
    ''
)

# 3. Remove the header section with TahunAjaranFilter in MahasiswaProfil
old_header = """      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Profil Saya</h1>
          <p className="text-gray-500 text-sm mt-0.5">Informasi akun dan pengaturan keamanan</p>
        </div>
        <div>
          <TahunAjaranFilter value={taFilter} onChange={setTaFilter} />
        </div>
      </div>"""

new_header = """      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Profil Saya</h1>
        <p className="text-gray-500 text-sm mt-0.5">Informasi akun dan pengaturan keamanan</p>
      </div>"""

content = content.replace(old_header, new_header)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed TahunAjaranFilter from Profil.tsx")
