import { useState, useEffect } from "react";
import { FileText, CheckCircle, Clock, RotateCcw, Printer, Loader2, X } from "lucide-react";
import { api } from "@/services/api";
import { previewLaporanPdf, downloadLaporanPdf } from "@/services/laporanService";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";
type LStatus = "Menunggu" | "Disetujui" | "Dikembalikan";

interface Laporan {
  id: number;
  judul: string;
  nomor: string;
  periode: string;
  tanggal: string;
  summary: string;
  status: LStatus;
  approvedDate?: string;
}

const TABS: { label: string; status: LStatus | "Semua" }[] = [
  { label: "Menunggu Approval", status: "Menunggu" },
  { label: "Disetujui", status: "Disetujui" },
  { label: "Dikembalikan", status: "Dikembalikan" },
];

const statusStyle: Record<LStatus, { badge: string; icon: React.ReactNode }> = {
  Menunggu: { badge: "bg-yellow-100 text-yellow-700", icon: <Clock size={13} className="text-yellow-500" /> },
  Disetujui: { badge: "bg-green-100 text-green-700", icon: <CheckCircle size={13} className="text-green-500" /> },
  Dikembalikan: { badge: "bg-orange-100 text-orange-700", icon: <RotateCcw size={13} className="text-orange-500" /> },
};

export default function WarekLaporanList() {
  const [activeTab, setActiveTab] = useState<LStatus>("Menunggu");
  const [filterTahunAjaran, setFilterTahunAjaran] = useState(getCurrentTahunAjaran());
  const [data, setData] = useState<Laporan[]>([]);
  const [counts, setCounts] = useState<Record<LStatus, number>>({ Menunggu: 0, Disetujui: 0, Dikembalikan: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [previewingId, setPreviewingId] = useState<number | null>(null);
  const [actingId, setActingId] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [returningId, setReturningId] = useState<number | null>(null);
  const [returnNote, setReturnNote] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const handlePreviewPdf = async (id: number) => {
    setPreviewingId(id);
    try {
      await previewLaporanPdf(id);
    } catch (err: any) {
      alert(err.message || "Gagal memuat PDF.");
    } finally {
      setPreviewingId(null);
    }
  };

  const handleDownloadPdf = async (id: number) => {
    setDownloadingId(id);
    try {
      await downloadLaporanPdf(id);
    } catch (err: any) {
      alert(err.message || "Gagal mengunduh PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleApprove = async (id: number) => {
    setActingId(id);
    setActionError(null);
    try {
      await api.patch(`/laporan/${id}/approve`, {});
      setData((items) => items.filter((item) => item.id !== id));
      setCounts((current) => ({ ...current, Menunggu: Math.max(0, current.Menunggu - 1), Disetujui: current.Disetujui + 1 }));
      setApprovingId(null);
    } catch (err: any) {
      setActionError(err.message || "Gagal menyetujui laporan.");
    } finally {
      setActingId(null);
    }
  };

  const handleReturn = async () => {
    if (!returningId || returnNote.trim().length < 10) return;
    setActingId(returningId);
    setActionError(null);
    try {
      await api.patch(`/laporan/${returningId}/return`, { catatan: returnNote.trim() });
      setData((items) => items.filter((item) => item.id !== returningId));
      setCounts((current) => ({ ...current, Menunggu: Math.max(0, current.Menunggu - 1), Dikembalikan: current.Dikembalikan + 1 }));
      setReturningId(null);
      setReturnNote("");
    } catch (err: any) {
      setActionError(err.message || "Gagal mengembalikan laporan.");
    } finally {
      setActingId(null);
    }
  };

  // Fetch counts for all tabs once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tabsToFetch: LStatus[] = ["Menunggu", "Disetujui", "Dikembalikan"];
        const results = await Promise.all(
          tabsToFetch.map((s) =>
            api
              .get<{ data: Laporan[]; total: number }>(`/laporan?status=${s}&limit=100&tahun_ajaran=${filterTahunAjaran}`)
              .then((r) => [s, r.total] as [LStatus, number])
              .catch(() => [s, 0] as [LStatus, number])
          )
        );
        if (cancelled) return;
        const next = { Menunggu: 0, Disetujui: 0, Dikembalikan: 0 } as Record<LStatus, number>;
        for (const [s, t] of results) next[s] = t;
        setCounts(next);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filterTahunAjaran]);

  // Fetch data for active tab
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ data: Laporan[] }>(`/laporan?status=${activeTab}&limit=100&tahun_ajaran=${filterTahunAjaran}`);
        if (cancelled) return;
        setData(res.data ?? []);
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setError(e.message ?? "Gagal memuat laporan.");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, filterTahunAjaran]);

  const filtered = data;

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0">
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-2 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="font-display font-700 text-lg sm:text-xl text-gray-900 leading-tight">Laporan Semester</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5 break-words">Review dan setujui laporan evaluasi semester dari Biro Kemahasiswaan</p>
        </div>
        <div className="self-start min-[480px]:self-auto shrink-0">
          <TahunAjaranFilter value={filterTahunAjaran} onChange={setFilterTahunAjaran} />
        </div>
      </div>

      {actionError && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{actionError}</div>}

      {/* Filters and Tabs */}
      <div className="flex flex-wrap items-center gap-4 min-w-0">

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-full sm:w-fit min-w-0">
          {TABS.map(t => (
            <button key={t.status}
              onClick={() => setActiveTab(t.status as LStatus)}
              className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-500 transition-colors whitespace-nowrap ${activeTab === t.status ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {t.label} ({counts[t.status as LStatus] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3 sm:space-y-4 min-w-0">
        {loading && (
          <div className="bg-white rounded-xl p-8 sm:p-10 px-4 text-center shadow-sm border border-gray-100 min-w-0">
            <p className="text-gray-400 text-xs sm:text-sm">Memuat data...</p>
          </div>
        )}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-red-700 break-words min-w-0">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl p-8 sm:p-10 px-4 text-center shadow-sm border border-gray-100 min-w-0">
            <p className="text-gray-400 text-xs sm:text-sm">Tidak ada laporan dalam kategori ini.</p>
          </div>
        )}
        {!loading && !error && filtered.map(r => {
          const ss = statusStyle[r.status];
          return (
            <div key={r.id} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 min-w-0">
              <div className="flex flex-wrap items-start gap-2.5 sm:gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={22} className="text-[#263F93]" />
                </div>
                <div className="flex-1 min-w-0 basis-48">
                  <div className="flex flex-wrap items-center gap-2 mb-1 min-w-0">
                    <h3 className="font-600 text-gray-800 text-xs sm:text-sm break-words min-w-0">{r.judul}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-500 flex items-center gap-1 whitespace-nowrap shrink-0 ${ss.badge}`}>
                      {ss.icon} {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-all">{r.nomor}</p>
                  <p className="text-xs text-gray-500 mt-1 break-words">{r.periode} · Diajukan: {r.tanggal}</p>
                  <p className="text-xs text-gray-500 mt-1 break-words">{r.summary}</p>
                  {r.approvedDate && (
                    <p className="text-xs text-green-600 mt-1 font-500 break-words">Disetujui: {r.approvedDate}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0 w-full min-[480px]:w-auto">
                  {r.status === "Menunggu" && (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button onClick={() => handlePreviewPdf(r.id)} disabled={previewingId === r.id || actingId === r.id} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#263F93] text-[#263F93] text-sm hover:bg-blue-50 whitespace-nowrap disabled:opacity-50">
                        {previewingId === r.id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />} Pratinjau
                      </button>
                      <button onClick={() => { setReturningId(r.id); setReturnNote(""); }} disabled={actingId === r.id} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-orange-300 text-orange-700 text-sm hover:bg-orange-50 whitespace-nowrap disabled:opacity-50">
                        <RotateCcw size={14} /> Kembalikan
                      </button>
                      <button onClick={() => setApprovingId(r.id)} disabled={actingId === r.id} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 text-sm whitespace-nowrap disabled:opacity-50">
                        {actingId === r.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Setujui
                      </button>
                    </div>
                  )}
                  {r.status === "Disetujui" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreviewPdf(r.id)}
                        disabled={previewingId === r.id}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-[#263F93] text-[#263F93] text-sm hover:bg-blue-50 whitespace-nowrap disabled:opacity-50"
                      >
                        {previewingId === r.id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                        {previewingId === r.id ? "Loading..." : "Pertinjau"}
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(r.id)}
                        disabled={downloadingId === r.id}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap disabled:opacity-50"
                      >
                        {downloadingId === r.id ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                        {downloadingId === r.id ? "Loading..." : "PDF"}
                      </button>
                    </div>
                  )}
                  {r.status === "Dikembalikan" && (
                    <span className="px-4 py-2 rounded-lg text-sm border border-orange-200 text-orange-700 text-center whitespace-nowrap">Menunggu revisi Admin</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {returningId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="font-700 text-gray-800">Kembalikan untuk Revisi</h2>
              <button onClick={() => setReturningId(null)} aria-label="Tutup" className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Berikan catatan revisi untuk Admin:</p>
            <textarea value={returnNote} onChange={(e) => setReturnNote(e.target.value)} rows={4} placeholder="Tuliskan bagian yang perlu diperbaiki..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setReturningId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Batal</button>
              <button onClick={handleReturn} disabled={returnNote.trim().length < 10 || actingId === returningId} className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white bg-orange-500 disabled:opacity-40">
                {actingId === returningId ? "Memproses..." : "Kirim Revisi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {approvingId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="font-700 text-gray-800">Konfirmasi Persetujuan</h2>
              <button onClick={() => setApprovingId(null)} aria-label="Tutup" className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="rounded-xl bg-green-50 border border-green-200 p-3 mb-5 text-sm text-green-800">
              Laporan yang disetujui akan menjadi dokumen final dan ditandatangani secara digital.
            </div>
            <div className="flex gap-2">
              <button onClick={() => setApprovingId(null)} disabled={actingId === approvingId} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 disabled:opacity-40">Batal</button>
              <button onClick={() => handleApprove(approvingId)} disabled={actingId === approvingId} className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white bg-green-600 hover:bg-green-700 disabled:opacity-40 flex items-center justify-center gap-2">
                {actingId === approvingId && <Loader2 size={14} className="animate-spin" />}
                {actingId === approvingId ? "Memproses..." : "Setujui Laporan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
