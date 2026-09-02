import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\ArsipDigital.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add dependency and param to useEffect
old_effect = """  useEffect(() => {
    api.get<any>("/arsip")
      .then(res => {
        setData(res.data || []);
      })
      .catch(err => {
        console.error("Gagal memuat arsip", err);
        setError("Gagal memuat data arsip. Silakan coba lagi.");
      })
      .finally(() => setLoading(false));
  }, []);"""

new_effect = """  const fetchArsip = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: any[] }>(
        "/arsip",
        filterTahunAjaran ? { tahun_ajaran: filterTahunAjaran } : undefined
      );
      setData(res.data || []);
    } catch (err: any) {
      console.error("Gagal memuat arsip", err);
      setError("Gagal memuat data arsip. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArsip();
  }, [filterTahunAjaran]);"""

content = content.replace(old_effect, new_effect)

# 2. Remove matchTa frontend filter
old_filtered = """  const filtered = data.filter(f => {
    const matchSearch = f.nama.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Semua" || f.kategori === filterCat;
    const matchTa = (f.tahunAjaran || "2025/2026 Ganjil") === formatTA(filterTahunAjaran);
    return matchSearch && matchCat && matchTa;
  });"""

new_filtered = """  const filtered = data.filter(f => {
    const matchSearch = f.nama.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Semua" || f.kategori === filterCat;
    return matchSearch && matchCat;
  });"""

content = content.replace(old_filtered, new_filtered)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ArsipDigital frontend to use API query and Time Machine concept")
