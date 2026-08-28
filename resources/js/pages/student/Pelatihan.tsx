import { useState, useEffect } from "react";
import { BookOpen, Plus, X, FileText, Calendar, MapPin, Building2, Tag, AlignLeft, Upload, CheckCircle, Clock } from "lucide-react";
import { api } from "@/services/api";

interface PelatihanItem {
  id: number;
  jenis: "Akademik" | "Non-Akademik";
  nama: string;
  penyelenggara: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tempat: string;
  deskripsi: string;
  status: "Disetujui" | "Menunggu" | "Ditolak";
  sertifikat?: string;
  fotoKegiatan?: string;
}


const emptyForm = {
  jenis: "Akademik" as "Akademik" | "Non-Akademik",
  nama: "",
  penyelenggara: "",
  tanggalMulai: "",
  tanggalSelesai: "",
  tempat: "",
  deskripsi: "",
  sertifikat: null as File | null,
  fotoKegiatan: null as File | null,
};

function formatDate(d: string) {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function Pelatihan() {
  const [items, setItems] = useState<PelatihanItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [detail, setDetail] = useState<PelatihanItem | null>(null);
  const [fileLabel, setFileLabel] = useState("Pilih file PDF / gambar");
  const [fotoLabel, setFotoLabel] = useState("Pilih file gambar");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPelatihan = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ data: PelatihanItem[] }>("/pelatihan");
      if (res && res.data && Array.isArray(res.data)) {
        setItems(res.data);
      } else if (res && Array.isArray(res.data)) {
        setItems(res.data);
      } else if (res && (res as any).data && Array.isArray((res as any).data.data)) {
        setItems((res as any).data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPelatihan();
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm(prev => ({ ...prev, sertifikat: file }));
    setFileLabel(file ? file.name : "Pilih file PDF / gambar");
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm(prev => ({ ...prev, fotoKegiatan: file }));
    setFotoLabel(file ? file.name : "Pilih file gambar");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("jenis", form.jenis);
      formData.append("nama", form.nama);
      formData.append("penyelenggara", form.penyelenggara);
      if (form.tanggalMulai) formData.append("tanggal_mulai", form.tanggalMulai);
      if (form.tanggalSelesai) formData.append("tanggal_selesai", form.tanggalSelesai);
      formData.append("tempat", form.tempat);
      if (form.deskripsi) formData.append("deskripsi", form.deskripsi);
      if (form.sertifikat) formData.append("file_sertifikat", form.sertifikat);
      if (form.fotoKegiatan) formData.append("foto_kegiatan", form.fotoKegiatan);

      await api.post("/pelatihan", formData);

      setForm({ ...emptyForm });
      setFileLabel("Pilih file PDF / gambar");
      setFotoLabel("Pilih file gambar");
      setShowForm(false);
      fetchPelatihan();
    } catch (err: any) {
      if (err.status === 422 && err.error?.errors) {
        const msgs = Object.values(err.error.errors).flat().join("\n");
        alert(msgs);
      } else if (err.status === 403) {
        alert(err.error?.message || "Data tidak dapat dimodifikasi.");
      } else {
        alert(err.message || "Terjadi kesalahan sistem saat menyimpan data.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 relative">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Pelatihan</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Catat dan ajukan pelatihan akademik maupun non-akademik yang telah Anda ikuti.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white"
          style={{ background: "#263F93" }}
        >
          <Plus size={15} /> Tambah Pelatihan
        </button>
      </div>

      {/* Cards */}
      {items.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <BookOpen size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">Belum ada pelatihan yang diajukan.</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center relative" style={{ background: "#EEF1FB" }}>
              <BookOpen size={20} style={{ color: "#263F93" }} />
              {item.fotoKegiatan && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-600 text-gray-800 text-sm">{item.nama}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-500 ${
                    item.jenis === "Akademik"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {item.jenis}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Building2 size={12} /> {item.penyelenggara}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(item.tanggalMulai)} — {formatDate(item.tanggalSelesai)}
                </span>
                {item.tempat && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {item.tempat}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-3">
              <span
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-500 ${
                  item.status === "Disetujui"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Ditolak"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.status === "Disetujui" ? <CheckCircle size={11} /> : <Clock size={11} />}
                {item.status}
              </span>
              <button
                onClick={() => setDetail(item)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-out form panel */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-600 text-gray-800">Tambah Pelatihan</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Jenis */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-2">
                  <Tag size={14} className="inline mr-1.5" />Jenis Pelatihan
                </label>
                <div className="flex gap-4">
                  {(["Akademik", "Non-Akademik"] as const).map(j => (
                    <label key={j} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="jenis"
                        value={j}
                        checked={form.jenis === j}
                        onChange={() => handleFormChange("jenis", j)}
                        className="accent-[#263F93]"
                      />
                      <span className="text-sm text-gray-700">{j}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  <BookOpen size={14} className="inline mr-1.5" />Nama Pelatihan <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  value={form.nama}
                  onChange={e => handleFormChange("nama", e.target.value)}
                  placeholder="Contoh: Workshop Machine Learning"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>

              {/* Penyelenggara */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  <Building2 size={14} className="inline mr-1.5" />Penyelenggara <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  value={form.penyelenggara}
                  onChange={e => handleFormChange("penyelenggara", e.target.value)}
                  placeholder="Contoh: Dicoding Indonesia"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-1.5">
                    <Calendar size={14} className="inline mr-1.5" />Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={form.tanggalMulai}
                    onChange={e => handleFormChange("tanggalMulai", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-1.5">
                    <Calendar size={14} className="inline mr-1.5" />Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={form.tanggalSelesai}
                    onChange={e => handleFormChange("tanggalSelesai", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                  />
                </div>
              </div>

              {/* Tempat */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  <MapPin size={14} className="inline mr-1.5" />Tempat
                </label>
                <input
                  value={form.tempat}
                  onChange={e => handleFormChange("tempat", e.target.value)}
                  placeholder="Contoh: Online (Zoom) / Nama Kota"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  <AlignLeft size={14} className="inline mr-1.5" />Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={form.deskripsi}
                  onChange={e => handleFormChange("deskripsi", e.target.value)}
                  placeholder="Ceritakan singkat tentang pelatihan ini..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 resize-none"
                />
              </div>

              {/* Upload Sertifikat */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  <Upload size={14} className="inline mr-1.5" />Upload Sertifikat
                </label>
                <label className="flex items-center gap-3 px-3 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#263F93]/40 hover:bg-[#EEF1FB]/30 transition-colors">
                  <FileText size={18} className="text-gray-300 flex-shrink-0" />
                  <span className="text-xs text-gray-500 truncate">{fileLabel}</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-1">Format: PDF, JPG, PNG. Maks 5 MB.</p>
              </div>

              {/* Upload Foto Kegiatan */}
              <div>
                <label className="block text-sm font-500 text-gray-700 mb-1.5">
                  <Upload size={14} className="inline mr-1.5" />Foto Saat Kegiatan
                </label>
                <label className="flex items-center gap-3 px-3 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#263F93]/40 hover:bg-[#EEF1FB]/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 flex-shrink-0"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                  <span className="text-xs text-gray-500 truncate">{fotoLabel}</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFotoChange}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG. Maks 5 MB.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-sm font-600 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#263F93" }}
                >
                  {isSubmitting ? "Mengajukan..." : "Ajukan Pelatihan"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-600 text-gray-800 text-sm truncate pr-4">Detail Pelatihan</h3>
              <button onClick={() => setDetail(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto p-5 space-y-4">
              {/* Status + Jenis badges */}
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-500 ${
                    detail.status === "Disetujui" ? "bg-green-100 text-green-700" : detail.status === "Ditolak" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {detail.status === "Disetujui" ? <CheckCircle size={11} /> : <Clock size={11} />}
                  {detail.status}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-500 ${
                    detail.jenis === "Akademik" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {detail.jenis}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <DetailRow icon={<BookOpen size={14} />} label="Nama Pelatihan" value={detail.nama} />
                <DetailRow icon={<Building2 size={14} />} label="Penyelenggara" value={detail.penyelenggara} />
                <DetailRow icon={<Calendar size={14} />} label="Tanggal Mulai" value={formatDate(detail.tanggalMulai)} />
                <DetailRow icon={<Calendar size={14} />} label="Tanggal Selesai" value={formatDate(detail.tanggalSelesai)} />
                <DetailRow icon={<MapPin size={14} />} label="Tempat" value={detail.tempat || "-"} />
                {detail.deskripsi && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <AlignLeft size={14} />
                      <span className="text-xs font-500 uppercase tracking-wide">Deskripsi</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed pl-6">{detail.deskripsi}</p>
                  </div>
                )}
              </div>

              {/* File preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center gap-2 text-center">
                  {detail.sertifikat ? (
                    <>
                      <FileText size={36} className="text-gray-300" />
                      <p className="text-xs font-500 text-gray-500 max-w-full truncate px-2">{detail.sertifikat.split('/').pop()}</p>
                      <p className="text-xs text-gray-400">Pratinjau dokumen tidak tersedia. Gunakan tombol Unduh.</p>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl">📎</span>
                      <p className="text-xs text-gray-400">Belum ada sertifikat yang diunggah.</p>
                    </>
                  )}
                </div>
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden">
                  {detail.fotoKegiatan ? (
                    <img src={detail.fotoKegiatan} alt="Foto Kegiatan" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="text-3xl">📷</span>
                      <p className="text-xs text-gray-400">Belum ada foto kegiatan.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                {detail.sertifikat && (
                  <button onClick={() => window.open(detail.sertifikat, '_blank')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                    <FileText size={14} /> Unduh
                  </button>
                )}
                <button
                  onClick={() => setDetail(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm text-white font-500"
                  style={{ background: "#263F93" }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <div className="flex-shrink-0 mt-0.5 text-gray-400">{icon}</div>
      <div>
        <div className="text-xs text-gray-400 font-500 uppercase tracking-wide">{label}</div>
        <div className="text-gray-700">{value}</div>
      </div>
    </div>
  );
}
