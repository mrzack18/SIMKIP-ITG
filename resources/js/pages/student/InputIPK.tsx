import { useState, useEffect } from "react"
import { api } from "../../services/api"
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
import { TahunAjaranFilter, getCurrentTahunAjaran } from "@/components/ui/TahunAjaranFilter";
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
  Send,
  RotateCcw,
  Loader,
  FileText,
} from "lucide-react"
import React from "react"
import { calculateSemester, normalizeTA } from "@/utils/tahunAjaranHelper";

// ─── Constants ────────────────────────────────────────────────────────────────
const THRESHOLD = 3.0

type NilaiHuruf = "A" | "AB" | "B" | "BC" | "C" | "D" | "E" | ""

interface MataKuliah {
  id: number
  kode: string
  nama: string
  sks: number
  nilai: NilaiHuruf
}

interface SemesterRecord {
  id: number
  semester: number
  tahun: string
  ips: number
  ipk: number
  status: "Draft" | "Diajukan" | "Disetujui" | "Ditolak" | string
  catatan_admin: string | null
  file_khs: string | null
  mataKuliah?: any[]
  mkBelumLulus?: number
}

interface CarryOver {
  kode: string
  nama: string
  sks: number
  nilaiHuruf: string
  semesterAwal: string
}

interface PeriodeConfig {
  aktif: boolean
  buka: string
  tutup: string
  tahun_akademik: string
  semester: string
  tahun_ajaran: string
  nilai_mutu?: Record<string, number>
}

// ─── Form status machine ──────────────────────────────────────────────────────
type FormStatus = "idle" | "draft" | "diajukan" | "ditolak" | "disetujui"

// ─── Grade helpers ─────────────────────────────────────────────────────────────
function getLulus(nilai: NilaiHuruf): boolean | null {
  if (!nilai) return null
  return nilai !== "D" && nilai !== "E"
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function InputIPK() {
  const [taFilter, setTaFilter] = useState(getCurrentTahunAjaran());

  const [mkList, setMkList] = useState<MataKuliah[]>([])
  const [nextId, setNextId] = useState(1)
  const [toast, setToast] = useState<string | null>(null)
  const [expandedSem, setExpandedSem] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [historyData, setHistoryData] = useState<SemesterRecord[]>([])
  const [carryOverData, setCarryOverData] = useState<CarryOver[]>([])
  const [statistik, setStatistik] = useState({
    tertinggi: { ipk: 0, semester: "-" },
    terendah: { ipk: 0, semester: "-" },
    rata_rata: 0,
    total_sks_lulus: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [periode, setPeriode] = useState<PeriodeConfig | null>(null)
  const [periodeError, setPeriodeError] = useState(false)
  const [nilaiMutuMap, setNilaiMutuMap] = useState<Record<string, number>>({})

  const getNilaiMutu = (nilai: string) => nilaiMutuMap[nilai] ?? null

  // ── Form state ──────────────────────────────────────────────────────────────
  const [targetSemester, setTargetSemester] = useState(1)
  const [formStatus, setFormStatus] = useState<FormStatus>("idle")
  const [catatanRevisi, setCatatanRevisi] = useState<string | null>(null)

  // ── Profile ─────────────────────────────────────────────────────────────────
  const [mahasiswaProfile, setMahasiswaProfile] = useState<{ angkatan: number } | null>(null)

  // Computed displayed semester based on angkatan + TA filter
  const displayedSemester = mahasiswaProfile && taFilter !== "Semua"
    ? calculateSemester(mahasiswaProfile.angkatan, taFilter)
    : targetSemester

  // Periode helpers
  const isPeriodeAktif = () => {
    if (!periode?.aktif) return false
    const now = new Date()
    if (now < new Date(periode.buka)) return false
    if (now > new Date(periode.tutup)) return false
    // TA filter must match configured TA
    if (taFilter !== "Semua" && periode.tahun_ajaran) {
      const normalize = (ta: string) => ta.replace(/^Tahun\s+/i, "").replace(/-1$/, " Ganjil").replace(/-2$/, " Genap")
      if (normalize(taFilter) !== normalize(periode.tahun_ajaran)) return false
    }
    return true
  }
  const isLocked = () => {
    if (isSubmitting) return true
    if (isTANotMatched()) return true
    // Diajukan / Disetujui selalu locked
    if (["diajukan", "disetujui"].includes(formStatus)) return true
    // Ditolak — locked hanya jika periode TIDAK aktif
    if (formStatus === "ditolak" && !isPeriodeAktif()) return true
    // Idle (belum ada data) — locked jika periode tidak aktif
    if (formStatus === "idle" && !isPeriodeAktif()) return true
    return false
  }
  const isPeriodeClosed = () => {
    if (!periode?.aktif) return true
    return new Date() > new Date(periode.tutup)
  }
  const isPeriodeNotStarted = () => {
    if (!periode?.aktif) return true
    return new Date() < new Date(periode.buka)
  }
  const isTANotMatched = () => {
    if (taFilter === "Semua" || !periode?.tahun_ajaran) return false
    const normalize = (ta: string) => ta.replace(/^Tahun\s+/i, "").replace(/-1$/, " Ganjil").replace(/-2$/, " Genap")
    return normalize(taFilter) !== normalize(periode.tahun_ajaran)
  }

  const fetchData = async () => {
    try {
      const ta = taFilter === "Semua" ? undefined : taFilter
      const [resIpk, resPeriode, resProfile]: any = await Promise.all([
        api.get('/ipk', ta ? { tahun_ajaran: ta } : undefined),
        api.get('/konfigurasi/periode'),
        api.get('/profile').catch(() => null),
      ])

      const history: SemesterRecord[] = resIpk.data || []
      setHistoryData(history)
      setCarryOverData(resIpk.carry_over || [])
      if (resIpk.statistik) setStatistik(resIpk.statistik)
      if (resPeriode.nilai_mutu) setNilaiMutuMap(resPeriode.nilai_mutu)
      setPeriode(resPeriode)
      // Profile: angkatan ada di resProfile.data.angkatan (bukan resProfile.mahasiswa.angkatan)
      const angkatan = resProfile?.data?.angkatan ?? resProfile?.mahasiswa?.angkatan ?? 2022
      if (resProfile?.data) {
        setMahasiswaProfile({ angkatan })
      }

      // Compute displayedSemester from fetched profile + taFilter
      const computedDisplayedSem = calculateSemester(angkatan, taFilter || "Semua")

      // Find record matching the displayed semester (key data for this TA filter)
      const recordForSemester = history.find((r: SemesterRecord) => r.semester === computedDisplayedSem)

      if (recordForSemester) {
        // Data exists for this semester
        switch (recordForSemester.status) {
          case "Draft":
            setFormStatus("draft")
            setCatatanRevisi(null)
            if (recordForSemester.mataKuliah?.length > 0) {
              setMkList(recordForSemester.mataKuliah.map((mk: any) => ({
                id: mk.id || Math.random(),
                kode: mk.kode,
                nama: mk.nama,
                sks: mk.sks,
                nilai: (mk.nilaiHuruf || mk.nilai_huruf || "") as NilaiHuruf,
              })))
            } else {
              setMkList([])
            }
            break
          case "Diajukan":
          case "Menunggu":
            setFormStatus("diajukan")
            setCatatanRevisi(recordForSemester.catatan_admin)
            setMkList([])
            break
          case "Ditolak":
            setFormStatus("ditolak")
            setCatatanRevisi(recordForSemester.catatan_admin)
            if (recordForSemester.mataKuliah?.length > 0) {
              setMkList(recordForSemester.mataKuliah.map((mk: any) => ({
                id: mk.id || Math.random(),
                kode: mk.kode,
                nama: mk.nama,
                sks: mk.sks,
                nilai: (mk.nilaiHuruf || mk.nilai_huruf || "") as NilaiHuruf,
              })))
            } else {
              setMkList([])
            }
            break
          case "Disetujui":
            setFormStatus("disetujui")
            setCatatanRevisi(null)
            setMkList([])
            break
          default:
            setFormStatus("idle")
            setCatatanRevisi(null)
            setMkList([])
        }
      } else {
        // No data for this semester yet — idle, empty form
        setFormStatus("idle")
        setCatatanRevisi(null)
        setMkList([])
      }
    } catch {
      setPeriodeError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [taFilter])

  // Sync targetSemester dengan displayedSemester saat TA filter berubah
  useEffect(() => {
    if (mahasiswaProfile && displayedSemester > 0) {
      setTargetSemester(displayedSemester)
    }
  }, [taFilter, mahasiswaProfile, displayedSemester])

  // Calculations
  const validMK = mkList.filter((m) => m.nilai !== "" && m.sks > 0)
  const totalSKS = validMK.reduce((s, m) => s + m.sks, 0)
  const totalMutu = validMK.reduce((s, m) => {
    const mutu = getNilaiMutu(m.nilai)
    return s + (mutu !== null ? mutu * m.sks : 0)
  }, 0)
  const ipsSemester = totalSKS > 0 ? (totalMutu / totalSKS).toFixed(2) : "0.00"
  const mkDE = mkList.filter((m) => m.nilai === "D" || m.nilai === "E")

  // Row handlers
  const addRow = () => {
    setMkList((prev) => [...prev, { id: nextId, kode: "", nama: "", sks: 2, nilai: "" }])
    setNextId((n) => n + 1)
  }
  const deleteRow = (id: number) => { if (!isLocked()) setMkList((prev) => prev.filter((m) => m.id !== id)) }
  const updateRow = (id: number, field: keyof MataKuliah, value: any) => {
    if (!isLocked()) setMkList((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  // Build FormData — uses displayedSemester (computed) NOT targetSemester (state)
  const buildFormData = (): FormData => {
    const fd = new FormData()
    fd.append('semester', String(displayedSemester))
    // Send tahun_ajaran: use taFilter if not "Semua", otherwise derive from periode
    if (taFilter !== "Semua") {
      fd.append('tahun_ajaran', taFilter)
    } else if (periode?.tahun_ajaran) {
      fd.append('tahun_ajaran', periode.tahun_ajaran)
    }
    if (uploadedFile) fd.append('file_khs', uploadedFile)
    mkList.forEach((mk, idx) => {
      fd.append(`mata_kuliah[${idx}][kode]`, mk.kode)
      fd.append(`mata_kuliah[${idx}][nama]`, mk.nama)
      fd.append(`mata_kuliah[${idx}][sks]`, String(mk.sks))
      fd.append(`mata_kuliah[${idx}][nilai_huruf]`, mk.nilai)
    })
    return fd
  }

  // Save as Draft
  const handleSaveDraft = async () => {
    if (mkList.length === 0 || totalSKS === 0) return alert("Silakan tambahkan mata kuliah terlebih dahulu.")
    if (!isPeriodeAktif()) return alert("Periode input nilai tidak aktif.")
    setIsSubmitting(true)
    try {
      await api.post('/ipk', buildFormData())
      setFormStatus("draft")
      setToast("Draft tersimpan. Klik \"Ajukan\" bila sudah yakin.")
      setTimeout(() => setToast(null), 4000)
      fetchData()
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan draft")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit for Validation
  const handleAjukan = async () => {
    if (mkList.length === 0 || totalSKS === 0) return alert("Silakan tambahkan mata kuliah terlebih dahulu.")
    if (!isPeriodeAktif()) return alert("Periode input nilai tidak aktif.")
    setIsSubmitting(true)
    try {
      await api.post('/ipk', buildFormData())
      await api.post('/ipk/submit', {
        semester: displayedSemester,
        tahun_ajaran: taFilter !== "Semua" ? taFilter : undefined,
      })
      setFormStatus("diajukan")
      setToast("Nilai berhasil diajukan untuk divalidasi.")
      setTimeout(() => setToast(null), 4000)
      fetchData()
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengajukan nilai")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file)
  }
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  const ipkChange = (idx: number) => {
    if (idx === 0) return null
    return historyData[idx].ipk - historyData[idx - 1].ipk
  }

  const inputClass = isLocked()
    ? "w-full border border-gray-100 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
    : "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93]"
  const selectClass = isLocked()
    ? "w-full border border-gray-100 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
    : "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] bg-white"

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    const isLast = historyData.length > 0 && payload.semester === historyData[historyData.length - 1].semester
    return (
      <circle cx={cx} cy={cy} r={isLast ? 7 : 4}
        fill={payload.ipk >= THRESHOLD ? "#059669" : "#DC2626"} stroke="white" strokeWidth={2} />
    )
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-64 text-gray-500">
      <Loader className="animate-spin w-8 h-8 mr-2" /> Memuat...
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
          <CheckCircle size={16} />{toast}
        </div>
      )}

      {/* ─── SECTION 1: Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Input Nilai Semester</h1>
          <p className="text-gray-500 text-sm mt-1">Catat nilai mata kuliah dan pantau perkembangan akademik Anda</p>
        </div>
        <div><TahunAjaranFilter value={taFilter} onChange={setTaFilter} /></div>
      </div>

      {/* ─── Periode Banner ──────────────────────────────────────────────── */}
      {periodeError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
          <span className="text-sm text-red-700 font-medium">Gagal memuat konfigurasi akademik. Silakan muat ulang halaman.</span>
        </div>
      ) : isTANotMatched() ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <span className="text-sm text-amber-700 font-medium">
            Periode input untuk <strong>{normalizeTA(taFilter)}</strong> belum dibuka. Pengelola KIP-K membuka periode untuk <strong>{normalizeTA(periode?.tahun_ajaran || '')}</strong>. Silakan pilih TA yang sesuai.
          </span>
        </div>
      ) : isPeriodeClosed() ? (
        <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0" />
          <span className="text-sm text-gray-600 font-medium">
            Periode input nilai telah ditutup pada {new Date(periode?.tutup || "").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}. Seluruh input terkunci.
          </span>
        </div>
      ) : isPeriodeNotStarted() ? (
        <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0" />
          <span className="text-sm text-gray-600 font-medium">
            Periode input nilai belum dibuka. Akan dibuka pada {new Date(periode?.buka || "").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}.
          </span>
        </div>
      ) : (
        <div className="bg-[#EDF0F8] border border-[#263F93] rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#263F93] shrink-0" />
          <span className="text-sm font-semibold text-[#263F93]">
            Periode input aktif untuk <strong>{normalizeTA(taFilter)}</strong> hingga {new Date(periode?.tutup || "").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      )}

      {/* ─── SECTION 2: Stat Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <TrendingUp size={18} className="text-green-500" />, label: "IPK Tertinggi", val: Number(statistik.tertinggi.ipk).toFixed(2), sub: `Semester ${statistik.tertinggi.semester}` },
          { icon: <TrendingDown size={18} className="text-red-400" />, label: "IPK Terendah", val: Number(statistik.terendah.ipk).toFixed(2), sub: `Semester ${statistik.terendah.semester}` },
          { icon: <Award size={18} style={{ color: "#D4A72C" }} />, label: "IPK Rata-rata", val: Number(statistik.rata_rata).toFixed(2), sub: "Semua semester" },
        ].map(({ icon, label, val, sub }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-gray-500">{label}</span></div>
            <div className="font-bold text-2xl text-[#263F93]">{val}</div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* ─── SECTION 3: Progres IPK Chart ────────────────────────────────── */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} className="text-[#263F93]" />
          <h2 className="font-semibold text-gray-800 text-sm">Progres IPK</h2>
          <div className="ml-auto flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-gray-600"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Di atas standar (3.0)</span>
            <span className="flex items-center gap-1 text-gray-600"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Di bawah standar</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="ipkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#263F93" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#263F93" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="tahun" tick={{ fontSize: 11, fill: "#9ca3af" }} interval={0} />
            <YAxis domain={[2.0, 4.0]} tick={{ fontSize: 11, fill: "#9ca3af" }} tickCount={5} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(v: any) => [Number(v).toFixed(2), "IPK"]} labelFormatter={(l) => `TA ${l}`} />
            <ReferenceLine y={THRESHOLD} stroke="#D4A72C" strokeWidth={2} strokeDasharray="4 3" label={{ value: "Standar 3.0", position: "insideTopRight", fontSize: 10, fill: "#9ca3af" }} />
            <Area type="monotone" dataKey="ipk" stroke="#263F93" strokeWidth={2.5} fill="url(#ipkGradient)" dot={<CustomDot />} activeDot={{ r: 6, fill: "#263F93" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ─── SECTION 4: Input Nilai MK ───────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base">Input Nilai Mata Kuliah — Semester {displayedSemester}</h2>
        </div>

        {/* ── Locked: TA tidak cocok ── */}
        {isTANotMatched() && (
          <div className="p-8 text-center">
            <Lock size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              Periode input untuk {normalizeTA(taFilter)} belum dibuka.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Pengelola KIP-K membuka periode untuk {normalizeTA(periode?.tahun_ajaran || '')}. Silakan ubah filter tahun ajaran.
            </p>
          </div>
        )}

        {/* ── Locked: periode belum buka / sudah tutup (TA cocok tapi periode tidak aktif) ── */}
        {!isTANotMatched() && !isPeriodeAktif() && (
          <div className="p-8 text-center">
            <Lock size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              {isPeriodeClosed()
                ? "Periode input nilai telah ditutup."
                : isPeriodeNotStarted()
                ? "Periode input belum dibuka."
                : "Periode input tidak aktif."}
            </p>
          </div>
        )}

        {/* ── Menunggu Validasi (locked, apapun kondisi periode) ── */}
        {!isTANotMatched() && formStatus === "diajukan" && (
          <div className="p-8 text-center">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-xl inline-block max-w-lg mx-auto">
              <h3 className="font-bold mb-1 flex items-center justify-center gap-2">
                <Loader size={16} className="animate-spin" /> Menunggu Validasi Pengelola
              </h3>
              <p className="text-sm">Nilai Semester {displayedSemester} sedang dievaluasi. Anda tidak dapat melakukan perubahan saat ini.</p>
              {catatanRevisi && (
                <p className="text-xs mt-3 bg-white/60 p-2 rounded text-blue-800 italic">"{catatanRevisi}"</p>
              )}
            </div>
          </div>
        )}

        {/* ── Telah Disetujui (locked, apapun kondisi periode) ── */}
        {!isTANotMatched() && formStatus === "disetujui" && (
          <div className="p-8 text-center">
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl inline-block max-w-lg mx-auto">
              <h3 className="font-bold mb-1 flex items-center justify-center gap-2">
                <CheckCircle size={16} /> Nilai Telah Disetujui
              </h3>
              <p className="text-sm">Nilai Semester {displayedSemester} sudah disetujui oleh pengelola dan terkunci permanen.</p>
            </div>
          </div>
        )}

        {/* ── Ditolak + periode TIDAK aktif (locked — tidak bisa apa-apa) ── */}
        {!isTANotMatched() && formStatus === "ditolak" && !isPeriodeAktif() && (
          <div className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl inline-block max-w-lg mx-auto">
              <h3 className="font-bold mb-1 flex items-center justify-center gap-2">
                <AlertTriangle size={16} /> Evaluasi Semester {displayedSemester} Ditolak
              </h3>
              <p className="text-sm mt-1">Silakan perbaiki isian nilai dan ajukan kembali saat periode dibuka.</p>
              {catatanRevisi && (
                <p className="text-xs mt-3 bg-white/60 p-2 rounded text-red-800 italic">"{catatanRevisi}"</p>
              )}
            </div>
            <p className="text-gray-400 text-xs mt-4">
              Periode input telah ditutup. Hubungi Pengelola KIP-K untuk membuka periode perbaikan.
            </p>
          </div>
        )}

        {/* ── Ditolak + periode AKTIF (bisa Ajukan Ulang) ── */}
        {!isTANotMatched() && formStatus === "ditolak" && isPeriodeAktif() && (
          <>
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <AlertTriangle size={16} /> Evaluasi Semester {displayedSemester} Ditolak
              </h3>
              <p className="text-sm mt-1">Silakan perbaiki isian nilai di bawah dan ajukan kembali.</p>
              {catatanRevisi && (
                <p className="text-xs mt-2 bg-white/60 p-2 rounded text-red-800 italic">"{catatanRevisi}"</p>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold w-8">No</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-28">Kode MK</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">Nama Mata Kuliah</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-20">SKS</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-28">Nilai Huruf</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-24">Nilai Mutu</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-28">Status</th>
                    <th className="px-3 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mkList.map((mk, idx) => {
                    const mutu = getNilaiMutu(mk.nilai)
                    const lulus = getLulus(mk.nilai)
                    return (
                      <tr key={mk.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <input type="text" value={mk.kode} onChange={(e) => updateRow(mk.id, "kode", e.target.value)}
                            disabled={isLocked()} placeholder="IF401" className={inputClass} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="text" value={mk.nama} onChange={(e) => updateRow(mk.id, "nama", e.target.value)}
                            disabled={isLocked()} placeholder="Nama mata kuliah" className={inputClass} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" min={1} max={6} value={mk.sks}
                            onChange={(e) => updateRow(mk.id, "sks", parseInt(e.target.value) || 1)}
                            disabled={isLocked()} className={inputClass} />
                        </td>
                        <td className="px-3 py-2">
                          <select value={mk.nilai} onChange={(e) => updateRow(mk.id, "nilai", e.target.value as NilaiHuruf)}
                            disabled={isLocked()} className={selectClass}>
                            <option value="">-- Pilih --</option>
                            {["A", "AB", "B", "BC", "C", "D", "E"].map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <div className="border border-gray-100 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 text-gray-600 text-center">
                            {mutu !== null ? mutu.toFixed(1) : "—"}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {lulus === null ? <span className="text-gray-300 text-xs">—</span>
                           : lulus
                             ? <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-0.5">Lulus</span>
                             : <span className="inline-flex items-center text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">Belum Lulus</span>}
                        </td>
                        <td className="px-3 py-2">
                          <button onClick={() => deleteRow(mk.id)} disabled={isLocked()}
                            className="text-gray-300 hover:text-red-400 transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer + upload KHS */}
            <div className="px-5 pt-3 pb-4 border-t border-gray-100 flex items-center justify-between">
              <button onClick={addRow} disabled={isLocked()}
                className="flex items-center gap-2 text-sm text-[#263F93] font-semibold hover:text-[#1a2d6d] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <Plus size={15} />Tambah Mata Kuliah
              </button>
              <div className="text-sm text-gray-600 font-medium flex items-center gap-4">
                <span>Total SKS: <span className="font-bold text-gray-900">{totalSKS}</span></span>
                <span className="text-gray-300">|</span>
                <span>IPS: <span className="font-bold text-[#263F93]">{ipsSemester}</span></span>
              </div>
            </div>

            {/* Upload KHS */}
            <div className="px-5 pb-5">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50/40 hover:border-gray-300 transition-colors cursor-pointer relative">
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-700 font-medium">
                    <FileText size={17} />
                    <span>{uploadedFile.name}</span>
                    {!isLocked() && (
                      <button onClick={() => setUploadedFile(null)} className="text-gray-400 hover:text-gray-600 ml-2 text-xs underline">Ganti</button>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Seret dan lepas file KHS di sini, atau <label className="text-[#263F93] font-semibold cursor-pointer hover:underline">
                      pilih file<input type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileInput} /></label></p>
                    <p className="text-xs text-gray-400 mt-1">PDF atau gambar (maks. 5 MB)</p>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400">KHS digunakan sebagai bukti verifikasi oleh Pengelola KIP-K</p>

              {/* Action buttons */}
              <div className="space-y-2">
                {/* Save Draft */}
                {formStatus !== "draft" && (
                  <button onClick={handleSaveDraft} disabled={isSubmitting || isLocked()}
                    className="w-full border border-[#263F93] text-[#263F93] font-semibold py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader size={15} className="animate-spin" /> : <CheckCircle size={16} />}
                    Simpan Draft
                  </button>
                )}

                {/* Ajukan / Ajukan Ulang */}
                <button onClick={handleAjukan} disabled={isSubmitting || isLocked()}
                  className="w-full bg-[#263F93] hover:bg-[#1a2d6d] text-white font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting
                    ? <><Loader size={15} className="animate-spin" />Menyimpan...</>
                    : formStatus === "ditolak"
                      ? <><RotateCcw size={16} />Ajukan Ulang untuk Divalidasi</>
                      : <><Send size={16} />Ajukan Nilai untuk Divalidasi</>}
                </button>
              </div>

              {/* Draft notice */}
              {formStatus === "draft" && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <CheckCircle size={13} className="text-gray-400" />
                  Draft tersimpan. Klik "Ajukan Nilai" bila sudah yakin.
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Belum ada data + periode tidak aktif (locked) ── */}
        {!isTANotMatched() && formStatus === "idle" && !isPeriodeAktif() && (
          <div className="p-8 text-center">
            <Lock size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              {isPeriodeClosed()
                ? "Periode input nilai telah ditutup."
                : isPeriodeNotStarted()
                ? "Periode input belum dibuka."
                : "Periode input tidak aktif."}
            </p>
          </div>
        )}

        {/* ── Form aktif: idle (kosong) / draft + periode terbuka ── */}
        {!isTANotMatched() && !["diajukan", "disetujui", "ditolak"].includes(formStatus) && isPeriodeAktif() && (

          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold w-8">No</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-28">Kode MK</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">Nama Mata Kuliah</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-20">SKS</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-28">Nilai Huruf</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-24">Nilai Mutu</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold w-28">Status</th>
                    <th className="px-3 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mkList.map((mk, idx) => {
                    const mutu = getNilaiMutu(mk.nilai)
                    const lulus = getLulus(mk.nilai)
                    return (
                      <tr key={mk.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <input type="text" value={mk.kode} onChange={(e) => updateRow(mk.id, "kode", e.target.value)}
                            disabled={isLocked()} placeholder="IF401" className={inputClass} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="text" value={mk.nama} onChange={(e) => updateRow(mk.id, "nama", e.target.value)}
                            disabled={isLocked()} placeholder="Nama mata kuliah" className={inputClass} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" min={1} max={6} value={mk.sks}
                            onChange={(e) => updateRow(mk.id, "sks", parseInt(e.target.value) || 1)}
                            disabled={isLocked()} className={inputClass} />
                        </td>
                        <td className="px-3 py-2">
                          <select value={mk.nilai} onChange={(e) => updateRow(mk.id, "nilai", e.target.value as NilaiHuruf)}
                            disabled={isLocked()} className={selectClass}>
                            <option value="">-- Pilih --</option>
                            {["A", "AB", "B", "BC", "C", "D", "E"].map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <div className="border border-gray-100 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 text-gray-600 text-center">
                            {mutu !== null ? mutu.toFixed(1) : "—"}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {lulus === null ? <span className="text-gray-300 text-xs">—</span>
                           : lulus
                             ? <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-0.5">Lulus</span>
                             : <span className="inline-flex items-center text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">Belum Lulus</span>}
                        </td>
                        <td className="px-3 py-2">
                          <button onClick={() => deleteRow(mk.id)} disabled={isLocked()}
                            className="text-gray-300 hover:text-red-400 transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer + upload KHS */}
            <div className="px-5 pt-3 pb-4 border-t border-gray-100 flex items-center justify-between">
              <button onClick={addRow} disabled={isLocked()}
                className="flex items-center gap-2 text-sm text-[#263F93] font-semibold hover:text-[#1a2d6d] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <Plus size={15} />Tambah Mata Kuliah
              </button>
              <div className="text-sm text-gray-600 font-medium flex items-center gap-4">
                <span>Total SKS: <span className="font-bold text-gray-900">{totalSKS}</span></span>
                <span className="text-gray-300">|</span>
                <span>IPS: <span className="font-bold text-[#263F93]">{ipsSemester}</span></span>
              </div>
            </div>

            {/* Upload KHS */}
            <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
              <div className="text-sm font-semibold text-gray-700">Upload Kartu Hasil Studi (KHS)</div>
              <div onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)} onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragOver ? "border-[#263F93] bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <CheckCircle size={16} /><span className="text-sm font-medium">{uploadedFile.name}</span>
                    {!isLocked() && (
                      <button onClick={() => setUploadedFile(null)} className="text-gray-400 hover:text-gray-600 ml-2 text-xs underline">Ganti</button>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Seret dan lepas file KHS di sini, atau <label className="text-[#263F93] font-semibold cursor-pointer hover:underline">
                      pilih file<input type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileInput} /></label></p>
                    <p className="text-xs text-gray-400 mt-1">PDF atau gambar (maks. 5 MB)</p>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400">KHS digunakan sebagai bukti verifikasi oleh Pengelola KIP-K</p>

              {/* Action buttons */}
              <div className="space-y-2">
                {/* Save Draft */}
                {formStatus !== "draft" && (
                  <button onClick={handleSaveDraft} disabled={isSubmitting || isLocked()}
                    className="w-full border border-[#263F93] text-[#263F93] font-semibold py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader size={15} className="animate-spin" /> : <CheckCircle size={16} />}
                    Simpan Draft
                  </button>
                )}

                {/* Ajukan / Ajukan Ulang */}
                <button onClick={handleAjukan} disabled={isSubmitting || isLocked()}
                  className="w-full bg-[#263F93] hover:bg-[#1a2d6d] text-white font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting
                    ? <><Loader size={15} className="animate-spin" />Menyimpan...</>
                    : formStatus === "ditolak"
                      ? <><RotateCcw size={16} />Ajukan Ulang untuk Divalidasi</>
                      : <><Send size={16} />Ajukan Nilai untuk Divalidasi</>}
                </button>
              </div>

              {/* Draft notice */}
              {formStatus === "draft" && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <CheckCircle size={13} className="text-gray-400" />
                  Draft tersimpan. Klik "Ajukan Nilai" bila sudah yakin.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ─── SECTION 5: Carry-Over ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <AlertTriangle size={17} style={{ color: "#D4A72C" }} />
          <h2 className="font-bold text-gray-900 text-base">Mata Kuliah Belum Lulus</h2>
        </div>

        {carryOverData.length > 0 && (
          <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-sm text-amber-800">
              Anda memiliki <span className="font-bold">{carryOverData.length}</span> mata kuliah belum lulus yang berpotensi menghambat Kerja Praktik / Skripsi.
            </p>
          </div>
        )}

        {mkDE.length > 0 && (
          <div className="mx-5 mt-4">
            <div className="mb-2">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">MK Semester Ini dengan Nilai D/E</span>
            </div>
            <div className="border border-red-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-50">
                    <th className="text-left px-4 py-2.5 text-xs text-red-400 font-semibold">Kode MK</th>
                    <th className="text-left px-3 py-2.5 text-xs text-red-400 font-semibold">Nama MK</th>
                    <th className="text-left px-3 py-2.5 text-xs text-red-400 font-semibold">SKS</th>
                    <th className="text-left px-3 py-2.5 text-xs text-red-400 font-semibold">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-50">
                  {mkDE.map((mk) => (
                    <tr key={mk.id} className="bg-white">
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{mk.kode || "—"}</td>
                      <td className="px-3 py-2.5 text-gray-800">{mk.nama || "—"}</td>
                      <td className="px-3 py-2.5 text-gray-600">{mk.sks}</td>
                      <td className="px-3 py-2.5"><span className="font-bold text-red-600">{mk.nilai}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="overflow-x-auto p-5">
          {carryOverData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Tidak ada mata kuliah carry-over yang belum diperbaiki.</p>
          ) : (
            <>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Carry-Over dari Semester Sebelumnya</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold rounded-l-lg">Kode MK</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">Nama MK</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">SKS</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">Nilai</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">Semester Awal</th>
                    <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {carryOverData.map((c) => (
                    <tr key={c.kode} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.kode}</td>
                      <td className="px-3 py-3 text-gray-800">{c.nama}</td>
                      <td className="px-3 py-3 text-gray-600">{c.sks}</td>
                      <td className="px-3 py-3"><span className="font-bold text-red-600">{c.nilaiHuruf}</span></td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{c.semesterAwal}</td>
                      <td className="px-3 py-3"><span className="inline-flex items-center text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full px-2.5 py-0.5">Belum Diperbaiki</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* ─── SECTION 6: Riwayat per Semester ──────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base">Riwayat Nilai per Semester</h2>
          <p className="text-xs text-gray-400 mt-0.5">Klik baris untuk melihat detail mata kuliah</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold w-6" />
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">Semester</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">Tahun Akademik</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">IPK</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">Perubahan</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">MK Belum Lulus</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">Status</th>
                <th className="text-left px-3 py-3 text-xs text-gray-500 font-semibold">KHS</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((h, idx) => {
                const change = ipkChange(idx)
                const isExpanded = expandedSem === h.semester
                return (
                  <React.Fragment key={h.semester}>
                    <tr
                      className="hover:bg-blue-50/40 cursor-pointer border-b border-gray-50 transition-colors"
                      onClick={() => setExpandedSem(isExpanded ? null : h.semester)}>
                      <td className="px-4 py-3 text-gray-400">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </td>
                      <td className="px-3 py-3 font-medium text-gray-800">Semester {h.semester}</td>
                      <td className="px-3 py-3 text-gray-500 text-xs">{h.tahun}</td>
                      <td className="px-3 py-3 font-bold text-[#263F93]">{h.ipk.toFixed(2)}</td>
                      <td className="px-3 py-3">
                        {change === null ? <span className="text-gray-300 text-xs">—</span>
                          : change > 0 ? <span className="text-green-600 text-xs font-semibold">+{change.toFixed(2)}</span>
                          : <span className="text-red-500 text-xs font-semibold">{change.toFixed(2)}</span>}
                      </td>
                      <td className="px-3 py-3">
                        {(h.mkBelumLulus ?? 0) > 0
                          ? <span className="text-yellow-700 font-semibold text-xs">{h.mkBelumLulus} MK</span>
                          : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="px-3 py-3">
                        {h.status === "Disetujui"
                          ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-0.5"><CheckCircle size={11} />Disetujui</span>
                          : h.status === "Diajukan" || h.status === "Menunggu"
                            ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5"><Loader size={10} className="animate-spin" />Menunggu</span>
                            : h.status === "Ditolak"
                              ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5"><AlertTriangle size={11} />Ditolak</span>
                              : <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5"><Lock size={10} />Draft</span>}
                      </td>
                      <td className="px-3 py-3">
                        {h.file_khs ? (
                          <a href={h.file_khs} target="_blank" rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-[#263F93] hover:underline font-medium">
                            <FileText size={12} />Lihat
                          </a>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="px-10 py-4 bg-blue-50/30 border-b border-gray-100">
                          <div className="text-xs font-semibold text-gray-500 mb-2">Mata Kuliah — Semester {h.semester}</div>
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-400">
                                <th className="text-left pb-1 pr-6 font-medium">Kode MK</th>
                                <th className="text-left pb-1 pr-6 font-medium">Nama</th>
                                <th className="text-left pb-1 pr-6 font-medium">SKS</th>
                                <th className="text-left pb-1 font-medium">Nilai</th>
                              </tr>
                            </thead>
                            <tbody>
                              {h.mataKuliah?.map((m: any) => (
                                <tr key={m.kode} className="text-gray-700 border-t border-blue-100/50">
                                  <td className="py-1.5 pr-6 font-mono">{m.kode}</td>
                                  <td className="py-1.5 pr-6">{m.nama}</td>
                                  <td className="py-1.5 pr-6">{m.sks}</td>
                                  <td className="py-1.5 font-bold">{m.nilai_huruf}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {h.file_khs && (
                            <div className="mt-3">
                              <a href={h.file_khs} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#263F93] hover:underline font-medium">
                                <FileText size={13} />Lihat file KHS yang diupload
                              </a>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
