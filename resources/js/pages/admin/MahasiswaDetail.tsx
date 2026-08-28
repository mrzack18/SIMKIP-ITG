import React, { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
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
  Save,
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
  UserMinus,
  UserX,
  UserCheck,
  Loader2,
  BarChart,
  Folder,
  Printer,
} from "lucide-react"
import {
  getMahasiswaById,
  getMahasiswaIpk,
  getMahasiswaPrestasi,
  getMahasiswaOrganisasi,
  getMahasiswaPelatihan,
  getMahasiswaSpHistory,
  getMahasiswaDokumen,
  getMahasiswaBebasTanggungan,
  updateMahasiswaStatus,
  cabutKipkMahasiswa,
  type SemesterDetailBE,
} from "@/services/mahasiswaService"
import type { Mahasiswa, MataKuliah, SemesterDetail, MahasiswaBebasTanggunganResponse } from "@/types"
import logoItg from "@/imports/logo_itg.jpg"

type StatusType = "Disetujui" | "Menunggu" | "Menunggu Validasi" | "Ditolak" | "Belum Diunggah"

const statusBadge = (status: StatusType | string) => {
  const map: Record<string, string> = {
    Disetujui: "bg-green-100 text-green-700",
    Menunggu: "bg-amber-100 text-amber-700",
    "Menunggu Validasi": "bg-amber-100 text-amber-700",
    Ditolak: "bg-red-100 text-red-700",
    "Belum Diunggah": "bg-gray-100 text-gray-500",
  }
  return map[status] ?? "bg-gray-100 text-gray-500"
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "Disetujui")
    return <CheckCircle size={14} className="text-green-500" />
  if (status === "Menunggu" || status === "Menunggu Validasi")
    return <Clock size={14} className="text-amber-500" />
  if (status === "Ditolak")
    return <XCircle size={14} className="text-red-500" />
  return <FileText size={14} className="text-gray-400" />
}

const dokBorderColor = (status: string) => {
  if (status === "Disetujui") return "border-green-500"
  if (status === "Menunggu" || status === "Menunggu Validasi")
    return "border-amber-500"
  if (status === "Ditolak") return "border-red-500"
  return "border-gray-300"
}

function PlaceholderThumb({ label }: { label: string }) {
  return (
    <div className="w-20 h-14 bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 flex-shrink-0">
      <Image size={16} className="text-gray-400" />
      <span className="text-[10px] text-gray-400 leading-none">{label}</span>
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
                    <tr key={mk.kode} className={mk.lulus ? "" : "bg-red-50"}>
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

function BackendNotReady({ feature }: { feature: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-900">
          {feature} akan tersedia setelah endpoint backend diimplementasi
        </p>
        <p className="text-xs text-amber-700 mt-1">
          Halaman ini sudah ter-render dengan aman, namun data belum diambil dari API sampai endpoint terkait tersedia.
        </p>
      </div>
    </div>
  )
}

function TabRiwayatAkademik({ data, loading, error }: { data: SemesterDetailBE[]; loading: boolean; error?: any }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data akademik...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Riwayat Akademik" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Terjadi kesalahan: {error.message || "Gagal memuat data akademik."}
      </div>
    )
  }
  if (!data.length) {
    return (
      <div className="space-y-5">
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden p-6 bg-white text-center text-sm text-gray-500">
          Belum ada riwayat akademik untuk mahasiswa ini.
        </div>
      </div>
    )
  }

  const semesterDetails: SemesterDetail[] = data.map((s) => ({
    semester: s.semester,
    tahun: s.tahun,
    ipk: s.ipk,
    mataKuliah: s.mataKuliah.map((mk) => ({
      kode: mk.kode,
      nama: mk.nama,
      sks: mk.sks,
      nilaiHuruf: mk.nilaiHuruf,
      nilaiMutu: mk.nilaiMutu,
      lulus: mk.lulus,
    })),
  }))

  const highest = semesterDetails.reduce((a, b) => (a.ipk > b.ipk ? a : b))
  const lowest = semesterDetails.reduce((a, b) => (a.ipk < b.ipk ? a : b))
  const avg = semesterDetails.reduce((s, h) => s + h.ipk, 0) / semesterDetails.length

  // MK yang belum lulus (semua semester)
  const belumLulus: MataKuliah[] = []
  for (const sd of semesterDetails) {
    for (const mk of sd.mataKuliah) {
      if (!mk.lulus && !belumLulus.find((b) => b.kode === mk.kode)) {
        belumLulus.push(mk)
      }
    }
  }

  const chartData = semesterDetails.map((s) => ({
    semester: s.semester,
    ipk: s.ipk,
    ipkVal: s.ipk,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "IPK Tertinggi",
            value: highest.ipk.toFixed(2),
            sub: `di Sem ${highest.semester}`,
          },
          {
            label: "IPK Terendah",
            value: lowest.ipk.toFixed(2),
            sub: `di Sem ${lowest.semester}`,
          },
          {
            label: "IPK Rata-rata",
            value: avg.toFixed(2),
            sub: `dari ${semesterDetails.length} semester`,
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

      {belumLulus.length > 0 && (
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
              <span className="font-semibold text-amber-900 block mb-0.5">
                Perhatian:
              </span>
              Mahasiswa ini memiliki {belumLulus.length} MK belum lulus yang
              berpotensi menghambat KP/Skripsi
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
                    "Status",
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
                {belumLulus.map((mk) => (
                  <tr
                    key={mk.kode}
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
                      {mk.nilaiHuruf}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-right">
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 inline-flex">
                          <Clock size={12} /> Belum Diperbaiki
                        </span>
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

function TabPrestasi({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  const [subTab, setSubTab] =
    useState<"Internasional" | "Nasional" | "Wilayah">("Internasional")
  const [modalItem, setModalItem] = useState<any | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data prestasi...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Prestasi" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Terjadi kesalahan: {error.message || "Gagal memuat data prestasi."}
      </div>
    )
  }

  const tiers = ["Internasional", "Nasional", "Wilayah"] as const
  const counts: Record<string, number> = {
    Internasional: data.filter((p) => p.tingkat === "Internasional").length,
    Nasional: data.filter((p) => p.tingkat === "Nasional").length,
    Wilayah: data.filter((p) => p.tingkat === "Wilayah").length,
  }
  const filtered = data.filter(
    (p) => p.tingkat === subTab && (p.status === "Disetujui" || p.status === "approved"),
  )

  const tingkatBadgeStyle = (tingkat: string) => {
    if (tingkat === "Internasional") return "bg-purple-100 text-purple-700"
    if (tingkat === "Nasional") return "bg-blue-100 text-blue-700"
    return "bg-green-100 text-green-700"
  }

  const fmtDate = (iso: string) => {
    if (!iso) return "—"
    const d = new Date(iso)
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-4">
      <div className="flex border-b border-[#E2E8F0]">
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              subTab === t
                ? "bg-[#263F93] text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                subTab === t
                  ? "bg-[#D4A72C] text-[#263F93]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-1">
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} prestasi tingkat {subTab.toLowerCase()}
        </p>

        {filtered.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#263F93]/10">
              <Trophy size={24} className="text-[#263F93]" />
            </div>
            <p className="text-gray-500 text-sm">
              Tidak ada prestasi tingkat {subTab.toLowerCase()}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#263F93]/10"
                  >
                    <Trophy
                      size={18}
                      style={{
                        color: "#D4A72C",
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug">
                      {p.namaPrestasi || p.nama}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {p.pencapaian && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-[#263F93]">
                          {p.pencapaian}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusBadge(p.status)}`}
                      >
                        <StatusIcon status={p.status} /> {p.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Trophy size={11} className="text-gray-400 flex-shrink-0" />
                    <span>{p.penyelenggara}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                    <span>
                      {fmtDate(p.tanggalMulai)} – {fmtDate(p.tanggalSelesai)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                    <span>{p.tempat}</span>
                  </div>
                </div>

                {p.catatanAdmin && (
                  <div className="mb-3 flex items-start gap-2 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertTriangle
                      size={12}
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-red-700">
                      <span className="font-medium">Catatan:</span>{" "}
                      {p.catatanAdmin}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setModalItem(p)}
                  className="w-full py-1.5 rounded-lg border border-[#263F93] text-xs text-[#263F93] hover:bg-[#EDF0F8] transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink size={12} /> Lihat Detail
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-gray-800">Detail Prestasi</h3>
              <button
                onClick={() => setModalItem(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#263F93]/10">
                  <Trophy
                    size={22}
                    style={{
                      color: "#D4A72C",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">
                    {modalItem.namaPrestasi || modalItem.nama}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${tingkatBadgeStyle(modalItem.tingkat)}`}
                    >
                      {modalItem.tingkat}
                    </span>
                    {modalItem.pencapaian && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#F5EDD4] text-[#B8860B]">
                        {modalItem.pencapaian}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusBadge(modalItem.status)}`}
                    >
                      <StatusIcon status={modalItem.status} /> {modalItem.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <Building2 size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Penyelenggara:</span>
                    <span className="font-medium text-gray-700">{modalItem.penyelenggara}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tanggal:</span>
                    <span className="font-medium text-gray-700">
                      {fmtDate(modalItem.tanggalMulai)} – {fmtDate(modalItem.tanggalSelesai)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tempat:</span>
                    <span className="font-medium text-gray-700">{modalItem.tempat}</span>
                  </div>
                </div>
              </div>

              {modalItem.deskripsi && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-gray-700">{modalItem.deskripsi}</p>
                </div>
              )}

              {modalItem.linkPenyelenggara && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Link Penyelenggara</p>
                  <a
                    href={modalItem.linkPenyelenggara}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-1.5 hover:underline text-[#263F93]"
                  >
                    <ExternalLink size={12} /> {modalItem.linkPenyelenggara}
                  </a>
                </div>
              )}

              {modalItem.catatanAdmin && (
                <div className="flex items-start gap-2 bg-red-50 px-3 py-2.5 rounded-xl">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Catatan Admin:</span> {modalItem.catatanAdmin}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Foto Sertifikat</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <FileText size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {modalItem.fileSertifikat ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {modalItem.fileSertifikat && (
                      <a
                        href={modalItem.fileSertifikat}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline"
                      >
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Foto Podium</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <Image size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {modalItem.fileFoto ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {modalItem.fileFoto && (
                      <a
                        href={modalItem.fileFoto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline"
                      >
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#E2E8F0] flex-shrink-0">
              <button
                onClick={() => setModalItem(null)}
                className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
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

function TabOrganisasi({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data organisasi...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Keaktifan Organisasi" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Terjadi kesalahan: {error.message || "Gagal memuat data organisasi."}
      </div>
    )
  }
  if (!data.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users size={15} className="text-[#263F93]" /> Keaktifan Organisasi
          </h4>
        </div>
        <div className="py-10 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          Belum ada data organisasi.
        </div>
      </div>
    )
  }

  const fmtMonth = (ym: string) => {
    if (!ym) return "—"
    const [y, m] = ym.split("-")
    const names = ["Jan","Feb","Mar","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]
    return `${names[parseInt(m) - 1] || ""} ${y}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Users size={15} className="text-[#263F93]" /> Keaktifan Organisasi
        </h4>
      </div>
      {data.map((o) => (
        <div
          key={o.id}
          className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-[#263F93]" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">{o.nama}</div>
              <div className="text-xs text-gray-500 mt-0.5">{o.jabatan}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {fmtMonth(o.mulai)} – {fmtMonth(o.selesai)}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedOrg(o)}
            className="w-full h-12 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-xs text-[#263F93] font-medium hover:bg-blue-50 hover:border-[#263F93]/30 transition-colors"
          >
            <FileText size={13} /> Pratinjau SK Kepengurusan
          </button>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(o.status)}`}>
              {o.status}
            </span>
            <button
              onClick={() => setSelectedOrg(o)}
              className="text-xs text-[#263F93] font-medium hover:underline"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      ))}

      {selectedOrg && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrg(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-gray-800">Detail Organisasi</h3>
              <button
                onClick={() => setSelectedOrg(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <Users size={22} className="text-[#263F93]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">{selectedOrg.nama}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      {selectedOrg.jenis || "Organisasi"}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusBadge(selectedOrg.status)}`}>
                      <StatusIcon status={selectedOrg.status} /> {selectedOrg.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{selectedOrg.jabatan}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 mr-1">Periode:</span>
                <span className="font-medium text-gray-700">
                  {fmtMonth(selectedOrg.mulai)} → {fmtMonth(selectedOrg.selesai)}
                </span>
              </div>
              {selectedOrg.deskripsi && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-gray-700">{selectedOrg.deskripsi}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">SK Kepengurusan</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <FileText size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {selectedOrg.fileSk ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {selectedOrg.fileSk && (
                      <a href={selectedOrg.fileSk} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Foto Kegiatan</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <Image size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {selectedOrg.fotoKegiatan ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {selectedOrg.fotoKegiatan && (
                      <a href={selectedOrg.fotoKegiatan} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#E2E8F0] flex-shrink-0">
              <button
                onClick={() => setSelectedOrg(null)}
                className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
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

function TabPelatihan({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  const [subTab, setSubTab] = useState<"Akademik" | "Non-Akademik">("Akademik")
  const [selectedPelatihan, setSelectedPelatihan] = useState<any | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data pelatihan...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Pelatihan" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Terjadi kesalahan: {error.message || "Gagal memuat data pelatihan."}
      </div>
    )
  }
  if (!data.length) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["Akademik", "Non-Akademik"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                subTab === t
                  ? "bg-[#263F93] text-white"
                  : "bg-[#F8FAFC] border border-[#E2E8F0] text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-10 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          Belum ada data pelatihan.
        </div>
      </div>
    )
  }

  const items = data.filter((p) =>
    subTab === "Akademik" ? p.jenis === "Akademik" : p.jenis === "Non-Akademik",
  )

  const fmtDate = (iso: string) => {
    if (!iso) return "—"
    const d = new Date(iso)
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["Akademik", "Non-Akademik"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              subTab === t
                ? "bg-[#263F93] text-white"
                : "bg-[#F8FAFC] border border-[#E2E8F0] text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          Belum ada pelatihan {subTab.toLowerCase()}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3"
            >
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
                  {fmtDate(item.tanggalMulai)} – {fmtDate(item.tanggalSelesai)}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-gray-400" />
                  {item.tempat}
                </div>
              </div>
              <PlaceholderThumb label="Sertifikat" />
              <div className="flex items-center justify-between">
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(item.status)}`}>
                  {item.status}
                </span>
                <button
                  onClick={() => setSelectedPelatihan(item)}
                  className="text-xs text-[#263F93] font-medium hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={11} /> Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPelatihan && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedPelatihan(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-gray-800">Detail Pelatihan</h3>
              <button
                onClick={() => setSelectedPelatihan(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={22} className="text-[#263F93]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">{selectedPelatihan.nama}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        selectedPelatihan.jenis === "Akademik"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {selectedPelatihan.jenis}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusBadge(selectedPelatihan.status)}`}>
                      <StatusIcon status={selectedPelatihan.status} /> {selectedPelatihan.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <Building2 size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Penyelenggara:</span>
                    <span className="font-medium text-gray-700">{selectedPelatihan.penyelenggara}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tanggal:</span>
                    <span className="font-medium text-gray-700">
                      {fmtDate(selectedPelatihan.tanggalMulai)} → {fmtDate(selectedPelatihan.tanggalSelesai)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tempat:</span>
                    <span className="font-medium text-gray-700">{selectedPelatihan.tempat}</span>
                  </div>
                </div>
              </div>
              {selectedPelatihan.deskripsi && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-gray-700">{selectedPelatihan.deskripsi}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Sertifikat</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <FileText size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {selectedPelatihan.sertifikat || selectedPelatihan.fileSertifikat ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {(selectedPelatihan.sertifikat || selectedPelatihan.fileSertifikat) && (
                      <a href={selectedPelatihan.sertifikat || selectedPelatihan.fileSertifikat} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Foto Kegiatan</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <Image size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {selectedPelatihan.fotoKegiatan ? "Tersedia" : "Belum diunggah"}
                    </p>
                    {selectedPelatihan.fotoKegiatan && (
                      <a href={selectedPelatihan.fotoKegiatan} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                        <Download size={11} /> Unduh
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#E2E8F0] flex-shrink-0">
              <button
                onClick={() => setSelectedPelatihan(null)}
                className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
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

function TabDokumen({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat dokumen kewajiban...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Dokumen Kewajiban" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Terjadi kesalahan: {error.message || "Gagal memuat dokumen kewajiban."}
      </div>
    )
  }
  if (!data || !data.length) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
        Belum ada dokumen kewajiban.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((doc) => (
        <div key={doc.id} className="p-4 border border-[#E2E8F0] rounded-xl flex items-start gap-4 hover:shadow-sm transition-shadow bg-white">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h4 className="font-semibold text-gray-900 truncate">
                {doc.jenis}
                {doc.is_wajib && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
                    Wajib
                  </span>
                )}
              </h4>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 w-fit ${statusBadge(doc.status)}`}>
                <StatusIcon status={doc.status} />
                {doc.status}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mb-3 text-sm">
              <div className="flex items-center text-gray-500 gap-1.5">
                <Calendar size={14} />
                Diunggah: {doc.tanggal_upload}
              </div>
              <div className="flex items-center text-gray-500 gap-1.5 truncate">
                <span className="text-gray-400">File:</span>
                <span className="truncate">{doc.nama_file}</span>
              </div>
            </div>
            {doc.catatan && (
              <div className="mb-3 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm">
                <span className="font-medium text-gray-700">Catatan Admin:</span> <span className="text-gray-600">{doc.catatan}</span>
              </div>
            )}
            <div className="flex gap-2">
              {doc.file_url ? (
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#263F93] hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink size={14} />
                  Lihat Dokumen
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  <ExternalLink size={14} />
                  File tidak tersedia
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TabSP({ data, loading, error }: { data: any[]; loading: boolean; error?: any }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data SP...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Surat Peringatan" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-600">
        Terjadi kesalahan: {error.message || "Gagal memuat data surat peringatan."}
      </div>
    )
  }
  if (!data.length) {
    return (
      <div className="space-y-5">
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="bg-[#263F93] px-6 py-4 flex items-center gap-4">
            <img src={logoItg} alt="Logo ITG" className="h-12 w-12 object-contain rounded-full bg-white p-0.5 flex-shrink-0" />
            <div className="text-white">
              <div className="font-bold text-sm leading-snug">INSTITUT TEKNOLOGI GARUT</div>
              <div className="text-xs text-white/80 leading-snug">
                Pengelola Kartu Indonesia Pintar – Kuliah (KIP-K)
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4 bg-white text-center text-sm text-gray-500">
            Belum ada surat peringatan aktif untuk mahasiswa ini.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Riwayat Surat Peringatan</h4>
        <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-4">
          {data.map((sp) => (
            <div key={sp.id} className="relative">
              <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow" />
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-amber-700">
                      {sp.level} — {sp.status}
                    </span>
                    <div className="text-xs text-amber-600 mt-0.5">
                      {sp.tanggalTerbit} · {sp.alasan}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabInfoPribadi({ data }: { data: Mahasiswa | null }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User size={18} className="text-gray-500" />
              Informasi Dasar
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <span className="block text-sm text-gray-500 mb-1">Nama Lengkap</span>
              <span className="block font-medium text-gray-900">{data.nama || "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">NIM</span>
              <span className="block font-medium text-gray-900">{data.nim || "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">Kategori KIP-K</span>
              <span className="block font-medium text-gray-900">{data.kategori ? `KIP-K ${data.kategori}` : "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">NIK</span>
              <span className="block font-medium text-gray-900">{data.nik || "—"}</span>
            </div>

            <div>
              <span className="block text-sm text-gray-500 mb-1">Tempat Lahir</span>
              <span className="block font-medium text-gray-900">{data.tempatLahir || "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">Tanggal Lahir</span>
              <span className="block font-medium text-gray-900">{data.tanggalLahir || "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">Jenis Kelamin</span>
              <span className="block font-medium text-gray-900">{data.jenisKelamin || "—"}</span>
            </div>
          </div>
        </div>

        {/* Academic Info Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <GraduationCap size={18} className="text-gray-500" />
              Informasi Akademik
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <span className="block text-sm text-gray-500 mb-1">Program Studi</span>
              <span className="block font-medium text-gray-900">{data.prodi || "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">Angkatan</span>
              <span className="block font-medium text-gray-900">{data.angkatan || "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">Status Mahasiswa</span>
              <span className="block font-medium text-gray-900">{data.status || "—"}</span>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm md:col-span-2">
          <div className="bg-gray-50 px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Phone size={18} className="text-gray-500" />
              Kontak & Alamat
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-sm text-gray-500 mb-1">Email</span>
              <span className="block font-medium text-gray-900">{data.email || <span className="text-gray-400 italic">Belum ada data</span>}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">Nomor HP</span>
              <span className="block font-medium text-gray-900">{data.noHp || <span className="text-gray-400 italic">Belum ada data</span>}</span>
            </div>
            <div className="md:col-span-2">
              <span className="block text-sm text-gray-500 mb-1">Alamat Lengkap</span>
              <span className="block font-medium text-gray-900">{data.alamat || "—"}</span>
            </div>
            
            <div className="md:col-span-2 mt-2 pt-4 border-t border-gray-100">
              <span className="block text-sm font-semibold text-gray-700 mb-3">Riwayat Nomor HP</span>
              <div className="space-y-0">
                {data.noHp && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex flex-col items-center self-stretch pt-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#16a34a" }} />
                      {data?.contactHistories?.length > 0 && (
                        <div className="w-px flex-1 mt-1" style={{ background: "#E2E8F0" }} />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-500 text-gray-700">{data.noHp}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> Saat Ini
                        </p>
                      </div>
                      <span className="text-xs font-500 px-2 py-0.5 rounded-full bg-green-100 text-green-700">Aktif</span>
                    </div>
                  </div>
                )}
                {data?.contactHistories?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex flex-col items-center self-stretch pt-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#CBD5E1" }} />
                      {idx < data.contactHistories.length - 1 && (
                        <div className="w-px flex-1 mt-1" style={{ background: "#E2E8F0" }} />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-500 text-gray-700">{item.nomor}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> {item.sem}
                        </p>
                      </div>
                      <span className="text-xs font-500 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Tidak Aktif</span>
                    </div>
                  </div>
                ))}
                {!data.noHp && !data?.contactHistories?.length && (
                  <p className="text-sm text-gray-400 italic">Belum ada riwayat kontak.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Family Info Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm md:col-span-2">
          <div className="bg-gray-50 px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-gray-500" />
              Informasi Orang Tua/Wali
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-sm text-gray-500 mb-1">Nama Ayah</span>
              <span className="block font-medium text-gray-900">{data.namaAyah || "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">Nama Ibu</span>
              <span className="block font-medium text-gray-900">{data.namaIbu || "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">No. HP Ayah</span>
              <span className="block font-medium text-gray-900">{data.telAyah || "—"}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">No. HP Ibu</span>
              <span className="block font-medium text-gray-900">{data.telIbu || "—"}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

interface CollapsibleSection {
  title: string;
  icon: React.ReactNode;
  ok: boolean;
  children: React.ReactNode;
}

function Section({ title, icon, ok, children }: CollapsibleSection) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`rounded-xl border overflow-hidden ${ok ? "border-green-200" : "border-yellow-300"}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-4 ${ok ? "bg-green-50" : "bg-yellow-50"}`}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-400 flex items-center justify-center">{icon}</div>
          <span className="font-600 text-gray-800 text-sm">{title}</span>
          {ok ? (
            <CheckCircle size={15} className="text-green-500" />
          ) : (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-500">Perlu Perhatian</span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="p-5 bg-white">{children}</div>}
    </div>
  );
}

function FormalSurat({ student }: { student: MahasiswaBebasTanggunganResponse['mahasiswa'] & { permohonan: NonNullable<MahasiswaBebasTanggunganResponse['permohonan']> } }) {
  return (
    <div className="border-2 border-[#263F93] rounded-xl p-1">
      <div className="border border-[#263F93] rounded-lg p-6 font-serif text-gray-800 text-xs leading-relaxed">
        {/* Kop surat */}
        <div className="flex items-center gap-4 border-b-2 border-[#263F93] pb-4 mb-6">
          <img src={logoItg} alt="ITG" className="h-16 w-16 object-contain flex-shrink-0" />
          <div className="flex-1 text-center">
            <p className="font-bold text-xs">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
            <p className="font-bold text-base">INSTITUT TEKNOLOGI GARUT</p>
            <p className="text-xs text-gray-500">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
            <p className="text-xs text-gray-400">Telp. (0262) 540895 · www.itg.ac.id · info@itg.ac.id</p>
          </div>
        </div>

        {/* Judul */}
        <div className="text-center mb-5">
          <p className="font-bold text-sm underline uppercase tracking-wide">
            Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K
          </p>
        </div>

        {/* Nomor surat */}
        <div className="mb-4 space-y-1">
          {[
            ["Nomor", "—"],
            ["Lampiran", "—"],
            ["Perihal", "Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5rem_0.5rem_1fr] gap-x-2 text-xs">
              <span className="text-gray-600">{k}</span>
              <span>:</span>
              <span className={k !== "Lampiran" ? "font-600" : ""}>{v}</span>
            </div>
          ))}
        </div>

        {/* Kepada */}
        <div className="mb-4 text-xs space-y-0.5">
          <p>Kepada Yth.</p>
          <p className="font-600">{student.nama}</p>
          <p>NIM: {student.nim}</p>
          <p>Program Studi {student.prodi}</p>
          <p className="italic mt-1">di Tempat</p>
        </div>

        <p className="mb-3 text-xs">Dengan hormat,</p>

        <p className="text-xs leading-relaxed mb-3 text-justify">
          Yang bertanda tangan di bawah ini, Pengelola KIP-K Institut Teknologi Garut, menerangkan dengan sesungguhnya bahwa:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-3 space-y-1">
          {[
            ["Nama", student.nama],
            ["NIM", student.nim],
            ["Program Studi", student.prodi],
            ["Angkatan", String(student.angkatan)],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5rem_0.5rem_1fr] gap-x-2 text-xs">
              <span className="text-gray-500">{k}</span>
              <span>:</span>
              <span className="font-600">{v}</span>
            </div>
          ))}
        </div>

        <p className="text-xs leading-relaxed mb-2 text-justify">
          Telah <strong>menyelesaikan seluruh kewajiban sebagai penerima Kartu Indonesia Pintar Kuliah (KIP-K)</strong> di
          Institut Teknologi Garut.
        </p>
        <p className="text-xs leading-relaxed text-justify mb-5">
          Demikian surat keterangan ini diterbitkan untuk dapat digunakan sebagaimana mestinya.
        </p>

        {/* TTD */}
        <div className="mt-5 grid grid-cols-2 gap-6 text-xs text-center">
          <div>
            <p>Garut, {student.permohonan.tanggalPermohonan}</p>
            <p className="mt-0.5">Pengelola KIP-K,</p>
            <div className="h-14 my-1" />
            <p className="font-bold underline">Encep Jianul Hayat, S.T., M.T.</p>
            <p className="text-gray-500">NIP. 197804202006041001</p>
          </div>
          <div>
            <p>Mengetahui,</p>
            <p className="mt-0.5">Wakil Rektor,</p>
            <div className="h-14 my-1" />
            <p className="font-bold underline">Dr. Rina Kurniawati, S.E., M.Si.</p>
            <p className="text-gray-500">NIP. 198203152008012002</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabSuratPenyelesaian({
  data,
  loading,
  error,
}: {
  data: MahasiswaBebasTanggunganResponse | null;
  loading: boolean;
  error: any;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 text-[#263F93]" />
        <p>Memuat data Surat Penyelesaian...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500">
        <AlertTriangle size={32} className="mb-3" />
        <p>{error?.message || "Gagal memuat data Surat Penyelesaian."}</p>
      </div>
    );
  }

  const { permohonan, checklist, dokumen, rejection_history } = data;
  const currentStatus = permohonan?.status || "belum_mengajukan";
  
  // Hitung status keseluruhan dari checklist backend
  const allConditionsMet = checklist.every((c) => c.terpenuhi);
  const allDocsApproved = dokumen.length > 0 && dokumen.every((d) => d.status === "Disetujui");
  const missingDocs = dokumen.filter((d) => d.status !== "Disetujui");

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between bg-gray-50 border border-[#E2E8F0] rounded-xl p-4">
        <div>
          <h3 className="font-600 text-gray-800">Status Surat Penyelesaian</h3>
          {permohonan ? (
            <p className="text-xs text-gray-500 mt-0.5">Diajukan pada: {permohonan.tanggalPermohonan}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-0.5">Mahasiswa belum melakukan pengajuan.</p>
          )}
        </div>
        <div>
          {currentStatus === "diterbitkan" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-600 bg-green-100 text-green-700">
              <CheckCircle size={16} /> Diterbitkan
            </span>
          )}
          {currentStatus === "ditolak" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-600 bg-red-100 text-red-700">
              <XCircle size={16} /> Ditolak
            </span>
          )}
          {currentStatus === "menunggu" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-600 bg-blue-100 text-blue-700">
              <Clock size={16} /> Menunggu Review
            </span>
          )}
          {currentStatus === "belum_mengajukan" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-600 bg-gray-200 text-gray-600">
              <AlertTriangle size={16} /> Belum Mengajukan
            </span>
          )}
        </div>
      </div>

      {/* Incomplete docs warning */}
      {missingDocs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-600 text-amber-800 text-sm">Dokumen Belum Lengkap ({dokumen.length - missingDocs.length}/{dokumen.length})</p>
              <p className="text-xs text-amber-700 mt-1 mb-2">Dokumen berikut belum memenuhi syarat (belum diunggah/ditolak/menunggu):</p>
              <ul className="space-y-1">
                {missingDocs.map((doc) => (
                  <li key={doc.nama} className="flex items-center gap-2 text-xs text-amber-800">
                    <XCircle size={12} className="text-amber-500 flex-shrink-0" />
                    {doc.nama} — {doc.status || "Belum diunggah"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Sections from Backend API */}
      <div className="space-y-3">
        <Section title="Evaluasi Akademik & SP" icon={<BarChart size={18} />} ok={checklist.filter(c => c.syarat.includes('IPK') || c.syarat.includes('SP') || c.syarat.includes('SKS') || c.syarat.includes('MK')).every(c => c.terpenuhi)}>
          <div className="space-y-3">
            {checklist.filter(c => !c.syarat.includes('dokumen')).map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                <span className="text-gray-700 font-500">{c.syarat}</span>
                <span className={`flex items-center gap-1 ${c.terpenuhi ? 'text-green-600' : 'text-red-600'}`}>
                  {c.terpenuhi ? <CheckCircle size={12} /> : <XCircle size={12} />} 
                  {c.terpenuhi ? 'Terpenuhi' : c.keterangan || 'Belum Terpenuhi'}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title={`Dokumen Kewajiban (${dokumen.filter(d => d.status === 'Disetujui').length}/${dokumen.length}${allDocsApproved ? " — Lengkap" : ""})`}
          icon={<Folder size={18} />}
          ok={allDocsApproved}
        >
          <div className="space-y-2">
            {dokumen.map((entry) => {
              const isApproved = entry.status === "Disetujui";
              const isRejected = entry.status === "Ditolak";
              const isMissing = !entry.status;
              
              return (
                <div
                  key={entry.nama}
                  className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg border ${
                    isApproved ? "bg-green-50 border-green-100" : isRejected || isMissing ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                  ) : isRejected || isMissing ? (
                    <XCircle size={15} className="text-red-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle size={15} className="text-yellow-500 flex-shrink-0" />
                  )}
                  <span className={`flex-1 font-500 ${isApproved ? "text-gray-700" : isRejected || isMissing ? "text-red-700" : "text-yellow-700"}`}>
                    {entry.nama}
                  </span>
                  <span className="text-xs text-gray-400">{entry.tanggal_upload || "—"}</span>
                  <span className={`text-xs font-600 ${isApproved ? "text-green-600" : isRejected || isMissing ? "text-red-600" : "text-yellow-600"}`}>
                    {entry.status || "Belum diunggah"}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      {/* Rejection History & PDF Preview */}
      {currentStatus === "ditolak" && (
        <Section title="Riwayat Penolakan" icon={<AlertTriangle size={18} />} ok={false}>
          {rejection_history.length > 0 ? (
            <div className="space-y-4">
              {rejection_history.map((h, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5"></div>
                    {i !== rejection_history.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-600 text-gray-900">Ditolak oleh {h.oleh}</span>
                      <span className="text-xs text-gray-500">{h.tgl}</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">{h.catatan}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
              Belum ada riwayat penolakan tercatat.
            </div>
          )}
        </Section>
      )}

      {currentStatus === "diterbitkan" && (
        <div className="mt-8 border-t border-[#E2E8F0] pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-gray-800 flex items-center gap-2">
              <Printer size={18} className="text-gray-500" />
              Preview Surat Formal
            </h3>
            <a
              href={`/api/bebas-tanggungan/${permohonan?.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#263F93] text-white rounded-xl text-sm font-500 hover:bg-[#1E3275] transition-colors shadow-sm"
            >
              <Download size={16} /> Download PDF
            </a>
          </div>
          <FormalSurat student={{ ...data.mahasiswa, permohonan: permohonan as any }} />
        </div>
      )}

    {/* Overall assessment */}
      {allConditionsMet ? (
        <div className="flex items-start gap-3 bg-green-50 border border-green-300 rounded-xl px-5 py-4">
          <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-600 text-green-800">Semua persyaratan terpenuhi</p>
            <p className="text-sm text-green-700 mt-0.5">Mahasiswa layak mendapatkan Surat Keterangan Penyelesaian KIP-K.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-4">
          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Terdapat syarat atau dokumen yang belum lengkap/diverifikasi. Permohonan belum dapat diterbitkan.
          </p>
        </div>
      )}
    </div>
  );
}

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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [showSpModal, setShowSpModal] = useState(false)
  const [selectedSpLevel, setSelectedSpLevel] = useState<"SP1" | "SP2" | "SP3">("SP1")
  const [nonaktifModal, setNonaktifModal] = useState(false)
  const [cabutModal, setCabutModal] = useState(false)
  const [cabutConfirmNim, setCabutConfirmNim] = useState("")

  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false)
  const [statusError, setStatusError] = useState("")
  const [alasanStatus, setAlasanStatus] = useState("Cuti Akademik")
  const [catatanStatus, setCatatanStatus] = useState("")

  const [isSubmittingCabut, setIsSubmittingCabut] = useState(false)
  const [cabutError, setCabutError] = useState("")
  const [alasanCabut, setAlasanCabut] = useState("IPK di Bawah Standar")
  const [catatanCabut, setCatatanCabut] = useState("")

  const handleUpdateStatus = async () => {
    if (!mhs) return
    setIsSubmittingStatus(true)
    setStatusError("")
    try {
      const newStatus = mhs.status === "Aktif" ? "Nonaktif" : "Aktif"
      await updateMahasiswaStatus(mhsId, {
        status: newStatus,
        alasan_status: newStatus === "Nonaktif" ? alasanStatus : undefined,
        catatan_status: newStatus === "Nonaktif" ? catatanStatus : undefined,
      })
      const updated = await getMahasiswaById(mhsId)
      setMhs(updated)
      setNonaktifModal(false)
      setAlasanStatus("Cuti Akademik")
      setCatatanStatus("")
    } catch (err: any) {
      if (err.response?.status === 422) {
        setStatusError(err.response.data.message || "Validasi gagal. Periksa kembali input Anda.")
      } else {
        setStatusError(err.message || "Gagal mengubah status mahasiswa.")
      }
    } finally {
      setIsSubmittingStatus(false)
    }
  }

  const handleCabutKipk = async () => {
    if (!mhs) return
    setIsSubmittingCabut(true)
    setCabutError("")
    try {
      await cabutKipkMahasiswa(mhsId, {
        alasan_cabut: alasanCabut,
        catatan_cabut: catatanCabut,
        konfirmasi_nim: cabutConfirmNim
      })
      const updated = await getMahasiswaById(mhsId)
      setMhs(updated)
      setCabutModal(false)
      setAlasanCabut("IPK di Bawah Standar")
      setCatatanCabut("")
      setCabutConfirmNim("")
    } catch (err: any) {
      if (err.response?.status === 422) {
        setCabutError(err.response.data.message || "Validasi gagal. Pastikan NIM konfirmasi benar.")
      } else {
        setCabutError(err.message || "Gagal mencabut KIP-K mahasiswa.")
      }
    } finally {
      setIsSubmittingCabut(false)
    }
  }

  const [mhs, setMhs] = useState<Mahasiswa | null>(null)
  const [ipkData, setIpkData] = useState<SemesterDetailBE[]>([])
  const [prestasiData, setPrestasiData] = useState<any[]>([])
  const [organisasiData, setOrganisasiData] = useState<any[]>([])
  const [pelatihanData, setPelatihanData] = useState<any[]>([])
  const [spData, setSpData] = useState<any[]>([])
  const [dokumenData, setDokumenData] = useState<any[]>([])
  const [btData, setBtData] = useState<MahasiswaBebasTanggunganResponse | null>(null)
  
  const [loadingMain, setLoadingMain] = useState(true)
  const [loadingIpk, setLoadingIpk] = useState(true)
  const [loadingPrestasi, setLoadingPrestasi] = useState(true)
  const [loadingOrganisasi, setLoadingOrganisasi] = useState(true)
  const [loadingPelatihan, setLoadingPelatihan] = useState(true)
  const [loadingSp, setLoadingSp] = useState(true)
  const [loadingDokumen, setLoadingDokumen] = useState(true)
  const [loadingBt, setLoadingBt] = useState(true)
  
  const [error, setError] = useState("")
  const [ipkError, setIpkError] = useState<any>(null)
  const [prestasiError, setPrestasiError] = useState<any>(null)
  const [organisasiError, setOrganisasiError] = useState<any>(null)
  const [pelatihanError, setPelatihanError] = useState<any>(null)
  const [spError, setSpError] = useState<any>(null)
  const [dokumenError, setDokumenError] = useState<any>(null)
  const [btError, setBtError] = useState<any>(null)

  const mhsId = Number(id)

  useEffect(() => {
    let active = true
    setLoadingMain(true)
    setError("")
    getMahasiswaById(mhsId)
      .then((data) => { if (active) setMhs(data) })
      .catch((err) => { if (active) setError(err?.message ?? "Gagal memuat data mahasiswa") })
      .finally(() => { if (active) setLoadingMain(false) })
    return () => { active = false }
  }, [mhsId])

  useEffect(() => {
    let active = true
    setLoadingIpk(true)
    setIpkError(null)
    getMahasiswaIpk(mhsId)
      .then((data) => { if (active) setIpkData(data) })
      .catch((err) => { 
        if (active) {
          setIpkError(err)
          setIpkData([])
        }
      })
      .finally(() => { if (active) setLoadingIpk(false) })
    return () => { active = false }
  }, [mhsId])

  useEffect(() => {
    let active = true
    setLoadingPrestasi(true)
    setPrestasiError(null)
    getMahasiswaPrestasi(mhsId)
      .then((data) => { if (active) setPrestasiData(data) })
      .catch((err) => { 
        if (active) {
          setPrestasiError(err)
          setPrestasiData([])
        }
      })
      .finally(() => { if (active) setLoadingPrestasi(false) })
    return () => { active = false }
  }, [mhsId])

  useEffect(() => {
    let active = true
    setLoadingOrganisasi(true)
    setOrganisasiError(null)
    getMahasiswaOrganisasi(mhsId)
      .then((data) => { if (active) setOrganisasiData(data) })
      .catch((err) => { 
        if (active) {
          setOrganisasiError(err)
          setOrganisasiData([])
        }
      })
      .finally(() => { if (active) setLoadingOrganisasi(false) })
    return () => { active = false }
  }, [mhsId])

  useEffect(() => {
    let active = true
    setLoadingPelatihan(true)
    setPelatihanError(null)
    getMahasiswaPelatihan(mhsId)
      .then((data) => { if (active) setPelatihanData(data) })
      .catch((err) => { 
        if (active) {
          setPelatihanError(err)
          setPelatihanData([])
        }
      })
      .finally(() => { if (active) setLoadingPelatihan(false) })
    return () => { active = false }
  }, [mhsId])

  useEffect(() => {
    let active = true
    setLoadingSp(true)
    setSpError(null)
    getMahasiswaSpHistory(mhsId)
      .then((data) => { if (active) setSpData(data) })
      .catch((err) => { 
        if (active) {
          setSpError(err)
          setSpData([])
        }
      })
      .finally(() => { if (active) setLoadingSp(false) })
    return () => { active = false }
  }, [mhsId])

  useEffect(() => {
    let active = true
    setLoadingDokumen(true)
    setDokumenError(null)
    getMahasiswaDokumen(mhsId)
      .then((data) => { if (active) setDokumenData(data) })
      .catch((err) => { 
        if (active) {
          setDokumenError(err)
          setDokumenData([])
        }
      })
      .finally(() => { if (active) setLoadingDokumen(false) })
    return () => { active = false }
  }, [mhsId])

  useEffect(() => {
    let active = true
    setLoadingBt(true)
    setBtError(null)
    getMahasiswaBebasTanggungan(mhsId)
      .then((res) => { if (active) setBtData(res) })
      .catch((err) => {
        if (active) {
          setBtError(err)
          setBtData(null)
        }
      })
      .finally(() => { if (active) setLoadingBt(false) })
    return () => { active = false }
  }, [mhsId])

  if (loadingMain) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data mahasiswa...
      </div>
    )
  }

  if (error || !mhs) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/mahasiswa"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={16} /> Manajemen Mahasiswa
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error || "Mahasiswa tidak ditemukan."}</p>
        </div>
      </div>
    )
  }

  const hasSP2 = mhs.sp === "SP2" || mhs.sp === "SP3"
  const spLevel = (mhs.sp === "SP1" || mhs.sp === "SP2" || mhs.sp === "SP3") ? mhs.sp : null
  const semesterNum = mhs.semester ?? 1
  const totalSem = 8
  const progressPct = Math.round((semesterNum / totalSem) * 100)

  return (
    <div className="space-y-5 pb-10">
      {/* Breadcrumb */}
      <Link
        to="/admin/mahasiswa"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ChevronLeft size={16} /> Manajemen Mahasiswa
      </Link>

      {/* Status Banner */}
      {mhs.status === "Nonaktif" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <UserMinus size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-800">Mahasiswa ini berstatus NONAKTIF</h3>
            <p className="text-sm text-amber-700 mt-1">
              Alasan: <strong>{mhs.alasanNonaktif || "—"}</strong><br />
              Tanggal: <strong>{mhs.tanggalNonaktif || "—"}</strong>
            </p>
          </div>
        </div>
      )}

      {mhs.status === "Dicabut" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <UserX size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-800">KIP-K mahasiswa ini telah DICABUT</h3>
            <p className="text-sm text-red-700 mt-1">
              Dicabut pada Semester {mhs.semesterDicabut || "—"} oleh {mhs.dicabutOleh || "—"}<br />
              Alasan: <strong>{mhs.alasanDicabut || "—"}</strong><br />
              Tanggal: <strong>{mhs.tanggalDicabut || "—"}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-[#263F93] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {mhs.nama.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-bold text-xl text-gray-900">{mhs.nama}</h2>
              {spLevel === "SP1" && (
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
                    : mhs.status === "Dicabut"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {mhs.status}
              </span>
            </div>
          </div>

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

          <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
            {(mhs.status === "Aktif" || mhs.status === "Nonaktif") && (
              <button
                onClick={() => setNonaktifModal(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  mhs.status === "Aktif"
                    ? "border-amber-400 text-amber-600 hover:bg-amber-50"
                    : "border-green-400 text-green-600 hover:bg-green-50"
                }`}
              >
                {mhs.status === "Aktif" ? (
                  <><UserMinus size={14} /> Nonaktifkan</>
                ) : (
                  <><UserCheck size={14} /> Aktifkan</>
                )}
              </button>
            )}
            {(mhs.status === "Aktif" || mhs.status === "Nonaktif") && (
              <button
                onClick={() => setCabutModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-red-400 text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <UserX size={14} /> Cabut KIP-K
              </button>
            )}
            {mhs.status === "Aktif" && (
              <button
                onClick={() => setShowSpModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-red-400 text-red-600 hover:bg-red-50 transition-colors"
              >
                <AlertTriangle size={14} /> Terbitkan SP
              </button>
            )}
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
        {activeTab === 0 && <TabRiwayatAkademik data={ipkData} loading={loadingIpk} error={ipkError} />}
        {activeTab === 1 && <TabPrestasi data={prestasiData} loading={loadingPrestasi} error={prestasiError} />}
        {activeTab === 2 && <TabOrganisasi data={organisasiData} loading={loadingOrganisasi} error={organisasiError} />}
        {activeTab === 3 && <TabPelatihan data={pelatihanData} loading={loadingPelatihan} error={pelatihanError} />}
        {activeTab === 4 && <TabDokumen data={dokumenData} loading={loadingDokumen} error={dokumenError} />}
        {activeTab === 5 && <TabSP data={spData} loading={loadingSp} error={spError} />}
        {activeTab === 6 && <TabInfoPribadi data={mhs} />}
        {activeTab === 7 && <TabSuratPenyelesaian data={btData} loading={loadingBt} error={btError} />}
      </div>

      {/* Terbitkan SP Modal */}
      {showSpModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowSpModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                Terbitkan Surat Peringatan
              </h3>
              <button
                onClick={() => setShowSpModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600">
                Anda akan menerbitkan SP untuk{" "}
                <span className="font-semibold text-gray-800">{mhs.nama}</span>.
                Pilih level SP:
              </p>
              <div className="space-y-2">
                {(["SP1", "SP2", "SP3"] as const).map((level) => (
                  <label
                    key={level}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedSpLevel === level
                        ? "border-red-400 bg-red-50"
                        : "border-[#E2E8F0] hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="spLevel"
                      value={level}
                      checked={selectedSpLevel === level}
                      onChange={() => setSelectedSpLevel(level)}
                      className="accent-red-600"
                    />
                    <span className="text-sm font-medium text-gray-800">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] flex gap-3 justify-end">
              <button
                onClick={() => setShowSpModal(false)}
                className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowSpModal(false)
                  navigate("/admin/sp/terbitkan")
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nonaktif/Aktif confirmation modal */}
      {nonaktifModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${mhs.status === "Aktif" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
              {mhs.status === "Aktif" ? <UserMinus size={20} /> : <UserCheck size={20} />}
            </div>
            <h3 className="font-bold text-gray-900 text-lg text-center mb-2">
              {mhs.status === "Aktif" ? "Nonaktifkan Mahasiswa" : "Aktifkan Mahasiswa"}
            </h3>
            <p className="text-gray-500 text-sm text-center mb-4">
              Mahasiswa: <strong>{mhs.nama}</strong>
            </p>
            {mhs.status === "Aktif" && (
              <div className="mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Alasan Penonaktifan</label>
                  <select 
                    value={alasanStatus}
                    onChange={(e) => setAlasanStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    <option>Cuti Akademik</option>
                    <option>Masalah Administrasi</option>
                    <option>Permintaan Sendiri</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Tambahan (Opsional)</label>
                  <textarea 
                    value={catatanStatus}
                    onChange={(e) => setCatatanStatus(e.target.value)}
                    rows={2} 
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
                  ></textarea>
                </div>
              </div>
            )}
            {statusError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertTriangle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{statusError}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setNonaktifModal(false); setStatusError(""); }}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                disabled={isSubmittingStatus}
              >
                Batal
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center"
                style={{ background: mhs.status === "Aktif" ? "#F59E0B" : "#10B981" }}
                onClick={handleUpdateStatus}
                disabled={isSubmittingStatus}
              >
                {isSubmittingStatus ? <Loader2 size={16} className="animate-spin" /> : (mhs.status === "Aktif" ? "Nonaktifkan" : "Aktifkan")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabut KIP-K confirmation modal */}
      {cabutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg text-center mb-2">Cabut KIP-K Mahasiswa</h3>
            <p className="text-gray-500 text-sm text-center mb-2">
              Mahasiswa: <strong>{mhs.nama}</strong>
            </p>
            <p className="text-gray-600 text-xs text-center font-medium mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
              Semester saat pencabutan: Ganjil 2026/2027
            </p>
            <div className="mb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alasan Pencabutan</label>
                <select 
                  value={alasanCabut}
                  onChange={(e) => setAlasanCabut(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  <option>IPK di Bawah Standar</option>
                  <option>Cuti Tanpa Izin</option>
                  <option>Pelanggaran Berat</option>
                  <option>SP3 Otomatis</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Tambahan (Opsional)</label>
                <textarea 
                  value={catatanCabut}
                  onChange={(e) => setCatatanCabut(e.target.value)}
                  rows={2} 
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ketik NIM untuk konfirmasi pencabutan:
                </label>
                <input
                  value={cabutConfirmNim}
                  onChange={(e) => setCabutConfirmNim(e.target.value)}
                  placeholder={mhs.nim}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />
              </div>
              {cabutError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{cabutError}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setCabutModal(false); setCabutConfirmNim(""); setCabutError(""); }}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                disabled={isSubmittingCabut}
              >
                Batal
              </button>
              <button
                disabled={cabutConfirmNim !== mhs.nim || isSubmittingCabut}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                style={{ background: "#DC2626" }}
                onClick={handleCabutKipk}
              >
                {isSubmittingCabut ? <Loader2 size={16} className="animate-spin" /> : "Cabut Permanen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
