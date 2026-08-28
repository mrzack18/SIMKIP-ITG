import React from "react"
import { Loader2 } from "lucide-react"
import logoItg from "@/imports/logo_itg.jpg"
import { BackendNotReady } from "./Shared"

export function TabSP({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data SP...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Surat Peringatan" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Terjadi kesalahan: {error.message || "Gagal memuat data surat peringatan."}
      </div>
    )
  }
  if (!data.length) {
    return (
      <div className="space-y-5">
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="bg-[#263F93] px-6 py-4 flex items-center gap-4">
            <img src={logoItg} alt="Logo ITG" className="h-12 w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0" />
            <div className="text-white">
              <div className="font-bold text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</div>
              <div className="text-xs text-white/80 leading-snug">
                Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4 bg-white text-center text-sm text-gray-500">
            Belum ada surat peringatan aktif untuk mahasiswa ini.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Riwayat Surat Peringatan</h4>
        <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-4">
          {data.map((sp) => (
            <div key={sp.id} className="relative">
              <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow" />
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-amber-700">
                      {sp.level} — {sp.status}
                    </span>
                    <div className="text-xs text-amber-600 mt-0.5">
                      {sp.tanggalTerbit} · {sp.alasan}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
