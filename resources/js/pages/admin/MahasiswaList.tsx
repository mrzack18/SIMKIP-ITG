import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Download,
  MoreVertical,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  UserMinus,
  UserX,
  UserCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getMahasiswaList,
  getMahasiswaFilterOptions,
  deleteMahasiswa,
  updateMahasiswaStatus,
  cabutKipkMahasiswa,
  type MahasiswaFilter,
} from "@/services/mahasiswaService";
import type { Mahasiswa, PaginatedResponse } from "@/types";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";

// ─── SP badges (historical list with status) ─────────────────────────────────────────────────────────────────────────
function SpBadges({ spList }: { spList?: { level: string; status: string }[] | null }) {
  if (!spList || spList.length === 0) {
    return <span className="text-gray-300 text-sm">—</span>;
  }
  
  // Sort by level ascending
  const sorted = [...spList].sort((a, b) => a.level.localeCompare(b.level));

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {sorted.map(sp => {
        const isActive = sp.status === "Aktif" || sp.status === "Masa Tenggang";
        let bg = "bg-gray-100";
        let text = "text-gray-400";
        
        if (isActive) {
           if (sp.level === "SP1") { bg = "bg-amber-100"; text = "text-amber-700"; }
           else if (sp.level === "SP2") { bg = "bg-red-100"; text = "text-red-700"; }
           else { bg = "bg-red-900/10"; text = "text-red-900"; }
        }
        
        return (
          <span key={sp.level} className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${bg} ${text}`}>
            {sp.level}
          </span>
        );
      })}
    </div>
  );
}

// ── Dropdown select helper ────────────────────────────────────────────────
function FilterSelect({
  value,
  onChange,
  options,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 text-gray-600 disabled:opacity-50 w-full sm:w-auto max-w-full min-w-0 truncate"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

const LIMIT = 10;



export default function MahasiswaList() {
  // Filter options from BE
  const [prodiOptions, setProdiOptions]     = useState<string[]>([]);
  const [angkatanOptions, setAngkatanOptions] = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading]  = useState(true);

  // Filters
  const [searchInput,         setSearchInput]         = useState("");
  const [search,              setSearch]              = useState("");
  const [tahunAjaranFilter,   setTahunAjaranFilter]   = useState(getCurrentTahunAjaran());
  const [prodiFilter,         setProdiFilter]         = useState("Semua Prodi");
  const [angkatanFilter,      setAngkatanFilter]      = useState("Semua Angkatan");
  const [spFilter,            setSpFilter]            = useState("Semua SP");
  const [statusFilter,        setStatusFilter]        = useState("Semua Status");
  const [kipFilter,           setKipFilter]           = useState("Semua Kategori");
  const [ipkFilter,           setIpkFilter]           = useState("Semua IPK");
  const [sortBy,              setSortBy]              = useState("IPK Tertinggi → Terendah");
  const [page,                setPage]                = useState(1);

  // Data state
  const [students,   setStudents]   = useState<Mahasiswa[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  // Action menu & delete modal
  const [openMenu,         setOpenMenu]         = useState<number | null>(null);
  const [deleteModal,      setDeleteModal]      = useState<Mahasiswa | null>(null);
  const [deleteConfirmNim, setDeleteConfirmNim] = useState("");
  const [deleting,         setDeleting]         = useState(false);
  const [deleteError,      setDeleteError]      = useState("");

  const [nonaktifModal,   setNonaktifModal]   = useState<Mahasiswa | null>(null);
  const [nonaktifAlasan,  setNonaktifAlasan]  = useState("Cuti Akademik");
  const [nonaktifCatatan, setNonaktifCatatan] = useState("");
  const [nonaktifLoading, setNonaktifLoading] = useState(false);
  const [nonaktifError,   setNonaktifError]   = useState("");

  const [cabutModal,      setCabutModal]      = useState<Mahasiswa | null>(null);
  const [cabutConfirmNim, setCabutConfirmNim] = useState("");
  const [cabutAlasan,     setCabutAlasan]     = useState("IPK di Bawah Standar");
  const [cabutCatatan,    setCabutCatatan]    = useState("");
  const [cabutLoading,    setCabutLoading]    = useState(false);
  const [cabutError,      setCabutError]      = useState("");

  const isFiltered =
    search || tahunAjaranFilter !== getCurrentTahunAjaran() || prodiFilter !== "Semua Prodi" ||
    angkatanFilter !== "Semua Angkatan" || spFilter !== "Semua SP" ||
    statusFilter !== "Semua Status" || kipFilter !== "Semua Kategori" ||
    ipkFilter !== "Semua IPK" || sortBy !== "IPK Tertinggi → Terendah";

  // ── Load filter options from BE once on mount ──────────────────────────
  useEffect(() => {
    getMahasiswaFilterOptions()
      .then((opts) => {
        setProdiOptions(["Semua Prodi", ...opts.prodis.map((p) => p.nama)]);
        setAngkatanOptions(["Semua Angkatan", ...opts.angkatans.map(String)]);
      })
      .catch(() => {
        // Fallback: keep empty — filters still work without dynamic options
      })
      .finally(() => setOptionsLoading(false));
  }, []);

  // ── Build filter payload for BE ──────────────────────────────────────────
  const buildFilter = useCallback((): MahasiswaFilter => {
    const f: MahasiswaFilter = { page, limit: LIMIT };
    if (search)                                        f.search        = search;
    if (tahunAjaranFilter) f.tahun_ajaran  = tahunAjaranFilter;
    if (prodiFilter !== "Semua Prodi")                 f.prodi         = prodiFilter;
    if (angkatanFilter !== "Semua Angkatan")           f.angkatan      = angkatanFilter;
    if (spFilter !== "Semua SP")                       f.spFilter      = spFilter;
    if (statusFilter !== "Semua Status")               f.status        = statusFilter;
    if (kipFilter !== "Semua Kategori")                f.kipFilter     = kipFilter;
    if (ipkFilter !== "Semua IPK")                     f.ipkFilter     = ipkFilter;
    if (sortBy !== "IPK Tertinggi → Terendah")         f.sortBy        = sortBy;
    return f;
  }, [search, tahunAjaranFilter, prodiFilter, angkatanFilter, spFilter, statusFilter, kipFilter, ipkFilter, sortBy, page]);

  // ── Fetch list on filter/page change ────────────────────────────────────
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getMahasiswaList(buildFilter())
      .then((res: PaginatedResponse<Mahasiswa>) => {
        if (!active) return;
        setStudents(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(Math.max(1, res.totalPages || 1));
      })
      .catch((err: any) => {
        if (!active) return;
        setError(err?.message ?? "Gagal memuat data mahasiswa");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [buildFilter]);

  // ── Debounced search — only commits after 400ms idle ───────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value.trim());
      setPage(1);
    }, 400);
  };

  function resetFilters() {
    setSearchInput(""); setSearch("");
    setTahunAjaranFilter("Semua");
    setProdiFilter("Semua Prodi"); setAngkatanFilter("Semua Angkatan");
    setSpFilter("Semua SP"); setStatusFilter("Semua Status");
    setKipFilter("Semua Kategori"); setIpkFilter("Semua IPK");
    setSortBy("IPK Tertinggi → Terendah"); setPage(1);
  }

  function goPage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  async function handleDelete() {
    if (!deleteModal || deleteConfirmNim !== deleteModal.nim) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteMahasiswa(deleteModal.id, deleteConfirmNim);
      setDeleteModal(null);
      setDeleteConfirmNim("");
      const res = await getMahasiswaList(buildFilter());
      setStudents(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.max(1, res.totalPages || 1));
    } catch (err: any) {
      setDeleteError(err?.message ?? "Gagal menghapus data");
    } finally {
      setDeleting(false);
    }
  }

  async function handleUpdateStatus() {
    if (!nonaktifModal) return;
    setNonaktifLoading(true);
    setNonaktifError("");
    try {
      const status = nonaktifModal.status === "Aktif" ? "Nonaktif" : "Aktif";
      await updateMahasiswaStatus(nonaktifModal.id, {
        status,
        alasan_status: status === "Nonaktif" ? nonaktifAlasan : undefined,
        catatan_status: status === "Nonaktif" ? nonaktifCatatan : undefined,
      });
      setNonaktifModal(null);
      setNonaktifAlasan("Cuti Akademik");
      setNonaktifCatatan("");
      const res = await getMahasiswaList(buildFilter());
      setStudents(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.max(1, res.totalPages || 1));
    } catch (err: any) {
      setNonaktifError(err?.message ?? "Gagal mengubah status");
    } finally {
      setNonaktifLoading(false);
    }
  }

  async function handleCabut() {
    if (!cabutModal || cabutConfirmNim !== cabutModal.nim) return;
    setCabutLoading(true);
    setCabutError("");
    try {
      await cabutKipkMahasiswa(cabutModal.id, {
        alasan_cabut: cabutAlasan,
        catatan_cabut: cabutCatatan,
        konfirmasi_nim: cabutConfirmNim,
      });
      setCabutModal(null);
      setCabutConfirmNim("");
      setCabutAlasan("IPK di Bawah Standar");
      setCabutCatatan("");
      const res = await getMahasiswaList(buildFilter());
      setStudents(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.max(1, res.totalPages || 1));
    } catch (err: any) {
      setCabutError(err?.message ?? "Gagal mencabut KIP-K");
    } finally {
      setCabutLoading(false);
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0" onClick={() => setOpenMenu(null)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-bold text-lg sm:text-xl text-gray-900 leading-tight">Manajemen Mahasiswa</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{total} mahasiswa KIP-K terdaftar</p>
        </div>
        <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-2 w-full sm:w-auto">
          <TahunAjaranFilter
            value={tahunAjaranFilter}
            onChange={(v) => { setTahunAjaranFilter(v); setPage(1); }}
          />
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Download size={15} /> Import Massal
          </button>
          <Link
            to="/admin/mahasiswa/tambah"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors whitespace-nowrap"
            style={{ background: "#263F93" }}
          >
            <Plus size={15} /> Tambah Mahasiswa
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2 min-w-0">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 break-words min-w-0">{error}</p>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-xl px-3 sm:px-4 py-3 shadow-sm border border-[#E2E8F0] min-w-0">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative col-span-1 min-[480px]:col-span-2 lg:flex-1 lg:min-w-48 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari NIM atau Nama..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 focus:border-[#263F93]/30 min-w-0"
            />
          </div>


          {/* Prodi — from BE */}
          <FilterSelect
            value={prodiFilter}
            onChange={(v) => { setProdiFilter(v); setPage(1); }}
            options={optionsLoading ? ["Semua"] : prodiOptions}
            disabled={optionsLoading}
          />

          {/* Angkatan — from BE */}
          <FilterSelect
            value={angkatanFilter}
            onChange={(v) => { setAngkatanFilter(v); setPage(1); }}
            options={optionsLoading ? ["Semua"] : angkatanOptions}
            disabled={optionsLoading}
          />

          <FilterSelect
            value={spFilter}
            onChange={(v) => { setSpFilter(v); setPage(1); }}
            options={["Semua SP", "Tanpa SP", "SP1", "SP2", "SP3"]}
          />

          <FilterSelect
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1); }}
            options={["Semua Status", "Aktif", "Nonaktif", "Dicabut", "Lulus"]}
          />

          <FilterSelect
            value={kipFilter}
            onChange={(v) => { setKipFilter(v); setPage(1); }}
            options={["Semua Kategori", "KIP-K Reguler", "KIP-K Aspirasi"]}
          />

          <FilterSelect
            value={ipkFilter}
            onChange={(v) => { setIpkFilter(v); setPage(1); }}
            options={["Semua IPK", "Di Bawah Standar (< 3.0)", "Di Atas Standar (≥ 3.0)"]}
          />

          <FilterSelect
            value={sortBy}
            onChange={(v) => { setSortBy(v); setPage(1); }}
            options={["IPK Tertinggi → Terendah", "IPK Terendah → Tertinggi", "Nama A–Z", "Angkatan Terbaru"]}
          />

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#263F93] hover:underline px-2 py-1"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden min-w-0">
        <div className="overflow-x-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <Loader2 className="animate-spin text-[#263F93]" size={28} />
            </div>
          )}
          <table className="w-full min-w-[1020px] text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["No", "NIM", "Nama", "Program Studi", "Angkatan", "Kategori", "IPK", "Progres IPK", "Semester", "Status", "SP", "Aksi"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${h === "Aksi" ? "sticky right-0 bg-[#F8FAFC] shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.1)]" : ""}`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {students.length === 0 && !loading ? (
                <tr>
                  <td colSpan={12} className="px-4 py-10 text-center text-gray-400 text-sm">
                    Tidak ada mahasiswa yang sesuai filter.
                  </td>
                </tr>
              ) : (
                students.map((m, i) => {
                  const globalIdx = (page - 1) * LIMIT + i + 1;
                  const trend   = m.trendDelta ?? 0;
                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-[#F8FAFC]/70 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">{globalIdx}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{m.nim}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{m.nama}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                        {(m.prodi ?? "—")
                          .replace("Teknik Informatika", "T. Informatika")
                          .replace("Teknik Industri", "T. Industri")
                          .replace("Teknik Sipil", "T. Sipil")
                          .replace("Sistem Informasi", "Sis. Informasi")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{m.angkatan}</td>
                      <td className="px-4 py-3">
                        {m.kategori === "Reguler" ? (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">Reguler</span>
                        ) : m.kategori === "Aspirasi" ? (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">Aspirasi</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {m.ipk !== null ? (
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              m.ipk >= 3.0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {m.ipk.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 text-xs font-medium ${
                          trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-400"
                        }`}>
                          {trend > 0 ? (
                            <TrendingUp size={13} />
                          ) : trend < 0 ? (
                            <TrendingDown size={13} />
                          ) : (
                            <Minus size={13} />
                          )}
                          {trend !== 0 && (
                            <span>{trend > 0 ? "+" : ""}{trend.toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{m.semester ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            m.status === "Aktif"
                              ? "bg-green-100 text-green-700"
                              : m.status === "Dicabut"
                              ? "bg-red-100 text-red-700"
                              : m.status === "Lulus"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <SpBadges spList={m.spList} />
                      </td>
                      <td className="px-4 py-3 sticky right-0 bg-white shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.1)]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(openMenu === m.id ? null : m.id);
                          }}
                          aria-label="Menu aksi"
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical size={15} />
                        </button>
                        {openMenu === m.id && (
                          <div
                            className="absolute right-4 top-10 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 w-44 max-w-[calc(100vw-3rem)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              to={`/admin/mahasiswa/${m.id}`}
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Eye size={14} /> Lihat Detail
                            </Link>
                            {(m.status === "Aktif" || m.status === "Nonaktif") && (
                              <button
                                onClick={() => { setNonaktifModal(m); setOpenMenu(null); }}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm w-full transition-colors border-t border-[#E2E8F0] ${
                                  m.status === "Aktif" ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                                }`}
                              >
                                {m.status === "Aktif" ? (
                                  <><UserMinus size={14} /> Nonaktifkan</>
                                ) : (
                                  <><UserCheck size={14} /> Aktifkan</>
                                )}
                              </button>
                            )}
                            {(m.status === "Aktif" || m.status === "Nonaktif") && (
                              <button
                                onClick={() => { setCabutModal(m); setOpenMenu(null); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors border-t border-[#E2E8F0]"
                              >
                                <UserX size={14} /> Cabut KIP-K
                              </button>
                            )}
                            <button
                              onClick={() => { setDeleteModal(m); setOpenMenu(null); }}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors border-t border-[#E2E8F0]"
                            >
                              <Trash2 size={14} /> Hapus Data
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
          <span className="text-center sm:text-left break-words">
            {students.length === 0
              ? "Tidak ada data"
              : `Menampilkan ${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, total)} dari ${total} mahasiswa`}
          </span>
          <div className="flex items-center justify-center sm:justify-end gap-1 flex-wrap">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page === 1 || loading}
              className="p-1.5 rounded border border-[#E2E8F0] hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-1.5 text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goPage(p as number)}
                    disabled={loading}
                    className={`px-2.5 py-1 rounded border text-xs transition-colors ${
                      p === page
                        ? "border-[#263F93] bg-[#263F93] text-white"
                        : "border-[#E2E8F0] hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => goPage(page + 1)}
              disabled={page === totalPages || loading}
              className="p-1.5 rounded border border-[#E2E8F0] hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg text-center mb-2 break-words">Hapus Data Mahasiswa</h3>
            <p className="text-gray-500 text-sm text-center mb-2 break-words">
              Anda akan menghapus data <strong>{deleteModal.nama}</strong>.
            </p>
            <p className="text-red-600 text-xs text-center font-medium mb-4">
              Data yang dihapus tidak dapat dikembalikan.
            </p>
            {deleteError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{deleteError}</p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ketik NIM untuk konfirmasi:
              </label>
              <input
                value={deleteConfirmNim}
                onChange={(e) => setDeleteConfirmNim(e.target.value)}
                placeholder={deleteModal.nim}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
              />
            </div>
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => { setDeleteModal(null); setDeleteConfirmNim(""); setDeleteError(""); }}
                disabled={deleting}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmNim !== deleteModal.nim || deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                style={{ background: "#DC2626" }}
              >
                {deleting ? <><Loader2 size={14} className="animate-spin" /> Menghapus...</> : "Hapus Permanen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Nonaktif/Aktif confirmation modal ───────────────────────────── */}
      {nonaktifModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${nonaktifModal.status === "Aktif" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
              {nonaktifModal.status === "Aktif" ? <UserMinus size={20} /> : <UserCheck size={20} />}
            </div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg text-center mb-2 break-words">
              {nonaktifModal.status === "Aktif" ? "Nonaktifkan Mahasiswa" : "Aktifkan Mahasiswa"}
            </h3>
            <p className="text-gray-500 text-sm text-center mb-4 break-words">
              Mahasiswa: <strong>{nonaktifModal.nama}</strong>
            </p>
            {nonaktifError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{nonaktifError}</p>
              </div>
            )}
            {nonaktifModal.status === "Aktif" ? (
              <div className="mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Alasan Nonaktif</label>
                  <select
                    value={nonaktifAlasan}
                    onChange={(e) => setNonaktifAlasan(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    <option>Cuti Akademik</option>
                    <option>Masalah Administrasi</option>
                    <option>Permintaan Sendiri</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Tambahan (Opsional)</label>
                  <textarea
                    value={nonaktifCatatan}
                    onChange={(e) => setNonaktifCatatan(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4 space-y-4 text-center text-sm text-gray-600">
                Apakah Anda yakin ingin mengaktifkan kembali status mahasiswa ini?
              </div>
            )}
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => { setNonaktifModal(null); setNonaktifError(""); }}
                disabled={nonaktifLoading}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={nonaktifLoading}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                style={{ background: nonaktifModal.status === "Aktif" ? "#F59E0B" : "#10B981" }}
              >
                {nonaktifLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
                ) : (
                  nonaktifModal.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cabut KIP-K confirmation modal ───────────────────────────────── */}
      {cabutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg text-center mb-2 break-words">Cabut KIP-K Mahasiswa</h3>
            <p className="text-gray-500 text-sm text-center mb-4 break-words">
              Mahasiswa: <strong>{cabutModal.nama}</strong>
            </p>
            {cabutError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{cabutError}</p>
              </div>
            )}
            <div className="mb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alasan Pencabutan</label>
                <select
                  value={cabutAlasan}
                  onChange={(e) => setCabutAlasan(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  <option>IPK di Bawah Standar</option>
                  <option>Cuti Tanpa Izin</option>
                  <option>Pelanggaran Berat</option>
                  <option>SP3 Otomatis</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Tambahan (Opsional)</label>
                <textarea
                  value={cabutCatatan}
                  onChange={(e) => setCabutCatatan(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ketik NIM untuk konfirmasi pencabutan:
                </label>
                <input
                  value={cabutConfirmNim}
                  onChange={(e) => setCabutConfirmNim(e.target.value)}
                  placeholder={cabutModal.nim}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />
              </div>
            </div>
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => { setCabutModal(null); setCabutConfirmNim(""); setCabutError(""); }}
                disabled={cabutLoading}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Batal
              </button>
              <button
                onClick={handleCabut}
                disabled={cabutConfirmNim !== cabutModal.nim || cabutLoading}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                style={{ background: "#DC2626" }}
              >
                {cabutLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> Memproses...</>
                ) : (
                  "Cabut Permanen"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
