import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface Mhs {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  kategori: "Reguler" | "Aspirasi";
  ipk: number;
  semester: number;
  status: "Aktif" | "Lulus" | "Dicabut";
  sp: number;
}

const DATA: Mhs[] = [
  { nim: "2206001", nama: "Ahmad Rifaldi", prodi: "Teknik Informatika", angkatan: 2022, kategori: "Reguler", ipk: 3.35, semester: 8, status: "Aktif", sp: 0 },
  { nim: "2206002", nama: "Sari Dewi Lestari", prodi: "Teknik Informatika", angkatan: 2022, kategori: "Aspirasi", ipk: 2.78, semester: 6, status: "Aktif", sp: 1 },
  { nim: "2206015", nama: "Budi Setiawan", prodi: "Teknik Informatika", angkatan: 2022, kategori: "Reguler", ipk: 2.85, semester: 8, status: "Aktif", sp: 1 },
  { nim: "2206033", nama: "Citra Dewi", prodi: "Teknik Informatika", angkatan: 2022, kategori: "Aspirasi", ipk: 2.78, semester: 7, status: "Aktif", sp: 1 },
  { nim: "2106001", nama: "Gunawan Prakoso", prodi: "Teknik Informatika", angkatan: 2021, kategori: "Reguler", ipk: 2.90, semester: 8, status: "Aktif", sp: 2 },
  { nim: "2106003", nama: "Rizky Pratama", prodi: "Teknik Informatika", angkatan: 2021, kategori: "Reguler", ipk: 3.55, semester: 9, status: "Lulus", sp: 0 },
  { nim: "2106010", nama: "Dina Fitriani", prodi: "Teknik Informatika", angkatan: 2021, kategori: "Aspirasi", ipk: 3.20, semester: 9, status: "Aktif", sp: 0 },
  { nim: "2306001", nama: "Krisna Bayu", prodi: "Teknik Informatika", angkatan: 2023, kategori: "Reguler", ipk: 3.32, semester: 4, status: "Aktif", sp: 0 },
  { nim: "2306005", nama: "Eka Saputra", prodi: "Teknik Informatika", angkatan: 2023, kategori: "Reguler", ipk: 3.42, semester: 6, status: "Aktif", sp: 0 },
  { nim: "2306018", nama: "Fani Rahayu", prodi: "Teknik Informatika", angkatan: 2023, kategori: "Aspirasi", ipk: 3.10, semester: 5, status: "Aktif", sp: 0 },
  { nim: "2207001", nama: "Juwita Ramadhani", prodi: "Sistem Informasi", angkatan: 2022, kategori: "Aspirasi", ipk: 3.55, semester: 6, status: "Aktif", sp: 0 },
  { nim: "2307001", nama: "Fitriyani Hasanah", prodi: "Sistem Informasi", angkatan: 2023, kategori: "Reguler", ipk: 3.78, semester: 4, status: "Aktif", sp: 0 },
  { nim: "2303001", nama: "Budi Santoso", prodi: "Teknik Industri", angkatan: 2023, kategori: "Reguler", ipk: 3.62, semester: 4, status: "Aktif", sp: 0 },
  { nim: "2303002", nama: "Hesti Rahayu", prodi: "Teknik Industri", angkatan: 2023, kategori: "Aspirasi", ipk: 3.25, semester: 4, status: "Aktif", sp: 0 },
  { nim: "2211001", nama: "Rina Marlina", prodi: "Teknik Sipil", angkatan: 2022, kategori: "Reguler", ipk: 3.10, semester: 6, status: "Aktif", sp: 0 },
  { nim: "2211002", nama: "Indra Permana", prodi: "Teknik Sipil", angkatan: 2022, kategori: "Reguler", ipk: 2.40, semester: 5, status: "Dicabut", sp: 3 },
  { nim: "2420001", nama: "Deni Kurniawan", prodi: "Arsitektur", angkatan: 2024, kategori: "Aspirasi", ipk: 2.65, semester: 2, status: "Aktif", sp: 1 },
  { nim: "2220001", nama: "Lena Pertiwi", prodi: "Arsitektur", angkatan: 2022, kategori: "Aspirasi", ipk: 3.48, semester: 6, status: "Aktif", sp: 0 },
];

const PRODI_LIST = ["Semua", "Teknik Informatika", "Sistem Informasi", "Teknik Industri", "Teknik Sipil", "Arsitektur"];
const PAGE_SIZE = 8;

export default function WarekMahasiswaList() {
  const [search, setSearch] = useState("");
  const [filterProdi, setFilterProdi] = useState("Semua");
  const [filterAngkatan, setFilterAngkatan] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [page, setPage] = useState(1);

  const angkatanList = [...new Set(DATA.map(d => d.angkatan))].sort((a, b) => b - a);

  const filtered = DATA.filter(m => {
    const q = search.toLowerCase();
    return (
      (m.nama.toLowerCase().includes(q) || m.nim.includes(q)) &&
      (filterProdi === "Semua" || m.prodi === filterProdi) &&
      (filterAngkatan === "Semua" || m.angkatan === parseInt(filterAngkatan)) &&
      (filterKategori === "Semua" || m.kategori === filterKategori) &&
      (filterStatus === "Semua" || m.status === filterStatus)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusBadge: Record<string, string> = {
    Aktif: "bg-green-100 text-green-700",
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Data Mahasiswa KIP-K — Semua Prodi</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} mahasiswa ditemukan (read-only)</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 border border-gray-200 text-gray-700 hover:bg-gray-50">
          <Download size={15} /> Export Excel
        </button>
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
            { label: "Prodi", value: filterProdi, setter: setFilterProdi, opts: PRODI_LIST },
            { label: "Angkatan", value: filterAngkatan, setter: setFilterAngkatan, opts: ["Semua", ...angkatanList.map(String)] },
            { label: "Kategori", value: filterKategori, setter: setFilterKategori, opts: ["Semua", "Reguler", "Aspirasi"] },
            { label: "Status", value: filterStatus, setter: setFilterStatus, opts: ["Semua", "Aktif", "Lulus", "Dicabut"] },
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
              {paginated.map((m, i) => (
                <tr key={m.nim} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{m.nim}</td>
                  <td className="px-4 py-3 font-500 text-gray-800 whitespace-nowrap">{m.nama}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-500 ${prodiBadge[m.prodi] || "bg-gray-100 text-gray-600"}`}>
                      {m.prodi.replace("Teknik ", "T.")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.angkatan}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-500 ${m.kategori === "Reguler" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{m.kategori}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-700 font-display ${m.ipk >= 3.0 ? "text-green-600" : "text-red-500"}`}>{m.ipk.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.semester}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-500 ${statusBadge[m.status]}`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {m.sp > 0 ? (
                      <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-500">SP{m.sp}</span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/warek/mahasiswa/${m.nim}`} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 w-fit">
                      <Eye size={12} /> Lihat
                    </Link>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
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
