import { useEffect, useMemo, useState } from "react"
import { TabPrestasi } from "@/components/modules/admin/mahasiswa/TabPrestasi"
import { TabOrganisasi } from "@/components/modules/admin/mahasiswa/TabOrganisasi"
import { TabPelatihan } from "@/components/modules/admin/mahasiswa/TabPelatihan"
import { Link, useParams } from "react-router-dom"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts"
import {
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Trophy,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  Image,
  GraduationCap,
  Briefcase,
  Shield,
  Star,
  Phone,
  MapPin,
  User,
  Calendar,
  Building2,
  Award,
  Download,
  Info,
} from "lucide-react"
import logoItg from "@/imports/logo_itg.jpg"
import { api, API_BASE_URL } from "@/services/api"
import { getApprovalStatusBadge as statusBadge, getApprovalStatusBorder as dokBorderColor, ApprovalStatusIcon as StatusIcon } from "@/constants/status"
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";
import { downloadFile } from "@/utils/fileUrl";

// ── Types ────────────────────────────────────────────────────────────────────

interface MataKuliah {
  kode: string
  nama: string
  sks: number
  nilaiHuruf: string
  nilaiMutu: number
  lulus: boolean
}

interface SemesterDetail {
  semester: number
  tahun: string
  ipk: number
  ips?: number
  mataKuliah: MataKuliah[]
}

interface MkBelumLulus {
  kode: string
  nama: string
  sks: number
  nilai: string
  semesterAwal: number
  statusPerbaikan: "belum" | "lulus"
  lulusDiSem?: number | null
}

interface PrestasiItem {
  id: number
  nama: string
  tingkat: "Internasional" | "Nasional" | "Wilayah" | string
  pencapaian: string
  penyelenggara: string
  tanggalMulai: string
  tanggalSelesai: string
  tempat: string
  deskripsi: string
  link?: string | null
  fileSertifikat?: string | null
  fileFoto?: string | null
  status: "Disetujui" | "Menunggu" | "Menunggu Validasi" | "Ditolak" | string
}

interface OrganisasiItem {
  id: number
  nama: string
  jenis: "Organisasi" | "Kepanitiaan" | "Kepanitiaan" | string
  jabatan: string
  periodeMulai: string
  periodeSelesai: string
  deskripsi: string
  fileSk?: string | null
  fotoKegiatan?: string | null
  status: "Disetujui" | "Menunggu" | "Menunggu Validasi" | "Ditolak" | string
}

interface PelatihanItem {
  id: number
  nama: string
  jenis: "Akademik" | "Non-Akademik" | string
  penyelenggara: string
  tanggalMulai: string
  tanggalSelesai: string
  tempat: string
  deskripsi: string
  sertifikat?: string | null
  fotoKegiatan?: string | null
  status: "Disetujui" | "Menunggu" | "Menunggu Validasi" | "Ditolak" | string
}

interface DokumenWajib {
  id: number
  nama: string
  status: "Disetujui" | "Menunggu" | "Menunggu Validasi" | "Ditolak" | "Belum Diunggah" | string
  tanggal: string | null
  catatan: string | null
  deskripsi: string
  tipe: string
  fileUrl?: string | null
}

interface SpItem {
  id: number
  level: "SP1" | "SP2" | "SP3" | string
  nomorSurat: string | null
  tanggal: string | null
  tanggalRaw: string | null
  alasan: string
  batasEvaluasi: string | null
  status: "Aktif" | "Masa Tenggang" | "Selesai" | "Pemberhentian" | string
  sisaHari: number
  jenisPelanggaran: string
  catatan: string | null
  diterbitkanOleh: number | null
  createdAt: string | null
}

interface SyaratItem {
  nama: string
  terpenuhi: boolean
  keterangan?: string | null
}

interface ContactHistoryItem {
  nomor: string
  sem: string
  aktif: boolean
  status: string
  tanggal?: string | null
}

interface MahasiswaDetailData {
  id: number
  nim: string
  nama: string
  prodi: string
  prodiId: number
  angkatan: number
  kategori: "Reguler" | "Aspirasi"
  status: "Aktif" | "Lulus" | "Dicabut" | "Nonaktif" | string
  semester: number
  semesterDicabut: string | null
  tanggalDicabut: string | null
  alasanDicabut: string | null
  tempatLahir: string | null
  tanggalLahir: string | null
  jenisKelamin: string | null
  alamat: string | null
  namaAyah: string | null
  namaIbu: string | null
  telAyah: string | null
  telIbu: string | null
  nik: string | null
  nisn: string | null
  email: string | null
  noHp: string | null
  fotoProfil: string | null
  contactHistories: ContactHistoryItem[]
  ipkTerakhir: number
  ipkTertinggi: number
  ipkTerendah: number
  ipkRataRata: number
  ipkSemTertinggi: number
  ipkSemTerendah: number
  spAktif: SpItem | null
}

interface DetailResponse {
  success: boolean
  mahasiswa: MahasiswaDetailData
  ipk_history: SemesterDetail[]
  ipk_chart: { semester: number; ipk: number }[]
  mk_belum_lulus: MkBelumLulus[]
  dokumen_kewajiban: DokumenWajib[]
  dokumen_summary: { total_wajib: number; total_disetujui: number; lengkap: boolean }
  syarat_penyelesaian: SyaratItem[]
  checklist_meta: { ipk_minimum: number; ipk_terakhir: number; sks_ditempuh: number; sks_minimum: number; can_apply: boolean }
  bebas_tanggungan: { id: number; status: string; tanggal: string } | null
  prestasi: PrestasiItem[]
  organisasi: OrganisasiItem[]
  pelatihan: PelatihanItem[]
  sp: SpItem[]
}

const TingkatBadge = ({ tingkat }: { tingkat: string }) => {
  if (tingkat === "Internasional") return "bg-purple-100 text-purple-700"
  if (tingkat === "Nasional") return "bg-blue-100 text-blue-700"
  if (tingkat === "Wilayah") return "bg-green-100 text-green-700"
  return "bg-gray-100 text-gray-500"
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// ── Sub-components ────────────────────────────────────────────────────────────

function PlaceholderThumb({ label }: { label: string }) {
  return (
    <div className="w-20 h-14 bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0">
      <Image size={16} className="text-gray-400" />
      <span className="text-[10px] text-gray-400 leading-none">{label}</span>
    </div>
  )
}

function FilePlaceholderCard({
  label,
  fileUrl,
  downloadType,
  downloadId,
  downloadField,
}: {
  label: string
  fileUrl?: string | null
  downloadType?: string
  downloadId?: number | string
  downloadField?: string
}) {
  const handleDownload = downloadType && downloadId && downloadField
    ? (e: React.MouseEvent) => {
        e.preventDefault()
        downloadFile(downloadType, downloadId, downloadField).catch((err) =>
          alert(err?.message || "Gagal mengunduh file")
        )
      }
    : undefined

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-between gap-2 p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-gray-500" />
          </div>
          <span className="text-sm text-gray-700 font-medium truncate">{label}</span>
        </div>
        <button disabled className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed shrink-0 whitespace-nowrap">
          <Download size={12} />
          Download
        </button>
      </div>
    )
  }

  const isPdf = fileUrl.toLowerCase().endsWith(".pdf")

  return (
    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
      <div className="p-3 bg-gray-50 border-b border-[#E2E8F0]">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      {isPdf ? (
        <iframe
          src={fileUrl}
          className="w-full h-48 border-0"
          title={label}
        />
      ) : (
        <img
          src={fileUrl}
          alt={label}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="grid grid-cols-2 divide-x divide-[#E2E8F0] bg-gray-50 border-t border-[#E2E8F0]">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
        >
          <ExternalLink size={11} /> Pratinjau
        </a>
        <a
          href={handleDownload ? "#" : fileUrl}
          onClick={handleDownload}
          download={!handleDownload}
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
        >
          <Download size={11} /> Download
        </a>
      </div>
    </div>
  )
}

function SemesterRow({
  detail,
  prev,
}: {
  detail: SemesterDetail
  prev: SemesterDetail | null
}) {
  const [open, setOpen] = useState(false)
  const delta = prev ? detail.ipk - prev.ipk : null
  const totalSks = detail.mataKuliah.reduce((s, mk) => s + mk.sks, 0)
  const belum = detail.mataKuliah.filter((mk) => !mk.lulus)

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
        <td className="py-3 px-3 text-sm text-gray-700 whitespace-nowrap">
          Semester {detail.semester}
        </td>
        <td className="py-3 px-3 text-sm text-gray-500 whitespace-nowrap">{detail.tahun}</td>
        <td className="py-3 px-3">
          <span
            className="font-semibold text-sm"
            style={{ color: detail.ipk >= 3.0 ? "#059669" : "#DC2626" }}
          >
            {detail.ipk.toFixed(2)}
          </span>
        </td>
        <td className="py-3 px-3">
          {delta !== null ? (
            <span
              className={`text-sm font-medium ${
                delta >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {delta >= 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(2)}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </td>
        <td className="py-3 px-3">
          {belum.length > 0 ? (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              {belum.length} MK
            </span>
          ) : (
            <span className="text-gray-400 text-xs">—</span>
          )}
        </td>
        <td className="py-3 px-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              detail.ipk >= 3.0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {detail.ipk >= 3.0 ? "Terverifikasi" : "Perlu Tindakan"}
          </span>
        </td>
        <td className="py-3 px-3">
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs text-[#263F93] font-medium flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            Lihat Detail Nilai
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} className="p-0 min-w-0">
            <div className="bg-gray-50 border-t border-b border-gray-100 px-3 sm:px-4 py-3 min-w-0">
              <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-2 text-xs font-semibold text-gray-500 uppercase w-8">
                      No
                    </th>
                    <th className="text-left py-2 pr-2 text-xs font-semibold text-gray-500 uppercase">
                      Kode MK
                    </th>
                    <th className="text-left py-2 pr-2 text-xs font-semibold text-gray-500 uppercase">
                      Nama MK
                    </th>
                    <th className="text-center py-2 pr-2 text-xs font-semibold text-gray-500 uppercase">
                      SKS
                    </th>
                    <th className="text-center py-2 pr-2 text-xs font-semibold text-gray-500 uppercase">
                      Nilai Huruf
                    </th>
                    <th className="text-center py-2 pr-2 text-xs font-semibold text-gray-500 uppercase">
                      Nilai Mutu
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {detail.mataKuliah.map((mk, idx) => (
                    <tr key={mk.kode + "-" + idx} className={mk.lulus ? "" : "bg-red-50"}>
                      <td className="py-2 pr-2 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="py-2 pr-2 text-gray-600 text-xs font-mono whitespace-nowrap">
                        {mk.kode}
                      </td>
                      <td className="py-2 pr-2 text-gray-800 text-xs sm:text-sm min-w-[140px] break-words">{mk.nama}</td>
                      <td className="py-2 pr-2 text-center text-gray-600 text-xs sm:text-sm">
                        {mk.sks}
                      </td>
                      <td
                        className="py-2 pr-2 text-center font-semibold text-xs sm:text-sm"
                        style={{ color: mk.lulus ? "#059669" : "#DC2626" }}
                      >
                        {mk.nilaiHuruf}
                      </td>
                      <td className="py-2 pr-2 text-center text-gray-600 text-xs sm:text-sm">
                        {mk.nilaiMutu.toFixed(1)}
                      </td>
                      <td className="py-2 text-center">
                        {mk.lulus ? (
                          <span className="text-xs text-green-700 flex items-center justify-center gap-1 whitespace-nowrap">
                            <CheckCircle size={12} className="flex-shrink-0" /> Lulus
                          </span>
                        ) : (
                          <span className="text-xs text-red-700 flex items-center justify-center gap-1 whitespace-nowrap">
                            <XCircle size={12} className="flex-shrink-0" /> Belum Lulus
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td
                      colSpan={7}
                      className="pt-2 text-xs text-gray-500 font-medium"
                    >
                      Total SKS: {totalSks} | IPK: {detail.ipk.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function CustomLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center mt-1 px-2">
      <span className="flex items-center gap-1.5 text-xs" style={{ color: "#64748B" }}>
        <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#263F93" }} />
        IPK
      </span>
      <span className="flex items-center gap-1.5 text-xs" style={{ color: "#64748B" }}>
        <span className="inline-block w-5 border-t-2 border-dashed border-amber-500" />
        Batas Min 3.0
      </span>
    </div>
  )
}

// ── Tabs ────────────────────────────────────────────────────────────────────

function TabRiwayatAkademik({ data }: { data: DetailResponse }) {
  const ipkHistory = data.ipk_history
  const belumLulus = data.mk_belum_lulus.filter((mk) => mk.statusPerbaikan === "belum")

  const highest = data.mahasiswa.ipkTertinggi
  const lowest  = data.mahasiswa.ipkTerendah
  const avg     = data.mahasiswa.ipkRataRata
  const highestSem = data.mahasiswa.ipkSemTertinggi
  const lowestSem  = data.mahasiswa.ipkSemTerendah

  const chartData = (data.ipk_chart ?? []).map((c) => ({ ...c, ipkVal: c.ipk }))

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { label: "IPK Tertinggi", value: highest.toFixed(2), sub: `di Sem ${highestSem || "-"}` },
          { label: "IPK Terendah",  value: lowest.toFixed(2),  sub: `di Sem ${lowestSem || "-"}` },
          { label: "IPK Rata-rata", value: avg.toFixed(2),    sub: `dari ${ipkHistory.length} semester` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-center min-w-0">
            <div className="text-lg sm:text-xl font-bold text-gray-900">{value}</div>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Grafik Progres IPK</h4>
        {chartData.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl px-4 text-center">
            Belum ada data IPK.
          </div>
        ) : (
          <div className="w-full h-[220px] sm:h-[240px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 12, bottom: 5, left: -12 }}>
              <defs>
                <linearGradient id="ipkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#263F93" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#263F93" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="semester"
                tickFormatter={(v: number) => `Sem ${v}`}
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                minTickGap={4}
              />
              <YAxis domain={[2, 4]} width={32} tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
                formatter={(value) => [(Number(value) || 0).toFixed(2), "IPK"] as [string, string]}
                labelFormatter={(label) => `Semester ${label}`}
              />
              <ReferenceLine
                y={3.0}
                stroke="#F59E0B"
                strokeDasharray="5 4"
                label={{ value: "Min 3.0", fontSize: 10, fill: "#B45309", position: "right" }}
              />
              <Area
                type="monotone"
                dataKey="ipk"
                stroke="#263F93"
                strokeWidth={2.5}
                fill="url(#ipkGrad)"
                dot={{ fill: "#263F93", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Legend content={<CustomLegend />} />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Riwayat IPK per Semester</h4>
        {ipkHistory.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
            Belum ada data IPK.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] min-w-0">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Semester", "TA", "IPK", "Perubahan", "MK Belum Lulus", "Status Verifikasi", "Aksi"].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ipkHistory.map((detail, idx) => (
                  <SemesterRow
                    key={detail.semester}
                    detail={detail}
                    prev={idx > 0 ? ipkHistory[idx - 1] : null}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {belumLulus.length > 0 && (
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
            Mata Kuliah Belum Lulus
          </h4>
          <div className="mb-4 sm:mb-6 flex items-start gap-3 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl min-w-0">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed break-words min-w-0">
              <span className="font-semibold text-amber-900 block mb-0.5">Perhatian:</span>
              Mahasiswa ini memiliki {belumLulus.length} MK belum lulus yang berpotensi menghambat KP/Skripsi
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] min-w-0">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Kode MK", "Nama MK", "SKS", "Nilai", "Semester Awal", "Status Perbaikan"].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.mk_belum_lulus.map((mk) => (
                  <tr key={mk.kode} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-600 whitespace-nowrap">{mk.kode}</td>
                    <td className="py-2.5 px-3 text-xs sm:text-sm text-gray-800 min-w-[140px] break-words">{mk.nama}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600 text-xs sm:text-sm">{mk.sks}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-red-600 text-xs sm:text-sm">{mk.nilai}</td>
                    <td className="py-2.5 px-3 text-gray-500 text-xs sm:text-sm whitespace-nowrap">Sem {mk.semesterAwal}</td>
                    <td className="py-2.5 px-3">
                      <div className="text-right">
                        {mk.statusPerbaikan === "belum" ? (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full items-center gap-1 inline-flex whitespace-nowrap">
                            <Clock size={12} className="flex-shrink-0" /> Belum Diperbaiki
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full items-center gap-1 inline-flex whitespace-nowrap">
                            <CheckCircle size={12} className="flex-shrink-0" /> Lulus di Sem {mk.lulusDiSem ?? "-"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function TabDokumen({ items, summary }: { items: DokumenWajib[]; summary: { total_wajib: number; total_disetujui: number } }) {
  const [modalItem, setModalItem] = useState<DokumenWajib | null>(null)

  const total = summary.total_wajib || items.length
  const approved = summary.total_disetujui || items.filter((d) => d.status === "Disetujui").length

  if (items.length === 0) {
    return <div className="py-10 px-4 text-center text-gray-400 text-xs sm:text-sm">Tidak ada data dokumen.</div>
  }

  return (
    <div className="space-y-4 min-w-0">
      <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-1.5 sm:gap-2 min-w-0">
        <h4 className="text-sm font-semibold text-gray-700">Dokumen Kewajiban</h4>
        <span className="text-xs text-gray-500 whitespace-nowrap">{approved} dari {total} dokumen lengkap</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all"
          style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%`, background: "#22C55E" }} />
      </div>
      <div className="space-y-2.5 min-w-0">
        {items.map((d) => (
          <div key={d.id}
            className={`flex flex-wrap items-start gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-xl border-l-4 bg-white border border-[#E2E8F0] min-w-0 ${dokBorderColor(d.status)}`}>
            <FileText size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0 basis-40">
              <div className="font-medium text-sm text-gray-800 break-words">{d.nama}</div>
              {d.tanggal && <div className="text-xs text-gray-400 mt-0.5 break-words">{d.tanggal}</div>}
              {d.catatan && <div className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded break-words">Catatan: {d.catatan}</div>}
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full min-[420px]:w-auto min-[420px]:justify-end">
              <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${statusBadge(d.status)}`}>
                {d.status}
              </span>
              <button onClick={() => setModalItem(d)}
                className="text-xs text-[#263F93] font-medium hover:underline whitespace-nowrap">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 min-w-0"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-2 min-w-0">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg break-words">{modalItem.nama}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full whitespace-nowrap">
                    {modalItem.tipe}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${statusBadge(modalItem.status)}`}>
                    {modalItem.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setModalItem(null)} aria-label="Tutup detail" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <XCircle size={20} />
              </button>
            </div>
            <div className="space-y-2.5 min-w-0">
              {modalItem.tanggal && (
                <div className="bg-gray-50 rounded-xl px-3 py-2.5 min-w-0">
                  <div className="text-xs text-gray-400 mb-0.5">Tanggal</div>
                  <div className="font-medium text-gray-800 text-sm break-words">{modalItem.tanggal}</div>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 min-w-0">
                <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                <div className="text-gray-800 text-sm break-words">{modalItem.deskripsi}</div>
              </div>
              {modalItem.catatan && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 min-w-0">
                  <div className="text-xs text-red-500 mb-0.5">Catatan Penolakan</div>
                  <div className="text-red-700 text-sm break-words">{modalItem.catatan}</div>
                </div>
              )}
            </div>
            {modalItem.status !== "Belum Diunggah" && (
              <div className="space-y-2 min-w-0">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Berkas</div>
                <FilePlaceholderCard label={`Dokumen ${modalItem.nama}`} fileUrl={modalItem.fileUrl} downloadType="dokumen" downloadId={modalItem.id} downloadField="path_file" />
              </div>
            )}
            {modalItem.status === "Belum Diunggah" && (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center min-w-0">
                <FileText size={24} className="text-gray-300 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Belum ada berkas yang diunggah</p>
              </div>
            )}
            <div className="pt-2 flex justify-end">
              <button onClick={() => setModalItem(null)}
                className="px-5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TabSP({ sp, mhs }: { sp: SpItem[]; mhs: MahasiswaDetailData }) {
  const [expanded, setExpanded] = useState(true)
  const spAktif = sp.find((s) => s.status === "Aktif" || s.status === "Masa Tenggang")

  if (sp.length === 0) {
    return (
      <div className="space-y-3 sm:space-y-4 min-w-0">
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden min-w-0">
          <div className="bg-[#263F93] px-3 sm:px-4 py-3.5 sm:py-4 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <img src={logoItg} alt="Logo ITG"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0" />
            <div className="text-white min-w-0">
              <div className="font-bold text-xs sm:text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</div>
              <div className="text-[11px] sm:text-xs text-white/80 leading-snug">
                Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white text-center text-xs sm:text-sm text-gray-500">
            Mahasiswa ini belum pernah menerima Surat Peringatan.
          </div>
        </div>
      </div>
    )
  }

  const utama = spAktif ?? sp[0]

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden min-w-0">
        <div className="bg-[#263F93] px-3 sm:px-4 py-3.5 sm:py-4 flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img src={logoItg} alt="Logo ITG"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0" />
          <div className="text-white min-w-0">
            <div className="font-bold text-xs sm:text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</div>
            <div className="text-[11px] sm:text-xs text-white/80 leading-snug">
              Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-4 bg-white min-w-0">
          <div className="text-xs text-gray-500 space-y-0.5 min-w-0">
            <div className="break-words">Nomor: <span className="font-mono font-medium text-gray-700 break-all">{utama.nomorSurat ?? "-"}</span></div>
            <div className="break-words">Tanggal: <span className="font-medium text-gray-700">{utama.tanggal ?? "-"}</span></div>
            <div className="break-words">Perihal: <span className="font-medium text-gray-700">Surat Peringatan {utama.level} ({utama.level}) Penerima KIP-K</span></div>
          </div>
          <div className="text-xs text-gray-500 space-y-0.5 min-w-0">
            <div className="font-medium text-gray-700">Kepada Yth.</div>
            <div className="break-words">Sdra/i. {mhs.nama}</div>
            <div className="break-words">NIM: {mhs.nim} | {mhs.prodi} | Semester {mhs.semester}</div>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed break-words min-w-0">
            {utama.alasan}
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Riwayat Surat Peringatan</h4>
        <div className="relative pl-5 sm:pl-6 border-l-2 border-[#E2E8F0] space-y-4 min-w-0">
          <div className="relative min-w-0">
            <div className="absolute -left-[25px] sm:-left-[29px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow" />
            <button onClick={() => setExpanded((v) => !v)}
              className="w-full text-left flex items-center justify-between gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl min-w-0">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-amber-700">{utama.level} — {utama.status}</span>
                <div className="text-xs text-amber-600 mt-0.5 break-words">{utama.tanggal} · {utama.alasan}</div>
              </div>
              {expanded ? <ChevronUp size={14} className="text-amber-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-amber-500 flex-shrink-0" />}
            </button>
            {expanded && (
              <div className="mt-2 p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-gray-600 space-y-1 min-w-0">
                <div className="break-words"><span className="font-medium">Nomor:</span> {utama.nomorSurat ?? "-"}</div>
                <div className="break-words"><span className="font-medium">Alasan:</span> {utama.alasan}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TabInfoPribadi({ mhs }: { mhs: MahasiswaDetailData }) {
  const inisial = (mhs.nama ?? "?").charAt(0)
  const items = [
    { icon: User, label: "Nama Lengkap", value: mhs.nama },
    { icon: FileText, label: "NIM", value: mhs.nim },
    { icon: Calendar, label: "Tempat, Tgl Lahir", value: `${mhs.tempatLahir ?? "-"}, ${mhs.tanggalLahir ?? "-"}` },
    { icon: MapPin, label: "Alamat", value: mhs.alamat ?? "-" },
    { icon: User, label: "Nama Ayah", value: mhs.namaAyah ?? "-" },
    { icon: User, label: "Nama Ibu", value: mhs.namaIbu ?? "-" },
    { icon: Phone, label: "No. Telepon Ayah", value: mhs.telAyah ?? "-" },
    { icon: Phone, label: "No. Telepon Ibu", value: mhs.telIbu ?? "-" },
  ]

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <div className="bg-gray-50 border border-[#E2E8F0] rounded-xl px-3.5 sm:px-4 py-3 mb-5 flex items-center gap-2 min-w-0">
        <Lock size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide break-words">
          RAHASIA — Data ini hanya dapat diakses oleh Pengelola KIP-K
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
        <div className="col-span-full flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#263F93] flex items-center justify-center text-lg sm:text-xl font-bold text-white flex-shrink-0">
            {inisial}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-xs sm:text-sm break-words">{mhs.nama}</div>
            <div className="text-xs sm:text-sm text-gray-500 break-words">NIM {mhs.nim}</div>
          </div>
        </div>
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">{label}</span>
            </div>
            <div className="text-sm font-medium text-gray-800 break-words">{value}</div>
          </div>
        ))}
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Phone size={14} className="flex-shrink-0" /> Riwayat Nomor Kontak
        </h4>
        {(mhs.contactHistories ?? []).length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
            Belum ada riwayat kontak.
          </div>
        ) : (
          <div className="relative pl-5 sm:pl-6 border-l-2 border-[#E2E8F0] space-y-3 min-w-0">
            {mhs.contactHistories.map((c, i) => (
              <div key={i} className="relative min-w-0">
                <div className={`absolute -left-[25px] sm:-left-[29px] top-1 w-4 h-4 rounded-full border-2 border-white shadow ${
                  c.aktif ? "bg-green-400" : "bg-gray-300"
                }`} />
                <div className="flex items-center justify-between gap-2 p-3 bg-white border border-[#E2E8F0] rounded-xl min-w-0">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-800 break-all">{c.nomor}</div>
                    <div className="text-xs text-gray-400 mt-0.5 break-words">{c.sem ?? c.tanggal ?? ""}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap shrink-0 ${
                    c.aktif ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TabSuratPenyelesaian({ items, bebas, meta }: {
  items: SyaratItem[];
  bebas: DetailResponse["bebas_tanggungan"];
  meta: DetailResponse["checklist_meta"];
}) {
  const fulfilled = items.filter((s) => s.terpenuhi).length
  const total = items.length

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 p-3.5 sm:p-4 bg-gray-50 border border-[#E2E8F0] rounded-xl min-w-0">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <FileText size={22} className="text-gray-400" />
        </div>
        <div className="min-w-0 flex-1 basis-40">
          <div className="font-semibold text-gray-700 text-xs sm:text-sm break-words">
            {bebas ? `Permohonan ${bebas.status}` : "Belum Mengajukan"}
          </div>
          <div className="text-xs text-gray-400 mt-0.5 break-words">
            {bebas
              ? `Diajukan ${bebas.tanggal}`
              : "Mahasiswa belum mengajukan permohonan Surat Penyelesaian"}
          </div>
        </div>
        <span className="ml-auto text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium whitespace-nowrap shrink-0">
          {fulfilled}/{total} syarat terpenuhi
        </span>
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Persyaratan Surat Penyelesaian</h4>
        <div className="space-y-2 min-w-0">
          {items.map((s, i) => (
            <div key={i}
              className={`flex items-start gap-2 sm:gap-3 p-3 rounded-xl border min-w-0 ${
                s.terpenuhi ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}>
              {s.terpenuhi
                ? <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                : <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <span className={`text-sm block break-words ${s.terpenuhi ? "text-green-800" : "text-red-700"}`}>
                  {s.nama}
                </span>
                {s.keterangan && (
                  <span className="text-xs text-gray-500 break-words">{s.keterangan}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

const TAB_LABELS = [
  "Riwayat Akademik",
  "Prestasi",
  "Keaktifan Organisasi",
  "Pelatihan",
  "Dokumen Kewajiban",
  "Surat Peringatan",
  "Informasi Pribadi",
  "Surat Penyelesaian",
]

export default function MahasiswaDetail() {
  const { id } = useParams<{ id: string }>()
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran())
  const [activeTab, setActiveTab] = useState(0)
  const [data, setData] = useState<DetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    api.get<DetailResponse>(`/prodi/mahasiswa/${id}/detail?tahun_ajaran=${tahunAjaran}`)
      .then((res) => { if (active) setData(res) })
      .catch((err) => {
        if (active) setError(err?.message ?? "Gagal memuat data mahasiswa")
      })
      .finally(() => { if (active) setLoading(false); })
    return () => { active = false }
  }, [id, tahunAjaran])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#263F93]"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0">
        <Link to="../mahasiswa" relative="path" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft size={16} /> Manajemen Mahasiswa
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-6 text-center text-sm text-red-700 break-words">
          {error ?? "Mahasiswa tidak ditemukan."}
        </div>
      </div>
    )
  }

  const mhs = data.mahasiswa
  const sp = data.sp ?? []
  const spAktif = sp.find((s) => s.status === "Aktif" || s.status === "Masa Tenggang")
  const hasSP2 = !!spAktif && (spAktif.level === "SP2" || spAktif.level === "SP3")
  const semesterNum = mhs.semester ?? 0
  const totalSem = 8
  const progressPct = Math.round((semesterNum / totalSem) * 100)
  const inisial = (mhs.nama ?? "?").charAt(0)

  return (
    <div className="space-y-3 sm:space-y-4 pb-10 w-full max-w-7xl mx-auto min-w-0">
      <div className="bg-[#EDF0F8] border border-[#263F93]/20 rounded-xl px-3.5 sm:px-4 py-3 text-xs sm:text-sm text-[#263F93] flex items-start gap-2 min-w-0">
        <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <span className="break-words min-w-0">
          Halaman ini bersifat read-only. Selain pengelola KIP-K tidak dapat
          melakukan perubahan data mahasiswa.
        </span>
      </div>

      {mhs.status === "Nonaktif" && (
        <div className="bg-amber-100 border border-amber-300 rounded-xl px-3.5 sm:px-4 py-3 text-xs sm:text-sm text-amber-800 flex items-start gap-2 font-medium min-w-0">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <span className="break-words">Mahasiswa ini berstatus NONAKTIF</span>
        </div>
      )}
      {mhs.status === "Dicabut" && (
        <div className="bg-red-100 border border-red-300 rounded-xl px-3.5 sm:px-4 py-3 text-xs sm:text-sm text-red-800 flex items-start gap-2 font-medium min-w-0">
          <XCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span className="break-words">KIP-K mahasiswa ini telah DICABUT{mhs.semesterDicabut ? ` pada Semester ${mhs.semesterDicabut}` : ""}</span>
        </div>
      )}

      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-2 min-w-0">
        <Link to="../mahasiswa" relative="path"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors shrink-0">
          <ChevronLeft size={16} /> Manajemen Mahasiswa
        </Link>
        <div className="self-start min-[480px]:self-auto min-w-0">
          <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#E2E8F0] p-4 sm:p-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#263F93] flex items-center justify-center text-lg sm:text-xl font-bold text-white flex-shrink-0">
              {inisial}
            </div>
            <div className="flex-1 min-w-0 sm:hidden">
              <h2 className="font-bold text-lg text-gray-900 break-words leading-tight">{mhs.nama}</h2>
              <p className="text-gray-500 text-xs break-words mt-0.5">
                {mhs.nim} · {mhs.prodi} · Angkatan {mhs.angkatan}
              </p>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="hidden sm:flex flex-wrap items-center gap-2 mb-1 min-w-0">
              <h2 className="font-bold text-xl text-gray-900 break-words leading-tight">{mhs.nama}</h2>
              {spAktif && spAktif.level === "SP1" && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
                  <AlertTriangle size={11} /> SP1
                </span>
              )}
              {spAktif && (spAktif.level === "SP2" || spAktif.level === "SP3") && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
                  <AlertTriangle size={11} /> SP1
                </span>
              )}
              {hasSP2 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
                  <AlertTriangle size={11} /> SP2
                </span>
              )}
            </div>
            <div className="flex sm:hidden flex-wrap items-center gap-1.5 mb-2">
              {spAktif && spAktif.level === "SP1" && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
                  <AlertTriangle size={11} /> SP1
                </span>
              )}
              {spAktif && (spAktif.level === "SP2" || spAktif.level === "SP3") && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
                  <AlertTriangle size={11} /> SP1
                </span>
              )}
              {hasSP2 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
                  <AlertTriangle size={11} /> SP2
                </span>
              )}
            </div>
            <p className="hidden sm:block text-gray-500 text-sm mb-3 break-words">
              {mhs.nim} · {mhs.prodi} · Angkatan {mhs.angkatan}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                mhs.kategori === "Reguler" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              }`}>
                {mhs.kategori}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                mhs.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {mhs.status}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0 sm:min-w-[200px]">
            <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1.5">
              <span className="shrink-0">Progress Semester</span>
              <span className="font-semibold text-gray-700 text-right truncate">Semester {semesterNum} dari {totalSem}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${progressPct}%`, background: "#263F93" }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{Math.max(0, totalSem - semesterNum)} semester tersisa</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#E2E8F0] overflow-x-auto min-w-0">
        <div className="flex min-w-max">
          {TAB_LABELS.map((label, i) => (
            <button key={label}
              onClick={() => setActiveTab(i)}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === i
                  ? "border-[#263F93] text-[#263F93]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#E2E8F0] p-4 sm:p-6 min-w-0 overflow-hidden">
        {activeTab === 0 && <TabRiwayatAkademik data={data} />}
        {activeTab === 1 && <TabPrestasi data={data.prestasi ?? []} loading={false} error={null} />}
        {activeTab === 2 && <TabOrganisasi data={data.organisasi ?? []} loading={false} error={null} />}
        {activeTab === 3 && <TabPelatihan data={data.pelatihan ?? []} loading={false} error={null} />}
        {activeTab === 4 && <TabDokumen items={data.dokumen_kewajiban ?? []} summary={data.dokumen_summary} />}
        {activeTab === 5 && <TabSP sp={sp} mhs={mhs} />}
        {activeTab === 6 && <TabInfoPribadi mhs={mhs} />}
        {activeTab === 7 && (
          <TabSuratPenyelesaian
            items={data.syarat_penyelesaian ?? []}
            bebas={data.bebas_tanggungan}
            meta={data.checklist_meta}
          />
        )}
      </div>
    </div>
  )
}