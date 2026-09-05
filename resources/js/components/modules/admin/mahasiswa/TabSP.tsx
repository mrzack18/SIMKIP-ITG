import React from "react"
import { Loader2 } from "lucide-react"
import logoItg from "@/imports/logo_itg.jpg"
import { BackendNotReady } from "./Shared"
import { spHistoryData } from "@/data/mockData"

export function TabSP({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 px-4 text-center text-xs sm:text-sm text-gray-500">
        <Loader2 className="animate-spin mr-2 flex-shrink-0" /> Memuat data SP...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Surat Peringatan" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center text-xs sm:text-sm text-red-600 break-words">
        Terjadi kesalahan: {error.message || "Gagal memuat data surat peringatan."}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="space-y-3 sm:space-y-4 min-w-0">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] min-w-0">
          <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
            Riwayat Surat Peringatan
          </span>
        </div>
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden min-w-0">
          <div className="bg-[#263F93] px-4 sm:px-6 py-3.5 sm:py-4 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <img src={logoItg} alt="Logo ITG" className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0" />
            <div className="text-white min-w-0">
              <div className="font-bold text-xs sm:text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</div>
              <div className="text-[11px] sm:text-xs text-white/80 leading-snug">
                Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4 bg-white text-center text-xs sm:text-sm text-gray-500">
            Belum ada surat peringatan aktif untuk mahasiswa ini.
          </div>
        </div>
      </div>
    )
  }

  const aktifSPs = data.filter(sp => sp.status !== 'Selesai' && sp.status !== 'Kedaluwarsa' && sp.status !== 'Dicabut');
  const riwayatSPs = data.filter(sp => sp.status === 'Selesai' || sp.status === 'Kedaluwarsa' || sp.status === 'Dicabut');

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      
      {/* Active SPs */}
      <div className="space-y-3 sm:space-y-4 min-w-0">
        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          Surat Peringatan Berjalan
        </h4>
        {aktifSPs.length === 0 ? (
           <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center text-xs sm:text-sm text-green-700 break-words">
             Tidak ada Surat Peringatan yang sedang berjalan.
           </div>
        ) : (
          aktifSPs.map((sp, idx) => (
            <div key={idx} className="border border-red-200 rounded-xl overflow-hidden shadow-sm min-w-0">
              <div className="bg-[#263F93] px-4 sm:px-6 py-3.5 sm:py-4 flex items-center gap-2.5 sm:gap-3 min-w-0">
                <img src={logoItg} alt="Logo ITG" className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0" />
                <div className="text-white min-w-0">
                  <div className="font-bold text-xs sm:text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</div>
                  <div className="text-[11px] sm:text-xs text-white/80 leading-snug">
                    Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-4 sm:p-6 space-y-3 sm:space-y-4 min-w-0">
                <div className="text-center pb-3 sm:pb-4 border-b border-red-200 min-w-0">
                  <h4 className="font-bold text-gray-900 uppercase underline text-xs sm:text-sm leading-snug break-words">
                    {sp.level === 'SP1' ? 'SURAT PERINGATAN PERTAMA (SP 1)' : 
                     sp.level === 'SP2' ? 'SURAT PERINGATAN KEDUA (SP 2)' : 
                     'SURAT PERINGATAN KETIGA (SP 3)'}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                    Nomor: {sp.nomorSurat || '-'}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-x-2 sm:gap-x-3 gap-y-2 sm:gap-y-3 text-xs sm:text-sm min-w-0">
                  <div className="text-gray-500 break-words">Tahun Ajaran</div>
                  <div className="col-span-2 font-medium text-gray-900 break-words">: {sp.tahunAjaran || '-'}</div>

                  <div className="text-gray-500 break-words">Tanggal Terbit</div>
                  <div className="col-span-2 font-medium text-gray-900 break-words">: {sp.tanggal || '-'}</div>
                  
                  <div className="text-gray-500 break-words">Alasan Peringatan</div>
                  <div className="col-span-2 font-medium text-red-700 break-words">: {sp.alasan || '-'}</div>
                  
                  <div className="text-gray-500 break-words">Batas Evaluasi</div>
                  <div className="col-span-2 font-medium text-gray-900 break-words">: {sp.batasEvaluasi || '-'} ({sp.sisaHari ? `${sp.sisaHari} hari tersisa` : 'Masa berlaku habis'})</div>

                  <div className="text-gray-500 break-words">Status</div>
                  <div className="col-span-2 font-medium break-words">
                    : <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap">
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
        <div className="space-y-3 sm:space-y-4 pt-4 border-t border-[#E2E8F0] min-w-0">
          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            Riwayat Surat Peringatan (Kedaluwarsa/Selesai)
          </h4>
          <div className="relative pl-5 sm:pl-6 border-l-2 border-[#E2E8F0] space-y-3 sm:space-y-4 min-w-0">
            {riwayatSPs.map((sp, idx) => (
              <div key={idx} className="relative min-w-0">
                <div className="absolute -left-[25px] sm:-left-[29px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow" />
                <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl min-w-0">
                  <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
                    <div className="flex flex-col min-[420px]:flex-row min-[420px]:justify-between min-[420px]:items-start gap-1.5 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-700 break-words">
                        {sp.level} — {sp.tahunAjaran}
                      </span>
                      <span className="inline-flex w-fit px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide whitespace-nowrap shrink-0">
                        Pemutihan ({sp.status})
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-xs min-w-0">
                      <div className="text-gray-500 break-words">Nomor Surat</div>
                      <div className="col-span-2 text-gray-700 break-words">: {sp.nomorSurat || '-'}</div>
                      <div className="text-gray-500 break-words">Tanggal Terbit</div>
                      <div className="col-span-2 text-gray-700 break-words">: {sp.tanggal || '-'}</div>
                      <div className="text-gray-500 break-words">Alasan</div>
                      <div className="col-span-2 text-gray-700 font-medium break-words">: {sp.alasan || '-'}</div>
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
