/**
 * OrganisasiCard — Card for a single organisasi (organization) entry
 * Used in: student/Organisasi, admin/DataAkademik, admin/MahasiswaDetail
 */
import { CheckCircle, Clock, AlertTriangle, Building2, Calendar } from "lucide-react";
import type { Organisasi } from "@/types";

interface OrganisasiCardProps {
  organisasi: Organisasi;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onViewDetail?: (item: Organisasi) => void;
  adminView?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const statusConfig = {
  Disetujui: {
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle size={12} className="text-green-500" />,
    dot: "bg-green-500",
  },
  Menunggu: {
    badge: "bg-amber-100 text-amber-700",
    icon: <Clock size={12} className="text-amber-500" />,
    dot: "bg-amber-400",
  },
  Ditolak: {
    badge: "bg-red-100 text-red-700",
    icon: <AlertTriangle size={12} className="text-red-500" />,
    dot: "bg-red-500",
  },
};

function fmtMonth(ym: string) {
  if (!ym) return "—";
  // Handle "September 2024" format (already formatted)
  if (ym.includes(" ") && ym.split(" ").length === 2 && isNaN(Number(ym.split(" ")[0][0]))) {
    return ym;
  }
  // Handle "2025-09" format
  const [y, m] = ym.split("-");
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${months[parseInt(m) - 1]} ${y}`;
}

function calcDuration(mulai: string, selesai: string) {
  if (!mulai || !selesai) return "";
  // If already formatted like "September 2024"
  try {
    const parseYM = (s: string) => {
      if (s.includes("-")) {
        const [y, m] = s.split("-");
        return new Date(Number(y), Number(m) - 1, 1);
      }
      return new Date(s);
    };
    const m = parseYM(mulai);
    const e = parseYM(selesai);
    const months = (e.getFullYear() - m.getFullYear()) * 12 + (e.getMonth() - m.getMonth());
    if (months < 12) return `${months} bulan`;
    const yr = Math.floor(months / 12);
    const mo = months % 12;
    return mo > 0 ? `${yr} tahun ${mo} bulan` : `${yr} tahun`;
  } catch {
    return "";
  }
}

export function OrganisasiCard({
  organisasi,
  onEdit,
  onDelete,
  onViewDetail,
  adminView = false,
  onApprove,
  onReject,
}: OrganisasiCardProps) {
  const status = organisasi.status ?? "Menunggu";
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.Menunggu;
  const duration = calcDuration(organisasi.mulai, organisasi.selesai);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-[#263F93]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-600 text-gray-800">{organisasi.nama}</p>
              <p className="text-xs text-gray-500 mt-0.5">{organisasi.jabatan}</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-500 flex-shrink-0 ${cfg.badge}`}>
              {cfg.icon}
              {status}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Calendar size={11} className="text-gray-400" />
            <span className="text-xs text-gray-400">
              {fmtMonth(organisasi.mulai)} – {fmtMonth(organisasi.selesai)}
              {duration && <span className="ml-1 text-gray-300">({duration})</span>}
            </span>
          </div>

          {organisasi.deskripsi && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{organisasi.deskripsi}</p>
          )}

          {/* Rejected note */}
          {status === "Ditolak" && organisasi.catatanAdmin && (
            <div className="mt-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
              <span className="font-500">Catatan Admin:</span> {organisasi.catatanAdmin}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {!adminView && onViewDetail && (
              <button
                onClick={() => onViewDetail(organisasi)}
                className="text-xs text-[#263F93] hover:underline"
              >
                Lihat Detail
              </button>
            )}
            {!adminView && onEdit && status !== "Disetujui" && (
              <button
                onClick={() => onEdit(organisasi.id)}
                className="ml-auto text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
            )}
            {!adminView && onDelete && status !== "Disetujui" && (
              <button
                onClick={() => onDelete(organisasi.id)}
                className="text-xs text-red-500 border border-red-100 rounded-lg px-2 py-1 hover:bg-red-50 transition-colors"
              >
                Hapus
              </button>
            )}

            {adminView && onApprove && status !== "Disetujui" && (
              <>
                <button
                  onClick={() => onReject?.(organisasi.id)}
                  className="ml-auto text-xs border border-red-200 text-red-600 rounded-lg px-2.5 py-1 hover:bg-red-50 transition-colors"
                >
                  Tolak
                </button>
                <button
                  onClick={() => onApprove(organisasi.id)}
                  className="text-xs bg-[#263F93] text-white rounded-lg px-2.5 py-1 hover:bg-[#1B2F73] transition-colors"
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
