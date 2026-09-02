import { useState, useEffect } from "react";
import { Download, Search, Filter, Folder, FileText, ChevronDown, ChevronRight, X, ExternalLink, Calendar, CheckCircle, Upload, Eye, Building2, MapPin, Tag, User, AlignLeft, ClipboardList, BarChart, Trophy, Landmark, GraduationCap, Image as ImageIcon, Award, Loader, ChevronUp } from "lucide-react";
import { api } from "@/services/api";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";

export interface FileItem {
  id: string;
  source?: string;
  nama: string;
  kategori: string;
  tanggal: string;
  tipe: "pdf" | "img";
  file_url?: string;
  status?: string;
  // Prestasi
  tingkat?: string;
  namaKejuaraan?: string;
  penyelenggara?: string;
  pencapaian?: string;
  link?: string;
  // Organisasi
  namaOrganisasi?: string;
  jabatan?: string;
  periode?: string;
  // Pelatihan
  namaPelatihan?: string;
  // Common / Shared
  jenis?: string;
  tempat?: string;
  deskripsi?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  tahunAjaran?: string;
}


const CATEGORIES = [
  "SK Penetapan KIP-K",
  "Kartu Hasil Studi",
  "Sertifikat Prestasi",
  "Bukti Keaktifan Organisasi",
  "Sertifikat Pelatihan",
  "Dokumen Kewajiban",
  "Surat Surat Penyelesaian",
];

const catIcons: Record<string, React.ReactNode> = {
  "SK Penetapan KIP-K": <ClipboardList size={20} className="text-blue-500" />,
  "Kartu Hasil Studi": <BarChart size={20} className="text-green-500" />,
  "Sertifikat Prestasi": <Trophy size={20} className="text-yellow-500" />,
  "Bukti Keaktifan Organisasi": <Landmark size={20} className="text-indigo-500" />,
  "Sertifikat Pelatihan": <GraduationCap size={20} className="text-purple-500" />,
  "Dokumen Kewajiban": <Folder size={20} className="text-orange-500" />,
  "Surat Surat Penyelesaian": <CheckCircle size={20} className="text-teal-500" />,
};

function FileThumbnail({ tipe, nama }: { tipe: "pdf" | "img"; nama: string }) {
  if (tipe === "img") {
    return (
      <div className="w-full h-28 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
        <ImageIcon size={32} className="text-blue-400" />
      </div>
    );
  }
  return (
    <div className="w-full h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center gap-1">
      <FileText size={28} className="text-gray-300" />
      <span className="text-xs text-gray-400 font-500">PDF</span>
    </div>
  );
}

function FileCard({ file, onPreview }: { file: FileItem; onPreview: (f: FileItem) => void }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="cursor-pointer" onClick={() => onPreview(file)}>
        <FileThumbnail tipe={file.tipe} nama={file.nama} />
      </div>
      <div className="mt-2.5">
        <p className="text-xs font-500 text-gray-700 leading-snug line-clamp-2">{file.nama}</p>
        <p className="text-xs text-gray-400 mt-0.5">{file.tanggal}</p>
        <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700 font-500"><CheckCircle size={12} /> Disetujui</span>
      </div>
      <div className="flex gap-1.5 mt-2.5">
        <button onClick={() => onPreview(file)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
          <Eye size={11} /> Lihat
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
          <Download size={11} /> Unduh
        </button>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <div className="flex-shrink-0 mt-0.5 text-gray-400">{icon}</div>
      <div>
        <div className="text-xs text-gray-400 font-500 uppercase tracking-wide">{label}</div>
        <div className="text-gray-700 text-sm">{value}</div>
      </div>
    </div>
  );
}

function FilePlaceholderCard({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText size={14} className="text-gray-500" />
        </div>
        <span className="text-sm text-gray-700 font-500">{label}</span>
      </div>
      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-500 text-[#263F93] border border-[#263F93]/30 rounded-lg hover:bg-[#263F93]/5 transition-colors">
        <Download size={12} />
        Unduh
      </button>
    </div>
  );
}

function PreviewModal({ preview, onClose }: { preview: FileItem; onClose: () => void }) {
  const isOrganisasi = preview.kategori === "Bukti Keaktifan Organisasi";
  const isPrestasi = preview.kategori === "Sertifikat Prestasi";
  const isPelatihan = preview.kategori === "Sertifikat Pelatihan";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-600 text-gray-800 text-sm truncate pr-4">{preview.nama}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4">
          {/* Common fields */}
          <div className="space-y-3">
            <DetailRow icon={<FileText size={14} />} label="Nama File" value={preview.nama} />
            <DetailRow icon={<Tag size={14} />} label="Kategori" value={preview.kategori} />
            <DetailRow icon={<Calendar size={14} />} label="Tanggal Upload" value={preview.tanggal} />
            <div className="flex gap-2">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-500 bg-green-100 text-green-700">
                <CheckCircle size={14} /> {preview.status || "Disetujui"}
              </span>
            </div>
          </div>

          {/* Prestasi detail */}
          {isPrestasi && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide">Detail Prestasi</p>
              {preview.tingkat && (
                <DetailRow icon={<Tag size={14} />} label="Kategori Tingkat" value={preview.tingkat} />
              )}
              {(preview.namaKejuaraan || preview.nama) && (
                <DetailRow icon={<Trophy size={14} />} label="Nama Prestasi / Penghargaan" value={preview.namaKejuaraan || preview.nama} />
              )}
              {preview.penyelenggara && (
                <DetailRow icon={<Building2 size={14} />} label="Penyelenggara" value={preview.penyelenggara} />
              )}
              {preview.pencapaian && (
                <DetailRow icon={<Award size={14} />} label="Pencapaian / Juara ke-" value={preview.pencapaian} />
              )}
              {(preview.tanggalMulai || preview.tanggalSelesai) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preview.tanggalMulai && (
                    <DetailRow icon={<Calendar size={14} />} label="Tanggal Mulai" value={preview.tanggalMulai} />
                  )}
                  {preview.tanggalSelesai && (
                    <DetailRow icon={<Calendar size={14} />} label="Tanggal Selesai" value={preview.tanggalSelesai} />
                  )}
                </div>
              )}
              {preview.tempat && (
                <DetailRow icon={<MapPin size={14} />} label="Tempat Pelaksanaan" value={preview.tempat} />
              )}
              {preview.deskripsi && (
                <div className="flex gap-2">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><AlignLeft size={14} /></div>
                  <div>
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Deskripsi</div>
                    <p className="text-gray-700 text-sm leading-relaxed">{preview.deskripsi}</p>
                  </div>
                </div>
              )}
              {preview.link && (
                <div className="flex gap-2">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><ExternalLink size={14} /></div>
                  <div>
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Link Penyelenggara</div>
                    <a href={preview.link} target="_blank" rel="noreferrer" className="text-[#263F93] hover:underline text-sm break-all inline-flex items-center gap-1">
                      {preview.link}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Organisasi detail */}
          {isOrganisasi && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide">Detail Organisasi</p>
              {preview.namaOrganisasi && (
                <DetailRow icon={<Building2 size={14} />} label="Nama Organisasi / Kegiatan" value={preview.namaOrganisasi} />
              )}
              {preview.jabatan && (
                <DetailRow icon={<User size={14} />} label="Jabatan / Peran" value={preview.jabatan} />
              )}
              {preview.jenis && (
                <div className="flex gap-2">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><Tag size={14} /></div>
                  <div>
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Jenis</div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-500 ${
                      preview.jenis === "Organisasi" ? "bg-blue-100 text-blue-700" :
                      preview.jenis === "Kepanitiaan" ? "bg-purple-100 text-purple-700" :
                      "bg-teal-100 text-teal-700"
                    }`}>
                      {preview.jenis}
                    </span>
                  </div>
                </div>
              )}
              {(preview.tanggalMulai || preview.tanggalSelesai) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preview.tanggalMulai && (
                    <DetailRow icon={<Calendar size={14} />} label="Periode Mulai" value={preview.tanggalMulai} />
                  )}
                  {preview.tanggalSelesai && (
                    <DetailRow icon={<Calendar size={14} />} label="Periode Selesai" value={preview.tanggalSelesai} />
                  )}
                </div>
              ) : preview.periode ? (
                <DetailRow icon={<Calendar size={14} />} label="Periode" value={preview.periode} />
              ) : null}
              {preview.deskripsi && (
                <div className="flex gap-2">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><AlignLeft size={14} /></div>
                  <div>
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Deskripsi</div>
                    <p className="text-gray-700 text-sm leading-relaxed">{preview.deskripsi}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pelatihan detail */}
          {isPelatihan && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide">Detail Pelatihan</p>
              {(preview.namaPelatihan || preview.namaKejuaraan || preview.nama) && (
                <DetailRow icon={<GraduationCap size={14} />} label="Nama Pelatihan" value={preview.namaPelatihan || preview.namaKejuaraan || preview.nama} />
              )}
              {preview.jenis && (
                <div className="flex gap-2">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><Tag size={14} /></div>
                  <div>
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Jenis</div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-500 ${
                      preview.jenis === "Akademik" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      {preview.jenis}
                    </span>
                  </div>
                </div>
              )}
              {preview.penyelenggara && (
                <DetailRow icon={<Building2 size={14} />} label="Penyelenggara" value={preview.penyelenggara} />
              )}
              {(preview.tanggalMulai || preview.tanggalSelesai) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preview.tanggalMulai && (
                    <DetailRow icon={<Calendar size={14} />} label="Tanggal Mulai" value={preview.tanggalMulai} />
                  )}
                  {preview.tanggalSelesai && (
                    <DetailRow icon={<Calendar size={14} />} label="Tanggal Selesai" value={preview.tanggalSelesai} />
                  )}
                </div>
              )}
              {preview.tempat && (
                <DetailRow icon={<MapPin size={14} />} label="Tempat Pelaksanaan" value={preview.tempat} />
              )}
              {preview.deskripsi && (
                <div className="flex gap-2">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><AlignLeft size={14} /></div>
                  <div>
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Deskripsi</div>
                    <p className="text-gray-700 text-sm leading-relaxed">{preview.deskripsi}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            {preview.file_url && (
              <button 
                onClick={() => window.open(preview.file_url, '_blank')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Download size={14} /> Unduh Dokumen Utama
              </button>
            )}
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white font-500" style={{ background: "#263F93" }}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatTA = (ta: string) => ta ? ta.replace("Tahun ", "").replace("-1", " Ganjil").replace("-2", " Genap") : "2025/2026 Ganjil";

export default function ArsipDigital() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Semua");
  const [filterTahunAjaran, setFilterTahunAjaran] = useState(getCurrentTahunAjaran());
  const [preview, setPreview] = useState<FileItem | null>(null);

  const [data, setData] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<any>("/arsip")
      .then(res => {
        setData(res.data || []);
      })
      .catch(err => {
        console.error("Gagal memuat arsip", err);
        setError("Gagal memuat data arsip. Silakan coba lagi.");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (cat: string) => setCollapsed(p => ({ ...p, [cat]: !p[cat] }));

  const filtered = data.filter(f => {
    const matchSearch = f.nama.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Semua" || f.kategori === filterCat;
    const matchTa = (f.tahunAjaran || "2025/2026 Ganjil") === formatTA(filterTahunAjaran);
    return matchSearch && matchCat && matchTa;
  });

  const grouped = CATEGORIES.map(cat => ({
    cat,
    items: filtered.filter(f => f.kategori === cat),
  })).filter(g => g.items.length > 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Arsip Digital Saya</h1>
          <p className="text-gray-500 text-sm mt-0.5">Semua dokumen Anda tersimpan aman di sini. Gunakan arsip ini untuk persiapan sidang dan SKPI.</p>
        </div>
        <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white"
          style={{ background: "#263F93" }}>
          <Download size={15} /> Download Semua
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari dokumen..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20" />
        </div>
        <TahunAjaranFilter value={filterTahunAjaran} onChange={setFilterTahunAjaran} />
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none appearance-none">
            <option value="Semua">Semua Kategori</option>
            <option value="SK Penetapan KIP-K">SK Penetapan KIP-K</option>
            <option value="Kartu Hasil Studi">Kartu Hasil Studi</option>
            <option value="Sertifikat Prestasi">Sertifikat Prestasi</option>
            <option value="Bukti Keaktifan Organisasi">Bukti Keaktifan Organisasi</option>
            <option value="Sertifikat Pelatihan">Sertifikat Pelatihan</option>
            <option value="Dokumen Kewajiban">Dokumen Kewajiban</option>
            <option value="Surat Surat Penyelesaian">Surat Surat Penyelesaian</option>
          </select>
        </div>
      </div>

      {/* Category sections */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm space-y-3">
          <Loader size={24} className="text-[#263F93] animate-spin" />
          <p className="text-sm text-gray-500">Memuat arsip digital...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center text-red-600 text-sm font-500">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
        {grouped.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm">Tidak ada dokumen ditemukan.</p>
          </div>
        )}
        {grouped.map(({ cat, items }) => (
          <div key={cat} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button onClick={() => toggle(cat)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left">
              <span className="text-xl">{catIcons[cat]}</span>
              <div className="flex-1">
                <span className="font-600 text-gray-800 text-sm">{cat}</span>
                <span className="ml-2 text-xs text-gray-400">{items.length} dokumen</span>
              </div>
              {collapsed[cat] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
            </button>
            {!collapsed[cat] && (
              <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map(f => (
                  <FileCard key={f.id} file={f} onPreview={setPreview} />
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      )}

      {preview && <PreviewModal preview={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
