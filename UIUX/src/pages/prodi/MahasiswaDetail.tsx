import { useState } from "react"
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
import { mahasiswaList, ipkHistory, spHistoryData } from "@/data/mockData"
import logoItg from "@/imports/logo_itg.jpg"

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
  mataKuliah: MataKuliah[]
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const semesterDetails: SemesterDetail[] = [
  {
    semester: 1,
    tahun: "2022/2023 Ganjil",
    ipk: 3.2,
    mataKuliah: [
      {
        kode: "IF101",
        nama: "Pengantar Teknologi Informasi",
        sks: 3,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF102",
        nama: "Kalkulus",
        sks: 3,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF103",
        nama: "Pemrograman Dasar",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF104",
        nama: "Bahasa Inggris Teknik",
        sks: 2,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF105",
        nama: "Pendidikan Pancasila",
        sks: 2,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF205",
        nama: "Fisika Dasar",
        sks: 2,
        nilaiHuruf: "D",
        nilaiMutu: 1.0,
        lulus: false,
      },
    ],
  },
  {
    semester: 2,
    tahun: "2022/2023 Genap",
    ipk: 3.45,
    mataKuliah: [
      {
        kode: "IF201",
        nama: "Pemrograman Berorientasi Objek",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF202",
        nama: "Aljabar Linear",
        sks: 3,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF203",
        nama: "Sistem Digital",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF204",
        nama: "Bahasa Indonesia",
        sks: 2,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF205",
        nama: "Fisika Dasar",
        sks: 2,
        nilaiHuruf: "D",
        nilaiMutu: 1.0,
        lulus: false,
      },
    ],
  },
  {
    semester: 3,
    tahun: "2023/2024 Ganjil",
    ipk: 3.65,
    mataKuliah: [
      {
        kode: "IF301",
        nama: "Algoritma",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF302",
        nama: "Basis Data",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF303",
        nama: "Jarkom",
        sks: 2,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF304",
        nama: "Struktur Data",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF205",
        nama: "Fisika Dasar (Perbaikan)",
        sks: 2,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
    ],
  },
  {
    semester: 4,
    tahun: "2023/2024 Genap",
    ipk: 3.3,
    mataKuliah: [
      {
        kode: "IF301",
        nama: "Algoritma",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF302",
        nama: "Basis Data",
        sks: 3,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF303",
        nama: "Jarkom",
        sks: 2,
        nilaiHuruf: "D",
        nilaiMutu: 1.0,
        lulus: false,
      },
      {
        kode: "IF304",
        nama: "Struktur Data",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF305",
        nama: "Matematika Diskrit",
        sks: 3,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
    ],
  },
  {
    semester: 5,
    tahun: "2024/2025 Ganjil",
    ipk: 3.1,
    mataKuliah: [
      {
        kode: "IF501",
        nama: "Kecerdasan Buatan",
        sks: 3,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF502",
        nama: "Rekayasa Perangkat Lunak",
        sks: 3,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF503",
        nama: "Jaringan Komputer (Perbaikan)",
        sks: 2,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF504",
        nama: "Pemrograman Web",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
    ],
  },
  {
    semester: 6,
    tahun: "2024/2025 Genap",
    ipk: 3.45,
    mataKuliah: [
      {
        kode: "IF601",
        nama: "Proyek Perangkat Lunak",
        sks: 4,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
      {
        kode: "IF602",
        nama: "Keamanan Jaringan",
        sks: 3,
        nilaiHuruf: "B",
        nilaiMutu: 3.0,
        lulus: true,
      },
      {
        kode: "IF603",
        nama: "Basis Data Lanjut",
        sks: 3,
        nilaiHuruf: "A",
        nilaiMutu: 4.0,
        lulus: true,
      },
    ],
  },
]

const mkBelumLulus = [
  {
    kode: "IF303",
    nama: "Jaringan Komputer",
    sks: 2,
    nilai: "D",
    semesterAwal: 4,
    statusPerbaikan: "belum" as const,
  },
  {
    kode: "IF205",
    nama: "Fisika Dasar",
    sks: 2,
    nilai: "D",
    semesterAwal: 2,
    statusPerbaikan: "lulus" as const,
    lulusDiSem: 5,
  },
]

const mockPrestasi = [
  {
    id: 1,
    nama: "Juara 2 Hackathon Nasional",
    tingkat: "Nasional" as const,
    penyelenggara: "Kemendikbud",
    pencapaian: "Juara 2",
    tanggal: "5 – 7 Jan 2026",
    tempat: "Bandung",
    deskripsi: "Kompetisi hackathon tingkat nasional diikuti 200 tim.",
    link: "https://kemendikbud.go.id",
    status: "Disetujui" as const,
  },
  {
    id: 2,
    nama: "Best Paper IEEE Conference",
    tingkat: "Internasional" as const,
    penyelenggara: "IEEE Indonesia",
    pencapaian: "Best Paper",
    tanggal: "12 – 14 Mar 2026",
    tempat: "Jakarta",
    deskripsi: "Konferensi internasional IEEE bidang teknologi informasi.",
    link: "https://ieee.org",
    status: "Disetujui" as const,
  },
]

const mockOrganisasi = [
  {
    id: 1,
    nama: "BEM Institut Teknologi Garut",
    jabatan: "Ketua Departemen Pendidikan",
    periodeMulai: "September 2024",
    periodeSelesai: "September 2025",
    deskripsi:
      "Bertanggung jawab atas program pendidikan dan kaderisasi BEM ITG.",
    status: "Disetujui" as const,
  },
  {
    id: 2,
    nama: "Himpunan Mahasiswa Teknik Informatika",
    jabatan: "Sekretaris Umum",
    periodeMulai: "September 2025",
    periodeSelesai: "September 2026",
    deskripsi: "Mengelola administrasi dan dokumentasi himpunan.",
    status: "Disetujui" as const,
  },
]

const mockPelatihanAkademik = [
  {
    id: 1,
    nama: "Pelatihan Machine Learning Dasar",
    penyelenggara: "Google DSC ITG",
    tanggalMulai: "10 Agustus 2026",
    tanggalSelesai: "12 Agustus 2026",
    tempat: "Garut",
    deskripsi: "Pelatihan pengenalan ML menggunakan Python.",
    status: "Disetujui" as const,
  },
]

const mockPelatihanNonAkademik = [
  {
    id: 2,
    nama: "Leadership Training",
    penyelenggara: "ITG Career Center",
    tanggalMulai: "20 Agustus 2025",
    tanggalSelesai: "22 Agustus 2025",
    tempat: "Garut",
    deskripsi: "Pelatihan kepemimpinan untuk pengurus organisasi.",
    status: "Disetujui" as const,
  },
]

const dokumenKewajiban = [
  {
    id: 1,
    nama: "PKKMB",
    icon: GraduationCap,
    status: "Disetujui" as const,
    tanggal: "15 Sep 2022",
    catatan: null,
    deskripsi: "Pengenalan Kehidupan Kampus bagi Mahasiswa Baru ITG.",
    tipe: "Kegiatan Wajib",
  },
  {
    id: 2,
    nama: "Bela Negara",
    icon: Shield,
    status: "Disetujui" as const,
    tanggal: "20 Nov 2022",
    catatan: null,
    deskripsi: "Kegiatan bela negara sebagai syarat penerima KIP-K.",
    tipe: "Kegiatan Wajib",
  },
  {
    id: 3,
    nama: "MABIM",
    icon: Star,
    status: "Disetujui" as const,
    tanggal: "10 Agu 2022",
    catatan: null,
    deskripsi: "Masa Bimbingan Mahasiswa Baru tingkat fakultas/prodi.",
    tipe: "Kegiatan Wajib",
  },
  {
    id: 4,
    nama: "Berita Acara KP",
    icon: Briefcase,
    status: "Ditolak" as const,
    tanggal: "5 Jul 2026",
    catatan: "File buram, mohon upload ulang.",
    deskripsi: "Berita acara pelaksanaan Kerja Praktek (KP).",
    tipe: "Dokumen KP",
  },
  {
    id: 5,
    nama: "Sertifikasi",
    icon: Award,
    status: "Menunggu" as const,
    tanggal: "10 Agu 2026",
    catatan: null,
    deskripsi: "Sertifikasi kompetensi bidang studi sesuai prodi.",
    tipe: "Dokumen Kompetensi",
  },
  {
    id: 6,
    nama: "Bukti Sidang Skripsi",
    icon: BookOpen,
    status: "Belum Diunggah" as const,
    tanggal: null,
    catatan: null,
    deskripsi: "Bukti pelaksanaan sidang tugas akhir/skripsi.",
    tipe: "Dokumen Akademik",
  },
]

const mockSP = {
  nomor: "001/SP/KIP-K/ITG/III/2026",
  tanggal: "15 Maret 2026",
  perihal: "Surat Peringatan Pertama (SP1) Penerima KIP-K",
  mahasiswa: {
    nama: "Ahmad Rifaldi",
    nim: "2206001",
    prodi: "Teknik Informatika",
    semester: 6,
  },
  alasan: "IPK turun dari 3.20 ke 2.78 pada Semester IV",
  body: `Dengan hormat, sehubungan dengan hasil evaluasi akademik Semester IV Tahun Akademik 2023/2024, kami sampaikan bahwa Saudara/i mengalami penurunan Indeks Prestasi Kumulatif (IPK) dari 3.20 menjadi 2.78, yang berada di bawah standar minimum yang ditetapkan untuk penerima beasiswa KIP-K sebesar 3.00.\n\nSehubungan dengan hal tersebut, kami memberikan Surat Peringatan Pertama (SP1) sebagai bentuk pembinaan akademik. Saudara/i diwajibkan untuk:\n1. Meningkatkan IPK minimal menjadi 3.00 pada Semester V\n2. Aktif berkonsultasi dengan Dosen Wali\n3. Melaporkan perkembangan akademik kepada Pengelola KIP-K\n\nApabila pada evaluasi Semester V IPK belum mencapai standar minimum, maka akan diterbitkan Surat Peringatan Kedua (SP2).`,
}

const syaratPenyelesaian = [
  { nama: "IPK ≥ 3.00 pada semester akhir", terpenuhi: true },
  { nama: "Semua dokumen kewajiban lengkap", terpenuhi: false },
  { nama: "Tidak memiliki SP aktif", terpenuhi: true },
  { nama: "Laporan akhir penggunaan beasiswa", terpenuhi: false },
  { nama: "Surat keterangan lulus dari akademik", terpenuhi: false },
  { nama: "Bukti yudisium / wisuda", terpenuhi: false },
]

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

const tingkatBadge = (tingkat: string) => {
  if (tingkat === "Internasional") return "bg-purple-100 text-purple-700"
  if (tingkat === "Nasional") return "bg-blue-100 text-blue-700"
  if (tingkat === "Wilayah") return "bg-green-100 text-green-700"
  return "bg-gray-100 text-gray-500"
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
                  "Tahun Ajaran",
                  "IPK",
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
            <tbody className="divide-y divide-gray-50">
              {ipkHistory.map((detail, idx) => {
                const prev = idx > 0 ? ipkHistory[idx - 1] : null
                const delta = prev ? detail.ipk - prev.ipk : null
                return (
                <tr key={detail.semester} className="hover:bg-gray-50/60 transition-colors border-b border-gray-100">
                  <td className="py-3 px-3 text-sm text-gray-700">
                    Semester {detail.semester}
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-500">{detail.tahun}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: detail.ipk >= 3.0 ? "#059669" : "#DC2626" }}
                      >
                        {detail.ipk.toFixed(2)}
                      </span>
                      {delta !== null ? (
                        <span
                          className={`text-xs font-medium ${
                            delta >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {delta >= 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        detail.ipk >= 3.0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {detail.status}
                    </span>
                  </td>
                </tr>
              )})}
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
              <span className="font-semibold text-amber-900 block mb-0.5">Perhatian:</span>
              Mahasiswa ini memiliki {belumLulus.length} MK belum lulus yang berpotensi menghambat KP/Skripsi
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
  const filtered = mockPrestasi.filter((p) => p.tingkat === subTab)

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
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
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                subTab === t
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          Tidak ada prestasi tingkat {subTab}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="border border-[#E2E8F0] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A72C]/10 flex items-center justify-center flex-shrink-0">
                  <Trophy size={18} className="text-[#D4A72C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 leading-snug">
                    {p.nama}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${tingkatBadge(p.tingkat)}`}
                    >
                      {p.tingkat}
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-[#D4A72C]/10 text-[#92700A] text-xs font-semibold rounded-full">
                      {p.pencapaian}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Building2 size={11} className="text-gray-400" />
                  {p.penyelenggara}
                  <a href={p.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink
                      size={11}
                      className="text-[#263F93] ml-auto cursor-pointer hover:opacity-70"
                    />
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-gray-400" />
                  {p.tanggal}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-gray-400" />
                  {p.tempat}
                </div>
              </div>
              <div className="flex gap-2">
                <PlaceholderThumb label="Sertifikat" />
                <PlaceholderThumb label="Foto" />
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(p.status)}`}
                >
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
                <h3 className="font-bold text-gray-900 text-lg leading-snug">
                  {modalItem.nama}
                </h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${tingkatBadge(modalItem.tingkat)}`}
                  >
                    {modalItem.tingkat}
                  </span>
                  <span className="px-2 py-0.5 bg-[#D4A72C]/10 text-[#92700A] text-xs font-semibold rounded-full">
                    {modalItem.pencapaian}
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
            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">
                    Penyelenggara
                  </div>
                  <div className="font-medium text-gray-800">
                    {modalItem.penyelenggara}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">Tanggal</div>
                  <div className="font-medium text-gray-800">
                    {modalItem.tanggal}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">Tempat</div>
                  <div className="font-medium text-gray-800">
                    {modalItem.tempat}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">
                    Link Penyelenggara
                  </div>
                  <a
                    href={modalItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#263F93] hover:underline flex items-center gap-1 truncate"
                  >
                    <ExternalLink size={11} />
                    {modalItem.link.replace("https://", "")}
                  </a>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                <div className="text-gray-800">{modalItem.deskripsi}</div>
              </div>
            </div>

            {/* File placeholders */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Berkas
              </div>
              <FilePlaceholderCard label="Sertifikat" />
              <FilePlaceholderCard label="Foto Bukti" />
            </div>

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

function TabOrganisasi() {
  const [modalItem, setModalItem] = useState<typeof mockOrganisasi[0] | null>(
    null,
  )

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
            onClick={() => setModalItem(o)}
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
              onClick={() => setModalItem(o)}
              className="text-xs text-[#263F93] font-medium hover:underline"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      ))}

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
                <h3 className="font-bold text-gray-900 text-lg leading-snug">
                  {modalItem.nama}
                </h3>
                <span
                  className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadge(modalItem.status)}`}
                >
                  {modalItem.status}
                </span>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">Jabatan</div>
                <div className="font-medium text-gray-800 text-sm">
                  {modalItem.jabatan}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">
                  Periode Mulai
                </div>
                <div className="font-medium text-gray-800 text-sm">
                  {modalItem.periodeMulai}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">
                  Periode Selesai
                </div>
                <div className="font-medium text-gray-800 text-sm">
                  {modalItem.periodeSelesai}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                <div className="text-gray-800 text-sm">
                  {modalItem.deskripsi}
                </div>
              </div>
            </div>

            {/* SK placeholder */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Berkas
              </div>
              <FilePlaceholderCard label="Surat Keputusan (SK)" />
            </div>

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

function TabPelatihan() {
  const [subTab, setSubTab] = useState<"Akademik" | "Non-Akademik">("Akademik")
  const [modalItem, setModalItem] =
    useState<typeof mockPelatihanAkademik[0] | null>(null)
  const [modalJenis, setModalJenis] = useState<"Akademik" | "Non-Akademik">(
    "Akademik",
  )

  const items =
    subTab === "Akademik" ? mockPelatihanAkademik : mockPelatihanNonAkademik

  const openModal = (
    item: typeof mockPelatihanAkademik[0],
    jenis: "Akademik" | "Non-Akademik",
  ) => {
    setModalItem(item)
    setModalJenis(jenis)
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
                onClick={() => openModal(item, subTab)}
                className="text-xs text-[#263F93] font-medium hover:underline"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

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
                <h3 className="font-bold text-gray-900 text-lg leading-snug">
                  {modalItem.nama}
                </h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      modalJenis === "Akademik"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {modalJenis}
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
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">
                  Penyelenggara
                </div>
                <div className="font-medium text-gray-800 text-sm">
                  {modalItem.penyelenggara}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">
                  Tanggal Mulai
                </div>
                <div className="font-medium text-gray-800 text-sm">
                  {modalItem.tanggalMulai}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">
                  Tanggal Selesai
                </div>
                <div className="font-medium text-gray-800 text-sm">
                  {modalItem.tanggalSelesai}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">Tempat</div>
                <div className="font-medium text-gray-800 text-sm">
                  {modalItem.tempat}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 col-span-2">
                <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                <div className="text-gray-800 text-sm">
                  {modalItem.deskripsi}
                </div>
              </div>
            </div>

            {/* Sertifikat placeholder */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Berkas
              </div>
              <FilePlaceholderCard label="Sertifikat" />
            </div>

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

function TabDokumen() {
  const [modalItem, setModalItem] = useState<typeof dokumenKewajiban[0] | null>(
    null,
  )

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
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${statusBadge(d.status)}`}
                >
                  {d.status}
                </span>
                <button
                  onClick={() => setModalItem(d)}
                  className="text-xs text-[#263F93] font-medium hover:underline whitespace-nowrap"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          )
        })}
      </div>

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
                    {modalItem.tipe}
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
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-gray-400 mb-0.5">Deskripsi</div>
                <div className="text-gray-800 text-sm">
                  {modalItem.deskripsi}
                </div>
              </div>
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
            {modalItem.status !== "Belum Diunggah" && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Berkas
                </div>
                <FilePlaceholderCard label={`Dokumen ${modalItem.nama}`} />
              </div>
            )}

            {modalItem.status === "Belum Diunggah" && (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
                <FileText size={24} className="text-gray-300 mx-auto mb-1" />
                <p className="text-xs text-gray-400">
                  Belum ada berkas yang diunggah
                </p>
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
          {spHistoryData.map((sp, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow" />
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
          ))}
        </div>
      </div>
    </div>
  )
}

// Tab 7 (Informasi Pribadi) – read-only: no save button, textarea is readonly
function TabInfoPribadi() {
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
    </div>
  )
}

// Tab 8 (Surat Penyelesaian) – show status and checklist only, no action buttons
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
  const [activeTab, setActiveTab] = useState(0)

  const mhs = mahasiswaList.find((m) => m.id === Number(id)) ?? mahasiswaList[0]
  const hasSP2 = mhs.sp === "SP2" || mhs.sp === "SP3"

  const semesterNum = mhs.semester ?? 6
  const totalSem = 8
  const progressPct = Math.round((semesterNum / totalSem) * 100)

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

      {/* Breadcrumb */}
      <Link
        to="../mahasiswa"
        relative="path"
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
    </div>
  )
}
