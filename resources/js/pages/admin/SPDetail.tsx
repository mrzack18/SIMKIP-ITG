import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft, AlertTriangle, CheckCircle, Clock, Printer,
  ChevronDown, ChevronUp, FileText, Loader2, XCircle,
} from "lucide-react";
import logoItg from "@/imports/logo_itg.jpg";
import { getSPDetail, updateSPStatus, type SPDetailResponse } from "@/services/spService";
import { getKonfigurasiAll, type SignatureConfig } from "@/services/konfigurasiService";
import type { SuratPeringatan } from "@/types";
import { TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";

// ── Static UI mappings ───────────────────────────────────────────────────────
const levelColor: Record<string, { bg: string; text: string; border: string }> = {
  SP1: { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  SP2: { bg: "#FEE2E2", text: "#991B1B", border: "#EF4444" },
  SP3: { bg: "#7F1D1D", text: "#FEE2E2", border: "#7F1D1D" },
};

function formatTanggal(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// ── SP body text for formal letter ──────────────────────────────────────────
function SPBodyText({ level, alasan, batasEvaluasi }: { level: string; alasan: string; batasEvaluasi: string | null }) {
  const batas = batasEvaluasi ? formatTanggal(batasEvaluasi) : "—";
  if (level === "SP1") return (
    <p>
      Berdasarkan hasil evaluasi akademik semester berjalan, Saudara dinyatakan mendapatkan Surat Peringatan
      Pertama (SP-1) dikarenakan: {alasan}. Saudara diberikan waktu hingga <strong>{batas}</strong> untuk
      memperbaiki kondisi akademik. Apabila tidak ada perbaikan, maka akan diterbitkan SP-2.
    </p>
  );
  if (level === "SP2") return (
    <p>
      Saudara kembali mendapatkan evaluasi negatif setelah SP-1 sebelumnya. Dengan diterbitkannya SP-2 ini,
      Saudara diwajibkan untuk segera berkonsultasi dengan pembimbing akademik. Batas evaluasi:{" "}
      <strong>{batas}</strong>.
    </p>
  );
  return (
    <p>
      Ini merupakan surat peringatan terakhir sebelum dilakukannya proses pemberhentian sebagai penerima KIP-K.
      Saudara diminta untuk segera menghubungi Pengelola KIP-K dalam waktu 7 hari kerja sejak surat ini diterbitkan.
    </p>
  );
}

// ── Timeline item outcome helper ─────────────────────────────────────────────
function spOutcome(sp: SuratPeringatan): { outcome: "resolved" | "active" | "stopped"; text: string } {
  if (sp.status === "Selesai")         return { outcome: "resolved", text: "Selesai — Mahasiswa Membaik" };
  if (sp.status === "Pemberhentian")   return { outcome: "stopped",  text: "Pemberhentian KIP-K" };
  if (sp.status === "Masa Tenggang")   return { outcome: "active",   text: "Aktif — Masa Tenggang" };
  return { outcome: "active", text: "Aktif" };
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SPDetail() {
  const { id } = useParams<{ id: string }>();
  const spId = id ? parseInt(id, 10) : NaN;

  const [detail, setDetail]           = useState<SPDetailResponse | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [notFound, setNotFound]       = useState(false);
  const [signature, setSignature]     = useState<SignatureConfig | null>(null);
  const [masaTenggang, setMasaTenggang] = useState<number>(180);
  

  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(null);
  const [showMarkDone, setShowMarkDone]         = useState(false);
  const [showSuratModal, setShowSuratModal]     = useState(false);

  // Mark done form
  const [markDoneCatatan, setMarkDoneCatatan]   = useState("");
  const [markDoneLoading, setMarkDoneLoading]   = useState(false);
  const [markDoneError, setMarkDoneError]       = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (isNaN(spId)) { setNotFound(true); setLoading(false); return; }
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const res = await getSPDetail(spId);
      setDetail(res);
    } catch (err: any) {
      if (err.status === 404) setNotFound(true);
      else setError(err.message || "Gagal memuat detail SP.");
    } finally {
      setLoading(false);
    }
  }, [spId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  // Load signature + masa tenggang from BE
  useEffect(() => {
    getKonfigurasiAll()
      .then((res) => {
        if (res?.data?.signature) setSignature(res.data.signature);
        const reg = res?.data?.regulasi?.find((r: any) => r.nama === "Masa Tenggang SP");
        if (reg) setMasaTenggang(Number(reg.nilai));
      })
      .catch(() => { /* fallback */ });
  }, []);

  const handleMarkDone = async () => {
    if (!detail || markDoneLoading) return;
    setMarkDoneLoading(true);
    setMarkDoneError(null);
    try {
      await updateSPStatus(detail.data.id, {
        status: "Selesai",
        catatan: markDoneCatatan.trim() || undefined,
      });
      await fetchDetail();
      window.dispatchEvent(new CustomEvent('sp:updated'));
      setShowMarkDone(false);
      setMarkDoneCatatan("");
    } catch (err: any) {
      setMarkDoneError(err.message || "Gagal mengubah status SP.");
    } finally {
      setMarkDoneLoading(false);
    }
  };

  // ── Loading ──
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm text-center">
        <Loader2 size={22} className="animate-spin flex-shrink-0" />
        <span>Memuat detail SP...</span>
      </div>
    </div>
  );

  // ── Not Found ──
  if (notFound) return (
    <div className="max-w-3xl mx-auto w-full space-y-3 sm:space-y-4 min-w-0">
      <Link to="/admin/sp" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft size={15} /> Surat Peringatan
      </Link>
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-10 text-center min-w-0">
        <AlertTriangle size={32} className="mx-auto text-amber-400 mb-3" />
        <h2 className="font-600 text-gray-800 mb-1">SP Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500">ID tidak valid atau SP sudah dihapus.</p>
      </div>
    </div>
  );

  // ── Error ──
  if (error || !detail) return (
    <div className="max-w-3xl mx-auto w-full space-y-3 sm:space-y-4 min-w-0">
      <Link to="/admin/sp" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft size={15} /> Surat Peringatan
      </Link>
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 text-center min-w-0">
        <XCircle size={28} className="mx-auto text-red-400 mb-3" />
        <p className="text-sm text-red-700 break-words">{error ?? "Terjadi kesalahan."}</p>
        <button onClick={fetchDetail} className="mt-3 text-xs text-[#263F93] underline">Coba lagi</button>
      </div>
    </div>
  );

  const sp     = detail.data;
  const extra  = detail.extra;
  const history = detail.history ?? [];
  const lc     = levelColor[sp.level] ?? levelColor.SP1;

  const totalDays  = masaTenggang;
  const elapsed    = totalDays - (sp.sisa ?? 0);
  const progressPct = Math.min(100, (elapsed / totalDays) * 100);
  const nSurat     = sp.nomorSurat ?? "—";
  const isSelesai  = sp.status === "Selesai" || sp.status === "Pemberhentian";

  return (
    <div className="max-w-3xl mx-auto w-full space-y-3 sm:space-y-4 min-w-0">
      {/* Breadcrumb and Filter */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Link to="/admin/sp" className="hover:text-gray-700 flex items-center gap-1 shrink-0">
            <ChevronLeft size={15} /> Surat Peringatan
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-gray-800 font-500 truncate">Detail SP — {sp.nama ?? "—"}</span>
        </div>
              </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 min-w-0">
        <div className="flex flex-wrap items-start gap-4 sm:gap-6 min-w-0">
          {/* SP Level Badge */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border-2"
            style={{ background: lc.bg, borderColor: lc.border }}
          >
            <span className="text-[10px] sm:text-xs font-600" style={{ color: lc.text }}>SURAT</span>
            <span className="font-display font-800 text-lg sm:text-xl leading-none" style={{ color: lc.text }}>
              {sp.level.replace("SP", "")}
            </span>
            <span className="text-[10px] sm:text-xs font-600" style={{ color: lc.text }}>SP</span>
          </div>

          <div className="flex-1 min-w-0 basis-40">
            <div className="flex items-center gap-2 flex-wrap mb-2 min-w-0">
              <h2 className="font-display font-700 text-lg sm:text-xl text-gray-900 break-words leading-tight">{sp.nama ?? "—"}</h2>
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 whitespace-nowrap ${
                sp.status === "Aktif"          ? "bg-yellow-100 text-yellow-700" :
                sp.status === "Masa Tenggang"  ? "bg-orange-100 text-orange-700" :
                sp.status === "Pemberhentian"  ? "bg-red-100 text-red-700"       : "bg-green-100 text-green-700"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {sp.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 break-words">
              {sp.nim ?? "—"} · {sp.prodi ?? "—"} · Angkatan {sp.angkatan ?? "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Diterbitkan: {formatTanggal(sp.tanggalTerbit)}</p>
          </div>

          {sp.batasEvaluasi && sp.batasEvaluasi !== "-" && (
            <div className="w-full sm:w-auto sm:min-w-52 min-w-0">
              <div className="text-xs text-gray-500 mb-1">
                Evaluasi hingga: <span className="font-500 text-gray-700">{formatTanggal(sp.batasEvaluasi)}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-24 sm:min-w-32">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${progressPct}%`,
                    background: progressPct > 80 ? "#DC2626" : progressPct > 50 ? "#F59E0B" : "#059669",
                  }} />
                </div>
                <span className="text-xs text-gray-500 shrink-0">{Math.round(progressPct)}%</span>
              </div>
              {(sp.sisa ?? 0) > 0 ? (
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <Clock size={11} className="flex-shrink-0" /> Tersisa {sp.sisa} hari
                </div>
              ) : (
                <div className="text-xs text-red-600 font-600">Masa tenggang habis</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 space-y-3 sm:space-y-4 min-w-0">
        <h3 className="font-600 text-gray-800 text-sm border-b border-gray-100 pb-3">Detail Pelanggaran</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-sm min-w-0">
          <div className="min-w-0">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Jenis Pelanggaran</span>
            <div className="mt-1">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-500 inline-block">
                {extra.jenisPelanggaran ?? "—"}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Diterbitkan Oleh</span>
            <div className="mt-1 font-500 text-gray-700 break-words">{extra.diterbitkanOleh ?? "—"}</div>
            <div className="text-xs text-gray-400">{formatTanggal(sp.tanggalTerbit)}</div>
          </div>
          <div className="min-w-0">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Tahun Ajaran</span>
            <div className="mt-1 font-500 text-gray-700 break-words">{sp.tahunAjaran ?? "—"}</div>
          </div>
          <div className="sm:col-span-2 min-w-0">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Alasan / Deskripsi</span>
            <p className="mt-1 text-gray-700 leading-relaxed break-words">{sp.alasan ?? "—"}</p>
          </div>
          {extra.catatan && (
            <div className="sm:col-span-2 min-w-0">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Catatan</span>
              <p className="mt-1 text-gray-700 leading-relaxed break-words">{extra.catatan}</p>
            </div>
          )}
        </div>
      </div>

      {/* SP History Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 min-w-0">
        <h3 className="font-600 text-gray-800 text-sm mb-4">Riwayat Surat Peringatan</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Belum ada riwayat SP tercatat.</p>
        ) : (
          <div className="space-y-0 min-w-0">
            {history.map((t, i) => {
              const tlc       = levelColor[t.level] ?? levelColor.SP1;
              const isExpanded = expandedTimeline === i;
              const { outcome, text } = spOutcome(t);
              return (
                <div key={t.id} className="flex gap-2.5 sm:gap-3 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 border-2 z-10"
                      style={{ background: tlc.bg, borderColor: tlc.border, color: tlc.text }}
                    >
                      {t.level.replace("SP", "")}
                    </div>
                    {i < history.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 my-1" style={{ minHeight: 24 }} />
                    )}
                  </div>

                  <div className={`flex-1 min-w-0 pb-5 ${i < history.length - 1 ? "" : "pb-0"}`}>
                    <button
                      onClick={() => setExpandedTimeline(isExpanded ? null : i)}
                      className="w-full text-left"
                    >
                      <div className={`rounded-xl border p-3 sm:p-4 hover:shadow-sm transition-shadow cursor-pointer min-w-0 ${
                        outcome === "resolved" ? "bg-green-50 border-green-200" :
                        outcome === "active"   ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"
                      }`}>
                        <div className="flex items-start justify-between gap-2 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1 min-w-0">
                              <span className="text-sm font-600" style={{ color: tlc.text }}>{t.level}</span>
                              <span className="text-xs text-gray-400 break-words">{formatTanggal(t.tanggalTerbit)}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed break-words">{t.alasan ?? "—"}</p>
                            <div className={`flex items-center gap-1.5 mt-2 text-xs font-500 ${
                              outcome === "resolved" ? "text-green-600" : outcome === "active" ? "text-orange-600" : "text-red-600"
                            }`}>
                              {outcome === "resolved" ? <CheckCircle size={12} /> :
                               outcome === "active"   ? <Clock size={12} />       : <AlertTriangle size={12} />}
                              {text}
                            </div>
                          </div>
                          {isExpanded
                            ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                            : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                        </div>
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-current/10 text-xs text-gray-600 leading-relaxed space-y-1">
                            {t.batasEvaluasi && (
                              <p>Batas evaluasi: <span className="font-500">{formatTanggal(t.batasEvaluasi)}</span></p>
                            )}
                            {(t.sisa ?? 0) > 0 && sp.status !== "Selesai" && (
                              <p>Sisa: <span className="font-500">{t.sisa} hari</span></p>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      {!isSelesai && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-3 sm:px-4 py-3.5 sm:py-4 grid grid-cols-1 min-[480px]:grid-cols-2 gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setShowMarkDone(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white transition-colors whitespace-nowrap"
            style={{ background: "#059669" }}
          >
            <CheckCircle size={15} className="flex-shrink-0" /> Tandai Selesai (Mahasiswa Membaik)
          </button>
          <Link
            to="/admin/sp/terbitkan"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white transition-colors whitespace-nowrap"
            style={{ background: "#DC2626" }}
          >
            <AlertTriangle size={15} className="flex-shrink-0" /> Eskalasi ke {sp.level === "SP1" ? "SP2" : "SP3"}
          </Link>
          <button
            onClick={() => setShowSuratModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 border border-[#263F93] text-[#263F93] hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            <FileText size={15} className="flex-shrink-0" /> Lihat Surat Resmi
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <Printer size={15} className="flex-shrink-0" /> Cetak Surat Peringatan
          </button>
        </div>
      )}

      {isSelesai && (
        <div className="flex justify-start">
          <Link to="/admin/sp" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ChevronLeft size={15} /> Kembali ke Daftar
          </Link>
        </div>
      )}

      {/* ── Mark Done Confirmation Modal ──────────────────────────────── */}
      {showMarkDone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl min-w-0">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <h3 className="font-display font-700 text-base sm:text-lg text-gray-900 text-center mb-2">Tandai SP Selesai?</h3>
            <p className="text-gray-500 text-sm text-center mb-4 break-words">
              Mahasiswa <strong>{sp.nama}</strong> dinyatakan telah memperbaiki kondisi dan{" "}
              <strong>{sp.level}</strong> akan ditandai sebagai <strong>Selesai</strong>.
            </p>
            <div className="mb-4">
              <label className="block text-xs text-gray-600 mb-1.5">Catatan (Opsional)</label>
              <textarea
                value={markDoneCatatan}
                onChange={(e) => setMarkDoneCatatan(e.target.value)}
                rows={2}
                placeholder="Tambahkan catatan evaluasi..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none min-w-0"
              />
            </div>
            {markDoneError && (
              <p className="text-xs text-red-600 mb-3 text-center break-words">{markDoneError}</p>
            )}
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => { setShowMarkDone(false); setMarkDoneCatatan(""); setMarkDoneError(null); }}
                disabled={markDoneLoading}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-500 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Batal
              </button>
              <button
                onClick={handleMarkDone}
                disabled={markDoneLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-500 text-white flex items-center justify-center gap-2 disabled:opacity-40"
                style={{ background: "#059669" }}
              >
                {markDoneLoading && <Loader2 size={14} className="animate-spin" />}
                Ya, Tandai Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Surat Resmi Modal ─────────────────────────────────────────── */}
      {showSuratModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col min-w-0">
            <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100 flex-shrink-0 min-w-0">
              <h3 className="font-600 text-xs sm:text-sm text-gray-800 truncate">Surat Peringatan Resmi</h3>
              <button
                onClick={() => setShowSuratModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 text-lg leading-none flex-shrink-0"
              >✕</button>
            </div>

            <div className="overflow-y-auto flex-1 p-3 sm:p-6 min-w-0">
              <div className="border-2 border-[#263F93] rounded-xl p-1 min-w-0">
                <div className="border border-[#263F93] rounded-lg p-3 sm:p-6 min-w-0">
                  {/* Kop surat */}
                  <div className="flex items-center gap-2.5 sm:gap-4 border-b-2 border-[#263F93] pb-3 sm:pb-4 mb-4 sm:mb-6 min-w-0">
                    <img src={logoItg} alt="Logo ITG" className="h-11 w-11 sm:h-16 sm:w-16 object-contain flex-shrink-0" />
                    <div className="flex-1 text-center min-w-0">
                      <p className="text-[10px] sm:text-xs font-semibold leading-snug">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
                      <p className="font-bold text-xs sm:text-sm uppercase tracking-wide leading-snug">INSTITUT TEKNOLOGI GARUT</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">Telp. (0262) 2800433 | www.itg.ac.id</p>
                    </div>
                  </div>

                  {/* Metadata grid */}
                  <div className="grid grid-cols-[96px_8px_1fr] sm:grid-cols-[120px_8px_1fr] gap-y-1 text-xs sm:text-sm mb-4 sm:mb-6 min-w-0">
                    <span>Nomor</span><span>:</span><span className="break-words min-w-0">{nSurat}</span>
                    <span>Tanggal</span><span>:</span><span className="break-words min-w-0">{formatTanggal(sp.tanggalTerbit)}</span>
                    <span>Tahun Ajaran</span><span>:</span><span className="break-words min-w-0">{sp.tahunAjaran ?? "—"}</span>
                    <span>Perihal</span><span>:</span>
                    <span className="font-semibold break-words min-w-0">
                      Surat Peringatan {sp.level} — {(sp.alasan ?? "").split(" ").slice(0, 6).join(" ")}...
                    </span>
                  </div>

                  {/* Kepada */}
                  <div className="mb-4 sm:mb-6 text-xs sm:text-sm min-w-0">
                    <p>Kepada Yth,</p>
                    <p className="font-semibold break-words">{sp.nama ?? "—"}</p>
                    <p className="break-words">NIM: {sp.nim ?? "—"} | {sp.prodi ?? "—"}</p>
                  </div>

                  <div className="text-xs sm:text-sm mb-4"><p>Dengan hormat,</p></div>

                  <div className="text-xs sm:text-sm space-y-3 leading-relaxed mb-6 sm:mb-8 min-w-0">
                    <SPBodyText level={sp.level} alasan={sp.alasan ?? "—"} batasEvaluasi={sp.batasEvaluasi} />
                    <p>
                      Demikian surat peringatan ini kami sampaikan. Besar harapan kami agar Saudara dapat segera
                      menindaklanjuti hal ini demi kelangsungan studi Saudara sebagai penerima manfaat KIP-K.
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-8 mt-6 sm:mt-8 text-[11px] sm:text-sm text-center min-w-0">
                    <div className="min-w-0">
                      <p className="break-words">Garut, {formatTanggal(sp.tanggalTerbit)}</p>
                      <p className="font-medium">Pengelola KIP-K</p>
                      <div className="h-10 sm:h-16" />
                      <p className="font-bold underline break-words">{extra.diterbitkanOleh ?? "—"}</p>
                    </div>
                    <div className="min-w-0">
                      <p>Mengetahui,</p>
                      <p className="font-medium">Wakil Rektor Bidang Kemahasiswaan</p>
                      <div className="h-10 sm:h-16" />
                      <p className="font-bold underline break-words">{signature?.warek_nama ?? "Dr. Rina Kurniawati, S.E., M.Si."}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 break-words">NIP. {signature?.warek_nip ?? "198203252008012002"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 sm:px-4 py-3.5 sm:py-4 border-t border-gray-100 flex flex-col-reverse min-[420px]:flex-row min-[420px]:justify-end gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setShowSuratModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg text-sm text-white flex items-center justify-center gap-2"
                style={{ background: "#263F93" }}
              >
                <Printer size={14} /> Cetak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
