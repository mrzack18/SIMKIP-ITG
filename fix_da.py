import re

with open('resources/js/pages/admin/DataAkademik.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add imports
text = text.replace('import { getKonfigurasiAll } from "@/services/konfigurasiService"',
                    'import { getKonfigurasiAll } from "@/services/konfigurasiService"\nimport { TahunAjaranFilter, getCurrentTahunAjaran } from "@/components/ui/TahunAjaranFilter"')

# 2. Add state
text = re.sub(r'(const \[prestasiData, setPrestasiData\] = useState<any\[\]>\(\[\]\))',
              r'const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran())\n  \1',
              text)

# 3. Add to API calls (there are 3 places where Promise.all is called)
text = re.sub(r'getRekapAkademik\(\)', r'getRekapAkademik(tahunAjaran)', text)
text = re.sub(r'getRekapPrestasi\(\)', r'getRekapPrestasi(tahunAjaran)', text)
text = re.sub(r'getRekapOrganisasi\(\)', r'getRekapOrganisasi(tahunAjaran)', text)
text = re.sub(r'getRekapPelatihan\(\)', r'getRekapPelatihan(tahunAjaran)', text)

# Also need to trigger fetch on tahunAjaran change!
# Wait, currently `useEffect` does NOT depend on `tahunAjaran`?
# Let's find the useEffect for fetchData.
text = re.sub(r'(\}\s*\}, \[\]\)\s*// Fetch data periodically or something)', r'  }, [tahunAjaran])', text)
# Wait, I'll just replace the dependency array `[]` of the main `useEffect` to `[tahunAjaran]`
# Let's do it safer.

text = text.replace('}, [])', '}, [tahunAjaran])')

# 4. Map `tanggal` for Prestasi
old_prestasi_set = r'setPrestasiData\(prestasi\.data \|\| \[\]\)'
new_prestasi_set = r'''setPrestasiData(
          (prestasi.data || []).map((p: any) => ({
            ...p,
            tanggal: p.tanggalMulai && p.tanggalSelesai
              ? `${p.tanggalMulai} - ${p.tanggalSelesai}`
              : p.tanggalMulai || "-",
          }))
        )'''
text = re.sub(old_prestasi_set, new_prestasi_set, text)

# Also fix the weird "???" separator in Organisasi and Pelatihan to "-"
text = text.replace('???', '-')

# 5. Add the TahunAjaranFilter dropdown to the UI header.
# We will inject it next to the h1 inside the header div.
old_header = r'''      \{\/\* Header \*\/\}
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">
          Data Akademik &amp; Non-Akademik Mahasiswa
        </h1>
        <p className="text-gray-500 text-sm mt-0\.5">
          Pantau IPK, nilai mata kuliah, prestasi, organisasi, dan pelatihan
        </p>
      </div>'''

new_header = r'''      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">
            Data Akademik &amp; Non-Akademik Mahasiswa
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Pantau IPK, nilai mata kuliah, prestasi, organisasi, dan pelatihan
          </p>
        </div>
        <TahunAjaranFilter value={tahunAjaran} onChange={(v) => { setTahunAjaran(v); }} />
      </div>'''

text = re.sub(old_header, new_header, text, flags=re.DOTALL)


with open('resources/js/pages/admin/DataAkademik.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

