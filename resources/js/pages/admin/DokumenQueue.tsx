import { useState, useEffect } from "react";
import { FileCheck, Clock, CheckCircle, XCircle, Search, ChevronRight, X, Download, ZoomIn, ZoomOut, ChevronLeft, Trophy, Users, AlertCircle, BookOpen, ExternalLink, ClipboardList, BarChart, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { getDokumenQueue, approveDokumen, rejectDokumen } from "@/services/dokumenService";
import { getMahasiswaPrestasi, getMahasiswaOrganisasi, getMahasiswaPelatihan, getMahasiswaFilterOptions } from "@/services/mahasiswaService";
import { getDokumenJenisList } from "@/services/konfigurasiService";
import type { DokumenQueue as DokumenQueueType } from "@/types";

type Tab = "Semua" | "Menunggu" | "Disetujui" | "Ditolak";

type RejectionEntry = { date: string; catatan: string; reviewer: string };

const REVIEWER_NAME = "Encep Jianul Hayat, S.T., M.T.";

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

function MahasiswaSection({ doc }: { doc: DokumenQueueType }) {
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

const tingkatBadge = (tingkat: string) => {
  switch (tingkat) {
    case "Internasional": return "bg-purple-100 text-purple-700";
    case "Nasional": return "bg-blue-100 text-blue-700";
    case "Wilayah": return "bg-teal-100 text-teal-700";
    case "Institusi": return "bg-gray-100 text-gray-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

function PrestasiPreview({ doc, data }: { doc: DokumenQueueType; data: any | null }) {
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
              {data?.tingkat ? (
                <span className={`inline-block px-2 py-0.5 rounded-full font-semibold text-xs ${tingkatBadge(data.tingkat)}`}>
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
              {data?.linkPenyelenggara ? (
                <a
                  href={data.linkPenyelenggara}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                  style={{ color: "#263F93" }}
                >
                  {data.linkPenyelenggara} <ExternalLink size={11} />
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

function OrganisasiPreview({ doc, data }: { doc: DokumenQueueType; data: any | null }) {
  return (
    <div className="space-y-3">
      {/* Section 1: Data Organisasi */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <BlueHeader icon={<Users size={15} />} title="Data Organisasi" />
        <div className="p-4 grid grid-cols-2 gap-3 bg-white">
          <InfoRow
            label="Nama Organisasi"
            value={data?.nama ?? "—"}
            colSpan={2}
          />
          <InfoRow label="Jenis" value={data?.jenis ?? "—"} />
          <InfoRow label="Jabatan" value={data?.jabatan ?? "—"} />
          <InfoRow label="Periode Mulai" value={data?.mulai ?? "—"} />
          <InfoRow label="Periode Selesai" value={data?.selesai ?? "—"} />
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

function PelatihanPreview({ doc, data }: { doc: DokumenQueueType; data: any | null }) {
  const jenisColor = "bg-blue-100 text-blue-700";

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

function GenericPreview({ doc }: { doc: DokumenQueueType }) {
  return (
    <div className="space-y-3">
      {/* Section 1: Informasi Dokumen */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <BlueHeader icon={<FileCheck size={15} />} title="Informasi Dokumen" />
        <div className="p-4 grid grid-cols-2 gap-3 bg-white">
          <InfoRow label="Jenis Dokumen" value={doc.jenis} colSpan={2} />
          <InfoRow label="Tanggal Diunggah" value={formatDate(doc.tanggalUpload)} colSpan={2} />
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
  const [prodiOptions, setProdiOptions] = useState<string[]>(["Semua"]);
  const [jenisDokumenOptions, setJenisDokumenOptions] = useState<string[]>(["Semua"]);
  const [reviewing, setReviewing] = useState<DokumenQueueType | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [processed, setProcessed] = useState<Record<string, string>>({});
  const [rejectionHistory, setRejectionHistory] = useState<Record<string, RejectionEntry[]>>({});
  const [zoom, setZoom] = useState(1);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [queue, setQueue] = useState<DokumenQueueType[]>([]);
  const [fullQueue, setFullQueue] = useState<DokumenQueueType[]>([]); // all items for accurate tab counts
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [previewPrestasi, setPreviewPrestasi] = useState<any | null>(null);
  const [previewOrganisasi, setPreviewOrganisasi] = useState<any | null>(null);
  const [previewPelatihan, setPreviewPelatihan] = useState<any | null>(null);

  // Load filter options from BE
  useEffect(() => {
    let active = true;
    getMahasiswaFilterOptions()
      .then((opts) => {
        if (!active) return;
        setProdiOptions(["Semua", ...opts.prodis.map((p) => p.nama)]);
      })
      .catch(() => {});
    getDokumenJenisList()
      .then((list) => {
        if (!active) return;
        setJenisDokumenOptions(["Semua", ...list.map((d) => d.nama)]);
      })
      .catch(() => {});
    return () => { active = false };
  }, []);

  // Load all items (no status filter) for accurate tab counts
  useEffect(() => {
    let active = true;
    getDokumenQueue({
      page: 1,
      limit: 9999,
      search: search || undefined,
      jenis: jenis !== "Semua" ? jenis : undefined,
    })
      .then((res) => { if (active) setFullQueue(res.data); })
      .catch(() => {});
    return () => { active = false };
  }, [search, jenis]);

  // Load paginated queue for display
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const statusParam = tab !== "Semua" ? tab : undefined;
    getDokumenQueue({
      page: currentPage,
      limit: 10,
      search: search || undefined,
      status: statusParam as any,
      jenis: jenis !== "Semua" ? jenis : undefined,
    })
      .then((res) => {
        if (!active) return;
        setQueue(res.data);
        setTotalItems(res.total);
        setTotalPages(res.totalPages ?? 1);
      })
      .catch((err) => { if (active) setError(err?.message ?? "Gagal memuat antrian dokumen"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false };
  }, [currentPage, tab, search, jenis]);
  // Reset page when tab/search/jenis changes
  const handleTabChange = (t: Tab) => {
    setTab(t);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleJenisChange = (val: string) => {
    setJenis(val);
    setCurrentPage(1);
  };

  // Load preview data when reviewing changes
  useEffect(() => {
    if (!reviewing) {
      setPreviewPrestasi(null);
      setPreviewOrganisasi(null);
      setPreviewPelatihan(null);
      return;
    }
    const mhsId = reviewing.mahasiswas_id;
    if (!mhsId) return;

    const idPrefix = String(reviewing.id);
    if (idPrefix.startsWith("prestasi_")) {
      const itemId = Number(idPrefix.replace("prestasi_", ""));
      getMahasiswaPrestasi(mhsId)
        .then((list) => setPreviewPrestasi(list.find((p: any) => p.id === itemId) || null));
    } else if (idPrefix.startsWith("organisasi_")) {
      const itemId = Number(idPrefix.replace("organisasi_", ""));
      getMahasiswaOrganisasi(mhsId)
        .then((list) => setPreviewOrganisasi(list.find((o: any) => o.id === itemId) || null));
    } else if (idPrefix.startsWith("pelatihan_")) {
      const itemId = Number(idPrefix.replace("pelatihan_", ""));
      getMahasiswaPelatihan(mhsId)
        .then((list) => setPreviewPelatihan(list.find((p: any) => p.id === itemId) || null));
    }
  }, [reviewing]);

  const getStatus = (d: DokumenQueueType) => processed[String(d.id)] || d.status;

  const filtered = queue.filter(d => {
    const q = search.toLowerCase();
    const status = getStatus(d);
    return (
      (tab === "Semua" || (tab === "Menunggu" ? status === "Menunggu" : tab === "Disetujui" ? status === "Disetujui" : status === "Ditolak")) &&
      (jenis === "Semua" || d.jenis.toLowerCase().includes(jenis.toLowerCase())) &&
      (prodi === "Semua" || d.prodi === prodi) &&
      (d.nama.toLowerCase().includes(q) || d.nim.toLowerCase().includes(q))
    );
  });

  // For pagination display — use server-returned totals
  const startItem = totalItems > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endItem = Math.min(currentPage * 10, totalItems);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  const counts: Record<Tab, number> = {
    Semua: fullQueue.length,
    Menunggu: fullQueue.filter(d => (processed[String(d.id)] || d.status) === "Menunggu").length,
    Disetujui: fullQueue.filter(d => (processed[String(d.id)] || d.status) === "Disetujui").length,
    Ditolak: fullQueue.filter(d => (processed[String(d.id)] || d.status) === "Ditolak").length,
  };

  const openReview = (d: DokumenQueueType) => {
    const idx = filtered.indexOf(d);
    setReviewIdx(idx);
    setReviewing(d);
    setShowReject(false);
    setRejectNote("");
    setActionError("");
    setZoom(1);
  };

  const navigateReview = (dir: -1 | 1) => {
    const next = filtered[reviewIdx + dir];
    if (next) { setReviewIdx(reviewIdx + dir); setReviewing(next); setShowReject(false); setActionError(""); setZoom(1); }
  };

  async function handleApprove() {
    if (!reviewing) return;
    setActionBusy(true);
    setActionError("");
    try {
      await approveDokumen(String(reviewing.id));
      setProcessed(p => ({ ...p, [String(reviewing.id)]: "Disetujui" }));
      const next = filtered[reviewIdx + 1];
      if (next && getStatus(next) === "Menunggu") { setReviewIdx(reviewIdx + 1); setReviewing(next); setShowReject(false); setZoom(1); }
      else setReviewing(null);
    } catch (e: any) {
      setActionError(e?.message ?? "Gagal menyetujui dokumen");
    } finally {
      setActionBusy(false);
    }
  }

  async function handleReject() {
    if (!reviewing) return;
    setActionBusy(true);
    setActionError("");
    try {
      await rejectDokumen(String(reviewing.id), rejectNote.trim() || "Dokumen tidak terbaca dengan jelas");
      const now = new Date().toISOString();
      const entry: RejectionEntry = {
        date: now,
        catatan: rejectNote.trim() || "Dokumen tidak terbaca dengan jelas",
        reviewer: REVIEWER_NAME,
      };
      setRejectionHistory(h => ({
        ...h,
        [String(reviewing.id)]: [...(h[String(reviewing.id)] || []), entry],
      }));
      setProcessed(p => ({ ...p, [String(reviewing.id)]: "Ditolak" }));
      setShowReject(false);
      setRejectNote("");
    } catch (e: any) {
      setActionError(e?.message ?? "Gagal menolak dokumen");
    } finally {
      setActionBusy(false);
    }
  }

  const openRejectPanel = () => {
    if (!reviewing) return;
    setActionError("");
    const currentStatus = getStatus(reviewing);
    if (currentStatus === "Ditolak") {
      const history = rejectionHistory[String(reviewing.id)];
      const lastEntry = history && history.length > 0 ? history[history.length - 1] : null;
      setRejectNote(lastEntry ? lastEntry.catatan : "");
    } else {
      setRejectNote("");
    }
    setShowReject(true);
  };

  const currentStatus = reviewing ? getStatus(reviewing) : null;
  const docHistory = reviewing ? (rejectionHistory[String(reviewing.id)] || []) : [];
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
          <button key={t} onClick={() => handleTabChange(t)}
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
            <input value={search} onChange={e => handleSearchChange(e.target.value)} placeholder="Cari NIM atau Nama..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20" />
          </div>
          <select value={jenis} onChange={e => handleJenisChange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600">
            {jenisDokumenOptions.map(j => <option key={j}>{j}</option>)}
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
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-500">{(d.prodi || "").replace("Teknik ", "T.")}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{d.nama} · {d.nim}</div>
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
          <span>Menampilkan {filtered.length > 0 ? `${startItem}–${endItem}` : 0} dari {totalItems} dokumen</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
            >‹</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) {
                p = i + 1;
              } else if (currentPage <= 3) {
                p = i + 1;
              } else if (currentPage >= totalPages - 2) {
                p = totalPages - 4 + i;
              } else {
                p = currentPage - 2 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-2 py-1 rounded border text-xs ${
                    p === currentPage
                      ? "border-[#263F93] bg-[#263F93] text-white"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >{p}</button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
            >›</button>
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
                <p className="text-xs text-gray-400 mt-0.5">{reviewing.nama} · {reviewing.nim}</p>
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
                <PrestasiPreview doc={reviewing} data={previewPrestasi} />
              ) : isOrganisasi(reviewing.jenis) ? (
                <OrganisasiPreview doc={reviewing} data={previewOrganisasi} />
              ) : isPelatihan(reviewing.jenis) ? (
                <PelatihanPreview doc={reviewing} data={previewPelatihan} />
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
              {actionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  {actionError}
                </div>
              )}
              {!showReject ? (
                <>
                  <button onClick={handleApprove} disabled={actionBusy}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-500 text-white text-sm transition-colors disabled:opacity-60"
                    style={{ background: "#059669" }}>
                    {actionBusy ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    {currentStatus === "Disetujui" ? "Sudah Disetujui (Ubah ke Tolak)" : "Setujui Dokumen"}
                  </button>
                  <button onClick={openRejectPanel} disabled={actionBusy}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-500 text-sm border transition-colors hover:bg-red-50 disabled:opacity-60"
                    style={{ borderColor: "#FECACA", color: "#DC2626" }}>
                    {actionBusy ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                    {currentStatus === "Ditolak" ? "Tambah Catatan Penolakan" : "Tolak / Revisi"}
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
                  <button onClick={handleReject} disabled={!rejectNote.trim() || actionBusy} className="w-full py-3 rounded-xl font-500 text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: "#DC2626" }}>
                    {actionBusy ? <Loader2 size={16} className="animate-spin" /> : null}
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
