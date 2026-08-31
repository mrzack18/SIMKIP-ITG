import React, { useState } from "react"
import {
  Loader2,
  Trophy,
  Calendar,
  MapPin,
  AlertTriangle,
  ExternalLink,
  XCircle,
  Building2,
  FileText,
  Download,
  Image,
} from "lucide-react"
import {
  getApprovalStatusBadge as statusBadge,
  ApprovalStatusIcon as StatusIcon,
} from "@/constants/status"
import { BackendNotReady } from "./Shared"

export function TabPrestasi({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  const [subTab, setSubTab] =
    useState<"Internasional" | "Nasional" | "Wilayah">("Internasional")
  const [modalItem, setModalItem] = useState<any | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data prestasi...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Prestasi" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
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

  const tingkatBadgeStyle = (tingkat: string) => {
    if (tingkat === "Internasional") return "bg-purple-100 text-purple-700"
    if (tingkat === "Nasional") return "bg-blue-100 text-blue-700"
    return "bg-green-100 text-green-700"
  }

  const fmtDate = (iso: string) => {
    if (!iso) return "—"
    const d = new Date(iso)
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-gray-500 font-medium block mb-0.5">Filter Tahun Akademik</span>
          <span className="text-sm font-bold text-gray-800">Data Prestasi</span>
        </div>
        <span className="text-sm font-bold text-gray-800">Data Prestasi</span>
      </div>

      <div className="flex items-center justify-between border-b border-[#E2E8F0]">
        <div className="flex flex-1">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                subTab === t
                  ? "bg-[#263F93] text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
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
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug">
                      {p.namaPrestasi || p.nama}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {p.pencapaian && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-[#263F93]">
                          {p.pencapaian}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusBadge(p.status)}`}
                      >
                        <StatusIcon status={p.status} /> {p.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Trophy size={11} className="text-gray-400 flex-shrink-0" />
                    <span>{p.penyelenggara}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                    <span>
                      {fmtDate(p.tanggalMulai)} – {fmtDate(p.tanggalSelesai)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                    <span>{p.tempat}</span>
                  </div>
                </div>

                {p.catatanAdmin && (
                  <div className="mb-3 flex items-start gap-2 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertTriangle
                      size={12}
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-red-700">
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
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-gray-800">Detail Prestasi</h3>
              <button
                onClick={() => setModalItem(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#263F93]/10">
                  <Trophy
                    size={22}
                    style={{
                      color: "#D4A72C",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">
                    {modalItem.namaPrestasi || modalItem.nama}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${tingkatBadgeStyle(modalItem.tingkat)}`}
                    >
                      {modalItem.tingkat}
                    </span>
                    {modalItem.pencapaian && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#F5EDD4] text-[#B8860B]">
                        {modalItem.pencapaian}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusBadge(modalItem.status)}`}
                    >
                      <StatusIcon status={modalItem.status} /> {modalItem.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <Building2 size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Penyelenggara:</span>
                    <span className="font-medium text-gray-700">{modalItem.penyelenggara}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tanggal:</span>
                    <span className="font-medium text-gray-700">
                      {fmtDate(modalItem.tanggalMulai)} – {fmtDate(modalItem.tanggalSelesai)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tempat:</span>
                    <span className="font-medium text-gray-700">{modalItem.tempat}</span>
                  </div>
                </div>
              </div>

              {modalItem.deskripsi && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-gray-700">{modalItem.deskripsi}</p>
                </div>
              )}

              {modalItem.linkPenyelenggara && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Link Penyelenggara</p>
                  <a
                    href={modalItem.linkPenyelenggara}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-1.5 hover:underline text-[#263F93]"
                  >
                    <ExternalLink size={12} /> {modalItem.linkPenyelenggara}
                  </a>
                </div>
              )}

              {modalItem.catatanAdmin && (
                <div className="flex items-start gap-2 bg-red-50 px-3 py-2.5 rounded-xl">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Catatan Admin:</span> {modalItem.catatanAdmin}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Foto Sertifikat</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <FileText size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {modalItem.fileSertifikat ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {modalItem.fileSertifikat && (
                      <a
                        href={modalItem.fileSertifikat}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline"
                      >
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Foto Podium</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <Image size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {modalItem.fileFoto ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {modalItem.fileFoto && (
                      <a
                        href={modalItem.fileFoto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline"
                      >
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#E2E8F0] flex-shrink-0">
              <button
                onClick={() => setModalItem(null)}
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
