import React, { useState } from "react"
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
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle, Clock, Loader2, Download, FileText } from "lucide-react"
import type { SemesterDetailBE, SemesterDetail, MataKuliah } from "@/types"
import { BackendNotReady } from "./Shared"

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
          <span className="font-semibold text-sm text-gray-700">
            {detail.ips !== undefined && detail.ips !== null ? Number(detail.ips).toFixed(2) : "-"}
          </span>
        </td>
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
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              detail.status === 'Disetujui'
                ? 'bg-green-100 text-green-700'
                : detail.status === 'Ditolak'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {detail.status === 'Disetujui' ? 'Disetujui'
              : detail.status === 'Ditolak' ? 'Ditolak'
              : 'Menunggu Validasi'}
          </span>
          {detail.status === 'Ditolak' && detail.catatan_admin && (
            <p className="text-xs text-red-500 mt-0.5 italic break-words max-w-[200px]">"{detail.catatan_admin}"</p>
          )}
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
          <td colSpan={8} className="p-0 border-r border-gray-100">
            <div className="flex flex-col md:flex-row">
              <div className="bg-gray-50 border-t border-b border-gray-100 px-3 sm:px-4 py-3 flex-1 min-w-0">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
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
              <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-100 w-full md:w-48 shrink-0 md:border-l md:border-b-0 border-gray-200">
                {detail.file_khs ? (
                  <a
                    href={detail.file_khs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#263F93] rounded-lg hover:bg-[#1E337A] transition-colors"
                  >
                    <FileText size={16} />
                    Lihat KHS
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <FileText size={20} className="opacity-50" />
                    <span className="text-xs text-center">KHS Belum Diunggah</span>
                  </div>
                )}
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

export function TabRiwayatAkademik({ data, loading, error }: { data: SemesterDetailBE[]; loading: boolean; error?: any }) {

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 px-4 text-center text-sm sm:text-base text-gray-500">
        <Loader2 className="animate-spin mr-2 flex-shrink-0" /> Memuat data akademik...
      </div>
    )
  }
  if (error) {
    if (error.response?.status === 404) {
      return <BackendNotReady feature="Data Riwayat Akademik" />
    }
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center text-xs sm:text-sm text-red-600 break-words">
        Terjadi kesalahan: {error.message || "Gagal memuat data akademik."}
      </div>
    )
  }
  if (!data.length) {
    return (
      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden p-4 sm:p-6 bg-white text-center text-xs sm:text-sm text-gray-500">
        Belum ada riwayat akademik untuk mahasiswa ini.
      </div>
    )
  }

  const semesterDetails: SemesterDetail[] = data.map((s) => ({
    semester: s.semester,
    tahun: s.tahun,
    ips: s.ips,
    ipk: s.ipk,
    status: s.status,
    catatan_admin: s.catatan_admin,
    file_khs: s.file_khs,
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
    <div className="space-y-4 sm:space-y-6 min-w-0">
      <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3 sm:gap-4">
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
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-center min-w-0"
          >
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">
              {label}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Grafik Progres IPK
        </h4>
        <div className="w-full h-[200px] sm:h-[220px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 12, bottom: 5, left: -12 }}
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
              minTickGap={4}
            />
            <YAxis domain={[2, 4]} width={32} tick={{ fontSize: 11, fill: "#94A3B8" }} />
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
      </div>

      <div className="min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h4 className="text-sm font-semibold text-gray-700">
            Riwayat IPK per Semester
          </h4>
          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#263F93] border border-[#263F93]/30 rounded-lg hover:bg-[#263F93]/5 transition-colors w-full sm:w-auto whitespace-nowrap">
            <Download size={14} className="flex-shrink-0" />
            Tarik Data Mata Kuliah dari Sistem Akademik
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {[
                  "Semester",
                  "TA",
                  "IPS",
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
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
            Mata Kuliah Belum Lulus
          </h4>
          <div className="mb-4 sm:mb-6 flex items-start gap-3 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl min-w-0">
            <AlertTriangle
              size={16}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed break-words min-w-0">
              <span className="font-semibold text-amber-900 block mb-0.5">
                Perhatian:
              </span>
              Mahasiswa ini memiliki {belumLulus.length} MK belum lulus yang
              berpotensi menghambat KP/Skripsi
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full min-w-[520px] text-sm">
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
                      className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap"
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
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                      {mk.kode}
                    </td>
                    <td className="py-2.5 px-3 text-xs sm:text-sm text-gray-800 min-w-[140px] break-words">{mk.nama}</td>
                    <td className="py-2.5 px-3 text-center text-xs sm:text-sm text-gray-600">
                      {mk.sks}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-red-600 text-xs sm:text-sm">
                      {mk.nilaiHuruf}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-right">
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded items-center gap-1 inline-flex whitespace-nowrap">
                          <Clock size={12} className="flex-shrink-0" /> Belum Diperbaiki
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
