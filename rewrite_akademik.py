import re

with open('resources/js/pages/admin/DataAkademik.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix 1: SP rendering
old_sp = r'{r\.sp \? \(.*?\) : \(\s*<span className="text-xs text-gray-400">.*?</span>\s*\)}'
new_sp = r'''{r.spList ? (
                              r.spList.map((sp: any, idx: number) => {
                                const isActive = sp.status === 'Aktif';
                                let colorClass = 'bg-gray-100 text-gray-500'; // inactive
                                if (isActive) {
                                  if (sp.level === 'SP1') colorClass = 'bg-orange-100 text-orange-700';
                                  else if (sp.level === 'SP2') colorClass = 'bg-red-100 text-red-700';
                                  else if (sp.level === 'SP3') colorClass = 'bg-red-900 text-red-100';
                                }
                                return (
                                  <span
                                    key={idx}
                                    className={`px-1.5 py-0.5 rounded text-xs font-600 ${colorClass}`}
                                    title={isActive ? 'Aktif' : 'Tidak Aktif (Kadaluarsa)'}
                                  >
                                    {sp.level}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}'''
text = re.sub(old_sp, new_sp, text, flags=re.DOTALL)

# Fix 2: Konfigurasi periode input
old_konf = r'const periode = res\?\.data\?\.periode_history\?\.find\(\(p: any\) => p\.is_aktif\);\s*if \(periode\) \{\s*const buka = new Date\(periode\.tanggal_buka\)\.toLocaleDateString\("id-ID", \{ day: "numeric", month: "short", year: "numeric" \}\);\s*const tutup = new Date\(periode\.tanggal_tutup\)\.toLocaleDateString\("id-ID", \{ day: "numeric", month: "short", year: "numeric" \}\);\s*setPeriodeAktifRange\(`\$\{buka\}.*?\$\{tutup\}`\);\s*\}'
new_konf = r'''if (res?.data) {
          const config = res.data;
          const bukaStr = config.periode_input_buka?.value;
          const tutupStr = config.periode_input_tutup?.value;
          if (bukaStr && tutupStr) {
             const buka = new Date(bukaStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
             const tutup = new Date(tutupStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
             setPeriodeAktifRange(`${buka} - ${tutup}`);
          }
        }'''
text = re.sub(old_konf, new_konf, text, flags=re.DOTALL)

# Fix 3: Labels ("Semua" -> "Semua Prodi", dll)
text = text.replace('useState<string[]>(["Semua"])', 'useState<string[]>([])')
text = text.replace('useState("Semua")', 'useState("")')
text = text.replace('setProdiFilter("Semua")', 'setProdiFilter("Semua Prodi")')
text = text.replace('setAngkatanFilter("Semua")', 'setAngkatanFilter("Semua Angkatan")')
text = text.replace('setSpFilter("Semua")', 'setSpFilter("Semua SP")')
text = text.replace('setKipkFilter("Semua")', 'setKipkFilter("Semua Kategori")')
text = text.replace('setIpkFilter("Semua")', 'setIpkFilter("Semua IPK")')

text = text.replace('setPProdi("Semua")', 'setPProdi("Semua Prodi")')
text = text.replace('setPAngkatan("Semua")', 'setPAngkatan("Semua Angkatan")')
text = text.replace('setPKipk("Semua")', 'setPKipk("Semua Kategori")')
text = text.replace('setPTingkat("Semua")', 'setPTingkat("Semua Tingkat")')
text = text.replace('setPStatus("Semua")', 'setPStatus("Semua Status")')

text = text.replace('setOProdi("Semua")', 'setOProdi("Semua Prodi")')
text = text.replace('setOAngkatan("Semua")', 'setOAngkatan("Semua Angkatan")')
text = text.replace('setOKipk("Semua")', 'setOKipk("Semua Kategori")')
text = text.replace('setOStatus("Semua")', 'setOStatus("Semua Status")')

text = text.replace('setPelProdi("Semua")', 'setPelProdi("Semua Prodi")')
text = text.replace('setPelAngkatan("Semua")', 'setPelAngkatan("Semua Angkatan")')
text = text.replace('setPelKipk("Semua")', 'setPelKipk("Semua Kategori")')
text = text.replace('setPelStatus("Semua")', 'setPelStatus("Semua Status")')

text = re.sub(r'const \[prodiFilter, setProdiFilter\] = useState\(""\)', 'const [prodiFilter, setProdiFilter] = useState("Semua Prodi")', text)
text = re.sub(r'const \[angkatanFilter, setAngkatanFilter\] = useState\(""\)', 'const [angkatanFilter, setAngkatanFilter] = useState("Semua Angkatan")', text)
text = re.sub(r'const \[spFilter, setSpFilter\] = useState\(""\)', 'const [spFilter, setSpFilter] = useState("Semua SP")', text)
text = re.sub(r'const \[kipkFilter, setKipkFilter\] = useState\(""\)', 'const [kipkFilter, setKipkFilter] = useState("Semua Kategori")', text)
text = re.sub(r'const \[ipkFilter, setIpkFilter\] = useState\(""\)', 'const [ipkFilter, setIpkFilter] = useState("Semua IPK")', text)

text = re.sub(r'const \[pProdi, setPProdi\] = useState\(""\)', 'const [pProdi, setPProdi] = useState("Semua Prodi")', text)
text = re.sub(r'const \[pAngkatan, setPAngkatan\] = useState\(""\)', 'const [pAngkatan, setPAngkatan] = useState("Semua Angkatan")', text)
text = re.sub(r'const \[pKipk, setPKipk\] = useState\(""\)', 'const [pKipk, setPKipk] = useState("Semua Kategori")', text)
text = re.sub(r'const \[pTingkat, setPTingkat\] = useState\(""\)', 'const [pTingkat, setPTingkat] = useState("Semua Tingkat")', text)
text = re.sub(r'const \[pStatus, setPStatus\] = useState\(""\)', 'const [pStatus, setPStatus] = useState("Semua Status")', text)

text = re.sub(r'const \[oProdi, setOProdi\] = useState\(""\)', 'const [oProdi, setOProdi] = useState("Semua Prodi")', text)
text = re.sub(r'const \[oAngkatan, setOAngkatan\] = useState\(""\)', 'const [oAngkatan, setOAngkatan] = useState("Semua Angkatan")', text)
text = re.sub(r'const \[oKipk, setOKipk\] = useState\(""\)', 'const [oKipk, setOKipk] = useState("Semua Kategori")', text)
text = re.sub(r'const \[oStatus, setOStatus\] = useState\(""\)', 'const [oStatus, setOStatus] = useState("Semua Status")', text)

text = re.sub(r'const \[pelProdi, setPelProdi\] = useState\(""\)', 'const [pelProdi, setPelProdi] = useState("Semua Prodi")', text)
text = re.sub(r'const \[pelAngkatan, setPelAngkatan\] = useState\(""\)', 'const [pelAngkatan, setPelAngkatan] = useState("Semua Angkatan")', text)
text = re.sub(r'const \[pelKipk, setPelKipk\] = useState\(""\)', 'const [pelKipk, setPelKipk] = useState("Semua Kategori")', text)
text = re.sub(r'const \[pelStatus, setPelStatus\] = useState\(""\)', 'const [pelStatus, setPelStatus] = useState("Semua Status")', text)

text = re.sub(r'const \[prodiOptions, setProdiOptions\] = useState<string\[\]>\(\[\]\)', 'const [prodiOptions, setProdiOptions] = useState<string[]>(["Semua Prodi"])', text)
text = re.sub(r'const \[angkatanOptions, setAngkatanOptions\] = useState<string\[\]>\(\[\]\)', 'const [angkatanOptions, setAngkatanOptions] = useState<string[]>(["Semua Angkatan"])', text)

text = text.replace('setProdiOptions(["Semua",', 'setProdiOptions(["Semua Prodi",')
text = text.replace('setAngkatanOptions(["Semua",', 'setAngkatanOptions(["Semua Angkatan",')

text = text.replace('prodiFilter === "Semua"', 'prodiFilter === "Semua Prodi"')
text = text.replace('angkatanFilter === "Semua"', 'angkatanFilter === "Semua Angkatan"')
text = text.replace('spFilter === "Semua"', 'spFilter === "Semua SP"')
text = text.replace('kipkFilter === "Semua"', 'kipkFilter === "Semua Kategori"')
text = text.replace('ipkFilter === "Semua"', 'ipkFilter === "Semua IPK"')

text = text.replace('pProdi === "Semua"', 'pProdi === "Semua Prodi"')
text = text.replace('pAngkatan === "Semua"', 'pAngkatan === "Semua Angkatan"')
text = text.replace('pKipk === "Semua"', 'pKipk === "Semua Kategori"')
text = text.replace('pTingkat === "Semua"', 'pTingkat === "Semua Tingkat"')
text = text.replace('pStatus === "Semua"', 'pStatus === "Semua Status"')

text = text.replace('oProdi === "Semua"', 'oProdi === "Semua Prodi"')
text = text.replace('oAngkatan === "Semua"', 'oAngkatan === "Semua Angkatan"')
text = text.replace('oKipk === "Semua"', 'oKipk === "Semua Kategori"')
text = text.replace('oStatus === "Semua"', 'oStatus === "Semua Status"')

text = text.replace('pelProdi === "Semua"', 'pelProdi === "Semua Prodi"')
text = text.replace('pelAngkatan === "Semua"', 'pelAngkatan === "Semua Angkatan"')
text = text.replace('pelKipk === "Semua"', 'pelKipk === "Semua Kategori"')
text = text.replace('pelStatus === "Semua"', 'pelStatus === "Semua Status"')

text = text.replace('options={["Semua", "Tanpa SP", "SP1", "SP2", "SP3"]}', 'options={["Semua SP", "Tanpa SP", "SP1", "SP2", "SP3"]}')
text = text.replace('["Semua", "KIP-K Reguler", "KIP-K Aspirasi"]', '["Semua Kategori", "KIP-K Reguler", "KIP-K Aspirasi"]')
text = re.sub(r'options=\{\[\s*"Semua",\s*"Di Bawah Standar \(< 3\.0\)",\s*"Di Atas Standar \([^)]+\)",\s*\]\}', 'options={["Semua IPK", "Di Bawah Standar (< 3.0)", "Di Atas Standar (≥ 3.0)"]}', text)
text = text.replace('options={["Semua", "Internasional", "Nasional", "Wilayah"]}', 'options={["Semua Tingkat", "Internasional", "Nasional", "Wilayah"]}')
text = text.replace('options={["Semua", "Disetujui", "Menunggu", "Ditolak"]}', 'options={["Semua Status", "Disetujui", "Menunggu", "Ditolak"]}')


with open('resources/js/pages/admin/DataAkademik.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
