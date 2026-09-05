import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";

// ── Status Badge (Dokumen/Prestasi/Umum) ───────────────────────────────────────
type DocStatus = "Menunggu" | "Menunggu Validasi" | "Disetujui" | "Ditolak";

const docStatusConfig: Record<DocStatus, { className: string; icon: React.ReactNode }> = {
  Menunggu: {
    className: "bg-amber-100 text-amber-700",
    icon: <Clock size={11} />,
  },
  "Menunggu Validasi": {
    className: "bg-amber-100 text-amber-700",
    icon: <Clock size={11} />,
  },
  Disetujui: {
    className: "bg-green-100 text-green-700",
    icon: <CheckCircle size={11} />,
  },
  Ditolak: {
    className: "bg-red-100 text-red-700",
    icon: <XCircle size={11} />,
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = docStatusConfig[status as DocStatus] ?? {
    className: "bg-gray-100 text-gray-600",
    icon: null,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-500 whitespace-nowrap ${config.className}`}>
      {config.icon}
      {status}
    </span>
  );
}

// ── SP Badge (SP1/SP2/SP3 progress) ──────────────────────────────────────────
type SPLevel = "SP1" | "SP2" | "SP3";

export function SPBadge({ level }: { level: SPLevel }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="px-1.5 py-0.5 rounded text-xs font-500 bg-amber-100 text-amber-700 whitespace-nowrap">
        SP1
      </span>
      {(level === "SP2" || level === "SP3") && (
        <span className="px-1.5 py-0.5 rounded text-xs font-500 bg-red-100 text-red-700 whitespace-nowrap">
          SP2
        </span>
      )}
      {level === "SP3" && (
        <span className="px-1.5 py-0.5 rounded text-xs font-500 bg-red-900/10 text-red-900 whitespace-nowrap">
          SP3
        </span>
      )}
    </div>
  );
}

// ── Kategori Badge (Reguler/Aspirasi) ─────────────────────────────────────────
export function KategoriBadge({ kategori }: { kategori: "Reguler" | "Aspirasi" }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-500 whitespace-nowrap ${
        kategori === "Reguler"
          ? "bg-[#263F93]/10 text-[#263F93]"
          : "bg-[#D4A72C]/10 text-[#C09526]"
      }`}
    >
      {kategori}
    </span>
  );
}

// ── Mahasiswa Status Badge (Aktif/Dicabut/Lulus) ──────────────────────────────
export function MahasiswaStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aktif: "bg-green-100 text-green-700",
    Dicabut: "bg-red-100 text-red-700",
    Lulus: "bg-blue-100 text-blue-700",
    Cuti: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-500 whitespace-nowrap ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ── SP Status Badge ────────────────────────────────────────────────────────────
export function SPStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aktif: "bg-amber-100 text-amber-700",
    "Masa Tenggang": "bg-orange-100 text-orange-700",
    Pemberhentian: "bg-red-100 text-red-700",
    Selesai: "bg-green-100 text-green-700",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-500 whitespace-nowrap ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ── Laporan Status Badge ───────────────────────────────────────────────────────
export function LaporanStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Draft: "bg-gray-100 text-gray-600",
    Diajukan: "bg-blue-100 text-blue-700",
    Disetujui: "bg-green-100 text-green-700",
    Ditolak: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-500 whitespace-nowrap ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
