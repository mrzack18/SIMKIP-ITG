import { useState, useRef, useEffect } from "react";
import { Plus, X, Upload, CheckCircle, Clock, AlertTriangle, Trophy, FileText, Eye, MapPin, Calendar, Link, Image, Loader2, Pencil, Send, Download } from "lucide-react";
import { api } from "@/services/api";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";
import { downloadFile } from "@/utils/fileUrl";

type PTab = "Internasional" | "Nasional" | "Wilayah";
type PStatus = "Disetujui" | "Menunggu Validasi" | "Ditolak";

interface Prestasi {
  id: number;
  tab: PTab;
  nama: string;
  penyelenggara: string;
  pencapaian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tempat: string;
  deskripsi: string;
  linkPenyelenggara: string;
  fileSertifikat: string;
  fileFoto: string;
  status: PStatus;
  catatanAdmin?: string;
  tahunAjaran?: string;
}



const TABS: PTab[] = ["Internasional", "Nasional", "Wilayah"];

const statusStyle: Record<PStatus, { badge: string; icon: React.ReactNode }> = {
  Disetujui: {
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle size={12} className="text-green-500" />,
  },
  "Menunggu Validasi": {
    badge: "bg-yellow-100 text-yellow-700",
    icon: <Clock size={12} className="text-yellow-500" />,
  },
  Ditolak: {
    badge: "bg-red-100 text-red-700",
    icon: <AlertTriangle size={12} className="text-red-500" />,
  },
};

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

interface FormState {
  tab: PTab;
  nama: string;
  penyelenggara: string;
  pencapaian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tempat: string;
  deskripsi: string;
  linkPenyelenggara: string;
}

const EMPTY_FORM: FormState = {
  tab: "Nasional",
  nama: "",
  penyelenggara: "",
  pencapaian: "",
  tanggalMulai: "",
  tanggalSelesai: "",
  tempat: "",
  deskripsi: "",
  linkPenyelenggara: "",
};

const formatTA = (ta: string) => ta ? ta.replace("Tahun ", "").replace("-1", " Ganjil").replace("-2", " Genap") : "2025/2026 Ganjil";

export default function Prestasi() {
  const [list, setList] = useState<Prestasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<PTab>("Internasional");
  const [openForm, setOpenForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taFilter, setTaFilter] = useState(getCurrentTahunAjaran());
  const [detail, setDetail] = useState<Prestasi | null>(null);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [fileSertifikat, setFileSertifikat] = useState<File | null>(null);
  const [fileFoto, setFileFoto] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<Prestasi | null>(null);
  const sertifikatRef = useRef<HTMLInputElement>(null);
  const fotoRef = useRef<HTMLInputElement>(null);

  const fetchPrestasi = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: any[] }>(
        "/prestasi",
        taFilter ? { tahun_ajaran: taFilter } : undefined
      );
      const mappedData = res.data.map((item: any) => ({
        ...item,
        tab: item.tingkat,
        nama: item.namaPrestasi,
      }));
      setList(mappedData);
    } catch (err: any) {
      setError(err.message || "Gagal memuat prestasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestasi();
  }, [taFilter]);

  const set = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const tabItems = list.filter((p) => p.tab === activeTab);

  const openAddForm = () => {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM, tab: activeTab });
    setFileSertifikat(null);
    setFileFoto(null);
    setOpenForm(true);
  };

  const openEditForm = (item: Prestasi) => {
    setEditingItem(item);
    setForm({
      tab: item.tab,
      nama: item.nama,
      penyelenggara: item.penyelenggara,
      pencapaian: item.pencapaian,
      tanggalMulai: item.tanggalMulai,
      tanggalSelesai: item.tanggalSelesai,
      tempat: item.tempat,
      deskripsi: item.deskripsi,
      linkPenyelenggara: item.linkPenyelenggara || "",
    });
    setFileSertifikat(null);
    setFileFoto(null);
    setOpenForm(true);
  };

  const handleSubmit = async () => {
    if (!form.nama.trim() || !form.penyelenggara.trim()) return;
    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("tingkat", form.tab);
      payload.append("nama_prestasi", form.nama);
      payload.append("penyelenggara", form.penyelenggara);
      if (form.pencapaian) payload.append("pencapaian", form.pencapaian);
      if (form.tanggalMulai) payload.append("tanggal_mulai", form.tanggalMulai);
      if (form.tanggalSelesai) payload.append("tanggal_selesai", form.tanggalSelesai);
      if (form.tempat) payload.append("tempat", form.tempat);
      if (form.deskripsi) payload.append("deskripsi", form.deskripsi);
      if (form.linkPenyelenggara) payload.append("link_penyelenggara", form.linkPenyelenggara);
      if (fileSertifikat) payload.append("file_sertifikat", fileSertifikat);
      if (fileFoto) payload.append("file_foto", fileFoto);

      if (editingItem) {
        await api.put(`/prestasi/${editingItem.id}`, payload);
      } else {
        await api.post("/prestasi", payload);
      }
      setEditingItem(null);
      setOpenForm(false);
      fetchPrestasi();
    } catch (err: any) {
      if (err.status === 413) {
        alert("File yang Anda upload terlalu besar. Server menolak permintaan (HTTP 413). Silakan kompres file Anda atau hubungi admin untuk memperbesar batas ukuran upload (upload_max_filesize di php.ini).");
      } else {
        alert(err.error?.message || err.message || "Gagal menyimpan prestasi");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResubmit = async (id: number) => {
    try {
      await api.patch(`/prestasi/${id}/resubmit`);
      fetchPrestasi();
    } catch (err: any) {
      alert(err.error?.message || err.message || "Gagal mengajukan ulang");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-2" /> Memuat data prestasi...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Prestasi Saya</h1>
          <p className="text-gray-500 text-sm mt-0.5">{list.length} prestasi tercatat</p>
        </div>
        <TahunAjaranFilter value={taFilter} onChange={setTaFilter} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => {
            const count = list.filter((p) => p.tab === tab).length;
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  active ? "bg-[#263F93] text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                    active ? "bg-[#D4A72C] text-[#263F93]" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {tabItems.length} prestasi tingkat {activeTab.toLowerCase()}
            </p>
            <button
              onClick={openAddForm}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "#263F93" }}
            >
              <Plus size={15} /> Tambah Prestasi
            </button>
          </div>

          {tabItems.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-3 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "#263F93" + "1a" }}
              >
                <Trophy size={24} style={{ color: "#263F93" }} />
              </div>
              <p className="text-gray-500 text-sm">Belum ada prestasi tingkat {activeTab.toLowerCase()}.</p>
              <button
                onClick={openAddForm}
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: "#263F93" }}
              >
                <Plus size={14} /> Tambah sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="font-600 text-gray-700 text-sm bg-gray-50 px-3 py-1.5 rounded-lg inline-block border border-gray-100">
                    Tahun Ajaran {formatTA(taFilter)}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tabItems.map((p) => {
                      const ss = statusStyle[p.status];
                      return (
                        <div
                          key={p.id}
                          className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: "#263F93" + "1a" }}
                            >
                              <Trophy size={18} style={{ color: "#D4A72C", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 text-sm leading-snug">{p.nama}</h3>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                {p.pencapaian && (
                                  <span
                                    className="px-2 py-0.5 rounded text-xs font-medium text-white"
                                    style={{ background: "#263F93" }}
                                  >
                                    {p.pencapaian}
                                  </span>
                                )}
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${ss.badge}`}
                                >
                                  {ss.icon} {p.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 space-y-1.5 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Trophy size={11} className="text-gray-400 flex-shrink-0" />
                              <span>{p.penyelenggara}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                              <span>
                                {formatDate(p.tanggalMulai)} – {formatDate(p.tanggalSelesai)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                              <span>{p.tempat}</span>
                            </div>
                          </div>

                          {p.catatanAdmin && (
                            <div className="mb-3 flex items-start gap-2 bg-red-50 px-3 py-2 rounded-lg">
                              <AlertTriangle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-red-700">
                                <span className="font-medium">Catatan Admin:</span> {p.catatanAdmin}
                              </p>
                            </div>
                          )}

                          <button
                            onClick={() => setDetail(p)}
                            className="w-full py-1.5 rounded-lg border border-[#263F93] text-xs text-[#263F93] hover:bg-[#EDF0F8] transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Eye size={12} /> Lihat Detail
                          </button>

                          {p.status === "Ditolak" && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => openEditForm(p)}
                                className="flex-1 py-1.5 rounded-lg border border-amber-300 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleResubmit(p.id)}
                                className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white bg-[#263F93] hover:bg-[#1a2e6e] transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Send size={12} /> Ajukan Ulang
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-gray-800">Detail Prestasi</h3>
              <button
                onClick={() => setDetail(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#263F93" + "1a" }}
                >
                  <Trophy size={22} style={{ color: "#D4A72C", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">{detail.nama}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        detail.tab === "Internasional"
                          ? "bg-[#F5EDD4] text-[#D4A72C]"
                          : detail.tab === "Nasional"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {detail.tab}
                    </span>
                    {detail.pencapaian && (
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ background: "#263F93" }}
                      >
                        {detail.pencapaian}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusStyle[detail.status].badge}`}
                    >
                      {statusStyle[detail.status].icon} {detail.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Penyelenggara</p>
                  <p className="font-medium text-gray-700">{detail.penyelenggara || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Tempat</p>
                  <p className="font-medium text-gray-700">{detail.tempat || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Tanggal Mulai</p>
                  <p className="font-medium text-gray-700">{formatDate(detail.tanggalMulai)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Tanggal Selesai</p>
                  <p className="font-medium text-gray-700">{formatDate(detail.tanggalSelesai)}</p>
                </div>
              </div>

              {detail.deskripsi && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-gray-700">{detail.deskripsi}</p>
                </div>
              )}

              {detail.linkPenyelenggara && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Link Penyelenggara</p>
                  <a
                    href={detail.linkPenyelenggara}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-1.5 hover:underline"
                    style={{ color: "#263F93" }}
                  >
                    <Link size={12} /> {detail.linkPenyelenggara}
                  </a>
                </div>
              )}

              {detail.catatanAdmin && (
                <div className="flex items-start gap-2 bg-red-50 px-3 py-2.5 rounded-xl">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Catatan Admin:</span> {detail.catatanAdmin}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Sertifikat / Piagam</p>
                  {detail.fileSertifikat ? (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      {detail.fileSertifikat.toLowerCase().endsWith(".pdf") ? (
                        <iframe
                          src={detail.fileSertifikat}
                          className="w-full h-40 border-0"
                          title="Sertifikat"
                        />
                      ) : (
                        <img
                          src={detail.fileSertifikat}
                          alt="Sertifikat"
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                        <a
                          href={detail.fileSertifikat}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
                        >
                          <Eye size={12} /> Pratinjau
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            downloadFile("prestasi", detail.id, "file_sertifikat").catch((err) =>
                              alert(err?.message || "Gagal mengunduh file")
                            );
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
                        >
                          <Download size={12} /> Download
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5">
                      <FileText size={22} className="text-gray-300" />
                      <p className="text-xs text-gray-400">Belum diunggah</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Foto Kegiatan</p>
                  {detail.fileFoto ? (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <img
                        src={detail.fileFoto}
                        alt="Foto Kegiatan"
                        className="w-full h-40 object-cover"
                      />
                      <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50">
                        <a
                          href={detail.fileFoto}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
                        >
                          <Eye size={12} /> Pratinjau
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            downloadFile("prestasi", detail.id, "file_foto").catch((err) =>
                              alert(err?.message || "Gagal mengunduh file")
                            );
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
                        >
                          <Download size={12} /> Download
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5">
                      <Image size={22} className="text-gray-300" />
                      <p className="text-xs text-gray-400">Belum diunggah</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setDetail(null)}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: "#263F93" }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add form slide-over */}
      {openForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => { setEditingItem(null); setOpenForm(false); }} />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h2 className="font-bold text-gray-800">{editingItem ? "Perbaiki Prestasi" : "Tambah Prestasi"}</h2>
              <button
                onClick={() => { setEditingItem(null); setOpenForm(false); }}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 px-5 py-4 space-y-4">
              {editingItem && editingItem.status === "Ditolak" && editingItem.catatanAdmin && (
                <div className="flex items-start gap-2 bg-red-50 px-3 py-2.5 rounded-xl">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Catatan Admin:</span> {editingItem.catatanAdmin}
                  </p>
                </div>
              )}
              {/* Kategori */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Kategori Tingkat</label>
                <div className="flex gap-2">
                  {TABS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, tab: t }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        form.tab === t
                          ? "text-white border-transparent"
                          : "text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                      style={form.tab === t ? { background: "#263F93" } : {}}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  Nama Prestasi / Penghargaan <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.nama}
                  onChange={set("nama")}
                  placeholder="Juara 1 Lomba Coding..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>

              {/* Penyelenggara */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  Penyelenggara <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.penyelenggara}
                  onChange={set("penyelenggara")}
                  placeholder="Nama lembaga / instansi..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>

              {/* Pencapaian */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Pencapaian / Juara ke-</label>
                <input
                  value={form.pencapaian}
                  onChange={set("pencapaian")}
                  placeholder="Juara 2, Best Paper, Finalis..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-1.5">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={form.tanggalMulai}
                    onChange={set("tanggalMulai")}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-1.5">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={form.tanggalSelesai}
                    onChange={set("tanggalSelesai")}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                  />
                </div>
              </div>

              {/* Tempat */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Tempat Pelaksanaan</label>
                <input
                  value={form.tempat}
                  onChange={set("tempat")}
                  placeholder="Jakarta, Online, dll."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  Deskripsi <span className="text-gray-400 text-xs">(opsional)</span>
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={set("deskripsi")}
                  rows={3}
                  placeholder="Ceritakan pencapaian Anda..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>

              {/* Link Penyelenggara */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1">Link Penyelenggara</label>
                <p className="text-xs text-gray-400 mb-1.5">Untuk pelaporan Simkat Mawa</p>
                <input
                  type="url"
                  value={form.linkPenyelenggara}
                  onChange={set("linkPenyelenggara")}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>

              {/* Upload Sertifikat */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">Sertifikat atau Piagam</label>
                <div
                  onClick={() => sertifikatRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-[#263F93]/30 hover:bg-gray-50/50 transition-colors"
                >
                  {fileSertifikat ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText size={16} style={{ color: "#263F93" }} />
                      <span className="text-sm font-medium" style={{ color: "#263F93" }}>{fileSertifikat.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={22} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Seret file ke sini atau klik untuk memilih</p>
                      <p className="text-xs text-gray-300 mt-1">PDF, JPG, PNG — maks. 10MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={sertifikatRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => setFileSertifikat(e.target.files?.[0] || null)}
                />
              </div>

              {/* Upload Foto Kegiatan */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  Foto saat di podium atau kegiatan berlangsung
                </label>
                <div
                  onClick={() => fotoRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-[#263F93]/30 hover:bg-gray-50/50 transition-colors"
                >
                  {fileFoto ? (
                    <div className="flex items-center justify-center gap-2">
                      <Image size={16} style={{ color: "#263F93" }} />
                      <span className="text-sm font-medium" style={{ color: "#263F93" }}>{fileFoto.name}</span>
                    </div>
                  ) : (
                    <>
                      <Image size={22} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Seret file ke sini atau klik untuk memilih</p>
                      <p className="text-xs text-gray-300 mt-1">JPG, PNG — maks. 10MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fotoRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => setFileFoto(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
              <button
                onClick={() => { setEditingItem(null); setOpenForm(false); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.nama.trim() || !form.penyelenggara.trim() || isSubmitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-opacity flex items-center justify-center"
                style={{ background: "#263F93" }}
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : editingItem ? "Simpan Perubahan" : "Simpan Prestasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
