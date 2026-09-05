import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Download,
  Printer,
  BarChart,
  Folder,
  Clock,
  Loader2,
} from "lucide-react";
import logoItg from "@/imports/logo_itg.jpg";
import {
  getBebasTanggunganDetail,
  approveBebasTanggungan,
  rejectBebasTanggungan,
} from "@/services/bebasTanggunganService";
import { getKonfigurasiAll, type SignatureConfig } from "@/services/konfigurasiService";
import type { BebasTanggunganDetailResponse } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface CollapsibleSection {
  title: string;
  icon: React.ReactNode;
  ok: boolean;
  children: React.ReactNode;
}

function Section({ title, icon, ok, children }: CollapsibleSection) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`rounded-xl border overflow-hidden min-w-0 ${ok ? "border-green-200" : "border-yellow-300"}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-3.5 sm:py-4 min-w-0 ${ok ? "bg-green-50" : "bg-yellow-50"}`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="text-gray-400 flex items-center justify-center flex-shrink-0">{icon}</div>
          <span className="font-600 text-gray-800 text-xs sm:text-sm break-words text-left">{title}</span>
          {ok ? (
            <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
          ) : (
            <span className="text-[11px] sm:text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-500 whitespace-nowrap shrink-0">Perlu Perhatian</span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && <div className="p-3 sm:p-4 bg-white min-w-0">{children}</div>}
    </div>
  );
}

// FormalSurat renders a preview of the official letter
function FormalSurat({ data, signature }: { data: BebasTanggunganDetailResponse; signature: SignatureConfig | null }) {
  const { mahasiswa, permohonan, dokumen, ipkTerakhir } = data;
  const docsApproved = dokumen.filter((d) => d.status === "Disetujui");
  const sig = signature ?? {
    pengelola_nama: "Encep Jianul Hayat, S.T., M.T.",
    pengelola_nip: "197804202006041001",
    warek_nama: "Dr. Rina Kurniawati, S.E., M.Si.",
    warek_nip: "198203152008012002",
  };

  return (
    <div className="border-2 border-[#263F93] rounded-xl p-1 min-w-0">
      <div className="border border-[#263F93] rounded-lg p-3 sm:p-6 font-serif text-gray-800 text-xs leading-relaxed min-w-0">
        {/* Kop surat */}
        <div className="flex items-center gap-2.5 sm:gap-4 border-b-2 border-[#263F93] pb-3 sm:pb-4 mb-4 sm:mb-6 min-w-0">
          <img src={logoItg} alt="ITG" className="h-11 w-11 sm:h-16 sm:w-16 object-contain flex-shrink-0" />
          <div className="flex-1 text-center min-w-0">
            <p className="font-bold text-[10px] sm:text-xs leading-snug">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
            <p className="font-bold text-xs sm:text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</p>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-snug">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
            <p className="text-[10px] sm:text-xs text-gray-400 leading-snug break-words">Telp. (0262) 540895 · www.itg.ac.id · info@itg.ac.id</p>
          </div>
        </div>

        {/* Judul */}
        <div className="text-center mb-4 sm:mb-5 min-w-0">
          <p className="font-bold text-xs sm:text-sm underline uppercase tracking-wide leading-snug">
            Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K
          </p>
        </div>

        {/* Nomor surat */}
        <div className="mb-4 space-y-1 min-w-0">
          {[
            ["Nomor", permohonan.nomorSurat ?? "—"],
            ["Lampiran", "—"],
            ["Perihal", "Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[4.5rem_0.5rem_1fr] sm:grid-cols-[5rem_0.5rem_1fr] gap-x-2 text-xs min-w-0">
              <span className="text-gray-600">{k}</span>
              <span>:</span>
              <span className={`break-words min-w-0 ${k !== "Lampiran" ? "font-600" : ""}`}>{v}</span>
            </div>
          ))}
        </div>

        {/* Kepada */}
        <div className="mb-4 text-xs space-y-0.5 min-w-0">
          <p>Kepada Yth.</p>
          <p className="font-600 break-words">{mahasiswa.nama}</p>
          <p className="break-words">NIM: {mahasiswa.nim}</p>
          <p className="break-words">Program Studi {mahasiswa.prodi ?? "—"}</p>
          <p className="italic mt-1">di Tempat</p>
        </div>

        <p className="mb-3 text-xs">Dengan hormat,</p>

        <p className="text-xs leading-relaxed mb-3 text-justify">
          Yang bertanda tangan di bawah ini, Pengelola KIP-K Institut Teknologi Garut, menerangkan dengan sesungguhnya bahwa:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 mb-3 space-y-1 min-w-0">
          {[
            ["Nama", mahasiswa.nama],
            ["NIM", mahasiswa.nim],
            ["Program Studi", mahasiswa.prodi ?? "—"],
            ["Angkatan", String(mahasiswa.angkatan)],
            ["Tahun Ajaran", permohonan.tahunAjaran ?? "—"],
            ["Semester", String(mahasiswa.semester)],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[4.5rem_0.5rem_1fr] sm:grid-cols-[5rem_0.5rem_1fr] gap-x-2 text-xs min-w-0">
              <span className="text-gray-500">{k}</span>
              <span>:</span>
              <span className="font-600 break-words min-w-0">{v}</span>
            </div>
          ))}
        </div>

        <p className="text-xs leading-relaxed mb-2 text-justify">
          Telah <strong>menyelesaikan seluruh kewajiban sebagai penerima Kartu Indonesia Pintar Kuliah (KIP-K)</strong> di
          Institut Teknologi Garut, yang meliputi:
        </p>
        <ol className="list-decimal list-inside space-y-0.5 pl-2 text-xs mb-3 min-w-0">
          {docsApproved.map((d) => (
            <li key={d.jenis_id} className="break-words">
              {d.nama} — diverifikasi {d.tanggal_upload ?? "—"}
            </li>
          ))}
          <li className="break-words">Indeks Prestasi Kumulatif (IPK) {ipkTerakhir.toFixed(2)} — memenuhi standar minimum KIP-K (≥ 3,00)</li>
          <li>Tidak memiliki riwayat Surat Peringatan aktif</li>
        </ol>
        <p className="text-xs leading-relaxed text-justify">
          Demikian surat keterangan ini diterbitkan untuk dapat digunakan sebagaimana mestinya.
        </p>

        {/* TTD */}
        <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 sm:gap-6 text-[11px] sm:text-xs text-center min-w-0">
          <div className="min-w-0">
            <p className="break-words">Garut, {permohonan.tanggalTerbit ?? permohonan.tanggalAjukan ?? "—"}</p>
            <p className="mt-0.5">Pengelola KIP-K,</p>
            <div className="h-10 sm:h-14 my-1" />
            <p className="font-bold underline break-words">{sig.pengelola_nama}</p>
            <p className="text-gray-500 break-words">NIP. {sig.pengelola_nip}</p>
          </div>
          <div className="min-w-0">
            <p>Mengetahui,</p>
            <p className="mt-0.5">Wakil Rektor,</p>
            <div className="h-10 sm:h-14 my-1" />
            <p className="font-bold underline break-words">{sig.warek_nama}</p>
            <p className="text-gray-500 break-words">NIP. {sig.warek_nip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function BebasTanggunganDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const btId = id ? parseInt(id, 10) : NaN;

  const [data, setData] = useState<BebasTanggunganDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [signature, setSignature] = useState<SignatureConfig | null>(null);
  

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approveChecked, setApproveChecked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (isNaN(btId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const res = await getBebasTanggunganDetail(btId);
      setData(res);
    } catch (err: any) {
      if (err.status === 404) {
        setNotFound(true);
      } else {
        setError(err.message || "Gagal memuat detail permohonan.");
      }
    } finally {
      setLoading(false);
    }
  }, [btId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Load signature config from BE for formal letter preview
  useEffect(() => {
    getKonfigurasiAll()
      .then((res) => {
        if (res?.data?.signature) setSignature(res.data.signature);
      })
      .catch(() => { /* fallback ke default di render */ });
  }, []);

  const handleApprove = async () => {
    if (!data || isSubmitting) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      await approveBebasTanggungan(data.permohonan.id);
      await fetchDetail(); // refetch to get latest state
      setShowApprove(false);
      setApproveChecked(false);
    } catch (err: any) {
      setActionError(err.message || "Gagal menerbitkan surat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!data || isSubmitting || rejectReason.trim().length < 10) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      await rejectBebasTanggungan(data.permohonan.id, rejectReason.trim());
      await fetchDetail(); // refetch to get latest state
      setShowReject(false);
      setRejectReason("");
    } catch (err: any) {
      setActionError(err.message || "Gagal menolak permohonan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const token = localStorage.getItem("simkip_token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'}/bebas-tanggungan/${data?.permohonan.id}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/pdf",
          },
        }
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SKPS_KIP-K_${data?.mahasiswa.nim}_${data?.mahasiswa.nama}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || "Gagal mengunduh PDF.");
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm text-center">
          <Loader2 size={22} className="animate-spin flex-shrink-0" />
          <span>Memuat detail permohonan...</span>
        </div>
      </div>
    );
  }

  // ── Not Found ──
  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto w-full space-y-3 sm:space-y-4 min-w-0">
        <Link to="/admin/bebas-tanggungan" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={15} /> Surat Penyelesaian
        </Link>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-10 text-center min-w-0">
          <AlertTriangle size={32} className="mx-auto text-amber-400 mb-3" />
          <h2 className="font-600 text-gray-800 mb-1">Permohonan Tidak Ditemukan</h2>
          <p className="text-sm text-gray-500">ID permohonan tidak valid atau sudah dihapus.</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto w-full space-y-3 sm:space-y-4 min-w-0">
        <Link to="/admin/bebas-tanggungan" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={15} /> Surat Penyelesaian
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 text-center min-w-0">
          <XCircle size={28} className="mx-auto text-red-400 mb-3" />
          <p className="text-sm text-red-700 break-words">{error ?? "Terjadi kesalahan."}</p>
          <button onClick={fetchDetail} className="mt-3 text-xs text-[#263F93] underline">
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  const { permohonan, mahasiswa, checklist, dokumen, sksDitempuh, sksMinimum, ipkTerakhir, ipkMinimum, canApply, rejectionHistory } = data;
  const currentStatus = permohonan.status;

  // Dokumen helpers
  const allDocsApproved = dokumen.length > 0 && dokumen.every((d) => d.status === "Disetujui");
  const missingDocs = dokumen.filter((d) => !d.status); // null status = not uploaded
  const sksOk = sksDitempuh >= sksMinimum;
  const allChecklistOk = checklist.every((c) => c.terpenuhi);

  return (
    <div className="max-w-2xl mx-auto w-full space-y-3 sm:space-y-4 min-w-0">
      {/* Breadcrumb and Filter */}
      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-gray-500 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Link to="/admin/bebas-tanggungan" className="hover:text-gray-700 flex items-center gap-1 shrink-0">
            <ChevronLeft size={15} /> Surat Penyelesaian
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-gray-800 font-500 truncate">Review {mahasiswa.nim}</span>
        </div>
              </div>

      {/* Student card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3 sm:p-4 min-w-0">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#263F93] flex items-center justify-center text-white font-display font-700 text-lg sm:text-xl flex-shrink-0">
            {mahasiswa.nama.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 basis-40">
            <h2 className="font-display font-700 text-base sm:text-lg text-gray-900 break-words leading-tight">{mahasiswa.nama}</h2>
            <p className="text-xs sm:text-sm text-gray-500 break-words">
              {mahasiswa.nim} · {mahasiswa.prodi ?? "—"} · Angkatan {mahasiswa.angkatan}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 break-words">Tahun Ajaran: {permohonan.tahunAjaran ?? "—"} · Diajukan: {permohonan.tanggalAjukan ?? "—"}</p>
          </div>
          <div className="text-right flex-shrink-0">
            {currentStatus === "diterbitkan" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-600 bg-green-100 text-green-700 whitespace-nowrap">
                <CheckCircle size={12} /> Diterbitkan
              </span>
            )}
            {currentStatus === "ditolak" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-600 bg-red-100 text-red-700 whitespace-nowrap">
                <XCircle size={12} /> Ditolak
              </span>
            )}
            {currentStatus === "menunggu" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-600 bg-blue-100 text-blue-700 whitespace-nowrap">
                <Clock size={12} /> Menunggu Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Incomplete docs warning */}
      {missingDocs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 min-w-0">
          <div className="flex items-start gap-3 min-w-0">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-600 text-amber-800 text-xs sm:text-sm break-words">
                Dokumen Belum Lengkap ({dokumen.filter((d) => d.status).length}/{dokumen.length})
              </p>
              <p className="text-xs text-amber-700 mt-1 mb-2">Dokumen berikut belum diunggah atau belum diverifikasi:</p>
              <ul className="space-y-1 min-w-0">
                {missingDocs.map((doc) => (
                  <li key={doc.jenis_id} className="flex items-start gap-2 text-xs text-amber-800 min-w-0">
                    <XCircle size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{doc.nama}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Sections */}
      <div className="space-y-3 min-w-0">
        {/* Riwayat Akademik */}
        <Section title="Riwayat Akademik" icon={<BarChart size={18} />} ok={sksOk && ipkTerakhir >= ipkMinimum}>
          <div className="space-y-3 min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 min-w-0">
              <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 min-w-0">
                <p className="text-xs text-gray-500 mb-1">IPK Terakhir</p>
                <p className={`font-display font-700 text-base sm:text-lg ${ipkTerakhir >= ipkMinimum ? "text-green-700" : "text-red-700"}`}>
                  {ipkTerakhir.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">Standar min. {ipkMinimum.toFixed(1)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Total SKS Lulus</p>
                <p className={`font-display font-700 text-base sm:text-lg ${sksOk ? "text-green-700" : "text-red-700"}`}>
                  {sksDitempuh} SKS
                </p>
                <p className="text-xs text-gray-400">Minimum {sksMinimum} SKS</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs min-w-0">
              <span className="text-gray-500">
                SKS: <strong className="text-gray-800">{sksDitempuh}/{sksMinimum}</strong>
              </span>
              <span className={`flex items-center gap-1 shrink-0 ${sksOk ? "text-green-600" : "text-red-600"}`}>
                {sksOk ? <CheckCircle size={12} /> : <XCircle size={12} />}
                {sksOk ? "Mencukupi" : "Belum mencukupi"}
              </span>
            </div>
          </div>
        </Section>

        {/* Dokumen Kewajiban */}
        <Section
          title={`Dokumen Kewajiban (${dokumen.filter((d) => d.status === "Disetujui").length}/${dokumen.length}${allDocsApproved ? " — Lengkap" : ""})`}
          icon={<Folder size={18} />}
          ok={allDocsApproved}
        >
          <div className="space-y-2 min-w-0">
            {dokumen.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada dokumen kewajiban terdaftar.</p>
            ) : (
              dokumen.map((entry) => {
                const isApproved = entry.status === "Disetujui";
                const isRejected = entry.status === "Ditolak";
                const isMissing = !entry.status;
                return (
                  <div
                    key={entry.jenis_id}
                    className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm px-3 py-2 rounded-lg border min-w-0 ${
                      isApproved
                        ? "bg-green-50 border-green-100"
                        : isRejected
                        ? "bg-red-50 border-red-100"
                        : "bg-red-50 border-red-100"
                    }`}
                  >
                    {isApproved ? (
                      <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={15} className="text-red-400 flex-shrink-0" />
                    )}
                    <span className={`flex-1 min-w-[120px] basis-1/2 font-500 break-words ${isApproved ? "text-gray-700" : "text-red-700"}`}>
                      {entry.nama}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">{entry.tanggal_upload ?? "—"}</span>
                    <span className={`text-xs font-600 shrink-0 ${isApproved ? "text-green-600" : "text-red-600"}`}>
                      {isMissing ? "Belum diunggah" : entry.status}
                    </span>
                  </div>
                );
              })
            )}
            {dokumen.length > 0 && (
              <div className={`mt-2 pt-2 border-t border-gray-100 text-xs font-500 flex items-center gap-1 ${allDocsApproved ? "text-green-600" : "text-yellow-600"}`}>
                {allDocsApproved ? (
                  <><CheckCircle size={12} className="flex-shrink-0" /> {dokumen.length}/{dokumen.length} Lengkap &amp; Tervalidasi</>
                ) : (
                  <><AlertTriangle size={12} className="flex-shrink-0" /> {dokumen.filter((d) => d.status === "Disetujui").length}/{dokumen.length} dokumen disetujui</>
                )}
              </div>
            )}
          </div>
        </Section>

        {/* Checklist dari backend */}
        {checklist.filter((c) => c.syarat !== "Semua dokumen wajib disetujui" && !c.syarat.includes("SKS")).map((item) => (
          <Section key={item.syarat} title={item.syarat} icon={<CheckCircle size={18} />} ok={item.terpenuhi}>
            <div className={`flex items-start gap-2 text-sm ${item.terpenuhi ? "text-green-600" : "text-yellow-700"}`}>
              {item.terpenuhi ? <CheckCircle size={15} className="flex-shrink-0 mt-0.5" /> : <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />}
              <span className="break-words min-w-0">{item.keterangan ?? (item.terpenuhi ? "Terpenuhi" : "Belum terpenuhi")}</span>
            </div>
          </Section>
        ))}
      </div>

      {/* Rejection history */}
      {rejectionHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3 sm:p-4 min-w-0">
          <h3 className="font-600 text-gray-800 text-sm mb-3 flex items-center gap-2">
            <XCircle size={15} className="text-[#DC2626] flex-shrink-0" /> Riwayat Penolakan
          </h3>
          {rejectionHistory.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada riwayat penolakan tercatat.</p>
          ) : (
            <div className="space-y-3 min-w-0">
              {rejectionHistory.map((r, i) => (
                <div key={i} className="border border-red-100 rounded-xl p-3.5 sm:p-4 bg-red-50 min-w-0">
                  <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-0.5 sm:gap-2 mb-1.5 min-w-0">
                    <span className="text-xs font-600 text-red-700">Penolakan #{i + 1}</span>
                    <span className="text-xs text-gray-500 shrink-0">{r.tgl}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed mb-1.5 break-words">
                    <span className="font-600">Catatan Penolakan: </span>{r.catatan}
                  </p>
                  <p className="text-xs text-gray-500 break-words">
                    Ditolak oleh: <span className="font-500 text-gray-700">{r.oleh}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overall assessment */}
      {canApply ? (
        <div className="flex items-start gap-3 bg-green-50 border border-green-300 rounded-xl px-3 sm:px-4 py-3.5 sm:py-4 min-w-0">
          <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-600 text-xs sm:text-sm text-green-800">Semua persyaratan terpenuhi</p>
            <p className="text-xs sm:text-sm text-green-700 mt-0.5">Mahasiswa layak mendapatkan Surat Keterangan Penyelesaian KIP-K.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-300 rounded-xl px-3 sm:px-4 py-3.5 sm:py-4 min-w-0">
          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-yellow-700 break-words min-w-0">
            Terdapat dokumen yang belum lengkap atau belum diverifikasi. Permohonan belum dapat diterbitkan.
          </p>
        </div>
      )}

      {/* Formal surat — shown when diterbitkan */}
      {currentStatus === "diterbitkan" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden min-w-0">
          <div className="px-3 sm:px-4 py-3.5 sm:py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
            <h3 className="font-600 text-gray-800 text-sm flex items-center gap-2 min-w-0">
              <CheckCircle size={15} className="text-[#059669] flex-shrink-0" /> <span className="truncate">Surat Penyelesaian Telah Diterbitkan</span>
            </h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`/api/bebas-tanggungan/${permohonan.id}/pdf?token=${localStorage.getItem("simkip_token") || ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap"
              >
                <Download size={12} /> Unduh PDF
              </a>
              <button
                onClick={handleDownloadPdf}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap"
              >
                <Printer size={12} /> Cetak
              </button>
            </div>
          </div>
          <div className="p-3 sm:p-5 min-w-0">
            <div className="overflow-x-auto min-w-0">
              <FormalSurat data={data} signature={signature} />
            </div>
          </div>
        </div>
      )}

      {/* Action error */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-start gap-2 min-w-0">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" /> <span className="break-words min-w-0">{actionError}</span>
        </div>
      )}

      {/* Action buttons — only for menunggu */}
      {currentStatus === "menunggu" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-3 sm:px-4 py-3.5 sm:py-4 flex flex-col min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center gap-2 sm:gap-3 min-w-0">
          <Link to="/admin/bebas-tanggungan" className="text-sm text-gray-500 hover:text-gray-700 text-center min-[480px]:text-left py-1 order-last min-[480px]:order-first">
            ← Kembali
          </Link>
          <div className="hidden min-[480px]:block min-[480px]:flex-1" />
          {!showReject ? (
            <>
              <button
                onClick={() => setShowReject(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 border border-red-200 text-red-600 hover:bg-red-50 transition-colors w-full min-[480px]:w-auto whitespace-nowrap"
              >
                <XCircle size={15} className="flex-shrink-0" /> Tolak
              </button>
              <button
                onClick={() => setShowApprove(true)}
                disabled={!canApply}
                title={!canApply ? "Belum semua persyaratan terpenuhi" : ""}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors w-full min-[480px]:w-auto whitespace-nowrap"
                style={{ background: "#059669" }}
              >
                <CheckCircle size={15} className="flex-shrink-0" /> Terbitkan Surat Penyelesaian
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col gap-2 min-w-0 w-full">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={2}
                placeholder="Catatan penolakan (minimal 10 karakter)..."
                className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:outline-none resize-none min-w-0"
              />
              <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 min-[420px]:justify-end">
                <button
                  onClick={() => { setShowReject(false); setRejectReason(""); }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting || rejectReason.trim().length < 10}
                  className="px-4 py-2 rounded-lg text-sm font-500 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                  style={{ background: "#DC2626" }}
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  Konfirmasi Penolakan
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStatus !== "menunggu" && (
        <div className="flex justify-start">
          <Link to="/admin/bebas-tanggungan" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ChevronLeft size={15} /> Kembali ke Daftar
          </Link>
        </div>
      )}

      {/* Approve Confirm Modal */}
      {showApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl min-w-0">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <h3 className="font-display font-700 text-base sm:text-lg text-gray-900 text-center mb-2">Konfirmasi Penerbitan</h3>
            <p className="text-gray-500 text-sm text-center mb-4 break-words">
              Dengan menerbitkan, sistem akan membuat Surat Keterangan Penyelesaian Studi untuk{" "}
              <strong>{mahasiswa.nama}</strong>.
            </p>
            <label className="flex items-start gap-2 mb-5 cursor-pointer min-w-0">
              <input
                type="checkbox"
                checked={approveChecked}
                onChange={(e) => setApproveChecked(e.target.checked)}
                className="mt-0.5 accent-[#059669] flex-shrink-0"
              />
              <span className="text-xs text-gray-600 break-words">
                Saya telah memeriksa seluruh persyaratan dan menyatakan mahasiswa ini layak mendapatkan Surat Keterangan
                Penyelesaian Studi.
              </span>
            </label>
            {actionError && (
              <p className="text-xs text-red-600 mb-3 text-center break-words">{actionError}</p>
            )}
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => { setShowApprove(false); setApproveChecked(false); setActionError(null); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-500 text-gray-600"
              >
                Batal
              </button>
              <button
                disabled={!approveChecked || isSubmitting}
                onClick={handleApprove}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "#059669" }}
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                Terbitkan Surat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
