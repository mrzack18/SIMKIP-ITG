import { getCurrentTahunAjaran } from "@/components/ui/TahunAjaranFilter";
import { useEffect, useState } from "react";
import { Download, FileText, Table } from "lucide-react";
import { api, API_BASE_URL } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface PreviewRow {
  nim: string;
  nama: string;
  angkatan: number;
  kategori: string;
  ipkTerakhir: number;
  semester: number;
  sp: number;
  dokumenLengkap: string;
}

interface PreviewResponse {
  success: boolean;
  data: PreviewRow[];
  summary: {
    totalMahasiswa: number;
    rataIpk: number;
    mahasiswaDenganSp: number;
  };
}

const DEFAULT_FORM = {
  tahunAkademik: "2025/2026",
  semester: "Genap",
  angkatan: "Semua",
  kategori: "Semua",
  sertakanIPK: true,
  sertakanDokumen: true,
  sertakanSP: false,
  format: "xlsx",
};

export default function EksporLaporan() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran());
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Pull available angkatan list once
  useEffect(() => {
    // intentionally empty: angkatan list driven by PREVIEW (only those that exist)
  }, []);

  const prodiNama = user?.prodi ?? "Program Studi";

  const set = (k: string) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        angkatan: form.angkatan,
        kategori: form.kategori,
        status: "Semua",
      });
      const res = await api.get<PreviewResponse>(`/ekspor/mahasiswa/preview?${params.toString()}`);
      setPreview(res);
      setGenerated(true);
    } catch (e: any) {
      setError(e?.message ?? "Gagal membuat pratinjau.");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams({
        angkatan: form.angkatan,
        kategori: form.kategori,
        tahun_akademik: form.tahunAkademik,
        semester: form.semester,
        sertakan_ipk: String(form.sertakanIPK),
        sertakan_dokumen: String(form.sertakanDokumen),
        sertakan_sp: String(form.sertakanSP),
        format: form.format,
      });
      const token = localStorage.getItem("simkip_token");
      const res = await fetch(`${API_BASE_URL}/ekspor/mahasiswa/download?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}`, "X-Requested-With": "XMLHttpRequest" } : { "X-Requested-With": "XMLHttpRequest" },
      });
      if (!res.ok) throw new Error("Gagal mengunduh.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = form.format === "pdf" ? "pdf" : "xlsx";
      a.href = url;
      a.download = `Mahasiswa_KIP-K_${prodiNama.replace(/\s+/g, "_")}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message ?? "Gagal mengunduh laporan.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0">
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-2 sm:gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="font-display font-700 text-lg sm:text-xl text-gray-900 leading-tight">Ekspor Laporan</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5 break-words">Generate dan download laporan mahasiswa KIP-K {prodiNama}</p>
        </div>
        <div className="self-start min-[480px]:self-auto shrink-0">
          <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
        {/* Form */}
        <div className="lg:col-span-1 bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 space-y-4 min-w-0">
          <h2 className="font-600 text-gray-800 text-sm">Parameter Laporan</h2>

          {[
            { label: "Tahun Akademik", key: "tahunAkademik", opts: ["2025/2026", "2024/2025", "2023/2024"] },
            { label: "Semester", key: "semester", opts: ["Ganjil", "Genap"] },
            { label: "Angkatan", key: "angkatan", opts: ["Semua", "2022", "2021", "2020", "2023"] },
            { label: "Kategori", key: "kategori", opts: ["Semua", "Reguler", "Aspirasi"] },
          ].map(f => (
            <div key={f.key} className="min-w-0">
              <label className="block text-xs font-500 text-gray-600 mb-1.5">{f.label}</label>
              <select value={(form as any)[f.key]} onChange={set(f.key)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none min-w-0">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div className="min-w-0">
            <label className="block text-xs font-500 text-gray-600 mb-2">Sertakan Data</label>
            <div className="space-y-2">
              {[
                { key: "sertakanIPK", label: "Riwayat IPK per semester" },
                { key: "sertakanDokumen", label: "Status dokumen kewajiban" },
                { key: "sertakanSP", label: "Riwayat surat peringatan" },
              ].map(c => (
                <label key={c.key} className="flex items-start gap-2 cursor-pointer min-w-0">
                  <input type="checkbox" checked={(form as any)[c.key]} onChange={set(c.key)}
                    className="w-4 h-4 accent-[#263F93] rounded mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 break-words">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <label className="block text-xs font-500 text-gray-600 mb-2">Format File</label>
            <div className="flex gap-2">
              {[{ val: "xlsx", label: "Excel (.xlsx)", icon: <Table size={14} /> }, { val: "pdf", label: "PDF", icon: <FileText size={14} /> }].map(f => (
                <label key={f.val} className={`flex-1 min-w-0 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors text-xs sm:text-sm ${form.format === f.val ? "border-[#263F93] bg-[#263F93]/5 text-[#263F93] font-500" : "border-gray-200 text-gray-600"}`}>
                  <input type="radio" name="format" value={f.val} checked={form.format === f.val} onChange={set("format")} className="hidden" />
                  <span className="flex-shrink-0">{f.icon}</span> <span className="truncate">{f.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-700 text-white disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
            style={{ background: "#263F93" }}>
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</> : "Generate Laporan"}
          </button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 min-w-0">
          {!generated ? (
            <div className="bg-white rounded-xl p-6 sm:p-10 px-4 shadow-sm border border-gray-100 text-center h-full flex flex-col items-center justify-center gap-3 min-w-0">
              <FileText size={40} className="text-gray-200" />
              <p className="text-gray-400 text-xs sm:text-sm break-words">Klik "Generate Laporan" untuk melihat pratinjau data</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
              <div className="px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100 flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  <h3 className="font-600 text-gray-800 text-sm">Pratinjau Laporan</h3>
                  <p className="text-xs text-gray-400 mt-0.5 break-words">{prodiNama} — {form.tahunAkademik} Semester {form.semester} — Angkatan {form.angkatan}</p>
                </div>
                <button onClick={handleDownload} disabled={downloading}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-700 text-white shadow-sm disabled:opacity-60 w-full min-[480px]:w-auto shrink-0 whitespace-nowrap"
                  style={{ background: "#263F93" }}>
                  <Download size={14} /> {downloading ? "Mengunduh..." : `Download ${form.format.toUpperCase()}`}
                </button>
              </div>

              {error && (
                <div className="px-3 sm:px-4 py-3 bg-red-50 border-b border-red-200 text-xs sm:text-sm text-red-700 break-words">{error}</div>
              )}

              <div className="grid grid-cols-3 gap-px bg-gray-100 min-w-0">
                {[
                  { label: "Total Mahasiswa", val: preview?.summary?.totalMahasiswa ?? 0 },
                  { label: "Rata-rata IPK",   val: Number(preview?.summary?.rataIpk ?? 0).toFixed(2) },
                  { label: "Mahasiswa dengan SP", val: preview?.summary?.mahasiswaDenganSp ?? 0 },
                ].map(s => (
                  <div key={s.label} className="bg-white px-2 sm:px-4 py-2.5 sm:py-3 text-center min-w-0">
                    <p className="font-display font-700 text-lg sm:text-xl text-[#263F93] break-words">{s.val}</p>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 break-words leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto min-w-0">
                <table className="w-full min-w-[760px] text-sm">
                  <thead><tr className="bg-gray-50">
                    {["NIM", "Nama", "Angkatan", "Kategori", "IPK Terakhir", "Semester", "SP", ...(form.sertakanDokumen ? ["Dokumen"] : [])].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-600 text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {(preview?.data ?? []).length === 0 && (
                      <tr><td colSpan={form.sertakanDokumen ? 8 : 7} className="px-4 py-8 text-center text-sm text-gray-400">Tidak ada data untuk filter ini.</td></tr>
                    )}
                    {(preview?.data ?? []).map((r) => (
                      <tr key={r.nim} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{r.nim}</td>
                        <td className="px-4 py-3 font-500 text-gray-800 break-words min-w-[120px]">{r.nama}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{r.angkatan}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-500 whitespace-nowrap ${r.kategori === "Reguler" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{r.kategori}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-700 font-display whitespace-nowrap ${r.ipkTerakhir >= 3.0 ? "text-green-600" : "text-red-500"}`}>{Number(r.ipkTerakhir).toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.semester}</td>
                        <td className="px-4 py-3">
                          {r.sp > 0 ? <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-500 whitespace-nowrap">SP{r.sp}</span> : <span className="text-gray-300">—</span>}
                        </td>
                        {form.sertakanDokumen && <td className="px-4 py-3 text-gray-600 text-xs break-words min-w-[120px]">{r.dokumenLengkap}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}