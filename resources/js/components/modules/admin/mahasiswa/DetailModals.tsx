/**
 * Modal detail prestasi / organisasi / pelatihan.
 *
 * Diekstrak dari TabPrestasi, TabOrganisasi, dan TabPelatihan supaya satu
 * tampilan dipakai bersama oleh halaman Detail Mahasiswa dan halaman
 * Reporting. Item yang diterima berbentuk response Resource backend
 * (PrestasiResource / OrganisasiResource / PelatihanResource).
 */
import type { ReactNode } from "react"
import {
  XCircle,
  Trophy,
  Users,
  GraduationCap,
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Eye,
  Download,
} from "lucide-react"
import {
  getApprovalStatusBadge as statusBadge,
  ApprovalStatusIcon as StatusIcon,
} from "@/constants/status"
import { downloadFile } from "@/utils/fileUrl"

// ── Helpers ───────────────────────────────────────────────────────────────

/** "2026-10-15" → "15 Okt 2026" */
export function fmtDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** "2026-10" → "Okt 2026" */
export function fmtMonth(ym?: string | null) {
  if (!ym) return "—"
  const [y, m] = ym.split("-")
  const names = ["Jan", "Feb", "Mar", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
  return `${names[parseInt(m) - 1] || ""} ${y}`
}

/** Identitas mahasiswa pemilik data — hanya tampil bila prop diberikan. */
export interface MahasiswaBrief {
  nama?: string | null
  nim?: string | null
  prodi?: string | null
}

// ── Kerangka modal ────────────────────────────────────────────────────────

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 sm:px-4 py-3.5 sm:py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-2 flex-shrink-0 min-w-0">
          <h3 className="font-bold text-xs sm:text-sm text-gray-800 truncate">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0"
          >
            <XCircle size={18} />
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-4 overflow-y-auto min-w-0">
          {children}
        </div>

        <div className="px-3 sm:px-4 py-3.5 sm:py-4 border-t border-[#E2E8F0] flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

/** Baris identitas mahasiswa; tidak dirender bila tidak ada data. */
function PemilikRow({ mahasiswa }: { mahasiswa?: MahasiswaBrief }) {
  if (!mahasiswa?.nama) return null
  return (
    <div className="flex items-start gap-2.5 text-sm min-w-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5">
      <Users size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <span className="text-xs text-gray-400 mr-1">Mahasiswa:</span>
        <span className="font-medium text-gray-700 break-words">
          {mahasiswa.nama}
          {mahasiswa.nim ? ` (${mahasiswa.nim})` : ""}
          {mahasiswa.prodi ? ` — ${mahasiswa.prodi}` : ""}
        </span>
      </div>
    </div>
  )
}

/** Kartu pratinjau berkas (gambar/PDF) dengan tombol Pratinjau & Download. */
function FileCard({
  label,
  url,
  fileType,
  itemId,
  field,
  emptyIcon: EmptyIcon = FileText,
}: {
  label: string
  url?: string | null
  fileType: "prestasi" | "organisasi" | "pelatihan"
  itemId: number
  field: string
  emptyIcon?: typeof FileText
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      {url ? (
        <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
          {url.toLowerCase().endsWith(".pdf") ? (
            <iframe src={url} className="w-full h-40 border-0" title={label} />
          ) : (
            <img src={url} alt={label} className="w-full h-40 object-cover" />
          )}
          <div className="grid grid-cols-2 divide-x divide-gray-200 bg-[#F8FAFC]">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
            >
              <Eye size={11} /> Pratinjau
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                downloadFile(fileType, itemId, field).catch((err) =>
                  alert(err?.message || "Gagal mengunduh file")
                )
              }}
              className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
            >
              <Download size={11} /> Download
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4 h-40">
          <EmptyIcon size={22} className="text-gray-300" />
          <p className="text-xs text-gray-400">Belum diunggah</p>
        </div>
      )}
    </div>
  )
}

/** Dua kartu berkas berdampingan. */
function FilePair({
  left,
  right,
}: {
  left: ReactNode
  right: ReactNode
}) {
  return <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">{left}{right}</div>
}

function CatatanAdmin({ catatan }: { catatan?: string | null }) {
  if (!catatan) return null
  return (
    <div className="flex items-start gap-2 bg-red-50 px-3 py-2.5 rounded-xl min-w-0">
      <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs sm:text-sm text-red-700 break-words min-w-0">
        <span className="font-medium">Catatan Admin:</span> {catatan}
      </p>
    </div>
  )
}

function Deskripsi({ value }: { value?: string | null }) {
  if (!value) return null
  return (
    <div className="min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
      <p className="text-sm text-gray-700 break-words">{value}</p>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <Icon size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <span className="text-xs text-gray-400 mr-1">{label}:</span>
        <span className="font-medium text-gray-700 break-words">{value}</span>
      </div>
    </div>
  )
}

// ── Modal per jenis ───────────────────────────────────────────────────────

export interface DetailModalProps {
  item: any
  onClose: () => void
  /** Opsional — dipakai halaman Reporting untuk menampilkan pemilik data. */
  mahasiswa?: MahasiswaBrief
}

export function PrestasiDetailModal({ item, onClose, mahasiswa }: DetailModalProps) {
  const tingkatBadgeStyle = (tingkat: string) => {
    if (tingkat === "Internasional") return "bg-purple-100 text-purple-700"
    if (tingkat === "Nasional") return "bg-blue-100 text-blue-700"
    return "bg-green-100 text-green-700"
  }

  return (
    <ModalShell title="Detail Prestasi" onClose={onClose}>
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#263F93]/10">
          <Trophy
            size={22}
            style={{ color: "#D4A72C", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-gray-800 leading-snug break-words">
            {item.namaPrestasi || item.nama}
          </h4>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${tingkatBadgeStyle(item.tingkat)}`}>
              {item.tingkat}
            </span>
            {item.pencapaian && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#F5EDD4] text-[#B8860B] whitespace-nowrap">
                {item.pencapaian}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 whitespace-nowrap ${statusBadge(item.status)}`}>
              <StatusIcon status={item.status} /> {item.status}
            </span>
          </div>
        </div>
      </div>

      <PemilikRow mahasiswa={mahasiswa} />

      <div className="space-y-2.5 text-sm min-w-0">
        <InfoRow icon={Building2} label="Penyelenggara" value={item.penyelenggara} />
        <InfoRow
          icon={Calendar}
          label="Tanggal"
          value={`${fmtDate(item.tanggalMulai)} – ${fmtDate(item.tanggalSelesai)}`}
        />
        <InfoRow icon={MapPin} label="Tempat" value={item.tempat} />
      </div>

      <Deskripsi value={item.deskripsi} />

      {item.linkPenyelenggara && (
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">Link Penyelenggara</p>
          <a
            href={item.linkPenyelenggara}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-1.5 hover:underline text-[#263F93] break-all min-w-0"
          >
            <ExternalLink size={12} className="flex-shrink-0" />
            <span className="break-all">{item.linkPenyelenggara}</span>
          </a>
        </div>
      )}

      <CatatanAdmin catatan={item.catatanAdmin} />

      <FilePair
        left={
          <FileCard
            label="Sertifikat / Piagam"
            url={item.fileSertifikat}
            fileType="prestasi"
            itemId={item.id}
            field="file_sertifikat"
          />
        }
        right={
          <FileCard
            label="Foto Kegiatan"
            url={item.fileFoto}
            fileType="prestasi"
            itemId={item.id}
            field="file_foto"
            emptyIcon={ImageIcon}
          />
        }
      />
    </ModalShell>
  )
}

export function OrganisasiDetailModal({ item, onClose, mahasiswa }: DetailModalProps) {
  return (
    <ModalShell title="Detail Organisasi" onClose={onClose}>
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
          <Users size={22} className="text-[#263F93]" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-gray-800 leading-snug break-words">{item.nama}</h4>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 whitespace-nowrap">
              {item.jenis || "Organisasi"}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 whitespace-nowrap ${statusBadge(item.status)}`}>
              <StatusIcon status={item.status} /> {item.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 break-words">{item.jabatan}</p>
        </div>
      </div>

      <PemilikRow mahasiswa={mahasiswa} />

      <InfoRow icon={Calendar} label="Periode" value={`${fmtMonth(item.mulai)} → ${fmtMonth(item.selesai)}`} />

      <Deskripsi value={item.deskripsi} />

      <CatatanAdmin catatan={item.catatanAdmin} />

      <FilePair
        left={
          <FileCard
            label="SK Kepengurusan"
            url={item.fileSk}
            fileType="organisasi"
            itemId={item.id}
            field="file_sk"
          />
        }
        right={
          <FileCard
            label="Foto Kegiatan"
            url={item.fotoKegiatan}
            fileType="organisasi"
            itemId={item.id}
            field="foto_kegiatan"
            emptyIcon={ImageIcon}
          />
        }
      />
    </ModalShell>
  )
}

export function PelatihanDetailModal({ item, onClose, mahasiswa }: DetailModalProps) {
  // Backend mengirim `sertifikat`; penamaan lama `fileSertifikat` tetap didukung.
  const sertifikatUrl = item.sertifikat || item.fileSertifikat

  return (
    <ModalShell title="Detail Pelatihan" onClose={onClose}>
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={22} className="text-[#263F93]" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-gray-800 leading-snug break-words">{item.nama}</h4>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                item.jenis === "Akademik" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              }`}
            >
              {item.jenis}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 whitespace-nowrap ${statusBadge(item.status)}`}>
              <StatusIcon status={item.status} /> {item.status}
            </span>
          </div>
        </div>
      </div>

      <PemilikRow mahasiswa={mahasiswa} />

      <div className="space-y-2.5 text-sm min-w-0">
        <InfoRow icon={Building2} label="Penyelenggara" value={item.penyelenggara} />
        <InfoRow
          icon={Calendar}
          label="Tanggal"
          value={`${fmtDate(item.tanggalMulai)} → ${fmtDate(item.tanggalSelesai)}`}
        />
        <InfoRow icon={MapPin} label="Tempat" value={item.tempat} />
      </div>

      <Deskripsi value={item.deskripsi} />

      <CatatanAdmin catatan={item.catatanAdmin} />

      <FilePair
        left={
          <FileCard
            label="Sertifikat"
            url={sertifikatUrl}
            fileType="pelatihan"
            itemId={item.id}
            field="file_sertifikat"
          />
        }
        right={
          <FileCard
            label="Foto Kegiatan"
            url={item.fotoKegiatan}
            fileType="pelatihan"
            itemId={item.id}
            field="foto_kegiatan"
            emptyIcon={ImageIcon}
          />
        }
      />
    </ModalShell>
  )
}
