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
    <div className="bg-white rounded-xl p-2.5 sm:p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow min-w-0">
      <div className="cursor-pointer" onClick={() => onPreview(file)}>
        <FileThumbnail tipe={file.tipe} nama={file.nama} />
      </div>
      <div className="mt-2 min-w-0">
        <p className="text-xs font-500 text-gray-700 leading-snug line-clamp-2 break-words">{file.nama}</p>
        <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">{file.tanggal}</p>
        <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[11px] sm:text-xs bg-green-100 text-green-700 font-500 whitespace-nowrap"><CheckCircle size={12} className="flex-shrink-0" /> Disetujui</span>
      </div>
      <div className="flex gap-1.5 mt-2">
        <button onClick={() => onPreview(file)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-[11px] sm:text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap">
          <Eye size={11} /> Lihat
        </button>
        {file.file_url ? (
          <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-[11px] sm:text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap">
            <Download size={11} /> Unduh
          </a>
        ) : (
          <button disabled className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-[11px] sm:text-xs text-gray-400 cursor-not-allowed bg-gray-50 whitespace-nowrap">
            <Download size={11} /> Unduh
          </button>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-2 min-w-0">
      <div className="flex-shrink-0 mt-0.5 text-gray-400">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-gray-400 font-500 uppercase tracking-wide">{label}</div>
        <div className="text-gray-700 text-sm break-words">{value}</div>
      </div>
    </div>
  );
}

function FilePlaceholderCard({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText size={14} className="text-gray-500" />
        </div>
        <span className="text-sm text-gray-700 font-500 truncate">{label}</span>
      </div>
      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-500 text-[#263F93] border border-[#263F93]/30 rounded-lg hover:bg-[#263F93]/5 transition-colors shrink-0 whitespace-nowrap">
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
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden min-w-0">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100 flex-shrink-0 min-w-0">
          <h3 className="font-600 text-gray-800 text-sm break-words min-w-0 flex-1">{preview.nama}</h3>
          <button onClick={onClose} aria-label="Tutup pratinjau" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto p-3 sm:p-4 space-y-4 min-w-0">
              {/* Common fields */}
              <div className="space-y-3 min-w-0">
                <DetailRow icon={<FileText size={14} />} label="Nama File" value={preview.nama} />
                <DetailRow icon={<Tag size={14} />} label="Kategori" value={preview.kategori} />
                <DetailRow icon={<Calendar size={14} />} label="Tanggal Upload" value={preview.tanggal} />
                <div className="flex gap-2 min-w-0">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-500 bg-green-100 text-green-700 whitespace-nowrap">
                    <CheckCircle size={14} className="flex-shrink-0" /> {preview.status || "Disetujui"}
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
                <div className="flex gap-2 min-w-0">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><AlignLeft size={14} /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Deskripsi</div>
                    <p className="text-gray-700 text-sm leading-relaxed break-words">{preview.deskripsi}</p>
                  </div>
                </div>
              )}
              {preview.link && (
                <div className="flex gap-2 min-w-0">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><ExternalLink size={14} /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Link Penyelenggara</div>
                    <a href={preview.link} target="_blank" rel="noreferrer" className="text-[#263F93] hover:underline text-sm break-all inline-flex items-start gap-1 min-w-0">
                      <span className="break-all">{preview.link}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Organisasi detail */}
          {isOrganisasi && (
            <div className="border-t border-gray-100 pt-4 space-y-3 min-w-0">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide">Detail Organisasi</p>
              {preview.namaOrganisasi && (
                <DetailRow icon={<Building2 size={14} />} label="Nama Organisasi / Kegiatan" value={preview.namaOrganisasi} />
              )}
              {preview.jabatan && (
                <DetailRow icon={<User size={14} />} label="Jabatan / Peran" value={preview.jabatan} />
              )}
              {preview.jenis && (
                <div className="flex gap-2 min-w-0">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><Tag size={14} /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Jenis</div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-500 whitespace-nowrap ${
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
                <div className="flex gap-2 min-w-0">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><AlignLeft size={14} /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Deskripsi</div>
                    <p className="text-gray-700 text-sm leading-relaxed break-words">{preview.deskripsi}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pelatihan detail */}
          {isPelatihan && (
            <div className="border-t border-gray-100 pt-4 space-y-3 min-w-0">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide">Detail Pelatihan</p>
              {(preview.namaPelatihan || preview.namaKejuaraan || preview.nama) && (
                <DetailRow icon={<GraduationCap size={14} />} label="Nama Pelatihan" value={preview.namaPelatihan || preview.namaKejuaraan || preview.nama} />
              )}
              {preview.jenis && (
                <div className="flex gap-2 min-w-0">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><Tag size={14} /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Jenis</div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-500 whitespace-nowrap ${
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
                <div className="flex gap-2 min-w-0">
                  <div className="flex-shrink-0 mt-0.5 text-gray-400"><AlignLeft size={14} /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 font-500 uppercase tracking-wide mb-1">Deskripsi</div>
                    <p className="text-gray-700 text-sm leading-relaxed break-words">{preview.deskripsi}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-100">
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

  const fetchArsip = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: any[] }>(
        "/arsip",
        filterTahunAjaran ? { tahun_ajaran: filterTahunAjaran } : undefined
      );
      setData(res.data || []);
    } catch (err: any) {
      console.error("Gagal memuat arsip", err);
      setError("Gagal memuat data arsip. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArsip();
  }, [filterTahunAjaran]);

  const toggle = (cat: string) => setCollapsed(p => ({ ...p, [cat]: !p[cat] }));

  const filtered = data.filter(f => {
    const matchSearch = f.nama.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Semua" || f.kategori === filterCat;
    return matchSearch && matchCat;
  });

  const grouped = CATEGORIES.map(cat => ({
    cat,
    items: filtered.filter(f => f.kategori === cat),
  })).filter(g => g.items.length > 0);

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0">
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between gap-2 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="font-display font-700 text-lg sm:text-xl text-gray-900 leading-tight">Arsip Digital Saya</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5 break-words">Semua dokumen Anda tersimpan aman di sini. Gunakan arsip ini untuk persiapan sidang dan SKPI.</p>
        </div>
        <button 
          onClick={() => alert("Fitur Download Semua arsip dalam pengembangan. Silakan unduh arsip secara individu.")}
          className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white hover:opacity-90 transition-opacity w-full min-[480px]:w-auto whitespace-nowrap"
          style={{ background: "#263F93" }}>
          <Download size={15} /> Download Semua
        </button>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-2 min-w-0">
        <div className="relative col-span-1 min-[480px]:col-span-2 min-w-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari dokumen..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 min-w-0" />
        </div>
        <div className="min-w-0 [&>button]:w-full [&>button]:justify-center">
          <TahunAjaranFilter value={filterTahunAjaran} onChange={setFilterTahunAjaran} />
        </div>
        <div className="relative min-w-0">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none appearance-none truncate">
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
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-xl border border-gray-100 shadow-sm space-y-3 min-w-0">
          <Loader size={24} className="text-[#263F93] animate-spin" />
          <p className="text-xs sm:text-sm text-gray-500">Memuat arsip digital...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 sm:p-4 text-center text-red-600 text-xs sm:text-sm font-500 break-words min-w-0">
          {error}
        </div>
      ) : (
        <div className="space-y-4 min-w-0">
        {grouped.length === 0 && (
          <div className="bg-white rounded-xl p-8 sm:p-10 px-4 text-center border border-gray-100 shadow-sm min-w-0">
            <p className="text-gray-400 text-xs sm:text-sm">Tidak ada dokumen ditemukan.</p>
          </div>
        )}
        {grouped.map(({ cat, items }) => (
          <div key={cat} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
            <button onClick={() => toggle(cat)}
              className="w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3.5 sm:py-4 hover:bg-gray-50 transition-colors text-left min-w-0">
              <span className="text-xl flex-shrink-0 flex items-center">{catIcons[cat]}</span>
              <div className="flex-1 min-w-0">
                <span className="font-600 text-gray-800 text-xs sm:text-sm break-words">{cat}</span>
                <span className="ml-2 text-xs text-gray-400 whitespace-nowrap">{items.length} dokumen</span>
              </div>
              {collapsed[cat] ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />}
            </button>
            {!collapsed[cat] && (
              <div className="px-3 sm:px-5 pb-3 sm:pb-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 min-w-0">
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
