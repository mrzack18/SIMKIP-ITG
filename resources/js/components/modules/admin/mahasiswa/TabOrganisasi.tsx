import React, { useState } from "react"
import {
  Users,
  Loader2,
  FileText,
  XCircle,
  Calendar,
  Download,
  Image,
} from "lucide-react"
import {
  getApprovalStatusBadge as statusBadge,
  ApprovalStatusIcon as StatusIcon,
} from "@/constants/status"
import { BackendNotReady } from "./Shared"

export function TabOrganisasi({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data organisasi...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Keaktifan Organisasi" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Terjadi kesalahan: {error.message || "Gagal memuat data organisasi."}
      </div>
    )
  }
  
  if (!data.length) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
          <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Users size={15} className="text-[#263F93]" /> Keaktifan Organisasi
          </span>
        </div>
        <div className="py-10 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          Belum ada data organisasi.
        </div>
      </div>
    )
  }

  const fmtMonth = (ym: string) => {
    if (!ym) return "—"
    const [y, m] = ym.split("-")
    const names = ["Jan","Feb","Mar","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]
    return `${names[parseInt(m) - 1] || ""} ${y}`
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
        <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Users size={15} className="text-[#263F93]" /> Keaktifan Organisasi
        </span>
      </div>
      {data.map((o) => (
        <div
          key={o.id}
          className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-[#263F93]" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">{o.nama}</div>
              <div className="text-xs text-gray-500 mt-0.5">{o.jabatan}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {fmtMonth(o.mulai)} – {fmtMonth(o.selesai)}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedOrg(o)}
            className="w-full h-12 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-xs text-[#263F93] font-medium hover:bg-blue-50 hover:border-[#263F93]/30 transition-colors"
          >
            <FileText size={13} /> Pratinjau SK Kepengurusan
          </button>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(o.status)}`}>
              {o.status}
            </span>
            <button
              onClick={() => setSelectedOrg(o)}
              className="text-xs text-[#263F93] font-medium hover:underline"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      ))}

      {selectedOrg && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrg(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-gray-800">Detail Organisasi</h3>
              <button
                onClick={() => setSelectedOrg(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <Users size={22} className="text-[#263F93]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">{selectedOrg.nama}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      {selectedOrg.jenis || "Organisasi"}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusBadge(selectedOrg.status)}`}>
                      <StatusIcon status={selectedOrg.status} /> {selectedOrg.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{selectedOrg.jabatan}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 mr-1">Periode:</span>
                <span className="font-medium text-gray-700">
                  {fmtMonth(selectedOrg.mulai)} → {fmtMonth(selectedOrg.selesai)}
                </span>
              </div>
              {selectedOrg.deskripsi && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-gray-700">{selectedOrg.deskripsi}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
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
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#E2E8F0] flex-shrink-0">
              <button
                onClick={() => setSelectedOrg(null)}
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
