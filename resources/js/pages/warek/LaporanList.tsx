import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Clock, RotateCcw, Download } from "lucide-react";
import { api } from "@/services/api";
import { TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";
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
  const [filterTahunAjaran, setFilterTahunAjaran] = useState("Semua");
  const [data, setData] = useState<Laporan[]>([]);
  const [counts, setCounts] = useState<Record<LStatus, number>>({ Menunggu: 0, Disetujui: 0, Dikembalikan: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch counts for all tabs once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tabsToFetch: LStatus[] = ["Menunggu", "Disetujui", "Dikembalikan"];
        const results = await Promise.all(
          tabsToFetch.map((s) =>
            api
              .get<{ data: Laporan[]; total: number }>(`/laporan?status=${s}&limit=100&tahun_ajaran=${filterTahunAjaran === "Semua" ? "" : filterTahunAjaran}`)
              .then((r) => [s, r.total] as [LStatus, number])
              .catch(() => [s, 0] as [LStatus, number])
          )
        );
        if (cancelled) return;
        const next = { Menunggu: 0, Disetujui: 0, Dikembalikan: 0 } as Record<LStatus, number>;
        for (const [s, t] of results) next[s] = t;
        setCounts(next);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filterTahunAjaran]);

  // Fetch data for active tab
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ data: Laporan[] }>(`/laporan?status=${activeTab}&limit=100&tahun_ajaran=${filterTahunAjaran === "Semua" ? "" : filterTahunAjaran}`);
        if (cancelled) return;
        setData(res.data ?? []);
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setError(e.message ?? "Gagal memuat laporan.");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, filterTahunAjaran]);

  const filtered = data;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Laporan Semester</h1>
          <p className="text-gray-500 text-sm mt-0.5">Review dan setujui laporan evaluasi semester dari Biro Kemahasiswaan</p>
        </div>
        <TahunAjaranFilter value={filterTahunAjaran} onChange={setFilterTahunAjaran} />
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-wrap items-center gap-4">

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {TABS.map(t => (
            <button key={t.status}
              onClick={() => setActiveTab(t.status as LStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-500 transition-colors ${activeTab === t.status ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {t.label} ({counts[t.status as LStatus] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {loading && (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Memuat data...</p>
          </div>
        )}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-700">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Tidak ada laporan dalam kategori ini.</p>
          </div>
        )}
        {!loading && !error && filtered.map(r => {
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
                    <a href={`${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/laporan/${r.id}/pdf`}
                       target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                      <Download size={14} /> Unduh PDF
                    </a>
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