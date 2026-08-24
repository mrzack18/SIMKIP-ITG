import { useState } from "react";
import { Download, Eye, ChevronDown, ChevronUp, FileText, Search, Filter, X, Calendar, Building2, MapPin, Tag, User, AlignLeft, ClipboardList, BarChart, Trophy, Landmark, GraduationCap, Folder, CheckCircle, Image as ImageIcon } from "lucide-react";

interface FileItem {
  id: number;
  nama: string;
  kategori: string;
  tanggal: string;
  tipe: "pdf" | "img";
  // Prestasi
  tingkat?: string;
  namaKejuaraan?: string;
  penyelenggara?: string;
  // Organisasi
  namaOrganisasi?: string;
  jabatan?: string;
  periode?: string;
  // Pelatihan
  jenis?: string;
  tempat?: string;
  deskripsi?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
}

const FILES: FileItem[] = [
  { id: 1, nama: "SK Penetapan KIP-K 2022", kategori: "SK Penetapan KIP-K", tanggal: "1 Sep 2022", tipe: "pdf" },
  { id: 2, nama: "KHS Semester 1 — 2022/2023 Ganjil", kategori: "Kartu Hasil Studi", tanggal: "15 Jan 2023", tipe: "pdf" },
  { id: 3, nama: "KHS Semester 2 — 2022/2023 Genap", kategori: "Kartu Hasil Studi", tanggal: "20 Jun 2023", tipe: "pdf" },
  { id: 4, nama: "KHS Semester 3 — 2023/2024 Ganjil", kategori: "Kartu Hasil Studi", tanggal: "12 Jan 2024", tipe: "pdf" },
  { id: 5, nama: "KHS Semester 4 — 2023/2024 Genap", kategori: "Kartu Hasil Studi", tanggal: "18 Jun 2024", tipe: "pdf" },
  { id: 6, nama: "KHS Semester 5 — 2024/2025 Ganjil", kategori: "Kartu Hasil Studi", tanggal: "10 Jan 2025", tipe: "pdf" },
  { id: 7, nama: "KHS Semester 6 — 2024/2025 Genap", kategori: "Kartu Hasil Studi", tanggal: "15 Jun 2025", tipe: "pdf" },
  {
    id: 8,
    nama: "Sertifikat Juara 2 Lomba Coding Nasional",
    kategori: "Sertifikat Prestasi",
    tanggal: "20 Mei 2026",
    tipe: "img",
    tingkat: "Nasional",
    namaKejuaraan: "Lomba Coding Nasional 2026",
    penyelenggara: "Kemendikbudristek",
  },
  {
    id: 9,
    nama: "Sertifikat Juara 1 Hackathon ITG",
    kategori: "Sertifikat Prestasi",
    tanggal: "5 Nov 2025",
    tipe: "img",
    tingkat: "Institusi",
    namaKejuaraan: "Hackathon ITG 2025",
    penyelenggara: "Institut Teknologi Garut",
  },
  {
    id: 10,
    nama: "SK Kepengurusan BEM ITG",
    kategori: "Bukti Keaktifan Organisasi",
    tanggal: "1 Sep 2025",
    tipe: "pdf",
    namaOrganisasi: "Badan Eksekutif Mahasiswa ITG",
    jabatan: "Kepala Departemen Akademik",
    periode: "2025 — 2026",
  },
  {
    id: 11,
    nama: "SK Kepengurusan HIMA TI",
    kategori: "Bukti Keaktifan Organisasi",
    tanggal: "2 Sep 2024",
    tipe: "pdf",
    namaOrganisasi: "Himpunan Mahasiswa Teknik Informatika",
    jabatan: "Sekretaris Umum",
    periode: "2024 — 2025",
  },
  { id: 12, nama: "Sertifikat PKKMB 2022", kategori: "Dokumen Kewajiban", tanggal: "20 Sep 2022", tipe: "pdf" },
  { id: 13, nama: "Sertifikat Bela Negara 2022", kategori: "Dokumen Kewajiban", tanggal: "15 Nov 2022", tipe: "pdf" },
  {
    id: 14,
    nama: "Sertifikat Workshop Machine Learning",
    kategori: "Sertifikat Pelatihan",
    tanggal: "12 Nov 2025",
    tipe: "pdf",
    jenis: "Akademik",
    penyelenggara: "Dicoding Indonesia",
    tanggalMulai: "10 Nov 2025",
    tanggalSelesai: "12 Nov 2025",
    tempat: "Online (Zoom)",
    deskripsi: "Pelatihan intensif machine learning mencakup supervised learning, unsupervised learning, dan implementasi model menggunakan scikit-learn dan TensorFlow.",
  },
  {
    id: 15,
    nama: "Sertifikat Pelatihan Kepemimpinan Nasional Pemuda",
    kategori: "Sertifikat Pelatihan",
    tanggal: "9 Agu 2025",
    tipe: "pdf",
    jenis: "Non-Akademik",
    penyelenggara: "Kemendikbudristek",
    tanggalMulai: "5 Agu 2025",
    tanggalSelesai: "9 Agu 2025",
    tempat: "Balai Pelatihan Nasional, Jakarta",
    deskripsi: "Program pengembangan kepemimpinan bagi mahasiswa penerima beasiswa KIP-K tingkat nasional.",
  },
];

const CATEGORIES = [
  "SK Penetapan KIP-K",
  "Kartu Hasil Studi",
  "Sertifikat Prestasi",
  "Bukti Keaktifan Organisasi",
  "Sertifikat Pelatihan",
  "Dokumen Kewajiban",
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
            <DetailRow icon={<Calendar size={14} />} label="Tanggal" value={preview.tanggal} />
            <div className="flex gap-2">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-500 bg-green-100 text-green-700">
                <CheckCircle size={14} /> Disetujui
              </span>
            </div>
          </div>

          {/* Prestasi detail */}
          {isPrestasi && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide">Detail Prestasi</p>
              {preview.tingkat && <DetailRow icon={<Tag size={14} />} label="Tingkat" value={preview.tingkat} />}
              {preview.namaKejuaraan && <DetailRow icon={<FileText size={14} />} label="Nama Kejuaraan" value={preview.namaKejuaraan} />}
              {preview.penyelenggara && <DetailRow icon={<Building2 size={14} />} label="Penyelenggara" value={preview.penyelenggara} />}
              <DetailRow icon={<Calendar size={14} />} label="Tanggal" value={preview.tanggal} />
            </div>
          )}

          {/* Organisasi detail */}
          {isOrganisasi && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide">Detail Organisasi</p>
              {preview.namaOrganisasi && <DetailRow icon={<Building2 size={14} />} label="Nama Organisasi" value={preview.namaOrganisasi} />}
              {preview.jabatan && <DetailRow icon={<User size={14} />} label="Jabatan" value={preview.jabatan} />}
              {preview.periode && <DetailRow icon={<Calendar size={14} />} label="Periode" value={preview.periode} />}
            </div>
          )}

          {/* Pelatihan detail */}
          {isPelatihan && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide">Detail Pelatihan</p>
              {preview.jenis && (
                <div className="flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-500 ${preview.jenis === "Akademik" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {preview.jenis}
                  </span>
                </div>
              )}
              {preview.penyelenggara && <DetailRow icon={<Building2 size={14} />} label="Penyelenggara" value={preview.penyelenggara} />}
              {preview.tanggalMulai && <DetailRow icon={<Calendar size={14} />} label="Tanggal Mulai" value={preview.tanggalMulai} />}
              {preview.tanggalSelesai && <DetailRow icon={<Calendar size={14} />} label="Tanggal Selesai" value={preview.tanggalSelesai} />}
              {preview.tempat && <DetailRow icon={<MapPin size={14} />} label="Tempat" value={preview.tempat} />}
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

          {/* File preview placeholder */}
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center gap-2 text-center">
            {preview.tipe === "img" ? (
              <><ImageIcon size={40} className="text-blue-400" /></>
            ) : (
              <FileText size={40} className="text-gray-300" />
            )}
            <p className="text-xs text-gray-400">Pratinjau dokumen tidak tersedia. Gunakan tombol Unduh.</p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              <Download size={14} /> Unduh
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white font-500" style={{ background: "#263F93" }}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArsipDigital() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Semua");
  const [preview, setPreview] = useState<FileItem | null>(null);

  const toggle = (cat: string) => setCollapsed(p => ({ ...p, [cat]: !p[cat] }));

  const filtered = FILES.filter(f => {
    const matchSearch = f.nama.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Semua" || f.kategori === filterCat;
    return matchSearch && matchCat;
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
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none appearance-none">
            <option value="Semua">Semua Kategori</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Category sections */}
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

      {preview && <PreviewModal preview={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
