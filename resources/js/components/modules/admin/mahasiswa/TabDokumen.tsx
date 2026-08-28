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
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat dokumen kewajiban...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Dokumen Kewajiban" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Terjadi kesalahan: {error.message || "Gagal memuat dokumen kewajiban."}
      </div>
    )
  }
  if (!data || !data.length) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
        Belum ada dokumen kewajiban.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((doc) => (
        <div key={doc.id} className="p-4 border border-[#E2E8F0] rounded-xl flex items-start gap-4 hover:shadow-sm transition-shadow bg-white">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h4 className="font-semibold text-gray-900 truncate">
                {doc.jenis}
                {doc.is_wajib && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
                    Wajib
                  </span>
                )}
              </h4>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 w-fit ${statusBadge(doc.status)}`}>
                <StatusIcon status={doc.status} />
                {doc.status}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mb-3 text-sm">
              <div className="flex items-center text-gray-500 gap-1.5">
                <Calendar size={14} />
                Diunggah: {doc.tanggal_upload}
              </div>
              <div className="flex items-center text-gray-500 gap-1.5 truncate">
                <span className="text-gray-400">File:</span>
                <span className="truncate">{doc.nama_file}</span>
              </div>
            </div>
            {doc.catatan && (
              <div className="mb-3 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm">
                <span className="font-medium text-gray-700">Catatan Admin:</span> <span className="text-gray-600">{doc.catatan}</span>
              </div>
            )}
            <div className="flex gap-2">
              {doc.file_url ? (
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink size={14} />
                  Lihat Dokumen
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  <ExternalLink size={14} />
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
