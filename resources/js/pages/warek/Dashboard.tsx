import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, FileCheck, ArrowRight, Download, CheckCircle, ClipboardList } from "lucide-react";
import { api } from "@/services/api";
import { TahunAjaranFilter, getCurrentTahunAjaran } from "@/components/ui/TahunAjaranFilter";
interface PendingReport {
  id: number;
  judul: string;
  nomor: string;
  tanggal: string;
  summary: string;
  by: string;
}

interface ApprovedReport {
  id: number;
  judul: string;
  nomor: string;
  tanggal: string;
  approvedDate?: string;
}

interface DashboardData {
  stats: {
    totalMahasiswaAktif: number;
    regulerCount: number;
    aspirasiCount: number;
    laporanDisetujuiSemesterIni: number;
    currentPeriode: string;
  };
  pendingReports: PendingReport[];
  approvedReports: ApprovedReport[];
}

export default function WarekDashboard() {
  const [filterTahunAjaran, setFilterTahunAjaran] = useState(getCurrentTahunAjaran());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<DashboardData>(`/warek/dashboard?tahun_ajaran=${filterTahunAjaran === "Semua" ? "" : filterTahunAjaran}`);
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message ?? "Gagal memuat dashboard.");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filterTahunAjaran]);

  const stats = data
    ? [
        {
          label: "Total Mahasiswa KIP-K Aktif",
          value: String(data.stats.totalMahasiswaAktif),
          sub: "Semua prodi",
        },
        {
          label: "Reguler / Aspirasi",
          value: `${data.stats.regulerCount} / ${data.stats.aspirasiCount}`,
          sub: "Split kategori",
        },
        {
          label: "Laporan Disetujui Semester Ini",
          value: String(data.stats.laporanDisetujuiSemesterIni),
          sub: data.stats.currentPeriode || "2025/2026 Genap",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Dashboard Warek III</h1>
          <p className="text-gray-500 text-sm mt-0.5">Memuat data...</p>
        </div>
        <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 text-center text-sm text-gray-400">
          Sedang memuat data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Dashboard Warek III</h1>
          <p className="text-gray-500 text-sm mt-0.5">Overview KIP-K Institut Teknologi Garut</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Dashboard Warek III</h1>
          <p className="text-gray-500 text-sm mt-0.5">Overview KIP-K Institut Teknologi Garut</p>
        </div>
        <TahunAjaranFilter
          value={filterTahunAjaran}
          onChange={setFilterTahunAjaran}
        />
      </div>

      {/* Notification */}
      {data && data.pendingReports.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ClipboardList size={24} className="text-amber-500 mt-1" />
            <div>
              <p className="font-600 text-amber-800">Terdapat {data.pendingReports.length} laporan semester menunggu persetujuan Anda.</p>
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
          {data && data.pendingReports.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Tidak ada laporan menunggu persetujuan.
            </div>
          )}
          {data && data.pendingReports.map(r => (
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
          {data && data.approvedReports.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Belum ada laporan yang disetujui.
            </div>
          )}
          {data && data.approvedReports.map(r => (
            <div key={r.nomor} className="px-5 py-3.5 flex items-center gap-3">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-500 text-gray-700">{r.judul}</p>
                <p className="text-xs text-gray-400">{r.nomor} · Disetujui: {r.approvedDate ?? r.tanggal}</p>
              </div>
              <a href={`${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/laporan/${r.id}/pdf`}
                 target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
                <Download size={12} /> Unduh PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}