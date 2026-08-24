import { useState } from "react";
import { Download, FileText, Table } from "lucide-react";

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

const PREVIEW_DATA: PreviewRow[] = [
  { nim: "2206001", nama: "Ahmad Rifaldi", angkatan: 2022, kategori: "Reguler", ipkTerakhir: 3.35, semester: 8, sp: 0, dokumenLengkap: "5/5" },
  { nim: "2206015", nama: "Budi Setiawan", angkatan: 2022, kategori: "Reguler", ipkTerakhir: 2.85, semester: 8, sp: 1, dokumenLengkap: "4/5" },
  { nim: "2206033", nama: "Citra Dewi", angkatan: 2022, kategori: "Aspirasi", ipkTerakhir: 2.78, semester: 7, sp: 1, dokumenLengkap: "3/5" },
  { nim: "2306005", nama: "Eka Saputra", angkatan: 2023, kategori: "Reguler", ipkTerakhir: 3.42, semester: 6, sp: 0, dokumenLengkap: "5/5" },
];

export default function EksporLaporan() {
  const [form, setForm] = useState({
    tahunAkademik: "2025/2026",
    semester: "Genap",
    angkatan: "Semua",
    kategori: "Semua",
    sertakanIPK: true,
    sertakanDokumen: true,
    sertakanSP: false,
    format: "xlsx",
  });
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Ekspor Laporan</h1>
        <p className="text-gray-500 text-sm mt-0.5">Generate dan download laporan mahasiswa KIP-K Teknik Informatika</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form */}
        <div className="lg:col-span-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-600 text-gray-800 text-sm">Parameter Laporan</h2>

          {[
            { label: "Tahun Akademik", key: "tahunAkademik", opts: ["2025/2026", "2024/2025", "2023/2024"] },
            { label: "Semester", key: "semester", opts: ["Ganjil", "Genap"] },
            { label: "Angkatan", key: "angkatan", opts: ["Semua", "2022", "2021", "2020", "2023"] },
            { label: "Kategori", key: "kategori", opts: ["Semua", "Reguler", "Aspirasi"] },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-500 text-gray-600 mb-1.5">{f.label}</label>
              <select value={(form as any)[f.key]} onChange={set(f.key)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div>
            <label className="block text-xs font-500 text-gray-600 mb-2">Sertakan Data</label>
            <div className="space-y-2">
              {[
                { key: "sertakanIPK", label: "Riwayat IPK per semester" },
                { key: "sertakanDokumen", label: "Status dokumen kewajiban" },
                { key: "sertakanSP", label: "Riwayat surat peringatan" },
              ].map(c => (
                <label key={c.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={(form as any)[c.key]} onChange={set(c.key)}
                    className="w-4 h-4 accent-[#263F93] rounded" />
                  <span className="text-sm text-gray-700">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-500 text-gray-600 mb-2">Format File</label>
            <div className="flex gap-2">
              {[{ val: "xlsx", label: "Excel (.xlsx)", icon: <Table size={14} /> }, { val: "pdf", label: "PDF", icon: <FileText size={14} /> }].map(f => (
                <label key={f.val} className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${form.format === f.val ? "border-[#263F93] bg-[#263F93]/5 text-[#263F93] font-500" : "border-gray-200 text-gray-600"}`}>
                  <input type="radio" name="format" value={f.val} checked={form.format === f.val} onChange={set("format")} className="hidden" />
                  {f.icon} {f.label}
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-700 text-white disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "#263F93" }}>
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</> : "Generate Laporan"}
          </button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          {!generated ? (
            <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 text-center h-full flex flex-col items-center justify-center gap-3">
              <FileText size={40} className="text-gray-200" />
              <p className="text-gray-400 text-sm">Klik "Generate Laporan" untuk melihat pratinjau data</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-600 text-gray-800 text-sm">Pratinjau Laporan</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Teknik Informatika — {form.tahunAkademik} Semester {form.semester} — Angkatan {form.angkatan}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-700 text-white shadow-sm"
                  style={{ background: "#263F93" }}>
                  <Download size={14} /> Download {form.format.toUpperCase()}
                </button>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-px bg-gray-100">
                {[
                  { label: "Total Mahasiswa", val: PREVIEW_DATA.length },
                  { label: "Rata-rata IPK", val: (PREVIEW_DATA.reduce((s,r)=>s+r.ipkTerakhir,0)/PREVIEW_DATA.length).toFixed(2) },
                  { label: "Mahasiswa dengan SP", val: PREVIEW_DATA.filter(r=>r.sp>0).length },
                ].map(s => (
                  <div key={s.label} className="bg-white px-4 py-3 text-center">
                    <p className="font-display font-700 text-2xl text-[#263F93]">{s.val}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50">
                    {["NIM", "Nama", "Angkatan", "Kategori", "IPK Terakhir", "Semester", "SP", ...(form.sertakanDokumen ? ["Dokumen"] : [])].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-600 text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {PREVIEW_DATA.map(r => (
                      <tr key={r.nim} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.nim}</td>
                        <td className="px-4 py-3 font-500 text-gray-800">{r.nama}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{r.angkatan}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-500 ${r.kategori === "Reguler" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{r.kategori}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-700 font-display ${r.ipkTerakhir >= 3.0 ? "text-green-600" : "text-red-500"}`}>{r.ipkTerakhir.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{r.semester}</td>
                        <td className="px-4 py-3">
                          {r.sp > 0 ? <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-500">SP{r.sp}</span> : <span className="text-gray-300">—</span>}
                        </td>
                        {form.sertakanDokumen && <td className="px-4 py-3 text-gray-600 text-xs">{r.dokumenLengkap}</td>}
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
