import { Calendar, Power, Edit2, Trash2 } from "lucide-react";
import type { PeriodeItem } from "@/services/konfigurasiService";

interface Props {
  items: PeriodeItem[];
  onActivate: (item: PeriodeItem) => void;
  onEdit: (item: PeriodeItem) => void;
  onDelete: (item: PeriodeItem) => void;
}

const formatTgl = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getNodeStyle = (item: PeriodeItem) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const buka = new Date(item.tanggal_buka);
  buka.setHours(0, 0, 0, 0);
  const tutup = new Date(item.tanggal_tutup);
  tutup.setHours(0, 0, 0, 0);

  if (item.is_aktif) return { dot: "bg-green-500", ring: "ring-green-300", text: "text-green-700", bg: "bg-green-50" };
  if (now > tutup) return { dot: "bg-gray-300", ring: "ring-gray-200", text: "text-gray-500", bg: "bg-gray-50" };
  if (now < buka) return { dot: "bg-blue-400", ring: "ring-blue-200", text: "text-blue-700", bg: "bg-blue-50" };
  return { dot: "bg-amber-400", ring: "ring-amber-200", text: "text-amber-700", bg: "bg-amber-50" };
};

export default function TimelinePeriode({ items, onActivate, onEdit, onDelete }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center bg-gray-50/50">
        <Calendar size={28} className="text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Belum ada riwayat periode</p>
      </div>
    );
  }

  // Sort descending by tanggal_buka (terbaru di atas)
  const sorted = [...items].sort(
    (a, b) => new Date(b.tanggal_buka).getTime() - new Date(a.tanggal_buka).getTime()
  );

  return (
    <div className="space-y-2 min-w-0">
      <p className="text-xs font-600 text-gray-500 uppercase tracking-wide mb-2">
        Riwayat Periode ({items.length})
      </p>
      <div className="space-y-2 min-w-0">
        {sorted.map((item) => {
          const style = getNodeStyle(item);
          return (
            <div
              key={item.id}
              className={`flex flex-wrap items-center gap-2 sm:gap-3 p-3 rounded-xl border transition-all hover:shadow-sm min-w-0 ${
                item.is_aktif
                  ? "border-green-300 bg-green-50/50"
                  : "border-gray-100 bg-white"
              }`}
            >
              {/* Status dot */}
              <div className={`w-3 h-3 rounded-full ${style.dot} ring-4 ${style.ring} flex-shrink-0`} />

              {/* Info */}
              <div className="flex-1 min-w-0 basis-40">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-sm font-600 text-gray-800 break-words">
                    {item.tahun_akademik} {item.semester}
                  </span>
                  {item.is_aktif && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-600 bg-green-100 text-green-700 whitespace-nowrap">
                      ● Aktif
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 min-w-0">
                  <Calendar size={11} className="flex-shrink-0" />
                  <span className="truncate">{formatTgl(item.tanggal_buka)} → {formatTgl(item.tanggal_tutup)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                {!item.is_aktif && (
                  <button
                    onClick={() => onActivate(item)}
                    className="px-2.5 py-1 text-xs font-500 text-green-700 hover:bg-green-100 rounded-lg flex items-center gap-1 whitespace-nowrap"
                    title="Aktifkan periode ini"
                  >
                    <Power size={11} /> Aktifkan
                  </button>
                )}
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-[#263F93] hover:bg-gray-100 rounded-lg"
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  title="Hapus"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
