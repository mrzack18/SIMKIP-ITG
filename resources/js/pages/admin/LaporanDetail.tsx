import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, Download, Printer, CheckCircle, QrCode, Clock, AlertCircle, Loader2 } from "lucide-react";
import { getLaporanById, type LaporanStatistics } from "@/services/laporanService";
import { getKonfigurasiAll, type SignatureConfig } from "@/services/konfigurasiService";
import type { Laporan } from "@/types";
import { useAuth } from "@/context/AuthContext";
import logoItg from "@/imports/logo_itg.jpg";

function formatDateLong(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function LaporanDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [laporan, setLaporan] = useState<Laporan | null>(null);
  const [statistics, setStatistics] = useState<LaporanStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showApprove, setShowApprove] = useState(false);
  const [showRevisi, setShowRevisi] = useState(false);
  const [revisiNote, setRevisiNote] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [checked, setChecked] = useState(false);

  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const [signature, setSignature] = useState<SignatureConfig | null>(null);

  const canApprove = user?.role === "warek";

  useEffect(() => {
    if (!id) { setError("ID laporan tidak valid."); setLoading(false); return; }
    let active = true;
    setLoading(true);
    setError("");
    getLaporanById(Number(id))
      .then(({ laporan: data, statistics: stats }) => {
        if (active) { setLaporan(data); setStatistics(stats); }
      })
      .catch((err) => { if (active) setError(err?.message ?? "Gagal memuat laporan"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false };
  }, [id]);

  // Load signature from BE
  useEffect(() => {
    getKonfigurasiAll()
      .then((res) => {
        if (res?.data?.signature) setSignature(res.data.signature);
      })
      .catch(() => { /* fallback */ });
  }, []);

  const currentStatus = optimisticStatus ?? laporan?.status ?? "Draft";
  const isApproved = currentStatus === "Disetujui";
  const isPending = currentStatus === "Diajukan";

  async function handleApprove() {
    if (!canApprove) {
      setActionError("Hanya Warek yang dapat menyetujui laporan.");
      return;
    }
    setActionBusy(true);
    setActionError("");
    try {
      const { approveLaporan } = await import("@/services/laporanService");
      await approveLaporan(Number(id));
      setOptimisticStatus("Disetujui");
      setShowApprove(false);
    } catch (e: any) {
      setActionError(e?.message ?? "Gagal menyetujui laporan");
    } finally {
      setActionBusy(false);
    }
  }

  async function handleReject() {
    if (!canApprove) {
      setActionError("Hanya Warek yang dapat mengembalikan laporan.");
      return;
    }
    if (!revisiNote.trim()) return;
    setActionBusy(true);
    setActionError("");
    try {
      const { rejectLaporan } = await import("@/services/laporanService");
      await rejectLaporan(Number(id), revisiNote);
      setOptimisticStatus("Dikembalikan");
      setShowRevisi(false);
      setRevisiNote("");
    } catch (e: any) {
      setActionError(e?.message ?? "Gagal mengembalikan laporan");
    } finally {
      setActionBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 px-4 text-gray-500 text-xs sm:text-sm text-center">
        <Loader2 className="animate-spin mr-2 flex-shrink-0" /> Memuat laporan...
      </div>
    );
  }

  if (error || !laporan) {
    return (
      <div className="max-w-4xl mx-auto w-full space-y-4 min-w-0">
        <Link to="/admin/laporan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft size={16} /> Laporan Semester
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2 min-w-0">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 break-words min-w-0">{error || "Laporan tidak ditemukan."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3 sm:space-y-4 min-w-0">
      {/* Breadcrumb and Filter */}
      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-gray-500 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Link to="/admin/laporan" className="hover:text-gray-700 flex items-center gap-1 shrink-0">
            <ChevronLeft size={15} /> Laporan Semester
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-gray-800 font-500 truncate">Detail Laporan</span>
        </div>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2 min-w-0">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 break-words min-w-0">{actionError}</p>
        </div>
      )}

      {/* Formal report document */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
        {!isApproved && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-3 sm:px-4 py-2.5 flex items-center justify-center gap-2 min-w-0">
            <span className="text-[11px] sm:text-xs font-600 text-yellow-700 flex items-center justify-center gap-1 text-center">
              <Clock size={14} className="flex-shrink-0" />
              {currentStatus === "Dikembalikan" ? "Dikembalikan untuk Revisi" : "Menunggu Persetujuan Warek III"}
            </span>
          </div>
        )}

        <div className="p-3 sm:p-8 min-w-0">
          <div className="border-2 border-[#263F93] rounded-xl p-1 min-w-0">
            <div className="border border-[#263F93] rounded-lg p-3 sm:p-8 space-y-3 sm:space-y-4 min-w-0">

              <div className="flex items-center gap-2.5 sm:gap-4 border-b-2 border-[#263F93] pb-3 sm:pb-5 mb-4 sm:mb-6 min-w-0">
                <img src={logoItg} alt="Logo ITG" className="h-11 w-11 sm:h-16 sm:w-16 object-contain flex-shrink-0" />
                <div className="flex-1 text-center min-w-0">
                  <p className="text-[10px] sm:text-sm font-semibold leading-snug">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
                  <p className="font-bold text-xs sm:text-base uppercase tracking-wide leading-snug">INSTITUT TEKNOLOGI GARUT</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">Telp. (0262) 2800433 | www.itg.ac.id</p>
                </div>
              </div>

              <div className="grid grid-cols-[96px_8px_1fr] sm:grid-cols-[120px_8px_1fr] gap-y-1.5 text-xs sm:text-sm mb-4 sm:mb-6 min-w-0">
                <span className="text-gray-600">Nomor</span><span>:</span>
                <span className="font-mono break-all min-w-0">{laporan.nomorSurat || "—"}</span>
                <span className="text-gray-600">Tanggal</span><span>:</span>
                <span className="break-words min-w-0">{formatDateLong(laporan.submittedAt || laporan.tanggalLaporan)}</span>
                <span className="text-gray-600">Perihal</span><span>:</span>
                <span className="font-semibold break-words min-w-0">{laporan.judul}</span>
                <span className="text-gray-600">Kepada Yth.</span><span>:</span>
                <span className="break-words min-w-0">{laporan.tujuanProdi ? "Wakil Rektor III & Program Studi" : "Wakil Rektor III ITG"}</span>
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-3">I. Ringkasan Data Mahasiswa KIP-K</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 min-w-0">
                  <div className="rounded-xl p-2.5 sm:p-3 border-l-4 min-w-0" style={{ borderColor: "#263F93", background: "#F8FAFC" }}>
                    <div className="font-bold text-base sm:text-lg break-words" style={{ color: "#263F93" }}>{statistics?.totalMahasiswa ?? "—"}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500">Total Mahasiswa</div>
                  </div>
                  <div className="rounded-xl p-2.5 sm:p-3 border-l-4 min-w-0" style={{ borderColor: "#059669", background: "#F8FAFC" }}>
                    <div className="font-bold text-base sm:text-lg break-words" style={{ color: "#059669" }}>
                      {statistics ? `${statistics.kipk.reguler.total} (${statistics.kipk.reguler.persen}%)` : "—"}
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-500">Mahasiswa Reguler</div>
                  </div>
                  <div className="rounded-xl p-2.5 sm:p-3 border-l-4 min-w-0" style={{ borderColor: "#7C3AED", background: "#F8FAFC" }}>
                    <div className="font-bold text-base sm:text-lg break-words" style={{ color: "#7C3AED" }}>
                      {statistics ? `${statistics.kipk.aspirasi.total} (${statistics.kipk.aspirasi.persen}%)` : "—"}
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-500">Mahasiswa Aspirasi</div>
                  </div>
                  <div className="rounded-xl p-2.5 sm:p-3 border-l-4 min-w-0" style={{ borderColor: "#D4A72C", background: "#F8FAFC" }}>
                    <div className="font-bold text-base sm:text-lg break-words" style={{ color: "#D4A72C" }}>{statistics?.rataIpk ?? "—"}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500">Rata-rata IPK</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-2">Sebaran per Angkatan</h3>
                  {statistics && statistics.distribusiAngkatan.length > 0 ? (
                    <div className="w-full h-[160px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statistics.distribusiAngkatan} margin={{ top: 5, right: 5, bottom: 0, left: -18 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="angkatan" tick={{ fontSize: 11 }} minTickGap={4} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} width={30} />
                        <Tooltip formatter={(v) => [v, "Jumlah"]} />
                        <Bar dataKey="total" fill="#263F93" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg px-4 text-center">
                      {statistics ? "Tidak ada data angkatan" : "Memuat..."}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-2">Tren Rata-rata IPK</h3>
                  {statistics && statistics.ipkTrend.length > 0 ? (
                    <div className="w-full h-[160px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={statistics.ipkTrend} margin={{ top: 5, right: 5, bottom: 0, left: -18 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="semester" tick={{ fontSize: 11 }} minTickGap={4} />
                        <YAxis tick={{ fontSize: 11 }} domain={[0, 4]} width={30} />
                        <Tooltip formatter={(v) => [v, "IPK"]} />
                        <Line type="monotone" dataKey="ipk" stroke="#D4A72C" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg px-4 text-center">
                      {statistics ? "Tidak ada data IPK" : "Memuat..."}
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-3">II. Data Mahasiswa</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-xs border border-[#E2E8F0]">
                    <thead>
                      <tr style={{ background: "#F8FAFC" }} className="border-b border-[#E2E8F0]">
                        {["NIM", "Nama", "Prodi", "IPK", "Prestasi", "Org.", "SP", "Catatan"].map(h => (
                          <th key={h} className="text-left px-3 py-2 font-semibold text-gray-500 border-r border-[#E2E8F0] last:border-r-0 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-gray-400 text-xs">
                          Tabel detail tersedia di versi PDF.
                          <a
                            href={`/api/laporan/${laporan.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-[#263F93] underline whitespace-nowrap"
                          >
                            Unduh PDF
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {laporan.catatanWarek && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs sm:text-sm min-w-0">
                  <span className="font-semibold text-amber-900">Catatan Warek: </span>
                  <span className="text-amber-800 break-words">{laporan.catatanWarek}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:gap-8 mt-6 sm:mt-10 text-[11px] sm:text-sm text-center min-w-0">
                <div className="min-w-0">
                  <p className="break-words">Garut, {formatDateLong(laporan.submittedAt || laporan.tanggalLaporan)}</p>
                  <p className="font-medium">Pengelola KIP-K</p>
                  {isApproved ? (
                    <div className="w-20 h-16 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center mx-auto my-2">
                      <QrCode size={28} className="text-[#263F93]" />
                    </div>
                  ) : (
                    <div className="h-10 sm:h-16" />
                  )}
                  <p className="font-bold underline break-words">{signature?.pengelola_nama ?? "Encep Jianul Hayat, S.T., M.T."}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 break-words">NIP. {signature?.pengelola_nip ?? "197804202006041001"}</p>
                </div>
                <div className="min-w-0">
                  <p>Mengetahui,</p>
                  <p className="font-medium">Wakil Rektor</p>
                  {isApproved ? (
                    <div className="w-20 h-16 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center mx-auto my-2">
                      <QrCode size={28} className="text-green-600" />
                    </div>
                  ) : (
                    <div className="h-10 sm:h-16 flex items-center justify-center">
                      <span className="text-[10px] sm:text-xs text-yellow-600 border border-dashed border-yellow-300 rounded px-2 py-1 text-center">
                        {currentStatus === "Diajukan" ? "Menunggu Approval" : "Belum Disetujui"}
                      </span>
                    </div>
                  )}
                  <p className="font-bold underline break-words">{signature?.warek_nama ?? "Dr. Rina Kurniawati, S.E., M.Si."}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 break-words">NIP. {signature?.warek_nip ?? "198203152008012002"}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-4 bg-white rounded-xl shadow-lg border border-gray-200 px-3 sm:px-4 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 min-w-0">
        {isApproved ? (
          <>
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-500">
              <CheckCircle size={15} className="flex-shrink-0" /> Laporan Disetujui
            </span>
            <div className="hidden sm:block sm:flex-1" />
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <a
                href={`/api/laporan/${laporan.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap"
              >
                <Printer size={14} /> Cetak
              </a>
              <a
                href={`/api/laporan/${laporan.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-500 text-white whitespace-nowrap"
                style={{ background: "#263F93" }}
              >
                <Download size={14} /> Download PDF
              </a>
            </div>
          </>
        ) : isPending ? (
          <>
            <span className="text-sm text-yellow-600 font-500 flex items-center gap-1">
              <Clock size={14} className="flex-shrink-0" /> Menunggu persetujuan Warek III
            </span>
            <div className="hidden sm:block sm:flex-1" />
            <a
              href={`/api/laporan/${laporan.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 w-full sm:w-auto whitespace-nowrap"
            >
              <Printer size={14} /> Cetak
            </a>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-600 font-500 break-words">
              {currentStatus === "Draft" ? "Laporan masih draf. Ajukan untuk review Warek III." : "Status: " + currentStatus}
            </span>
            <div className="hidden sm:block sm:flex-1" />
            <a
              href={`/api/laporan/${laporan.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 w-full sm:w-auto whitespace-nowrap"
            >
              <Printer size={14} /> Cetak
            </a>
          </>
        )}
      </div>

      {/* Approve Modal */}
      {showApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl min-w-0">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <h3 className="font-display font-700 text-base sm:text-lg text-gray-900 text-center mb-3">Setujui Laporan?</h3>
            <label className="flex items-start gap-2 mb-5 cursor-pointer min-w-0">
              <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="mt-0.5 accent-[#059669] flex-shrink-0" />
              <span className="text-xs text-gray-600 break-words">Saya telah membaca dan menyetujui isi laporan ini. Tanda tangan digital akan diterapkan.</span>
            </label>
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button onClick={() => setShowApprove(false)} disabled={actionBusy} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 disabled:opacity-40">Batal</button>
              <button disabled={!checked || actionBusy} onClick={handleApprove}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: "#059669" }}>
                {actionBusy ? <Loader2 size={14} className="animate-spin" /> : null}
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revisi Modal */}
      {showRevisi && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl min-w-0">
            <h3 className="font-display font-700 text-base sm:text-lg text-gray-900 mb-3">Kembalikan untuk Revisi</h3>
            <textarea value={revisiNote} onChange={e => setRevisiNote(e.target.value)} rows={4}
              placeholder="Catatan revisi untuk Admin..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none mb-4 min-w-0" />
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button onClick={() => setShowRevisi(false)} disabled={actionBusy} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 disabled:opacity-40">Batal</button>
              <button onClick={handleReject} disabled={!revisiNote.trim() || actionBusy}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: "#D97706" }}>
                {actionBusy ? <Loader2 size={14} className="animate-spin" /> : null}
                Kirim Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
