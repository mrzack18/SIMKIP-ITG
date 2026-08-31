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
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle, Clock, Loader2, Download } from "lucide-react"
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
        <td className="py-3 px-3 text-sm text-gray-700">
          Semester {detail.semester}
        </td>
        <td className="py-3 px-3 text-sm text-gray-500">{detail.tahun}</td>
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
            <p className="text-xs text-red-500 mt-0.5 italic">"{detail.catatan_admin}"</p>
          )}
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

export function TabRiwayatAkademik({ data, loading, error }: { data: SemesterDetailBE[]; loading: boolean; error?: any }) {

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
      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden p-6 bg-white text-center text-sm text-gray-500">
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
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">
            Riwayat IPK per Semester
          </h4>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#263F93] border border-[#263F93]/30 rounded-lg hover:bg-[#263F93]/5 transition-colors">
            <Download size={14} />
            Tarik Data Mata Kuliah dari Sistem Akademik
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
          <table className="w-full text-sm">
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
