import { Link } from "react-router-dom";
import { Users, FileCheck, ArrowRight, Download, CheckCircle, ClipboardList } from "lucide-react";

const PENDING_REPORTS = [
  {
    id: 1,
    judul: "Laporan Evaluasi Semester Genap 2025/2026",
    nomor: "024/LAP/ITG/VIII/2026",
    by: "Biro Kemahasiswaan",
    tanggal: "10 Agustus 2026",
    summary: "167 mahasiswa, rata-rata IPK 3.18",
  },
  {
    id: 2,
    judul: "Laporan Evaluasi Semester Ganjil 2025/2026",
    nomor: "018/LAP/ITG/II/2026",
    by: "Biro Kemahasiswaan",
    tanggal: "2 Februari 2026",
    summary: "161 mahasiswa, rata-rata IPK 3.22",
  },
];

const APPROVED_REPORTS = [
  { judul: "Laporan Evaluasi Semester Genap 2024/2025", nomor: "012/LAP/ITG/VIII/2025", tanggal: "15 Agustus 2025" },
  { judul: "Laporan Evaluasi Semester Ganjil 2024/2025", nomor: "006/LAP/ITG/II/2025", tanggal: "3 Februari 2025" },
];

export default function WarekDashboard() {
  const stats = [
    { label: "Total Mahasiswa KIP-K Aktif", value: "167", sub: "Semua prodi" },
    { label: "Reguler / Aspirasi", value: "112 / 55", sub: "Split kategori" },
    { label: "Laporan Disetujui Semester Ini", value: "0", sub: "2025/2026 Genap" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Dashboard Warek III</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview KIP-K Institut Teknologi Garut</p>
      </div>

      {/* Notification */}
      {PENDING_REPORTS.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ClipboardList size={24} className="text-amber-500 mt-1" />
            <div>
              <p className="font-600 text-amber-800">Terdapat {PENDING_REPORTS.length} laporan semester menunggu persetujuan Anda.</p>
              <p className="text-xs text-amber-600 mt-0.5">Silakan review dan berikan tanda tangan digital untuk finalisasi laporan.</p>
            </div>
          </div>
          <Link to="/warek/laporan" className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 text-white bg-amber-500 hover:bg-amber-600">
            Review Sekarang <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-[#263F93]" />
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
            <div className="font-display font-700 text-3xl text-[#263F93]">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Pending reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-600 text-gray-800 text-sm">Laporan Menunggu Persetujuan</h2>
          <Link to="/warek/laporan" className="text-xs text-[#263F93] hover:underline flex items-center gap-1">Lihat Semua <ArrowRight size={12} /></Link>
        </div>
        <div className="divide-y divide-gray-50">
          {PENDING_REPORTS.map(r => (
            <div key={r.id} className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <FileCheck size={18} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-600 text-gray-800 text-sm">{r.judul}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.nomor} · Diajukan: {r.tanggal}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.summary}</p>
              </div>
              <Link to={`/warek/laporan/${r.id}`}
                className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-500 text-white bg-green-600 hover:bg-green-700">
                Review & Approve
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Approved reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-600 text-gray-800 text-sm">Laporan Telah Disetujui</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {APPROVED_REPORTS.map(r => (
            <div key={r.nomor} className="px-5 py-3.5 flex items-center gap-3">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-500 text-gray-700">{r.judul}</p>
                <p className="text-xs text-gray-400">{r.nomor} · Disetujui: {r.tanggal}</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
                <Download size={12} /> Unduh PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
