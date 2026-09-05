import React from "react"
import { Loader2, FileText, Calendar, ExternalLink } from "lucide-react"
import {
  getApprovalStatusBadge as statusBadge,
  ApprovalStatusIcon as StatusIcon,
} from "@/constants/status"
import { BackendNotReady } from "./Shared"

export function TabDokumen({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 px-4 text-center text-xs sm:text-sm text-gray-500">
        <Loader2 className="animate-spin mr-2 flex-shrink-0" /> Memuat dokumen kewajiban...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Dokumen Kewajiban" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center text-xs sm:text-sm text-red-600 break-words">
        Terjadi kesalahan: {error.message || "Gagal memuat dokumen kewajiban."}
      </div>
    )
  }

  if (!data || !data.length) {
    return (
      <div className="space-y-4 min-w-0">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] min-w-0">
          <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <FileText size={15} className="text-[#263F93] flex-shrink-0" /> Data Dokumen Kewajiban
          </span>
        </div>
        <div className="py-12 px-4 text-center text-gray-400 text-xs sm:text-sm border border-dashed border-gray-200 rounded-xl">
          Belum ada dokumen kewajiban.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] min-w-0">
        <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <FileText size={15} className="text-[#263F93] flex-shrink-0" /> Data Dokumen Kewajiban
        </span>
      </div>
      {data.map((doc) => (
        <div key={doc.id} className="p-3 sm:p-4 border border-[#E2E8F0] rounded-xl flex items-start gap-2.5 sm:gap-3 hover:shadow-sm transition-shadow bg-white min-w-0">
          <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
            <FileText size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-2 min-w-0">
              <h4 className="font-semibold text-xs sm:text-sm text-gray-900 break-words min-w-0">
                {doc.jenis}
                {doc.is_wajib && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 whitespace-nowrap align-middle">
                    Wajib
                  </span>
                )}
              </h4>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 w-fit shrink-0 ${statusBadge(doc.status)}`}>
                <StatusIcon status={doc.status} />
                {doc.status}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mb-3 text-xs sm:text-sm min-w-0">
              <div className="flex items-center text-gray-500 gap-1.5 min-w-0">
                <Calendar size={14} className="flex-shrink-0" />
                <span className="break-words min-w-0">Diunggah: {doc.tanggal_upload}</span>
              </div>
              <div className="flex items-center text-gray-500 gap-1.5 min-w-0">
                <span className="text-gray-400 shrink-0">File:</span>
                <span className="truncate min-w-0">{doc.nama_file}</span>
              </div>
            </div>
            {doc.catatan && (
              <div className="mb-3 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs sm:text-sm min-w-0">
                <span className="font-medium text-gray-700">Catatan Admin:</span> <span className="text-gray-600 break-words">{doc.catatan}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              {doc.file_url ? (
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs sm:text-sm font-medium text-[#263F93] hover:bg-gray-100 transition-colors w-full sm:w-auto"
                >
                  <ExternalLink size={14} className="flex-shrink-0" />
                  Lihat Dokumen
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-400 cursor-not-allowed w-full sm:w-auto"
                >
                  <ExternalLink size={14} className="flex-shrink-0" />
                  File tidak tersedia
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
