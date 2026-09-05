import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Search } from "lucide-react";
import { api } from "@/services/api";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";
function formatTanggal(tanggal?: string | null) {
  if (!tanggal) return "-";
  try {
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) return tanggal;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return tanggal;
  }
}

interface LaporanItem {
  id: number;
  judul: string;
  nomorSurat: string;
  periode: string;
  tahunAkademik: string;
  semester: string;
  tanggalLaporan: string;
  status: string;
  catatanWarek?: string | null;
}

interface LaporanListResponse {
  success: boolean;
  data: LaporanItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default function ProdiLaporanList() {
  const [items, setItems] = useState<LaporanItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterTahunAjaran, setFilterTahunAjaran] = useState(getCurrentTahunAjaran());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        search,
        tahun_ajaran: filterTahunAjaran,
        page: String(page),
        limit: "10",
      });
      api.get<LaporanListResponse>(`/laporan?${params.toString()}`)
        .then((res) => {
          if (!active) return;
          setItems(res.data ?? []);
          setTotalPages(res.total_pages ?? 1);
        })
        .catch(() => { if (active) { setItems([]); setTotalPages(1); } })
        .finally(() => { if (active) setLoading(false); });
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [search, filterTahunAjaran, page]);

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0">
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-2 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="font-display font-700 text-lg sm:text-xl text-gray-900 leading-tight">Laporan Evaluasi Semester</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Laporan monitoring mahasiswa KIP-K dari Pengelola</p>
        </div>
        <div className="self-start min-[480px]:self-auto shrink-0">
          <TahunAjaranFilter value={filterTahunAjaran} onChange={v => { setFilterTahunAjaran(v); setPage(1); }} />
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-gray-100 min-w-0">
        <div className="flex flex-wrap gap-3 min-w-0">
          <div className="relative flex-1 min-w-0 basis-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari judul atau nomor surat..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 min-w-0" />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3 sm:space-y-4 min-w-0">
        {loading && (
          <div className="bg-white rounded-xl p-8 sm:p-10 px-4 text-center shadow-sm border border-gray-100 min-w-0">
            <p className="text-gray-400 text-xs sm:text-sm">Memuat data…</p>
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="bg-white rounded-xl p-8 sm:p-10 px-4 text-center shadow-sm border border-gray-100 min-w-0">
            <p className="text-gray-400 text-xs sm:text-sm">Tidak ada laporan yang diterima.</p>
          </div>
        )}
        {items.map(r => (
          <div key={r.id} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 min-w-0">
            <div className="flex flex-wrap items-start gap-2.5 sm:gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                <FileText size={22} className="text-[#263F93]" />
              </div>
              <div className="flex-1 min-w-0 basis-48">
                <div className="flex flex-wrap items-center gap-2 mb-1 min-w-0">
                  <h3 className="font-600 text-gray-800 text-xs sm:text-sm break-words min-w-0">{r.judul}</h3>
                  <span className="px-2 py-0.5 rounded text-xs font-500 flex items-center gap-1 bg-green-100 text-green-700 whitespace-nowrap shrink-0">
                    <CheckCircle size={13} className="text-green-500" /> Diterima
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono break-all">{r.nomorSurat}</p>
                <p className="text-xs text-gray-500 mt-1 break-words">{r.periode} · Diterima: {formatTanggal(r.tanggalLaporan)}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0 w-full min-[480px]:w-auto">
                <Link to={`/prodi/laporan/${r.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-500 text-[#263F93] border border-[#263F93]/30 hover:bg-blue-50 text-center transition-colors whitespace-nowrap">
                  Lihat Detail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-2 text-sm min-w-0">
          <span className="text-gray-400 text-xs text-center min-[420px]:text-left">Halaman {page} dari {totalPages}</span>
          <div className="flex gap-1 justify-center min-[420px]:justify-end">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-xs whitespace-nowrap">Prev</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-xs whitespace-nowrap">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}