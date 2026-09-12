import React, { useState } from "react"
import {
  Loader2,
  Trophy,
  Calendar,
  MapPin,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"
import {
  getApprovalStatusBadge as statusBadge,
  ApprovalStatusIcon as StatusIcon,
} from "@/constants/status"
import { BackendNotReady } from "./Shared"
import { PrestasiDetailModal } from "./DetailModals"

export function TabPrestasi({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  const [subTab, setSubTab] =
    useState<"Internasional" | "Nasional" | "Wilayah">("Internasional")
  const [modalItem, setModalItem] = useState<any | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 px-4 text-center text-xs sm:text-sm text-gray-500">
        <Loader2 className="animate-spin mr-2 flex-shrink-0" /> Memuat data prestasi...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Prestasi" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center text-xs sm:text-sm text-red-600 break-words">
        Terjadi kesalahan: {error.message || "Gagal memuat data prestasi."}
      </div>
    )
  }

  const tiers = ["Internasional", "Nasional", "Wilayah"] as const
  const counts: Record<string, number> = {
    Internasional: data.filter((p) => p.tingkat === "Internasional").length,
    Nasional: data.filter((p) => p.tingkat === "Nasional").length,
    Wilayah: data.filter((p) => p.tingkat === "Wilayah").length,
  }
  const filtered = data.filter(
    (p) => p.tingkat === subTab && (p.status === "Disetujui" || p.status === "approved"),
  )

  const fmtDate = (iso: string) => {
    if (!iso) return "—"
    const d = new Date(iso)
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-4 min-w-0">
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] min-w-0">
        <div>
          <span className="text-xs text-gray-500 font-medium block mb-0.5">Filter Tahun Akademik</span>
          <span className="text-sm font-bold text-gray-800">Data Prestasi</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-[#E2E8F0] min-w-0">
        <div className="flex flex-1 min-w-0">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-2 px-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                subTab === t
                  ? "bg-[#263F93] text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="truncate">{t}</span>
              <span
                className={`flex-shrink-0 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                  subTab === t
                    ? "bg-[#D4A72C] text-[#263F93]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[t]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} prestasi tingkat {subTab.toLowerCase()}
        </p>

        {filtered.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#263F93]/10">
              <Trophy size={24} className="text-[#263F93]" />
            </div>
            <p className="text-gray-500 text-sm">
              Tidak ada prestasi tingkat {subTab.toLowerCase()}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-3 sm:p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow min-w-0"
              >
                <div className="flex items-start gap-3 mb-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#263F93]/10"
                  >
                    <Trophy
                      size={18}
                      style={{
                        color: "#D4A72C",
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug break-words">
                      {p.namaPrestasi || p.nama}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {p.pencapaian && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-[#263F93] whitespace-nowrap">
                          {p.pencapaian}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 whitespace-nowrap ${statusBadge(p.status)}`}
                      >
                        <StatusIcon status={p.status} /> {p.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1.5 mb-3 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Trophy size={11} className="text-gray-400 flex-shrink-0" />
                    <span className="break-words min-w-0">{p.penyelenggara}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                    <span className="break-words min-w-0">
                      {fmtDate(p.tanggalMulai)} – {fmtDate(p.tanggalSelesai)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                    <span className="break-words min-w-0">{p.tempat}</span>
                  </div>
                </div>

                {p.catatanAdmin && (
                  <div className="mb-3 flex items-start gap-2 bg-red-50 px-3 py-2 rounded-lg min-w-0">
                    <AlertTriangle
                      size={12}
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-red-700 break-words min-w-0">
                      <span className="font-medium">Catatan:</span>{" "}
                      {p.catatanAdmin}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setModalItem(p)}
                  className="w-full py-1.5 rounded-lg border border-[#263F93] text-xs text-[#263F93] hover:bg-[#EDF0F8] transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink size={12} /> Lihat Detail
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalItem && (
        <PrestasiDetailModal item={modalItem} onClose={() => setModalItem(null)} />
      )}
    </div>
  )
}
