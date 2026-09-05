import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight, Check, Download, Info, Loader2, AlertTriangle, RefreshCw, Database, Users, Activity, FileText, Award } from "lucide-react";
import { createLaporan, submitLaporan, getPreviewStatistics, type LaporanPreviewStatistics } from "@/services/laporanService";
import { getMahasiswaFilterOptions } from "@/services/mahasiswaService";
import { getKonfigurasiAll, type SignatureConfig } from "@/services/konfigurasiService";
import logoItg from "@/imports/logo_itg.jpg";
import { getCurrentTahunAjaran, parseTahunAjaran } from "@/components/ui/TahunAjaranFilter";

const STEPS = [
  { label: "Informasi Laporan", num: 1 },
  { label: "Review Data", num: 2 },
  { label: "Preview & Kirim", num: 3 },
];

type Cakupan = "semua" | "angkatan" | "prodi" | "keduanya";

export default function SusunLaporan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const inherited = (() => {
    const t = searchParams.get('tahun');
    const s = searchParams.get('semester');
    if (t && (s === 'Ganjil' || s === 'Genap')) {
      return { tahunAkademik: t, semester: s as 'Ganjil' | 'Genap' };
    }
    const cur = parseTahunAjaran(getCurrentTahunAjaran());
    if (cur) return cur;
    return { tahunAkademik: '2025/2026', semester: 'Genap' as const };
  })();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    judul: `Laporan Evaluasi Semester ${inherited.semester} Tahun Akademik ${inherited.tahunAkademik}`,
    nomorSK: "",
    tahunAkademik: inherited.tahunAkademik,
    semester: inherited.semester,
    tanggalLaporan: "2026-08-19",
    catatan: "",
    cakupan: "semua" as Cakupan,
    angkatan: "2022",
    prodi: "Teknik Informatika",
  });
  const [tujuanWarek, setTujuanWarek] = useState(true);
  const [tujuanProdi, setTujuanProdi] = useState(false);
  const [prodiTujuan, setProdiTujuan] = useState("");

  // Filter options from BE
  const [prodiList, setProdiList] = useState<string[]>([]);
  const [angkatanList, setAngkatanList] = useState<string[]>([]);
  const [tahunList, setTahunList] = useState<string[]>(["2025/2026", "2024/2025", "2023/2024"]);
  const [signature, setSignature] = useState<SignatureConfig | null>(null);

  useEffect(() => {
    let active = true;
    getMahasiswaFilterOptions()
      .then((opts) => {
        if (!active) return;
        setProdiList(opts.prodis.map((p) => p.nama));
        setAngkatanList(opts.angkatans.map(String));
      })
      .catch(() => { /* fallback empty */ });
    getKonfigurasiAll()
      .then((res) => {
        if (!active) return;
        const unique = Array.from(new Set(res.data.periode_history.map((p: any) => p.tahun_akademik)));
        if (unique.length) setTahunList(unique);
        if (res?.data?.signature) setSignature(res.data.signature);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  // Load dashboard-level preview stats on mount
  useEffect(() => {
    getPreviewStatistics('semua').then(setDashboardStats).catch(() => {});
  }, []);


  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Real data from backend
  const [preview, setPreview] = useState<LaporanPreviewStatistics | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [dashboardStats, setDashboardStats] = useState<LaporanPreviewStatistics | null>(null);

  const [toastMsg, setToastMsg] = useState("");
  const [syncing, setSyncing] = useState(false);

  const handleTarikSIA = () => {
    setSyncing(true);
    setToastMsg("Sedang menarik data dari SIA...");
    setTimeout(() => {
      setSyncing(false);
      setToastMsg("Data Mahasiswa, Nilai, dan Prestasi berhasil disinkronkan dari SIA ITG.");
      setTimeout(() => setToastMsg(""), 3500);
    }, 1500);
  };

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const step1Valid =
    form.judul.trim() !== "" &&
    form.tanggalLaporan !== "";

  const judul = (() => {
    const base = `LAPORAN EVALUASI SEMESTER ${form.semester.toUpperCase()} TA ${form.tahunAkademik}`;
    if (form.cakupan === "angkatan") return `${base} — ANGKATAN ${form.angkatan}`;
    if (form.cakupan === "prodi") return `${base} — ${form.prodi.toUpperCase()}`;
    if (form.cakupan === "keduanya") return `${base} — ANGKATAN ${form.angkatan} ${form.prodi.toUpperCase()}`;
    return base;
  })();

  const tanggalFmt = new Date(form.tanggalLaporan).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  const fetchPreview = () => {
    setPreviewLoading(true);
    setPreviewError("");
    getPreviewStatistics(
      form.cakupan,
      form.cakupan === "semua" ? undefined : form.angkatan,
      form.cakupan === "semua" ? undefined : form.prodi,
    )
      .then(setPreview)
      .catch((err: any) => {
        const msg = err?.error?.message ?? err?.message ?? "Gagal memuat data preview";
        setPreviewError(`[${err?.status}] ${msg}`);
      })
      .finally(() => setPreviewLoading(false));
  };

  // Fetch preview when entering Step 2
  const goNext = () => {
    if (step === 0) {
      fetchPreview();
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setStep((s) => s - 1);
  };

  const handleSimpanDraf = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        judul: judul,
        tahunAkademik: form.tahunAkademik,
        semester: form.semester as "Ganjil" | "Genap",
        tanggalLaporan: form.tanggalLaporan,
        catatanLaporan: form.catatan || undefined,
        cakupan: form.cakupan,
        angkatan: form.cakupan === "semua" ? undefined : form.angkatan,
        prodi: form.cakupan === "semua" ? undefined : form.prodi,
        tujuanWarek: tujuanWarek,
        tujuanProdi: tujuanProdi,
      };
      const created = await createLaporan(payload);
      navigate(`/admin/laporan/${created.id}`);
    } catch (err: any) {
      setError(err?.message ?? "Gagal menyimpan laporan");
      setSaving(false);
    }
  };

  const handleKirimWarek = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        judul: judul,
        tahunAkademik: form.tahunAkademik,
        semester: form.semester as "Ganjil" | "Genap",
        tanggalLaporan: form.tanggalLaporan,
        catatanLaporan: form.catatan || undefined,
        cakupan: form.cakupan,
        angkatan: form.cakupan === "semua" ? undefined : form.angkatan,
        prodi: form.cakupan === "semua" ? undefined : form.prodi,
        tujuanWarek: tujuanWarek,
        tujuanProdi: tujuanProdi,
      };
      const created = await createLaporan(payload);
      await submitLaporan(created.id);
      navigate(`/admin/laporan/${created.id}`);
    } catch (err: any) {
      setError(err?.message ?? "Gagal mengirim laporan");
      setSubmitting(false);
    }
  };

  const cakupanLabel = (() => {
    if (form.cakupan === "semua") return "Seluruh Mahasiswa KIP-K";
    if (form.cakupan === "angkatan") return `Angkatan ${form.angkatan}`;
    if (form.cakupan === "prodi") return form.prodi;
    return `Angkatan ${form.angkatan} — ${form.prodi}`;
  })();

  return (
    <div className="max-w-3xl mx-auto w-full space-y-3 sm:space-y-4 min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
        <Link to="/admin/laporan" className="hover:text-gray-700 flex items-center gap-1 shrink-0">
          <ChevronLeft size={15} /> Laporan Semester
        </Link>
        <span className="shrink-0">/</span>
        <span className="text-gray-800 font-500 truncate">Susun Laporan Baru</span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2 min-w-0">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 break-words min-w-0">{error}</p>
        </div>
      )}

      {/* Step Indicator — sticky */}
      <div className="sticky top-0 z-20 bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-3 sm:px-6 py-3.5 sm:py-4 min-w-0">
        <div className="flex items-center min-w-0">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-700 transition-all flex-shrink-0 ${
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                      ? "text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  style={i === step ? { background: "#263F93" } : undefined}
                >
                  {i < step ? <Check size={14} /> : s.num}
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1 font-500 text-center leading-tight ${
                    i === step ? "text-[#263F93]" : i < step ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 -mt-5 mx-1 sm:mx-2 transition-all ${
                    i < step ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Central Reporting Hub Header Section */}
      <div className="bg-gradient-to-br from-[#263F93] to-blue-800 rounded-2xl shadow-lg p-4 sm:p-6 text-white relative overflow-hidden border border-blue-700/50 min-w-0">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database size={120} />
        </div>
        <div className="relative z-10 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold mb-1 flex items-center gap-2 leading-tight">
                <Database size={24} className="text-blue-300 flex-shrink-0" /> <span>Pusat Generasi Laporan Terintegrasi</span>
              </h1>
              <p className="text-blue-200 text-xs sm:text-sm">Integrasi data otomatis dengan Sistem Informasi Akademik (SIA) ITG.</p>
            </div>
            <button
              onClick={handleTarikSIA}
              disabled={syncing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:opacity-50 w-full sm:w-auto whitespace-nowrap shrink-0"
            >
              <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
              Tarik Data Mahasiswa (SIA)
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 min-w-0">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center min-w-0">
              <Users size={24} className="text-green-300 mb-2" />
              <div className="text-lg sm:text-xl font-bold break-words">{dashboardStats?.total_mahasiswa ?? preview?.total_mahasiswa ?? 0} <span className="text-base sm:text-lg text-blue-200 font-normal">/ {(dashboardStats?.total_sp ?? preview?.total_sp ?? 0)}</span></div>
              <div className="text-[10px] sm:text-xs text-blue-200 mt-1 uppercase tracking-wide font-semibold">Total Mhs / SP Aktif</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center min-w-0">
              <Activity size={24} className="text-yellow-300 mb-2" />
              <div className="text-lg sm:text-xl font-bold break-words">{dashboardStats?.rata_ipk ?? preview?.rata_ipk ?? "—"}</div>
              <div className="text-[10px] sm:text-xs text-blue-200 mt-1 uppercase tracking-wide font-semibold">Rata-rata IPK</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center min-w-0">
              <FileText size={24} className="text-red-300 mb-2" />
              <div className="text-lg sm:text-xl font-bold break-words">{dashboardStats?.total_sp ?? preview?.total_sp ?? 0}</div>
              <div className="text-[10px] sm:text-xs text-blue-200 mt-1 uppercase tracking-wide font-semibold">Mhs Bermasalah</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center min-w-0">
              <Award size={24} className="text-purple-300 mb-2" />
              <div className="text-lg sm:text-xl font-bold break-words">{dashboardStats?.total_prestasi ?? preview?.total_prestasi ?? 0}</div>
              <div className="text-[10px] sm:text-xs text-blue-200 mt-1 uppercase tracking-wide font-semibold">Mhs Berprestasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STEP 1: Informasi Laporan ── */}
      {step === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3 sm:p-4 space-y-3 sm:space-y-4 min-w-0">
          <h2 className="font-600 text-gray-800 text-xs sm:text-sm">Informasi Laporan</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Judul Laporan <span className="text-red-400">*</span>
              </label>
              <input
                value={form.judul}
                onChange={set("judul")}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Nomor SK / Dokumen Legal
              </label>
              <input
                value={form.nomorSK}
                onChange={set("nomorSK")}
                placeholder="Contoh: 123/SK/ITG/2026"
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">Tahun Akademik</label>
              <div className="px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm bg-gray-50 text-gray-700 flex items-center justify-between">
                <span className="font-600">{form.semester} {form.tahunAkademik}</span>
                <span className="text-xs text-gray-400">Diwarisi dari filter daftar laporan</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Tanggal Laporan <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.tanggalLaporan}
                onChange={set("tanggalLaporan")}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Catatan / Ringkasan{" "}
                <span className="text-gray-400">(opsional)</span>
              </label>
              <textarea
                value={form.catatan}
                onChange={set("catatan")}
                rows={3}
                placeholder="Ringkasan kondisi mahasiswa KIP-K semester ini..."
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Cakupan Laporan */}
          <div className="border border-[#E2E8F0] rounded-xl p-3.5 sm:p-4 space-y-3 min-w-0">
            <h3 className="font-600 text-gray-800 text-sm">Cakupan Laporan</h3>

            {(
              [
                { value: "semua", label: "Seluruh Mahasiswa KIP-K (semua prodi, semua angkatan)" },
                { value: "angkatan", label: "Per Angkatan saja" },
                { value: "prodi", label: "Per Program Studi saja" },
                { value: "keduanya", label: "Per Angkatan + Program Studi" },
              ] as { value: Cakupan; label: string }[]
            ).map((opt) => (
              <div key={opt.value} className="space-y-2 min-w-0">
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-gray-700 min-w-0">
                  <input
                    type="radio"
                    name="cakupan"
                    value={opt.value}
                    checked={form.cakupan === opt.value}
                    onChange={set("cakupan")}
                    className="accent-[#263F93] mt-0.5 flex-shrink-0"
                  />
                  <span className="break-words">{opt.label}</span>
                </label>

                {/* Conditional dropdowns */}
                {(opt.value === "angkatan" || opt.value === "keduanya") &&
                  form.cakupan === opt.value && (
                    <div className="ml-6 sm:ml-7 mr-1">
                      <select
                        value={form.angkatan}
                        onChange={set("angkatan")}
                        className="w-full sm:w-auto px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none bg-white max-w-full"
                      >
                        {angkatanList.map((a) => (
                          <option key={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                  )}

                {(opt.value === "prodi" || opt.value === "keduanya") &&
                  form.cakupan === opt.value && (
                    <div className="ml-6 sm:ml-7 mr-1">
                      <select
                        value={form.prodi}
                        onChange={set("prodi")}
                        className="w-full sm:w-auto px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none bg-white max-w-full"
                      >
                        {prodiList.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}
              </div>
            ))}

            <div className="mt-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-xs text-blue-700 min-w-0">
              <Info size={16} className="mt-0.5 text-[#263F93] flex-shrink-0" />
              <span className="break-words">
                Laporan akan dibuat berdasarkan cakupan yang dipilih. Anda bisa membuat beberapa
                laporan terpisah untuk cakupan berbeda.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Review Data ── */}
      {step === 1 && (
        <div className="space-y-4 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3 sm:p-4 min-w-0">
            <h2 className="font-600 text-gray-800 text-xs sm:text-sm mb-1">Review Data Mahasiswa</h2>
            <p className="text-xs text-gray-400 mb-4 break-words">Cakupan: {cakupanLabel}</p>

            {previewLoading ? (
              <div className="flex items-center justify-center py-16 px-4 text-gray-400 text-sm text-center">
                <Loader2 size={20} className="animate-spin mr-2 flex-shrink-0" /> Memuat data...
              </div>
            ) : previewError ? (
              <div className="text-center py-8 px-4 text-red-500 text-sm break-words">{previewError}</div>
            ) : preview ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 min-w-0">
                  <div className="rounded-xl p-2.5 sm:p-3 text-center border border-[#E2E8F0] min-w-0" style={{ background: "#F8FAFC" }}>
                    <div className="font-display font-700 text-lg sm:text-xl text-gray-900 break-words">{preview.total_mahasiswa}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Total Mahasiswa</div>
                  </div>
                  <div className="rounded-xl p-2.5 sm:p-3 text-center border border-[#E2E8F0] min-w-0" style={{ background: "#F8FAFC" }}>
                    <div className="font-display font-700 text-lg sm:text-xl text-gray-900 break-words">{preview.rata_ipk ?? "—"}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Rata-rata IPK</div>
                  </div>
                  <div className="rounded-xl p-2.5 sm:p-3 text-center border border-[#E2E8F0] min-w-0" style={{ background: "#F8FAFC" }}>
                    <div className="font-display font-700 text-lg sm:text-xl text-gray-900 break-words">
                      {preview.total_reguler + preview.total_aspirasi > 0
                        ? Math.round((preview.total_reguler / preview.total_mahasiswa) * 100)
                        : 0}%
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Reguler</div>
                  </div>
                </div>

                {/* IPK histogram */}
                <div className="mb-5 min-w-0">
                  <p className="text-xs font-600 text-gray-500 uppercase tracking-wide mb-2">
                    Distribusi IPK Mahasiswa
                  </p>
                  {preview.ipk_distribution?.some(b => b.count > 0) ? (
                    <div className="w-full h-[160px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={preview.ipk_distribution} margin={{ top: 5, right: 5, bottom: 0, left: -18 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94A3B8" }} minTickGap={4} />
                        <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} allowDecimals={false} width={30} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                        <Bar dataKey="count" fill="#263F93" radius={[4, 4, 0, 0]} name="Jumlah" />
                      </BarChart>
                    </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg px-4 text-center">
                      Tidak ada data IPK untuk cakupan ini
                    </div>
                  )}
                </div>

                {/* Preview table */}
                <div className="overflow-x-auto min-w-0">
                  <table className="w-full min-w-[640px] text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                        {["NIM", "Nama", "Prodi", "Angkatan", "IPK", "SP", "Status"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-3 py-2 font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {preview.mahasiswa.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500 bg-gray-50/50">
                            Tidak ada mahasiswa ditemukan untuk kriteria ini.
                          </td>
                        </tr>
                      ) : (
                        preview.mahasiswa.map((m) => (
                          <tr key={m.id} className="hover:bg-gray-50/50 border-b border-[#E2E8F0] last:border-0">
                            <td className="px-3 py-2.5 font-500 text-gray-800 font-mono whitespace-nowrap">{m.nim}</td>
                            <td className="px-3 py-2.5 break-words min-w-[120px]">{m.nama}</td>
                            <td className="px-3 py-2.5 break-words min-w-[100px]">{m.prodi}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap">{m.angkatan}</td>
                            <td className="px-3 py-2.5 font-600 whitespace-nowrap">{m.ipk ? m.ipk.toFixed(2) : "—"}</td>
                            <td className="px-3 py-2.5">
                              {m.sp ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-600 bg-red-100 text-red-700 whitespace-nowrap">
                                  {m.sp}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Menampilkan {Math.min(preview.mahasiswa.length, 20)} dari {preview.total_mahasiswa} mahasiswa
                  </p>
                </div>
              </>
            ) : null}
          </div>

          <button className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">
            <Download size={14} className="flex-shrink-0" /> Export Preview ke Excel
          </button>
        </div>
      )}

      {/* ── STEP 3: Preview Laporan ── */}
      {step === 2 && (
        <div className="space-y-4 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3 sm:p-4 min-w-0">
            <h2 className="font-600 text-gray-800 text-xs sm:text-sm mb-4">Preview Laporan</h2>

            {/* Formal letter */}
            <div className="border-2 border-[#263F93] rounded-xl p-1 min-w-0">
              <div className="border border-[#263F93] rounded-lg p-3 sm:p-8 space-y-3 sm:space-y-4 text-xs text-gray-700 bg-white min-w-0">

                {/* Kop surat */}
                <div className="flex items-center gap-2.5 sm:gap-4 border-b-2 border-[#263F93] pb-3 sm:pb-5 mb-4 sm:mb-6 min-w-0">
                  <img src={logoItg} alt="Logo ITG" className="h-11 w-11 sm:h-16 sm:w-16 object-contain flex-shrink-0" />
                  <div className="flex-1 text-center min-w-0">
                    <p className="text-[10px] sm:text-sm font-semibold leading-snug">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
                    <p className="font-bold text-xs sm:text-base uppercase tracking-wide leading-snug">INSTITUT TEKNOLOGI GARUT</p>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">Telp. (0262) 2800433 | www.itg.ac.id</p>
                  </div>
                </div>

                {/* Nomor, tanggal, perihal */}
                <div className="grid grid-cols-[96px_8px_1fr] sm:grid-cols-[120px_8px_1fr] gap-y-1.5 text-xs sm:text-sm mb-4 sm:mb-6 min-w-0">
                  <span className="text-gray-600">Nomor</span><span>:</span><span className="break-words min-w-0">[Akan diisi setelah disimpan]</span>
                  <span className="text-gray-600">Tanggal</span><span>:</span><span className="break-words min-w-0">{tanggalFmt}</span>
                  <span className="text-gray-600">Perihal</span><span>:</span><span className="font-semibold break-words min-w-0">Laporan Perkembangan Mahasiswa KIP-K</span>
                  <span className="text-gray-600">Kepada Yth.</span><span>:</span><span className="break-words min-w-0">Wakil Utama III ITG</span>
                </div>

                {/* Judul laporan */}
                <div className="text-center py-2 min-w-0">
                  <p className="font-bold text-xs sm:text-sm uppercase break-words">{judul}</p>
                </div>

                {/* Summary stats table */}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">I. Ringkasan Data</p>
                  <div className="overflow-x-auto">
                  <table className="w-full min-w-[440px] text-xs border border-[#E2E8F0]">
                    <thead>
                      <tr style={{ background: "#F8FAFC" }}>
                        <th className="border border-[#E2E8F0] px-3 py-2 text-left font-semibold">Keterangan</th>
                        <th className="border border-[#E2E8F0] px-3 py-2 text-center font-semibold">Jumlah</th>
                        <th className="border border-[#E2E8F0] px-3 py-2 text-center font-semibold">Reguler</th>
                        <th className="border border-[#E2E8F0] px-3 py-2 text-center font-semibold">Aspirasi</th>
                        <th className="border border-[#E2E8F0] px-3 py-2 text-center font-semibold">Rata IPK</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-[#E2E8F0] px-3 py-2 text-gray-600 break-words">{cakupanLabel}</td>
                        <td className="border border-[#E2E8F0] px-3 py-2 text-center font-bold">
                          {preview?.total_mahasiswa ?? "—"}
                        </td>
                        <td className="border border-[#E2E8F0] px-3 py-2 text-center">
                          {preview ? `${preview.total_reguler}` : "—"}
                        </td>
                        <td className="border border-[#E2E8F0] px-3 py-2 text-center">
                          {preview ? `${preview.total_aspirasi}` : "—"}
                        </td>
                        <td className="border border-[#E2E8F0] px-3 py-2 text-center font-bold">
                          {preview?.rata_ipk ?? "—"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>

                {/* Data Tambahan: Prestasi & SP */}
                {preview && (
                  <div className="mt-4 min-w-0">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-2">II. Data Prestasi & Permasalahan</p>
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[440px] text-xs border border-[#E2E8F0]">
                      <thead>
                        <tr style={{ background: "#F8FAFC" }}>
                          <th className="border border-[#E2E8F0] px-3 py-2 text-left font-semibold">Kategori</th>
                          <th className="border border-[#E2E8F0] px-3 py-2 text-center font-semibold">Total Mahasiswa</th>
                          <th className="border border-[#E2E8F0] px-3 py-2 text-left font-semibold">Rincian Mahasiswa</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-[#E2E8F0] px-3 py-2 font-semibold text-green-700 whitespace-nowrap">Mahasiswa Berprestasi</td>
                          <td className="border border-[#E2E8F0] px-3 py-2 text-center font-bold text-green-700">{preview.total_prestasi}</td>
                          <td className="border border-[#E2E8F0] px-3 py-2 text-gray-600 break-words min-w-[140px]">
                            {preview.nama_prestasi?.length > 0 ? preview.nama_prestasi.join(", ") : "Tidak ada"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#E2E8F0] px-3 py-2 font-semibold text-red-700 whitespace-nowrap">Surat Peringatan (SP)</td>
                          <td className="border border-[#E2E8F0] px-3 py-2 text-center font-bold text-red-700">{preview.total_sp}</td>
                          <td className="border border-[#E2E8F0] px-3 py-2 text-gray-600 break-words min-w-[140px]">
                            {preview.nama_sp?.length > 0 ? preview.nama_sp.join(", ") : "Tidak ada"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </div>
                )}

                {/* IPK distribution chart */}
                {preview && preview.ipk_distribution?.some(b => b.count > 0) && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">III. Distribusi IPK</p>
                    <div className="w-full h-[150px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={preview.ipk_distribution} margin={{ top: 4, right: 5, bottom: 0, left: -18 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="range" tick={{ fontSize: 9, fill: "#94A3B8" }} minTickGap={4} />
                        <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} allowDecimals={false} width={28} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                        <Bar dataKey="count" fill="#263F93" radius={[3, 3, 0, 0]} name="Jumlah" />
                      </BarChart>
                    </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Sample data table */}
                {preview && preview.mahasiswa.length > 0 && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">III. Sampel Data Mahasiswa</p>
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-xs border border-[#E2E8F0]">
                      <thead>
                        <tr style={{ background: "#F8FAFC" }}>
                          {["NIM", "Nama", "Prodi", "Angkatan", "IPK", "SP"].map((h) => (
                            <th key={h} className="border border-[#E2E8F0] px-2 py-1.5 text-left font-semibold whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.mahasiswa.slice(0, 5).map((m) => (
                          <tr key={m.id}>
                            <td className="border border-[#E2E8F0] px-2 py-1.5 font-mono whitespace-nowrap">{m.nim}</td>
                            <td className="border border-[#E2E8F0] px-2 py-1.5 break-words min-w-[100px]">{m.nama}</td>
                            <td className="border border-[#E2E8F0] px-2 py-1.5 break-words min-w-[90px]">{m.prodi.replace("Teknik ", "T.")}</td>
                            <td className="border border-[#E2E8F0] px-2 py-1.5 whitespace-nowrap">{m.angkatan}</td>
                            <td className="border border-[#E2E8F0] px-2 py-1.5 font-bold whitespace-nowrap"
                              style={{ color: m.ipk >= 3.0 ? "#059669" : "#DC2626" }}>
                              {m.ipk ?? "—"}
                            </td>
                            <td className="border border-[#E2E8F0] px-2 py-1.5 whitespace-nowrap">{m.sp || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                )}

                {/* Catatan */}
                {form.catatan && (
                  <div className="min-w-0">
                    <p className="font-bold text-gray-700 text-xs sm:text-sm mb-1">Catatan:</p>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed break-words">{form.catatan}</p>
                  </div>
                )}

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-3 sm:gap-8 mt-6 sm:mt-10 text-[11px] sm:text-sm text-center min-w-0">
                  <div className="min-w-0">
                    <p className="break-words">Garut, {tanggalFmt}</p>
                    <p className="font-medium">Pengelola KIP-K</p>
                    <div className="h-10 sm:h-16" />
                    <p className="font-bold underline break-words">{signature?.pengelola_nama ?? "Encep Jianul Hayat, S.T., M.T."}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 break-words">NIP. {signature?.pengelola_nip ?? "197804202006041001"}</p>
                  </div>
                  <div className="min-w-0">
                    <p>Mengetahui,</p>
                    <p className="font-medium">Wakil Utama</p>
                    <div className="h-10 sm:h-16" />
                    <p className="font-bold underline break-words">{signature?.warek_nama ?? "Dr. Rina Kurniawati, S.E., M.Si."}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 break-words">NIP. {signature?.warek_nip ?? "198203252008012002"}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Tujuan Pengiriman */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
            <div className="px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100 bg-gray-50/50 min-w-0">
              <h3 className="font-600 text-gray-800 text-sm">Tujuan Pengiriman</h3>
            </div>
            <div className="p-3 sm:p-4 space-y-3 min-w-0">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer min-w-0">
                <input type="checkbox" checked={tujuanWarek} onChange={e => setTujuanWarek(e.target.checked)} className="accent-[#263F93] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-500 text-gray-800">Wakil Utama III (Kemahasiswaan)</p>
                  <p className="text-xs text-gray-400 break-words">Laporan akan dikirim untuk review dan persetujuan Warek III</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer min-w-0">
                <input type="checkbox" checked={tujuanProdi} onChange={e => setTujuanProdi(e.target.checked)} className="accent-[#263F93] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-500 text-gray-800">Program Studi</p>
                  <p className="text-xs text-gray-400 break-words">Laporan akan dikirim ke Kaprodi sebagai informasi monitoring</p>
                </div>
              </label>
              {tujuanProdi && (
                <div className="ml-6 sm:ml-9 mr-1 min-w-0">
                  <label className="block text-sm font-500 text-gray-700 mb-1.5">Pilih Prodi Tujuan</label>
                  <select
                    value={prodiTujuan}
                    onChange={e => setProdiTujuan(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 bg-white max-w-full"
                  >
                    <option value="">Semua Program Studi</option>
                    {prodiList.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation bar */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-3 sm:px-4 py-3.5 sm:py-4 flex items-center justify-between gap-2 sm:gap-3 min-w-0">
        {step > 0 ? (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 shrink-0"
          >
            <ChevronLeft size={16} /> Kembali
          </button>
        ) : (
          <Link to="/admin/laporan" className="text-sm text-gray-500 hover:text-gray-700 shrink-0">
            Batal
          </Link>
        )}

        {step < 2 ? (
          <button
            onClick={goNext}
            disabled={step === 0 && !step1Valid}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-500 text-white disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            style={{ background: "#263F93" }}
          >
            {previewLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Selanjutnya <ChevronRight size={15} />
          </button>
        ) : (
          <div className="flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center gap-2 sm:gap-3 flex-1 min-[480px]:flex-none min-[480px]:justify-end">
            <button
              onClick={handleSimpanDraf}
              disabled={saving || submitting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-500 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Simpan Draf
            </button>
            <button
              onClick={handleKirimWarek}
              disabled={saving || submitting}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-700 text-white disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              style={{ background: "#263F93" }}
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Kirim ke Warek III
            </button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 bg-gray-900 text-white px-3 sm:px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 min-w-0">
          {syncing ? (
            <Loader2 size={18} className="animate-spin text-blue-400 flex-shrink-0" />
          ) : (
            <Check size={18} className="text-green-400 flex-shrink-0" />
          )}
          <p className="text-xs sm:text-sm font-medium break-words min-w-0">{toastMsg}</p>
        </div>
      )}
    </div>
  );
}
