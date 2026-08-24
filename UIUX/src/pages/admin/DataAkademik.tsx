import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  BarChart2,
  CalendarDays,
  Award,
  Users,
  BookOpen,
  X,
  ExternalLink,
  FileImage,
} from "lucide-react"
import { mahasiswaList } from "@/data/mockData"

// ─── Inline override data ────────────────────────────────────────────────────
const ipkData: Record<number, {
  ipk: number
  delta: number
  sem: number
  mkBelumLulus: number
  sp: string | null
}> = {
  1: { ipk: 3.35, delta: 0.1, sem: 7, mkBelumLulus: 0, sp: null },
  2: { ipk: 2.85, delta: -0.22, sem: 7, mkBelumLulus: 1, sp: "SP2" },
  3: { ipk: 3.12, delta: 0.05, sem: 5, mkBelumLulus: 0, sp: "SP1" },
  4: { ipk: 3.45, delta: 0.15, sem: 7, mkBelumLulus: 0, sp: null },
  5: { ipk: 3.78, delta: 0.2, sem: 3, mkBelumLulus: 0, sp: null },
  6: { ipk: 3.92, delta: 0.08, sem: 5, mkBelumLulus: 0, sp: null },
  7: { ipk: 2.95, delta: -0.1, sem: 9, mkBelumLulus: 2, sp: "SP2" },
  8: { ipk: 2.7, delta: -0.3, sem: 5, mkBelumLulus: 2, sp: "SP3" },
  9: { ipk: 2.88, delta: -0.05, sem: 7, mkBelumLulus: 1, sp: "SP1" },
  10: { ipk: 3.2, delta: 0.12, sem: 7, mkBelumLulus: 0, sp: null },
  11: { ipk: 3.55, delta: 0.18, sem: 5, mkBelumLulus: 0, sp: null },
  12: { ipk: 3.4, delta: 0.02, sem: 7, mkBelumLulus: 0, sp: null },
}

// ─── Mock Non-Akademik data ──────────────────────────────────────────────────
const prestasiData = [
  {
    id: 1,
    nim: "2206001",
    nama: "Ahmad Rifaldi",
    prodi: "Teknik Informatika",
    angkatan: 2022,
    kipk: "KIP-K Reguler",
    namaPrestasi: "Juara 2 Hackathon Nasional",
    tingkat: "Nasional",
    pencapaian: "Juara 2",
    penyelenggara: "Kemendikbud",
    tanggal: "5 – 7 Jan 2026",
    tempat: "Bandung",
    deskripsi:
      "Kompetisi hackathon tingkat nasional yang diselenggarakan oleh Kemendikbud, diikuti 200 tim dari seluruh Indonesia.",
    link: "https://kemendikbud.go.id",
    status: "Disetujui",
    catatan: "",
  },
  {
    id: 2,
    nim: "2307001",
    nama: "Fitriyani Hasanah",
    prodi: "Sistem Informasi",
    angkatan: 2023,
    kipk: "KIP-K Reguler",
    namaPrestasi: "Best Paper IEEE Conference",
    tingkat: "Internasional",
    pencapaian: "Best Paper",
    penyelenggara: "IEEE Indonesia",
    tanggal: "12 – 14 Mar 2026",
    tempat: "Jakarta",
    deskripsi:
      "Konferensi internasional IEEE yang membahas perkembangan teknologi informasi di Asia Tenggara.",
    link: "https://ieee.org",
    status: "Disetujui",
    catatan: "",
  },
  {
    id: 3,
    nim: "2303001",
    nama: "Budi Santoso",
    prodi: "Teknik Industri",
    angkatan: 2023,
    kipk: "KIP-K Reguler",
    namaPrestasi: "Olimpiade Sains Jabar",
    tingkat: "Wilayah",
    pencapaian: "Juara 3",
    penyelenggara: "Diknas Jabar",
    tanggal: "20 Feb 2026",
    tempat: "Bandung",
    deskripsi:
      "Olimpiade sains tingkat wilayah Jawa Barat yang diselenggarakan oleh Dinas Pendidikan Jawa Barat.",
    link: "https://diknas.jabarprov.go.id",
    status: "Menunggu",
    catatan: "",
  },
  {
    id: 4,
    nim: "2306001",
    nama: "Krisna Bayu",
    prodi: "Teknik Informatika",
    angkatan: 2023,
    kipk: "KIP-K Reguler",
    namaPrestasi: "Juara 1 App Developer Championship",
    tingkat: "Nasional",
    pencapaian: "Juara 1",
    penyelenggara: "Microsoft Indonesia",
    tanggal: "10 Apr 2026",
    tempat: "Jakarta",
    deskripsi:
      "Kompetisi pengembangan aplikasi yang diadakan Microsoft Indonesia, diikuti lebih dari 500 peserta.",
    link: "https://microsoft.com/id",
    status: "Disetujui",
    catatan: "",
  },
  {
    id: 5,
    nim: "2220001",
    nama: "Lena Pertiwi",
    prodi: "Arsitektur",
    angkatan: 2022,
    kipk: "KIP-K Aspirasi",
    namaPrestasi: "Best Design Award ARCH EXPO",
    tingkat: "Nasional",
    pencapaian: "Best Design",
    penyelenggara: "IAI Jabar",
    tanggal: "15 May 2026",
    tempat: "Bandung",
    deskripsi:
      "Pameran arsitektur nasional yang diselenggarakan oleh Ikatan Arsitek Indonesia wilayah Jawa Barat.",
    link: "https://iai.or.id",
    status: "Menunggu",
    catatan: "",
  },
]

const organisasiData = [
  {
    id: 1,
    nim: "2206001",
    nama: "Ahmad Rifaldi",
    prodi: "Teknik Informatika",
    angkatan: 2022,
    kipk: "KIP-K Reguler",
    organisasi: "Himpunan Mahasiswa Teknik Informatika (HMTI)",
    jabatan: "Ketua Umum",
    periodeMulai: "September 2024",
    periodeSelesai: "September 2026",
    periode: "Sep 2024 – Sep 2026",
    deskripsi:
      "Memimpin himpunan mahasiswa Teknik Informatika, mengoordinasikan program kerja, dan menjadi penghubung antara mahasiswa dengan pihak program studi.",
    status: "Disetujui",
    catatan: "",
  },
  {
    id: 2,
    nim: "2307001",
    nama: "Fitriyani Hasanah",
    prodi: "Sistem Informasi",
    angkatan: 2023,
    kipk: "KIP-K Reguler",
    organisasi: "Badan Eksekutif Mahasiswa (BEM) ITG",
    jabatan: "Wakil Sekretaris Jenderal",
    periodeMulai: "Januari 2025",
    periodeSelesai: "Januari 2027",
    periode: "Jan 2025 – Jan 2027",
    deskripsi:
      "Membantu Sekretaris Jenderal dalam mengelola administrasi, korespondensi, dan dokumentasi kegiatan BEM ITG.",
    status: "Disetujui",
    catatan: "",
  },
  {
    id: 3,
    nim: "2420001",
    nama: "Deni Kurniawan",
    prodi: "Arsitektur",
    angkatan: 2024,
    kipk: "KIP-K Aspirasi",
    organisasi: "Unit Kegiatan Mahasiswa Islam (UKMI)",
    jabatan: "Anggota Departemen Dakwah",
    periodeMulai: "Maret 2025",
    periodeSelesai: "Maret 2026",
    periode: "Mar 2025 – Mar 2026",
    deskripsi:
      "Berpartisipasi aktif dalam kegiatan dakwah dan kajian Islam yang diselenggarakan UKMI ITG.",
    status: "Menunggu",
    catatan: "",
  },
]

const pelatihanAkademikData = [
  {
    id: 1,
    nim: "2206001",
    nama: "Ahmad Rifaldi",
    prodi: "Teknik Informatika",
    angkatan: 2022,
    kipk: "KIP-K Reguler",
    namaPelatihan: "Workshop Machine Learning dengan TensorFlow",
    jenis: "Akademik",
    penyelenggara: "Google Developer Student Clubs ITG",
    tanggalMulai: "10 November 2025",
    tanggalSelesai: "12 November 2025",
    tanggal: "10–12 Nov 2025",
    tempat: "Aula Kampus ITG, Garut",
    deskripsi:
      "Pelatihan intensif pengenalan machine learning menggunakan Python dan TensorFlow, mencakup supervised learning, unsupervised learning, dan implementasi model prediktif.",
    status: "Disetujui",
  },
  {
    id: 2,
    nim: "2307001",
    nama: "Fitriyani Hasanah",
    prodi: "Sistem Informasi",
    angkatan: 2023,
    kipk: "KIP-K Reguler",
    namaPelatihan: "Seminar AI for Healthcare",
    jenis: "Akademik",
    penyelenggara: "IEEE Indonesia Section",
    tanggalMulai: "5 November 2025",
    tanggalSelesai: "5 November 2025",
    tanggal: "5 Nov 2025",
    tempat: "Hotel Savoy Homann, Bandung",
    deskripsi:
      "Seminar internasional yang membahas penerapan kecerdasan buatan dan machine learning di bidang layanan kesehatan, dihadiri oleh akademisi dan praktisi dari seluruh Indonesia.",
    status: "Disetujui",
  },
]

const pelatihanNonAkademikData = [
  {
    id: 3,
    nim: "2303001",
    nama: "Budi Santoso",
    prodi: "Teknik Industri",
    angkatan: 2023,
    kipk: "KIP-K Reguler",
    namaPelatihan: "Pelatihan Kepemimpinan Nasional Pemuda",
    jenis: "Non-Akademik",
    penyelenggara: "Kementerian Pemuda dan Olahraga RI",
    tanggalMulai: "5 Agustus 2025",
    tanggalSelesai: "9 Agustus 2025",
    tanggal: "5–9 Agu 2025",
    tempat: "Balai Pelatihan Nasional, Jakarta",
    deskripsi:
      "Program pengembangan kepemimpinan bagi mahasiswa penerima beasiswa KIP-K tingkat nasional. Materi meliputi kepemimpinan transformasional, manajemen konflik, dan pengembangan karakter.",
    status: "Disetujui",
  },
  {
    id: 4,
    nim: "2306001",
    nama: "Krisna Bayu",
    prodi: "Teknik Informatika",
    angkatan: 2023,
    kipk: "KIP-K Reguler",
    namaPelatihan: "Public Speaking & Presentation Skills Workshop",
    jenis: "Non-Akademik",
    penyelenggara: "Toastmasters International — Garut Club",
    tanggalMulai: "20 Juli 2025",
    tanggalSelesai: "20 Juli 2025",
    tanggal: "20 Jul 2025",
    tempat: "Ruang Serbaguna ITG, Garut",
    deskripsi:
      "Workshop satu hari yang berfokus pada teknik berbicara di depan umum, penyampaian presentasi yang efektif, dan pengelolaan rasa percaya diri.",
    status: "Menunggu",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const prodiOptions = [
  "Semua",
  "Teknik Informatika",
  "Sistem Informasi",
  "Teknik Industri",
  "Teknik Sipil",
  "Arsitektur",
]
const angkatanOptions = ["Semua", "2021", "2022", "2023", "2024"]
const kipkOptions = ["Semua", "KIP-K Reguler", "KIP-K Aspirasi"]

const spColors: Record<string, string> = {
  SP1: "bg-gray-100 text-gray-700",
  SP2: "bg-red-100 text-red-700",
  SP3: "bg-red-900 text-red-100",
}

const tingkatBadge = (t: string) => {
  if (t === "Internasional")
    return "bg-[#F5EDD4] text-[#D4A72C] border border-[#D4A72C]/30"
  if (t === "Nasional") return "bg-orange-100 text-orange-700"
  return "bg-purple-100 text-purple-700"
}

const statusBadge = (s: string) => {
  if (s === "Disetujui") return "bg-green-100 text-green-700"
  if (s === "Ditolak") return "bg-red-100 text-red-700"
  return "bg-yellow-100 text-yellow-700"
}

// ─── ProgresIPK cell ──────────────────────────────────────────────────────────
function ProgresIPK({ delta }: { delta: number }) {
  if (delta > 0.01)
    return (
      <span className="flex items-center gap-1">
        <TrendingUp size={13} className="text-green-500 flex-shrink-0" />
        <span className="text-xs text-gray-500">+{delta.toFixed(2)}</span>
      </span>
    )
  if (delta < -0.01)
    return (
      <span className="flex items-center gap-1">
        <TrendingDown size={13} className="text-red-500 flex-shrink-0" />
        <span className="text-xs text-gray-500">{delta.toFixed(2)}</span>
      </span>
    )
  return (
    <span className="flex items-center gap-1">
      <Minus size={13} className="text-gray-400 flex-shrink-0" />
      <span className="text-xs text-gray-500">0.00</span>
    </span>
  )
}

// TerbitkanSPDropdown dihapus — tombol ini hanya ada di halaman detail mahasiswa individual

// ─── Prestasi Detail Modal ───────────────────────────────────────────────────
function PrestasiModal({
  item,
  onClose,
}: {
  item: typeof prestasiData[0]
  onClose: () => void
}) {
  const [localStatus, setLocalStatus] = useState(item.status)
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-700 text-gray-800 text-base">
              {item.namaPrestasi}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.nama} &middot; {item.nim} &middot; {item.prodi}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-600 ${tingkatBadge(item.tingkat)}`}
            >
              {item.tingkat}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-600 ${statusBadge(localStatus)}`}
            >
              {localStatus}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-gray-400 block">Pencapaian</span>
              <span className="font-500 text-gray-800">{item.pencapaian}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Penyelenggara</span>
              <span className="font-500 text-gray-800">
                {item.penyelenggara}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Tanggal</span>
              <span className="font-500 text-gray-800">{item.tanggal}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Tempat</span>
              <span className="font-500 text-gray-800">{item.tempat}</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-1">Deskripsi</span>
            <p className="text-sm text-gray-700">{item.deskripsi}</p>
          </div>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#263F93] hover:underline"
            >
              <ExternalLink size={11} /> {item.link}
            </a>
          )}
          <div className="grid grid-cols-2 gap-3">
            {["Sertifikat", "Foto Kegiatan"].map((label) => (
              <div
                key={label}
                className="bg-gray-100 rounded-xl flex flex-col items-center justify-center py-8 gap-2"
              >
                <FileImage size={24} className="text-gray-300" />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
          {item.catatan && (
            <div className="bg-yellow-50 rounded-xl p-3 text-xs text-yellow-800">
              <span className="font-600">Catatan Admin: </span>
              {item.catatan}
            </div>
          )}
          {localStatus === "Menunggu" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setLocalStatus("Disetujui")}
                className="flex-1 py-2.5 rounded-xl text-sm font-500 text-white"
                style={{ background: "#059669" }}
              >
                Setujui
              </button>
              <button
                onClick={() => setLocalStatus("Ditolak")}
                className="flex-1 py-2.5 rounded-xl text-sm font-500 text-white"
                style={{ background: "#DC2626" }}
              >
                Tolak
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Organisasi Detail Modal ─────────────────────────────────────────────────
function OrganisasiModal({
  item,
  onClose,
}: {
  item: typeof organisasiData[0]
  onClose: () => void
}) {
  const [localStatus, setLocalStatus] = useState(item.status)
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-700 text-gray-800 text-base">
              {item.organisasi}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.nama} &middot; {item.nim} &middot; {item.prodi}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {/* Status */}
          <div className="flex gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-600 ${statusBadge(localStatus)}`}
            >
              {localStatus}
            </span>
          </div>
          {/* Data Mahasiswa */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
            <div className="font-600 text-gray-700 mb-1">Data Mahasiswa</div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-gray-400">Nama:</span>
              <span className="font-500">{item.nama}</span>
              <span className="text-gray-400">NIM:</span>
              <span className="font-500">{item.nim}</span>
              <span className="text-gray-400">Program Studi:</span>
              <span className="font-500">{item.prodi}</span>
              <span className="text-gray-400">Angkatan:</span>
              <span className="font-500">{item.angkatan}</span>
              <span className="text-gray-400">Kategori:</span>
              <span className="font-500">{item.kipk}</span>
            </div>
          </div>
          {/* Data Organisasi */}
          <div>
            <div className="font-600 text-gray-700 text-xs mb-2 uppercase tracking-wide">
              Detail Organisasi
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2">
                <span className="text-xs text-gray-400 block">
                  Nama Organisasi
                </span>
                <span className="font-500 text-gray-800">
                  {item.organisasi}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-400 block">Jabatan</span>
                <span className="font-500 text-gray-800">{item.jabatan}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">
                  Periode Mulai
                </span>
                <span className="font-500 text-gray-800">
                  {item.periodeMulai}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">
                  Periode Selesai
                </span>
                <span className="font-500 text-gray-800">
                  {item.periodeSelesai}
                </span>
              </div>
            </div>
            {item.deskripsi && (
              <div className="mt-3">
                <span className="text-xs text-gray-400 block mb-0.5">
                  Deskripsi Kegiatan
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            )}
          </div>
          {/* SK Kepengurusan */}
          <div>
            <span className="text-xs text-gray-400 block mb-1.5">
              SK Kepengurusan / Sertifikat
            </span>
            <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center py-6 gap-2">
              <FileImage size={24} className="text-gray-300" />
              <span className="text-xs text-gray-400">
                sk_kepengurusan_{item.nim}.pdf
              </span>
              <button className="flex items-center gap-1 text-xs text-[#263F93] font-500 hover:underline">
                <Download size={11} /> Unduh SK
              </button>
            </div>
          </div>
          {localStatus === "Menunggu" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setLocalStatus("Disetujui")}
                className="flex-1 py-2.5 rounded-xl text-sm font-500 text-white"
                style={{ background: "#059669" }}
              >
                Setujui
              </button>
              <button
                onClick={() => setLocalStatus("Ditolak")}
                className="flex-1 py-2.5 rounded-xl text-sm font-500 text-white"
                style={{ background: "#DC2626" }}
              >
                Tolak
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Pelatihan Detail Modal ───────────────────────────────────────────────────
type PelatihanItem = typeof pelatihanAkademikData[0]
function PelatihanModal({
  item,
  onClose,
}: {
  item: PelatihanItem
  onClose: () => void
}) {
  const [localStatus, setLocalStatus] = useState(item.status)
  const isAkademik = item.jenis === "Akademik"
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-700 text-gray-800 text-base">
              {item.namaPelatihan}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.nama} &middot; {item.nim} &middot; {item.prodi}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {/* Status & Jenis */}
          <div className="flex gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-600 ${statusBadge(localStatus)}`}
            >
              {localStatus}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-600 ${
                isAkademik
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {item.jenis}
            </span>
          </div>
          {/* Data Mahasiswa */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
            <div className="font-600 text-gray-700 mb-1">Data Mahasiswa</div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-gray-400">Nama:</span>
              <span className="font-500">{item.nama}</span>
              <span className="text-gray-400">NIM:</span>
              <span className="font-500">{item.nim}</span>
              <span className="text-gray-400">Program Studi:</span>
              <span className="font-500">{item.prodi}</span>
              <span className="text-gray-400">Angkatan:</span>
              <span className="font-500">{item.angkatan}</span>
              <span className="text-gray-400">Kategori:</span>
              <span className="font-500">{item.kipk}</span>
            </div>
          </div>
          {/* Data Pelatihan */}
          <div>
            <div className="font-600 text-gray-700 text-xs mb-2 uppercase tracking-wide">
              Detail Pelatihan
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2">
                <span className="text-xs text-gray-400 block">
                  Nama Pelatihan
                </span>
                <span className="font-500 text-gray-800">
                  {item.namaPelatihan}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-400 block">
                  Penyelenggara
                </span>
                <span className="font-500 text-gray-800">
                  {item.penyelenggara}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">
                  Tanggal Mulai
                </span>
                <span className="font-500 text-gray-800">
                  {item.tanggalMulai}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">
                  Tanggal Selesai
                </span>
                <span className="font-500 text-gray-800">
                  {item.tanggalSelesai}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-400 block">
                  Tempat Pelaksanaan
                </span>
                <span className="font-500 text-gray-800">{item.tempat}</span>
              </div>
            </div>
            {item.deskripsi && (
              <div className="mt-3">
                <span className="text-xs text-gray-400 block mb-0.5">
                  Deskripsi Kegiatan
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            )}
          </div>
          {/* Sertifikat */}
          <div>
            <span className="text-xs text-gray-400 block mb-1.5">
              Sertifikat Pelatihan
            </span>
            <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center py-6 gap-2">
              <FileImage size={24} className="text-gray-300" />
              <span className="text-xs text-gray-400">
                sertifikat_pelatihan_{item.nim}.pdf
              </span>
              <button className="flex items-center gap-1 text-xs text-[#263F93] font-500 hover:underline">
                <Download size={11} /> Unduh Sertifikat
              </button>
            </div>
          </div>
          {localStatus === "Menunggu" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setLocalStatus("Disetujui")}
                className="flex-1 py-2.5 rounded-xl text-sm font-500 text-white"
                style={{ background: "#059669" }}
              >
                Setujui
              </button>
              <button
                onClick={() => setLocalStatus("Ditolak")}
                className="flex-1 py-2.5 rounded-xl text-sm font-500 text-white"
                style={{ background: "#DC2626" }}
              >
                Tolak
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Shared filter select ─────────────────────────────────────────────────────
function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DataAkademik() {
  const [mainTab, setMainTab] = useState<"akademik" | "nonakademik">("akademik")
  const [nonTab, setNonTab] = useState<"prestasi" | "organisasi" | "pelatihan">(
    "prestasi",
  )
  const [pelatihanTab, setPelatihanTab] = useState<"akademik" | "nonakademik">(
    "akademik",
  )

  // Akademik filters
  const [search, setSearch] = useState("")
  const [prodiFilter, setProdiFilter] = useState("Semua")
  const [angkatanFilter, setAngkatanFilter] = useState("Semua")
  const [spFilter, setSpFilter] = useState("Semua")
  const [kipkFilter, setKipkFilter] = useState("Semua")
  const [ipkFilter, setIpkFilter] = useState("Semua")
  const [sortAkademik, setSortAkademik] = useState("IPK Tertinggi→Terendah")

  // Prestasi filters
  const [pSearch, setPSearch] = useState("")
  const [pProdi, setPProdi] = useState("Semua")
  const [pAngkatan, setPAngkatan] = useState("Semua")
  const [pKipk, setPKipk] = useState("Semua")
  const [pTingkat, setPTingkat] = useState("Semua")
  const [pStatus, setPStatus] = useState("Semua")
  const [pSort, setPSort] = useState("Tanggal Terbaru")

  // Organisasi filters
  const [oProdi, setOProdi] = useState("Semua")
  const [oAngkatan, setOAngkatan] = useState("Semua")
  const [oKipk, setOKipk] = useState("Semua")
  const [oStatus, setOStatus] = useState("Semua")

  // Pelatihan filters
  const [pelProdi, setPelProdi] = useState("Semua")
  const [pelAngkatan, setPelAngkatan] = useState("Semua")
  const [pelKipk, setPelKipk] = useState("Semua")
  const [pelStatus, setPelStatus] = useState("Semua")

  // Modal state
  const [prestasiModal, setPrestasiModal] =
    useState<typeof prestasiData[0] | null>(null)
  const [organisasiModal, setOrganisasiModal] =
    useState<typeof organisasiData[0] | null>(null)
  const [pelatihanModal, setPelatihanModal] = useState<PelatihanItem | null>(
    null,
  )

  // Build merged akademik rows
  const akademikRows = mahasiswaList.map((m) => {
    const d = ipkData[m.id]
    return {
      ...m,
      ipk: d?.ipk ?? m.ipk,
      delta: d?.delta ?? 0,
      sem: d?.sem ?? m.semester,
      mkBelumLulus: d?.mkBelumLulus ?? 0,
      sp: d?.sp ?? m.sp,
      kipkLabel: m.kategori === "Aspirasi" ? "KIP-K Aspirasi" : "KIP-K Reguler",
    }
  })

  const belowStd = akademikRows.filter((r) => r.ipk < 3.0).length
  const avgIPK = (
    akademikRows.reduce((s, r) => s + r.ipk, 0) / akademikRows.length
  ).toFixed(2)

  // Filter akademik
  const filteredAkademik = akademikRows
    .filter((r) => {
      const q = search.toLowerCase()
      const matchQ = r.nama.toLowerCase().includes(q) || r.nim.includes(q)
      const matchProdi = prodiFilter === "Semua" || r.prodi === prodiFilter
      const matchAngkatan =
        angkatanFilter === "Semua" || String(r.angkatan) === angkatanFilter
      const matchSP =
        spFilter === "Semua"
          ? true
          : spFilter === "Tanpa SP"
            ? !r.sp
            : r.sp === spFilter
      const matchKipk = kipkFilter === "Semua" || r.kipkLabel === kipkFilter
      const matchIPK =
        ipkFilter === "Semua"
          ? true
          : ipkFilter.includes("< 3.0")
            ? r.ipk < 3.0
            : r.ipk >= 3.0
      return (
        matchQ &&
        matchProdi &&
        matchAngkatan &&
        matchSP &&
        matchKipk &&
        matchIPK
      )
    })
    .sort((a, b) => {
      const s = sortAkademik
      if (s.includes("Tertinggi")) return b.ipk - a.ipk
      if (s.includes("Terendah")) return a.ipk - b.ipk
      if (s === "IPK Naik") return b.delta - a.delta
      if (s === "IPK Turun") return a.delta - b.delta
      if (s.includes("Nama")) return a.nama.localeCompare(b.nama)
      if (s.includes("Angkatan")) return b.angkatan - a.angkatan
      return 0
    })

  const resetAkademik = () => {
    setSearch("")
    setProdiFilter("Semua")
    setAngkatanFilter("Semua")
    setSpFilter("Semua")
    setKipkFilter("Semua")
    setIpkFilter("Semua")
    setSortAkademik("IPK Tertinggi→Terendah")
  }

  // Filter prestasi
  const filteredPrestasi = prestasiData.filter((p) => {
    const q = pSearch.toLowerCase()
    return (
      (p.nama.toLowerCase().includes(q) ||
        p.namaPrestasi.toLowerCase().includes(q)) &&
      (pProdi === "Semua" || p.prodi === pProdi) &&
      (pAngkatan === "Semua" || String(p.angkatan) === pAngkatan) &&
      (pKipk === "Semua" || p.kipk === pKipk) &&
      (pTingkat === "Semua" || p.tingkat === pTingkat) &&
      (pStatus === "Semua" || p.status === pStatus)
    )
  })

  const resetPrestasi = () => {
    setPSearch("")
    setPProdi("Semua")
    setPAngkatan("Semua")
    setPKipk("Semua")
    setPTingkat("Semua")
    setPStatus("Semua")
    setPSort("Tanggal Terbaru")
  }

  // Filter organisasi
  const filteredOrganisasi = organisasiData.filter(
    (o) =>
      (oProdi === "Semua" || o.prodi === oProdi) &&
      (oAngkatan === "Semua" || String(o.angkatan) === oAngkatan) &&
      (oKipk === "Semua" || o.kipk === oKipk) &&
      (oStatus === "Semua" || o.status === oStatus),
  )

  // Filter pelatihan
  const pelData: PelatihanItem[] =
    pelatihanTab === "akademik"
      ? pelatihanAkademikData
      : pelatihanNonAkademikData
  const filteredPelatihan = pelData.filter(
    (p) =>
      (pelProdi === "Semua" || p.prodi === pelProdi) &&
      (pelAngkatan === "Semua" || String(p.angkatan) === pelAngkatan) &&
      (pelKipk === "Semua" || p.kipk === pelKipk) &&
      (pelStatus === "Semua" || p.status === pelStatus),
  )

  const thCls =
    "text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap"
  const tdCls = "px-4 py-3"

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">
          Data Akademik &amp; Non-Akademik Mahasiswa
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Pantau IPK, nilai mata kuliah, prestasi, organisasi, dan pelatihan
        </p>
      </div>

      {/* Main tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["akademik", "nonakademik"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setMainTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-500 transition-all ${
              mainTab === key
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {key === "akademik" ? "Data Akademik" : "Data Non-Akademik"}
          </button>
        ))}
      </div>

      {/* ═══ TAB: DATA AKADEMIK ══════════════════════════════════════════════ */}
      {mainTab === "akademik" && (
        <div className="space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  IPK di Bawah Standar (3.0)
                </p>
                <p className="font-display font-700 text-2xl text-red-600 mt-0.5">
                  {belowStd}
                </p>
                <p className="text-xs text-gray-400">mahasiswa</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <BarChart2 size={18} className="text-[#263F93]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  Rata-rata IPK Keseluruhan
                </p>
                <p className="font-display font-700 text-2xl text-[#263F93] mt-0.5">
                  {avgIPK}
                </p>
                <p className="text-xs text-gray-400">dari skala 4.00</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <CalendarDays size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Periode Input Aktif</p>
                <p className="font-display font-700 text-sm text-gray-800 mt-0.5">
                  1 Sep – 15 Sep 2026
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-600 bg-green-100 text-green-700">
                  Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-48">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari NIM atau Nama..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
              </div>
              <FilterSelect
                value={prodiFilter}
                onChange={setProdiFilter}
                options={prodiOptions}
              />
              <FilterSelect
                value={angkatanFilter}
                onChange={setAngkatanFilter}
                options={["Semua", "2021", "2022", "2023", "2024"]}
              />
              <FilterSelect
                value={spFilter}
                onChange={setSpFilter}
                options={["Semua", "Tanpa SP", "SP1", "SP2", "SP3"]}
              />
              <FilterSelect
                value={kipkFilter}
                onChange={setKipkFilter}
                options={kipkOptions}
              />
              <FilterSelect
                value={ipkFilter}
                onChange={setIpkFilter}
                options={[
                  "Semua",
                  "Di Bawah Standar (< 3.0)",
                  "Di Atas Standar (≥ 3.0)",
                ]}
              />
              <FilterSelect
                value={sortAkademik}
                onChange={setSortAkademik}
                options={[
                  "IPK Tertinggi→Terendah",
                  "IPK Terendah→Tertinggi",
                  "IPK Naik",
                  "IPK Turun",
                  "Nama A–Z",
                  "Angkatan Terbaru",
                ]}
              />
              <button
                onClick={resetAkademik}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Data table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className={thCls}>No</th>
                    <th className={thCls}>NIM</th>
                    <th className={thCls}>Nama</th>
                    <th className={thCls}>Prodi</th>
                    <th className={thCls}>Angkatan</th>
                    <th className={thCls}>Semester</th>
                    <th className={thCls}>IPK Terakhir</th>
                    <th className={thCls}>Progres IPK</th>
                    <th className={thCls}>Status SP</th>
                    <th className={thCls}>MK Belum Lulus</th>
                    <th className={thCls}>Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAkademik.map((r, i) => {
                    const below = r.ipk < 3.0
                    return (
                      <tr
                        key={r.id}
                        className={`transition-colors hover:bg-gray-50/80 ${
                          below ? "bg-red-50/30" : ""
                        }`}
                      >
                        <td className={`${tdCls} text-gray-400 text-xs`}>
                          {i + 1}
                        </td>
                        <td
                          className={`${tdCls} font-mono text-xs text-gray-600`}
                        >
                          {r.nim}
                        </td>
                        <td
                          className={`${tdCls} font-500 text-gray-800 whitespace-nowrap`}
                        >
                          {r.nama}
                        </td>
                        <td className={`${tdCls} text-xs text-gray-500`}>
                          {r.prodi.replace("Teknik ", "T.")}
                        </td>
                        <td className={`${tdCls} text-gray-600`}>
                          {r.angkatan}
                        </td>
                        <td className={`${tdCls} text-gray-600`}>
                          Sem {r.sem}
                        </td>
                        <td className={tdCls}>
                          <span
                            className={`font-display font-700 text-sm px-2 py-0.5 rounded-lg ${
                              below
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {r.ipk.toFixed(2)}
                          </span>
                        </td>
                        <td className={tdCls}>
                          <ProgresIPK delta={r.delta} />
                        </td>
                        <td className={tdCls}>
                          <div className="flex gap-1 flex-wrap">
                            {r.sp ? (
                              <>
                                {(r.sp === "SP2" || r.sp === "SP3") && (
                                  <span className="px-1.5 py-0.5 rounded text-xs font-600 bg-gray-100 text-gray-700">
                                    SP1
                                  </span>
                                )}
                                {r.sp === "SP3" && (
                                  <span className="px-1.5 py-0.5 rounded text-xs font-600 bg-red-100 text-red-700">
                                    SP2
                                  </span>
                                )}
                                <span
                                  className={`px-1.5 py-0.5 rounded text-xs font-600 ${spColors[r.sp]}`}
                                >
                                  {r.sp}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>
                        </td>
                        <td className={tdCls}>
                          {r.mkBelumLulus > 0 ? (
                            <span className="px-2 py-0.5 rounded text-xs font-600 bg-red-100 text-red-700">
                              {r.mkBelumLulus} MK
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/mahasiswa/${r.id}`}
                              className="text-xs text-[#263F93] hover:underline font-500 whitespace-nowrap"
                            >
                              Lihat Detail
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Menampilkan {filteredAkademik.length} mahasiswa
              </span>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                <Download size={13} /> Export ke Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB: DATA NON-AKADEMIK ══════════════════════════════════════════ */}
      {mainTab === "nonakademik" && (
        <div className="space-y-4">
          {/* Sub-tabs */}
          <div className="flex gap-1 bg-gray-50 border border-gray-200 p-1 rounded-xl w-fit">
            {(["prestasi", "organisasi", "pelatihan"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setNonTab(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-500 transition-all ${
                  nonTab === key
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {key === "prestasi"
                  ? "Prestasi"
                  : key === "organisasi"
                    ? "Keaktifan Organisasi"
                    : "Pelatihan"}
              </button>
            ))}
          </div>

          {/* ── PRESTASI ─────────────────────────────────────────────────────── */}
          {nonTab === "prestasi" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative flex-1 min-w-48">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={pSearch}
                      onChange={(e) => setPSearch(e.target.value)}
                      placeholder="Cari nama mahasiswa atau prestasi..."
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                    />
                  </div>
                  <FilterSelect
                    value={pProdi}
                    onChange={setPProdi}
                    options={prodiOptions}
                  />
                  <FilterSelect
                    value={pAngkatan}
                    onChange={setPAngkatan}
                    options={angkatanOptions}
                  />
                  <FilterSelect
                    value={pKipk}
                    onChange={setPKipk}
                    options={kipkOptions}
                  />
                  <FilterSelect
                    value={pTingkat}
                    onChange={setPTingkat}
                    options={["Semua", "Internasional", "Nasional", "Wilayah"]}
                  />
                  <FilterSelect
                    value={pStatus}
                    onChange={setPStatus}
                    options={["Semua", "Disetujui", "Menunggu", "Ditolak"]}
                  />
                  <FilterSelect
                    value={pSort}
                    onChange={setPSort}
                    options={[
                      "Tanggal Terbaru",
                      "Tanggal Terlama",
                      "Tingkat (Int→Nas→Wil)",
                      "Nama A–Z",
                    ]}
                  />
                  <button
                    onClick={resetPrestasi}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-[#263F93]" />
                    <span className="font-600 text-gray-800 text-sm">
                      Rekap Prestasi Mahasiswa KIP-K
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    <Download size={12} /> Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {[
                          "No",
                          "NIM",
                          "Nama",
                          "Prodi",
                          "Angkatan",
                          "Nama Prestasi",
                          "Tingkat",
                          "Pencapaian",
                          "Penyelenggara",
                          "Tanggal",
                          "Status",
                          "Aksi",
                        ].map((h) => (
                          <th key={h} className={thCls}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredPrestasi.map((p, i) => (
                        <tr key={p.id} className="hover:bg-gray-50/60">
                          <td className={`${tdCls} text-gray-400 text-xs`}>
                            {i + 1}
                          </td>
                          <td
                            className={`${tdCls} font-mono text-xs text-gray-600`}
                          >
                            {p.nim}
                          </td>
                          <td
                            className={`${tdCls} font-500 text-gray-800 whitespace-nowrap`}
                          >
                            {p.nama}
                          </td>
                          <td className={`${tdCls} text-xs text-gray-500`}>
                            {p.prodi.replace("Teknik ", "T.")}
                          </td>
                          <td className={`${tdCls} text-gray-600`}>
                            {p.angkatan}
                          </td>
                          <td className={`${tdCls} text-gray-700`}>
                            {p.namaPrestasi}
                          </td>
                          <td className={tdCls}>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-600 ${tingkatBadge(p.tingkat)}`}
                            >
                              {p.tingkat}
                            </span>
                          </td>
                          <td className={`${tdCls} text-gray-600 text-xs`}>
                            {p.pencapaian}
                          </td>
                          <td className={`${tdCls} text-gray-500 text-xs`}>
                            {p.penyelenggara}
                          </td>
                          <td
                            className={`${tdCls} text-gray-500 text-xs whitespace-nowrap`}
                          >
                            {p.tanggal}
                          </td>
                          <td className={tdCls}>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-600 ${statusBadge(p.status)}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className={tdCls}>
                            <button
                              onClick={() => setPrestasiModal(p)}
                              className="text-xs text-[#263F93] hover:underline font-500 whitespace-nowrap"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── KEAKTIFAN ORGANISASI ─────────────────────────────────────────── */}
          {nonTab === "organisasi" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-2 items-center">
                  <FilterSelect
                    value={oProdi}
                    onChange={setOProdi}
                    options={prodiOptions}
                  />
                  <FilterSelect
                    value={oAngkatan}
                    onChange={setOAngkatan}
                    options={angkatanOptions}
                  />
                  <FilterSelect
                    value={oKipk}
                    onChange={setOKipk}
                    options={kipkOptions}
                  />
                  <FilterSelect
                    value={oStatus}
                    onChange={setOStatus}
                    options={["Semua", "Disetujui", "Menunggu", "Ditolak"]}
                  />
                  <FilterSelect
                    value="Tanggal Terbaru"
                    onChange={() => {}}
                    options={["Tanggal Terbaru", "Tanggal Terlama"]}
                  />
                  <button
                    onClick={() => {
                      setOProdi("Semua")
                      setOAngkatan("Semua")
                      setOKipk("Semua")
                      setOStatus("Semua")
                    }}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-[#263F93]" />
                    <span className="font-600 text-gray-800 text-sm">
                      Rekap Keaktifan Organisasi
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    <Download size={12} /> Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {[
                          "No",
                          "NIM",
                          "Nama",
                          "Prodi",
                          "Organisasi",
                          "Jabatan",
                          "Periode",
                          "Status",
                          "Aksi",
                        ].map((h) => (
                          <th key={h} className={thCls}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOrganisasi.map((o, i) => (
                        <tr key={o.id} className="hover:bg-gray-50/60">
                          <td className={`${tdCls} text-gray-400 text-xs`}>
                            {i + 1}
                          </td>
                          <td
                            className={`${tdCls} font-mono text-xs text-gray-600`}
                          >
                            {o.nim}
                          </td>
                          <td
                            className={`${tdCls} font-500 text-gray-800 whitespace-nowrap`}
                          >
                            {o.nama}
                          </td>
                          <td className={`${tdCls} text-xs text-gray-500`}>
                            {o.prodi.replace("Teknik ", "T.")}
                          </td>
                          <td className={`${tdCls} text-gray-700`}>
                            {o.organisasi}
                          </td>
                          <td className={`${tdCls} text-gray-500 text-xs`}>
                            {o.jabatan}
                          </td>
                          <td
                            className={`${tdCls} text-gray-500 text-xs whitespace-nowrap`}
                          >
                            {o.periode}
                          </td>
                          <td className={tdCls}>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-600 ${statusBadge(o.status)}`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className={tdCls}>
                            <button
                              onClick={() => setOrganisasiModal(o)}
                              className="text-xs text-[#263F93] hover:underline font-500"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PELATIHAN ────────────────────────────────────────────────────── */}
          {nonTab === "pelatihan" && (
            <div className="space-y-4">
              <div className="flex gap-1 bg-gray-50 border border-gray-200 p-1 rounded-xl w-fit">
                {(["akademik", "nonakademik"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setPelatihanTab(key)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-500 transition-all ${
                      pelatihanTab === key
                        ? "bg-white shadow-sm text-gray-800"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {key === "akademik" ? "Akademik" : "Non-Akademik"}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-2 items-center">
                  <FilterSelect
                    value={pelProdi}
                    onChange={setPelProdi}
                    options={prodiOptions}
                  />
                  <FilterSelect
                    value={pelAngkatan}
                    onChange={setPelAngkatan}
                    options={angkatanOptions}
                  />
                  <FilterSelect
                    value={pelKipk}
                    onChange={setPelKipk}
                    options={kipkOptions}
                  />
                  <FilterSelect
                    value={pelStatus}
                    onChange={setPelStatus}
                    options={["Semua", "Disetujui", "Menunggu", "Ditolak"]}
                  />
                  <FilterSelect
                    value="Tanggal Terbaru"
                    onChange={() => {}}
                    options={["Tanggal Terbaru", "Tanggal Terlama"]}
                  />
                  <button
                    onClick={() => {
                      setPelProdi("Semua")
                      setPelAngkatan("Semua")
                      setPelKipk("Semua")
                      setPelStatus("Semua")
                    }}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={15} className="text-[#263F93]" />
                    <span className="font-600 text-gray-800 text-sm">
                      Rekap Pelatihan{" "}
                      {pelatihanTab === "akademik"
                        ? "Akademik"
                        : "Non-Akademik"}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    <Download size={12} /> Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {[
                          "No",
                          "NIM",
                          "Nama",
                          "Prodi",
                          "Nama Pelatihan",
                          "Jenis",
                          "Penyelenggara",
                          "Tanggal",
                          "Status",
                          "Aksi",
                        ].map((h) => (
                          <th key={h} className={thCls}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredPelatihan.map((p, i) => (
                        <tr key={p.id} className="hover:bg-gray-50/60">
                          <td className={`${tdCls} text-gray-400 text-xs`}>
                            {i + 1}
                          </td>
                          <td
                            className={`${tdCls} font-mono text-xs text-gray-600`}
                          >
                            {p.nim}
                          </td>
                          <td
                            className={`${tdCls} font-500 text-gray-800 whitespace-nowrap`}
                          >
                            {p.nama}
                          </td>
                          <td className={`${tdCls} text-xs text-gray-500`}>
                            {p.prodi.replace("Teknik ", "T.")}
                          </td>
                          <td className={`${tdCls} text-gray-700`}>
                            {p.namaPelatihan}
                          </td>
                          <td className={tdCls}>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-500">
                              {p.jenis}
                            </span>
                          </td>
                          <td className={`${tdCls} text-gray-500 text-xs`}>
                            {p.penyelenggara}
                          </td>
                          <td className={`${tdCls} text-gray-500 text-xs`}>
                            {p.tanggal}
                          </td>
                          <td className={tdCls}>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-600 ${statusBadge(p.status)}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className={tdCls}>
                            <button
                              onClick={() => setPelatihanModal(p)}
                              className="text-xs text-[#263F93] hover:underline font-500"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}
      {prestasiModal && (
        <PrestasiModal
          item={prestasiModal}
          onClose={() => setPrestasiModal(null)}
        />
      )}
      {organisasiModal && (
        <OrganisasiModal
          item={organisasiModal}
          onClose={() => setOrganisasiModal(null)}
        />
      )}
      {pelatihanModal && (
        <PelatihanModal
          item={pelatihanModal}
          onClose={() => setPelatihanModal(null)}
        />
      )}
    </div>
  )
}
