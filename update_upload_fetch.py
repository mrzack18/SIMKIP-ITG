import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\UploadDokumen.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_fetch = """  const fetchDokumen = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: Doc[] }>("/dokumen");
      setDocs(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat dokumen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumen();
  }, []);"""

new_fetch = """  const fetchDokumen = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: Doc[] }>(
        "/dokumen", 
        taFilter ? { tahun_ajaran: taFilter } : undefined
      );
      setDocs(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat dokumen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumen();
  }, [taFilter]);"""

content = content.replace(old_fetch, new_fetch)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated fetchDokumen in UploadDokumen.tsx")
