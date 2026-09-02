import { useEffect, useMemo, useState } from "react"
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
      <div className="flex items-center justify-between p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-gray-500" />
          </div>
          <span className="text-sm text-gray-700 font-medium">{label}</span>
        </div>
        <button disabled className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed">
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
        <td className="py-3 px-3 text-sm text-gray-700">
          Semester {detail.semester}
        </td>
        <td className="py-3 px-3 text-sm text-gray-500">{detail.tahun}</td>
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
            className="text-xs text-[#263F93] font-medium flex items-center gap-1 hover:underline"
          >
            Lihat Detail Nilai
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} className="p-0">
            <div className="bg-gray-50 border-t border-b border-gray-100 px-4 py-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase w-8">No</th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Kode MK</th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Nama MK</th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">SKS</th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">Nilai Huruf</th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">Nilai Mutu</th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {detail.mataKuliah.map((mk, idx) => (
                    <tr key={mk.kode + "-" + idx} className={mk.lulus ? "" : "bg-red-50"}>
                      <td className="py-2 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="py-2 text-gray-600 text-xs font-mono">{mk.kode}</td>
                      <td className="py-2 text-gray-800 text-sm">{mk.nama}</td>
                      <td className="py-2 text-center text-gray-600 text-sm">{mk.sks}</td>
                      <td className="py-2 text-center font-semibold text-sm"
                        style={{ color: mk.lulus ? "#059669" : "#DC2626" }}>
                        {mk.nilaiHuruf}
                      </td>
                      <td className="py-2 text-center text-gray-600 text-sm">{mk.nilaiMutu.toFixed(1)}</td>
                      <td className="py-2 text-center">
                        {mk.lulus ? (
                          <span className="text-xs text-green-700 flex items-center justify-center gap-1">
                            <CheckCircle size={12} /> Lulus
                          </span>
                        ) : (
                          <span className="text-xs text-red-700 flex items-center justify-center gap-1">
                            <XCircle size={12} /> Belum Lulus
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td colSpan={7} className="pt-2 text-xs text-gray-500 font-medium">
                      Total SKS: {totalSks} | IPK: {detail.ipk.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function CustomLegend() {
  return (
    <div className="flex items-center gap-3 justify-center mt-1">
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "IPK Tertinggi", value: highest.toFixed(2), sub: `di Sem ${highestSem || "-"}` },
          { label: "IPK Terendah",  value: lowest.toFixed(2),  sub: `di Sem ${lowestSem || "-"}` },
          { label: "IPK Rata-rata", value: avg.toFixed(2),    sub: `dari ${ipkHistory.length} semester` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Grafik Progres IPK</h4>
        {chartData.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
            Belum ada data IPK.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
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
              />
              <YAxis domain={[2, 4]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
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
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Riwayat IPK per Semester</h4>
        {ipkHistory.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
            Belum ada data IPK.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-sm">
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
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            Mata Kuliah Belum Lulus
          </h4>
          <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-semibold text-amber-900 block mb-0.5">Perhatian:</span>
              Mahasiswa ini memiliki {belumLulus.length} MK belum lulus yang berpotensi menghambat KP/Skripsi
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Kode MK", "Nama MK", "SKS", "Nilai", "Semester Awal", "Status Perbaikan"].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.mk_belum_lulus.map((mk) => (
                  <tr key={mk.kode} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-600">{mk.kode}</td>
                    <td className="py-2.5 px-3 text-gray-800">{mk.nama}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600">{mk.sks}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-red-600">{mk.nilai}</td>
                    <td className="py-2.5 px-3 text-gray-500">Sem {mk.semesterAwal}</td>
                    <td className="py-2.5 px-3">
                      <div className="text-right">
                        {mk.statusPerbaikan === "belum" ? (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1 inline-flex">
                            <Clock size={12} /> Belum Diperbaiki
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1 inline-flex">
                            <CheckCircle size={12} /> Lulus di Sem {mk.lulusDiSem ?? "-"}
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

function TabPrestasi({ items }: { items: PrestasiItem[] }) {
  const [subTab, setSubTab] = useState<"Internasional" | "Nasional" | "Wilayah">("Internasional")
  const [modalItem, setModalItem] = useState<PrestasiItem | null>(null)

  const tiers = ["Internasional", "Nasional", "Wilayah"] as const
  const counts: Record<string, number> = {
    Internasional: items.filter((p) => p.tingkat === "Internasional").length,
    Nasional: items.filter((p) => p.tingkat === "Nasional").length,
    Wilayah: items.filter((p) => p.tingkat === "Wilayah").length,
  }
  const filtered = items.filter((p) => p.tingkat === subTab)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                subTab === t
                  ? "bg-[#263F93] text-white"
                  : "bg-[#F8FAFC] border border-[#E2E8F0] text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                subTab === t ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {counts[t]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">Tidak ada prestasi tingkat {subTab}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A72C]/10 flex items-center justify-center flex-shrink-0">
                  <Trophy size={18} className="text-[#D4A72C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 leading-snug">{p.nama}</div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${TingkatBadge(p.tingkat)}`}>
                      {p.tingkat}
                    </span>
                    {p.pencapaian && (
                      <span className="inline-block px-2 py-0.5 bg-[#D4A72C]/10 text-[#92700A] text-xs font-semibold rounded-full">
                        {p.pencapaian}
                      </span>
                    )}
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      2024/2025 Genap
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Building2 size={11} className="text-gray-400" />
                  {p.penyelenggara}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={11} className="text-[#263F93] ml-auto cursor-pointer hover:opacity-70" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-gray-400" />
                  {p.tanggalMulai} – {p.tanggalSelesai}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-gray-400" />
                  {p.tempat}
                </div>
              </div>
              <div className="flex gap-2">
                {p.fileSertifikat ? (
                  <a href={p.fileSertifikat} target="_blank" rel="noopener noreferrer" className="w-20 h-14 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0 hover:bg-blue-100">
                    <FileText size={16} className="text-blue-600" />
                    <span className="text-[10px] text-blue-700 leading-none">Sertifikat</span>
                  </a>
                ) : (
                  <PlaceholderThumb label="Foto Sertifikat" />
                )}
                {p.fileFoto ? (
                  <a href={p.fileFoto} target="_blank" rel="noopener noreferrer" className="w-20 h-14 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0 hover:bg-blue-100">
                    <FileText size={16} className="text-blue-600" />
                    <span className="text-[10px] text-blue-700 leading-none">Foto Podium</span>
                  </a>
                ) : (
                  <PlaceholderThumb label="Foto Podium" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(p.status)}`}>
                  {p.status}
                </span>
                <button
                  onClick={() => setModalItem(p)}
                  className="text-xs text-[#263F93] font-medium hover:underline"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg leading-snug">{modalItem.nama}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${TingkatBadge(modalItem.tingkat)}`}>
                    {modalItem.tingkat}
                  </span>
                  {modalItem.pencapaian && (
                    <span className="px-2 py-0.5 bg-[#D4A72C]/10 text-[#92700A] text-xs font-semibold rounded-full">
                      {modalItem.pencapaian}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadge(modalItem.status)}`}>
                    {modalItem.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setModalItem(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <XCircle size={20} />
              </button>
            </div>
            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">Penyelenggara</div>
                  <div className="font-medium text-gray-800">{modalItem.penyelenggara}</div>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">Tanggal Mulai</div>
                  <div className="font-medium text-gray-800">{modalItem.tanggalMulai}</div>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">Tanggal Selesai</div>
                  <div className="font-medium text-gray-800">{modalItem.tanggalSelesai}</div>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">Tempat</div>
                  <div className="font-medium text-gray-800">{modalItem.tempat}</div>
                </div>
                {modalItem.link && (
                  <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                    <div className="text-xs text-gray-400 mb-0.5">Link Penyelenggara</div>
                    <a href={modalItem.link} target="_blank" rel="noopener noreferrer"
                      className="font-medium text-[#263F93] hover:underline flex items-center gap-1 truncate">
                      <ExternalLink size={11} />
                      {modalItem.link.replace("https://", "")}
                    </a>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                <div className="text-gray-800">{modalItem.deskripsi}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Berkas</div>
              <FilePlaceholderCard label="Foto Sertifikat" fileUrl={modalItem.fileSertifikat} downloadType="prestasi" downloadId={modalItem.id} downloadField="file_sertifikat" />
              <FilePlaceholderCard label="Foto Podium" fileUrl={modalItem.fileFoto} downloadType="prestasi" downloadId={modalItem.id} downloadField="file_foto" />
            </div>
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

function TabOrganisasi({ items }: { items: OrganisasiItem[] }) {
  const [modalItem, setModalItem] = useState<OrganisasiItem | null>(null)

  if (items.length === 0) {
    return <div className="py-10 text-center text-gray-400 text-sm">Tidak ada data organisasi.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Users size={15} className="text-[#263F93]" /> Keaktifan Organisasi
        </h4>
      </div>
      {items.map((o) => (
        <div key={o.id} className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-[#263F93]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <div className="font-semibold text-sm text-gray-900">{o.nama}</div>
                {o.jenis && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    o.jenis === "Organisasi" ? "bg-blue-100 text-blue-700"
                      : o.jenis === "Kepanitiaan" ? "bg-purple-100 text-purple-700"
                      : "bg-teal-100 text-teal-700"
                  }`}>{o.jenis}</span>
                )}
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">
                  2024/2025 Genap
                </span>
              </div>
              <div className="text-xs text-gray-500">{o.jabatan}</div>
              <div className="text-xs text-gray-400 mt-0.5">{o.periodeMulai} – {o.periodeSelesai}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {o.fotoKegiatan ? (
              <a href={o.fotoKegiatan} target="_blank" rel="noopener noreferrer" className="w-20 h-14 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0 hover:bg-blue-100">
                <FileText size={16} className="text-blue-600" />
                <span className="text-[10px] text-blue-700 leading-none">Foto</span>
              </a>
            ) : (
              <PlaceholderThumb label="Foto Kegiatan" />
            )}
          </div>
          <button onClick={() => setModalItem(o)}
            className="w-full h-12 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-xs text-[#263F93] font-medium hover:bg-blue-50 hover:border-[#263F93]/30 transition-colors">
            <FileText size={13} /> Pratinjau SK Kepengurusan
          </button>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(o.status)}`}>
              {o.status}
            </span>
            <button onClick={() => setModalItem(o)}
              className="text-xs text-[#263F93] font-medium hover:underline">
              Lihat Detail
            </button>
          </div>
        </div>
      ))}

      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg leading-snug">{modalItem.nama}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {modalItem.jenis && (
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      modalItem.jenis === "Organisasi" ? "bg-blue-100 text-blue-700"
                        : modalItem.jenis === "Kepanitiaan" ? "bg-purple-100 text-purple-700"
                        : "bg-teal-100 text-teal-700"
                    }`}>{modalItem.jenis}</span>
                  )}
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadge(modalItem.status)}`}>
                    {modalItem.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setModalItem(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <XCircle size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">Jabatan</div>
                <div className="font-medium text-gray-800 text-sm">{modalItem.jabatan}</div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">Periode Mulai</div>
                <div className="font-medium text-gray-800 text-sm">{modalItem.periodeMulai}</div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">Periode Selesai</div>
                <div className="font-medium text-gray-800 text-sm">{modalItem.periodeSelesai}</div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                <div className="text-gray-800 text-sm">{modalItem.deskripsi}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Berkas</div>
              <FilePlaceholderCard label="Surat Keputusan (SK)" fileUrl={modalItem.fileSk} downloadType="organisasi" downloadId={modalItem.id} downloadField="file_sk" />
              <FilePlaceholderCard label="Foto Dokumentasi Kegiatan" fileUrl={modalItem.fotoKegiatan} downloadType="organisasi" downloadId={modalItem.id} downloadField="foto_kegiatan" />
            </div>
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

function TabPelatihan({ items }: { items: PelatihanItem[] }) {
  const [subTab, setSubTab] = useState<"Akademik" | "Non-Akademik">("Akademik")
  const [modalItem, setModalItem] = useState<PelatihanItem | null>(null)
  const [modalJenis, setModalJenis] = useState<"Akademik" | "Non-Akademik">("Akademik")

  const itemsAkademik = items.filter((p) => (p.jenis ?? "Akademik") === "Akademik")
  const itemsNonAkademik = items.filter((p) => (p.jenis ?? "Akademik") === "Non-Akademik")
  const current = subTab === "Akademik" ? itemsAkademik : itemsNonAkademik

  const openModal = (item: PelatihanItem, jenis: "Akademik" | "Non-Akademik") => {
    setModalItem(item)
    setModalJenis(jenis)
  }

  if (items.length === 0) {
    return <div className="py-10 text-center text-gray-400 text-sm">Tidak ada data pelatihan.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["Akademik", "Non-Akademik"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              subTab === t ? "bg-[#263F93] text-white"
                : "bg-[#F8FAFC] border border-[#E2E8F0] text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {current.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">Tidak ada pelatihan {subTab}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {current.map((item) => (
            <div key={item.id} className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={18} className="text-[#263F93]" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">{item.nama}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.penyelenggara}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-gray-400" />
                  {item.tanggalMulai} – {item.tanggalSelesai}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-gray-400" />
                  {item.tempat}
                </div>
              </div>
              <div className="flex gap-2">
                {item.sertifikat ? (
                  <a href={item.sertifikat} target="_blank" rel="noopener noreferrer" className="w-20 h-14 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0 hover:bg-blue-100">
                    <FileText size={16} className="text-blue-600" />
                    <span className="text-[10px] text-blue-700 leading-none">Sertifikat</span>
                  </a>
                ) : (
                  <PlaceholderThumb label="Sertifikat" />
                )}
                {item.fotoKegiatan ? (
                  <a href={item.fotoKegiatan} target="_blank" rel="noopener noreferrer" className="w-20 h-14 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0 hover:bg-blue-100">
                    <FileText size={16} className="text-blue-600" />
                    <span className="text-[10px] text-blue-700 leading-none">Foto</span>
                  </a>
                ) : (
                  <PlaceholderThumb label="Foto Kegiatan" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(item.status)}`}>
                  {item.status}
                </span>
                <button onClick={() => openModal(item, subTab)}
                  className="text-xs text-[#263F93] font-medium hover:underline">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg leading-snug">{modalItem.nama}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    modalJenis === "Akademik" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}>
                    {modalJenis}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadge(modalItem.status)}`}>
                    {modalItem.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setModalItem(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <XCircle size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">Penyelenggara</div>
                <div className="font-medium text-gray-800 text-sm">{modalItem.penyelenggara}</div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">Tanggal Mulai</div>
                <div className="font-medium text-gray-800 text-sm">{modalItem.tanggalMulai}</div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">Tanggal Selesai</div>
                <div className="font-medium text-gray-800 text-sm">{modalItem.tanggalSelesai}</div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">Tempat</div>
                <div className="font-medium text-gray-800 text-sm">{modalItem.tempat}</div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                <div className="text-gray-800 text-sm">{modalItem.deskripsi}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Berkas</div>
              <FilePlaceholderCard label="Sertifikat" fileUrl={modalItem.sertifikat} downloadType="pelatihan" downloadId={modalItem.id} downloadField="file_sertifikat" />
              <FilePlaceholderCard label="Foto Saat Kegiatan" fileUrl={modalItem.fotoKegiatan} downloadType="pelatihan" downloadId={modalItem.id} downloadField="foto_kegiatan" />
            </div>
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

function TabDokumen({ items, summary }: { items: DokumenWajib[]; summary: { total_wajib: number; total_disetujui: number } }) {
  const [modalItem, setModalItem] = useState<DokumenWajib | null>(null)

  const total = summary.total_wajib || items.length
  const approved = summary.total_disetujui || items.filter((d) => d.status === "Disetujui").length

  if (items.length === 0) {
    return <div className="py-10 text-center text-gray-400 text-sm">Tidak ada data dokumen.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Dokumen Kewajiban</h4>
        <span className="text-xs text-gray-500">{approved} dari {total} dokumen lengkap</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all"
          style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%`, background: "#22C55E" }} />
      </div>
      <div className="space-y-2.5">
        {items.map((d) => (
          <div key={d.id}
            className={`flex items-start gap-3 p-3.5 rounded-xl border-l-4 bg-white border border-[#E2E8F0] ${dokBorderColor(d.status)}`}>
            <FileText size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-800">{d.nama}</div>
              {d.tanggal && <div className="text-xs text-gray-400 mt-0.5">{d.tanggal}</div>}
              {d.catatan && <div className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded">Catatan: {d.catatan}</div>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
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
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{modalItem.nama}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                    {modalItem.tipe}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadge(modalItem.status)}`}>
                    {modalItem.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setModalItem(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <XCircle size={20} />
              </button>
            </div>
            <div className="space-y-2.5">
              {modalItem.tanggal && (
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">Tanggal</div>
                  <div className="font-medium text-gray-800 text-sm">{modalItem.tanggal}</div>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                <div className="text-gray-800 text-sm">{modalItem.deskripsi}</div>
              </div>
              {modalItem.catatan && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-red-500 mb-0.5">Catatan Penolakan</div>
                  <div className="text-red-700 text-sm">{modalItem.catatan}</div>
                </div>
              )}
            </div>
            {modalItem.status !== "Belum Diunggah" && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Berkas</div>
                <FilePlaceholderCard label={`Dokumen ${modalItem.nama}`} fileUrl={modalItem.fileUrl} downloadType="dokumen" downloadId={modalItem.id} downloadField="path_file" />
              </div>
            )}
            {modalItem.status === "Belum Diunggah" && (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
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
      <div className="space-y-5">
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="bg-[#263F93] px-6 py-4 flex items-center gap-4">
            <img src={logoItg} alt="Logo ITG"
              className="h-12 w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0" />
            <div className="text-white">
              <div className="font-bold text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</div>
              <div className="text-xs text-white/80 leading-snug">Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)</div>
            </div>
          </div>
          <div className="p-6 bg-white text-center text-sm text-gray-500">
            Mahasiswa ini belum pernah menerima Surat Peringatan.
          </div>
        </div>
      </div>
    )
  }

  const utama = spAktif ?? sp[0]

  return (
    <div className="space-y-5">
      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="bg-[#263F93] px-6 py-4 flex items-center gap-4">
          <img src={logoItg} alt="Logo ITG"
            className="h-12 w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0" />
          <div className="text-white">
            <div className="font-bold text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</div>
            <div className="text-xs text-white/80 leading-snug">Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)</div>
          </div>
        </div>
        <div className="p-6 space-y-4 bg-white">
          <div className="text-xs text-gray-500 space-y-0.5">
            <div>Nomor: <span className="font-mono font-medium text-gray-700">{utama.nomorSurat ?? "-"}</span></div>
            <div>Tanggal: <span className="font-medium text-gray-700">{utama.tanggal ?? "-"}</span></div>
            <div>Perihal: <span className="font-medium text-gray-700">Surat Peringatan {utama.level} ({utama.level}) Penerima KIP-K</span></div>
          </div>
          <div className="text-xs text-gray-500 space-y-0.5">
            <div className="font-medium text-gray-700">Kepada Yth.</div>
            <div>Sdra/i. {mhs.nama}</div>
            <div>NIM: {mhs.nim} | {mhs.prodi} | Semester {mhs.semester}</div>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {utama.alasan}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Riwayat Surat Peringatan</h4>
        <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-4">
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow" />
            <button onClick={() => setExpanded((v) => !v)}
              className="w-full text-left flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div>
                <span className="text-xs font-semibold text-amber-700">{utama.level} — {utama.status}</span>
                <div className="text-xs text-amber-600 mt-0.5">{utama.tanggal} · {utama.alasan}</div>
              </div>
              {expanded ? <ChevronUp size={14} className="text-amber-500" /> : <ChevronDown size={14} className="text-amber-500" />}
            </button>
            {expanded && (
              <div className="mt-2 p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-gray-600 space-y-1">
                <div><span className="font-medium">Nomor:</span> {utama.nomorSurat ?? "-"}</div>
                <div><span className="font-medium">Alasan:</span> {utama.alasan}</div>
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
    <div className="space-y-5">
      <div className="bg-gray-50 border border-[#E2E8F0] rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
        <Lock size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          RAHASIA — Data ini hanya dapat diakses oleh Pengelola KIP-K
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-full flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#263F93] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {inisial}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{mhs.nama}</div>
            <div className="text-sm text-gray-500">NIM {mhs.nim}</div>
          </div>
        </div>
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
            <div className="text-sm font-medium text-gray-800">{value}</div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Phone size={14} /> Riwayat Nomor Kontak
        </h4>
        {(mhs.contactHistories ?? []).length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
            Belum ada riwayat kontak.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-3">
            {mhs.contactHistories.map((c, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 border-white shadow ${
                  c.aktif ? "bg-green-400" : "bg-gray-300"
                }`} />
                <div className="flex items-center justify-between p-3 bg-white border border-[#E2E8F0] rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{c.nomor}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{c.sem ?? c.tanggal ?? ""}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
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
    <div className="space-y-5">
      <div className="flex items-center gap-4 p-4 bg-gray-50 border border-[#E2E8F0] rounded-xl">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <FileText size={22} className="text-gray-400" />
        </div>
        <div>
          <div className="font-semibold text-gray-700">
            {bebas ? `Permohonan ${bebas.status}` : "Belum Mengajukan"}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {bebas
              ? `Diajukan ${bebas.tanggal}`
              : "Mahasiswa belum mengajukan permohonan Surat Penyelesaian"}
          </div>
        </div>
        <span className="ml-auto text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium whitespace-nowrap">
          {fulfilled}/{total} syarat terpenuhi
        </span>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Persyaratan Surat Penyelesaian</h4>
        <div className="space-y-2">
          {items.map((s, i) => (
            <div key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                s.terpenuhi ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}>
              {s.terpenuhi
                ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                : <XCircle size={15} className="text-red-400 flex-shrink-0" />}
              <div className="flex-1">
                <span className={`text-sm block ${s.terpenuhi ? "text-green-800" : "text-red-700"}`}>
                  {s.nama}
                </span>
                {s.keterangan && (
                  <span className="text-xs text-gray-500">{s.keterangan}</span>
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
    api.get<DetailResponse>(`/prodi/mahasiswa/${id}/detail`)
      .then((res) => { if (active) setData(res) })
      .catch((err) => {
        if (active) setError(err?.message ?? "Gagal memuat data mahasiswa")
      })
      .finally(() => { if (active) setLoading(false); })
    return () => { active = false }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#263F93]"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-5">
        <Link to="../mahasiswa" relative="path" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft size={16} /> Manajemen Mahasiswa
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-6 text-center text-sm text-red-700">
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
    <div className="space-y-5 pb-10">
      <div className="bg-[#EDF0F8] border border-[#263F93]/20 rounded-xl px-4 py-3 text-sm text-[#263F93] flex items-center gap-2">
        <Info size={16} className="text-amber-500" />
        <span>
          Halaman ini bersifat read-only. Selain pengelola KIP-K tidak dapat
          melakukan perubahan data mahasiswa.
        </span>
      </div>

      {mhs.status === "Nonaktif" && (
        <div className="bg-amber-100 border border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2 font-medium">
          <AlertTriangle size={18} />
          Mahasiswa ini berstatus NONAKTIF
        </div>
      )}
      {mhs.status === "Dicabut" && (
        <div className="bg-red-100 border border-red-300 rounded-xl px-4 py-3 text-sm text-red-800 flex items-center gap-2 font-medium">
          <XCircle size={18} />
          KIP-K mahasiswa ini telah DICABUT{mhs.semesterDicabut ? ` pada Semester ${mhs.semesterDicabut}` : ""}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <Link to="../mahasiswa" relative="path"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft size={16} /> Manajemen Mahasiswa
        </Link>
        <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-[#263F93] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {inisial}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-bold text-xl text-gray-900">{mhs.nama}</h2>
              {spAktif && spAktif.level === "SP1" && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1">
                  <AlertTriangle size={11} /> SP1
                </span>
              )}
              {spAktif && (spAktif.level === "SP2" || spAktif.level === "SP3") && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1">
                  <AlertTriangle size={11} /> SP1
                </span>
              )}
              {hasSP2 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  <AlertTriangle size={11} /> SP2
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-3">
              {mhs.nim} · {mhs.prodi} · Angkatan {mhs.angkatan}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                mhs.kategori === "Reguler" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              }`}>
                {mhs.kategori}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                mhs.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {mhs.status}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>Progress Semester</span>
              <span className="font-semibold text-gray-700">Semester {semesterNum} dari {totalSem}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${progressPct}%`, background: "#263F93" }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{Math.max(0, totalSem - semesterNum)} semester tersisa</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-x-auto">
        <div className="flex min-w-max">
          {TAB_LABELS.map((label, i) => (
            <button key={label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === i
                  ? "border-[#263F93] text-[#263F93]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
        {activeTab === 0 && <TabRiwayatAkademik data={data} />}
        {activeTab === 1 && <TabPrestasi items={data.prestasi ?? []} />}
        {activeTab === 2 && <TabOrganisasi items={data.organisasi ?? []} />}
        {activeTab === 3 && <TabPelatihan items={data.pelatihan ?? []} />}
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