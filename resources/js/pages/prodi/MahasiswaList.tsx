import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { getMahasiswaFilterOptions, getProdiMahasiswaList } from "@/services/mahasiswaService";
import type { Mahasiswa } from "@/types";
import { TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";
const PAGE_SIZE = 10;

export default function ProdiMahasiswaList() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterTahunAjaran, setFilterTahunAjaran] = useState("Semua");
  const [filterAngkatan, setFilterAngkatan] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [sortBy, setSortBy] = useState("NIM (A-Z)");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Mahasiswa[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [angkatans, setAngkatans] = useState<number[]>([]);
  const [exporting, setExporting] = useState(false);

  // Load filter options (angkatans) once
  useEffect(() => {
    getMahasiswaFilterOptions()
      .then((opt) => setAngkatans(opt.angkatans))
      .catch(() => setAngkatans([]));
  }, []);

  // Load data with debounce
  useEffect(() => {
    let active = true;
    setLoading(true);
    const timer = setTimeout(() => {
      getProdiMahasiswaList({
        search,
        tahun_ajaran: filterTahunAjaran === "Semua" ? undefined : filterTahunAjaran,
        angkatan: filterAngkatan,
        kategori: filterKategori,
        status: filterStatus,
        sortBy,
        page,
        limit: PAGE_SIZE,
      } as any)
        .then((res) => {
          if (!active) return;
          setRows((res.data ?? []) as unknown as Mahasiswa[]);
          setTotal(res.total ?? 0);
          setTotalPages(res.totalPages ?? 1);
        })
        .catch(() => { if (active) { setRows([]); setTotal(0); setTotalPages(1); } })
        .finally(() => { if (active) setLoading(false); });
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [search, filterTahunAjaran, filterAngkatan, filterKategori, filterStatus, sortBy, page]);

  const prodiNama = user?.prodi ?? "Program Studi";

  const handleExport = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams({
        angkatan: filterAngkatan,
        tahun_ajaran: filterTahunAjaran === "Semua" ? undefined : filterTahunAjaran,
        kategori: filterKategori,
        status: filterStatus === "Semua Status" ? "Semua" : filterStatus,
        tahun_akademik: "2025/2026",
        semester: "Genap",
        sertakan_ipk: "true",
        sertakan_dokumen: "true",
        sertakan_sp: "false",
        format: "xlsx",
      });
      const token = localStorage.getItem("simkip_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/ekspor/mahasiswa/download?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}`, "X-Requested-With": "XMLHttpRequest" },
      });
      if (!res.ok) throw new Error("Gagal mengunduh file.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Mahasiswa_KIP-K_${prodiNama.replace(/\s+/g, "_")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Gagal mengekspor data. Coba lagi nanti.");
    } finally {
      setExporting(false);
    }
  };

  const statusBadge: Record<string, string> = {
    Aktif: "bg-green-100 text-green-700",
    Lulus: "bg-blue-100 text-blue-700",
    Dicabut: "bg-red-100 text-red-700",
    Nonaktif: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Mahasiswa KIP-K — {prodiNama}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} mahasiswa ditemukan (read-only)</p>
        </div>
        <div className="flex items-center gap-3">
          <TahunAjaranFilter value={filterTahunAjaran} onChange={v => { setFilterTahunAjaran(v); setPage(1); }} />
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            <Download size={15} /> {exporting ? "Mengekspor..." : "Export Excel"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari NIM atau nama..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20" />
          </div>
          {[
            { label: "Urutkan", value: sortBy, setter: setSortBy, opts: ["NIM (A-Z)", "NIM (Z-A)", "Nama (A-Z)", "Nama (Z-A)", "IPK (Tertinggi)", "IPK (Terendah)"] },
            { label: "Angkatan", value: filterAngkatan, setter: setFilterAngkatan, opts: ["Semua", ...angkatans.map(String)] },
            { label: "Kategori", value: filterKategori, setter: setFilterKategori, opts: ["Semua", "Reguler", "Aspirasi"] },
            { label: "Status", value: filterStatus, setter: setFilterStatus, opts: ["Semua Status", "Aktif", "Nonaktif", "Dicabut", "Lulus"] },
          ].map(f => (
            <select key={f.label} value={f.value} onChange={e => { f.setter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none">
              {f.opts.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {["No", "NIM", "Nama", "Angkatan", "Kategori", "IPK Terakhir", "Semester", "Status", "SP", "Aksi"].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-400">Memuat data…</td></tr>
              )}
              {!loading && rows.map((m, i) => (
                <tr key={m.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{m.nim}</td>
                  <td className="px-4 py-3 font-500 text-gray-800">{m.nama}</td>
                  <td className="px-4 py-3 text-gray-600">{m.angkatan}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-500 ${m.kategori === "Reguler" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{m.kategori}</span>
                  </td>
                  <td className="px-4 py-3">
                    {m.ipk !== null ? (
                      <span className={`font-700 font-display ${m.ipk >= 3.0 ? "text-green-600" : "text-red-500"}`}>{m.ipk.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.semester}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-500 ${statusBadge[m.status] ?? "bg-gray-100 text-gray-700"}`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {m.sp ? (
                      <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-500">{m.sp}</span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/prodi/mahasiswa/${m.id}`} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 w-fit">
                      <Eye size={12} /> Lihat
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-400">Tidak ada data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-400 text-xs">Halaman {page} dari {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}