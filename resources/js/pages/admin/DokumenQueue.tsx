import { useState } from "react";
import { FileCheck, Clock, CheckCircle, XCircle, Search, ChevronRight, X, Download, ZoomIn, ZoomOut, ChevronLeft, Trophy, Users, AlertCircle, BookOpen, ExternalLink, ClipboardList, BarChart, FileText, Image as ImageIcon } from "lucide-react";
import { dokumenQueue as _dokumenQueue } from "../../data/mockData";

// Override mock data with corrected document names + add Pelatihan entry
const dokumenQueue = [
  ..._dokumenQueue.map(d => {
    if (d.jenis === "Sertifikat KKN") return { ...d, jenis: "Sertifikat PKKMB" };
    if (d.jenis === "Bukti Keaktifan Organisasi") return { ...d, jenis: "SK Organisasi" };
    if (d.jenis === "Sertifikat Prestasi Nasional") return { ...d, jenis: "Sertifikat Prestasi" };
    if (d.jenis === "Laporan Kerja Praktik") return { ...d, jenis: "Berita Acara Kerja Praktik" };
    return d;
  }),
  {
    id: 20,
    jenis: "Sertifikat Pelatihan",
    nama: "Ahmad Rifaldi",
    nim: "2206001",
    prodi: "Teknik Informatika",
    status: "Menunggu",
    tanggalUpload: "2026-08-17",
  },
];

type Tab = "Semua" | "Menunggu" | "Disetujui" | "Ditolak";

type RejectionEntry = { date: string; catatan: string; reviewer: string };

const REVIEWER_NAME = "Encep Jianul Hayat, S.T., M.T.";

// Mock prestasi data keyed by doc id
const mockPrestasiData: Record<number, {
  namaPrestasi: string;
  tingkat: string;
  penyelenggara: string;
  pencapaian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tempat: string;
  deskripsi: string;
  link: string;
  fotoSerti?: string;
  fotoPodium?: string;
}> = {
  5: {
    namaPrestasi: "Olimpiade Teknologi Informasi Nasional 2025",
    tingkat: "Nasional",
    penyelenggara: "Kemendikbudristek",
    pencapaian: "Juara 2",
    tanggalMulai: "5 Januari 2025",
    tanggalSelesai: "7 Januari 2025",
    tempat: "Jakarta",
    deskripsi: "Kompetisi teknologi informasi tingkat nasional yang diselenggarakan oleh Kemendikbudristek, diikuti 150 tim dari 80 perguruan tinggi seluruh Indonesia.",
    link: "https://kemendikbud.go.id/olimpiade-ti-2025",
    fotoSerti: "sertifikat-olim.pdf",
    fotoPodium: "podium-juara2.jpg",
  },
};

// Mock organisasi data keyed by doc id
const mockOrganisasiData: Record<number, {
  organisasi: string;
  jenis: string;
  jabatan: string;
  periodeMulai: string;
  periodeSelesai: string;
  deskripsi: string;
  skPengurus?: string;
  fotoDokumentasi?: string;
}> = {
  3: {
    organisasi: "Himpunan Mahasiswa Teknik Informatika (HMTI)",
    jenis: "Organisasi",
    jabatan: "Sekretaris Umum",
    periodeMulai: "September 2025",
    periodeSelesai: "September 2026",
    deskripsi: "Bertanggung jawab atas dokumentasi dan administrasi himpunan, koordinasi dengan departemen lain, dan pengelolaan arsip surat-menyurat.",
    skPengurus: "sk-hmti-2025.pdf",
    fotoDokumentasi: "rapat-hmti.jpg",
  },
};

// Mock pelatihan data keyed by doc id
const mockPelatihanData: Record<number, {
  namaPelatihan: string;
  jenis: string;
  penyelenggara: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tempat: string;
  deskripsi: string;
  sertifikat?: string;
  fotoKegiatan?: string;
}> = {
  20: {
    namaPelatihan: "Pelatihan Machine Learning Dasar",
    jenis: "Akademik",
    penyelenggara: "Google Developer Student Clubs ITG",
    tanggalMulai: "10 Agustus 2026",
    tanggalSelesai: "12 Agustus 2026",
    tempat: "Garut",
    deskripsi: "Pelatihan pengenalan machine learning menggunakan Python dan TensorFlow untuk mahasiswa tingkat 3 ke atas.",
    sertifikat: "serti-ml.pdf",
    fotoKegiatan: "pelatihan-ml.jpg",
  },
};

const jenisDokumen = [
  "Semua",
  "Sertifikat PKKMB",
  "Sertifikat Bela Negara",
  "Sertifikat MABIM",
  "Berita Acara Kerja Praktik",
  "Sertifikasi",
  "Bukti Sidang Skripsi",
  "Sertifikat Prestasi",
  "SK Organisasi",
  "Sertifikat Pelatihan",
];
const prodiOptions = ["Semua", "Teknik Informatika", "Teknik Industri", "Teknik Sipil", "Arsitektur", "Sistem Informasi"];

const typeIcon = (jenis: string, className?: string) => {
  const cn = className || "text-blue-600";
  if (jenis.includes("MABIM") || jenis.includes("Bela")) return <ClipboardList size={24} className={cn} />;
  if (jenis.includes("PKKMB")) return <ClipboardList size={24} className={cn} />;
  if (jenis.includes("Prestasi")) return <Trophy size={24} className={cn} />;
  if (jenis.includes("Organisasi") || jenis === "SK Organisasi") return <Users size={24} className={cn} />;
  if (jenis.includes("Kerja Praktik")) return <BarChart size={24} className={cn} />;
  if (jenis.includes("Pelatihan")) return <BookOpen size={24} className={cn} />;
  return <FileText size={24} className={cn} />;
};

const relativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} hari yang lalu`;
  if (hours > 0) return `${hours} jam yang lalu`;
  return "Baru saja";
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
};

// Skeleton loader
const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
    <div className="h-8 bg-gray-200 rounded-lg w-20" />
  </div>
);

// --- Section header components ---
function BlueHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 text-white text-sm font-semibold" style={{ background: "#263F93" }}>
      {icon}
      {title}
    </div>
  );
}

function GrayHeader({ title }: { title: string }) {
  return (
    <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ background: "#F1F5F9", borderBottom: "1px solid #E2E8F0" }}>
      {title}
    </div>
  );
}

function InfoRow({ label, value, colSpan = 1 }: { label: string; value: React.ReactNode; colSpan?: number }) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <span className="text-gray-400 text-xs">{label}</span>
      <div className="font-semibold text-gray-800 text-xs mt-0.5">{value}</div>
    </div>
  );
}

function DocPlaceholderCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex-1 rounded-xl border p-4 flex flex-col items-center gap-2 text-center" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
      <div className="text-gray-400 flex items-center justify-center">{icon}</div>
      <p className="text-xs text-gray-600 font-medium">{label}</p>
      <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white mt-1" style={{ background: "#263F93" }}>
        <Download size={11} /> Unduh
      </button>
    </div>
  );
}

function MahasiswaSection({ doc }: { doc: typeof dokumenQueue[0] }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <GrayHeader title="Data Mahasiswa & Unggahan" />
      <div className="p-4 grid grid-cols-2 gap-3 bg-white">
        <InfoRow label="Nama Mahasiswa" value={doc.nama} />
        <InfoRow label="Program Studi" value={doc.prodi} />
        <InfoRow label="NIM" value={doc.nim} />
        <InfoRow label="Jenis Dokumen" value={doc.jenis} />
        <InfoRow label="Tanggal Diunggah" value={formatDate(doc.tanggalUpload)} colSpan={2} />
      </div>
    </div>
  );
}

// --- Document detail preview components ---

function PrestasiPreview({ doc }: { doc: typeof dokumenQueue[0] }) {
  const data = mockPrestasiData[doc.id];
  const tingkatColor =
    data?.tingkat === "Internasional" ? "bg-purple-100 text-purple-700" :
    data?.tingkat === "Nasional" ? "bg-blue-100 text-blue-700" :
    data?.tingkat === "Wilayah" ? "bg-orange-100 text-orange-700" :
    "bg-gray-100 text-gray-500";

  return (
    <div className="space-y-3">
      {/* Section 1: Data Prestasi */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <BlueHeader icon={<Trophy size={15} />} title="Data Prestasi" />
        <div className="p-4 grid grid-cols-2 gap-3 bg-white">
          <InfoRow
            label="Nama Prestasi / Penghargaan"
            value={data?.namaPrestasi ?? "—"}
            colSpan={2}
          />
          <div>
            <span className="text-gray-400 text-xs">Kategori Tingkat</span>
            <div className="mt-0.5">
              {data ? (
                <span className={`inline-block px-2 py-0.5 rounded-full font-semibold text-xs ${tingkatColor}`}>
                  {data.tingkat}
                </span>
              ) : (
                <span className="text-xs text-gray-400">—</span>
              )}
            </div>
          </div>
          <InfoRow label="Pencapaian / Juara" value={data?.pencapaian ?? "—"} />
          <InfoRow label="Penyelenggara" value={data?.penyelenggara ?? "—"} colSpan={2} />
          <InfoRow label="Tanggal Mulai" value={data?.tanggalMulai ?? "—"} />
          <InfoRow label="Tanggal Selesai" value={data?.tanggalSelesai ?? "—"} />
          <InfoRow label="Tempat Pelaksanaan" value={data?.tempat ?? "—"} colSpan={2} />
          <InfoRow label="Deskripsi" value={data?.deskripsi ?? "—"} colSpan={2} />
          <div className="col-span-2">
            <span className="text-gray-400 text-xs">Link Penyelenggara</span>
            <div className="mt-0.5">
              {data?.link ? (
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                  style={{ color: "#263F93" }}
                >
                  {data.link} <ExternalLink size={11} />
                </a>
              ) : (
                <span className="text-xs text-gray-400">—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Data Mahasiswa */}
      <MahasiswaSection doc={doc} />

      {/* Section 3: Bukti Dokumen */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <GrayHeader title="Bukti Dokumen" />
        <div className="p-4 flex gap-3 bg-white">
          <DocPlaceholderCard icon={<Trophy size={32} className="text-gray-400" />} label="Foto Sertifikat" />
          <DocPlaceholderCard icon={<ImageIcon size={32} className="text-gray-400" />} label="Foto Saat Podium" />
        </div>
      </div>
    </div>
  );
}

function OrganisasiPreview({ doc }: { doc: typeof dokumenQueue[0] }) {
  const data = mockOrganisasiData[doc.id];
  return (
    <div className="space-y-3">
      {/* Section 1: Data Organisasi */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <BlueHeader icon={<Users size={15} />} title="Data Organisasi" />
        <div className="p-4 grid grid-cols-2 gap-3 bg-white">
          <InfoRow
            label="Nama Organisasi"
            value={data?.organisasi ?? "Unit Kegiatan Mahasiswa (placeholder)"}
            colSpan={2}
          />
          <InfoRow label="Jenis" value={data?.jenis ?? "—"} />
          <InfoRow label="Jabatan" value={data?.jabatan ?? "—"} />
          <InfoRow label="Periode Mulai" value={data?.periodeMulai ?? "—"} />
          <InfoRow label="Periode Selesai" value={data?.periodeSelesai ?? "—"} />
          <InfoRow label="Deskripsi Kegiatan" value={data?.deskripsi ?? "—"} colSpan={2} />
        </div>
      </div>

      {/* Section 2: Data Mahasiswa */}
      <MahasiswaSection doc={doc} />

      {/* Section 3: Bukti Dokumen */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <GrayHeader title="Bukti Dokumen" />
        <div className="p-4 flex gap-3 bg-white">
          <DocPlaceholderCard icon={<FileText size={32} className="text-gray-400" />} label="Serti/SK Pengurus" />
          <DocPlaceholderCard icon={<ImageIcon size={32} className="text-gray-400" />} label="Foto Dokumentasi Kegiatan" />
        </div>
      </div>
    </div>
  );
}

function PelatihanPreview({ doc }: { doc: typeof dokumenQueue[0] }) {
  const data = mockPelatihanData[doc.id];
  const jenisColor = data?.jenis === "Akademik" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700";

  return (
    <div className="space-y-3">
      {/* Section 1: Data Pelatihan */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <BlueHeader icon={<BookOpen size={15} />} title="Data Pelatihan" />
        <div className="p-4 grid grid-cols-2 gap-3 bg-white">
          <InfoRow label="Nama Pelatihan" value={data?.namaPelatihan ?? "—"} colSpan={2} />
          <div>
            <span className="text-gray-400 text-xs">Jenis</span>
            <div className="mt-0.5">
              {data ? (
                <span className={`inline-block px-2 py-0.5 rounded-full font-semibold text-xs ${jenisColor}`}>
                  {data.jenis}
                </span>
              ) : (
                <span className="text-xs text-gray-400">—</span>
              )}
            </div>
          </div>
          <InfoRow label="Penyelenggara" value={data?.penyelenggara ?? "—"} colSpan={2} />
          <InfoRow label="Tanggal Mulai" value={data?.tanggalMulai ?? "—"} />
          <InfoRow label="Tanggal Selesai" value={data?.tanggalSelesai ?? "—"} />
          <InfoRow label="Tempat" value={data?.tempat ?? "—"} colSpan={2} />
          <InfoRow label="Deskripsi" value={data?.deskripsi ?? "—"} colSpan={2} />
        </div>
      </div>

      {/* Section 2: Data Mahasiswa */}
      <MahasiswaSection doc={doc} />

      {/* Section 3: Bukti Dokumen */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <GrayHeader title="Bukti Dokumen" />
        <div className="p-4 flex gap-3 bg-white">
          <DocPlaceholderCard icon={<FileText size={32} className="text-gray-400" />} label="Sertifikat" />
          <DocPlaceholderCard icon={<ImageIcon size={32} className="text-gray-400" />} label="Foto Saat Kegiatan" />
        </div>
      </div>
    </div>
  );
}

function GenericPreview({ doc }: { doc: typeof dokumenQueue[0] }) {
  return (
    <div className="space-y-3">
      {/* Section 1: Informasi Dokumen */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <BlueHeader icon={<FileCheck size={15} />} title="Informasi Dokumen" />
        <div className="p-4 grid grid-cols-2 gap-3 bg-white">
          <InfoRow label="Jenis Dokumen" value={doc.jenis} colSpan={2} />
          <InfoRow label="Tanggal Pelaksanaan" value="15 September 2022" />
          <InfoRow label="Tempat / Lokasi" value="Kampus ITG, Garut" />
        </div>
      </div>

      {/* Section 2: Data Mahasiswa */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <GrayHeader title="Data Mahasiswa & Unggahan" />
        <div className="p-4 grid grid-cols-2 gap-3 bg-white">
          <InfoRow label="Nama Mahasiswa" value={doc.nama} />
          <InfoRow label="Program Studi" value={doc.prodi} />
          <InfoRow label="NIM" value={doc.nim} />
          <InfoRow label="Tanggal Diunggah" value={formatDate(doc.tanggalUpload)} />
        </div>
      </div>

      {/* Section 3: Bukti Dokumen */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <GrayHeader title="Bukti Dokumen" />
        <div className="p-4 bg-white">
          <DocPlaceholderCard icon={typeIcon(doc.jenis, "text-gray-400")} label={doc.jenis} />
        </div>
      </div>
    </div>
  );
}

// --- Routing helpers ---
const isPrestasi = (jenis: string) =>
  jenis.includes("Prestasi");

const isOrganisasi = (jenis: string) =>
  jenis.includes("Organisasi") || jenis === "SK Organisasi";

const isPelatihan = (jenis: string) =>
  jenis.includes("Pelatihan");

export default function DokumenQueue() {
  const [tab, setTab] = useState<Tab>("Menunggu");
  const [search, setSearch] = useState("");
  const [jenis, setJenis] = useState("Semua");
  const [prodi, setProdi] = useState("Semua");
  const [reviewing, setReviewing] = useState<typeof dokumenQueue[0] | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [processed, setProcessed] = useState<Record<number, string>>({});
  const [rejectionHistory, setRejectionHistory] = useState<Record<number, RejectionEntry[]>>({});
  const [zoom, setZoom] = useState(1);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [loading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const getStatus = (d: typeof dokumenQueue[0]) => processed[d.id] || d.status;

  const filtered = dokumenQueue.filter(d => {
    const q = search.toLowerCase();
    const status = getStatus(d);
    return (
      (tab === "Semua" || (tab === "Menunggu" ? status === "Menunggu" : tab === "Disetujui" ? status === "Disetujui" : status === "Ditolak")) &&
      (jenis === "Semua" || d.jenis.toLowerCase().includes(jenis.toLowerCase())) &&
      (prodi === "Semua" || d.prodi === prodi) &&
      (d.nama.toLowerCase().includes(q) || d.nim.includes(q))
    );
  });

  const counts: Record<Tab, number> = {
    Semua: dokumenQueue.length,
    Menunggu: dokumenQueue.filter(d => getStatus(d) === "Menunggu").length,
    Disetujui: dokumenQueue.filter(d => getStatus(d) === "Disetujui").length,
    Ditolak: dokumenQueue.filter(d => getStatus(d) === "Ditolak").length,
  };

  const openReview = (d: typeof dokumenQueue[0]) => {
    const idx = filtered.indexOf(d);
    setReviewIdx(idx);
    setReviewing(d);
    setShowReject(false);
    setRejectNote("");
    setZoom(1);
  };

  const navigateReview = (dir: -1 | 1) => {
    const next = filtered[reviewIdx + dir];
    if (next) { setReviewIdx(reviewIdx + dir); setReviewing(next); setShowReject(false); setZoom(1); }
  };

  const handleApprove = () => {
    if (!reviewing) return;
    setProcessed(p => ({ ...p, [reviewing.id]: "Disetujui" }));
    const next = filtered[reviewIdx + 1];
    if (next && getStatus(next) === "Menunggu") { setReviewIdx(reviewIdx + 1); setReviewing(next); setShowReject(false); setZoom(1); }
    else setReviewing(null);
  };

  const handleReject = () => {
    if (!reviewing) return;
    const now = new Date().toISOString();
    const entry: RejectionEntry = {
      date: now,
      catatan: rejectNote.trim() || "Dokumen tidak terbaca dengan jelas",
      reviewer: REVIEWER_NAME,
    };
    setRejectionHistory(h => ({
      ...h,
      [reviewing.id]: [...(h[reviewing.id] || []), entry],
    }));
    setProcessed(p => ({ ...p, [reviewing.id]: "Ditolak" }));
    setShowReject(false);
    setRejectNote("");
  };

  const openRejectPanel = () => {
    if (!reviewing) return;
    const currentStatus = getStatus(reviewing);
    if (currentStatus === "Ditolak") {
      const history = rejectionHistory[reviewing.id];
      const lastEntry = history && history.length > 0 ? history[history.length - 1] : null;
      setRejectNote(lastEntry ? lastEntry.catatan : "");
    } else {
      setRejectNote("");
    }
    setShowReject(true);
  };

  const currentStatus = reviewing ? getStatus(reviewing) : null;
  const docHistory = reviewing ? (rejectionHistory[reviewing.id] || []) : [];
  const fullHistory: RejectionEntry[] = reviewing
    ? [
        ...(reviewing.status === "Ditolak" && docHistory.length === 0
          ? [{ date: reviewing.tanggalUpload, catatan: "Dokumen tidak terbaca dengan jelas", reviewer: REVIEWER_NAME }]
          : []),
        ...docHistory,
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900 flex items-center gap-3">
            Antrian Validasi Dokumen
            {counts.Menunggu > 0 && (
              <span className="text-sm px-2.5 py-1 rounded-full font-600" style={{ background: "#F5EDD4", color: "#D4A72C" }}>
                {counts.Menunggu} Menunggu
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Review dan validasi dokumen yang diunggah mahasiswa KIP-K</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {(["Semua", "Menunggu", "Disetujui", "Ditolak"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-500 transition-all flex items-center gap-2 ${
              tab === t ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
            }`}>
            {t}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-600 ${
              t === "Menunggu" ? "bg-[#F5EDD4] text-[#D4A72C]" :
              t === "Disetujui" ? "bg-green-100 text-green-700" :
              t === "Ditolak" ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-600"
            }`}>{counts[t]}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
        <button onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 text-sm text-gray-600 sm:hidden mb-2">
          <Search size={14} /> Filter & Pencarian {filterOpen ? "▲" : "▼"}
        </button>
        <div className={`flex flex-wrap gap-3 ${!filterOpen ? "hidden sm:flex" : "flex"}`}>
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari NIM atau Nama..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20" />
          </div>
          <select value={jenis} onChange={e => setJenis(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600">
            {jenisDokumen.map(j => <option key={j}>{j}</option>)}
          </select>
          <select value={prodi} onChange={e => setProdi(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600">
            {prodiOptions.map(p => <option key={p}>{p}</option>)}
          </select>
          <input type="date" className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500" placeholder="Tgl. Upload" />
        </div>
      </div>

      {/* Queue list */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4">🎉</div>
          <p className="font-display font-700 text-xl text-gray-700">Semua dokumen telah divalidasi!</p>
          <p className="text-sm text-gray-400 mt-1">Tidak ada dokumen dalam antrian saat ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => {
            const status = getStatus(d);
            return (
              <div key={d.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-blue-50 items-center justify-center flex-shrink-0">
                  {typeIcon(d.jenis)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-500 text-gray-800">{d.jenis}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-500">{d.prodi.replace("Teknik ", "T.")}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{d.nama} · {d.nim.slice(-8)}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <Clock size={10} /> Diunggah {relativeTime(d.tanggalUpload)}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {status === "Menunggu" && (
                    <span className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "#F5EDD4", color: "#D4A72C" }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D4A72C" }} /> Menunggu
                    </span>
                  )}
                  {status === "Disetujui" && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <CheckCircle size={11} /> Disetujui
                    </span>
                  )}
                  {status === "Ditolak" && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                      <XCircle size={11} /> Ditolak
                    </span>
                  )}

                  <button onClick={() => openReview(d)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-500 text-white transition-colors ${
                      status === "Menunggu" ? "" : "opacity-90"
                    }`}
                    style={{ background: status === "Menunggu" ? "#263F93" : status === "Disetujui" ? "#059669" : "#DC2626" }}>
                    {status === "Menunggu" ? "Review" : "Lihat"} <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Menampilkan {filtered.length} dari {dokumenQueue.length} dokumen</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">‹</button>
            <button className="px-2 py-1 rounded border border-[#263F93] bg-[#263F93] text-white">1</button>
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">›</button>
          </div>
        </div>
      )}

      {/* Review / View Modal */}
      {reviewing && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50 p-0">
          <div className="bg-white shadow-2xl w-full max-w-xl h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "#E2E8F0" }}>
              <div>
                <h3 className="font-600 text-gray-800 text-sm">{reviewing.jenis}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{reviewing.nama} · {reviewing.nim.slice(-8)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{reviewIdx + 1} / {filtered.length}</span>
                <button onClick={() => navigateReview(-1)} disabled={reviewIdx === 0}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => navigateReview(1)} disabled={reviewIdx === filtered.length - 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30">
                  <ChevronRight size={16} />
                </button>
                <button onClick={() => setReviewing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Status banner for already-processed */}
            {currentStatus !== "Menunggu" && (
              <div className={`flex items-center gap-2 px-5 py-2.5 text-sm font-500 flex-shrink-0 ${
                currentStatus === "Disetujui" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {currentStatus === "Disetujui" ? <CheckCircle size={15} /> : <XCircle size={15} />}
                Dokumen ini sudah {currentStatus === "Disetujui" ? "disetujui" : "ditolak"}. Anda masih bisa mengubah keputusan.
              </div>
            )}

            {/* Scrollable body */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Document detail by type */}
              {isPrestasi(reviewing.jenis) ? (
                <PrestasiPreview doc={reviewing} />
              ) : isOrganisasi(reviewing.jenis) ? (
                <OrganisasiPreview doc={reviewing} />
              ) : isPelatihan(reviewing.jenis) ? (
                <PelatihanPreview doc={reviewing} />
              ) : (
                <>
                  <GenericPreview doc={reviewing} />
                  {/* Zoom controls for generic only */}
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                      className="p-1.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: "#E2E8F0" }}>
                      <ZoomOut size={14} />
                    </button>
                    <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                      className="p-1.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: "#E2E8F0" }}>
                      <ZoomIn size={14} />
                    </button>
                    <button className="ml-2 flex items-center gap-1 text-xs hover:underline" style={{ color: "#263F93" }}>
                      <Download size={12} /> Download Asli
                    </button>
                  </div>
                </>
              )}

              {/* Rejection history */}
              {fullHistory.length > 0 && (
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#FECACA" }}>
                  <div className="flex items-center gap-2 px-4 py-3 text-sm font-600" style={{ background: "#FEF2F2", color: "#DC2626" }}>
                    <AlertCircle size={15} />
                    Riwayat Penolakan
                    <span className="ml-auto text-xs font-500 bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      {fullHistory.length}x ditolak
                    </span>
                  </div>
                  <div className="divide-y" style={{ borderColor: "#FEE2E2" }}>
                    {fullHistory.map((entry, i) => (
                      <div key={i} className="px-4 py-3 bg-white space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-600 text-gray-700">{entry.reviewer}</span>
                          <span className="text-gray-400">{formatDate(entry.date)}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{entry.catatan}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action area */}
            <div className="px-5 py-4 border-t space-y-3 flex-shrink-0" style={{ borderColor: "#E2E8F0" }}>
              {!showReject ? (
                <>
                  <button onClick={handleApprove}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-500 text-white text-sm transition-colors"
                    style={{ background: "#059669" }}>
                    <CheckCircle size={16} /> {currentStatus === "Disetujui" ? "Sudah Disetujui (Ubah ke Tolak)" : "Setujui Dokumen"}
                  </button>
                  <button onClick={openRejectPanel}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-500 text-sm border transition-colors hover:bg-red-50"
                    style={{ borderColor: "#FECACA", color: "#DC2626" }}>
                    <XCircle size={16} /> {currentStatus === "Ditolak" ? "Tambah Catatan Penolakan" : "Tolak / Revisi"}
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-500 text-gray-700 mb-1.5">
                      {currentStatus === "Ditolak" ? "Tambah Catatan" : "Catatan Penolakan"}{" "}
                      <span className="text-gray-400 font-400">(opsional)</span>
                    </label>
                    <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} rows={3}
                      placeholder="Contoh: Gambar buram, mohon upload ulang dengan resolusi lebih baik"
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none resize-none"
                      style={{ borderColor: "#E2E8F0", outline: "none" }}
                      onFocus={e => { e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.15)"; e.target.style.borderColor = "#FCA5A5"; }}
                      onBlur={e => { e.target.style.boxShadow = "none"; e.target.style.borderColor = "#E2E8F0"; }} />
                  </div>
                  <button onClick={handleReject} className="w-full py-3 rounded-xl font-500 text-white text-sm transition-opacity hover:opacity-90" style={{ background: "#DC2626" }}>
                    {currentStatus === "Ditolak" ? "Simpan Catatan Penolakan" : "Kirim Penolakan"}
                  </button>
                  <button onClick={() => setShowReject(false)} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700">Batal</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
