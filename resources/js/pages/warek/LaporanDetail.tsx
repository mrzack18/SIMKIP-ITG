import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download, QrCode, X, RotateCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import logoItg from "@/imports/logo_itg.jpg";
import { api } from "@/services/api";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";

interface LaporanDetail {
  id: number;
  judul: string;
  nomor: string;
  periode: string;
  tanggal: string;
  status: "Menunggu" | "Disetujui" | "Dikembalikan" | "Ditolak" | "Draft";
  approvedDate?: string;
  dibuatOleh?: string;
}

interface Statistik {
  totalMahasiswa: number;
  rataIpk: number | null;
  spAktif: number;
  bebas: number;
  distribusiIPK: { range: string; jml: number }[];
  mahasiswaSample: { nim: string; nama: string; prodi: string; ipk: number; status: string }[];
}

export default function WarekLaporanDetail() {
  const { id } = useParams<{ id: string }>();
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran());
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [approved, setApproved] = useState(false);
  const [returned, setReturned] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [returnNote, setReturnNote] = useState("");

  const [report, setReport] = useState<LaporanDetail | null>(null);
  const [stats, setStats] = useState<Statistik | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ success: boolean; data: LaporanDetail; statistics: Statistik }>(
          `/laporan/${id}`
        );
        if (cancelled) return;
        setReport(res.data);
        setStats(res.statistics);
        // If the report was already approved/ returned server-side, reflect that in UI
        if (res.data.status === "Disetujui") setApproved(true);
        if (res.data.status === "Dikembalikan") setReturned(true);
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setError(e.message ?? "Gagal memuat detail laporan.");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleApprove = async () => {
    setActionError(null);
    setActing(true);
    try {
      await api.patch(`/laporan/${id}/approve`, {});
      setShowApproveModal(false);
      setApproved(true);
    } catch (e: any) {
      setActionError(e.message ?? "Gagal menyetujui laporan.");
    } finally {
      setActing(false);
    }
  };

  const handleReturn = async () => {
    if (!returnNote.trim()) return;
    setActionError(null);
    setActing(true);
    try {
      await api.patch(`/laporan/${id}/return`, { catatan: returnNote });
      setShowReturnModal(false);
      setReturned(true);
    } catch (e: any) {
      setActionError(e.message ?? "Gagal mengembalikan laporan.");
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4 pb-24 w-full max-w-7xl mx-auto min-w-0">
        <Link to="/warek/laporan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <div className="bg-white rounded-xl p-8 sm:p-10 px-4 text-center text-xs sm:text-sm text-gray-400">
          Memuat detail laporan...
        </div>
      </div>
    );
  }

  if (error || !report || !stats) {
    return (
      <div className="space-y-3 sm:space-y-4 pb-24 w-full max-w-7xl mx-auto min-w-0">
        <Link to="/warek/laporan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-5 sm:py-6 text-center text-xs sm:text-sm text-red-700 break-words">
          {error ?? "Laporan tidak ditemukan."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 pb-24 w-full max-w-7xl mx-auto min-w-0">
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-2 min-w-0">
        <Link to="/warek/laporan" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 shrink-0">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <div className="self-start min-[480px]:self-auto min-w-0">
          <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />
        </div>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 break-words min-w-0">
          {actionError}
        </div>
      )}

      {approved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 sm:p-4 flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-600 text-green-800 text-xs sm:text-sm break-words">Laporan berhasil disetujui dengan tanda tangan digital Anda.</p>
              <p className="text-xs text-green-600 mt-0.5">Laporan telah menjadi dokumen final dan dapat diunduh.</p>
            </div>
          </div>
          <a
            href={`${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/laporan/${id}/pdf`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-green-300 text-sm text-green-700 hover:bg-green-100 w-full min-[480px]:w-auto shrink-0 whitespace-nowrap">
            <Download size={14} /> Unduh PDF Final
          </a>
        </div>
      )}

      {returned && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 min-w-0">
          <RotateCcw size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="font-600 text-orange-800 text-xs sm:text-sm break-words min-w-0">Laporan telah dikembalikan ke Admin untuk revisi.</p>
        </div>
      )}

      {/* Formal document */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
        <div className="p-3 sm:p-8 font-serif max-w-3xl mx-auto min-w-0">
          {/* Letterhead */}
          <div className="flex items-center gap-3 sm:gap-5 border-b-2 border-gray-800 pb-3 sm:pb-5 mb-4 sm:mb-6 min-w-0">
            <img src={logoItg} alt="ITG" className="w-12 h-12 sm:w-20 sm:h-20 object-contain flex-shrink-0" />
            <div className="text-center flex-1 min-w-0">
              <p className="font-bold text-xs sm:text-base text-gray-800 uppercase leading-snug">Institut Teknologi Garut</p>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">Biro Kemahasiswaan dan Alumni</p>
              <p className="text-[10px] sm:text-xs text-gray-500 leading-snug break-words">Jl. Mayor Syamsu No.1, Garut 44151 · Telp. (0262) 540895</p>
            </div>
          </div>

          <div className="text-center mb-4 sm:mb-6 min-w-0">
            <p className="font-bold text-xs sm:text-sm text-gray-800 uppercase underline break-words">LAPORAN EVALUASI KIP-K</p>
            <p className="text-xs text-gray-500 mt-1 break-all">Nomor: {report.nomor}</p>
            <p className="text-xs font-semibold text-[#263F93] mt-1 break-words">Tahun Ajaran: {report.periode}</p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 min-w-0">
            {[
              { label: "Total Mahasiswa", val: stats.totalMahasiswa },
              { label: "Rata-rata IPK", val: stats.rataIpk !== null ? stats.rataIpk.toFixed(2) : "-" },
              { label: "SP Aktif", val: stats.spAktif },
              { label: "Surat Penyelesaian", val: stats.bebas },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-2.5 sm:p-3 text-center min-w-0">
                <p className="font-display font-700 text-lg sm:text-xl text-[#263F93] break-words">{s.val}</p>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 break-words leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="mb-4 sm:mb-6 min-w-0">
            <p className="font-bold text-xs sm:text-sm text-gray-700 mb-3">Distribusi IPK Mahasiswa</p>
            <div className="w-full h-[180px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.distribusiIPK} margin={{ left: -14, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#94A3B8" }} minTickGap={4} />
                <YAxis width={30} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="jml" fill="#263F93" radius={[3, 3, 0, 0]} name="Mahasiswa" />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>

          {/* Sample table */}
          <div className="mb-6 sm:mb-8 min-w-0">
            <p className="font-bold text-xs sm:text-sm text-gray-700 mb-3">Data Mahasiswa (Sample)</p>
            <div className="overflow-x-auto min-w-0">
            <table className="w-full min-w-[520px] text-xs border border-gray-200">
              <thead className="bg-gray-50">
                <tr>{["NIM", "Nama", "Prodi", "IPK", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-600 text-gray-600 border-b border-gray-200 whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.mahasiswaSample.map(m => (
                  <tr key={m.nim}>
                    <td className="px-3 py-2 font-mono text-gray-500 whitespace-nowrap">{m.nim}</td>
                    <td className="px-3 py-2 text-gray-700 break-words min-w-[120px]">{m.nama}</td>
                    <td className="px-3 py-2 text-gray-500 break-words min-w-[100px]">{m.prodi}</td>
                    <td className="px-3 py-2 font-700 text-gray-800 whitespace-nowrap">{(m.ipk ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-500 whitespace-nowrap ${m.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Signature section */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6 min-w-0">
            <p className="font-bold text-xs sm:text-sm text-gray-700 mb-4">Tanda Tangan</p>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4 sm:gap-8 min-w-0">
              <div className="text-center min-w-0">
                <p className="text-xs text-gray-500 mb-3">Biro Kemahasiswaan</p>
                <div className="h-20 border border-green-200 rounded-xl bg-green-50 flex flex-col items-center justify-center gap-1 px-2">
                  <CheckCircle size={20} className="text-green-500" />
                  <p className="text-xs text-green-700 font-500">Sudah Ditandatangani</p>
                  <p className="text-xs text-gray-400 break-words">{report.tanggal}</p>
                </div>
                <p className="text-xs font-bold text-gray-700 mt-2 break-words">Encep Jianul Hayat, S.T., M.T.</p>
              </div>
              <div className="text-center min-w-0">
                <p className="text-xs text-gray-500 mb-3">Wakil Rektor III</p>
                <div className={`h-20 border rounded-xl flex flex-col items-center justify-center gap-1 px-2 ${approved ? "border-green-200 bg-green-50" : "border-dashed border-gray-300 bg-gray-50"}`}>
                  {approved ? (
                    <>
                      <QrCode size={24} className="text-green-500" />
                      <p className="text-xs text-green-700 font-500">Ditandatangani Digital</p>
                    </>
                  ) : (
                    <>
                      <QrCode size={24} className="text-gray-300" />
                      <p className="text-xs text-gray-400">Menunggu tanda tangan</p>
                    </>
                  )}
                </div>
                <p className="text-xs font-bold text-gray-700 mt-2 break-words">Dr. Rina Kurniawati, S.E., M.Si.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      {!approved && !returned && report.status === "Menunggu" && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 shadow-lg">
          <div className="hidden sm:block flex-1" />
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 w-full sm:w-auto whitespace-nowrap">
            <Download size={14} /> Download Preview
          </button>
          <button onClick={() => setShowReturnModal(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-orange-300 text-sm font-500 text-orange-700 hover:bg-orange-50 w-full sm:w-auto whitespace-nowrap">
            <RotateCcw size={14} /> Kembalikan untuk Revisi
          </button>
          <button onClick={() => setShowApproveModal(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-700 text-white bg-green-600 hover:bg-green-700 shadow-sm w-full sm:w-auto whitespace-nowrap">
            <CheckCircle size={14} /> Setujui & Tanda Tangani
          </button>
        </div>
      )}

      {/* Approve modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto min-w-0">
            <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
              <h3 className="font-display font-700 text-xs sm:text-sm text-gray-800 truncate">Konfirmasi Persetujuan</h3>
              <button onClick={() => setShowApproveModal(false)} aria-label="Tutup" className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0"><X size={18} /></button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 break-words">
              Dengan menyetujui laporan ini, Anda memberikan tanda tangan digital resmi. Laporan akan menjadi dokumen final yang dapat dicetak dan dibagikan.
            </p>
            <label className="flex items-start gap-3 cursor-pointer mb-5 min-w-0">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-700 break-words">Saya telah membaca dan menyetujui isi laporan ini secara keseluruhan.</span>
            </label>
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button onClick={() => setShowApproveModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Batal</button>
              <button onClick={handleApprove} disabled={!agreed || acting}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white bg-green-600 disabled:opacity-40 flex items-center justify-center gap-2">
                {acting ? "Memproses..." : "Konfirmasi Persetujuan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto min-w-0">
            <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
              <h3 className="font-display font-700 text-xs sm:text-sm text-gray-800 truncate">Kembalikan untuk Revisi</h3>
              <button onClick={() => setShowReturnModal(false)} aria-label="Tutup" className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0"><X size={18} /></button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Berikan catatan revisi untuk Admin Kemahasiswaan:</p>
            <textarea value={returnNote} onChange={e => setReturnNote(e.target.value)} rows={4}
              placeholder="Tuliskan bagian yang perlu diperbaiki..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none mb-4 min-w-0" />
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button onClick={() => setShowReturnModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Batal</button>
              <button onClick={handleReturn} disabled={!returnNote.trim() || acting}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white bg-orange-500 disabled:opacity-40">
                {acting ? "Memproses..." : "Kirim Catatan Revisi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}