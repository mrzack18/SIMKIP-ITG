import React, { useState } from "react"
import { Loader2, GraduationCap, Calendar, MapPin, ExternalLink, Image } from "lucide-react"
import { getApprovalStatusBadge as statusBadge } from "@/constants/status"
import { BackendNotReady } from "./Shared"
import { PelatihanDetailModal, fmtDate } from "./DetailModals"

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
      <div className="flex items-center justify-center py-12 px-4 text-center text-xs sm:text-sm text-gray-500">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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
        <PelatihanDetailModal item={selectedPelatihan} onClose={() => setSelectedPelatihan(null)} />
      )}
    </div>
  )
}
