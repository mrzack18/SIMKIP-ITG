import { Calendar, CheckCircle, Power, Edit2, Trash2, AlertCircle } from "lucide-react";
import type { PeriodeItem } from "@/services/konfigurasiService";

interface Props {
  active: PeriodeItem | null;
  totalMahasiswaAktif: number;
  onEdit: () => void;
  onDeactivate: () => void;
  onActivateAnother: () => void;
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

const hitungSisaHari = (tglTutup: string): number => {
  if (!tglTutup) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const tutup = new Date(tglTutup);
  tutup.setHours(0, 0, 0, 0);
  const diff = tutup.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const hitungStatusPeriode = (item: PeriodeItem): { label: string; color: string; bg: string } => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const buka = new Date(item.tanggal_buka);
  buka.setHours(0, 0, 0, 0);
  const tutup = new Date(item.tanggal_tutup);
  tutup.setHours(0, 0, 0, 0);
  if (now < buka) return { label: "Akan Datang", color: "text-blue-700", bg: "bg-blue-50" };
  if (now > tutup) return { label: "Sudah Ditutup", color: "text-gray-500", bg: "bg-gray-100" };
  return { label: "Sedang Berjalan", color: "text-green-700", bg: "bg-green-50" };
};

export default function PeriodeAktifCard({
  active,
  totalMahasiswaAktif,
  onEdit,
  onDeactivate,
  onActivateAnother,
}: Props) {
  if (!active) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-4 sm:p-6 text-center bg-gray-50/50 min-w-0">
        <AlertCircle size={32} className="text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-600 text-gray-700">Belum ada periode aktif</p>
        <p className="text-xs text-gray-500 mt-1 mb-3 break-words">
          Mahasiswa tidak akan bisa input nilai KHS sampai periode diaktifkan.
        </p>
        <button
          onClick={onActivateAnother}
          className="px-4 py-2 text-xs font-500 text-white rounded-lg whitespace-nowrap"
          style={{ background: "#263F93" }}
        >
          Pilih dari Riwayat
        </button>
      </div>
    );
  }

  const sisaHari = hitungSisaHari(active.tanggal_tutup);
  const statusPeriode = hitungStatusPeriode(active);

  return (
    <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-3 sm:p-4 relative overflow-hidden min-w-0">
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-green-100/40" />
      <div className="relative min-w-0">
        <div className="flex items-start justify-between gap-2 mb-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <span className="text-xs font-700 uppercase tracking-wide text-green-700">
                Periode Aktif
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-600 whitespace-nowrap ${statusPeriode.bg} ${statusPeriode.color}`}>
                {statusPeriode.label}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-display font-700 text-gray-900 break-words">
              {active.tahun_akademik} {active.semester}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-white/60 text-gray-600"
              title="Edit tanggal"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={onDeactivate}
              className="p-2 rounded-lg hover:bg-red-50 text-red-500"
              title="Nonaktifkan"
            >
              <Power size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-white/70 rounded-lg px-3 py-2 border border-green-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Calendar size={12} />
              <span>Tanggal Buka</span>
            </div>
            <div className="text-sm font-600 text-gray-800">{formatTgl(active.tanggal_buka)}</div>
          </div>
          <div className="bg-white/70 rounded-lg px-3 py-2 border border-green-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Calendar size={12} />
              <span>Tanggal Tutup</span>
            </div>
            <div className="text-sm font-600 text-gray-800">{formatTgl(active.tanggal_tutup)}</div>
          </div>
        </div>

        {/* Preview dampak */}
        <div className="mt-4 pt-4 border-t border-green-200/60">
          <p className="text-xs font-600 text-gray-600 mb-2">📊 Preview dampak ke mahasiswa:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-green-500" />
              <span><strong>{totalMahasiswaAktif}</strong> mahasiswa KIP-K aktif dapat mengakses form input IPK</span>
            </li>
            {sisaHari > 0 ? (
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                <span>Periode ditutup dalam <strong>{sisaHari} hari lagi</strong></span>
              </li>
            ) : (
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                <span>Periode sudah lewat — harap nonaktifkan atau perpanjang</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
