import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\components\modules\admin\mahasiswa\TabOrganisasi.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add downloadFile import
if 'downloadFile' not in content:
    content = content.replace('import { XCircle', 'import { downloadFile } from "@/utils/fileUrl";\nimport { XCircle')

# Replace the proof modal code
old_proof = """              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">SK Kepengurusan</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <FileText size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {selectedOrg.fileSk ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {selectedOrg.fileSk && (
                      <a href={selectedOrg.fileSk} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Foto Kegiatan</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <Image size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {selectedOrg.fotoKegiatan ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {selectedOrg.fotoKegiatan && (
                      <a href={selectedOrg.fotoKegiatan} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
              </div>"""

new_proof = """              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">SK Kepengurusan</p>
                  {selectedOrg.fileSk ? (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      {selectedOrg.fileSk.toLowerCase().endsWith(".pdf") ? (
                        <iframe src={selectedOrg.fileSk} className="w-full h-40 border-0" title="SK Kepengurusan" />
                      ) : (
                        <img src={selectedOrg.fileSk} alt="SK Kepengurusan" className="w-full h-40 object-cover" />
                      )}
                      <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                        <a href={selectedOrg.fileSk} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                          <Eye size={12} /> Pratinjau
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); downloadFile("organisasi", selectedOrg.id, "file_sk").catch(err => alert(err?.message || "Gagal mengunduh file")); }} className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
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
                  {selectedOrg.fotoKegiatan ? (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <img src={selectedOrg.fotoKegiatan} alt="Foto Kegiatan" className="w-full h-40 object-cover" />
                      <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                        <a href={selectedOrg.fotoKegiatan} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                          <Eye size={12} /> Pratinjau
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); downloadFile("organisasi", selectedOrg.id, "foto_kegiatan").catch(err => alert(err?.message || "Gagal mengunduh file")); }} className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
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
              </div>"""

content = content.replace(old_proof, new_proof)
# Import Eye if not there
if 'Eye' not in content:
    content = content.replace('XCircle,', 'XCircle, Eye,')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated TabOrganisasi.tsx")
