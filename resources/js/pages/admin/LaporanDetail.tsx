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
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat laporan...
      </div>
    );
  }

  if (error || !laporan) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Link to="/admin/laporan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft size={16} /> Laporan Semester
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error || "Laporan tidak ditemukan."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/laporan" className="hover:text-gray-700 flex items-center gap-1">
          <ChevronLeft size={15} /> Laporan Semester
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-500">Detail Laporan</span>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{actionError}</p>
        </div>
      )}

      {/* Formal report document */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {!isApproved && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-5 py-2.5 flex items-center justify-center gap-2">
            <span className="text-xs font-600 text-yellow-700 flex items-center justify-center gap-1">
              <Clock size={14} />
              {currentStatus === "Dikembalikan" ? "Dikembalikan untuk Revisi" : "Menunggu Persetujuan Warek III"}
            </span>
          </div>
        )}

        <div className="p-8">
          <div className="border-2 border-[#263F93] rounded-xl p-1">
            <div className="border border-[#263F93] rounded-lg p-8 space-y-6">

              <div className="flex items-center gap-4 border-b-2 border-[#263F93] pb-5 mb-6">
                <img src={logoItg} alt="Logo ITG" className="h-16 w-16 object-contain" />
                <div className="flex-1 text-center">
                  <p className="text-sm font-semibold">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
                  <p className="font-bold text-base uppercase tracking-wide">INSTITUT TEKNOLOGI GARUT</p>
                  <p className="text-xs text-gray-600">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
                  <p className="text-xs text-gray-600">Telp. (0262) 2800433 | www.itg.ac.id</p>
                </div>
              </div>

              <div className="grid grid-cols-[120px_8px_1fr] gap-y-1.5 text-sm mb-6">
                <span className="text-gray-600">Nomor</span><span>:</span>
                <span className="font-mono">{laporan.nomorSurat || "—"}</span>
                <span className="text-gray-600">Tanggal</span><span>:</span>
                <span>{formatDateLong(laporan.submittedAt || laporan.tanggalLaporan)}</span>
                <span className="text-gray-600">Perihal</span><span>:</span>
                <span className="font-semibold">{laporan.judul}</span>
                <span className="text-gray-600">Kepada Yth.</span><span>:</span>
                <span>{laporan.tujuanProdi ? "Wakil Rektor III & Program Studi" : "Wakil Rektor III ITG"}</span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-3">I. Ringkasan Data Mahasiswa KIP-K</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl p-3 border-l-4" style={{ borderColor: "#263F93", background: "#F8FAFC" }}>
                    <div className="font-bold text-lg" style={{ color: "#263F93" }}>{statistics?.totalMahasiswa ?? "—"}</div>
                    <div className="text-xs text-gray-500">Total Mahasiswa</div>
                  </div>
                  <div className="rounded-xl p-3 border-l-4" style={{ borderColor: "#059669", background: "#F8FAFC" }}>
                    <div className="font-bold text-lg" style={{ color: "#059669" }}>
                      {statistics ? `${statistics.kipk.reguler.total} (${statistics.kipk.reguler.persen}%)` : "—"}
                    </div>
                    <div className="text-xs text-gray-500">Mahasiswa Reguler</div>
                  </div>
                  <div className="rounded-xl p-3 border-l-4" style={{ borderColor: "#7C3AED", background: "#F8FAFC" }}>
                    <div className="font-bold text-lg" style={{ color: "#7C3AED" }}>
                      {statistics ? `${statistics.kipk.aspirasi.total} (${statistics.kipk.aspirasi.persen}%)` : "—"}
                    </div>
                    <div className="text-xs text-gray-500">Mahasiswa Aspirasi</div>
                  </div>
                  <div className="rounded-xl p-3 border-l-4" style={{ borderColor: "#D4A72C", background: "#F8FAFC" }}>
                    <div className="font-bold text-lg" style={{ color: "#D4A72C" }}>{statistics?.rataIpk ?? "—"}</div>
                    <div className="text-xs text-gray-500">Rata-rata IPK</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-2">Sebaran per Angkatan</h3>
                  {statistics && statistics.distribusiAngkatan.length > 0 ? (
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={statistics.distribusiAngkatan}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="angkatan" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip formatter={(v) => [v, "Jumlah"]} />
                        <Bar dataKey="total" fill="#263F93" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
                      {statistics ? "Tidak ada data angkatan" : "Memuat..."}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-2">Tren Rata-rata IPK</h3>
                  {statistics && statistics.ipkTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={statistics.ipkTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} domain={[0, 4]} />
                        <Tooltip formatter={(v) => [v, "IPK"]} />
                        <Line type="monotone" dataKey="ipk" stroke="#D4A72C" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
                      {statistics ? "Tidak ada data IPK" : "Memuat..."}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-3">II. Data Mahasiswa</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-[#E2E8F0]">
                    <thead>
                      <tr style={{ background: "#F8FAFC" }} className="border-b border-[#E2E8F0]">
                        {["NIM", "Nama", "Prodi", "IPK", "Prestasi", "Org.", "SP", "Catatan"].map(h => (
                          <th key={h} className="text-left px-3 py-2 font-semibold text-gray-500 border-r border-[#E2E8F0] last:border-r-0">{h}</th>
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
                            className="ml-2 text-[#263F93] underline"
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
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                  <span className="font-semibold text-amber-900">Catatan Warek: </span>
                  <span className="text-amber-800">{laporan.catatanWarek}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8 mt-10 text-sm text-center">
                <div>
                  <p>Garut, {formatDateLong(laporan.submittedAt || laporan.tanggalLaporan)}</p>
                  <p className="font-medium">Pengelola KIP-K</p>
                  {isApproved ? (
                    <div className="w-20 h-16 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center mx-auto my-2">
                      <QrCode size={28} className="text-[#263F93]" />
                    </div>
                  ) : (
                    <div className="h-16" />
                  )}
                  <p className="font-bold underline">{signature?.pengelola_nama ?? "Encep Jianul Hayat, S.T., M.T."}</p>
                  <p className="text-xs text-gray-500">NIP. {signature?.pengelola_nip ?? "197804202006041001"}</p>
                </div>
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-medium">Wakil Rektor</p>
                  {isApproved ? (
                    <div className="w-20 h-16 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center mx-auto my-2">
                      <QrCode size={28} className="text-green-600" />
                    </div>
                  ) : (
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-xs text-yellow-600 border border-dashed border-yellow-300 rounded px-2 py-1">
                        {currentStatus === "Diajukan" ? "Menunggu Approval" : "Belum Disetujui"}
                      </span>
                    </div>
                  )}
                  <p className="font-bold underline">{signature?.warek_nama ?? "Dr. Rina Kurniawati, S.E., M.Si."}</p>
                  <p className="text-xs text-gray-500">NIP. {signature?.warek_nip ?? "198203152008012002"}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-4 bg-white rounded-xl shadow-lg border border-gray-200 px-5 py-4 flex flex-wrap items-center gap-3">
        {isApproved ? (
          <>
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-500">
              <CheckCircle size={15} /> Laporan Disetujui
            </span>
            <div className="flex-1" />
            <a
              href={`/api/laporan/${laporan.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              <Printer size={14} /> Cetak
            </a>
            <a
              href={`/api/laporan/${laporan.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 text-white"
              style={{ background: "#263F93" }}
            >
              <Download size={14} /> Download PDF
            </a>
          </>
        ) : isPending ? (
          <>
            <span className="text-sm text-yellow-600 font-500 flex items-center gap-1">
              <Clock size={14} /> Menunggu persetujuan Warek III
            </span>
            <div className="flex-1" />
            <a
              href={`/api/laporan/${laporan.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              <Printer size={14} /> Cetak
            </a>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-600 font-500">
              {currentStatus === "Draft" ? "Laporan masih draf. Ajukan untuk review Warek III." : "Status: " + currentStatus}
            </span>
            <div className="flex-1" />
            <a
              href={`/api/laporan/${laporan.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              <Printer size={14} /> Cetak
            </a>
          </>
        )}
      </div>

      {/* Approve Modal */}
      {showApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 text-center mb-3">Setujui Laporan?</h3>
            <label className="flex items-start gap-2 mb-5 cursor-pointer">
              <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="mt-0.5 accent-[#059669]" />
              <span className="text-xs text-gray-600">Saya telah membaca dan menyetujui isi laporan ini. Tanda tangan digital akan diterapkan.</span>
            </label>
            <div className="flex gap-3">
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
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-display font-700 text-lg text-gray-900 mb-3">Kembalikan untuk Revisi</h3>
            <textarea value={revisiNote} onChange={e => setRevisiNote(e.target.value)} rows={4}
              placeholder="Catatan revisi untuk Admin..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none mb-4" />
            <div className="flex gap-3">
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
