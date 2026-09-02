import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\UploadDokumen.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add isReadOnly variable
old_states = """  const [taFilter, setTaFilter] = useState(getCurrentTahunAjaran());

  const [uploadTarget, setUploadTarget] = useState<string | null>(null);"""

new_states = """  const [taFilter, setTaFilter] = useState(getCurrentTahunAjaran());
  const isReadOnly = taFilter !== getCurrentTahunAjaran();

  const [uploadTarget, setUploadTarget] = useState<string | null>(null);"""

content = content.replace(old_states, new_states)


# 2. Add Read-only alert banner below the Progress section
old_progress = """      {/* Progress */}
      {total > 0 && (
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              {approved} dari {total} dokumen telah disetujui
            </p>
            <span className="text-sm font-bold text-[#263F93]">{pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#263F93] h-2 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            ></div>
          </div>
        </div>
      )}"""

new_progress = """      {/* Progress */}
      {total > 0 && (
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              {approved} dari {total} dokumen telah disetujui
            </p>
            <span className="text-sm font-bold text-[#263F93]">{pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#263F93] h-2 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-5 py-4 rounded-xl text-sm flex items-start gap-3 shadow-sm">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-1">Mode Riwayat (Read-Only)</p>
            <p>Anda sedang melihat data di masa lalu. Fitur upload dinonaktifkan. Untuk mengunggah dokumen, silakan ubah Tahun Ajaran kembali ke semester saat ini.</p>
          </div>
        </div>
      )}"""

content = content.replace(old_progress, new_progress)


# 3. Disable the upload button if isReadOnly
old_btn = """                {(doc.status === "Belum Diunggah" || doc.status === "Ditolak") && (
                  <button
                    onClick={() => openUpload(doc.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white font-medium transition-colors"
                    style={{ background: doc.status === "Ditolak" ? "#DC2626" : "#263F93" }}
                  >
                    <Upload size={13} /> {doc.status === "Ditolak" ? "Upload Ulang" : "Upload"}
                  </button>
                )}"""

new_btn = """                {(doc.status === "Belum Diunggah" || doc.status === "Ditolak") && !isReadOnly && (
                  <button
                    onClick={() => openUpload(doc.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white font-medium transition-colors hover:opacity-90"
                    style={{ background: doc.status === "Ditolak" ? "#DC2626" : "#263F93" }}
                  >
                    <Upload size={13} /> {doc.status === "Ditolak" ? "Upload Ulang" : "Upload"}
                  </button>
                )}"""

content = content.replace(old_btn, new_btn)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Implemented Solution 1: Read-Only Past Mode")
