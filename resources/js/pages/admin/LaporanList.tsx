import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Download, FileText, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { getLaporanList, type LaporanFilter } from "@/services/laporanService"
import { getKonfigurasiAll } from "@/services/konfigurasiService"
import { getMahasiswaFilterOptions } from "@/services/mahasiswaService"
import type { Laporan } from "@/types"
import { getCurrentTahunAjaran,  TahunAjaranFilter, parseTahunAjaran } from "@/components/ui/TahunAjaranFilter"

const statusStyle: Record<string, { badge: string; icon: React.ReactNode; label: string }> = {
  Disetujui: {
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle size={13} className="text-green-500" />,
    label: "Disetujui",
  },
  Diajukan: {
    badge: "bg-yellow-100 text-yellow-700",
    icon: <Clock size={13} className="text-yellow-500" />,
    label: "Menunggu Approval",
  },
  Draft: {
    badge: "bg-gray-100 text-gray-600",
    icon: <FileText size={13} className="text-gray-400" />,
    label: "Draf",
  },
  Dikembalikan: {
    badge: "bg-red-100 text-red-700",
    icon: <AlertCircle size={13} className="text-red-500" />,
    label: "Dikembalikan",
  },
  Ditolak: {
    badge: "bg-red-100 text-red-700",
    icon: <AlertCircle size={13} className="text-red-500" />,
    label: "Ditolak",
  },
}

const cakupanBadgeStyle: Record<string, string> = {
  semua: "bg-blue-50 text-blue-700 border border-blue-200",
  angkatan: "bg-purple-50 text-purple-700 border border-purple-200",
  prodi: "bg-orange-50 text-orange-700 border border-orange-200",
  keduanya: "bg-teal-50 text-teal-700 border border-teal-200",
}

const CAKUPAN_MAP: Record<string, string> = {
  "Semua": "",
  "Seluruh Mahasiswa": "semua",
  "Per Angkatan": "angkatan",
  "Per Program Studi": "prodi",
  "Per Angkatan + Prodi": "keduanya",
}

function cakupanLabel(c: string | undefined): string {
  const map: Record<string, string> = {
    semua: "Seluruh Mahasiswa",
    angkatan: "Per Angkatan",
    prodi: "Per Program Studi",
    keduanya: "Per Angkatan + Prodi",
  }
  return map[c ?? ""] ?? c ?? "—"
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

export default function LaporanList() {
  const [search, setSearch] = useState("")
  const [tahunFilter, setTahunFilter] = useState(getCurrentTahunAjaran())
  const [semesterFilter, setSemesterFilter] = useState("")
  const [selectedProdi, setSelectedProdi] = useState('Semua');
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua');
  const [prodiOptions, setProdiOptions] = useState<string[]>(['Semua']);
  const [angkatanOptions, setAngkatanOptions] = useState<string[]>(['Semua']);
  const [statusFilter, setStatusFilter] = useState("")
  const [cakupanFilter, setCakupanFilter] = useState("")
  const [page, setPage] = useState(1)

  const [tahunList, setTahunList] = useState<string[]>([""])

  // Load available tahun akademik from konfigurasi
  useEffect(() => {
    let active = true;
    getKonfigurasiAll()
      .then((res) => {
        if (!active) return;
        const unique = Array.from(new Set(res.data.periode_history.map((p: any) => p.tahun_akademik)));
        setTahunList(["", ...unique]);
      })
      .catch(() => { /* fallback ke default */ });
    return () => { active = false };
  useEffect(() => {
    getMahasiswaFilterOptions().then(res => {
      setProdiOptions(['Semua', ...(res.prodis || []).map((p) => p.nama)]);
      setAngkatanOptions(['Semua', ...(res.angkatans || [])]);
    }).catch(() => {});
  }, []);
  }, []);

  const [laporan, setLaporan] = useState<Laporan[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = () => {
    let active = true
    setLoading(true)
    setError("")

    const filter: LaporanFilter = { page, limit: 10 }
    if (search) filter.search = search
    if (statusFilter) {
      const statusMap: Record<string, string> = {
        "Draf": "Draft",
        "Menunggu Approval": "Diajukan",
        "Disetujui": "Disetujui",
        "Dikembalikan": "Dikembalikan",
        "Ditolak": "Ditolak",
      }
      filter.status = statusMap[statusFilter] ?? statusFilter
    }
    if (tahunFilter) {
      const parsed = parseTahunAjaran(tahunFilter);
      if (parsed) {
        filter.tahunAkademik = parsed.tahun;
        if (!semesterFilter) {
          filter.semester = parsed.semester;
        }
      }
    }
    if (semesterFilter) filter.semester = semesterFilter
    if (selectedProdi !== 'Semua') filter.prodi = selectedProdi;
    if (selectedAngkatan !== 'Semua') filter.angkatan = selectedAngkatan;
    if (cakupanFilter) filter.cakupan = CAKUPAN_MAP[cakupanFilter] ?? cakupanFilter

    getLaporanList(filter)
      .then((res) => {
        if (!active) return
        setLaporan(res.data || [])
        setTotal(res.total || 0)
        setTotalPages(Math.max(1, res.totalPages || 1))
      })
      .catch((err) => {
        if (!active) return
        setError(err?.message ?? "Gagal memuat data laporan")
      })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
    }, 350)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
    }, 150)
    return () => clearTimeout(timer)
  }, [tahunFilter, semesterFilter, statusFilter, cakupanFilter, selectedProdi, selectedAngkatan])

  useEffect(() => {
    return loadData()
  }, [search, tahunFilter, semesterFilter, statusFilter, cakupanFilter, selectedProdi, selectedAngkatan, page])

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleTahunChange = (val: string) => {
    setTahunFilter(val)
    setPage(1)
  }

  const handleSemesterChange = (val: string) => {
    setSemesterFilter(val)
    setPage(1)
  }

  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
    setPage(1)
  }

  const handleCakupanChange = (val: string) => {
    setCakupanFilter(val)
    setPage(1)
  }

  return (
    <div className="space-y-5" style={{ background: "#F8FAFC", minHeight: "100%" }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">
            Laporan Evaluasi Semester
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Kelola laporan semester untuk persetujuan Warek III
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TahunAjaranFilter value={tahunFilter} onChange={handleTahunChange} />
          <Link
            to="/admin/laporan/baru"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white"
            style={{ background: "#263F93" }}
          >
            <Plus size={15} /> Susun Laporan Baru
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Cari judul / nomor surat..."
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 text-gray-600 min-w-48"
        />


        <select
          value={semesterFilter}
          onChange={(e) => handleSemesterChange(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {["", "1", "2", "3", "4", "5", "6", "7", "8"].map((o) => (
            <option key={o} value={o}>{o === "" ? "Semua Semester" : "Semester " + o}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {["", "Draf", "Menunggu Approval", "Disetujui", "Dikembalikan"].map((o) => (
            <option key={o} value={o}>{o === "" ? "Semua Status" : o}</option>
          ))}
        </select>

        <select
          value={cakupanFilter}
          onChange={(e) => handleCakupanChange(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {Object.entries(CAKUPAN_MAP).map(([label, value]) => (
            <option key={label} value={value === "" ? "" : label}>{label}</option>
          ))}
        </select>
        
        <select
          value={selectedProdi}
          onChange={(e) => { setSelectedProdi(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {prodiOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        
        <select
          value={selectedAngkatan}
          onChange={(e) => { setSelectedAngkatan(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none text-gray-600"
        >
          {angkatanOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
          <Loader2 className="animate-spin mr-2" /> Memuat laporan...
        </div>
      )}

      {/* Report cards */}
      {!loading && (
        <div className="space-y-4">
          {laporan.map((l) => {
            const ss = statusStyle[l.status] ?? statusStyle.Draft
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
                      <span className={`px-2 py-0.5 rounded text-xs font-500 ${ss.badge}`}>
                        {ss.label}
                      </span>
                    </div>

                    {l.nomorSurat && (
                      <p className="text-xs text-gray-400 font-mono mb-1">
                        {l.nomorSurat}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mb-1">
                      Tahun Ajaran: {l.tahunAkademik ?? "—"} {l.semester ?? ""}
                    </p>

                    {l.cakupan && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-500 ${cakupanBadgeStyle[l.cakupan] ?? "bg-gray-100 text-gray-600"}`}>
                          Cakupan:{" "}
                          {l.angkatan || l.prodi
                            ? `${cakupanLabel(l.cakupan)} — ${[l.angkatan, l.prodi].filter(Boolean).join(" ")}`
                            : cakupanLabel(l.cakupan)}
                        </span>
                        {l.tujuanWarek && (
                          <span className="px-2 py-0.5 rounded text-xs font-500 bg-[#263F93] text-white">Warek III</span>
                        )}
                        {l.tujuanProdi && (
                          <span className="px-2 py-0.5 rounded text-xs font-500 bg-purple-600 text-white">Prodi</span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>Dibuat: {formatDate(l.tanggalLaporan)}</span>
                      {l.submittedAt && (
                        <>
                          <span>·</span>
                          <span>Diajukan: {formatDate(l.submittedAt)}</span>
                        </>
                      )}
                      {l.catatanWarek && (
                        <>
                          <span>·</span>
                          <span className="text-amber-600">
                            Catatan Warek: {l.catatanWarek.slice(0, 80)}
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
                      <a
                        href={`/api/laporan/${l.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white transition-colors"
                        style={{ background: "#059669" }}
                      >
                        <Download size={12} /> PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {laporan.length === 0 && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] py-12 text-center">
              <FileText size={28} className="mx-auto text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">
                {total === 0 ? "Belum ada laporan. Klik 'Susun Laporan Baru' untuk membuat." : "Tidak ada laporan yang sesuai filter"}
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="px-4 py-3 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs text-gray-500">
          <span>
            Halaman {page} dari {totalPages} ({total} laporan)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-[#E2E8F0] hover:bg-gray-50 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-[#E2E8F0] hover:bg-gray-50 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
