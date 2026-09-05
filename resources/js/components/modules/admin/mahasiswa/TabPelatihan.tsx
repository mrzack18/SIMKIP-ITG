import React, { useState } from "react"
import {
  Loader2,
  GraduationCap,
  Calendar,
  MapPin,
  ExternalLink,
  XCircle,
  Building2,
  FileText,
  Download,
  Image,
  Eye,
} from "lucide-react"
import {
  getApprovalStatusBadge as statusBadge,
  ApprovalStatusIcon as StatusIcon,
} from "@/constants/status"
import { BackendNotReady } from "./Shared"
import { downloadFile } from "@/utils/fileUrl";

function PlaceholderThumb({ label }: { label: string }) {
  return (
    <div className="w-20 h-14 bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0">
      <Image size={16} className="text-gray-400" />
      <span className="text-[10px] text-gray-400 leading-none">{label}</span>
    </div>
  )
}

export function TabPelatihan({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  const [subTab, setSubTab] = useState<"Akademik" | "Non-Akademik">("Akademik")
  const [selectedPelatihan, setSelectedPelatihan] = useState<any | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 px-4 text-center text-sm sm:text-base text-gray-500">
        <Loader2 className="animate-spin mr-2 flex-shrink-0" /> Memuat data pelatihan...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Pelatihan" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center text-xs sm:text-sm text-red-600 break-words">
        Terjadi kesalahan: {error.message || "Gagal memuat data pelatihan."}
      </div>
    )
  }
  
  const HeaderCard = () => (
    <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] min-w-0">
      <span className="text-sm font-bold text-gray-800">Data Pelatihan</span>
    </div>
  )

  if (!data.length) {
    return (
      <div className="space-y-4 min-w-0">
        <HeaderCard />
        <div className="flex gap-2">
          {(["Akademik", "Non-Akademik"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                subTab === t
                  ? "bg-[#263F93] text-white"
                  : "bg-[#F8FAFC] border border-[#E2E8F0] text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-10 px-4 text-center text-gray-400 text-xs sm:text-sm border border-dashed border-gray-200 rounded-xl">
          Belum ada data pelatihan.
        </div>
      </div>
    )
  }

  const items = data.filter((p) =>
    subTab === "Akademik" ? p.jenis === "Akademik" : p.jenis === "Non-Akademik",
  )

  const fmtDate = (iso: string) => {
    if (!iso) return "—"
    const d = new Date(iso)
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <HeaderCard />
      <div className="flex items-center justify-between min-w-0">
        <div className="flex gap-2">
          {(["Akademik", "Non-Akademik"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                subTab === t
                  ? "bg-[#263F93] text-white"
                  : "bg-[#F8FAFC] border border-[#E2E8F0] text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="py-10 px-4 text-center text-gray-400 text-xs sm:text-sm border border-dashed border-gray-200 rounded-xl">
          Belum ada pelatihan {subTab.toLowerCase()}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3 min-w-0"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={18} className="text-[#263F93]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 break-words">{item.nama}</div>
                  <div className="text-xs text-gray-500 mt-0.5 break-words">{item.penyelenggara}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                  <span className="break-words min-w-0">{fmtDate(item.tanggalMulai)} – {fmtDate(item.tanggalSelesai)}</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                  <span className="break-words min-w-0">{item.tempat}</span>
                </div>
              </div>
              <PlaceholderThumb label="Sertifikat" />
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusBadge(item.status)}`}>
                  {item.status}
                </span>
                <button
                  onClick={() => setSelectedPelatihan(item)}
                  className="text-xs text-[#263F93] font-medium hover:underline flex items-center gap-1 shrink-0"
                >
                  <ExternalLink size={11} /> Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPelatihan && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedPelatihan(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-2 flex-shrink-0 min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">Detail Pelatihan</h3>
              <button
                onClick={() => setSelectedPelatihan(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto min-w-0">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={22} className="text-[#263F93]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-gray-800 leading-snug break-words">{selectedPelatihan.nama}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                        selectedPelatihan.jenis === "Akademik"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {selectedPelatihan.jenis}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 whitespace-nowrap ${statusBadge(selectedPelatihan.status)}`}>
                      <StatusIcon status={selectedPelatihan.status} /> {selectedPelatihan.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5 text-sm min-w-0">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Building2 size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 mr-1">Penyelenggara:</span>
                    <span className="font-medium text-gray-700 break-words">{selectedPelatihan.penyelenggara}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 min-w-0">
                  <Calendar size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 mr-1">Tanggal:</span>
                    <span className="font-medium text-gray-700 break-words">
                      {fmtDate(selectedPelatihan.tanggalMulai)} → {fmtDate(selectedPelatihan.tanggalSelesai)}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 min-w-0">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-xs text-gray-400 mr-1">Tempat:</span>
                    <span className="font-medium text-gray-700 break-words">{selectedPelatihan.tempat}</span>
                  </div>
                </div>
              </div>
              {selectedPelatihan.deskripsi && (
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-gray-700 break-words">{selectedPelatihan.deskripsi}</p>
                </div>
              )}
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Sertifikat</p>
                  {(selectedPelatihan.sertifikat || selectedPelatihan.fileSertifikat) ? (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      {(selectedPelatihan.sertifikat || selectedPelatihan.fileSertifikat).toLowerCase().endsWith(".pdf") ? (
                        <iframe src={selectedPelatihan.sertifikat || selectedPelatihan.fileSertifikat} className="w-full h-40 border-0" title="Sertifikat" />
                      ) : (
                        <img src={selectedPelatihan.sertifikat || selectedPelatihan.fileSertifikat} alt="Sertifikat" className="w-full h-40 object-cover" />
                      )}
                      <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                        <a href={selectedPelatihan.sertifikat || selectedPelatihan.fileSertifikat} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                          <Eye size={12} /> Pratinjau
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); downloadFile("pelatihan", selectedPelatihan.id, "file_sertifikat").catch(err => alert(err?.message || "Gagal mengunduh file")); }} className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
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
                  {selectedPelatihan.fotoKegiatan ? (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <img src={selectedPelatihan.fotoKegiatan} alt="Foto Kegiatan" className="w-full h-40 object-cover" />
                      <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                        <a href={selectedPelatihan.fotoKegiatan} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
                          <Eye size={12} /> Pratinjau
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); downloadFile("pelatihan", selectedPelatihan.id, "foto_kegiatan").catch(err => alert(err?.message || "Gagal mengunduh file")); }} className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors">
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
            </div>
            <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-t border-[#E2E8F0] flex-shrink-0">
              <button
                onClick={() => setSelectedPelatihan(null)}
                className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
