import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download, QrCode, X, RotateCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import logoItg from "@/imports/logo_itg.jpg";
import { api } from "@/services/api";

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
      <div className="space-y-5 pb-24">
        <Link to="/warek/laporan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <div className="bg-white rounded-xl p-10 text-center text-sm text-gray-400">
          Memuat detail laporan...
        </div>
      </div>
    );
  }

  if (error || !report || !stats) {
    return (
      <div className="space-y-5 pb-24">
        <Link to="/warek/laporan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-700">
          {error ?? "Laporan tidak ditemukan."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center gap-3">
        <Link to="/warek/laporan" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {approved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
          <div>
            <p className="font-600 text-green-800">Laporan berhasil disetujui dengan tanda tangan digital Anda.</p>
            <p className="text-xs text-green-600 mt-0.5">Laporan telah menjadi dokumen final dan dapat diunduh.</p>
          </div>
          <a
            href={`${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/laporan/${id}/pdf`}
            target="_blank" rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg border border-green-300 text-sm text-green-700 hover:bg-green-100">
            <Download size={14} /> Unduh PDF Final
          </a>
        </div>
      )}

      {returned && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <RotateCcw size={20} className="text-orange-500 flex-shrink-0" />
          <p className="font-600 text-orange-800">Laporan telah dikembalikan ke Admin untuk revisi.</p>
        </div>
      )}

      {/* Formal document */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 font-serif max-w-3xl mx-auto">
          {/* Letterhead */}
          <div className="flex items-center gap-5 border-b-2 border-gray-800 pb-5 mb-6">
            <img src={logoItg} alt="ITG" className="w-20 h-20 object-contain flex-shrink-0" />
            <div className="text-center flex-1">
              <p className="font-bold text-base text-gray-800 uppercase">Institut Teknologi Garut</p>
              <p className="text-xs text-gray-600">Biro Kemahasiswaan dan Alumni</p>
              <p className="text-xs text-gray-500">Jl. Mayor Syamsu No.1, Garut 44151 · Telp. (0262) 540895</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="font-bold text-base text-gray-800 uppercase underline">LAPORAN EVALUASI KIP-K</p>
            <p className="text-xs text-gray-500 mt-1">Nomor: {report.nomor}</p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Mahasiswa", val: stats.totalMahasiswa },
              { label: "Rata-rata IPK", val: stats.rataIpk !== null ? stats.rataIpk.toFixed(2) : "-" },
              { label: "SP Aktif", val: stats.spAktif },
              { label: "Surat Penyelesaian", val: stats.bebas },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="font-display font-700 text-2xl text-[#263F93]">{s.val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="mb-6">
            <p className="font-bold text-sm text-gray-700 mb-3">Distribusi IPK Mahasiswa</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.distribusiIPK}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="jml" fill="#263F93" radius={[3, 3, 0, 0]} name="Mahasiswa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sample table */}
          <div className="mb-8">
            <p className="font-bold text-sm text-gray-700 mb-3">Data Mahasiswa (Sample)</p>
            <table className="w-full text-xs border border-gray-200">
              <thead className="bg-gray-50">
                <tr>{["NIM", "Nama", "Prodi", "IPK", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-600 text-gray-600 border-b border-gray-200">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.mahasiswaSample.map(m => (
                  <tr key={m.nim}>
                    <td className="px-3 py-2 font-mono text-gray-500">{m.nim}</td>
                    <td className="px-3 py-2 text-gray-700">{m.nama}</td>
                    <td className="px-3 py-2 text-gray-500">{m.prodi}</td>
                    <td className="px-3 py-2 font-700 text-gray-800">{(m.ipk ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-500 ${m.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature section */}
          <div className="border-t border-gray-200 pt-6">
            <p className="font-bold text-sm text-gray-700 mb-4">Tanda Tangan</p>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">Biro Kemahasiswaan</p>
                <div className="h-20 border border-green-200 rounded-xl bg-green-50 flex flex-col items-center justify-center gap-1">
                  <CheckCircle size={20} className="text-green-500" />
                  <p className="text-xs text-green-700 font-500">Sudah Ditandatangani</p>
                  <p className="text-xs text-gray-400">{report.tanggal}</p>
                </div>
                <p className="text-xs font-bold text-gray-700 mt-2">Encep Jianul Hayat, S.T., M.T.</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">Wakil Rektor III</p>
                <div className={`h-20 border rounded-xl flex flex-col items-center justify-center gap-1 ${approved ? "border-green-200 bg-green-50" : "border-dashed border-gray-300 bg-gray-50"}`}>
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
                <p className="text-xs font-bold text-gray-700 mt-2">Dr. Rina Kurniawati, S.E., M.Si.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      {!approved && !returned && report.status === "Menunggu" && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-3 shadow-lg">
          <div className="flex-1" />
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={14} /> Download Preview
          </button>
          <button onClick={() => setShowReturnModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-orange-300 text-sm font-500 text-orange-700 hover:bg-orange-50">
            <RotateCcw size={14} /> Kembalikan untuk Revisi
          </button>
          <button onClick={() => setShowApproveModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-700 text-white bg-green-600 hover:bg-green-700 shadow-sm">
            <CheckCircle size={14} /> Setujui & Tanda Tangani
          </button>
        </div>
      )}

      {/* Approve modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-700 text-gray-800">Konfirmasi Persetujuan</h3>
              <button onClick={() => setShowApproveModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Dengan menyetujui laporan ini, Anda memberikan tanda tangan digital resmi. Laporan akan menjadi dokumen final yang dapat dicetak dan dibagikan.
            </p>
            <label className="flex items-start gap-3 cursor-pointer mb-5">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Saya telah membaca dan menyetujui isi laporan ini secara keseluruhan.</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setShowApproveModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Batal</button>
              <button onClick={handleApprove} disabled={!agreed || acting}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white bg-green-600 disabled:opacity-40">
                {acting ? "Memproses..." : "Konfirmasi Persetujuan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-700 text-gray-800">Kembalikan untuk Revisi</h3>
              <button onClick={() => setShowReturnModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Berikan catatan revisi untuk Admin Kemahasiswaan:</p>
            <textarea value={returnNote} onChange={e => setReturnNote(e.target.value)} rows={4}
              placeholder="Tuliskan bagian yang perlu diperbaiki..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none mb-4" />
            <div className="flex gap-3">
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