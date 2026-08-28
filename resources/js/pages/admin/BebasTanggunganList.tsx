import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { CheckCircle, AlertTriangle, Award, XCircle, Search, Loader2 } from "lucide-react";
import { getBebasTanggunganList } from "@/services/bebasTanggunganService";
import type { BebasTanggunganListItem, BebasTanggunganStatus } from "@/types";

type Tab = "menunggu" | "diterbitkan" | "ditolak";

const TAB_LABELS: Record<Tab, string> = {
  menunggu: "Menunggu",
  diterbitkan: "Diterbitkan",
  ditolak: "Ditolak",
};

const LIMIT = 10;

export default function BebasTanggunganList() {
  const [tab, setTab] = useState<Tab>("menunggu");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<BebasTanggunganListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ menunggu: 0, diterbitkan: 0, ditolak: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBebasTanggunganList({ status: tab, search, page, limit: LIMIT });
      setData(res.data);
      setTotal(res.total);
      setTotalPages(Math.max(1, res.total_pages));
      setCounts(res.counts);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, [tab, search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">
            Permohonan Surat Keterangan Penyelesaian Studi
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Review permohonan penerbitan Surat Keterangan Penyelesaian Studi KIP-K
          </p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5">
          <Award size={16} className="text-purple-600" />
          <span className="text-sm font-600 text-purple-700">
            {counts.menunggu} menunggu review
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`px-4 py-2 rounded-lg text-sm font-500 transition-all flex items-center gap-2 ${
                tab === t ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {TAB_LABELS[t]}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-600 ${
                  t === "menunggu"
                    ? "bg-yellow-100 text-yellow-700"
                    : t === "diterbitkan"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {counts[t]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari NIM atau nama..."
              className="pl-8 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 w-56"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 text-xs font-500 bg-[#263F93] text-white rounded-lg hover:bg-[#1E3275] transition-colors"
          >
            Cari
          </button>
          {search && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="px-3 py-2 text-xs font-500 border border-[#E2E8F0] text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                {[
                  "No",
                  "NIM",
                  "Nama",
                  "Prodi",
                  "Angkatan",
                  "Semester",
                  "Tgl. Ajukan",
                  "Kelengkapan Dok.",
                  "Status SP",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-sm">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle size={24} className="text-red-400" />
                      <p className="text-sm text-red-600">{error}</p>
                      <button
                        onClick={fetchData}
                        className="text-xs text-[#263F93] underline mt-1"
                      >
                        Coba lagi
                      </button>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <Award size={28} className="mx-auto text-gray-200 mb-2" />
                    <p className="text-gray-400 text-sm">Tidak ada permohonan dengan status ini</p>
                  </td>
                </tr>
              ) : (
                data.map((r, i) => {
                  const mhs = r.mahasiswa;
                  const docsAllOk = r.docsTotal > 0 && r.docsOk === r.docsTotal;
                  const rowNo = (page - 1) * LIMIT + i + 1;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{rowNo}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-600">
                        {mhs?.nim ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 font-500 text-gray-800">{mhs?.nama ?? "—"}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">
                        {mhs?.prodi ? mhs.prodi.replace("Teknik ", "T.") : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{mhs?.angkatan ?? "—"}</td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {r.semester > 0 ? `Sem ${r.semester}` : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">
                        {r.tanggalAjukan ?? "—"}
                      </td>

                      {/* Kelengkapan Dokumen */}
                      <td className="px-4 py-3.5">
                        {r.docsTotal === 0 ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(r.docsOk / r.docsTotal) * 100}%`,
                                  background: docsAllOk ? "#059669" : "#F59E0B",
                                }}
                              />
                            </div>
                            <span
                              className={`text-xs font-600 flex items-center gap-1 ${
                                docsAllOk ? "text-green-600" : "text-yellow-600"
                              }`}
                            >
                              {r.docsOk}/{r.docsTotal}{" "}
                              {docsAllOk ? (
                                <CheckCircle size={14} />
                              ) : (
                                <AlertTriangle size={14} />
                              )}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status SP */}
                      <td className="px-4 py-3.5">
                        {r.spBersih ? (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle size={12} /> Bersih
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-600">
                            <AlertTriangle size={12} /> Ada Riwayat
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5">
                        {tab === "menunggu" ? (
                          <Link
                            to={`/admin/bebas-tanggungan/${r.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 border border-green-500 text-green-600 hover:bg-green-50 transition-colors whitespace-nowrap"
                          >
                            <CheckCircle size={12} /> Review & Terbitkan
                          </Link>
                        ) : (
                          <Link
                            to={`/admin/bebas-tanggungan/${r.id}`}
                            className="px-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                          >
                            Lihat Detail
                          </Link>
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
        {!loading && !error && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Menampilkan {data.length} dari {total} permohonan
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1.5 text-xs border border-[#E2E8F0] rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹ Prev
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                        page === p
                          ? "bg-[#263F93] text-white"
                          : "border border-[#E2E8F0] text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1.5 text-xs border border-[#E2E8F0] rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next ›
              </button>
            </div>
          </div>
        )}

        {/* Total count when single page */}
        {!loading && !error && totalPages <= 1 && data.length > 0 && (
          <div className="px-4 py-3 border-t border-[#E2E8F0]">
            <p className="text-xs text-gray-500">
              Total {total} permohonan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
