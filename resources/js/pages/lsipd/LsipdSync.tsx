import { useState, useEffect, useRef } from "react";
import {
  RefreshCw, CheckCircle, XCircle, Trash2, AlertTriangle, Loader2,
  Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowUpDown, Database, UserPlus,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/services/api";
import * as lsipdService from "@/services/lsipdService";
import type {
  LsipdStatus, LsipdAllResult, LsipdSyncProgress,
  LsipdMahasiswaRow, LsipdBatchItem, LsipdBelumRow,
} from "@/services/lsipdService";

interface ProdiOption { id: number; nama: string; kode: string; is_aktif: boolean }

const PAGE_SIZE = 10;

/** Checkbox dengan state indeterminate (sebagian baris terpilih). */
function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-gray-300 text-[#263F93] focus:ring-2 focus:ring-[#263F93]/30 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
    />
  );
}

export default function LsipdSync() {
  const [status, setStatus] = useState<LsipdStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [progress, setProgress] = useState<LsipdSyncProgress | null>(null);
  const [result, setResult] = useState<LsipdAllResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Modal konfirmasi sinkronisasi — menggantikan window.confirm() bawaan browser.
  const [syncConfirm, setSyncConfirm] = useState<{ mode: "all" | "selected"; nims: string[] } | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteResult, setDeleteResult] = useState<number | null>(null);

  // ── Tabel mahasiswa ─────────────────────────────────────────────────────────
  const [rows, setRows] = useState<LsipdMahasiswaRow[]>([]);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [rowsError, setRowsError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [angkatanFilter, setAngkatanFilter] = useState("Semua");
  const [prodiFilter, setProdiFilter] = useState("Semua");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const [angkatans, setAngkatans] = useState<number[]>([]);
  const [prodis, setProdis] = useState<ProdiOption[]>([]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSummary, setSyncSummary] = useState<{
    biodata: { berhasil: number; total: number };
    transkrip: { berhasil: number; total: number } | null;
    gagal: LsipdBatchItem[];
  } | null>(null);
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [rowNotice, setRowNotice] = useState<{ nim: string; ok: boolean; text: string } | null>(null);

  // ── Hapus per mahasiswa ─────────────────────────────────────────────────────
  const [hapusTarget, setHapusTarget] = useState<LsipdMahasiswaRow | null>(null);
  const [hapusBusy, setHapusBusy] = useState(false);
  const [hapusError, setHapusError] = useState<string | null>(null);
  const [hapusHasil, setHapusHasil] = useState<string | null>(null);

  // ── Mahasiswa yang belum tersinkron (ada di LSIPD, belum ada di SIMKIP) ────
  const [belumBuka, setBelumBuka] = useState(false);
  const [belum, setBelum] = useState<LsipdBelumRow[]>([]);
  const [belumLoading, setBelumLoading] = useState(false);
  const [belumError, setBelumError] = useState<string | null>(null);
  const [belumTotal, setBelumTotal] = useState(0);
  const [belumRingkasServer, setBelumRingkasServer] = useState<{ lsipd: number; lokal: number } | null>(null);
  const [belumAngkatans, setBelumAngkatans] = useState<number[]>([]);
  const [belumProdis, setBelumProdis] = useState<string[]>([]);
  const [belumSudahDimuat, setBelumSudahDimuat] = useState(false);
  const [belumCari, setBelumCari] = useState("");
  const [belumAngkatan, setBelumAngkatan] = useState("Semua");
  const [belumProdi, setBelumProdi] = useState("Semua");
  const [belumSort, setBelumSort] = useState<"asc" | "desc">("asc");
  const [belumHalaman, setBelumHalaman] = useState(1);
  const [belumPilih, setBelumPilih] = useState<Set<string>>(new Set());
  const [belumBusy, setBelumBusy] = useState<string | null>(null);
  const [belumRingkas, setBelumRingkas] = useState<{ berhasil: number; total: number; gagal: LsipdBatchItem[] } | null>(null);
  const [belumHasil, setBelumHasil] = useState<string | null>(null);

  const isSyncing = starting || (progress !== null && (progress.status === "pending" || progress.status === "running"));
  const semuaTerpilih = rows.length > 0 && rows.every((r) => selected.has(r.nim));
  const sebagianTerpilih = !semuaTerpilih && rows.some((r) => selected.has(r.nim));

  // Opsi prodi — /konfigurasi/all (satu-satunya sumber yang boleh diakses role lsipd;
  // /mahasiswa/filter-options khusus admin/prodi/warek).
  useEffect(() => {
    api.get<{ success: boolean; data: { prodis: ProdiOption[] } }>("/konfigurasi/all")
      .then((r) => setProdis(r.data.prodis?.filter((p) => p.is_aktif) ?? []))
      .catch(() => {});
  }, []);

  // Debounce pencarian
  useEffect(() => {
    const t = setTimeout(() => setSearchDebounce(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchRows = async () => {
    setRowsLoading(true);
    setRowsError(null);
    try {
      const res = await lsipdService.getMahasiswaList({
        search: searchDebounce || undefined,
        angkatan: angkatanFilter !== "Semua" ? angkatanFilter : undefined,
        prodi: prodiFilter !== "Semua" ? prodiFilter : undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      });
      setRows(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages ?? 1);
      setAngkatans(res.filter_options?.angkatans ?? []);
    } catch (err) {
      setRows([]);
      setTotal(0);
      setRowsError(err instanceof Error ? err.message : "Gagal memuat daftar mahasiswa.");
    } finally {
      setRowsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchDebounce, angkatanFilter, prodiFilter, sort]);

  // Kembali ke halaman 1 saat filter berubah
  useEffect(() => {
    setPage(1);
  }, [searchDebounce, angkatanFilter, prodiFilter, sort]);

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

  /**
   * Jalankan sinkronisasi massal SELURUH mahasiswa dari Sistem Akademik.
   *
   * Berbeda dari jalankanSyncTerpilih() yang memakai endpoint batch per NIM,
   * alur "semua mahasiswa" memakai endpoint /sync-mahasiswa yang berjalan di
   * background lewat progress tersimpan — karena itu dipakai progress bar.
   */
  const jalankanSyncSemua = async () => {
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

  /** Tombol "Sinkronkan Semua Mahasiswa" — konfirmasi dulu lewat modal. */
  const mintaKonfirmasiSyncSemua = () => setSyncConfirm({ mode: "all", nims: [] });

  // ── Seleksi baris ───────────────────────────────────────────────────────────
  const toggleRow = (nim: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(nim)) next.delete(nim);
      else next.add(nim);
      return next;
    });
  };

  // "Pilih semua" berlaku untuk baris di halaman ini saja — halaman lain punya
  // himpunan baris yang berbeda dan tidak terlihat pengguna.
  const toggleSemua = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      rows.forEach((r) => (checked ? next.add(r.nim) : next.delete(r.nim)));
      return next;
    });
  };

  const pilihSemuaHasilFilter = async () => {
    setRowsLoading(true);
    try {
      const res = await lsipdService.getMahasiswaList({
        search: searchDebounce || undefined,
        angkatan: angkatanFilter !== "Semua" ? angkatanFilter : undefined,
        prodi: prodiFilter !== "Semua" ? prodiFilter : undefined,
        sort,
        page: 1,
        limit: 500,
      });
      setSelected((prev) => {
        const next = new Set(prev);
        res.data.forEach((r) => next.add(r.nim));
        return next;
      });
    } catch {
      // diamkan — pengguna masih bisa memilih manual
    } finally {
      setRowsLoading(false);
    }
  };

  // ── Belum tersinkron: muat, filter, dan sinkronkan ──────────────────────────
  /**
   * Ambil daftar mahasiswa yang ada di LSIPD tapi belum ada di SIMKIP.
   * Memicu satu tarikan daftar penuh dari LSIPD, jadi hanya dipanggil saat
   * pengguna membuka kartunya atau menekan tombol Perbarui.
   */
  const muatBelumTersinkron = async () => {
    setBelumLoading(true);
    setBelumError(null);
    try {
      const res = await lsipdService.getBelumTersinkron();
      setBelum(res.data);
      setBelumTotal(res.total);
      setBelumRingkasServer({ lsipd: res.total_lsipd, lokal: res.total_lokal });
      setBelumAngkatans(res.filter_options?.angkatans ?? []);
      setBelumProdis(res.filter_options?.prodis ?? []);
      setBelumSudahDimuat(true);
      // Buang pilihan yang sudah tidak ada di daftar terbaru.
      const ada = new Set(res.data.map((r) => r.nim));
      setBelumPilih((prev) => new Set([...prev].filter((n) => ada.has(n))));
      setBelumHalaman(1);
    } catch (err) {
      setBelumError(err instanceof Error ? err.message : "Gagal memuat daftar mahasiswa yang belum tersinkron.");
    } finally {
      setBelumLoading(false);
    }
  };

  const bukaBelumTersinkron = () => {
    const next = !belumBuka;
    setBelumBuka(next);
    if (next && !belumSudahDimuat && !belumLoading) muatBelumTersinkron();
  };

  // Filter & urut dilakukan di sisi klien karena seluruh daftar sudah ada di memori.
  const belumTersaring = (() => {
    const q = belumCari.trim().toLowerCase();
    let hasil = belum.filter((r) => {
      if (q && !r.nim.toLowerCase().includes(q) && !r.nama.toLowerCase().includes(q)) return false;
      if (belumAngkatan !== "Semua" && String(r.angkatan) !== belumAngkatan) return false;
      if (belumProdi !== "Semua" && r.prodi !== belumProdi) return false;
      return true;
    });
    hasil = [...hasil].sort((a, b) =>
      belumSort === "asc" ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama),
    );
    return hasil;
  })();

  const belumTotalHalaman = Math.max(1, Math.ceil(belumTersaring.length / PAGE_SIZE));
  const belumHalamanAman = Math.min(belumHalaman, belumTotalHalaman);
  const belumTampil = belumTersaring.slice((belumHalamanAman - 1) * PAGE_SIZE, belumHalamanAman * PAGE_SIZE);
  const belumSemuaTerpilih = belumTampil.length > 0 && belumTampil.every((r) => belumPilih.has(r.nim));
  const belumSebagianTerpilih = !belumSemuaTerpilih && belumTampil.some((r) => belumPilih.has(r.nim));

  useEffect(() => { setBelumHalaman(1); }, [belumCari, belumAngkatan, belumProdi, belumSort]);

  const sinkronkanBelum = async (nims: string[]) => {
    if (nims.length === 0) return;
    setBelumBusy(nims.length === 1 ? nims[0] : "__massal__");
    setBelumError(null);
    setBelumRingkas(null);
    setBelumHasil(null);

    const gagal: LsipdBatchItem[] = [];
    const gagalBiodata = new Set<string>();
    let berhasil = 0;
    let transkripBerhasil = 0;
    let transkripGagal = 0;
    try {
      // 1) Biodata — wajib lebih dulu; tanpa baris mahasiswa, transkrip tak bisa ditulis.
      for (let i = 0; i < nims.length; i += 200) {
        const bagian = nims.slice(i, i + 200);
        const res = await lsipdService.syncMahasiswaBatch(bagian);
        berhasil += res.berhasil;
        const g = res.hasil.filter((h) => !h.success);
        g.forEach((h) => gagalBiodata.add(h.nim));
        gagal.push(...g);
      }

      // 2) Transkrip — ikut ditarik, sama seperti tombol Sinkronkan di tabel
      //    utama. Penting untuk mahasiswa yang datanya pernah dihapus: transkrip
      //    lamanya masih ada di LSIPD dan harus ikut dipulihkan, bukan biodata saja.
      //    Batas server 50 NIM per request (tiap NIM menarik seluruh semester).
      const berhasilBiodata = nims.filter((n) => !gagalBiodata.has(n));
      for (let i = 0; i < berhasilBiodata.length; i += 50) {
        const bagian = berhasilBiodata.slice(i, i + 50);
        const res = await lsipdService.syncTranskripBatch(bagian);
        transkripBerhasil += res.berhasil;
        const g = res.hasil.filter((h) => !h.success);
        transkripGagal += g.length;
        gagal.push(...g);
      }

      // `berhasil` = mahasiswa yang biodatanya masuk; transkrip dilaporkan terpisah
      // supaya kegagalan transkrip tidak menyembunyikan keberhasilan biodata.
      setBelumRingkas({ berhasil, total: nims.length, gagal });
      setBelumHasil(
        `${berhasil} dari ${nims.length} mahasiswa ditambahkan ke SIMKIP` +
        (berhasilBiodata.length > 0
          ? `, transkrip ${transkripBerhasil}/${berhasilBiodata.length} berhasil ditarik` +
            (transkripGagal > 0 ? `, ${transkripGagal} gagal` : "")
          : "") +
        ".",
      );
      setBelumPilih(new Set());

      // Buang yang BIODATANYA berhasil dari daftar supaya tidak perlu tarik ulang
      // dari LSIPD. Kegagalan transkrip tidak mengembalikannya ke daftar ini —
      // mahasiswanya sudah ada, jadi bukan lagi "belum tersinkron".
      const suksesBiodata = nims.filter((n) => !gagalBiodata.has(n));
      setBelum((prev) => {
        const sisa = prev.filter((r) => !suksesBiodata.includes(r.nim));
        setBelumTotal(sisa.length);
        return sisa;
      });

      await fetchRows();
    } catch (err) {
      setBelumError(err instanceof Error ? err.message : "Gagal menyinkronkan mahasiswa.");
    } finally {
      setBelumBusy(null);
    }
  };

  // ── Sinkronkan mahasiswa terpilih dari tabel utama (biodata + transkrip) ────
  /** Tombol "Sinkronkan (n)" — konfirmasi dulu lewat modal. */
  const mintaKonfirmasiSyncTerpilih = () => {
    const nims = [...selected];
    if (nims.length === 0) return;
    setSyncConfirm({ mode: "selected", nims });
  };

  const jalankanSyncTerpilih = async (nims: string[]) => {
    setSyncing(true);
    setSyncError(null);
    setSyncSummary(null);
    setRowNotice(null);

    const gagal: LsipdBatchItem[] = [];

    try {
      // 1) Biodata — batas server 200 NIM per request.
      let biodataBerhasil = 0;
      for (let i = 0; i < nims.length; i += 200) {
        const bagian = nims.slice(i, i + 200);
        const res = await lsipdService.syncMahasiswaBatch(bagian);
        biodataBerhasil += res.berhasil;
        gagal.push(...res.hasil.filter((h) => !h.success));
      }

      // 2) Transkrip — batas server 50 NIM per request (tiap NIM menarik
      //    seluruh semester, jadi lebih berat).
      let transkripBerhasil = 0;
      for (let i = 0; i < nims.length; i += 50) {
        const bagian = nims.slice(i, i + 50);
        const res = await lsipdService.syncTranskripBatch(bagian);
        transkripBerhasil += res.berhasil;
        gagal.push(...res.hasil.filter((h) => !h.success));
      }

      setSyncSummary({
        biodata: { berhasil: biodataBerhasil, total: nims.length },
        transkrip: { berhasil: transkripBerhasil, total: nims.length },
        gagal,
      });
      setSelected(new Set());
      await fetchRows();
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Gagal sinkronisasi.");
    } finally {
      setSyncing(false);
    }
  };

  /** Dijalankan dari tombol "Ya, Sinkronkan" di modal. */
  const jalankanKonfirmasiSync = async () => {
    if (!syncConfirm) return;
    if (syncConfirm.mode === "all") {
      setSyncConfirm(null);
      await jalankanSyncSemua();
    } else {
      const { nims } = syncConfirm;
      setSyncConfirm(null);
      await jalankanSyncTerpilih(nims);
    }
  };

  // ── Sinkronkan satu baris ───────────────────────────────────────────────────
  const handleSyncRow = async (nim: string) => {
    setRowBusy(nim);
    setRowNotice(null);
    setSyncSummary(null);
    try {
      const res = await lsipdService.syncMahasiswaBatch([nim]);
      const bio = res.hasil[0];
      if (!bio?.success) throw new Error(bio?.message || "Gagal sinkronisasi biodata.");

      const tr = await lsipdService.syncTranskripBatch([nim]);
      const trans = tr.hasil[0];
      setRowNotice({
        nim,
        ok: !!trans?.success,
        text: trans?.success
          ? `Biodata + transkrip tersinkron (${trans.semester} semester, ${trans.mk} mata kuliah).`
          : `Biodata tersinkron, transkrip gagal: ${trans?.message ?? "tidak diketahui"}`,
      });
      await fetchRows();
    } catch (err) {
      setRowNotice({ nim, ok: false, text: err instanceof Error ? err.message : "Gagal sinkronisasi." });
    } finally {
      setRowBusy(null);
    }
  };

  // ── Hapus satu mahasiswa ────────────────────────────────────────────────────
  const handleHapusMahasiswa = async () => {
    if (!hapusTarget) return;
    setHapusBusy(true);
    setHapusError(null);
    try {
      const hasil = await lsipdService.deleteMahasiswa(hapusTarget.nim);
      setHapusHasil(
        `${hasil.nama} (NIM ${hasil.nim}) telah dihapus beserta ${hasil.rincian.semester} data semester dan ${hasil.rincian.dokumen} dokumen.`,
      );
      // Buang dari pilihan supaya NIM yang sudah hilang tidak ikut tersinkron.
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(hapusTarget.nim);
        return next;
      });
      setHapusTarget(null);
      await fetchRows();
    } catch (err) {
      setHapusError(err instanceof Error ? err.message : "Gagal menghapus data mahasiswa.");
    } finally {
      setHapusBusy(false);
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
          onClick={mintaKonfirmasiSyncSemua}
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

      {/* Sinkronisasi per Mahasiswa */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-5 pb-4 border-b border-[#E2E8F0]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <Database size={15} className="text-[#263F93]" />
                Sinkronisasi per Mahasiswa
              </h2>
              <p className="text-xs text-gray-400">
                Pilih mahasiswa yang ingin disinkronkan, lalu klik Sinkronkan. Biodata dan
                transkrip ditarik sekaligus.
              </p>
            </div>
            {total > 0 && (
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {total} mahasiswa
              </span>
            )}
          </div>

          {/* Filter */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari NIM atau nama..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93]"
              />
            </div>

            <select
              value={angkatanFilter}
              onChange={(e) => setAngkatanFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93]"
            >
              <option value="Semua">Semua Angkatan</option>
              {angkatans.map((a) => (
                <option key={a} value={String(a)}>Angkatan {a}</option>
              ))}
            </select>

            <select
              value={prodiFilter}
              onChange={(e) => setProdiFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] truncate"
            >
              <option value="Semua">Semua Prodi</option>
              {prodis.map((p) => (
                <option key={p.id} value={p.nama}>{p.nama}</option>
              ))}
            </select>

            <button
              onClick={() => setSort((s) => (s === "asc" ? "desc" : "asc"))}
              className="flex items-center justify-between gap-2 px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors"
              title="Ubah urutan nama"
            >
              <span className="flex items-center gap-1.5 truncate">
                <ArrowUpDown size={14} className="text-gray-400 flex-shrink-0" />
                Nama {sort === "asc" ? "A–Z" : "Z–A"}
              </span>
            </button>
          </div>

          {/* Aksi seleksi */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={mintaKonfirmasiSyncTerpilih}
              disabled={selected.size === 0 || syncing}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#263F93] hover:bg-[#1B2F73] disabled:bg-[#263F93]/40 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
              {syncing ? "Menyinkronkan..." : `Sinkronkan${selected.size > 0 ? ` (${selected.size})` : ""}`}
            </button>

            {selected.size > 0 && (
              <>
                <button
                  onClick={() => setSelected(new Set())}
                  disabled={syncing}
                  className="px-3 py-2 text-sm font-medium border border-[#E2E8F0] text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Kosongkan pilihan
                </button>
                <button
                  onClick={pilihSemuaHasilFilter}
                  disabled={syncing}
                  className="px-3 py-2 text-sm font-medium border border-[#E2E8F0] text-[#263F93] rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  Pilih semua hasil filter ({total})
                </button>
              </>
            )}
          </div>
        </div>

        {syncError && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 break-words">Gagal sinkronisasi: {syncError}</p>
          </div>
        )}

        {syncSummary && (
          <div className="mx-5 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-1">
            <p className="font-medium text-green-800 text-sm flex items-center gap-1.5">
              <CheckCircle size={15} className="text-green-500" />
              Sinkronisasi {syncSummary.biodata.total} mahasiswa selesai
            </p>
            <p className="text-sm text-green-700">
              Biodata: <strong>{syncSummary.biodata.berhasil}</strong>/{syncSummary.biodata.total} berhasil
              {syncSummary.transkrip && (
                <> · Transkrip: <strong>{syncSummary.transkrip.berhasil}</strong>/{syncSummary.transkrip.total} berhasil</>
              )}
            </p>
            {syncSummary.gagal.length > 0 && (
              <div className="pt-1">
                <p className="text-xs font-medium text-amber-700">
                  {syncSummary.gagal.length} gagal:
                </p>
                <ul className="text-xs text-amber-700 list-disc list-inside max-h-32 overflow-y-auto">
                  {syncSummary.gagal.slice(0, 20).map((g, i) => (
                    <li key={`${g.nim}-${i}`} className="break-words">
                      <span className="font-mono">{g.nim}</span> — {g.message}
                    </li>
                  ))}
                  {syncSummary.gagal.length > 20 && (
                    <li className="italic">...dan {syncSummary.gagal.length - 20} lainnya</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {hapusHasil && (
          <div className="mx-5 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-700 break-words">{hapusHasil}</p>
          </div>
        )}

        {rowNotice && (
          <div className={`mx-5 mt-4 p-3 rounded-lg border flex items-start gap-2 ${
            rowNotice.ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}>
            {rowNotice.ok
              ? <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
              : <XCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />}
            <p className={`text-xs break-words ${rowNotice.ok ? "text-green-700" : "text-red-700"}`}>
              <span className="font-mono">{rowNotice.nim}</span> — {rowNotice.text}
            </p>
          </div>
        )}

        {/* Tabel */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-y border-[#E2E8F0]">
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    label="Pilih semua mahasiswa di halaman ini"
                    checked={semuaTerpilih}
                    indeterminate={sebagianTerpilih}
                    disabled={rows.length === 0 || syncing}
                    onChange={toggleSemua}
                  />
                </th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">NIM</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">Nama</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">Program Studi</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">Angkatan</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">Status</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rowsLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    <Loader2 size={18} className="animate-spin inline mr-2" />
                    Memuat data mahasiswa...
                  </td>
                </tr>
              ) : rowsError ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <p className="text-sm text-red-600 break-words">{rowsError}</p>
                    <button
                      onClick={fetchRows}
                      className="mt-2 text-xs text-[#263F93] font-medium hover:underline"
                    >
                      Coba lagi
                    </button>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    Tidak ada mahasiswa yang cocok dengan filter ini.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.nim}
                    className={`transition-colors ${selected.has(r.nim) ? "bg-blue-50/50" : "hover:bg-gray-50/60"}`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        label={`Pilih ${r.nama}`}
                        checked={selected.has(r.nim)}
                        disabled={syncing}
                        onChange={() => toggleRow(r.nim)}
                      />
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{r.nim}</td>
                    <td className="px-3 py-3 text-gray-800 break-words min-w-[160px]">{r.nama}</td>
                    <td className="px-3 py-3 text-gray-600 text-xs">{r.prodi || "—"}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{r.angkatan}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex text-xs font-medium rounded-full px-2.5 py-0.5 whitespace-nowrap ${
                        r.status === "Aktif"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}>
                        {r.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSyncRow(r.nim)}
                          disabled={rowBusy !== null || syncing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#263F93] border border-[#263F93]/30 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {rowBusy === r.nim
                            ? <><Loader2 size={13} className="animate-spin" />Menyinkronkan...</>
                            : <><RefreshCw size={13} />Sinkronkan</>}
                        </button>
                        <button
                          onClick={() => { setHapusError(null); setHapusTarget(r); }}
                          disabled={rowBusy !== null || syncing || hapusBusy}
                          title={`Hapus ${r.nama}`}
                          aria-label={`Hapus ${r.nama}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          <Trash2 size={13} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-5 py-3 border-t border-[#E2E8F0] flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-2">
            <p className="text-xs text-gray-400 text-center min-[420px]:text-left">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || rowsLoading}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[#E2E8F0] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={13} /> Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || rowsLoading}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[#E2E8F0] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Berikutnya <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Belum tersinkron */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <button
          onClick={bukaBelumTersinkron}
          className="w-full p-5 flex items-start justify-between gap-3 text-left hover:bg-gray-50/60 transition-colors"
        >
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <UserPlus size={15} style={{ color: "#D4A72C" }} />
              Mahasiswa Belum Tersinkron
              {belumSudahDimuat && belumTotal > 0 && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                  {belumTotal}
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-400">
              Mahasiswa yang terdaftar di Sistem Akademik tapi belum ada di SIMKIP — misalnya
              setelah datanya dihapus. Sinkronkan di sini tanpa perlu sync semua; biodata dan
              transkripnya ditarik sekaligus.
            </p>
          </div>
          <span className="flex-shrink-0 text-gray-400 mt-0.5">
            {belumBuka ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {belumBuka && (
          <div className="border-t border-[#E2E8F0]">
            {/* Aksi muat ulang */}
            <div className="p-5 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-gray-500 min-w-0">
                {belumLoading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin text-[#263F93]" />
                    Mengambil daftar mahasiswa dari LSIPD...
                  </span>
                ) : belumRingkasServer ? (
                  <>LSIPD: <strong>{belumRingkasServer.lsipd}</strong> mahasiswa ·
                    SIMKIP: <strong>{belumRingkasServer.lokal}</strong> mahasiswa</>
                ) : (
                  "Klik Perbarui untuk memeriksa daftar terbaru dari LSIPD."
                )}
              </div>
              <button
                onClick={muatBelumTersinkron}
                disabled={belumLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-[#E2E8F0] text-[#263F93] rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <RefreshCw size={14} className={belumLoading ? "animate-spin" : ""} />
                {belumLoading ? "Memeriksa..." : "Perbarui Daftar"}
              </button>
            </div>

            {belumError && (
              <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 break-words">{belumError}</p>
              </div>
            )}

            {belumHasil && (
              <div className="mx-5 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-700 break-words">{belumHasil}</p>
              </div>
            )}

            {belumRingkas && (
              <div className="mx-5 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-1">
                <p className="font-medium text-green-800 text-sm flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-green-500" />
                  Sinkronisasi selesai
                </p>
                <p className="text-sm text-green-700">
                  <strong>{belumRingkas.berhasil}</strong>/{belumRingkas.total} mahasiswa berhasil ditambahkan.
                </p>
                {belumRingkas.gagal.length > 0 && (
                  <ul className="text-xs text-amber-700 list-disc list-inside max-h-24 overflow-y-auto pt-1">
                    {belumRingkas.gagal.map((g, i) => (
                      <li key={`${g.nim}-${i}`} className="break-words">
                        <span className="font-mono">{g.nim}</span> — {g.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {belumSudahDimuat && belumTotal === 0 ? (
              <div className="px-5 pb-5 text-center">
                <CheckCircle size={28} className="mx-auto text-green-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Semua mahasiswa LSIPD sudah tersinkron.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Tidak ada mahasiswa di Sistem Akademik yang belum ada di SIMKIP.
                </p>
              </div>
            ) : belumSudahDimuat && (
              <>
                {/* Filter */}
                <div className="px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      value={belumCari}
                      onChange={(e) => setBelumCari(e.target.value)}
                      placeholder="Cari NIM atau nama..."
                      className="w-full pl-8 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93]"
                    />
                  </div>
                  <select
                    value={belumAngkatan}
                    onChange={(e) => setBelumAngkatan(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93]"
                  >
                    <option value="Semua">Semua Angkatan</option>
                    {belumAngkatans.map((a) => <option key={a} value={String(a)}>Angkatan {a}</option>)}
                  </select>
                  <select
                    value={belumProdi}
                    onChange={(e) => setBelumProdi(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] truncate"
                  >
                    <option value="Semua">Semua Prodi</option>
                    {belumProdis.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button
                    onClick={() => setBelumSort((s) => (s === "asc" ? "desc" : "asc"))}
                    title="Ubah urutan nama"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowUpDown size={14} className="text-gray-400 flex-shrink-0" />
                    Nama {belumSort === "asc" ? "A–Z" : "Z–A"}
                  </button>
                </div>

                {/* Aksi seleksi */}
                <div className="px-5 mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => sinkronkanBelum([...belumPilih])}
                    disabled={belumPilih.size === 0 || belumBusy !== null}
                    className="flex items-center gap-2 px-3.5 py-2 bg-[#263F93] hover:bg-[#1B2F73] disabled:bg-[#263F93]/40 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {belumBusy === "__massal__"
                      ? <Loader2 size={15} className="animate-spin" />
                      : <RefreshCw size={15} />}
                    {belumBusy === "__massal__"
                      ? "Menyinkronkan..."
                      : `Sinkronkan${belumPilih.size > 0 ? ` (${belumPilih.size})` : ""}`}
                  </button>
                  {belumPilih.size > 0 && (
                    <button
                      onClick={() => setBelumPilih(new Set())}
                      disabled={belumBusy !== null}
                      className="px-3 py-2 text-sm font-medium border border-[#E2E8F0] text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Kosongkan pilihan
                    </button>
                  )}
                  {belumTersaring.length > 0 && (
                    <button
                      onClick={() =>
                        setBelumPilih((prev) => {
                          const next = new Set(prev);
                          belumTersaring.forEach((r) => next.add(r.nim));
                          return next;
                        })
                      }
                      disabled={belumBusy !== null}
                      className="px-3 py-2 text-sm font-medium border border-[#E2E8F0] text-[#263F93] rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                      Pilih semua hasil filter ({belumTersaring.length})
                    </button>
                  )}
                </div>

                {/* Tabel */}
                <div className="overflow-x-auto mt-4">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-y border-[#E2E8F0]">
                        <th className="w-10 px-4 py-3">
                          <Checkbox
                            label="Pilih semua mahasiswa di halaman ini"
                            checked={belumSemuaTerpilih}
                            indeterminate={belumSebagianTerpilih}
                            disabled={belumTampil.length === 0 || belumBusy !== null}
                            onChange={(v) =>
                              setBelumPilih((prev) => {
                                const next = new Set(prev);
                                belumTampil.forEach((r) => (v ? next.add(r.nim) : next.delete(r.nim)));
                                return next;
                              })
                            }
                          />
                        </th>
                        <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">NIM</th>
                        <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">Nama</th>
                        <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">Program Studi</th>
                        <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">Angkatan</th>
                        <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {belumTampil.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                            Tidak ada mahasiswa yang cocok dengan filter ini.
                          </td>
                        </tr>
                      ) : (
                        belumTampil.map((r) => (
                          <tr
                            key={r.nim}
                            className={`transition-colors ${belumPilih.has(r.nim) ? "bg-blue-50/50" : "hover:bg-gray-50/60"}`}
                          >
                            <td className="px-4 py-3">
                              <Checkbox
                                label={`Pilih ${r.nama}`}
                                checked={belumPilih.has(r.nim)}
                                disabled={belumBusy !== null}
                                onChange={() =>
                                  setBelumPilih((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(r.nim)) next.delete(r.nim);
                                    else next.add(r.nim);
                                    return next;
                                  })
                                }
                              />
                            </td>
                            <td className="px-3 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{r.nim}</td>
                            <td className="px-3 py-3 text-gray-800 break-words min-w-[160px]">{r.nama}</td>
                            <td className="px-3 py-3 text-gray-600 text-xs">{r.prodi || "—"}</td>
                            <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{r.angkatan || "—"}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => sinkronkanBelum([r.nim])}
                                disabled={belumBusy !== null}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#263F93] border border-[#263F93]/30 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                              >
                                {belumBusy === r.nim
                                  ? <><Loader2 size={13} className="animate-spin" />Menyinkronkan...</>
                                  : <><RefreshCw size={13} />Sinkronkan</>}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {belumTotalHalaman > 1 && (
                  <div className="px-4 sm:px-5 py-3 border-t border-[#E2E8F0] flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-2">
                    <p className="text-xs text-gray-400 text-center min-[420px]:text-left">
                      Halaman {belumHalamanAman} dari {belumTotalHalaman} · {belumTersaring.length} mahasiswa
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setBelumHalaman((p) => Math.max(1, p - 1))}
                        disabled={belumHalamanAman <= 1}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[#E2E8F0] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={13} /> Sebelumnya
                      </button>
                      <button
                        onClick={() => setBelumHalaman((p) => Math.min(belumTotalHalaman, p + 1))}
                        disabled={belumHalamanAman >= belumTotalHalaman}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[#E2E8F0] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Berikutnya <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
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

      {/* Modal konfirmasi sinkronisasi — menggantikan window.confirm() bawaan browser */}
      <Modal
        open={syncConfirm !== null}
        onClose={() => { if (!starting) setSyncConfirm(null); }}
        title="Konfirmasi Sinkronisasi"
        width="max-w-md"
      >
        {syncConfirm && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <RefreshCw size={16} className="text-[#263F93] flex-shrink-0 mt-0.5" />
              <div className="min-w-0 space-y-1.5">
                <p className="text-xs sm:text-sm text-[#263F93] font-medium break-words">
                  {syncConfirm.mode === "all"
                    ? "Sinkronkan biodata dan transkrip SELURUH mahasiswa dari Sistem Akademik?"
                    : `Sinkronkan biodata dan transkrip ${syncConfirm.nims.length} mahasiswa terpilih dari Sistem Akademik?`}
                </p>
                <p className="text-xs text-[#263F93]/80 break-words">
                  Data lokal akan ditimpa dengan data terbaru dari LSIPD. Data yang sudah
                  divalidasi pengelola atau sedang menunggu validasi tidak akan diubah statusnya.
                </p>
              </div>
            </div>

            {syncConfirm.mode === "all" ? (
              <p className="text-xs text-gray-500">
                Proses berjalan di background dan ditampilkan lewat progress bar.
              </p>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1.5">
                  Mahasiswa yang akan disinkronkan:
                </p>
                <div className="max-h-32 overflow-y-auto border border-[#E2E8F0] rounded-lg p-2 bg-gray-50">
                  {syncConfirm.nims.slice(0, 50).map((nim) => {
                    const m = rows.find((r) => r.nim === nim);
                    return (
                      <div key={nim} className="text-xs text-gray-600 break-words">
                        <span className="font-mono">{nim}</span>
                        {m ? ` — ${m.nama}` : ""}
                      </div>
                    );
                  })}
                  {syncConfirm.nims.length > 50 && (
                    <p className="text-xs text-gray-400 italic mt-1">
                      ...dan {syncConfirm.nims.length - 50} NIM lainnya
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3 min-[420px]:justify-end">
              <button
                onClick={() => { if (!starting) setSyncConfirm(null); }}
                disabled={starting}
                className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={jalankanKonfirmasiSync}
                disabled={
                  starting ||
                  syncing ||
                  (syncConfirm.mode === "all" && isSyncing) ||
                  (syncConfirm.mode === "selected" && syncConfirm.nims.length === 0)
                }
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#263F93" }}
              >
                {starting || syncing
                  ? <Loader2 size={15} className="animate-spin" />
                  : <RefreshCw size={15} />}
                {starting || syncing ? "Memproses..." : "Ya, Sinkronkan"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal konfirmasi hapus satu mahasiswa */}
      <Modal
        open={hapusTarget !== null}
        onClose={() => { if (!hapusBusy) { setHapusTarget(null); setHapusError(null); } }}
        title="Hapus Data Mahasiswa"
        width="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-red-700 break-words">
                Anda akan menghapus <strong>{hapusTarget?.nama}</strong>{" "}
                (NIM <span className="font-mono">{hapusTarget?.nim}</span>) secara permanen.
              </p>
              <p className="text-xs text-red-600 mt-1.5 break-words">
                Termasuk seluruh data terkait: nilai/IPK per semester beserta mata kuliahnya,
                dokumen, surat peringatan, bebas tanggungan, catatan internal, organisasi,
                pelatihan, prestasi, dan akun login mahasiswa tersebut. Tindakan ini tidak
                dapat dibatalkan.
              </p>
            </div>
          </div>

          {hapusError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 min-w-0">
              <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 break-words min-w-0">{hapusError}</p>
            </div>
          )}

          <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3 min-[420px]:justify-end">
            <button
              onClick={() => { if (!hapusBusy) { setHapusTarget(null); setHapusError(null); } }}
              disabled={hapusBusy}
              className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleHapusMahasiswa}
              disabled={hapusBusy}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#DC2626" }}
            >
              {hapusBusy ? <RefreshCw size={15} className="animate-spin" /> : <Trash2 size={15} />}
              {hapusBusy ? "Menghapus..." : "Hapus Permanen"}
            </button>
          </div>
        </div>
      </Modal>

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
