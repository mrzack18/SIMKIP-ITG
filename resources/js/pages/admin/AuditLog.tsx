import { useState, useEffect, useCallback } from "react";
import { Search, Download, X, CircleDot, Loader2, AlertCircle } from "lucide-react";
import { getAuditLogs, type AuditLogEntry, type AuditLogFilter } from "@/services/auditService";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";

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
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran());

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
    <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-display font-700 text-lg sm:text-xl text-gray-900 leading-tight">Riwayat Aktivitas Sistem</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Audit log lengkap untuk keperluan BPK/Inspektorat</p>
        </div>
        <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-2 w-full sm:w-auto shrink-0">
          <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Download size={15} /> Export Log
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2 min-w-0">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 break-words min-w-0">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl px-3 sm:px-4 py-3 shadow-sm border border-gray-100 grid grid-cols-1 min-[480px]:grid-cols-2 lg:flex lg:flex-wrap gap-2 lg:items-center min-w-0">
        <div className="relative col-span-1 min-[480px]:col-span-2 lg:flex-1 lg:min-w-48 min-w-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari NIM, nama, atau deskripsi..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 min-w-0"
          />
        </div>
        <select
          value={jenisFilter}
          onChange={(e) => handleJenisChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600 w-full sm:w-auto max-w-full min-w-0 truncate"
        >
          {["Semua", "SP", "Validasi", "Hapus", "Approve", "Login", "Ubah", "Ekspor", "Laporan", "Tambah"].map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 col-span-1 min-[480px]:col-span-2 lg:col-span-1 min-w-0">
          <input
            type="date"
            value={dari}
            onChange={(e) => handleDariChange(e.target.value)}
            aria-label="Dari tanggal"
            className="flex-1 lg:flex-none px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500 min-w-0"
            placeholder="Dari"
          />
          <span className="text-gray-300 shrink-0">—</span>
          <input
            type="date"
            value={sampai}
            onChange={(e) => handleSampaiChange(e.target.value)}
            aria-label="Sampai tanggal"
            className="flex-1 lg:flex-none px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500 min-w-0"
            placeholder="Sampai"
          />
        </div>

      </div>

      {/* Log table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
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
                      <span className={`px-2 py-0.5 rounded text-xs font-500 whitespace-nowrap ${js.badge}`}>
                        <span className="flex items-center gap-1.5">{js.icon} {l.aktivitas}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-48 truncate">{l.deskripsi ?? "—"}</td>
                    <td className="px-4 py-3 min-w-[140px]">
                      {l.terkait_nim ? (
                        <div className="min-w-0">
                          <div className="font-mono text-xs text-gray-600 whitespace-nowrap">{l.terkait_nim}</div>
                          <div className="text-xs text-gray-400 truncate">{l.terkait_nama ?? "—"}</div>
                        </div>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 break-words min-w-[120px]">{l.dilakukan_oleh ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">{l.ip ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && logs.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
            <span className="text-center sm:text-left">Menampilkan {pageStart}–{pageEnd} dari {total} entri</span>
            <div className="flex items-center justify-center sm:justify-end gap-1">
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
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl min-w-0">
            <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {(jenisStyle[detail.jenis] ?? { badge: "bg-gray-100 text-gray-600" }).badge && (
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-600 whitespace-nowrap ${(jenisStyle[detail.jenis] ?? { badge: "bg-gray-100 text-gray-600" }).badge}`}>
                    <span className="flex items-center gap-1.5">{(jenisStyle[detail.jenis] ?? { icon: null }).icon} {detail.aktivitas}</span>
                  </span>
                )}
              </div>
              <button onClick={() => setDetail(null)} aria-label="Tutup detail" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm min-w-0">
              <div className="bg-gray-50 rounded-xl p-3.5 sm:p-4 space-y-2 min-w-0">
                <div className="flex justify-between gap-3 min-w-0">
                  <span className="text-gray-400 shrink-0">Waktu</span>
                  <span className="font-500 text-gray-800 text-right break-words min-w-0">{formatWaktu(detail.waktu)}</span>
                </div>
                <div className="flex justify-between gap-3 min-w-0">
                  <span className="text-gray-400 shrink-0">Dilakukan Oleh</span>
                  <span className="font-500 text-gray-800 text-right break-words min-w-0">{detail.dilakukan_oleh ?? "—"}</span>
                </div>
                <div className="flex justify-between gap-3 min-w-0">
                  <span className="text-gray-400 shrink-0">IP Address</span>
                  <span className="font-mono text-gray-600 text-right break-all min-w-0">{detail.ip ?? "—"}</span>
                </div>
                {detail.terkait_nim && (
                  <>
                    <div className="flex justify-between gap-3 min-w-0">
                      <span className="text-gray-400 shrink-0">NIM Terkait</span>
                      <span className="font-mono text-gray-800 text-right break-all min-w-0">{detail.terkait_nim}</span>
                    </div>
                    <div className="flex justify-between gap-3 min-w-0">
                      <span className="text-gray-400 shrink-0">Nama Terkait</span>
                      <span className="font-500 text-gray-800 text-right break-words min-w-0">{detail.terkait_nama ?? "—"}</span>
                    </div>
                  </>
                )}
              </div>
              {detail.deskripsi && (
                <div className="min-w-0">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Deskripsi Lengkap</span>
                  <p className="mt-1 text-gray-700 leading-relaxed break-words">{detail.deskripsi}</p>
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
