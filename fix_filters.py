import re

with open('resources/js/pages/admin/DataAkademik.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace initializations
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


# Also fixing the state defaults where they were missing
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

# Set values in mapping
text = text.replace('setProdiOptions(["Semua",', 'setProdiOptions(["Semua Prodi",')
text = text.replace('setAngkatanOptions(["Semua",', 'setAngkatanOptions(["Semua Angkatan",')

# Fix logic match
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

# Fix options passing
text = text.replace('options={["Semua", "Tanpa SP", "SP1", "SP2", "SP3"]}', 'options={["Semua SP", "Tanpa SP", "SP1", "SP2", "SP3"]}')
text = text.replace('["Semua", "KIP-K Reguler", "KIP-K Aspirasi"]', '["Semua Kategori", "KIP-K Reguler", "KIP-K Aspirasi"]')
text = text.replace('options={["Semua", "Di Bawah Standar (< 3.0)", "Di Atas Standar (≥ 3.0)"]}', 'options={["Semua IPK", "Di Bawah Standar (< 3.0)", "Di Atas Standar (≥ 3.0)"]}')
text = text.replace('options={["Semua", "Internasional", "Nasional", "Wilayah"]}', 'options={["Semua Tingkat", "Internasional", "Nasional", "Wilayah"]}')
text = text.replace('options={["Semua", "Disetujui", "Menunggu", "Ditolak"]}', 'options={["Semua Status", "Disetujui", "Menunggu", "Ditolak"]}')


with open('resources/js/pages/admin/DataAkademik.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Filters updated successfully!")
