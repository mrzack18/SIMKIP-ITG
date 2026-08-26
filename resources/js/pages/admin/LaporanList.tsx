import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Download, FileText, Clock, CheckCircle } from "lucide-react"

type Cakupan = "Seluruh Mahasiswa" | "Per Angkatan" | "Per Program Studi" | "Per Angkatan + Prodi"

const laporan = [
  {
    id: 1,
    judul: "Laporan Evaluasi Semester Genap 2025/2026",
    nomorSurat: "045/BKKH-ITG/VIII/2026",
    tahun: "2025/2026",
    semester: "Genap",
    status: "Disetujui",
    tglDibuat: "10 Agu 2026",
    tglModified: "17 Agu 2026",
    approvedBy: "Warek 3",
    approvedDate: "20 Agu 2026",
    cakupan: "Seluruh Mahasiswa" as Cakupan,
    cakupanDetail: null as string | null,
    tujuan: ["Warek III", "Prodi"],
  },
  {
    id: 2,
    judul: "Laporan Evaluasi Semester Ganjil 2025/2026 — Angkatan 2022",
    nomorSurat: "031/BKKH-ITG/II/2026",
    tahun: "2025/2026",
    semester: "Ganjil",
    status: "Menunggu Approval",
    tglDibuat: "5 Feb 2026",
    tglModified: "8 Feb 2026",
    approvedBy: null as string | null,
    approvedDate: null as string | null,
    cakupan: "Per Angkatan" as Cakupan,
    cakupanDetail: "Angkatan 2022",
    tujuan: ["Warek III"],
  },
  {
    id: 3,
    judul: "Laporan Evaluasi Semester Genap 2024/2025 — Teknik Informatika",
    nomorSurat: "029/BKKH-ITG/VIII/2025",
    tahun: "2024/2025",
    semester: "Genap",
    status: "Disetujui",
    tglDibuat: "12 Agu 2025",
    tglModified: "18 Agu 2025",
    approvedBy: "Warek 3",
    approvedDate: "22 Agu 2025",
    cakupan: "Per Program Studi" as Cakupan,
    cakupanDetail: "Teknik Informatika",
    tujuan: ["Prodi"],
  },
  {
    id: 4,
    judul:
      "Laporan Evaluasi Semester Ganjil 2024/2025 — Angkatan 2023 Sistem Informasi",
    nomorSurat: "",
    tahun: "2024/2025",
    semester: "Ganjil",
    status: "Draf",
    tglDibuat: "1 Agu 2026",
    tglModified: "1 Agu 2026",
    approvedBy: null as string | null,
    approvedDate: null as string | null,
    cakupan: "Per Angkatan + Prodi" as Cakupan,
    cakupanDetail: "Angkatan 2023 — Sistem Informasi",
    tujuan: ["Warek III", "Prodi"],
  },
]

const statusStyle: Record<string, { badge: string; icon: React.ReactNode }> = {
  Disetujui: {
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle size={13} className="text-green-500" />,
  },
  "Menunggu Approval": {
    badge: "bg-yellow-100 text-yellow-700",
    icon: <Clock size={13} className="text-yellow-500" />,
  },
  Draf: {
    badge: "bg-gray-100 text-gray-600",
    icon: <FileText size={13} className="text-gray-400" />,
  },
}

const cakupanBadgeStyle: Record<Cakupan, string> = {
  "Seluruh Mahasiswa": "bg-blue-50 text-blue-700 border border-blue-200",
  "Per Angkatan": "bg-purple-50 text-purple-700 border border-purple-200",
  "Per Program Studi": "bg-orange-50 text-orange-700 border border-orange-200",
  "Per Angkatan + Prodi": "bg-teal-50 text-teal-700 border border-teal-200",
}

export default function LaporanList() {
  const [tahunFilter, setTahunFilter] = useState("Semua")
  const [semesterFilter, setSemesterFilter] = useState("Semua")
  const [statusFilter, setStatusFilter] = useState("Semua")
  const [cakupanFilter, setCakupanFilter] = useState("Semua")

  const filtered = laporan.filter(
    (l) =>
      (tahunFilter === "Semua" || l.tahun === tahunFilter) &&
      (semesterFilter === "Semua" || l.semester === semesterFilter) &&
      (statusFilter === "Semua" || l.status === statusFilter) &&
      (cakupanFilter === "Semua" || l.cakupan === cakupanFilter),
  )

  return (
    <div
      className="space-y-5"
      style={{ background: "#F8FAFC", minHeight: "100%" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">
            Laporan Evaluasi Semester
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Kelola laporan semester untuk persetujuan Warek III
          </p>
        </div>
        <Link
          to="/admin/laporan/baru"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white"
          style={{ background: "#263F93" }}
        >
          <Plus size={15} /> Susun Laporan Baru
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={tahunFilter}
          onChange={(e) => setTahunFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {["Semua", "2025/2026", "2024/2025", "2023/2024"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {["Semua", "Ganjil", "Genap"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {["Semua", "Draf", "Menunggu Approval", "Disetujui"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>

        {/* Cakupan filter */}
        <select
          value={cakupanFilter}
          onChange={(e) => setCakupanFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {[
            "Semua",
            "Seluruh Mahasiswa",
            "Per Angkatan",
            "Per Program Studi",
            "Per Angkatan + Prodi",
          ].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* Report cards */}
      <div className="space-y-4">
        {filtered.map((l) => {
          const ss = statusStyle[l.status]
          return (
            <div
              key={l.id}
              className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {ss.icon}
                    <h3 className="font-600 text-gray-800 text-sm truncate">
                      {l.judul}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-500 ${ss.badge}`}
                    >
                      {l.status}
                    </span>
                  </div>

                  {l.nomorSurat && (
                    <p className="text-xs text-gray-400 font-mono mb-1">
                      {l.nomorSurat}
                    </p>
                  )}

                  {/* Cakupan info */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-500 ${cakupanBadgeStyle[l.cakupan]}`}
                    >
                      Cakupan:{" "}
                      {l.cakupanDetail
                        ? `${l.cakupan} — ${l.cakupanDetail}`
                        : l.cakupan}
                    </span>
                    {l.tujuan.includes("Warek III") && (
                      <span className="px-2 py-0.5 rounded text-xs font-500 bg-[#263F93] text-white">Warek III</span>
                    )}
                    {l.tujuan.includes("Prodi") && (
                      <span className="px-2 py-0.5 rounded text-xs font-500 bg-purple-600 text-white">Prodi</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>Dibuat: {l.tglDibuat}</span>
                    <span>·</span>
                    <span>Diperbarui: {l.tglModified}</span>
                    {l.approvedBy && l.approvedDate && (
                      <>
                        <span>·</span>
                        <span className="text-green-600">
                          Disetujui oleh: {l.approvedBy} · {l.approvedDate}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/admin/laporan/${l.id}`}
                    className="px-3 py-1.5 text-xs border border-[#263F93]/30 rounded-lg text-[#263F93] hover:bg-blue-50 transition-colors"
                  >
                    Lihat Detail
                  </Link>
                  {l.status === "Disetujui" && (
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white transition-colors"
                      style={{ background: "#059669" }}
                    >
                      <Download size={12} /> PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] py-12 text-center">
            <FileText size={28} className="mx-auto text-gray-200 mb-2" />
            <p className="text-gray-400 text-sm">
              Tidak ada laporan yang sesuai filter
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
