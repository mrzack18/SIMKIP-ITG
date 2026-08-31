import { useState, useRef, useEffect } from "react";
import { Plus, X, Upload, CheckCircle, Clock, AlertTriangle, Building2, Calendar, FileText, Eye, Download, Image } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { TahunAjaranFilter, getCurrentTahunAjaran } from "@/components/ui/TahunAjaranFilter";

type OStatus = "Disetujui" | "Menunggu" | "Ditolak";

interface Org {
  id: number;
  jenis: "Organisasi" | "Kepanitiaan" | "Kegiatan";
  nama: string;
  jabatan: string;
  mulai: string;
  selesai: string;
  deskripsi: string;
  status: OStatus;
  catatanAdmin?: string;
  fotoKegiatan?: string;
  fileSk?: string;
  tahunAjaran?: string;
}

const statusStyle: Record<OStatus, { badge: string; icon: React.ReactNode; dot: string }> = {
  Disetujui: { badge: "bg-green-100 text-green-700", icon: <CheckCircle size={13} className="text-green-500" />, dot: "bg-green-500" },
  Menunggu: { badge: "bg-yellow-100 text-yellow-700", icon: <Clock size={13} className="text-yellow-500" />, dot: "bg-yellow-400" },
  Ditolak: { badge: "bg-red-100 text-red-700", icon: <AlertTriangle size={13} className="text-red-500" />, dot: "bg-red-500" },
};

function calcDuration(mulai: string, selesai: string) {
  if (!mulai || !selesai) return "";
  const m = new Date(mulai + "-01");
  const s = new Date(selesai + "-01");
  const months = (s.getFullYear() - m.getFullYear()) * 12 + (s.getMonth() - m.getMonth());
  if (months < 12) return `${months} bulan`;
  const yr = Math.floor(months / 12);
  const mo = months % 12;
  return mo > 0 ? `${yr} tahun ${mo} bulan` : `${yr} tahun`;
}

function fmtMonth(ym: string) {
  if (!ym) return "—";
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${names[parseInt(m) - 1]} ${y}`;
}



const formatTA = (ta: string) => ta ? ta.replace("Tahun ", "").replace("-1", " Ganjil").replace("-2", " Genap") : "2025/2026 Ganjil";

export default function Organisasi() {
  const { user } = useAuth();
  const STUDENT_NAME = user?.nama || "Mahasiswa";

  const [list, setList] = useState<Org[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Org | null>(null);
  const [skOrg, setSkOrg] = useState<Org | null>(null);
  const [fileName, setFileName] = useState("");
  const [fotoName, setFotoName] = useState("");
  const [taFilter, setTaFilter] = useState(getCurrentTahunAjaran());
  const [form, setForm] = useState({ jenis: "Organisasi" as "Organisasi" | "Kepanitiaan" | "Kegiatan", nama: "", jabatan: "", mulai: "", selesai: "", deskripsi: "", tahunAjaran: "2025/2026 Ganjil" });
  const fileRef = useRef<HTMLInputElement>(null);
  const fotoRef = useRef<HTMLInputElement>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchOrganisasi = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ data: Org[] }>("/organisasi");
      if (res && res.data && Array.isArray(res.data)) {
        setList(res.data);
      } else if (res && Array.isArray(res.data)) { // in case of { data: [...] } structure
        setList(res.data);
      } else if (res && (res as any).data && Array.isArray((res as any).data.data)) {
        setList((res as any).data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisasi();
  }, []);

  const handleSubmit = async () => {
    if (!form.nama.trim() || !form.jabatan.trim()) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("jenis", form.jenis);
      formData.append("nama", form.nama);
      formData.append("jabatan", form.jabatan);
      if (form.mulai) formData.append("periode_mulai", `${form.mulai}-01`);
      if (form.selesai) formData.append("periode_selesai", `${form.selesai}-01`);
      if (form.deskripsi) formData.append("deskripsi", form.deskripsi);
      formData.append("tahun_ajaran", form.tahunAjaran);
      
      const fileEl = fileRef.current?.files?.[0];
      if (fileEl) formData.append("file_sk", fileEl);
      
      const fotoEl = fotoRef.current?.files?.[0];
      if (fotoEl) formData.append("foto_kegiatan", fotoEl);

      await api.post("/organisasi", formData);

      setForm({ jenis: "Organisasi", nama: "", jabatan: "", mulai: "", selesai: "", deskripsi: "", tahunAjaran: "2025/2026 Ganjil" });
      setFileName("");
      setFotoName("");
      setOpen(false);
      
      fetchOrganisasi();
    } catch (err: any) {
      if (err.status === 422 && err.error?.errors) {
        const msgs = Object.values(err.error.errors).flat().join("\n");
        alert(msgs);
      } else {
        alert(err.message || "Terjadi kesalahan sistem saat menyimpan data.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Keaktifan Organisasi & Kepanitiaan</h1>
          <p className="text-gray-500 text-sm mt-0.5">{list.length} organisasi tercatat</p>
        </div>
        <div className="flex items-center gap-3">
          <TahunAjaranFilter value={taFilter} onChange={setTaFilter} />
          <button onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white"
            style={{ background: "#263F93" }}>
            <Plus size={15} /> Tambah Data
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-6">
          {[formatTA(taFilter)].map((ta) => (
            <div key={ta} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0 z-10 text-gray-500 font-bold text-xs">
                  {ta.split(" ")[0]}
                </div>
                <h2 className="font-600 text-gray-700 text-sm bg-gray-100 px-3 py-1 rounded-lg">Tahun Ajaran {ta}</h2>
              </div>
              <div className="space-y-4">
                {list.filter(org => (org.tahunAjaran || "2025/2026 Ganjil") === ta).map((org) => {
                  const ss = statusStyle[org.status];
                  const duration = calcDuration(org.mulai, org.selesai);
                  return (
                    <div key={org.id} className="relative pl-14">
                      <div className={`absolute left-3.5 top-5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${ss.dot}`} />
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0]">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                            <Building2 size={18} className="text-[#263F93]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                              <h3 className="font-600 text-gray-800 text-sm">{org.nama}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs font-500 ${
                                org.jenis === "Organisasi" ? "bg-blue-100 text-blue-700" :
                                org.jenis === "Kepanitiaan" ? "bg-purple-100 text-purple-700" :
                                "bg-teal-100 text-teal-700"
                              }`}>{org.jenis}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-500 flex items-center gap-1 ${ss.badge}`}>
                                {ss.icon} {org.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-500">{org.jabatan}</p>
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                              <Calendar size={11} />
                              <span>{fmtMonth(org.mulai)} – {fmtMonth(org.selesai)}</span>
                              {duration && <span className="text-gray-300">·</span>}
                              {duration && <span className="text-gray-400 font-500">{duration}</span>}
                            </div>
                            {org.deskripsi && <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{org.deskripsi}</p>}
                          </div>
                        </div>

                        {/* Proof thumbnail */}
                        <div className="mt-3 h-16 bg-[#F8FAFC] rounded-lg flex items-center justify-center border border-dashed border-[#E2E8F0] gap-2 overflow-hidden">
                          {org.fileSk ? (
                            <span className="text-xs text-gray-400 font-500">Dokumen SK Tersedia</span>
                          ) : (
                            <>
                              <FileText size={14} className="text-gray-300" />
                              <span className="text-xs text-gray-300">Belum ada dokumen</span>
                            </>
                          )}
                        </div>

                        {org.catatanAdmin && (
                          <div className="mt-3 flex items-start gap-2 bg-red-50 px-3 py-2 rounded-lg">
                            <AlertTriangle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700"><span className="font-500">Catatan Admin:</span> {org.catatanAdmin}</p>
                          </div>
                        )}

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => setDetail(org)}
                            className="flex-1 py-1.5 rounded-lg border border-[#E2E8F0] text-xs text-gray-600 hover:bg-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Eye size={12} /> Lihat Detail
                          </button>
                          <button
                            onClick={() => setSkOrg(org)}
                            className="flex-1 py-1.5 rounded-lg border border-[#263F93] text-xs text-[#263F93] hover:bg-[#EDF0F8] flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <FileText size={12} /> Pratinjau SK
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="font-display font-700 text-gray-800">Detail Keaktifan Organisasi</h3>
              <button onClick={() => setDetail(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <Building2 size={22} className="text-[#263F93]" />
                </div>
                <div>
                  <h4 className="font-700 text-gray-800">{detail.nama}</h4>
                  <p className="text-sm text-gray-500 font-500 mt-0.5">{detail.jabatan}</p>
                  <span className={`mt-1.5 inline-flex px-2 py-0.5 rounded text-xs font-500 items-center gap-1 ${statusStyle[detail.status].badge}`}>
                    {statusStyle[detail.status].icon} {detail.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Periode</p>
                  <p className="font-500 text-gray-700">{fmtMonth(detail.mulai)} – {fmtMonth(detail.selesai)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Durasi</p>
                  <p className="font-500 text-gray-700">{calcDuration(detail.mulai, detail.selesai) || "—"}</p>
                </div>
              </div>
              {detail.deskripsi && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-gray-700">{detail.deskripsi}</p>
                </div>
              )}
              {detail.catatanAdmin && (
                <div className="flex items-start gap-2 bg-red-50 px-3 py-2.5 rounded-xl">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700"><span className="font-500">Catatan Admin:</span> {detail.catatanAdmin}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-2">Bukti Dokumen</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-36 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-2">
                    <FileText size={28} className="text-gray-300" />
                    <p className="text-xs text-gray-400 px-2 text-center">{detail.fileSk ? "SK Tersedia" : "Belum ada dokumen"}</p>
                    <button 
                      onClick={() => detail.fileSk && window.open(detail.fileSk, '_blank')}
                      disabled={!detail.fileSk}
                      className="mt-1 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs text-gray-600 hover:bg-gray-100 flex items-center gap-1.5 disabled:opacity-50">
                      <Eye size={11} /> Lihat Dokumen
                    </button>
                  </div>
                  <div className="h-36 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-2 overflow-hidden">
                    {detail.fotoKegiatan ? (
                      <img src={detail.fotoKegiatan} alt="Foto Kegiatan" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Image size={28} className="text-gray-300" />
                        <p className="text-xs text-gray-400 text-center px-2">Belum ada foto</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SK Preview modal */}
      {skOrg && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">SK Kepengurusan</h3>
                <p className="text-xs text-gray-400 mt-0.5">{skOrg.nama}</p>
              </div>
              <button onClick={() => setSkOrg(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* SK document preview */}
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                {/* SK header */}
                <div className="bg-[#263F93] px-6 py-4 text-center">
                  <p className="text-white text-xs font-semibold uppercase tracking-widest opacity-80">Institut Teknologi Garut</p>
                  <p className="text-white font-bold text-base mt-1">SURAT KEPUTUSAN KEPENGURUSAN</p>
                  <p className="text-white/70 text-xs mt-0.5">Tahun Akademik {skOrg.mulai ? skOrg.mulai.split("-")[0] : "—"}/{skOrg.selesai ? skOrg.selesai.split("-")[0] : "—"}</p>
                </div>
                {/* SK body */}
                <div className="bg-[#F8FAFC] px-6 py-5 space-y-3">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-14 h-14 rounded-full bg-[#263F93]/10 flex items-center justify-center">
                      <FileText size={28} className="text-[#263F93]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                      <p className="text-xs text-gray-400 mb-0.5">Nama Mahasiswa</p>
                      <p className="font-semibold text-gray-800 text-sm">{STUDENT_NAME}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                      <p className="text-xs text-gray-400 mb-0.5">Jabatan</p>
                      <p className="font-semibold text-gray-800 text-sm">{skOrg.jabatan}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                      <p className="text-xs text-gray-400 mb-0.5">Organisasi</p>
                      <p className="font-semibold text-gray-800 text-sm">{skOrg.nama}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                      <p className="text-xs text-gray-400 mb-0.5">Periode</p>
                      <p className="font-semibold text-gray-800 text-sm">{fmtMonth(skOrg.mulai)} – {fmtMonth(skOrg.selesai)}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-[#E2E8F0] text-center mt-2">
                    <p className="text-xs text-gray-400">Status Dokumen</p>
                    <span className={`mt-1 inline-flex px-3 py-0.5 rounded text-xs font-semibold items-center gap-1 ${statusStyle[skOrg.status].badge}`}>
                      {statusStyle[skOrg.status].icon} {skOrg.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1 border-t border-[#E2E8F0] mt-2">
                    <div className="w-6 h-6 rounded-full bg-[#D4A72C]/20 flex items-center justify-center text-[#D4A72C]">
                      <CheckCircle size={14} />
                    </div>
                    <p className="text-xs text-gray-400">Dokumen ini diterbitkan oleh sistem KIP-K ITG</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSkOrg(null)}
                  className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => skOrg.fileSk && window.open(skOrg.fileSk, '_blank')}
                  disabled={!skOrg.fileSk}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: "#263F93" }}
                >
                  <Download size={14} /> Unduh SK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="font-display font-700 text-gray-800">Tambah Data</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={18} /></button>
            </div>

            <div className="flex-1 px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Jenis <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  {(["Organisasi", "Kepanitiaan", "Kegiatan"] as const).map(j => (
                    <label key={j} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="jenis"
                        value={j}
                        checked={form.jenis === j}
                        onChange={() => setForm(f => ({ ...f, jenis: j }))}
                        className="accent-[#263F93]"
                      />
                      <span className="text-sm text-gray-700">{j}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Tahun Ajaran <span className="text-red-500">*</span></label>
                <select value={form.tahunAjaran} onChange={e => setForm(f => ({ ...f, tahunAjaran: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20">
                  <option value="2025/2026 Ganjil">2025/2026 Ganjil</option>
                  <option value="2024/2025 Genap">2024/2025 Genap</option>
                  <option value="2024/2025 Ganjil">2024/2025 Ganjil</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Nama Organisasi / Kegiatan <span className="text-red-500">*</span></label>
                <input value={form.nama} onChange={set("nama")} placeholder="BEM ITG, HIMA, UKM..."
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20" />
              </div>
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Jabatan / Peran <span className="text-red-500">*</span></label>
                <input value={form.jabatan} onChange={set("jabatan")} placeholder="Ketua, Sekretaris, Anggota..."
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-1.5">Periode Mulai</label>
                  <input type="month" value={form.mulai} onChange={set("mulai")}
                    className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-1.5">Periode Selesai</label>
                  <input type="month" value={form.selesai} onChange={set("selesai")}
                    className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              {form.mulai && form.selesai && (
                <p className="text-xs text-[#263F93] font-500 -mt-2">Durasi: {calcDuration(form.mulai, form.selesai)}</p>
              )}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Deskripsi Kegiatan <span className="text-gray-400">(opsional)</span></label>
                <textarea value={form.deskripsi} onChange={set("deskripsi")} rows={3} placeholder="Uraikan peran dan kegiatan Anda..."
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Sertifikat / SK Pengurus</label>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center cursor-pointer hover:border-[#263F93]/30 hover:bg-[#F8FAFC] transition-colors">
                  {fileName ? (
                    <div className="text-sm text-[#263F93] font-500">📎 {fileName}</div>
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-300 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Seret file ke sini atau klik untuk memilih</div>
                      <div className="text-xs text-gray-300 mt-1">PDF, JPG, PNG — maks. 10MB</div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                  onChange={e => setFileName(e.target.files?.[0]?.name || "")} />
              </div>
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Foto Dokumentasi Kegiatan</label>
                <div onClick={() => fotoRef.current?.click()}
                  className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center cursor-pointer hover:border-[#263F93]/30 hover:bg-[#F8FAFC] transition-colors">
                  {fotoName ? (
                    <div className="text-sm text-[#263F93] font-500">📎 {fotoName}</div>
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-300 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Seret foto ke sini atau klik untuk memilih</div>
                      <div className="text-xs text-gray-300 mt-1">JPG, PNG — maks. 10MB</div>
                    </>
                  )}
                </div>
                <input ref={fotoRef} type="file" accept=".jpg,.jpeg,.png" className="hidden"
                  onChange={e => setFotoName(e.target.files?.[0]?.name || "")} />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#E2E8F0] flex gap-3">
              <button onClick={() => setOpen(false)} className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-gray-600">Batal</button>
              <button onClick={handleSubmit} disabled={!form.nama.trim() || !form.jabatan.trim() || isSubmitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white disabled:opacity-40"
                style={{ background: "#263F93" }}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
