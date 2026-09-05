import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, FileCheck, ArrowRight, Download, CheckCircle, ClipboardList, BookOpen } from "lucide-react";
import { api } from "@/services/api";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";
import { useAuth } from "@/context/AuthContext";
import logoItg from "@/imports/logo_itg.jpg";
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
  const { user } = useAuth();
  const [filterTahunAjaran, setFilterTahunAjaran] = useState(getCurrentTahunAjaran());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<DashboardData>(`/warek/dashboard?tahun_ajaran=${filterTahunAjaran}`);
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


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#263F93]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4 text-center text-xs sm:text-sm text-red-500 break-words">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img src={logoItg} alt="ITG Logo" className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 object-contain rounded-lg shadow-sm border border-gray-100" />
          <div className="min-w-0">
            <h1 className="font-bold text-lg sm:text-xl text-[#263F93] leading-tight break-words">
              Selamat datang, {user?.nama ?? "Wakil Rektor III"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-2 w-full sm:w-auto shrink-0">
          <TahunAjaranFilter
            value={filterTahunAjaran}
            onChange={setFilterTahunAjaran}
          />
          <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#D4A72C] text-[#263F93] whitespace-nowrap self-start min-[420px]:self-center">
            Wakil Rektor III
          </span>
        </div>
      </div>

      {/* Notification */}
      {data && data.pendingReports.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 sm:px-4 py-3.5 sm:py-4 flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-3 min-w-0">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <ClipboardList size={24} className="text-amber-500 mt-0.5 sm:mt-1 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-600 text-amber-800 text-xs sm:text-sm break-words">Terdapat {data.pendingReports.length} laporan semester menunggu persetujuan Anda.</p>
              <p className="text-xs text-amber-600 mt-0.5 break-words">Silakan review dan berikan tanda tangan digital untuk finalisasi laporan.</p>
            </div>
          </div>
          <Link to="/warek/laporan" className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-500 text-white bg-amber-500 hover:bg-amber-600 w-full min-[480px]:w-auto whitespace-nowrap">
            Review Sekarang <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-3 sm:p-4 min-w-0">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-[#263F93]/10 flex items-center justify-center">
              <Users size={18} className="text-[#263F93]" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight break-words">
              Total Mahasiswa<br />KIP-K Aktif
            </p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#263F93]">{data?.stats.totalMahasiswaAktif}</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            Semua prodi
          </span>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-3 sm:p-4 min-w-0">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight break-words">Reguler / Aspirasi</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#263F93] break-words">
            {data?.stats.regulerCount} <span className="text-lg sm:text-xl text-gray-400 font-medium">/ {data?.stats.aspirasiCount}</span>
          </p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            Split kategori
          </span>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-3 sm:p-4 min-w-0">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-purple-50 flex items-center justify-center">
              <FileCheck size={18} className="text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight break-words">Laporan Disetujui<br />Semester Ini</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#263F93]">{data?.stats.laporanDisetujuiSemesterIni}</p>
          <span className="inline-block max-w-full truncate mt-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            {data?.stats.currentPeriode || "2025/2026 Genap"}
          </span>
        </div>
      </div>

      {/* Pending reports */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden min-w-0">
        <div className="px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between gap-2 min-w-0">
          <h2 className="font-600 text-gray-800 text-sm truncate">Laporan Menunggu Persetujuan</h2>
          <Link to="/warek/laporan" className="text-xs text-[#263F93] hover:underline flex items-center gap-1 shrink-0">Lihat Semua <ArrowRight size={12} /></Link>
        </div>
        <div className="divide-y divide-gray-50">
          {data && data.pendingReports.length === 0 && (
            <div className="px-3 sm:px-4 py-8 text-center text-sm text-gray-400">
              Tidak ada laporan menunggu persetujuan.
            </div>
          )}
          {data && data.pendingReports.map(r => (
            <div key={r.id} className="px-3 sm:px-4 py-3.5 sm:py-4 flex flex-wrap items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <FileCheck size={18} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0 basis-48">
                <p className="font-600 text-gray-800 text-sm break-words">{r.judul}</p>
                <p className="text-xs text-gray-400 mt-0.5 break-words">{r.nomor} · Diajukan: {r.tanggal}</p>
                <p className="text-xs text-gray-500 mt-0.5 break-words">{r.summary}</p>
              </div>
              <Link to={`/warek/laporan/${r.id}`}
                className="w-full min-[480px]:w-auto flex items-center justify-center px-4 py-2 rounded-lg text-sm font-500 text-white bg-green-600 hover:bg-green-700 whitespace-nowrap">
                Review & Approve
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Approved reports */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden min-w-0">
        <div className="px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100 min-w-0">
          <h2 className="font-600 text-gray-800 text-sm">Laporan Telah Disetujui</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {data && data.approvedReports.length === 0 && (
            <div className="px-3 sm:px-4 py-8 text-center text-sm text-gray-400">
              Belum ada laporan yang disetujui.
            </div>
          )}
          {data && data.approvedReports.map(r => (
            <div key={r.nomor} className="px-3 sm:px-4 py-3 sm:py-3.5 flex flex-wrap items-center gap-2.5 sm:gap-3 min-w-0">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <div className="flex-1 min-w-0 basis-48">
                <p className="text-sm font-500 text-gray-700 break-words">{r.judul}</p>
                <p className="text-xs text-gray-400 break-words">{r.nomor} · Disetujui: {r.approvedDate ?? r.tanggal}</p>
              </div>
              <a href={`${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/laporan/${r.id}/pdf`}
                 target="_blank" rel="noopener noreferrer"
                 className="w-full min-[480px]:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap">
                <Download size={12} /> Unduh PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}