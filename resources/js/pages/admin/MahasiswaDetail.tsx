import React, { useState } from "react"
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
} from "lucide-react"
import { mahasiswaList, ipkHistory } from "@/data/mockData"
import {
  semesterDetails,
  mkBelumLulus,
  mockPrestasiDetail as mockPrestasi,
  mockOrganisasiDetail as mockOrganisasi,
  mockPelatihanAkademikDetail as mockPelatihanAkademik,
  mockPelatihanNonAkademikDetail as mockPelatihanNonAkademik,
  dokumenKewajibanDetail as dokumenKewajiban,
  mockSPDetail as mockSP,
  syaratPenyelesaian,
} from "@/data/mockMahasiswaDetail"
import logoItg from "@/imports/logo_itg.jpg"

// Types imported from @/types

// ── Mock data imported from @/data/mockMahasiswaDetail ────────────────────────

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Sub-components ────────────────────────────────────────────────────────────

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

function TabRiwayatAkademik() {
  const highest = ipkHistory.reduce((a, b) => (a.ipk > b.ipk ? a : b))
  const lowest = ipkHistory.reduce((a, b) => (a.ipk < b.ipk ? a : b))
  const avg = ipkHistory.reduce((s, h) => s + h.ipk, 0) / ipkHistory.length
  const belumLulus = mkBelumLulus.filter((mk) => mk.statusPerbaikan === "belum")

  const chartData = ipkHistory.map((h) => ({ ...h, ipkVal: h.ipk }))

  return (
    <div className="space-y-6">
      {/* Stat cards */}
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
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <AlertTriangle size={15} className="text-amber-500" />
          Mata Kuliah Belum Lulus
        </h4>
        {belumLulus.length > 0 && (
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
        )}
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
              {mkBelumLulus
                .filter((mk) => mk.statusPerbaikan === "belum")
                .map((mk) => (
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
                      {mk.nilai}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500">
                      Sem {mk.semesterAwal}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-right">
                        {mk.statusPerbaikan === "belum" ? (
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 inline-flex">
                            <Clock size={12} /> Belum Diperbaiki
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 inline-flex">
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
    </div>
  )
}

function TabPrestasi() {
  const [subTab, setSubTab] =
    useState<"Internasional" | "Nasional" | "Wilayah">("Internasional")
  const [modalItem, setModalItem] = useState<typeof mockPrestasi[0] | null>(
    null,
  )

  const tiers = ["Internasional", "Nasional", "Wilayah"] as const
  const counts: Record<string, number> = {
    Internasional: mockPrestasi.filter((p) => p.tingkat === "Internasional")
      .length,
    Nasional: mockPrestasi.filter((p) => p.tingkat === "Nasional").length,
    Wilayah: 0,
  }
  const filtered = mockPrestasi.filter(
    (p) =>
      p.tingkat === subTab &&
      (p.status === "Disetujui" || p.status === "approved"),
  )

  const tingkatBadgeStyle = (tingkat: string) => {
    if (tingkat === "Internasional") return "bg-purple-100 text-purple-700"
    if (tingkat === "Nasional") return "bg-blue-100 text-blue-700"
    return "bg-green-100 text-green-700"
  }

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
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
                {/* Header: icon + title + badges */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#263F93]/10">
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
                      {p.nama}
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

                {/* Meta info */}
                <div className="text-xs text-gray-500 space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Trophy size={11} className="text-gray-400 flex-shrink-0" />
                    <span>{p.penyelenggara}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar
                      size={11}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <span>
                      {p.tanggalMulai} – {p.tanggalSelesai}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                    <span>{p.tempat}</span>
                  </div>
                </div>

                {/* Admin note */}
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

                {/* Detail button */}
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

      {/* Detail Modal */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-gray-800">Detail Prestasi</h3>
              <button
                onClick={() => setModalItem(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Title block */}
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
                    {modalItem.nama}
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
                      <StatusIcon status={modalItem.status} />{" "}
                      {modalItem.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <Building2
                    size={14}
                    className="text-gray-400 flex-shrink-0"
                  />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">
                      Penyelenggara:
                    </span>
                    <span className="font-medium text-gray-700">
                      {modalItem.penyelenggara}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tanggal:</span>
                    <span className="font-medium text-gray-700">
                      {modalItem.tanggalMulai} – {modalItem.tanggalSelesai}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tempat:</span>
                    <span className="font-medium text-gray-700">
                      {modalItem.tempat}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {modalItem.deskripsi && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-gray-700">{modalItem.deskripsi}</p>
                </div>
              )}

              {/* Link */}
              {modalItem.linkPenyelenggara && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">
                    Link Penyelenggara
                  </p>
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

              {/* Admin note */}
              {modalItem.catatanAdmin && (
                <div className="flex items-start gap-2 bg-red-50 px-3 py-2.5 rounded-xl">
                  <AlertTriangle
                    size={14}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Catatan Admin:</span>{" "}
                    {modalItem.catatanAdmin}
                  </p>
                </div>
              )}

              {/* File placeholders */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Sertifikat</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <FileText size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {modalItem.fileSertifikat}
                    </p>
                    <button className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                      <Download size={11} /> Unduh
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Foto Bukti</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-4">
                    <Image size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center px-2">
                      {modalItem.fileFoto}
                    </p>
                    <button className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                      <Download size={11} /> Unduh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer — view only */}
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

function TabOrganisasi() {
  const [selectedOrg, setSelectedOrg] =
    useState<typeof mockOrganisasi[0] | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Users size={15} className="text-[#263F93]" /> Keaktifan Organisasi
        </h4>
      </div>
      {mockOrganisasi.map((o) => (
        <div
          key={o.id}
          className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-[#263F93]" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">
                {o.nama}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{o.jabatan}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {o.periodeMulai} – {o.periodeSelesai}
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
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(o.status)}`}
            >
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

      {/* Detail Modal */}
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
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <Users size={22} className="text-[#263F93]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">
                    {selectedOrg.nama}
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedOrg.jabatan}
                  </p>
                </div>
              </div>
              {/* Periode */}
              <div className="flex items-center gap-2.5 text-sm">
                <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 mr-1">Periode:</span>
                <span className="font-medium text-gray-700">
                  {selectedOrg.periodeMulai} → {selectedOrg.periodeSelesai}
                </span>
              </div>
              {/* Deskripsi */}
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                <p className="text-sm text-gray-700">{selectedOrg.deskripsi}</p>
              </div>
              {/* SK Kepengurusan */}
              <div>
                <p className="text-xs text-gray-400 mb-1.5">SK Kepengurusan</p>
                <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-5">
                  <FileText size={22} className="text-gray-300" />
                  <p className="text-xs text-gray-400">sk_kepengurusan.pdf</p>
                  <button className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                    <Download size={11} /> Unduh
                  </button>
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

function TabPelatihan() {
  const [subTab, setSubTab] = useState<"Akademik" | "Non-Akademik">("Akademik")
  const [selectedPelatihan, setSelectedPelatihan] =
    useState<typeof mockPelatihanAkademik[0] | null>(null)
  const items =
    subTab === "Akademik" ? mockPelatihanAkademik : mockPelatihanNonAkademik

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
                <div className="font-semibold text-sm text-gray-900">
                  {item.nama}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.penyelenggara}
                </div>
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
            <PlaceholderThumb label="Sertifikat" />
            <div className="flex items-center justify-between">
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(item.status)}`}
              >
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

      {/* Detail Modal */}
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
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={22} className="text-[#263F93]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">
                    {selectedPelatihan.nama}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        subTab === "Akademik"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {subTab}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusBadge(selectedPelatihan.status)}`}
                    >
                      <StatusIcon status={selectedPelatihan.status} />{" "}
                      {selectedPelatihan.status}
                    </span>
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <Building2
                    size={14}
                    className="text-gray-400 flex-shrink-0"
                  />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">
                      Penyelenggara:
                    </span>
                    <span className="font-medium text-gray-700">
                      {selectedPelatihan.penyelenggara}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tanggal:</span>
                    <span className="font-medium text-gray-700">
                      {selectedPelatihan.tanggalMulai} →{" "}
                      {selectedPelatihan.tanggalSelesai}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 mr-1">Tempat:</span>
                    <span className="font-medium text-gray-700">
                      {selectedPelatihan.tempat}
                    </span>
                  </div>
                </div>
              </div>
              {/* Deskripsi */}
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Deskripsi</p>
                <p className="text-sm text-gray-700">
                  {selectedPelatihan.deskripsi}
                </p>
              </div>
              {/* Sertifikat */}
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Sertifikat</p>
                <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-5">
                  <FileText size={22} className="text-gray-300" />
                  <p className="text-xs text-gray-400">
                    sertifikat_pelatihan.pdf
                  </p>
                  <button className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                    <Download size={11} /> Unduh
                  </button>
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

const dokDetailInfo: Record<string, React.ReactNode> = {
  PKKMB: (
    <div className="space-y-1.5 text-sm">
      <div className="flex items-center gap-2">
        <Calendar size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Tanggal Pelaksanaan:</span>
        <span className="font-medium text-gray-700">15 Sep 2022</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Tempat:</span>
        <span className="font-medium text-gray-700">Kampus ITG</span>
      </div>
    </div>
  ),
  MABIM: (
    <div className="space-y-1.5 text-sm">
      <div className="flex items-center gap-2">
        <Calendar size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Tanggal:</span>
        <span className="font-medium text-gray-700">10 Agu 2022</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Tempat:</span>
        <span className="font-medium text-gray-700">Kampus ITG</span>
      </div>
    </div>
  ),
  "Bela Negara": (
    <div className="space-y-1.5 text-sm">
      <div className="flex items-center gap-2">
        <Calendar size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Tanggal:</span>
        <span className="font-medium text-gray-700">20 Nov 2022</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Tempat:</span>
        <span className="font-medium text-gray-700">Lapangan ITG</span>
      </div>
      <div className="flex items-center gap-2">
        <Building2 size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Penyelenggara:</span>
        <span className="font-medium text-gray-700">Kodam III/Siliwangi</span>
      </div>
    </div>
  ),
  "Berita Acara KP": (
    <div className="space-y-1.5 text-sm">
      <div className="flex items-center gap-2">
        <FileText size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Judul KP:</span>
        <span className="font-medium text-gray-700">
          Sistem Informasi Peminjaman Alat
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Building2 size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Perusahaan:</span>
        <span className="font-medium text-gray-700">PT Telkom Indonesia</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Tanggal:</span>
        <span className="font-medium text-gray-700">Jun – Agu 2026</span>
      </div>
    </div>
  ),
  Sertifikasi: (
    <div className="space-y-1.5 text-sm">
      <div className="flex items-center gap-2">
        <Award size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Nama Sertifikasi:</span>
        <span className="font-medium text-gray-700">
          AWS Cloud Practitioner
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Building2 size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">Penyelenggara:</span>
        <span className="font-medium text-gray-700">Amazon Web Services</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText size={13} className="text-gray-400" />
        <span className="text-xs text-gray-400">No. Sertifikat:</span>
        <span className="font-medium text-gray-700">AWS-12345-2026</span>
      </div>
    </div>
  ),
}

function TabDokumen() {
  const [selectedDok, setSelectedDok] =
    useState<typeof dokumenKewajiban[0] | null>(null)
  const approved = dokumenKewajiban.filter(
    (d) => d.status === "Disetujui",
  ).length
  const total = dokumenKewajiban.length

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
            width: `${(approved / total) * 100}%`,
            background: "#22C55E",
          }}
        />
      </div>
      <div className="space-y-2.5">
        {dokumenKewajiban.map((d) => {
          const Icon = d.icon
          return (
            <div
              key={d.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-l-4 bg-white border border-[#E2E8F0] ${dokBorderColor(d.status)}`}
            >
              <Icon size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800">
                  {d.nama}
                </div>
                {d.tanggal && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    {d.tanggal}
                  </div>
                )}
                {d.catatan && (
                  <div className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded">
                    Catatan: {d.catatan}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${statusBadge(d.status)}`}
                >
                  {d.status}
                </span>
                {d.status !== "Belum Diunggah" && (
                  <button
                    onClick={() => setSelectedDok(d)}
                    className="text-xs text-[#263F93] font-medium hover:underline"
                  >
                    Lihat Detail
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Modal */}
      {selectedDok && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedDok(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-gray-800">Detail Dokumen</h3>
              <button
                onClick={() => setSelectedDok(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Header */}
              <div className="flex items-start gap-3">
                {(() => {
                  const Icon = selectedDok.icon
                  return (
                    <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={22} className="text-[#263F93]" />
                    </div>
                  )
                })()}
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">
                    {selectedDok.nama}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusBadge(selectedDok.status)}`}
                    >
                      <StatusIcon status={selectedDok.status} />{" "}
                      {selectedDok.status}
                    </span>
                  </div>
                </div>
              </div>
              {/* Tanggal Unggah */}
              {selectedDok.tanggal && (
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400 mr-1">
                    Tanggal Unggah:
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedDok.tanggal}
                  </span>
                </div>
              )}
              {/* Catatan Penolakan */}
              {selectedDok.status === "Ditolak" && selectedDok.catatan && (
                <div className="flex items-start gap-2 bg-red-50 px-3 py-2.5 rounded-xl">
                  <AlertTriangle
                    size={14}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Catatan Penolakan:</span>{" "}
                    {selectedDok.catatan}
                  </p>
                </div>
              )}
              {/* Type-specific info */}
              {dokDetailInfo[selectedDok.nama] && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Informasi Detail</p>
                  <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3 space-y-2">
                    {dokDetailInfo[selectedDok.nama]}
                  </div>
                </div>
              )}
              {/* File placeholder */}
              <div>
                <p className="text-xs text-gray-400 mb-1.5">File Dokumen</p>
                <div className="bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-1.5 py-5">
                  <FileText size={22} className="text-gray-300" />
                  <p className="text-xs text-gray-400">
                    {selectedDok.nama.toLowerCase().replace(/\s/g, "_")}.pdf
                  </p>
                  <button className="mt-1 flex items-center gap-1 text-xs text-[#263F93] font-medium hover:underline">
                    <Download size={11} /> Unduh
                  </button>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#E2E8F0] flex-shrink-0">
              <button
                onClick={() => setSelectedDok(null)}
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

function TabSP() {
  const [expanded, setExpanded] = useState(true)

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
                {mockSP.nomor}
              </span>
            </div>
            <div>
              Tanggal:{" "}
              <span className="font-medium text-gray-700">
                {mockSP.tanggal}
              </span>
            </div>
            <div>
              Perihal:{" "}
              <span className="font-medium text-gray-700">
                {mockSP.perihal}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 space-y-0.5">
            <div className="font-medium text-gray-700">Kepada Yth.</div>
            <div>Sdra/i. {mockSP.mahasiswa.nama}</div>
            <div>
              NIM: {mockSP.mahasiswa.nim} | {mockSP.mahasiswa.prodi} | Semester{" "}
              {mockSP.mahasiswa.semester}
            </div>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {mockSP.body}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Riwayat Surat Peringatan
        </h4>
        <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-4">
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow" />
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full text-left flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl"
            >
              <div>
                <span className="text-xs font-semibold text-amber-700">
                  SP1 — Aktif
                </span>
                <div className="text-xs text-amber-600 mt-0.5">
                  {mockSP.tanggal} · {mockSP.alasan}
                </div>
              </div>
              {expanded ? (
                <ChevronUp size={14} className="text-amber-500" />
              ) : (
                <ChevronDown size={14} className="text-amber-500" />
              )}
            </button>
            {expanded && (
              <div className="mt-2 p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">Nomor:</span> {mockSP.nomor}
                </div>
                <div>
                  <span className="font-medium">Alasan:</span> {mockSP.alasan}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TabInfoPribadi() {
  const [catatan, setCatatan] = useState("")

  return (
    <div className="space-y-5">
      {/* Alert */}
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
        <Lock size={14} className="text-red-600 flex-shrink-0" />
        <span className="text-xs text-red-700 font-semibold">
          RAHASIA — Data ini hanya dapat diakses oleh Pengelola KIP-K
        </span>
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Avatar */}
        <div className="col-span-full flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#263F93] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            A
          </div>
          <div>
            <div className="font-semibold text-gray-900">Ahmad Rifaldi</div>
            <div className="text-sm text-gray-500">NIM 2206001</div>
          </div>
        </div>

        {[
          { icon: User, label: "Nama Lengkap", value: "Ahmad Rifaldi" },
          { icon: FileText, label: "NIM", value: "2206001" },
          {
            icon: Calendar,
            label: "Tempat, Tgl Lahir",
            value: "Garut, 15 Januari 2002",
          },
          {
            icon: MapPin,
            label: "Alamat",
            value: "Jl. Raya Cibatu No. 45, Garut",
          },
          { icon: User, label: "Nama Ayah", value: "Hendra Rifaldi" },
          { icon: User, label: "Nama Ibu", value: "Dewi Rahayu" },
          { icon: Phone, label: "No. Telepon Ayah", value: "0813-1111-2222" },
          { icon: Phone, label: "No. Telepon Ibu", value: "0812-3333-4444" },
        ].map(({ icon: Icon, label, value }) => (
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
        <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-3">
          {[
            {
              nomor: "0856-1234-5678",
              periode: "Sem 1–4",
              status: "Tidak Aktif",
              active: false,
            },
            {
              nomor: "0812-9876-5432",
              periode: "Sem 5–sekarang",
              status: "Aktif",
              active: true,
            },
          ].map((c, i) => (
            <div key={i} className="relative">
              <div
                className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 border-white shadow ${
                  c.active ? "bg-green-400" : "bg-gray-300"
                }`}
              />
              <div className="flex items-center justify-between p-3 bg-white border border-[#E2E8F0] rounded-xl">
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {c.nomor}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {c.periode}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    c.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catatan internal */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Catatan Internal
        </label>
        <textarea
          rows={4}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Belum ada catatan. Klik untuk menambahkan..."
          className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 resize-none"
        />
        <div className="mt-2 flex gap-2">
          <button
            className="px-4 py-1.5 text-sm font-medium text-white rounded-lg flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: "#263F93" }}
          >
            <Save size={13} /> Simpan
          </button>
          {catatan && (
            <button
              onClick={() => setCatatan("")}
              className="px-4 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function TabSuratPenyelesaian() {
  const fulfilled = syaratPenyelesaian.filter((s) => s.terpenuhi).length
  const total = syaratPenyelesaian.length

  return (
    <div className="space-y-5">
      {/* Status card */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 border border-[#E2E8F0] rounded-xl">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <FileText size={22} className="text-gray-400" />
        </div>
        <div>
          <div className="font-semibold text-gray-700">Belum Mengajukan</div>
          <div className="text-xs text-gray-400 mt-0.5">
            Mahasiswa belum mengajukan permohonan Surat Penyelesaian
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
        <div className="space-y-2">
          {syaratPenyelesaian.map((s, i) => (
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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [showSpModal, setShowSpModal] = useState(false)
  const [selectedSpLevel, setSelectedSpLevel] = useState<"SP1" | "SP2" | "SP3">(
    "SP1",
  )

  const mhs = mahasiswaList.find((m) => m.id === Number(id)) ?? mahasiswaList[0]
  const hasSP2 = mhs.sp === "SP2" || mhs.sp === "SP3"

  const semesterNum = mhs.semester ?? 6
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

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
        <div className="flex flex-wrap items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#263F93] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {mhs.nama.charAt(0)}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-bold text-xl text-gray-900">{mhs.nama}</h2>
              {/* SP Badges */}
              {mhs.sp && (
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
              {totalSem - semesterNum} semester tersisa
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowSpModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-red-400 text-red-600 hover:bg-red-50 transition-colors"
            >
              <AlertTriangle size={14} /> Terbitkan SP
            </button>
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
        {activeTab === 0 && <TabRiwayatAkademik />}
        {activeTab === 1 && <TabPrestasi />}
        {activeTab === 2 && <TabOrganisasi />}
        {activeTab === 3 && <TabPelatihan />}
        {activeTab === 4 && <TabDokumen />}
        {activeTab === 5 && <TabSP />}
        {activeTab === 6 && <TabInfoPribadi />}
        {activeTab === 7 && <TabSuratPenyelesaian />}
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
            {/* Modal header */}
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

            {/* Modal body */}
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
                    <span className="text-sm font-medium text-gray-800">
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal footer */}
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
    </div>
  )
}
