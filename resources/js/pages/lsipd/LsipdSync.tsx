import { useState } from "react";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import * as lsipdService from "@/services/lsipdService";
import type { LsipdStatus, LsipdAllResult } from "@/services/lsipdService";

export default function LsipdSync() {
  const [status, setStatus] = useState<LsipdStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<LsipdAllResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleBulkSync = async () => {
    if (!window.confirm("Sinkronkan semua data mahasiswa dari Sistem Akademik?")) return;
    setSyncing(true);
    setResult(null);
    setError(null);
    try {
      const data = await lsipdService.syncAllMahasiswa();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setSyncing(false);
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
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-[#263F93] hover:bg-[#1B2F73] disabled:bg-[#263F93]/50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Menyinkronkan..." : "Sinkronkan Semua Mahasiswa"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">Gagal sinkronisasi: {error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-1">
            <p className="font-medium text-green-800 text-sm flex items-center gap-1.5">
              <CheckCircle size={15} className="text-green-500" />
              Sinkronisasi selesai!
            </p>
            <p className="text-sm text-green-700">
              <strong>{result.inserted}</strong> data baru,{" "}
              <strong>{result.updated}</strong> diperbarui,{" "}
              <strong>{result.skipped}</strong> dilewati
            </p>
            <p className="text-xs text-green-600">
              Total diproses: {result.total} mahasiswa
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
