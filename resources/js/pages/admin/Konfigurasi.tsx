import { useState } from "react"
import {
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  Pencil,
  X,
  XCircle,
} from "lucide-react"

const Toast = ({ msg, onClose }: { msg: string; onClose: () => void }) => (
  <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg z-50 text-sm animate-fade-in">
    <CheckCircle size={16} className="text-green-400" />
    {msg}
    <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
      ✕
    </button>
  </div>
)

const prodiList = [
  { id: 1, nama: "Teknik Informatika", kode: "TI", aktif: true },
  { id: 2, nama: "Teknik Industri", kode: "TIn", aktif: true },
  { id: 3, nama: "Teknik Sipil", kode: "TS", aktif: true },
  { id: 4, nama: "Arsitektur", kode: "AR", aktif: true },
  { id: 5, nama: "Sistem Informasi", kode: "SI", aktif: true },
]

const dokumenList = [
  { id: 1, nama: "Sertifikat PKKMB", wajib: true },
  { id: 2, nama: "PKKMB", wajib: true },
  { id: 3, nama: "Berita Acara Kerja Praktik", wajib: true },
  { id: 4, nama: "Bukti Sidang Skripsi", wajib: true },
  { id: 5, nama: "Sertifikat Bela Negara", wajib: true },
]

const SectionHeader = ({
  num,
  title,
  onSave,
}: {
  num: number
  title: string
  onSave?: () => void
}) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
    <div className="flex items-center gap-2.5">
      <div className="w-6 h-6 rounded-full bg-[#263F93] flex items-center justify-center text-white text-xs font-700">
        {num}
      </div>
      <h2 className="font-600 text-gray-800 text-sm">{title}</h2>
    </div>
    {onSave && (
      <button
        onClick={onSave}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 text-white transition-colors"
        style={{ background: "#263F93" }}
      >
        <Save size={12} /> Simpan
      </button>
    )}
  </div>
)

export default function Konfigurasi() {
  const [ipkMin, setIpkMin] = useState(3.0)
  const [showIpkWarning, setShowIpkWarning] = useState(false)
  const [periodeAktif, setPeriodeAktif] = useState(true)
  const [tglBuka, setTglBuka] = useState("2026-09-01")
  const [tglTutup, setTglTutup] = useState("2026-09-15")
  const [prodis, setProdis] = useState(prodiList)
  const [dokumens, setDokumens] = useState(dokumenList)
  const [toast, setToast] = useState("")
  const [institusi, setInstitusi] = useState({
    nama: "Institut Teknologi Garut",
    alamat: "Jl. Mayor Syamsu No. 1, Garut, Jawa Barat",
  })
  const [newProdi, setNewProdi] = useState({ nama: "", kode: "" })
  const [showAddProdi, setShowAddProdi] = useState(false)

  // Nilai Mutu state
  const [nilaiMutu, setNilaiMutu] = useState([
    { id: 1, min: 80, max: 100, huruf: "A", poin: 4.0, lulus: true },
    { id: 2, min: 75, max: 79, huruf: "AB", poin: 3.5, lulus: true },
    { id: 3, min: 70, max: 74, huruf: "B", poin: 3.0, lulus: true },
    { id: 4, min: 65, max: 69, huruf: "BC", poin: 2.5, lulus: true },
    { id: 5, min: 60, max: 64, huruf: "C", poin: 2.0, lulus: true },
    { id: 6, min: 55, max: 59, huruf: "D", poin: 1.0, lulus: false },
    { id: 7, min: 0, max: 54, huruf: "E", poin: 0.0, lulus: false },
  ])
  const [editingNilai, setEditingNilai] = useState<number | null>(null)
  const [editRow, setEditRow] = useState<{
    min: number
    max: number
    huruf: string
    poin: number
    lulus: boolean
  } | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const handleIPKSave = () => {
    setShowIpkWarning(false)
    showToast("Threshold IPK berhasil diperbarui")
  }

  const periodeHistory = [
    { sem: "Genap 2024/2025", buka: "1 Sep 2025", tutup: "15 Sep 2025" },
    { sem: "Ganjil 2024/2025", buka: "1 Mar 2025", tutup: "15 Mar 2025" },
    { sem: "Genap 2023/2024", buka: "2 Sep 2024", tutup: "16 Sep 2024" },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">
          Konfigurasi Sistem
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Pengaturan global yang mempengaruhi seluruh logika bisnis SIMKIP-ITG
        </p>
      </div>

      {/* Section 1: IPK Threshold */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={1}
          title="Ambang Batas IPK (Threshold)"
          onSave={() => setShowIpkWarning(true)}
        />
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                IPK Minimum
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setIpkMin((v) =>
                      Math.max(0, Math.round((v - 0.1) * 10) / 10),
                    )
                  }
                  className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-700 text-lg border-r border-gray-200"
                >
                  −
                </button>
                <input
                  type="number"
                  value={ipkMin}
                  step={0.1}
                  min={0}
                  max={4}
                  onChange={(e) => setIpkMin(parseFloat(e.target.value))}
                  className="w-20 px-3 py-2.5 text-center text-lg font-display font-700 text-gray-900 focus:outline-none"
                />
                <button
                  onClick={() =>
                    setIpkMin((v) =>
                      Math.min(4, Math.round((v + 0.1) * 10) / 10),
                    )
                  }
                  className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-700 text-lg border-l border-gray-200"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 flex-1">
              Mahasiswa dengan IPK di bawah nilai ini akan ditandai untuk
              evaluasi dan penerbitan SP.
            </p>
          </div>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle
              size={15}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700">
              Perubahan threshold akan mempengaruhi evaluasi seluruh {167}{" "}
              mahasiswa aktif secara real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Periode Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={2}
          title="Periode Input Nilai (Kalender Akademik)"
          onSave={() => showToast("Periode berhasil disimpan")}
        />
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {periodeAktif ? (
              <span className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Periode Aktif: 1 Sep – 15 Sep 2026
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs font-500">
                Tidak ada periode aktif
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-600">Status:</span>
              <button
                onClick={() => setPeriodeAktif(!periodeAktif)}
                className="flex items-center gap-1.5 text-sm font-500"
              >
                {periodeAktif ? (
                  <>
                    <ToggleRight size={24} className="text-green-500" /> Aktif
                  </>
                ) : (
                  <>
                    <ToggleLeft size={24} className="text-gray-400" /> Nonaktif
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Tanggal Buka
              </label>
              <input
                type="date"
                value={tglBuka}
                onChange={(e) => setTglBuka(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Tanggal Tutup
              </label>
              <input
                type="date"
                value={tglTutup}
                onChange={(e) => setTglTutup(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            </div>
          </div>

          {/* History */}
          <div>
            <p className="text-xs font-600 text-gray-500 uppercase tracking-wide mb-2">
              Riwayat Periode
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Semester", "Tanggal Buka", "Tanggal Tutup"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 text-gray-400 font-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periodeHistory.map((p) => (
                    <tr key={p.sem} className="border-b border-gray-50">
                      <td className="py-2 px-3 text-gray-600">{p.sem}</td>
                      <td className="py-2 px-3 text-gray-500">{p.buka}</td>
                      <td className="py-2 px-3 text-gray-500">{p.tutup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Master Prodi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader num={3} title="Master Data Program Studi" />
        <div className="p-5 space-y-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Nama Prodi", "Kode", "Status", "Aksi"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 text-xs font-600 text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {prodis.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 font-500 text-gray-800">{p.nama}</td>
                  <td className="py-2.5 font-mono text-gray-500">{p.kode}</td>
                  <td className="py-2.5">
                    <button
                      onClick={() =>
                        setProdis((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, aktif: !x.aktif } : x,
                          ),
                        )
                      }
                    >
                      {p.aktif ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <ToggleRight size={16} /> Aktif
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <ToggleLeft size={16} /> Nonaktif
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-[#263F93] hover:underline">
                        Edit
                      </button>
                      <button className="text-xs text-red-500 hover:underline">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showAddProdi && (
            <div className="flex gap-2 mt-3">
              <input
                value={newProdi.nama}
                onChange={(e) =>
                  setNewProdi((f) => ({ ...f, nama: e.target.value }))
                }
                placeholder="Nama Prodi"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
              <input
                value={newProdi.kode}
                onChange={(e) =>
                  setNewProdi((f) => ({ ...f, kode: e.target.value }))
                }
                placeholder="Kode"
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
              <button
                onClick={() => {
                  setProdis((p) => [
                    ...p,
                    {
                      id: Date.now(),
                      nama: newProdi.nama,
                      kode: newProdi.kode,
                      aktif: true,
                    },
                  ])
                  setShowAddProdi(false)
                  setNewProdi({ nama: "", kode: "" })
                }}
                className="px-3 py-2 rounded-lg text-sm font-500 text-white"
                style={{ background: "#059669" }}
              >
                Simpan
              </button>
            </div>
          )}

          <button
            onClick={() => setShowAddProdi(true)}
            className="flex items-center gap-2 text-sm text-[#263F93] hover:underline mt-2"
          >
            <Plus size={14} /> Tambah Prodi
          </button>
        </div>
      </div>

      {/* Section 4: Dokumen Kewajiban */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={4}
          title="Jenis Dokumen Kewajiban"
          onSave={() => showToast("Konfigurasi dokumen disimpan")}
        />
        <div className="p-5 space-y-2">
          {dokumens.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <button
                onClick={() =>
                  setDokumens((prev) =>
                    prev.map((x) =>
                      x.id === d.id ? { ...x, wajib: !x.wajib } : x,
                    ),
                  )
                }
              >
                {d.wajib ? (
                  <ToggleRight size={22} className="text-[#263F93]" />
                ) : (
                  <ToggleLeft size={22} className="text-gray-400" />
                )}
              </button>
              <span className="flex-1 text-sm text-gray-700">{d.nama}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-500 ${
                  d.wajib
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {d.wajib ? "Wajib" : "Tidak Wajib"}
              </span>
              <button className="p-1.5 text-gray-300 hover:text-red-400">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button className="flex items-center gap-2 text-sm text-[#263F93] hover:underline mt-2">
            <Plus size={14} /> Tambah Jenis Dokumen
          </button>
        </div>
      </div>

      {/* Section 5: Informasi Institusi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={5}
          title="Informasi Institusi"
          onSave={() => showToast("Informasi institusi diperbarui")}
        />
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">
              Nama Institusi
            </label>
            <input
              value={institusi.nama}
              onChange={(e) =>
                setInstitusi((f) => ({ ...f, nama: e.target.value }))
              }
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">
              Alamat
            </label>
            <input
              value={institusi.alamat}
              onChange={(e) =>
                setInstitusi((f) => ({ ...f, alamat: e.target.value }))
              }
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">
              Logo Institusi
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 cursor-pointer transition-colors">
              <p className="text-sm text-gray-400">
                Klik untuk upload logo (PNG/SVG, maks. 2MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Konfigurasi Nilai Mutu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={6}
          title="Konfigurasi Nilai Mutu"
          onSave={() => showToast("Konfigurasi nilai mutu berhasil disimpan")}
        />
        <div className="p-5 space-y-4">
          {/* Deskripsi */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <GraduationCap
              size={15}
              className="text-[#263F93] flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-[#263F93]">
              Tabel konversi nilai angka ke nilai huruf dan poin mutu.
              Konfigurasi ini digunakan sebagai acuan penilaian mata kuliah
              mahasiswa KIP-K.
            </p>
          </div>

          {/* Tabel Nilai Mutu */}
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "Rentang Nilai",
                    "Nilai Huruf",
                    "Poin Mutu",
                    "Status",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {nilaiMutu.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      editingNilai === row.id
                        ? "bg-blue-50/40"
                        : "hover:bg-gray-50/60"
                    }`}
                  >
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={editRow.min}
                            onChange={(e) =>
                              setEditRow((r) =>
                                r ? { ...r, min: Number(e.target.value) } : r,
                              )
                            }
                            className="w-14 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                          />
                          <span className="text-gray-400">–</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={editRow.max}
                            onChange={(e) =>
                              setEditRow((r) =>
                                r ? { ...r, max: Number(e.target.value) } : r,
                              )
                            }
                            className="w-14 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                          />
                        </div>
                      ) : (
                        <span className="font-mono font-600 text-gray-700">
                          {row.min} – {row.max}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <input
                          type="text"
                          value={editRow.huruf}
                          onChange={(e) =>
                            setEditRow((r) =>
                              r
                                ? { ...r, huruf: e.target.value.toUpperCase() }
                                : r,
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center font-700 focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                        />
                      ) : (
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-sm font-700 ${
                            row.lulus
                              ? row.huruf === "A"
                                ? "bg-[#263F93] text-white"
                                : row.huruf === "AB"
                                  ? "bg-blue-100 text-blue-800"
                                  : row.huruf === "B"
                                    ? "bg-indigo-100 text-indigo-700"
                                    : row.huruf === "BC"
                                      ? "bg-teal-100 text-teal-700"
                                      : "bg-green-100 text-green-700"
                              : row.huruf === "D"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.huruf}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <input
                          type="number"
                          step={0.5}
                          min={0}
                          max={4}
                          value={editRow.poin}
                          onChange={(e) =>
                            setEditRow((r) =>
                              r
                                ? { ...r, poin: parseFloat(e.target.value) }
                                : r,
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                        />
                      ) : (
                        <span className="font-mono text-gray-700">
                          {row.poin.toFixed(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <button
                          onClick={() =>
                            setEditRow((r) =>
                              r ? { ...r, lulus: !r.lulus } : r,
                            )
                          }
                          className="flex items-center gap-1 text-xs font-500"
                        >
                          {editRow.lulus ? (
                            <>
                              <ToggleRight
                                size={18}
                                className="text-green-500"
                              />{" "}
                              <span className="text-green-700">Lulus</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={18} className="text-gray-400" />{" "}
                              <span className="text-gray-500">Tidak Lulus</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-600 ${
                            row.lulus
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.lulus ? (
                            <span className="flex items-center gap-1.5 justify-center"><CheckCircle size={14} /> Lulus</span>
                          ) : (
                            <span className="flex items-center gap-1.5 justify-center"><XCircle size={14} /> Tidak Lulus</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              if (editRow) {
                                setNilaiMutu((prev) =>
                                  prev.map((r) =>
                                    r.id === row.id ? { ...r, ...editRow } : r,
                                  ),
                                )
                                showToast(
                                  `Nilai ${editRow.huruf} berhasil diperbarui`,
                                )
                              }
                              setEditingNilai(null)
                              setEditRow(null)
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-500 text-white bg-[#263F93] hover:opacity-90"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => {
                              setEditingNilai(null)
                              setEditRow(null)
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingNilai(row.id)
                            setEditRow({
                              min: row.min,
                              max: row.max,
                              huruf: row.huruf,
                              poin: row.poin,
                              lulus: row.lulus,
                            })
                          }}
                          className="flex items-center gap-1 text-xs text-[#263F93] hover:underline font-500"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Preview Keterangan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Nilai Tertinggi",
                value: "A (80–100)",
                color: "bg-[#263F93] text-white",
              },
              {
                label: "Batas Lulus",
                value: "C (60–64)",
                color: "bg-green-100 text-green-800",
              },
              {
                label: "Batas Tidak Lulus",
                value: "D (55–59)",
                color: "bg-orange-100 text-orange-800",
              },
              {
                label: "Nilai Terendah",
                value: "E (0–54)",
                color: "bg-red-100 text-red-800",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
              >
                <div className="text-xs text-gray-400 mb-1">{card.label}</div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-700 ${card.color}`}
                >
                  {card.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle
              size={14}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700">
              Perubahan konfigurasi nilai mutu akan mempengaruhi perhitungan IPK
              dan status kelulusan mata kuliah seluruh mahasiswa aktif secara
              real-time.
            </p>
          </div>
        </div>
      </div>

      {/* IPK Warning Modal */}
      {showIpkWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 text-center mb-2">
              Konfirmasi Perubahan
            </h3>
            <p className="text-gray-500 text-sm text-center mb-5">
              Mengubah threshold IPK ke <strong>{ipkMin}</strong> akan
              mempengaruhi evaluasi seluruh mahasiswa aktif. Lanjutkan?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowIpkWarning(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={handleIPKSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white"
                style={{ background: "#D97706" }}
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </div>
  )
}
