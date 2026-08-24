import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Award,
  BarChart2,
  CheckCircle,
  Trash2,
  Plus,
  Upload,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Lock,
} from "lucide-react"
import { ipkHistory } from "../../data/mockData"

// ─── Constants ────────────────────────────────────────────────────────────────
const THRESHOLD = 3.0
const PERIOD_ACTIVE = true

type NilaiHuruf = "A" | "AB" | "B" | "BC" | "C" | "D" | "E" | ""

interface MataKuliah {
  id: number
  kode: string
  nama: string
  sks: number
  nilai: NilaiHuruf
}

interface CarryOver {
  kode: string
  nama: string
  sks: number
  nilai: string
  semesterAwal: string
  status: "Belum Diperbaiki" | "Lulus"
  lulusDiSem?: string
}

// ─── Grade helpers ─────────────────────────────────────────────────────────────
const nilaiMutuMap: Record<string, number> = {
  A: 4.0,
  AB: 3.5,
  B: 3.0,
  BC: 2.5,
  C: 2.0,
  D: 1.0,
  E: 0.0,
}

function getNilaiMutu(nilai: NilaiHuruf): number | null {
  if (!nilai) return null
  return nilaiMutuMap[nilai] ?? null
}

function getLulus(nilai: NilaiHuruf): boolean | null {
  if (!nilai) return null
  return nilai !== "D" && nilai !== "E"
}

// ─── Mock data ─────────────────────────────────────────────────────────────────
const initialMK: MataKuliah[] = [
  { id: 1, kode: "IF401", nama: "Kecerdasan Buatan", sks: 3, nilai: "A" },
  { id: 2, kode: "IF402", nama: "Pemrograman Web", sks: 3, nilai: "B" },
  { id: 3, kode: "IF403", nama: "Praktikum Jaringan", sks: 2, nilai: "D" },
  { id: 4, kode: "IF404", nama: "Etika Profesi", sks: 2, nilai: "A" },
]

const carryOverData: CarryOver[] = [
  {
    kode: "IF301",
    nama: "Statistika",
    sks: 3,
    nilai: "E",
    semesterAwal: "Semester 4",
    status: "Belum Diperbaiki",
  },
  {
    kode: "IF205",
    nama: "Fisika Dasar",
    sks: 2,
    nilai: "D",
    semesterAwal: "Semester 3",
    status: "Lulus",
    lulusDiSem: "5",
  },
]

const historyWithMK = ipkHistory.map((h) => ({
  ...h,
  mkBelumLulus: h.semester === 4 ? 2 : 0,
  mk: [
    { kode: "MK001", nama: "Contoh Mata Kuliah A", sks: 3, nilai: "A" },
    { kode: "MK002", nama: "Contoh Mata Kuliah B", sks: 2, nilai: "B" },
  ],
}))

// ─── Stat card helpers ─────────────────────────────────────────────────────────
const highestSem = ipkHistory.reduce((a, b) => (a.ipk > b.ipk ? a : b))
const lowestSem = ipkHistory.reduce((a, b) => (a.ipk < b.ipk ? a : b))
const avgIPK = (
  ipkHistory.reduce((s, h) => s + h.ipk, 0) / ipkHistory.length
).toFixed(2)

// ─── Custom chart dot ──────────────────────────────────────────────────────────
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  const isLast = payload.semester === ipkHistory[ipkHistory.length - 1].semester
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isLast ? 7 : 4}
      fill={payload.ipk >= THRESHOLD ? "#059669" : "#DC2626"}
      stroke="white"
      strokeWidth={2}
    />
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function InputIPK() {
  const [mkList, setMkList] = useState<MataKuliah[]>(initialMK)
  const [nextId, setNextId] = useState(10)
  const [toast, setToast] = useState(false)
  const [expandedSem, setExpandedSem] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  // IPK semester calculation
  const validMK = mkList.filter((m) => m.nilai !== "" && m.sks > 0)
  const totalSKS = validMK.reduce((s, m) => s + m.sks, 0)
  const totalMutu = validMK.reduce((s, m) => {
    const mutu = getNilaiMutu(m.nilai)
    return s + (mutu !== null ? mutu * m.sks : 0)
  }, 0)
  const ipkSemester = totalSKS > 0 ? (totalMutu / totalSKS).toFixed(2) : "0.00"

  // Derived: MK semester ini yang bernilai D/E
  const mkDE = mkList.filter((m) => m.nilai === "D" || m.nilai === "E")

  const pendingCarryOver = carryOverData.filter(
    (c) => c.status === "Belum Diperbaiki",
  )

  // Row handlers
  const addRow = () => {
    setMkList((prev) => [
      ...prev,
      { id: nextId, kode: "", nama: "", sks: 2, nilai: "" },
    ])
    setNextId((n) => n + 1)
  }

  const deleteRow = (id: number) => {
    if (isSaved) return
    setMkList((prev) => prev.filter((m) => m.id !== id))
  }

  const updateRow = (id: number, field: keyof MataKuliah, value: any) => {
    if (isSaved) return
    setMkList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    )
  }

  const handleSave = () => {
    setIsSaved(true)
    setToast(true)
    setTimeout(() => setToast(false), 3500)
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file.name)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file.name)
  }

  // IPK change indicator
  const ipkChange = (idx: number) => {
    if (idx === 0) return null
    return ipkHistory[idx].ipk - ipkHistory[idx - 1].ipk
  }

  const inputClass = isSaved
    ? "w-full border border-gray-100 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
    : "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93]"

  const selectClass = isSaved
    ? "w-full border border-gray-100 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
    : "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] bg-white"

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
          <CheckCircle size={16} />
          Nilai semester berhasil disimpan dan menunggu verifikasi Admin
        </div>
      )}

      {/* ─── SECTION 1: Header & Status ─────────────────────────────── */}
      <div>
        <h1 className="font-bold text-2xl text-gray-900">
          Input Nilai Semester
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Catat nilai mata kuliah dan pantau perkembangan akademik Anda
        </p>
      </div>

      {PERIOD_ACTIVE ? (
        <div className="bg-[#EDF0F8] border border-[#263F93] rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#263F93] shrink-0" />
          <span className="text-sm font-semibold text-[#263F93]">
            Periode input nilai aktif hingga 15 September 2026
          </span>
        </div>
      ) : (
        <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0" />
          <span className="text-sm text-gray-600 font-medium">
            Periode input nilai belum dibuka. Periode berikutnya akan diumumkan
            sesuai kalender akademik.
          </span>
        </div>
      )}

      {/* ─── SECTION 2: Stat Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: <TrendingUp size={18} className="text-green-500" />,
            label: "IPK Tertinggi",
            val: highestSem.ipk.toFixed(2),
            sub: `Semester ${highestSem.semester}`,
            color: "text-[#263F93]",
          },
          {
            icon: <TrendingDown size={18} className="text-red-400" />,
            label: "IPK Terendah",
            val: lowestSem.ipk.toFixed(2),
            sub: `Semester ${lowestSem.semester}`,
            color: "text-[#263F93]",
          },
          {
            icon: <Award size={18} style={{ color: "#D4A72C" }} />,
            label: "IPK Rata-rata",
            val: avgIPK,
            sub: "Semua semester",
            color: "text-[#263F93]",
          },
        ].map(({ icon, label, val, sub, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              {icon}
              <span className="text-xs text-gray-500">{label}</span>
            </div>
            <div className={`font-bold text-2xl ${color}`}>{val}</div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* ─── SECTION 3: Progres IPK Chart ───────────────────────────── */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} className="text-[#263F93]" />
          <h2 className="font-semibold text-gray-800 text-sm">Progres IPK</h2>
          <div className="ml-auto flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-gray-600">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Di atas standar (3.0)
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              Di bawah standar
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={ipkHistory}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="ipkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#263F93" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#263F93" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="tahun"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              interval={0}
            />
            <YAxis
              domain={[2.0, 4.0]}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickCount={5}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 12,
              }}
              formatter={(v: any) => [Number(v).toFixed(2), "IPK"]}
              labelFormatter={(l) => `TA ${l}`}
            />
            <ReferenceLine
              y={THRESHOLD}
              stroke="#D4A72C"
              strokeWidth={2}
              strokeDasharray="4 3"
              label={{
                value: "Standar 3.0",
                position: "insideTopRight",
                fontSize: 10,
                fill: "#9ca3af",
              }}
            />
            <Area
              type="monotone"
              dataKey="ipk"
              stroke="#263F93"
              strokeWidth={2.5}
              fill="url(#ipkGradient)"
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: "#263F93" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ─── SECTION 4: Input Nilai MK ──────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base">
            Input Nilai Mata Kuliah &mdash; Semester 7 (TA 2025/2026 Ganjil)
          </h2>
        </div>

        {!PERIOD_ACTIVE ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            Periode input nilai belum dibuka. Silakan tunggu pengumuman dari
            pengelola.
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold w-8">
                      No
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-28">
                      Kode MK
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                      Nama Mata Kuliah
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-20">
                      SKS
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-28">
                      Nilai Huruf
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-24">
                      Nilai Mutu
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-28">
                      Status
                    </th>
                    <th className="px-3 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mkList.map((mk, idx) => {
                    const mutu = getNilaiMutu(mk.nilai)
                    const lulus = getLulus(mk.nilai)
                    return (
                      <tr key={mk.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 text-gray-400 text-xs">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={mk.kode}
                            onChange={(e) =>
                              updateRow(mk.id, "kode", e.target.value)
                            }
                            disabled={isSaved}
                            placeholder="IF401"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={mk.nama}
                            onChange={(e) =>
                              updateRow(mk.id, "nama", e.target.value)
                            }
                            disabled={isSaved}
                            placeholder="Nama mata kuliah"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={1}
                            max={6}
                            value={mk.sks}
                            onChange={(e) =>
                              updateRow(
                                mk.id,
                                "sks",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            disabled={isSaved}
                            className={inputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={mk.nilai}
                            onChange={(e) =>
                              updateRow(
                                mk.id,
                                "nilai",
                                e.target.value as NilaiHuruf,
                              )
                            }
                            disabled={isSaved}
                            className={selectClass}
                          >
                            <option value="">-- Pilih --</option>
                            {["A", "AB", "B", "BC", "C", "D", "E"].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <div className="border border-gray-100 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 text-gray-600 text-center">
                            {mutu !== null ? mutu.toFixed(1) : "—"}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {lulus === null ? (
                            <span className="text-gray-300 text-xs">—</span>
                          ) : lulus ? (
                            <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-0.5">
                              Lulus
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">
                              Belum Lulus
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => deleteRow(mk.id)}
                            disabled={isSaved}
                            className="text-gray-300 hover:text-red-400 transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Add row + footer */}
            <div className="px-5 pt-3 pb-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={addRow}
                disabled={isSaved}
                className="flex items-center gap-2 text-sm text-[#263F93] font-semibold hover:text-[#1a2d6d] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus size={15} />
                Tambah Mata Kuliah
              </button>
              <div className="text-sm text-gray-600 font-medium">
                Total SKS:{" "}
                <span className="font-bold text-gray-900">{totalSKS}</span>
                <span className="mx-3 text-gray-300">|</span>
                IPK Semester:{" "}
                <span className="font-bold text-[#263F93]">{ipkSemester}</span>
              </div>
            </div>

            {/* Upload KHS */}
            <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
              <div className="text-sm font-semibold text-gray-700">
                Upload Kartu Hasil Studi (KHS)
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  dragOver
                    ? "border-[#263F93] bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">{uploadedFile}</span>
                    {!isSaved && (
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-gray-400 hover:text-gray-600 ml-2 text-xs underline"
                      >
                        Ganti
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Seret dan lepas file KHS di sini, atau{" "}
                      <label className="text-[#263F93] font-semibold cursor-pointer hover:underline">
                        pilih file
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={handleFileInput}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF atau gambar (maks. 5 MB)
                    </p>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400">
                KHS digunakan sebagai bukti verifikasi oleh Pengelola KIP-K
              </p>

              {/* Lock banner */}
              {isSaved && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <Lock size={15} className="text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-800">
                    Nilai semester telah dikunci. Hubungi Pengelola KIP-K untuk
                    melakukan perubahan.
                  </p>
                </div>
              )}

              {isSaved ? (
                <button
                  disabled
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 opacity-90 cursor-not-allowed"
                >
                  <CheckCircle size={16} />
                  Nilai Telah Disimpan ✓
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="w-full bg-[#263F93] hover:bg-[#1a2d6d] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Simpan Nilai Semester
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* ─── SECTION 5: Carry-Over ──────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <AlertTriangle size={17} style={{ color: "#D4A72C" }} />
          <h2 className="font-bold text-gray-900 text-base">
            Mata Kuliah Belum Lulus
          </h2>
        </div>

        {pendingCarryOver.length > 0 && (
          <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-sm text-amber-800">
              Anda memiliki{" "}
              <span className="font-bold">{pendingCarryOver.length}</span> mata
              kuliah belum lulus yang berpotensi menghambat Kerja Praktik /
              Skripsi.
            </p>
          </div>
        )}

        {/* MK Semester Ini dengan Nilai D/E */}
        {mkDE.length > 0 && (
          <div className="mx-5 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                MK Semester Ini dengan Nilai D/E
              </span>
            </div>
            <div className="border border-red-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-50">
                    <th className="text-left px-4 py-2.5 text-xs text-red-400 font-semibold">
                      Kode MK
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs text-red-400 font-semibold">
                      Nama Mata Kuliah
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs text-red-400 font-semibold">
                      SKS
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs text-red-400 font-semibold">
                      Nilai
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-50">
                  {mkDE.map((mk) => (
                    <tr key={mk.id} className="bg-white">
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-600">
                        {mk.kode || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-gray-800">
                        {mk.nama || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{mk.sks}</td>
                      <td className="px-3 py-2.5">
                        <span className="font-bold text-red-600">
                          {mk.nilai}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="overflow-x-auto p-5">
          {pendingCarryOver.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Tidak ada mata kuliah carry-over yang belum diperbaiki.
            </p>
          ) : (
            <>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Carry-Over dari Semester Sebelumnya
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold rounded-l-lg">
                      Kode MK
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                      Nama Mata Kuliah
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                      SKS
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                      Nilai
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                      Semester Awal
                    </th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold rounded-r-lg">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {carryOverData
                    .filter((c) => c.status === "Belum Diperbaiki")
                    .map((c) => (
                      <tr key={c.kode} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {c.kode}
                        </td>
                        <td className="px-3 py-3 text-gray-800">{c.nama}</td>
                        <td className="px-3 py-3 text-gray-600">{c.sks}</td>
                        <td className="px-3 py-3">
                          <span className="font-bold text-red-600">
                            {c.nilai}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-500 text-xs">
                          {c.semesterAwal}
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full px-2.5 py-0.5">
                            Belum Diperbaiki
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* ─── SECTION 6: Riwayat per Semester (collapsible) ──────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base">
            Riwayat Nilai per Semester
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Klik baris untuk melihat detail mata kuliah
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold w-6" />
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                  Semester
                </th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                  Tahun Akademik
                </th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                  IPK
                </th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                  Perubahan
                </th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                  MK Belum Lulus
                </th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {historyWithMK.map((h, idx) => {
                const change = ipkChange(idx)
                const isExpanded = expandedSem === h.semester
                return (
                  <>
                    <tr
                      key={h.semester}
                      className="hover:bg-blue-50/40 cursor-pointer border-b border-gray-50 transition-colors"
                      onClick={() =>
                        setExpandedSem(isExpanded ? null : h.semester)
                      }
                    >
                      <td className="px-4 py-3 text-gray-400">
                        {isExpanded ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </td>
                      <td className="px-3 py-3 font-medium text-gray-800">
                        Semester {h.semester}
                      </td>
                      <td className="px-3 py-3 text-gray-500 text-xs">
                        {h.tahun}
                      </td>
                      <td className="px-3 py-3 font-bold text-[#263F93]">
                        {h.ipk.toFixed(2)}
                      </td>
                      <td className="px-3 py-3">
                        {change === null ? (
                          <span className="text-gray-300 text-xs">—</span>
                        ) : change > 0 ? (
                          <span className="text-green-600 text-xs font-semibold">
                            +{change.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs font-semibold">
                            {change.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {h.mkBelumLulus > 0 ? (
                          <span className="text-yellow-700 font-semibold text-xs">
                            {h.mkBelumLulus} MK
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {h.ipk >= THRESHOLD ? (
                          <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-0.5">
                            Di atas standar
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">
                            Di bawah standar
                          </span>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${h.semester}-detail`}>
                        <td
                          colSpan={7}
                          className="px-10 py-4 bg-blue-50/30 border-b border-gray-100"
                        >
                          <div className="text-xs font-semibold text-gray-500 mb-2">
                            Mata Kuliah — Semester {h.semester}
                          </div>
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-400">
                                <th className="text-left pb-1 pr-6 font-medium">
                                  Kode MK
                                </th>
                                <th className="text-left pb-1 pr-6 font-medium">
                                  Nama
                                </th>
                                <th className="text-left pb-1 pr-6 font-medium">
                                  SKS
                                </th>
                                <th className="text-left pb-1 font-medium">
                                  Nilai
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {h.mk.map((m: any) => (
                                <tr
                                  key={m.kode}
                                  className="text-gray-700 border-t border-blue-100/50"
                                >
                                  <td className="py-1.5 pr-6 font-mono">
                                    {m.kode}
                                  </td>
                                  <td className="py-1.5 pr-6">{m.nama}</td>
                                  <td className="py-1.5 pr-6">{m.sks}</td>
                                  <td className="py-1.5 font-bold">
                                    {m.nilai}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
