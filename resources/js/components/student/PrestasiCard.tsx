/**
 * PrestasiCard — Card for a single prestasi (achievement) entry
 * Used in: student/Prestasi, admin/DataAkademik
 */
import { CheckCircle, Clock, AlertTriangle, Trophy, ExternalLink } from "lucide-react";
import type { Prestasi } from "@/types";

interface PrestasiCardProps {
  prestasi: Prestasi;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onViewDetail?: (item: Prestasi) => void;
  /** If true, shows admin actions (approve/reject) instead of edit/delete */
  adminView?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const statusConfig = {
  Disetujui: {
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle size={12} className="text-green-500" />,
  },
  "Menunggu Validasi": {
    badge: "bg-amber-100 text-amber-700",
    icon: <Clock size={12} className="text-amber-500" />,
  },
  Menunggu: {
    badge: "bg-amber-100 text-amber-700",
    icon: <Clock size={12} className="text-amber-500" />,
  },
  Ditolak: {
    badge: "bg-red-100 text-red-700",
    icon: <AlertTriangle size={12} className="text-red-500" />,
  },
};

const tingkatColor: Record<string, string> = {
  Internasional: "bg-purple-100 text-purple-700",
  Nasional:      "bg-blue-100 text-blue-700",
  Wilayah:       "bg-teal-100 text-teal-700",
  Institusi:     "bg-gray-100 text-gray-600",
};

export function PrestasiCard({
  prestasi,
  onEdit,
  onDelete,
  onViewDetail,
  adminView = false,
  onApprove,
  onReject,
}: PrestasiCardProps) {
  const status = prestasi.status ?? "Menunggu";
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.Menunggu;
  const tingkat = prestasi.tingkat ?? (prestasi.tab as string);
  const tingkatCls = tingkatColor[tingkat] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 sm:p-4 hover:shadow-sm transition-shadow min-w-0">
      <div className="flex items-start gap-3 min-w-0">
        {/* Trophy icon */}
        <div className="w-10 h-10 rounded-xl bg-[#D4A72C]/10 flex items-center justify-center flex-shrink-0">
          <Trophy size={18} className="text-[#D4A72C]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <p className="text-sm font-600 text-gray-800 leading-snug break-words min-w-0">
              {prestasi.namaPrestasi}
            </p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-500 flex-shrink-0 whitespace-nowrap ${cfg.badge}`}>
              {cfg.icon}
              {status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 min-w-0">
            <span className={`px-2 py-0.5 rounded-full text-xs font-500 whitespace-nowrap ${tingkatCls}`}>
              {tingkat}
            </span>
            <span className="text-xs text-gray-500 break-words">{prestasi.pencapaian}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400 break-words">{prestasi.penyelenggara}</span>
          </div>

          <div className="text-xs text-gray-400 mt-1 break-words">
            {prestasi.tanggalMulai
              ? `${formatDate(prestasi.tanggalMulai)} – ${formatDate(prestasi.tanggalSelesai)}`
              : prestasi.tanggal}
            {prestasi.tempat && ` · ${prestasi.tempat}`}
          </div>

          {/* Rejected note */}
          {(status === "Ditolak") && (prestasi.catatanAdmin || prestasi.catatan) && (
            <div className="mt-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 break-words min-w-0">
              <span className="font-500">Catatan Admin:</span> {prestasi.catatanAdmin ?? prestasi.catatan}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap min-w-0">
            {(prestasi.link ?? prestasi.linkPenyelenggara) && (
              <a
                href={prestasi.link ?? prestasi.linkPenyelenggara}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#263F93] hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                <ExternalLink size={11} />
                Lihat Link
              </a>
            )}

            {!adminView && onViewDetail && (
              <button
                onClick={() => onViewDetail(prestasi)}
                className="text-xs text-[#263F93] hover:underline ml-auto whitespace-nowrap"
              >
                Lihat Detail
              </button>
            )}
            {!adminView && onEdit && status !== "Disetujui" && (
              <button
                onClick={() => onEdit(prestasi.id)}
                className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors ml-auto whitespace-nowrap"
              >
                Edit
              </button>
            )}
            {!adminView && onDelete && status !== "Disetujui" && (
              <button
                onClick={() => onDelete(prestasi.id)}
                className="text-xs text-red-500 hover:text-red-700 border border-red-100 rounded-lg px-2 py-1 hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                Hapus
              </button>
            )}

            {adminView && onApprove && status !== "Disetujui" && (
              <>
                <button
                  onClick={() => onReject?.(prestasi.id)}
                  className="ml-auto text-xs border border-red-200 text-red-600 rounded-lg px-2.5 py-1 hover:bg-red-50 transition-colors whitespace-nowrap"
                >
                  Tolak
                </button>
                <button
                  onClick={() => onApprove(prestasi.id)}
                  className="text-xs bg-[#263F93] text-white rounded-lg px-2.5 py-1 hover:bg-[#1B2F73] transition-colors whitespace-nowrap"
                >
                  Setujui
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
