import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\student\Pelatihan.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the file preview UI
old_preview = """              {/* File preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center gap-2 text-center">
                  {detail.sertifikat ? (
                    <>
                      <FileText size={36} className="text-gray-300" />
                      <p className="text-xs font-500 text-gray-500 max-w-full truncate px-2">{detail.sertifikat.split('/').pop()}</p>
                      <p className="text-xs text-gray-400">Pratinjau dokumen tidak tersedia. Gunakan tombol Unduh.</p>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl">📭</span>
                      <p className="text-xs text-gray-400">Belum ada sertifikat yang diunggah.</p>
                    </>
                  )}
                </div>
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden">
                  {detail.fotoKegiatan ? (
                    <img src={detail.fotoKegiatan} alt="Foto Kegiatan" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="text-3xl">🖼️</span>
                      <p className="text-xs text-gray-400">Belum ada foto kegiatan.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                {detail.sertifikat && (
                  <button onClick={() => window.open(detail.sertifikat, '_blank')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                    <FileText size={14} /> Unduh
                  </button>
                )}
                <button
                  onClick={() => setDetail(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm text-white font-500"
                  style={{ background: "#263F93" }}
                >
                  Tutup
                </button>
              </div>"""

new_preview = """              {/* File preview */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Sertifikat / Piagam</p>
                  {detail.sertifikat ? (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      {detail.sertifikat.toLowerCase().endsWith(".pdf") ? (
                        <iframe src={detail.sertifikat} className="w-full h-40 border-0" title="Sertifikat" />
                      ) : (
                        <img src={detail.sertifikat} alt="Sertifikat" className="w-full h-40 object-cover" />
                      )}
                      <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                        <a href={detail.sertifikat} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                          <Eye size={12} /> Pratinjau
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); downloadFile("pelatihan", detail.id, "file_sertifikat").catch(err => alert(err?.message || "Gagal mengunduh file")); }} className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
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
                  <p className="text-xs text-gray-400 mb-1.5">Foto Kegiatan</p>
                  {detail.fotoKegiatan ? (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <img src={detail.fotoKegiatan} alt="Foto Kegiatan" className="w-full h-40 object-cover" />
                      <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                        <a href={detail.fotoKegiatan} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                          <Eye size={12} /> Pratinjau
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); downloadFile("pelatihan", detail.id, "foto_kegiatan").catch(err => alert(err?.message || "Gagal mengunduh file")); }} className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
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

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setDetail(null)}
                  className="w-full py-2.5 rounded-xl text-sm text-white font-500"
                  style={{ background: "#263F93" }}
                >
                  Tutup
                </button>
              </div>"""

content = content.replace(old_preview, new_preview)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Pelatihan.tsx Modal")
