import React from "react"
import { Loader2 } from "lucide-react"
import logoItg from "@/imports/logo_itg.jpg"
import { BackendNotReady } from "./Shared"
import { spHistoryData } from "@/data/mockData"

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
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
          <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
            Riwayat Surat Peringatan
          </span>
        </div>
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

  const aktifSPs = data.filter(sp => sp.status !== 'Selesai' && sp.status !== 'Kedaluwarsa' && sp.status !== 'Dicabut');
  const riwayatSPs = data.filter(sp => sp.status === 'Selesai' || sp.status === 'Kedaluwarsa' || sp.status === 'Dicabut');

  return (
    <div className="space-y-6">
      
      {/* Active SPs */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          Surat Peringatan Berjalan
        </h4>
        {aktifSPs.length === 0 ? (
           <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center text-sm text-green-700">
             Tidak ada Surat Peringatan yang sedang berjalan.
           </div>
        ) : (
          aktifSPs.map((sp, idx) => (
            <div key={idx} className="border border-red-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#263F93] px-6 py-4 flex items-center gap-4">
                <img src={logoItg} alt="Logo ITG" className="h-12 w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0" />
                <div className="text-white">
                  <div className="font-bold text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</div>
                  <div className="text-xs text-white/80 leading-snug">
                    Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-6 space-y-4">
                <div className="text-center pb-4 border-b border-red-200">
                  <h4 className="font-bold text-gray-900 uppercase underline text-base">
                    {sp.level === 'SP1' ? 'SURAT PERINGATAN PERTAMA (SP 1)' : 
                     sp.level === 'SP2' ? 'SURAT PERINGATAN KEDUA (SP 2)' : 
                     'SURAT PERINGATAN KETIGA (SP 3)'}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Nomor: {sp.nomorSurat || '-'}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-y-3 text-sm">
                  <div className="text-gray-500">Tahun Ajaran</div>
                  <div className="col-span-2 font-medium text-gray-900">: {sp.tahunAjaran || '-'}</div>

                  <div className="text-gray-500">Tanggal Terbit</div>
                  <div className="col-span-2 font-medium text-gray-900">: {sp.tanggal || '-'}</div>
                  
                  <div className="text-gray-500">Alasan Peringatan</div>
                  <div className="col-span-2 font-medium text-red-700">: {sp.alasan || '-'}</div>
                  
                  <div className="text-gray-500">Batas Evaluasi</div>
                  <div className="col-span-2 font-medium text-gray-900">: {sp.batasEvaluasi || '-'} ({sp.sisaHari ? `${sp.sisaHari} hari tersisa` : 'Masa berlaku habis'})</div>

                  <div className="text-gray-500">Status</div>
                  <div className="col-span-2 font-medium">
                    : <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        {sp.status}
                      </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Historical SPs */}
      {riwayatSPs.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            Riwayat Surat Peringatan (Kedaluwarsa/Selesai)
          </h4>
          <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-4">
            {riwayatSPs.map((sp, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow" />
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-gray-700">
                        {sp.level} — {sp.tahunAjaran}
                      </span>
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                        Pemutihan ({sp.status})
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-y-1 text-xs">
                      <div className="text-gray-500">Nomor Surat</div>
                      <div className="col-span-2 text-gray-700">: {sp.nomorSurat || '-'}</div>
                      <div className="text-gray-500">Tanggal Terbit</div>
                      <div className="col-span-2 text-gray-700">: {sp.tanggal || '-'}</div>
                      <div className="text-gray-500">Alasan</div>
                      <div className="col-span-2 text-gray-700 font-medium">: {sp.alasan || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
