import { useState, useEffect, useMemo } from "react"
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
import { api } from "@/services/api"
import { getApprovalStatusBadge as statusBadge, getApprovalStatusBorder as dokBorderColor, ApprovalStatusIcon as StatusIcon } from "@/constants/status"
import { spHistoryData } from "@/data/mockData"
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";

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
  ips?: number
  ipk: number
  mataKuliah: MataKuliah[]
}

interface MahasiswaDetail {
  id: number
  nim: string
  nama: string
  prodi: string
  prodiNama?: string
  angkatan: number
  kategori: "Reguler" | "Aspirasi"
  status: "Aktif" | "Nonaktif" | "Lulus" | "Dicabut"
  semester?: number
  ipk?: number
  sp?: string | null
  semesterDicabut?: string | null
  tempatLahir?: string | null
  tanggalLahir?: string | null
  alamat?: string | null
  namaAyah?: string | null
  namaIbu?: string | null
  telAyah?: string | null
  telIbu?: string | null
  contactHistories?: { nomor: string; sem: string; aktif: boolean }[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type StatusType = "Disetujui" | "Menunggu" | "Menunggu Validasi" | "Ditolak" | "Belum Diunggah"

const tingkatBadge = (tingkat: string) => {
  if (tingkat === "Internasional") return "bg-purple-100 text-purple-700"
  if (tingkat === "Nasional") return "bg-blue-100 text-blue-700"
  if (tingkat === "Wilayah") return "bg-green-100 text-green-700"
  return "bg-gray-100 text-gray-500"
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlaceholderThumb({ label }: { label: string }) {
  return (
    <div className="w-20 h-14 bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0">
      <Image size={16} className="text-gray-400" />
      <span className="text-[10px] text-gray-400 leading-none">{label}</span>
    </div>
  )
}

function FilePlaceholderCard({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText size={14} className="text-gray-500" />
        </div>
        <span className="text-sm text-gray-700 font-medium">{label}</span>
      </div>
      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#263F93] border border-[#263F93]/30 rounded-lg hover:bg-[#263F93]/5 transition-colors">
        <Download size={12} />
        Unduh
      </button>
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
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase w-8">
                      No
                    </th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">
                      Kode MK
                    </th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">
                      Nama MK
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">
                      SKS
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">
                      Nilai Huruf
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">
                      Nilai Mutu
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {detail.mataKuliah.map((mk, idx) => (
                    <tr key={`${detail.semester}-${mk.kode}-${idx}`} className={mk.lulus ? "" : "bg-red-50"}>
                      <td className="py-2 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="py-2 text-gray-600 text-xs font-mono">
                        {mk.kode}
                      </td>
                      <td className="py-2 text-gray-800 text-sm">{mk.nama}</td>
                      <td className="py-2 text-center text-gray-600 text-sm">
                        {mk.sks}
                      </td>
                      <td
                        className="py-2 text-center font-semibold text-sm"
                        style={{ color: mk.lulus ? "#059669" : "#DC2626" }}
                      >
                        {mk.nilaiHuruf}
                      </td>
                      <td className="py-2 text-center text-gray-600 text-sm">
                        {mk.nilaiMutu.toFixed(1)}
                      </td>
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
          </td>
        </tr>
      )}
    </>
  )
}

// Custom legend renderer for recharts with gray text
function CustomLegend() {
  return (
    <div className="flex items-center gap-3 justify-center mt-1">
      <span
        className="flex items-center gap-1.5 text-xs"
        style={{ color: "#64748B" }}
      >
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ background: "#263F93" }}
        />
        IPK
      </span>
      <span
        className="flex items-center gap-1.5 text-xs"
        style={{ color: "#64748B" }}
      >
        <span className="inline-block w-5 border-t-2 border-dashed border-amber-500" />
        Batas Min 3.0
      </span>
    </div>
  )
}

// ── Tabs content ──────────────────────────────────────────────────────────────

function TabRiwayatAkademik({ semesterDetails }: { semesterDetails: SemesterDetail[] }) {
  const ipkHistory = useMemo(
    () =>
      [...semesterDetails]
        .sort((a, b) => a.semester - b.semester)
        .map((s) => ({ semester: s.semester, ipk: s.ipk })),
    [semesterDetails]
  )

  const highest = ipkHistory.length > 0 ? ipkHistory.reduce((a, b) => (a.ipk > b.ipk ? a : b)) : null
  const lowest = ipkHistory.length > 0 ? ipkHistory.reduce((a, b) => (a.ipk < b.ipk ? a : b)) : null
  const avg = ipkHistory.length > 0 ? ipkHistory.reduce((s, h) => s + h.ipk, 0) / ipkHistory.length : 0

  // Build mkBelumLulus from semesterDetails
  const mkBelumLulus = useMemo(() => {
    const seen = new Set<string>()
    const result: {
      kode: string
      nama: string
      sks: number
      nilai: string
      semesterAwal: number
      statusPerbaikan: "belum" | "lulus"
      lulusDiSem?: number
    }[] = []

    for (const sem of semesterDetails) {
      for (const mk of sem.mataKuliah) {
        if (mk.lulus) continue
        if (!seen.has(mk.kode)) {
          seen.add(mk.kode)
          result.push({
            kode: mk.kode,
            nama: mk.nama,
            sks: mk.sks,
            nilai: mk.nilaiHuruf,
            semesterAwal: sem.semester,
            statusPerbaikan: "belum",
          })
        } else {
          // already encountered as "belum" — check if a later entry shows "lulus"
          const idx = result.findIndex((r) => r.kode === mk.kode)
          if (idx >= 0) {
            // If this entry is "lulus", update the previous
            const prev = result[idx]
            if (prev.statusPerbaikan === "belum") {
              // Mark as lulus di sem ini
              result[idx] = {
                ...prev,
                statusPerbaikan: "lulus",
                lulusDiSem: sem.semester,
              }
            }
          }
        }
      }
    }
    return result
  }, [semesterDetails])

  const belumLulus = mkBelumLulus.filter((mk) => mk.statusPerbaikan === "belum")

  const chartData = ipkHistory.map((h) => ({ ...h, ipkVal: h.ipk }))

  if (semesterDetails.length === 0) {
    return (
      <div className="py-10 text-center text-gray-400 text-sm">
        Belum ada data akademik untuk mahasiswa ini.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "IPK Tertinggi",
            value: highest ? highest.ipk.toFixed(2) : "-",
            sub: highest ? `di Sem ${highest.semester}` : "-",
          },
          {
            label: "IPK Terendah",
            value: lowest ? lowest.ipk.toFixed(2) : "-",
            sub: lowest ? `di Sem ${lowest.semester}` : "-",
          },
          {
            label: "IPK Rata-rata",
            value: avg > 0 ? avg.toFixed(2) : "-",
            sub: `dari ${ipkHistory.length} semester`,
          },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-center"
          >
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">
              {label}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Area Chart */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Grafik Progres IPK
        </h4>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 5, left: 0 }}
          >
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
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #E2E8F0",
              }}
              formatter={(value) =>
                [(Number(value) || 0).toFixed(2), "IPK"] as [string, string]
              }
              labelFormatter={(label) => `Semester ${label}`}
            />
            <ReferenceLine
              y={3.0}
              stroke="#F59E0B"
              strokeDasharray="5 4"
              label={{
                value: "Min 3.0",
                fontSize: 10,
                fill: "#B45309",
                position: "right",
              }}
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

      {/* IPK History Table */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Riwayat IPK per Semester
        </h4>
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {[
                  "Semester",
                  "TA",
                  "IPK",
                  "Perubahan",
                  "MK Belum Lulus",
                  "Status Verifikasi",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {semesterDetails.map((detail, idx) => (
                <SemesterRow
                  key={detail.semester}
                  detail={detail}
                  prev={idx > 0 ? semesterDetails[idx - 1] : null}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MK Belum Lulus */}
      {mkBelumLulus.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            Mata Kuliah Belum Lulus
          </h4>
          <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle
              size={16}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-semibold text-amber-900 block mb-0.5">Perhatian:</span>
              Mahasiswa ini memiliki {belumLulus.length} MK belum lulus yang berpotensi menghambat KP/Skripsi
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {[
                    "Kode MK",
                    "Nama MK",
                    "SKS",
                    "Nilai",
                    "Semester Awal",
                    "Status Perbaikan",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mkBelumLulus.map((mk) => (
                  <tr
                    key={`${mk.kode}-${mk.semesterAwal}`}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-600">
                      {mk.kode}
                    </td>
                    <td className="py-2.5 px-3 text-gray-800">{mk.nama}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600">
                      {mk.sks}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-red-600">
                      {mk.nilai}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500">
                      Sem {mk.semesterAwal}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-right">
                        {mk.statusPerbaikan === "belum" ? (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1 inline-flex">
                            <Clock size={12} /> Belum Diperbaiki
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1 inline-flex">
                            <CheckCircle size={12} /> Lulus di Sem {mk.lulusDiSem}
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

function TabDokumen({ items }: { items: any[] }) {
  const [modalItem, setModalItem] = useState<any | null>(null)

  // Map of jenis → icon (preserve original icon mapping)
  const ICON_MAP: Record<string, any> = {
    "PKKMB": GraduationCap,
    "Bela Negara": Shield,
    "MABIM": Star,
    "Berita Acara KP": Briefcase,
    "Sertifikasi": Award,
    "Bukti Sidang Skripsi": BookOpen,
  }

  // Backend may not include "Belum Diunggah" rows; we synthesize them by comparing
  // the configured DokumenJenis vs uploaded ones.
  const approved = items.filter((d: any) => d.status === "Disetujui").length
  const total = items.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          Dokumen Kewajiban
        </h4>
        <span className="text-xs text-gray-500">
          {approved} dari {total} dokumen lengkap
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${total > 0 ? (approved / total) * 100 : 0}%`,
            background: "#22C55E",
          }}
        />
      </div>
      {items.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          Belum ada dokumen yang diunggah.
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((d: any) => {
            const Icon = ICON_MAP[d.nama] ?? FileText
            // Adapt BE field names → FE shape (BE uses `jenis`, `nama_file`, `tanggal_upload`, `file_url`)
            const nama = d.nama ?? d.jenis ?? "Dokumen"
            const tanggal = d.tanggal ?? d.tanggal_upload ?? null
            const status = d.status ?? "Belum Diunggah"
            return (
              <div
                key={d.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border-l-4 bg-white border border-[#E2E8F0] ${dokBorderColor(status)}`}
              >
                <Icon size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-800">
                    {nama}
                  </div>
                  {tanggal && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {tanggal}
                    </div>
                  )}
                  {d.catatan && (
                    <div className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded">
                      Catatan: {d.catatan}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${statusBadge(status)}`}
                  >
                    {status}
                  </span>
                  <button
                    onClick={() => setModalItem({ ...d, nama, tanggal, status })}
                    className="text-xs text-[#263F93] font-medium hover:underline whitespace-nowrap"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail Modal – read-only */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {modalItem.nama}
                </h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                    {modalItem.tipe ?? "Dokumen"}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadge(modalItem.status)}`}
                  >
                    {modalItem.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-2.5">
              {modalItem.tanggal && (
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">Tanggal</div>
                  <div className="font-medium text-gray-800 text-sm">
                    {modalItem.tanggal}
                  </div>
                </div>
              )}
              {modalItem.deskripsi && (
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                  <div className="text-gray-800 text-sm">
                    {modalItem.deskripsi}
                  </div>
                </div>
              )}
              {modalItem.catatan && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-red-500 mb-0.5">
                    Catatan Penolakan
                  </div>
                  <div className="text-red-700 text-sm">
                    {modalItem.catatan}
                  </div>
                </div>
              )}
            </div>

            {/* File placeholder */}
            {modalItem.status !== "Belum Diunggah" && (modalItem.fileUrl || modalItem.file_url) && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Berkas
                </div>
                <a
                  href={modalItem.fileUrl ?? modalItem.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 border border-[#E2E8F0] rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{modalItem.nama_file ?? `Dokumen ${modalItem.nama}`}</span>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#263F93] border border-[#263F93]/30 rounded-lg hover:bg-[#263F93]/5 transition-colors">
                    <Download size={12} />
                    Unduh
                  </span>
                </a>
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalItem(null)}
                className="px-5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TabSP({ items }: { items: any[] }) {
  const [expanded, setExpanded] = useState(true)

  const fmtDate = (s?: string) => {
    if (!s) return "-"
    return new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  }

  if (items.length === 0) {
    return (
      <div className="space-y-5">
        <div className="py-10 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          Belum ada Surat Peringatan untuk mahasiswa ini.
        </div>
      </div>
    )
  }

  // Use the first/most recent SP as the "formal letter" (matches original FE pattern)
  const primary = items[0]

  return (
    <div className="space-y-5">
      {/* Formal letter */}
      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Kop Surat */}
        <div className="bg-[#263F93] px-6 py-4 flex items-center gap-4">
          <img
            src={logoItg}
            alt="Logo ITG"
            className="h-12 w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0"
          />
          <div className="text-white">
            <div className="font-bold text-sm leading-snug">
              INSTITUT TEKNOLOGI GARUT
            </div>
            <div className="text-xs text-white/80 leading-snug">
              Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)
            </div>
          </div>
        </div>
        {/* Letter body */}
        <div className="p-6 space-y-4 bg-white">
          <div className="text-xs text-gray-500 space-y-0.5">
            <div>
              Nomor:{" "}
              <span className="font-mono font-medium text-gray-700">
                {primary.nomorSurat ?? "-"}
              </span>
            </div>
            <div>
              Tanggal:{" "}
              <span className="font-medium text-gray-700">
                {primary.tanggal ?? fmtDate(primary.tanggalTerbit)}
              </span>
            </div>
            <div>
              Perihal:{" "}
              <span className="font-medium text-gray-700">
                Surat Peringatan {primary.level} ({(primary.level ?? "")}) Penerima KIP-K
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 space-y-0.5">
            <div className="font-medium text-gray-700">Kepada Yth.</div>
            <div>Sdra/i. {primary.nama ?? "-"}</div>
            <div>
              NIM: {primary.nim ?? "-"} | {primary.prodi ?? "-"} | Semester {primary.semester ?? "-"}
            </div>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {primary.alasan ?? primary.deskripsi ?? "-"}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Riwayat Surat Peringatan
        </h4>
        <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-4">
          {spHistoryData.map((sp: any, idx: number) => {
            return (
              <div key={idx} className="relative">
                <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 border-white shadow bg-amber-400" />
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-amber-700">
                      {sp.level} — {sp.tahunAjaran}
                    </span>
                    <div className="text-xs text-amber-600 mt-0.5">
                      {sp.tanggal} · {sp.alasan}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Tab 7 (Informasi Pribadi) – read-only
function TabInfoPribadi({ mhs }: { mhs: MahasiswaDetail }) {
  const items = [
    { icon: User, label: "Nama Lengkap", value: mhs.nama },
    { icon: FileText, label: "NIM", value: mhs.nim },
    {
      icon: Calendar,
      label: "Tempat, Tgl Lahir",
      value:
        mhs.tempatLahir && mhs.tanggalLahir
          ? `${mhs.tempatLahir}, ${mhs.tanggalLahir}`
          : mhs.tempatLahir ?? mhs.tanggalLahir ?? "-",
    },
    { icon: MapPin, label: "Alamat", value: mhs.alamat ?? "-" },
    { icon: User, label: "Nama Ayah", value: mhs.namaAyah ?? "-" },
    { icon: User, label: "Nama Ibu", value: mhs.namaIbu ?? "-" },
    { icon: Phone, label: "No. Telepon Ayah", value: mhs.telAyah ?? "-" },
    { icon: Phone, label: "No. Telepon Ibu", value: mhs.telIbu ?? "-" },
  ]

  return (
    <div className="space-y-5">
      {/* Alert */}
      <div className="bg-gray-50 border border-[#E2E8F0] rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
        <Lock size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          RAHASIA — Data ini hanya dapat diakses oleh Pengelola KIP-K
        </span>
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Avatar */}
        <div className="col-span-full flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#263F93] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {(mhs.nama ?? "?").charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{mhs.nama}</div>
            <div className="text-sm text-gray-500">NIM {mhs.nim}</div>
          </div>
        </div>

        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
            <div className="text-sm font-medium text-gray-800">{value}</div>
          </div>
        ))}
      </div>

      {/* Riwayat kontak */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Phone size={14} /> Riwayat Nomor Kontak
        </h4>
        {(!mhs.contactHistories || mhs.contactHistories.length === 0) ? (
          <div className="py-6 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
            Belum ada riwayat kontak.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-3">
            {mhs.contactHistories.map((c, i) => (
              <div key={i} className="relative">
                <div
                  className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 border-white shadow ${
                    c.aktif ? "bg-green-400" : "bg-gray-300"
                  }`}
                />
                <div className="flex items-center justify-between p-3 bg-white border border-[#E2E8F0] rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {c.nomor}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {c.sem}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.aktif
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.aktif ? "Aktif" : "Tidak Aktif"}
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

// Tab 8 (Surat Penyelesaian)
function TabSuratPenyelesaian({ checklist }: { checklist?: { nama?: string; syarat?: string; terpenuhi: boolean }[] }) {
  // BE checklist uses `syarat` not `nama`. Normalize here.
  const list = (checklist ?? []).map((s) => ({ nama: s.nama ?? s.syarat ?? "", terpenuhi: !!s.terpenuhi }))
  const fulfilled = list.filter((s) => s.terpenuhi).length
  const total = list.length

  return (
    <div className="space-y-5">
      {/* Status card */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 border border-[#E2E8F0] rounded-xl">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <FileText size={22} className="text-gray-400" />
        </div>
        <div>
          <div className="font-semibold text-gray-700">
            {total === 0 ? "Belum ada data" : fulfilled === total ? "Siap Mengajukan" : "Belum Mengajukan"}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {total === 0
              ? "Belum ada data surat penyelesaian untuk mahasiswa ini."
              : `Mahasiswa ${fulfilled === total ? "siap" : "belum siap"} mengajukan permohonan Surat Penyelesaian`}
          </div>
        </div>
        <span className="ml-auto text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium whitespace-nowrap">
          {fulfilled}/{total} syarat terpenuhi
        </span>
      </div>

      {/* Checklist */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Persyaratan Surat Penyelesaian
        </h4>
        {list.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
            Belum ada persyaratan yang tercatat.
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  s.terpenuhi
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                {s.terpenuhi ? (
                  <CheckCircle
                    size={15}
                    className="text-green-500 flex-shrink-0"
                  />
                ) : (
                  <XCircle size={15} className="text-red-400 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    s.terpenuhi ? "text-green-800" : "text-red-700"
                  }`}
                >
                  {s.nama}
                </span>
              </div>
            ))}
          </div>
        )}
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

export default function WarekMahasiswaDetail() {
  const { id } = useParams<{ id: string }>()
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran())
  const [activeTab, setActiveTab] = useState(0)

  const [mhs, setMhs] = useState<MahasiswaDetail | null>(null)
  const [progress, setProgress] = useState<{ semesterAktif: number; totalSemester: number; progressPct: number } | null>(null)
  const [semesterDetails, setSemesterDetails] = useState<SemesterDetail[]>([])
  const [prestasi, setPrestasi] = useState<any[]>([])
  const [organisasi, setOrganisasi] = useState<any[]>([])
  const [pelatihan, setPelatihan] = useState<any[]>([])
  const [dokumen, setDokumen] = useState<any[]>([])
  const [spList, setSpList] = useState<any[]>([])
  const [bebasTanggungan, setBebasTanggungan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [showRes, ipkRes, prestasiRes, organisasiRes, pelatihanRes, dokumenRes, spRes, bebasRes] = await Promise.all([
          api.get<{ data: MahasiswaDetail; progress: any }>(`/mahasiswa/${id}?tahun_ajaran=${tahunAjaran}`),
          api.get<{ data: SemesterDetail[] }>(`/mahasiswa/${id}/ipk?tahun_ajaran=${tahunAjaran}`),
          api.get<{ data: any[] }>(`/mahasiswa/${id}/prestasi?tahun_ajaran=${tahunAjaran}`),
          api.get<{ data: any[] }>(`/mahasiswa/${id}/organisasi?tahun_ajaran=${tahunAjaran}`),
          api.get<{ data: any[] }>(`/mahasiswa/${id}/pelatihan?tahun_ajaran=${tahunAjaran}`),
          api.get<{ data: any[] }>(`/mahasiswa/${id}/dokumen?tahun_ajaran=${tahunAjaran}`),
          api.get<{ data: any[] }>(`/mahasiswa/${id}/sp?tahun_ajaran=${tahunAjaran}`).catch(() => ({ data: [] as any[] })),
          api.get<{ checklist: { nama: string; terpenuhi: boolean }[] }>(`/mahasiswa/${id}/bebas-tanggungan?tahun_ajaran=${tahunAjaran}`).catch(() => ({ checklist: [] })),
        ])

        if (cancelled) return

        setMhs(showRes.data)
        setProgress(showRes.progress)
        // Sort IPK ascending for display
        const sems = (ipkRes.data ?? []).slice().sort((a, b) => a.semester - b.semester)
        setSemesterDetails(sems)
        setPrestasi(prestasiRes.data ?? [])
        setOrganisasi(organisasiRes.data ?? [])
        setPelatihan(pelatihanRes.data ?? [])
        setDokumen(dokumenRes.data ?? [])
        setSpList(spRes.data ?? [])
        setBebasTanggungan(bebasRes)

        setLoading(false)
      } catch (e: any) {
        if (cancelled) return
        setError(e.message ?? "Gagal memuat detail mahasiswa.")
        setLoading(false)
      }
    }
    fetchAll()

    return () => {
      cancelled = true;
    }
  }, [id, tahunAjaran])

  if (loading) {
    return (
      <div className="space-y-5 pb-10">
        <div className="bg-white rounded-xl p-10 text-center text-sm text-gray-400">
          Memuat data mahasiswa...
        </div>
      </div>
    )
  }

  if (error || !mhs) {
    return (
      <div className="space-y-5 pb-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-700">
          {error ?? "Mahasiswa tidak ditemukan."}
        </div>
      </div>
    )
  }

  const hasSP2 = mhs.sp === "SP2" || mhs.sp === "SP3"

  const semesterNum = mhs.semester ?? progress?.semesterAktif ?? 0
  const totalSem = progress?.totalSemester ?? 8
  const progressPct = progress?.progressPct ?? (semesterNum > 0 ? Math.round((semesterNum / totalSem) * 100) : 0)

  return (
    <div className="space-y-5 pb-10">
      {/* Read-only info banner */}
      <div className="bg-[#EDF0F8] border border-[#263F93]/20 rounded-xl px-4 py-3 text-sm text-[#263F93] flex items-center gap-2">
        <Info size={16} className="text-amber-500" />
        <span>
          Halaman ini bersifat read-only. Selain pengelola KIP-K tidak dapat
          melakukan perubahan data mahasiswa.
        </span>
      </div>

      {/* Status Banner */}
      {mhs.status === "Nonaktif" && (
        <div className="bg-amber-100 border border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2 font-medium">
          <AlertTriangle size={18} />
          Mahasiswa ini berstatus NONAKTIF
        </div>
      )}
      {mhs.status === "Dicabut" && (
        <div className="bg-red-100 border border-red-300 rounded-xl px-4 py-3 text-sm text-red-800 flex items-center gap-2 font-medium">
          <XCircle size={18} />
          KIP-K mahasiswa ini telah DICABUT pada Semester {mhs.semester}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center justify-between gap-3">
        <Link to="../mahasiswa" relative="path"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft size={16} /> Data Mahasiswa
        </Link>
        <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
        <div className="flex flex-wrap items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#263F93] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {(mhs.nama ?? "?").charAt(0)}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-bold text-xl text-gray-900">{mhs.nama}</h2>
              {/* SP Badges */}
              {mhs.sp && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1">
                  <AlertTriangle size={11} /> {mhs.sp}
                </span>
              )}
              {hasSP2 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  <AlertTriangle size={11} /> SP2
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-3">
              {mhs.nim} · {mhs.prodi ?? mhs.prodiNama} · Angkatan {mhs.angkatan}
            </p>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  mhs.kategori === "Reguler"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {mhs.kategori}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  mhs.status === "Aktif"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {mhs.status}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>Progress Semester</span>
              <span className="font-semibold text-gray-700">
                Semester {semesterNum} dari {totalSem}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progressPct}%`, background: "#263F93" }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {Math.max(0, totalSem - semesterNum)} semester tersisa
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-x-auto">
        <div className="flex min-w-max">
          {TAB_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === i
                  ? "border-[#263F93] text-[#263F93]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
        {activeTab === 0 && <TabRiwayatAkademik semesterDetails={semesterDetails} />}
        {activeTab === 1 && <TabPrestasi data={prestasi} loading={false} error={null} />}
        {activeTab === 2 && <TabOrganisasi data={organisasi} loading={false} error={null} />}
        {activeTab === 3 && <TabPelatihan data={pelatihan} loading={false} error={null} />}
        {activeTab === 4 && <TabDokumen items={dokumen} />}
        {activeTab === 5 && <TabSP items={spList} />}
        {activeTab === 6 && <TabInfoPribadi mhs={mhs} />}
        {activeTab === 7 && <TabSuratPenyelesaian checklist={bebasTanggungan?.checklist} />}
      </div>
    </div>
  )
}
