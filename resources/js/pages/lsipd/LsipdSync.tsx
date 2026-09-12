import { useState, useEffect } from "react";
import { RefreshCw, CheckCircle, XCircle, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import * as lsipdService from "@/services/lsipdService";
import type { LsipdStatus, LsipdAllResult, LsipdSyncProgress } from "@/services/lsipdService";

export default function LsipdSync() {
  const [status, setStatus] = useState<LsipdStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [progress, setProgress] = useState<LsipdSyncProgress | null>(null);
  const [result, setResult] = useState<LsipdAllResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteResult, setDeleteResult] = useState<number | null>(null);

  const isSyncing = starting || (progress !== null && (progress.status === "pending" || progress.status === "running"));

  const fetchStatus = async () => {
    setStatusLoading(true);
    setError(null);
    try {
      const data = await lsipdService.getLsipdStatus();
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setStatusLoading(false);
    }
  };

  // Resume progress saat kembali ke halaman (progress tersimpan di DB).
  useEffect(() => {
    let cancelled = false;
    lsipdService
      .getSyncProgress()
      .then((p) => { if (!cancelled) setProgress(p); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Poll progress selama proses berjalan.
  useEffect(() => {
    if (!progress || (progress.status !== "pending" && progress.status !== "running")) return;
    const runId = progress.id;
    const timer = setInterval(async () => {
      try {
        const p = await lsipdService.getSyncProgress(runId);
        setProgress(p);
      } catch {
        // abaikan error sementara, lanjut polling
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [progress?.id, progress?.status]);

  // Set hasil akhir / error dari progress yang sudah selesai.
  useEffect(() => {
    if (!progress) return;
    if (progress.status === "success") {
      setResult({
        inserted: progress.inserted,
        updated: progress.updated,
        unchanged: progress.unchanged,
        skipped: progress.skipped,
        total: progress.total,
        transkrip_success: progress.transkrip_success,
        transkrip_failed: progress.transkrip_failed,
      });
    } else if (progress.status === "failed") {
      setError(progress.message || "Gagal sinkronisasi.");
    }
  }, [progress?.status]);

  const handleBulkSync = async () => {
    if (!window.confirm("Sinkronkan semua data mahasiswa dari Sistem Akademik?")) return;
    setStarting(true);
    setResult(null);
    setError(null);
    try {
      const { run_id } = await lsipdService.startSyncAllMahasiswa();
      setProgress({
        id: run_id,
        status: "pending",
        phase: "biodata",
        total: 0,
        processed: 0,
        percent: 0,
        inserted: 0,
        updated: 0,
        unchanged: 0,
        skipped: 0,
        transkrip_success: 0,
        transkrip_failed: 0,
        message: "Memulai sinkronisasi...",
        started_at: null,
        finished_at: null,
      });
    } catch (err: unknown) {
      const e = err as { status?: number; error?: { data?: { run_id?: string } }; message?: string };
      if (e?.status === 409 && e?.error?.data?.run_id) {
        const p = await lsipdService.getSyncProgress(e.error.data.run_id);
        setProgress(p);
      } else {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      setStarting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (deleteConfirm !== "HAPUS SEMUA") return;
    setDeleting(true);
    setDeleteError(null);
    setDeleteResult(null);
    try {
      const data = await lsipdService.deleteAllMahasiswa(deleteConfirm);
      setDeleteResult(data.deleted);
      setDeleteOpen(false);
      setDeleteConfirm("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Sinkronisasi Data LSIPD</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Sinkronkan data mahasiswa dari Sistem Akademik LSIPD
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Status Koneksi API</h2>
          <button
            onClick={fetchStatus}
            disabled={statusLoading}
            className="flex items-center gap-1.5 text-xs text-[#263F93] hover:text-[#1B2F73] disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={13} className={statusLoading ? "animate-spin" : ""} />
            {statusLoading ? "Memuat..." : "Perbarui Status"}
          </button>
        </div>

        {statusLoading && !status ? (
          <p className="text-sm text-gray-400 italic">Memuat status...</p>
        ) : status ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {status.configured ? (
                <span className="flex items-center gap-1.5 text-sm text-green-700">
                  <CheckCircle size={15} className="text-green-500" />
                  API Terhubung
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm text-red-600">
                  <XCircle size={15} className="text-red-500" />
                  API Belum Dikonfigurasi
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              URL: <span className="font-mono">{status.base_url || "—"}</span>
            </p>
            <p className="text-xs text-gray-400">
              Token: {status.token_ok ? (
                <span className="text-green-600">Valid</span>
              ) : (
                <span className="text-red-600">Invalid / Kosong</span>
              )}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Klik "Perbarui Status" untuk memeriksa koneksi.</p>
        )}
      </div>

      {/* Bulk Sync Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">
          Sinkronisasi Bulk Semua Mahasiswa
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Tarik dan perbarui data seluruh mahasiswa dari Sistem Akademik LSIPD dalam satu langkah.
        </p>

        <button
          onClick={handleBulkSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-[#263F93] hover:bg-[#1B2F73] disabled:bg-[#263F93]/50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <RefreshCw size={15} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Menyinkronkan..." : "Sinkronkan Semua Mahasiswa"}
        </button>

        {isSyncing && progress && (
          <div className="mt-4 p-4 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <Loader2 size={15} className="animate-spin text-[#263F93]" />
                {progress.phase === "transkrip"
                  ? "Menyinkronkan transkrip (mata kuliah, IPS, IPK)..."
                  : "Menyinkronkan data mahasiswa..."}
              </p>
              <span className="text-sm font-semibold text-[#263F93]">{progress.percent}%</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#263F93] transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {progress.message || "Memproses..."}
              {progress.total > 0 ? ` (${progress.processed}/${progress.total})` : ""}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">Gagal sinkronisasi: {error}</p>
          </div>
        )}

        {result && !isSyncing && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-1">
            <p className="font-medium text-green-800 text-sm flex items-center gap-1.5">
              <CheckCircle size={15} className="text-green-500" />
              Sinkronisasi selesai!
            </p>
            <p className="text-sm text-green-700">
              <strong>{result.inserted}</strong> data baru,{" "}
              <strong>{result.updated}</strong> diperbarui,{" "}
              <strong>{result.unchanged}</strong> tidak berubah,{" "}
              <strong>{result.skipped}</strong> dilewati
            </p>
            <p className="text-xs text-green-600">
              Transkrip: <strong>{result.transkrip_success}</strong> berhasil,{" "}
              <strong>{result.transkrip_failed}</strong> gagal
            </p>
            <p className="text-xs text-green-600">
              Total diproses: {result.total} mahasiswa
            </p>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-red-700 mb-1 flex items-center gap-1.5">
          <AlertTriangle size={15} className="text-red-500" />
          Hapus Semua Data Mahasiswa
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Menghapus seluruh data mahasiswa beserta data yang berelasi (nilai, dokumen,
          surat peringatan, bebas tanggungan, dan akun login). Tindakan ini permanen dan
          tidak dapat dibatalkan.
        </p>

        <button
          onClick={() => { setDeleteError(null); setDeleteConfirm(""); setDeleteOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Trash2 size={15} />
          Hapus Semua Data Mahasiswa
        </button>

        {deleteResult !== null && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <CheckCircle size={15} className="text-green-500 inline mr-1.5" />
              {deleteResult} mahasiswa beserta seluruh data terkait telah dihapus.
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal open={deleteOpen} onClose={() => { if (!deleting) setDeleteOpen(false); }} title="Hapus Semua Data Mahasiswa" width="max-w-md">
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-700 break-words">
              Anda akan menghapus <strong>SEMUA data mahasiswa</strong> beserta data berelasi
              dan akun loginnya secara permanen. Pastikan Anda sudah membackup data jika diperlukan.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ketik <span className="font-semibold text-red-600">HAPUS SEMUA</span> untuk konfirmasi:
            </label>
            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              disabled={deleting}
              placeholder="HAPUS SEMUA"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 disabled:opacity-50"
            />
          </div>

          {deleteError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 min-w-0">
              <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 break-words min-w-0">{deleteError}</p>
            </div>
          )}

          <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3 min-[420px]:justify-end">
            <button
              onClick={() => { if (!deleting) setDeleteOpen(false); }}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={deleteConfirm !== "HAPUS SEMUA" || deleting}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#DC2626" }}
            >
              {deleting ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              {deleting ? "Menghapus..." : "Hapus Permanen"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
