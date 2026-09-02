import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/services/api";
import { TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";
interface Mhs {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  kategori: "Reguler" | "Aspirasi";
  ipk: number;
  semester: number;
  status: "Aktif" | "Nonaktif" | "Lulus" | "Dicabut";
  sp: string | null;
}

interface ApiResponse {
  data: Mhs[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PAGE_SIZE = 8;

export default function WarekMahasiswaList() {
  const [search, setSearch] = useState("");
  const [filterTahunAjaran, setFilterTahunAjaran] = useState("Semua");
  const [filterProdi, setFilterProdi] = useState("Semua");
  const [filterAngkatan, setFilterAngkatan] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [page, setPage] = useState(1);

  const [prodiList, setProdiList] = useState<string[]>(["Semua"]);
  const [angkatanList, setAngkatanList] = useState<string[]>(["Semua"]);
  const [data, setData] = useState<Mhs[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load filter options (prodi, angkatan)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ success: boolean; prodis: { nama: string }[]; angkatans: number[] }>(
          "/mahasiswa/filter-options"
        );
        if (cancelled) return;
        setProdiList(["Semua", ...res.prodis.map(p => p.nama)]);
        setAngkatanList(["Semua", ...res.angkatans.map(String)]);
      } catch {
        // ignore – will fall back to "Semua"
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load data with server-side filters + pagination
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (filterTahunAjaran !== "Semua") params.set("tahun_ajaran", filterTahunAjaran);
        if (filterProdi !== "Semua") params.set("prodi", filterProdi);
        if (filterAngkatan !== "Semua") params.set("angkatan", filterAngkatan);
        if (filterKategori !== "Semua") params.set("kategori", filterKategori);
        if (filterStatus !== "Semua") params.set("status", filterStatus);
        params.set("page", String(page));
        params.set("limit", String(PAGE_SIZE));

        const res = await api.get<ApiResponse>(`/mahasiswa?${params.toString()}`);
        if (cancelled) return;
        setData(res.data ?? []);
        setTotal(res.total ?? 0);
        setTotalPages(res.totalPages ?? 1);
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setError(e.message ?? "Gagal memuat data mahasiswa.");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search, filterTahunAjaran, filterProdi, filterAngkatan, filterKategori, filterStatus, page]);

  const paginated = useMemo(() => data, [data]);

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterTahunAjaran !== "Semua") params.set("tahun_ajaran", filterTahunAjaran);
    if (filterProdi !== "Semua") params.set("prodi", filterProdi);
    if (filterAngkatan !== "Semua") params.set("angkatan", filterAngkatan);
    if (filterKategori !== "Semua") params.set("kategori", filterKategori);
    if (filterStatus !== "Semua") params.set("status", filterStatus);

    const token = localStorage.getItem("simkip_token");
    const url = `${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/warek/mahasiswa/export?${params.toString()}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (!res.ok) throw new Error("Gagal mengunduh file.");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `Mahasiswa_KIP-K_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (e: any) {
      alert(e.message ?? "Gagal mengunduh file.");
    }
  };

  const statusBadge: Record<string, string> = {
    Aktif: "bg-green-100 text-green-700",
    Nonaktif: "bg-gray-100 text-gray-600",
    Lulus: "bg-blue-100 text-blue-700",
    Dicabut: "bg-red-100 text-red-700",
  };

  const prodiBadge: Record<string, string> = {
    "Teknik Informatika": "bg-blue-100 text-blue-700",
    "Sistem Informasi": "bg-violet-100 text-violet-700",
    "Teknik Industri": "bg-orange-100 text-orange-700",
    "Teknik Sipil": "bg-teal-100 text-teal-700",
    "Arsitektur": "bg-rose-100 text-rose-700",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Data Mahasiswa KIP-K — Semua Prodi</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} mahasiswa ditemukan (read-only)</p>
        </div>
        <div className="flex items-center gap-3">
          <TahunAjaranFilter value={filterTahunAjaran} onChange={v => { setFilterTahunAjaran(v); setPage(1); }} />
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 border border-gray-200 text-gray-700 hover:bg-gray-50">
            <Download size={15} /> Export Excel
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
            { label: "Prodi", value: filterProdi, setter: setFilterProdi, opts: prodiList },
            { label: "Angkatan", value: filterAngkatan, setter: setFilterAngkatan, opts: angkatanList },
            { label: "Kategori", value: filterKategori, setter: setFilterKategori, opts: ["Semua", "Reguler", "Aspirasi"] },
            { label: "Status", value: filterStatus, setter: setFilterStatus, opts: ["Semua", "Aktif", "Nonaktif", "Lulus", "Dicabut"] },
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
                {["No", "NIM", "Nama", "Program Studi", "Angkatan", "Kategori", "IPK", "Semester", "Status", "SP", "Aksi"].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr><td colSpan={11} className="px-4 py-10 text-center text-sm text-gray-400">Memuat data...</td></tr>
              )}
              {!loading && error && (
                <tr><td colSpan={11} className="px-4 py-10 text-center text-sm text-red-500">{error}</td></tr>
              )}
              {!loading && !error && paginated.map((m, i) => (
                <tr key={m.nim} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{m.nim}</td>
                  <td className="px-4 py-3 font-500 text-gray-800 whitespace-nowrap">{m.nama}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-500 ${prodiBadge[m.prodi] || "bg-gray-100 text-gray-600"}`}>
                      {(m.prodi ?? "").replace("Teknik ", "T.")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.angkatan}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-500 ${m.kategori === "Reguler" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{m.kategori}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-700 font-display ${m.ipk >= 3.0 ? "text-green-600" : "text-red-500"}`}>{(m.ipk ?? 0).toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.semester}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-500 ${statusBadge[m.status] ?? "bg-gray-100 text-gray-600"}`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {m.sp ? (
                      <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-500">{m.sp}</span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/warek/mahasiswa/${m.id}`} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 w-fit">
                      <Eye size={12} /> Lihat
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && !error && paginated.length === 0 && (
                <tr><td colSpan={11} className="px-4 py-10 text-center text-sm text-gray-400">Tidak ada data.</td></tr>
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