import { useState, useMemo } from "react";
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
} from "lucide-react";
import { mahasiswaList } from "@/data/mockData";

// ── Enriched mock data (IPK, trend, semester, kategori overrides, SP) ──────
const enriched: Record<string, {
  ipk: number;
  trendDelta: number;
  semester: number;
  kategori: "Reguler" | "Aspirasi";
  sp: "SP1" | "SP2" | "SP3" | null;
}> = {
  "2206001": { ipk: 3.35, trendDelta: +0.10, semester: 7,  kategori: "Reguler",  sp: null  },
  "2206002": { ipk: 2.85, trendDelta: -0.22, semester: 7,  kategori: "Aspirasi", sp: "SP2" },
  "2303001": { ipk: 3.12, trendDelta: +0.05, semester: 5,  kategori: "Reguler",  sp: "SP1" },
  "2211001": { ipk: 3.45, trendDelta: +0.15, semester: 7,  kategori: "Reguler",  sp: null  },
  "2420001": { ipk: 3.78, trendDelta: +0.20, semester: 3,  kategori: "Aspirasi", sp: null  },
  "2307001": { ipk: 3.92, trendDelta: +0.08, semester: 5,  kategori: "Reguler",  sp: null  },
  "2106001": { ipk: 2.95, trendDelta: -0.10, semester: 9,  kategori: "Reguler",  sp: null  },
  "2303002": { ipk: 2.70, trendDelta: -0.30, semester: 5,  kategori: "Aspirasi", sp: "SP3" },
  "2211002": { ipk: 2.88, trendDelta: -0.05, semester: 7,  kategori: "Reguler",  sp: "SP1" },
  "2207001": { ipk: 3.20, trendDelta: +0.12, semester: 7,  kategori: "Reguler",  sp: null  },
  "2306001": { ipk: 3.55, trendDelta: +0.18, semester: 5,  kategori: "Aspirasi", sp: null  },
  "2220001": { ipk: 3.40, trendDelta: +0.02, semester: 7,  kategori: "Reguler",  sp: null  },
};

// Merge enriched data into mahasiswaList
const students = mahasiswaList.map((m) => {
  const e = enriched[m.nim];
  return {
    ...m,
    ipk:       e?.ipk        ?? m.ipk,
    trendDelta: e?.trendDelta ?? 0,
    semester:  e?.semester   ?? m.semester,
    kategori:  (e?.kategori  ?? m.kategori) as "Reguler" | "Aspirasi",
    sp:        (e?.sp !== undefined ? e.sp : m.sp) as "SP1" | "SP2" | "SP3" | null,
  };
});

const PAGE_SIZE = 10;

// ── SP badges (accumulated) ────────────────────────────────────────────────
function SpBadges({ level }: { level: "SP1" | "SP2" | "SP3" }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
          level === "SP1"
            ? "bg-amber-100 text-amber-700"
            : "bg-gray-100 text-gray-400 line-through"
        }`}
      >
        SP1
      </span>
      {(level === "SP2" || level === "SP3") && (
        <span
          className={`px-1.5 py-0.5 rounded text-xs font-medium ${
            level === "SP2"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-400 line-through"
          }`}
        >
          SP2
        </span>
      )}
      {level === "SP3" && (
        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-red-900/10 text-red-900">
          SP3
        </span>
      )}
    </div>
  );
}

// ── Dropdown select helper ────────────────────────────────────────────────
function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 text-gray-600"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

export default function MahasiswaList() {
  // Filters
  const [search,        setSearch]        = useState("");
  const [prodiFilter,   setProdiFilter]   = useState("Semua");
  const [angkatanFilter, setAngkatanFilter] = useState("Semua");
  const [spFilter,      setSpFilter]      = useState("Semua");
  const [kipFilter,     setKipFilter]     = useState("Semua");
  const [ipkFilter,     setIpkFilter]     = useState("Semua");
  const [sortBy,        setSortBy]        = useState("IPK Tertinggi → Terendah");
  const [page,          setPage]          = useState(1);

  // Action menu & delete modal
  const [openMenu,         setOpenMenu]         = useState<number | null>(null);
  const [deleteModal,      setDeleteModal]      = useState<typeof students[0] | null>(null);
  const [deleteConfirmNim, setDeleteConfirmNim] = useState("");

  const isFiltered =
    search || prodiFilter !== "Semua" || angkatanFilter !== "Semua" ||
    spFilter !== "Semua" || kipFilter !== "Semua" || ipkFilter !== "Semua" ||
    sortBy !== "IPK Tertinggi → Terendah";

  function resetFilters() {
    setSearch(""); setProdiFilter("Semua"); setAngkatanFilter("Semua");
    setSpFilter("Semua"); setKipFilter("Semua"); setIpkFilter("Semua");
    setSortBy("IPK Tertinggi → Terendah"); setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = students.filter((m) => {
      if (search && !m.nama.toLowerCase().includes(q) && !m.nim.includes(q)) return false;
      if (prodiFilter !== "Semua" && m.prodi !== prodiFilter) return false;
      if (angkatanFilter !== "Semua" && String(m.angkatan) !== angkatanFilter) return false;
      if (spFilter === "Tanpa SP" && m.sp !== null) return false;
      if (spFilter === "SP1" && m.sp !== "SP1") return false;
      if (spFilter === "SP2" && m.sp !== "SP2") return false;
      if (spFilter === "SP3" && m.sp !== "SP3") return false;
      if (kipFilter === "KIP-K Reguler" && m.kategori !== "Reguler") return false;
      if (kipFilter === "KIP-K Aspirasi" && m.kategori !== "Aspirasi") return false;
      if (ipkFilter === "Di Bawah Standar (< 3.0)" && m.ipk >= 3.0) return false;
      if (ipkFilter === "Di Atas Standar (≥ 3.0)" && m.ipk < 3.0) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "IPK Tertinggi → Terendah": return b.ipk - a.ipk;
        case "IPK Terendah → Tertinggi": return a.ipk - b.ipk;
        case "Nama A–Z":                 return a.nama.localeCompare(b.nama);
        case "Angkatan Terbaru":         return b.angkatan - a.angkatan;
        default: return 0;
      }
    });

    return list;
  }, [search, prodiFilter, angkatanFilter, spFilter, kipFilter, ipkFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goPage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  return (
    <div className="space-y-5" onClick={() => setOpenMenu(null)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Manajemen Mahasiswa</h1>
          <p className="text-gray-500 text-sm mt-0.5">167 mahasiswa KIP-K terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={15} /> Import Massal
          </button>
          <Link
            to="/admin/mahasiswa/tambah"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: "#263F93" }}
          >
            <Plus size={15} /> Tambah Mahasiswa
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-[#E2E8F0]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari NIM atau Nama..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 focus:border-[#263F93]/30"
            />
          </div>

          <FilterSelect
            value={prodiFilter}
            onChange={(v) => { setProdiFilter(v); setPage(1); }}
            options={["Semua", "Teknik Informatika", "Sistem Informasi", "Teknik Industri", "Teknik Sipil", "Arsitektur"]}
          />

          <FilterSelect
            value={angkatanFilter}
            onChange={(v) => { setAngkatanFilter(v); setPage(1); }}
            options={["Semua", "2021", "2022", "2023", "2024"]}
          />

          <FilterSelect
            value={spFilter}
            onChange={(v) => { setSpFilter(v); setPage(1); }}
            options={["Semua", "Tanpa SP", "SP1", "SP2", "SP3"]}
          />

          <FilterSelect
            value={kipFilter}
            onChange={(v) => { setKipFilter(v); setPage(1); }}
            options={["Semua", "KIP-K Reguler", "KIP-K Aspirasi"]}
          />

          <FilterSelect
            value={ipkFilter}
            onChange={(v) => { setIpkFilter(v); setPage(1); }}
            options={["Semua", "Di Bawah Standar (< 3.0)", "Di Atas Standar (≥ 3.0)"]}
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
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["No", "NIM", "Nama", "Program Studi", "Angkatan", "Kategori", "IPK", "Progres IPK", "Semester", "Status", "SP", "Aksi"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-10 text-center text-gray-400 text-sm">
                    Tidak ada mahasiswa yang sesuai filter.
                  </td>
                </tr>
              ) : (
                paginated.map((m, i) => {
                  const globalIdx = (page - 1) * PAGE_SIZE + i + 1;
                  const trend = m.trendDelta;
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
                        {m.prodi
                          .replace("Teknik Informatika", "T. Informatika")
                          .replace("Teknik Industri", "T. Industri")
                          .replace("Teknik Sipil", "T. Sipil")
                          .replace("Sistem Informasi", "Sis. Informasi")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{m.angkatan}</td>
                      <td className="px-4 py-3">
                        {m.kategori === "Reguler" ? (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">Reguler</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">Aspirasi</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            m.ipk >= 3.0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {m.ipk.toFixed(2)}
                        </span>
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
                      <td className="px-4 py-3 text-gray-600 text-xs">{m.semester}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            m.status === "Aktif"
                              ? "bg-green-100 text-green-700"
                              : m.status === "Dicabut"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {m.sp ? (
                          <SpBadges level={m.sp} />
                        ) : (
                          <span className="text-gray-300 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(openMenu === m.id ? null : m.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical size={15} />
                        </button>
                        {openMenu === m.id && (
                          <div
                            className="absolute right-4 top-10 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 w-44 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              to={`/admin/mahasiswa/${m.id}`}
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Eye size={14} /> Lihat Detail
                            </Link>
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
        <div className="px-4 py-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-gray-500">
          <span>
            Menampilkan {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} mahasiswa
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded border border-[#E2E8F0] hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goPage(p)}
                className={`px-2.5 py-1 rounded border text-xs transition-colors ${
                  p === page
                    ? "border-[#263F93] bg-[#263F93] text-white"
                    : "border-[#E2E8F0] hover:bg-gray-50 text-gray-600"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => goPage(page + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-[#E2E8F0] hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg text-center mb-2">Hapus Data Mahasiswa</h3>
            <p className="text-gray-500 text-sm text-center mb-2">
              Anda akan menghapus data <strong>{deleteModal.nama}</strong>.
            </p>
            <p className="text-red-600 text-xs text-center font-medium mb-4">
              Data yang dihapus tidak dapat dikembalikan.
            </p>
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
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteModal(null); setDeleteConfirmNim(""); }}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                disabled={deleteConfirmNim !== deleteModal.nim}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ background: "#DC2626" }}
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
