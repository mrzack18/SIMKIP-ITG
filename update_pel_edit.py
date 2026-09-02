import os
import re

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\Pelatihan.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add editing state and functions
states = """  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);

  const openEditForm = (item: PelatihanItem) => {
    setEditingId(item.id);
    setForm({
      jenis: item.jenis,
      nama: item.nama,
      penyelenggara: item.penyelenggara,
      tanggalMulai: item.tanggalMulai,
      tanggalSelesai: item.tanggalSelesai,
      tempat: item.tempat,
      deskripsi: item.deskripsi || "",
      sertifikat: null,
      fotoKegiatan: null
    });
    setFileLabel(item.sertifikat ? "File sertifikat sudah diunggah" : "Pilih file PDF / gambar");
    setFotoLabel(item.fotoKegiatan ? "Foto sudah diunggah" : "Pilih file gambar");
    setShowForm(true);
  };

  const handleResubmit = async (id: number) => {
    try {
      await api.put(`/pelatihan/${id}/resubmit`);
      fetchPelatihan();
    } catch (err: any) {
      alert(err.error?.message || err.message || "Gagal mengajukan ulang");
    }
  };"""
content = re.sub(r'  const \[form, setForm\] = useState\(\{ \.\.\.emptyForm \}\);', states, content)

# 2. Modify submit to handle PUT
handlesubmit = """      if (editingId) {
        formData.append("_method", "PUT");
        await api.post(`/pelatihan/${editingId}`, formData);
      } else {
        await api.post("/pelatihan", formData);
      }

      setForm({ ...emptyForm });
      setEditingId(null);"""
content = content.replace('await api.post("/pelatihan", formData);\n\n      setForm({ ...emptyForm });', handlesubmit)

# 3. Handle cancel
content = content.replace('onClick={() => {\n                setShowForm(false);\n                setForm({ ...emptyForm });\n              }}', 'onClick={() => {\n                setShowForm(false);\n                setForm({ ...emptyForm });\n                setEditingId(null);\n              }}')
content = content.replace('<h2>Tambah Pelatihan</h2>', '<h2>{editingId ? "Edit Pelatihan" : "Tambah Pelatihan"}</h2>')


# 4. Buttons for Edit/Resubmit in the list card
old_buttons = """                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                      <button onClick={() => setDetail(p)} className="flex-1 py-1.5 rounded-lg border border-[#E2E8F0] text-xs text-gray-600 hover:bg-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors font-500">
                        <Eye size={12} /> Detail
                      </button>
                    </div>"""

buttons = """                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                      <button onClick={() => setDetail(p)} className="flex-1 py-1.5 rounded-lg border border-[#E2E8F0] text-xs text-gray-600 hover:bg-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors font-500">
                        <Eye size={12} /> Detail
                      </button>
                    </div>
                    {p.status === "Ditolak" && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2">
                        <button
                          onClick={() => openEditForm(p)}
                          className="flex-1 py-1.5 rounded-lg border border-amber-300 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleResubmit(p.id)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white bg-[#263F93] hover:bg-[#1a2e6e] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Send size={12} /> Ajukan Ulang
                        </button>
                      </div>
                    )}"""
content = content.replace(old_buttons, buttons)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Pelatihan.tsx for edit and resubmit")
