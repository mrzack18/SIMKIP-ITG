/**
 * DokumenCard — Card for a single document in the validation queue
 * Used in: admin/DokumenQueue, admin/Dashboard widget
 */
import { Clock, CheckCircle, XCircle, FileText, Download } from "lucide-react";
import type { DokumenQueue } from "@/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface DokumenCardProps {
  dokumen: DokumenQueue;
  /** Show approve/reject action buttons */
  showActions?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onView?: (id: number) => void;
  compact?: boolean;
}

const statusConfig = {
  Menunggu: {
    badge: "bg-amber-100 text-amber-700",
    icon: <Clock size={11} />,
    dot: "bg-amber-400",
  },
  Disetujui: {
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle size={11} />,
    dot: "bg-green-500",
  },
  Ditolak: {
    badge: "bg-red-100 text-red-700",
    icon: <XCircle size={11} />,
    dot: "bg-red-500",
  },
};

export function DokumenCard({
  dokumen,
  showActions = false,
  onApprove,
  onReject,
  onView,
  compact = false,
}: DokumenCardProps) {
  const cfg = statusConfig[dokumen.status as keyof typeof statusConfig] ?? statusConfig.Menunggu;

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] px-3 sm:px-4 py-3 border border-[#E2E8F0] min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-500 text-gray-800 truncate">{dokumen.jenis}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{dokumen.nama}</p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-500 whitespace-nowrap shrink-0 inline-flex items-center gap-1 ${cfg.badge}`}
        >
          {cfg.icon}
          {dokumen.status}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 sm:p-4 hover:shadow-sm transition-shadow min-w-0">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-gray-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-sm font-600 text-gray-800 break-words">{dokumen.jenis}</p>
              <p className="text-xs text-gray-500 mt-0.5 break-words">
                {dokumen.nama} · <span className="font-mono break-all">{dokumen.nim}</span>
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-500 flex-shrink-0 whitespace-nowrap ${cfg.badge}`}
            >
              {cfg.icon}
              {dokumen.status}
            </span>
          </div>

          <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-2 mt-3 min-w-0">
            <span className="text-xs text-gray-400 break-words">{formatDate(dokumen.tanggalUpload)}</span>

            <div className="flex items-center gap-2 flex-wrap">
              {onView && (
                <button
                  onClick={() => onView(dokumen.id)}
                  className="text-xs text-[#263F93] hover:underline font-500 flex items-center gap-1 whitespace-nowrap"
                >
                  <Download size={11} />
                  Lihat Dokumen
                </button>
              )}
              {showActions && dokumen.status === "Menunggu" && (
                <>
                  <button
                    onClick={() => onReject?.(dokumen.id)}
                    className="px-3 py-1 rounded-lg text-xs bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-500 whitespace-nowrap"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => onApprove?.(dokumen.id)}
                    className="px-3 py-1 rounded-lg text-xs bg-[#263F93] text-white hover:bg-[#1B2F73] transition-colors font-500 whitespace-nowrap"
                  >
                    Setujui
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
