import React, { useState } from "react"
import { Users, Loader2, FileText } from "lucide-react"
import { getApprovalStatusBadge as statusBadge } from "@/constants/status"
import { BackendNotReady } from "./Shared"
import { OrganisasiDetailModal, fmtMonth } from "./DetailModals"

export function TabOrganisasi({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 px-4 text-center text-xs sm:text-sm text-gray-500">
        <Loader2 className="animate-spin mr-2 flex-shrink-0" /> Memuat data organisasi...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Keaktifan Organisasi" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center text-xs sm:text-sm text-red-600 break-words">
        Terjadi kesalahan: {error.message || "Gagal memuat data organisasi."}
      </div>
    )
  }
  
  if (!data.length) {
    return (
      <div className="space-y-4 min-w-0">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] min-w-0">
          <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Users size={15} className="text-[#263F93] flex-shrink-0" /> Keaktifan Organisasi
          </span>
        </div>
        <div className="py-10 px-4 text-center text-gray-400 text-xs sm:text-sm border border-dashed border-gray-200 rounded-xl">
          Belum ada data organisasi.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] min-w-0">
        <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Users size={15} className="text-[#263F93] flex-shrink-0" /> Keaktifan Organisasi
        </span>
      </div>
      {data.map((o) => (
        <div
          key={o.id}
          className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3 min-w-0"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-[#263F93]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900 break-words">{o.nama}</div>
              <div className="text-xs text-gray-500 mt-0.5 break-words">{o.jabatan}</div>
              <div className="text-xs text-gray-400 mt-0.5 break-words">
                {fmtMonth(o.mulai)} – {fmtMonth(o.selesai)}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedOrg(o)}
            className="w-full min-h-12 py-2.5 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-xs text-[#263F93] font-medium hover:bg-blue-50 hover:border-[#263F93]/30 transition-colors px-3"
          >
            <FileText size={13} className="flex-shrink-0" /> Pratinjau SK Kepengurusan
          </button>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusBadge(o.status)}`}>
              {o.status}
            </span>
            <button
              onClick={() => setSelectedOrg(o)}
              className="text-xs text-[#263F93] font-medium hover:underline shrink-0"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      ))}

      {selectedOrg && (
        <OrganisasiDetailModal item={selectedOrg} onClose={() => setSelectedOrg(null)} />
      )}
    </div>
  )
}
