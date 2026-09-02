import os
import re

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\Organisasi.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
if 'downloadFile' not in content:
    content = content.replace('import { api }', 'import { api }\nimport { downloadFile } from "@/utils/fileUrl";')

if 'Pencil' not in content:
    content = content.replace('import { Plus, X', 'import { Plus, X, Pencil, Send')

# 2. Add Editing states and handleResubmit
states = """  const [form, setForm] = useState({ jenis: "Organisasi" as "Organisasi" | "Kepanitiaan" | "Kegiatan", nama: "", jabatan: "", mulai: "", selesai: "", deskripsi: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const openEditForm = (org: Org) => {
    setEditingId(org.id);
    setForm({
      jenis: org.jenis,
      nama: org.nama,
      jabatan: org.jabatan,
      mulai: org.mulai,
      selesai: org.selesai,
      deskripsi: org.deskripsi || ""
    });
    setFileName(org.fileSk ? "File SK sudah diunggah" : "");
    setFotoName(org.fotoKegiatan ? "Foto sudah diunggah" : "");
    setOpen(true);
  };

  const handleResubmit = async (id: number) => {
    try {
      await api.put(`/organisasi/${id}/resubmit`);
      fetchOrganisasi();
    } catch (err: any) {
      alert(err.error?.message || err.message || "Gagal mengajukan ulang");
    }
  };"""
content = re.sub(r'const \[form, setForm\] = useState\([^)]+\);', states, content)

# 3. Modify handleSubmit
handlesubmit = """      if (editingId) {
        formData.append("_method", "PUT");
        await api.post(`/organisasi/${editingId}`, formData);
      } else {
        await api.post("/organisasi", formData);
      }

      setForm({ jenis: "Organisasi", nama: "", jabatan: "", mulai: "", selesai: "", deskripsi: "" });
      setEditingId(null);"""
content = content.replace('await api.post("/organisasi", formData);\n\n      setForm({ jenis: "Organisasi", nama: "", jabatan: "", mulai: "", selesai: "", deskripsi: "" });', handlesubmit)

# 4. Modify setOpen(false) calls in Cancel buttons to also clear editingId
content = content.replace('onClick={() => setOpen(false)}', 'onClick={() => { setOpen(false); setEditingId(null); setForm({ jenis: "Organisasi", nama: "", jabatan: "", mulai: "", selesai: "", deskripsi: "" }); }}')
content = content.replace('<h2>Tambah Data</h2>', '<h2>{editingId ? "Edit Data" : "Tambah Data"}</h2>')
content = content.replace('h2 className="font-display font-700 text-gray-800">Tambah Data</h2>', 'h2 className="font-display font-700 text-gray-800">{editingId ? "Edit Data" : "Tambah Data"}</h2>')


# 5. Buttons for Edit/Resubmit in the list card
buttons = """                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => setDetail(org)}
                        className="flex-1 py-1.5 rounded-lg border border-[#E2E8F0] text-xs text-gray-600 hover:bg-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors font-500"
                      >
                        <Eye size={12} /> Detail
                      </button>
                    </div>
                    {org.status === "Ditolak" && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2">
                        <button
                          onClick={() => openEditForm(org)}
                          className="flex-1 py-1.5 rounded-lg border border-amber-300 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleResubmit(org.id)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white bg-[#263F93] hover:bg-[#1a2e6e] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Send size={12} /> Ajukan Ulang
                        </button>
                      </div>
                    )}"""

old_buttons = """                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => setDetail(org)}
                        className="flex-1 py-1.5 rounded-lg border border-[#E2E8F0] text-xs text-gray-600 hover:bg-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors font-500"
                      >
                        <Eye size={12} /> Detail
                      </button>
                      <button
                        onClick={() => setSkOrg(org)}
                        disabled={!org.fileSk}
                        className={`flex-1 py-1.5 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-colors font-500 ${
                          org.fileSk 
                            ? "border-[#263F93]/30 bg-[#263F93]/5 text-[#263F93] hover:bg-[#263F93]/10" 
                            : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FileText size={12} /> {org.fileSk ? "Pratinjau SK" : "SK Belum Ada"}
                      </button>
                    </div>"""

content = content.replace(old_buttons, buttons)

# 6. Detail modal proof section
new_modal_docs = """              <div>
                <p className="text-xs text-gray-400 mb-2">Bukti Dokumen</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Sertifikat / SK Pengurus</p>
                    {detail.fileSk ? (
                      <div className="rounded-xl border border-gray-200 overflow-hidden">
                        {detail.fileSk.toLowerCase().endsWith(".pdf") ? (
                          <iframe src={detail.fileSk} className="w-full h-40 border-0" title="SK Pengurus" />
                        ) : (
                          <img src={detail.fileSk} alt="SK Pengurus" className="w-full h-40 object-cover" />
                        )}
                        <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                          <a href={detail.fileSk} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                            <Eye size={12} /> Pratinjau
                          </a>
                          <a href="#" onClick={(e) => { e.preventDefault(); downloadFile("organisasi", detail.id, "file_sk").catch(err => alert(err?.message || "Gagal mengunduh file")); }} className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                            <Download size={12} /> Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5">
                        <FileText size={22} className="text-gray-300" />
                        <p className="text-xs text-gray-400">Belum diunggah</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Foto Dokumentasi Kegiatan</p>
                    {detail.fotoKegiatan ? (
                      <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <img src={detail.fotoKegiatan} alt="Foto Kegiatan" className="w-full h-40 object-cover" />
                        <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                          <a href={detail.fotoKegiatan} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                            <Eye size={12} /> Pratinjau
                          </a>
                          <a href="#" onClick={(e) => { e.preventDefault(); downloadFile("organisasi", detail.id, "foto_kegiatan").catch(err => alert(err?.message || "Gagal mengunduh file")); }} className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                            <Download size={12} /> Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5">
                        <Image size={22} className="text-gray-300" />
                        <p className="text-xs text-gray-400">Belum diunggah</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>"""

old_modal_docs_start = r"              <div>\s*<p className=\"text-xs text-gray-400 mb-2\">Bukti Dokumen</p>"
# We need to replace from old_modal_docs_start until the end of that div
# A regex is dangerous for HTML, I will use find and split
import builtins
split1 = content.split('              <div>\n                <p className="text-xs text-gray-400 mb-2">Bukti Dokumen</p>')
split2 = split1[1].split('            </div>\n          </div>\n        </div>\n      )}\n\n      {/* SK Preview modal */}')
content = split1[0] + new_modal_docs + '\n            </div>\n          </div>\n        </div>\n      )}\n\n      {/* SK Preview modal */}' + split2[1]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Organisasi.tsx")
