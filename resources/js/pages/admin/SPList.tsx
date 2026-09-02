import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Plus, Search, Clock, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { getSPList } from "@/services/spService";
import { getMahasiswaFilterOptions } from "@/services/mahasiswaService";
import type { SuratPeringatan } from "@/types";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";

const levelColor: Record<string, { bg: string; text: string }> = {
  SP1: { bg: "#FEF3C7", text: "#92400E" },
  SP2: { bg: "#FEE2E2", text: "#991B1B" },
  SP3: { bg: "#7F1D1D", text: "#FEE2E2" },
};

const statusStyle: Record<string, string> = {
  "Aktif": "bg-yellow-100 text-yellow-700",
  "Masa Tenggang": "bg-orange-100 text-orange-700",
  "Pemberhentian": "bg-red-100 text-red-700",
  "Selesai": "bg-green-100 text-green-700",
};

const SP_FILTER_OPTIONS = ["Semua SP", "SP1", "SP2", "SP3", "Selesai"] as const;
type SpFilterValue = typeof SP_FILTER_OPTIONS[number];

export default function SPList() {
  const [search, setSearch] = useState("");
  const [spFilter, setSpFilter] = useState<SpFilterValue>("Semua SP");
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran());
  const [list, setList] = useState<SuratPeringatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  // Full list for summary card counts (no spFilter/search filter, high limit)
  const [fullList, setFullList] = useState<SuratPeringatan[]>([]);
  const [selectedProdi, setSelectedProdi] = useState('Semua Prodi');
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua Angkatan');
  const [prodiOptions, setProdiOptions] = useState<string[]>(['Semua Prodi']);
  const [angkatanOptions, setAngkatanOptions] = useState<string[]>(['Semua Angkatan']);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load prodi and angkatan filter options
  useEffect(() => {
    getMahasiswaFilterOptions().then(res => {
      setProdiOptions(['Semua Prodi', ...(res.prodis || []).map((p) => p.nama)]);
      setAngkatanOptions(['Semua Angkatan', ...(res.angkatans || [])]);
    }).catch(() => {});
  }, []);

  // Full list for counts — refetches when search changes (not spFilter)
  useEffect(() => {
    let active = true;
    getSPList({ search: search || undefined, limit: 9999, tahun_ajaran: tahunAjaran, prodi: selectedProdi !== 'Semua Prodi' ? selectedProdi : undefined, angkatan: selectedAngkatan !== 'Semua Angkatan' ? selectedAngkatan : undefined })
      .then(res => { if (active) setFullList(res.data); });
    return () => { active = false; };
  }, [search, tahunAjaran, selectedProdi, selectedAngkatan]);

  // Paginated display data — refetches on spFilter/page/search change
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const levelFilter = spFilter === "Semua SP" || spFilter === "Selesai" ? undefined : spFilter;
    const statusFilter = spFilter === "Selesai" ? "Selesai" : undefined;

    getSPList({
      search: search || undefined,
      level: levelFilter,
      status: statusFilter,
      page: currentPage,
      limit: 10,
      tahun_ajaran: tahunAjaran,
      prodi: selectedProdi !== 'Semua Prodi' ? selectedProdi : undefined,
      angkatan: selectedAngkatan !== 'Semua Angkatan' ? selectedAngkatan : undefined,
    })
      .then(res => {
        if (!active) return;
        setList(res.data);
        setTotalPages(Math.max(1, res.totalPages));
        setTotalItems(res.total);
      })
      .catch(err => {
        if (!active) return;
        setError(err?.message ?? "Gagal memuat data SP");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [search, spFilter, currentPage, tahunAjaran, selectedProdi, selectedAngkatan, refreshKey]);

  // Listen for SP status changes from detail page
  useEffect(() => {
    const handler = () => {
      setRefreshKey(k => k + 1);
      getSPList({ search: search || undefined, limit: 9999, tahun_ajaran: tahunAjaran, prodi: selectedProdi !== 'Semua Prodi' ? selectedProdi : undefined, angkatan: selectedAngkatan !== 'Semua Angkatan' ? selectedAngkatan : undefined })
        .then(res => setFullList(res.data))
        .catch(() => {});
    };
    window.addEventListener('sp:updated', handler);
    return () => window.removeEventListener('sp:updated', handler);
  }, [search, tahunAjaran, selectedProdi, selectedAngkatan]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleSpFilterChange = (v: SpFilterValue) => {
    setSpFilter(v);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setSpFilter("Semua SP");
    setSelectedProdi("Semua Prodi");
    setSelectedAngkatan("Semua Angkatan");
    setCurrentPage(1);
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  // Counts from fullList (unfiltered by tab)
  const cardCounts = {
    sp1: fullList.filter(s => s.level === "SP1" && s.status !== "Selesai").length,
    sp2: fullList.filter(s => s.level === "SP2" && s.status !== "Selesai").length,
    sp3: fullList.filter(s => s.level === "SP3").length,
    selesai: fullList.filter(s => s.status === "Selesai").length,
  };

  const pageLabel = totalItems === 0
    ? "Tidak ada data"
    : `Menampilkan ${Math.min((currentPage - 1) * 10 + 1, totalItems)}–${Math.min(currentPage * 10, totalItems)} dari ${totalItems}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Surat Peringatan</h1>
          <p className="text-gray-500 text-sm mt-0.5">Daftar dan riwayat penerbitan SP mahasiswa KIP-K</p>
        </div>
        <div className="flex items-center gap-3">
          <TahunAjaranFilter value={tahunAjaran} onChange={v => { setTahunAjaran(v); setCurrentPage(1); }} />
          <Link to="/admin/sp/terbitkan"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 text-white shadow-sm hover:shadow-md transition-shadow"
            style={{ background: "#DC2626" }}>
            <Plus size={15} /> Terbitkan SP Baru
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "SP1 Aktif", value: cardCounts.sp1, color: "#F59E0B" },
          { label: "SP2 Aktif", value: cardCounts.sp2, color: "#EF4444" },
          { label: "SP3 (Diberhentikan)", value: cardCounts.sp3, color: "#7F1D1D" },
          { label: "SP Selesai (Dipulihkan)", value: cardCounts.selesai, color: "#059669" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-3 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
            <div>
              <div className="font-display font-700 text-2xl text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter row */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative min-w-48 sm:min-w-56 md:flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => handleSearchChange(e.target.value)} placeholder="Cari NIM atau Nama..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 text-gray-700" />
        </div>

        <select value={spFilter} onChange={e => handleSpFilterChange(e.target.value as SpFilterValue)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 text-gray-700">
          {SP_FILTER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <select value={selectedProdi} onChange={e => { setSelectedProdi(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 text-gray-700">
          {prodiOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select value={selectedAngkatan} onChange={e => { setSelectedAngkatan(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 text-gray-700">
          {angkatanOptions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <button onClick={resetFilters}
          className="px-3 py-2 text-sm text-[#263F93] hover:bg-[#263F93]/5 rounded-lg transition-colors font-500 border border-[#263F93]/20">
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["NIM", "Nama", "Prodi", "Tingkat SP", "Alasan", "Tgl. Terbit", "Batas Evaluasi", "Status", "Aksi"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">
                    <Loader2 size={16} className="animate-spin inline mr-2" />Memuat data…
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <AlertTriangle size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">Tidak ada data surat peringatan</p>
                  </td>
                </tr>
              ) : list.map(sp => {
                const lc = levelColor[sp.level] ?? { bg: "#F3F4F6", text: "#374151" };
                const prodiName = sp.prodi?.replace("Teknik ", "T.") ?? "—";
                return (
                  <tr key={sp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{sp.nim}</td>
                    <td className="px-4 py-3 font-500 text-gray-800">{sp.nama}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{prodiName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-700"
                        style={{ background: lc.bg, color: lc.text }}>
                        {sp.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-40 truncate">{sp.alasan}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{sp.tanggalTerbit ?? "—"}</td>
                    <td className="px-4 py-3">
                      {sp.batasEvaluasi ? (
                        <div>
                          <div className="text-xs text-gray-600">{sp.batasEvaluasi}</div>
                          {sp.sisa > 0 && (
                            <div className="flex items-center gap-1 text-xs text-orange-500 mt-0.5">
                              <Clock size={10} /> Sisa {sp.sisa} hari
                            </div>
                          )}
                        </div>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-500 ${statusStyle[sp.status] || "bg-gray-100 text-gray-600"}`}>
                        {sp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/sp/${sp.id}`} className="text-xs text-[#263F93] hover:underline font-500">Detail</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && list.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-500">{pageLabel}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[32px] h-8 rounded-md text-xs font-500 transition-colors ${
                      page === currentPage
                        ? "bg-[#263F93] text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
