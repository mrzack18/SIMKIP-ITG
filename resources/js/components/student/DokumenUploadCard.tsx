/**
 * DokumenUploadCard — Card for a single upload document item (student view)
 * Used in: student/UploadDokumen, student/ArsipDigital
 */
import { CheckCircle, Clock, AlertTriangle, Upload, FileText, Download } from "lucide-react";
import type { DokumenQueue } from "@/types";

interface DokumenUploadCardProps {
  dokumen: {
    id: number;
    jenis: string;
    tanggalUpload?: string;
    deadline?: string;
    status: string;
    catatan?: string;
    wajib?: boolean;
    file?: string;
  };
  onUpload?: (jenis: string) => void;
  onReupload?: (id: number) => void;
  onDownload?: (id: number) => void;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const statusConfig = {
  Disetujui: {
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle size={12} />,
    borderColor: "border-green-200",
    bgColor: "bg-green-50/30",
  },
  Menunggu: {
    badge: "bg-amber-100 text-amber-700",
    icon: <Clock size={12} />,
    borderColor: "border-amber-200",
    bgColor: "bg-amber-50/30",
  },
  "Menunggu Validasi": {
    badge: "bg-amber-100 text-amber-700",
    icon: <Clock size={12} />,
    borderColor: "border-amber-200",
    bgColor: "bg-amber-50/30",
  },
  Ditolak: {
    badge: "bg-red-100 text-red-700",
    icon: <AlertTriangle size={12} />,
    borderColor: "border-red-200",
    bgColor: "bg-red-50/30",
  },
  "Belum Diunggah": {
    badge: "bg-gray-100 text-gray-500",
    icon: <Upload size={12} />,
    borderColor: "border-dashed border-gray-200",
    bgColor: "bg-gray-50/50",
  },
};

export function DokumenUploadCard({
  dokumen,
  onUpload,
  onReupload,
  onDownload,
}: DokumenUploadCardProps) {
  const status = dokumen.status ?? "Belum Diunggah";
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig["Belum Diunggah"];
  const isDenied = status === "Ditolak";
  const isPending = status === "Menunggu" || status === "Menunggu Validasi";
  const isApproved = status === "Disetujui";
  const isNotUploaded = status === "Belum Diunggah";

  return (
    <div
      className={`rounded-xl border p-3.5 sm:p-4 transition-shadow hover:shadow-sm min-w-0 ${cfg.borderColor} ${cfg.bgColor}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-gray-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <p className="text-sm font-600 text-gray-800 break-words">{dokumen.jenis}</p>
                {dokumen.wajib && (
                  <span className="text-xs bg-[#263F93]/10 text-[#263F93] px-1.5 py-0.5 rounded-full font-500 whitespace-nowrap shrink-0">
                    Wajib
                  </span>
                )}
              </div>
              {dokumen.tanggalUpload && (
                <p className="text-xs text-gray-400 mt-0.5 break-words">
                  Diunggah: {formatDate(dokumen.tanggalUpload)}
                </p>
              )}
            </div>

            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-500 flex-shrink-0 whitespace-nowrap ${cfg.badge}`}>
              {cfg.icon}
              {status}
            </span>
          </div>

          {/* Rejected catatan */}
          {isDenied && dokumen.catatan && (
            <div className="mt-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 break-words min-w-0">
              <span className="font-500">Alasan:</span> {dokumen.catatan}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap min-w-0">
            {onDownload && !isNotUploaded && (
              <button
                onClick={() => onDownload(dokumen.id)}
                className="text-xs text-[#263F93] hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                <Download size={11} />
                Unduh
              </button>
            )}

            <div className="ml-auto flex items-center gap-2 flex-wrap">
              {isNotUploaded && onUpload && (
                <button
                  onClick={() => onUpload(dokumen.jenis)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#263F93] text-white hover:bg-[#1B2F73] transition-colors font-500 whitespace-nowrap"
                >
                  <Upload size={11} />
                  Unggah
                </button>
              )}

              {isDenied && onReupload && (
                <button
                  onClick={() => onReupload(dokumen.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#263F93] text-[#263F93] hover:bg-[#263F93]/5 transition-colors font-500 whitespace-nowrap"
                >
                  <Upload size={11} />
                  Unggah Ulang
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
