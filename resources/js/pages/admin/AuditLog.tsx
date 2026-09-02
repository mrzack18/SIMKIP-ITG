import { useState, useEffect, useCallback } from "react";
import { Search, Download, X, CircleDot, Loader2, AlertCircle } from "lucide-react";
import { getAuditLogs, type AuditLogEntry, type AuditLogFilter } from "@/services/auditService";
import { TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";

const jenisStyle: Record<string, { border: string; badge: string; label: string; icon: React.ReactNode }> = {
  SP: { border: "border-l-red-500", badge: "bg-red-100 text-red-700", label: "SP", icon: <CircleDot size={12} className="text-red-500" /> },
  Validasi: { border: "border-l-green-500", badge: "bg-green-100 text-green-700", label: "Validasi", icon: <CircleDot size={12} className="text-green-500" /> },
  Hapus: { border: "border-l-red-900", badge: "bg-red-200 text-red-900", label: "Hapus Data", icon: <CircleDot size={12} className="text-red-900" /> },
  Approve: { border: "border-l-blue-500", badge: "bg-blue-100 text-blue-700", label: "Approve", icon: <CircleDot size={12} className="text-blue-500" /> },
  Login: { border: "border-l-gray-400", badge: "bg-gray-100 text-gray-600", label: "Login", icon: <CircleDot size={12} className="text-gray-400" /> },
  Ubah: { border: "border-l-yellow-500", badge: "bg-yellow-100 text-yellow-700", label: "Perubahan", icon: <CircleDot size={12} className="text-yellow-500" /> },
  Ekspor: { border: "border-l-purple-500", badge: "bg-purple-100 text-purple-700", label: "Ekspor", icon: <CircleDot size={12} className="text-purple-500" /> },
  Laporan: { border: "border-l-indigo-500", badge: "bg-indigo-100 text-indigo-700", label: "Laporan", icon: <CircleDot size={12} className="text-indigo-500" /> },
  Tambah: { border: "border-l-teal-500", badge: "bg-teal-100 text-teal-700", label: "Tambah", icon: <CircleDot size={12} className="text-teal-500" /> },
};

const formatWaktu = (iso: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
};

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
};

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<AuditLogEntry | null>(null);
  const [tahunAjaran, setTahunAjaran] = useState("Semua");

  const fetchLogs = useCallback(async (filter: AuditLogFilter) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAuditLogs({ ...filter, limit: 20 });
      setLogs(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err?.message ?? "Gagal memuat audit log");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs({
      search: search || undefined,
      jenis: jenisFilter !== "Semua" ? jenisFilter : undefined,
      dari: dari || undefined,
      sampai: sampai || undefined,
      page: currentPage,
      limit: 20,
    });
  }, [search, jenisFilter, dari, sampai, currentPage, fetchLogs]);

  const handleSearchChange = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleJenisChange = (val: string) => { setJenisFilter(val); setCurrentPage(1); };
  const handleDariChange = (val: string) => { setDari(val); setCurrentPage(1); };
  const handleSampaiChange = (val: string) => { setSampai(val); setCurrentPage(1); };
  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  const pageStart = total > 0 ? (currentPage - 1) * 20 + 1 : 0;
  const pageEnd = Math.min(currentPage * 20, total);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Riwayat Aktivitas Sistem</h1>
          <p className="text-gray-500 text-sm mt-0.5">Audit log lengkap untuk keperluan BPK/Inspektorat</p>
        </div>
        <div className="flex items-center gap-2">
          <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={15} /> Export Log
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari NIM, nama, atau deskripsi..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
          />
        </div>
        <select
          value={jenisFilter}
          onChange={(e) => handleJenisChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {["Semua", "SP", "Validasi", "Hapus", "Approve", "Login", "Ubah", "Ekspor", "Laporan", "Tambah"].map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <input
          type="date"
          value={dari}
          onChange={(e) => handleDariChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500"
          placeholder="Dari"
        />
        <span className="text-gray-300 self-center hidden sm:block">—</span>
        <input
          type="date"
          value={sampai}
          onChange={(e) => handleSampaiChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500"
          placeholder="Sampai"
        />

      </div>

      {/* Log table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Waktu", "Aktivitas", "Deskripsi", "Terkait Mahasiswa", "Dilakukan Oleh", "IP Address"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <Loader2 size={16} className="inline animate-spin mr-2" />Memuat data…
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    Tidak ada entri log yang sesuai filter.
                  </td>
                </tr>
              ) : logs.map(l => {
                const js = jenisStyle[l.jenis] ?? {
                  border: "border-l-gray-300",
                  badge: "bg-gray-100 text-gray-600",
                  label: l.jenis,
                  icon: <CircleDot size={12} className="text-gray-400" />,
                };
                return (
                  <tr
                    key={l.id}
                    onClick={() => setDetail(l)}
                    className={`hover:bg-gray-50/60 cursor-pointer transition-colors border-l-4 ${js.border}`}
                  >
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{formatWaktu(l.waktu)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-500 ${js.badge}`}>
                        <span className="flex items-center gap-1.5">{js.icon} {l.aktivitas}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-48 truncate">{l.deskripsi ?? "—"}</td>
                    <td className="px-4 py-3">
                      {l.terkait_nim ? (
                        <div>
                          <div className="font-mono text-xs text-gray-600">{l.terkait_nim}</div>
                          <div className="text-xs text-gray-400">{l.terkait_nama ?? "—"}</div>
                        </div>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{l.dilakukan_oleh ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{l.ip ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && logs.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Menampilkan {pageStart}–{pageEnd} dari {total} entri</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              <span className="px-3 text-gray-600">{currentPage} / {totalPages}</span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {(jenisStyle[detail.jenis] ?? { badge: "bg-gray-100 text-gray-600" }).badge && (
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-600 ${(jenisStyle[detail.jenis] ?? { badge: "bg-gray-100 text-gray-600" }).badge}`}>
                    <span className="flex items-center gap-1.5">{(jenisStyle[detail.jenis] ?? { icon: null }).icon} {detail.aktivitas}</span>
                  </span>
                )}
              </div>
              <button onClick={() => setDetail(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Waktu</span>
                  <span className="font-500 text-gray-800">{formatWaktu(detail.waktu)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dilakukan Oleh</span>
                  <span className="font-500 text-gray-800">{detail.dilakukan_oleh ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IP Address</span>
                  <span className="font-mono text-gray-600">{detail.ip ?? "—"}</span>
                </div>
                {detail.terkait_nim && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">NIM Terkait</span>
                      <span className="font-mono text-gray-800">{detail.terkait_nim}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nama Terkait</span>
                      <span className="font-500 text-gray-800">{detail.terkait_nama ?? "—"}</span>
                    </div>
                  </>
                )}
              </div>
              {detail.deskripsi && (
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Deskripsi Lengkap</span>
                  <p className="mt-1 text-gray-700 leading-relaxed">{detail.deskripsi}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setDetail(null)}
              className="mt-5 w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
