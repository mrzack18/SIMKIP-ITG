import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Clock, RotateCcw, Download } from "lucide-react";

type LStatus = "Menunggu" | "Disetujui" | "Dikembalikan";

interface Laporan {
  id: number;
  judul: string;
  nomor: string;
  periode: string;
  tanggal: string;
  summary: string;
  status: LStatus;
  approvedDate?: string;
}

const DATA: Laporan[] = [
  { id: 1, judul: "Laporan Evaluasi Semester Genap 2025/2026", nomor: "024/LAP/ITG/VIII/2026", periode: "Semester Genap 2025/2026", tanggal: "10 Agustus 2026", summary: "167 mahasiswa, rata-rata IPK 3.18, 3 SP aktif", status: "Menunggu" },
  { id: 2, judul: "Laporan Evaluasi Semester Ganjil 2025/2026", nomor: "018/LAP/ITG/II/2026", periode: "Semester Ganjil 2025/2026", tanggal: "2 Februari 2026", summary: "161 mahasiswa, rata-rata IPK 3.22, 1 SP aktif", status: "Menunggu" },
  { id: 3, judul: "Laporan Evaluasi Semester Genap 2024/2025", nomor: "012/LAP/ITG/VIII/2025", periode: "Semester Genap 2024/2025", tanggal: "15 Agustus 2025", summary: "148 mahasiswa, rata-rata IPK 3.19", status: "Disetujui", approvedDate: "18 Agustus 2025" },
  { id: 4, judul: "Laporan Evaluasi Semester Ganjil 2024/2025", nomor: "006/LAP/ITG/II/2025", periode: "Semester Ganjil 2024/2025", tanggal: "3 Februari 2025", summary: "142 mahasiswa, rata-rata IPK 3.15", status: "Disetujui", approvedDate: "7 Februari 2025" },
  { id: 5, judul: "Laporan Evaluasi Semester Genap 2023/2024", nomor: "010/LAP/ITG/VIII/2024", periode: "Semester Genap 2023/2024", tanggal: "12 Agustus 2024", summary: "135 mahasiswa, rata-rata IPK 3.21", status: "Dikembalikan" },
];

const TABS: { label: string; status: LStatus | "Semua" }[] = [
  { label: "Menunggu Approval", status: "Menunggu" },
  { label: "Disetujui", status: "Disetujui" },
  { label: "Dikembalikan", status: "Dikembalikan" },
];

const statusStyle: Record<LStatus, { badge: string; icon: React.ReactNode }> = {
  Menunggu: { badge: "bg-yellow-100 text-yellow-700", icon: <Clock size={13} className="text-yellow-500" /> },
  Disetujui: { badge: "bg-green-100 text-green-700", icon: <CheckCircle size={13} className="text-green-500" /> },
  Dikembalikan: { badge: "bg-orange-100 text-orange-700", icon: <RotateCcw size={13} className="text-orange-500" /> },
};

export default function WarekLaporanList() {
  const [activeTab, setActiveTab] = useState<LStatus>("Menunggu");

  const filtered = DATA.filter(d => d.status === activeTab);

  const counts = Object.fromEntries(TABS.map(t => [t.status, DATA.filter(d => d.status === t.status).length]));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Laporan Semester</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review dan setujui laporan evaluasi semester dari Biro Kemahasiswaan</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t.status}
            onClick={() => setActiveTab(t.status as LStatus)}
            className={`px-4 py-2 rounded-lg text-sm font-500 transition-colors ${activeTab === t.status ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label} ({counts[t.status] || 0})
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Tidak ada laporan dalam kategori ini.</p>
          </div>
        )}
        {filtered.map(r => {
          const ss = statusStyle[r.status];
          return (
            <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={22} className="text-[#263F93]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-600 text-gray-800">{r.judul}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-500 flex items-center gap-1 ${ss.badge}`}>
                      {ss.icon} {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{r.nomor}</p>
                  <p className="text-xs text-gray-500 mt-1">{r.periode} · Diajukan: {r.tanggal}</p>
                  <p className="text-xs text-gray-500 mt-1">{r.summary}</p>
                  {r.approvedDate && (
                    <p className="text-xs text-green-600 mt-1 font-500">Disetujui: {r.approvedDate}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {r.status === "Menunggu" && (
                    <Link to={`/warek/laporan/${r.id}`}
                      className="px-4 py-2 rounded-lg text-sm font-500 text-white bg-green-600 hover:bg-green-700 text-center">
                      Review Detail
                    </Link>
                  )}
                  {r.status === "Disetujui" && (
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                      <Download size={14} /> Unduh PDF
                    </button>
                  )}
                  {r.status === "Dikembalikan" && (
                    <Link to={`/warek/laporan/${r.id}`} className="px-4 py-2 rounded-lg text-sm border border-orange-200 text-orange-700 hover:bg-orange-50 text-center">
                      Lihat Detail
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
