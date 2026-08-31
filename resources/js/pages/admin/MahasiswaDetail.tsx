import React, { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import {
  ChevronLeft,
  AlertTriangle,
  XCircle,
  UserMinus,
  UserX,
  UserCheck,
  Loader2,
} from "lucide-react"
import {
  getMahasiswaById,
  getMahasiswaIpk,
  getMahasiswaPrestasi,
  getMahasiswaOrganisasi,
  getMahasiswaPelatihan,
  getMahasiswaSpHistory,
  getMahasiswaDokumen,
  getMahasiswaBebasTanggungan,
  updateMahasiswaStatus,
  cabutKipkMahasiswa,
  type SemesterDetailBE,
} from "@/services/mahasiswaService"
import { getKonfigurasiAll, type SignatureConfig } from "@/services/konfigurasiService"
import type { Mahasiswa, MahasiswaBebasTanggunganResponse } from "@/types"
import { TabInfoPribadi } from "@/components/modules/admin/mahasiswa/TabInfoPribadi"
import { TabRiwayatAkademik } from "@/components/modules/admin/mahasiswa/TabRiwayatAkademik"
import { BackendNotReady } from "@/components/modules/admin/mahasiswa/Shared"
import { TabPrestasi } from "@/components/modules/admin/mahasiswa/TabPrestasi"
import { TabOrganisasi } from "@/components/modules/admin/mahasiswa/TabOrganisasi"
import { TabPelatihan } from "@/components/modules/admin/mahasiswa/TabPelatihan"
import { TabDokumen } from "@/components/modules/admin/mahasiswa/TabDokumen"
import { TabSP } from "@/components/modules/admin/mahasiswa/TabSP"
import { TabSuratPenyelesaian } from "@/components/modules/admin/mahasiswa/TabSuratPenyelesaian"
import { TahunAjaranFilter, getCurrentTahunAjaran } from "@/components/ui/TahunAjaranFilter"








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
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran())
  const [showSpModal, setShowSpModal] = useState(false)
  const [selectedSpLevel, setSelectedSpLevel] = useState<"SP1" | "SP2" | "SP3">("SP1")
  const [nonaktifModal, setNonaktifModal] = useState(false)
  const [cabutModal, setCabutModal] = useState(false)
  const [cabutConfirmNim, setCabutConfirmNim] = useState("")

  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false)
  const [statusError, setStatusError] = useState("")
  const [alasanStatus, setAlasanStatus] = useState("Cuti Akademik")
  const [catatanStatus, setCatatanStatus] = useState("")

  const [isSubmittingCabut, setIsSubmittingCabut] = useState(false)
  const [cabutError, setCabutError] = useState("")
  const [alasanCabut, setAlasanCabut] = useState("IPK di Bawah Standar")
  const [catatanCabut, setCatatanCabut] = useState("")

  const handleUpdateStatus = async () => {
    if (!mhs) return
    setIsSubmittingStatus(true)
    setStatusError("")
    try {
      const newStatus = mhs.status === "Aktif" ? "Nonaktif" : "Aktif"
      await updateMahasiswaStatus(mhsId, {
        status: newStatus,
        alasan_status: newStatus === "Nonaktif" ? alasanStatus : undefined,
        catatan_status: newStatus === "Nonaktif" ? catatanStatus : undefined,
      })
      const updated = await getMahasiswaById(mhsId)
      setMhs(updated)
      setNonaktifModal(false)
      setAlasanStatus("Cuti Akademik")
      setCatatanStatus("")
    } catch (err: any) {
      if (err.response?.status === 422) {
        setStatusError(err.response.data.message || "Validasi gagal. Periksa kembali input Anda.")
      } else {
        setStatusError(err.message || "Gagal mengubah status mahasiswa.")
      }
    } finally {
      setIsSubmittingStatus(false)
    }
  }

  const handleCabutKipk = async () => {
    if (!mhs) return
    setIsSubmittingCabut(true)
    setCabutError("")
    try {
      await cabutKipkMahasiswa(mhsId, {
        alasan_cabut: alasanCabut,
        catatan_cabut: catatanCabut,
        konfirmasi_nim: cabutConfirmNim
      })
      const updated = await getMahasiswaById(mhsId)
      setMhs(updated)
      setCabutModal(false)
      setAlasanCabut("IPK di Bawah Standar")
      setCatatanCabut("")
      setCabutConfirmNim("")
    } catch (err: any) {
      if (err.response?.status === 422) {
        setCabutError(err.response.data.message || "Validasi gagal. Pastikan NIM konfirmasi benar.")
      } else {
        setCabutError(err.message || "Gagal mencabut KIP-K mahasiswa.")
      }
    } finally {
      setIsSubmittingCabut(false)
    }
  }

  const [mhs, setMhs] = useState<Mahasiswa | null>(null)
  const [ipkData, setIpkData] = useState<SemesterDetailBE[]>([])
  const [prestasiData, setPrestasiData] = useState<any[]>([])
  const [organisasiData, setOrganisasiData] = useState<any[]>([])
  const [pelatihanData, setPelatihanData] = useState<any[]>([])
  const [spData, setSpData] = useState<any[]>([])
  const [dokumenData, setDokumenData] = useState<any[]>([])
  const [btData, setBtData] = useState<MahasiswaBebasTanggunganResponse | null>(null)
  const [signature, setSignature] = useState<SignatureConfig | null>(null)
  const [periodeAktif, setPeriodeAktif] = useState<string>("")
  
  const [loadingMain, setLoadingMain] = useState(true)
  const [loadingIpk, setLoadingIpk] = useState(true)
  const [loadingPrestasi, setLoadingPrestasi] = useState(true)
  const [loadingOrganisasi, setLoadingOrganisasi] = useState(true)
  const [loadingPelatihan, setLoadingPelatihan] = useState(true)
  const [loadingSp, setLoadingSp] = useState(true)
  const [loadingDokumen, setLoadingDokumen] = useState(true)
  const [loadingBt, setLoadingBt] = useState(true)
  
  const [error, setError] = useState("")
  const [ipkError, setIpkError] = useState<any>(null)
  const [prestasiError, setPrestasiError] = useState<any>(null)
  const [organisasiError, setOrganisasiError] = useState<any>(null)
  const [pelatihanError, setPelatihanError] = useState<any>(null)
  const [spError, setSpError] = useState<any>(null)
  const [dokumenError, setDokumenError] = useState<any>(null)
  const [btError, setBtError] = useState<any>(null)

  const mhsId = Number(id)

  useEffect(() => {
    let active = true
    setLoadingMain(true)
    getMahasiswaById(mhsId, tahunAjaran)
      .then((data) => { if (active) setMhs(data) })
      .catch((err) => { if (active) setError(err?.message ?? "Gagal memuat data mahasiswa") })
      .finally(() => { if (active) setLoadingMain(false) })
    return () => { active = false }
  }, [mhsId, tahunAjaran])

  // Load signature config from BE
  useEffect(() => {
    getKonfigurasiAll()
      .then((res) => {
        if (res?.data?.signature) setSignature(res.data.signature);
        const periode = res?.data?.periode_history?.find((p: any) => p.is_aktif);
        if (periode) setPeriodeAktif(`${periode.semester} ${periode.tahun_akademik}`);
      })
      .catch(() => { /* fallback */ });
  }, [])

  useEffect(() => {
    let active = true
    setLoadingIpk(true)
    setIpkError(null)
    getMahasiswaIpk(mhsId, tahunAjaran)
      .then((data) => { if (active) setIpkData(data) })
      .catch((err) => { 
        if (active) {
          setIpkError(err)
          setIpkData([])
        }
      })
      .finally(() => { if (active) setLoadingIpk(false) })
    return () => { active = false }
  }, [mhsId, tahunAjaran])

  useEffect(() => {
    let active = true
    setLoadingPrestasi(true)
    setPrestasiError(null)
    getMahasiswaPrestasi(mhsId, tahunAjaran)
      .then((data) => { if (active) setPrestasiData(data) })
      .catch((err) => { 
        if (active) {
          setPrestasiError(err)
          setPrestasiData([])
        }
      })
      .finally(() => { if (active) setLoadingPrestasi(false) })
    return () => { active = false }
  }, [mhsId, tahunAjaran])

  useEffect(() => {
    let active = true
    setLoadingOrganisasi(true)
    setOrganisasiError(null)
    getMahasiswaOrganisasi(mhsId, tahunAjaran)
      .then((data) => { if (active) setOrganisasiData(data) })
      .catch((err) => {
        if (active) {
          setOrganisasiError(err)
          setOrganisasiData([])
        }
      })
      .finally(() => { if (active) setLoadingOrganisasi(false) })
    return () => { active = false }
  }, [mhsId, tahunAjaran])

  useEffect(() => {
    let active = true
    setLoadingPelatihan(true)
    setPelatihanError(null)
    getMahasiswaPelatihan(mhsId, tahunAjaran)
      .then((data) => { if (active) setPelatihanData(data) })
      .catch((err) => {
        if (active) {
          setPelatihanError(err)
          setPelatihanData([])
        }
      })
      .finally(() => { if (active) setLoadingPelatihan(false) })
    return () => { active = false }
  }, [mhsId, tahunAjaran])

  useEffect(() => {
    let active = true
    setLoadingSp(true)
    setSpError(null)
    getMahasiswaSpHistory(mhsId, tahunAjaran)
      .then((data) => { if (active) setSpData(data) })
      .catch((err) => {
        if (active) {
          setSpError(err)
          setSpData([])
        }
      })
      .finally(() => { if (active) setLoadingSp(false) })
    return () => { active = false }
  }, [mhsId, tahunAjaran])

  useEffect(() => {
    let active = true
    setLoadingDokumen(true)
    setDokumenError(null)
    getMahasiswaDokumen(mhsId, tahunAjaran)
      .then((data) => { if (active) setDokumenData(data) })
      .catch((err) => {
        if (active) {
          setDokumenError(err)
          setDokumenData([])
        }
      })
      .finally(() => { if (active) setLoadingDokumen(false) })
    return () => { active = false }
  }, [mhsId, tahunAjaran])

  useEffect(() => {
    let active = true
    setLoadingBt(true)
    setBtError(null)
    getMahasiswaBebasTanggungan(mhsId, tahunAjaran)
      .then((res) => { if (active) setBtData(res) })
      .catch((err) => {
        if (active) {
          setBtError(err)
          setBtData(null)
        }
      })
      .finally(() => { if (active) setLoadingBt(false) })
    return () => { active = false }
  }, [mhsId, tahunAjaran])

  if (loadingMain) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data mahasiswa...
      </div>
    )
  }

  if (error || !mhs) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/mahasiswa"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={16} /> Manajemen Mahasiswa
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error || "Mahasiswa tidak ditemukan."}</p>
        </div>
      </div>
    )
  }

  const hasSP2 = mhs.sp === "SP2" || mhs.sp === "SP3"
  const spLevel = (mhs.sp === "SP1" || mhs.sp === "SP2" || mhs.sp === "SP3") ? mhs.sp : null
  const semesterNum = mhs.semester ?? 1
  const totalSem = 8
  const progressPct = Math.round((semesterNum / totalSem) * 100)

  return (
    <div className="space-y-5 pb-10">
      {/* Breadcrumb and Filter */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/admin/mahasiswa"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={16} /> Manajemen Mahasiswa
        </Link>
        <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />
      </div>

      {/* Status Banner */}
      {mhs.status === "Nonaktif" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <UserMinus size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-800">Mahasiswa ini berstatus NONAKTIF</h3>
            <p className="text-sm text-amber-700 mt-1">
              Alasan: <strong>{mhs.alasanNonaktif || "—"}</strong><br />
              Tanggal: <strong>{mhs.tanggalNonaktif || "—"}</strong>
            </p>
          </div>
        </div>
      )}

      {mhs.status === "Dicabut" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <UserX size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-800">KIP-K mahasiswa ini telah DICABUT</h3>
            <p className="text-sm text-red-700 mt-1">
              Dicabut pada Semester {mhs.semesterDicabut || "—"} oleh {mhs.dicabutOleh || "—"}<br />
              Alasan: <strong>{mhs.alasanDicabut || "—"}</strong><br />
              Tanggal: <strong>{mhs.tanggalDicabut || "—"}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-[#263F93] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {mhs.nama.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-bold text-xl text-gray-900">{mhs.nama}</h2>
              {spLevel === "SP1" && (
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
                    : mhs.status === "Dicabut"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {mhs.status}
              </span>
            </div>
          </div>

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
              {Math.max(0, totalSem - semesterNum)} semester tersisa
            </p>
          </div>

          <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
            {(mhs.status === "Aktif" || mhs.status === "Nonaktif") && (
              <button
                onClick={() => setNonaktifModal(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  mhs.status === "Aktif"
                    ? "border-amber-400 text-amber-600 hover:bg-amber-50"
                    : "border-green-400 text-green-600 hover:bg-green-50"
                }`}
              >
                {mhs.status === "Aktif" ? (
                  <><UserMinus size={14} /> Nonaktifkan</>
                ) : (
                  <><UserCheck size={14} /> Aktifkan</>
                )}
              </button>
            )}
            {(mhs.status === "Aktif" || mhs.status === "Nonaktif") && (
              <button
                onClick={() => setCabutModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-red-400 text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <UserX size={14} /> Cabut KIP-K
              </button>
            )}
            {mhs.status === "Aktif" && (
              <button
                onClick={() => {
                  const used = spData ? spData.map((sp: any) => sp.level) : []
                  let defaultLevel = "SP1"
                  if (used.includes("SP1") && used.includes("SP2")) defaultLevel = "SP3"
                  else if (used.includes("SP1")) defaultLevel = "SP2"
                  setSelectedSpLevel(defaultLevel as "SP1"|"SP2"|"SP3")
                  setShowSpModal(true)
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-red-400 text-red-600 hover:bg-red-50 transition-colors"
              >
                <AlertTriangle size={14} /> Terbitkan SP
              </button>
            )}
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
        {activeTab === 0 && <TabRiwayatAkademik data={ipkData} loading={loadingIpk} error={ipkError} />}
        {activeTab === 1 && <TabPrestasi data={prestasiData} loading={loadingPrestasi} error={prestasiError} />}
        {activeTab === 2 && <TabOrganisasi data={organisasiData} loading={loadingOrganisasi} error={organisasiError} />}
        {activeTab === 3 && <TabPelatihan data={pelatihanData} loading={loadingPelatihan} error={pelatihanError} />}
        {activeTab === 4 && <TabDokumen data={dokumenData} loading={loadingDokumen} error={dokumenError} />}
        {activeTab === 5 && <TabSP data={spData} loading={loadingSp} error={spError} />}
        {activeTab === 6 && <TabInfoPribadi data={mhs} tahunAjaran={tahunAjaran} />}
        {activeTab === 7 && <TabSuratPenyelesaian data={btData} loading={loadingBt} error={btError} signature={signature} />}
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

            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600">
                Anda akan menerbitkan SP untuk{" "}
                <span className="font-semibold text-gray-800">{mhs.nama}</span>.
                Pilih level SP:
              </p>
              <div className="space-y-2">
                {(["SP1", "SP2", "SP3"] as const).map((level) => {
                  const used = spData ? spData.some((sp: any) => sp.level === level) : false;
                  return (
                    <label
                      key={level}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        used ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" :
                        selectedSpLevel === level
                          ? "border-red-400 bg-red-50 cursor-pointer"
                          : "border-[#E2E8F0] hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        name="spLevel"
                        value={level}
                        checked={selectedSpLevel === level}
                        onChange={() => !used && setSelectedSpLevel(level)}
                        disabled={used}
                        className="accent-red-600"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {level} {used && <span className="ml-1 text-xs text-gray-500 font-normal">(Sudah diberikan)</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

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

      {/* Nonaktif/Aktif confirmation modal */}
      {nonaktifModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${mhs.status === "Aktif" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
              {mhs.status === "Aktif" ? <UserMinus size={20} /> : <UserCheck size={20} />}
            </div>
            <h3 className="font-bold text-gray-900 text-lg text-center mb-2">
              {mhs.status === "Aktif" ? "Nonaktifkan Mahasiswa" : "Aktifkan Mahasiswa"}
            </h3>
            <p className="text-gray-500 text-sm text-center mb-4">
              Mahasiswa: <strong>{mhs.nama}</strong>
            </p>
            {mhs.status === "Aktif" && (
              <div className="mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Alasan Penonaktifan</label>
                  <select 
                    value={alasanStatus}
                    onChange={(e) => setAlasanStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    <option>Cuti Akademik</option>
                    <option>Masalah Administrasi</option>
                    <option>Permintaan Sendiri</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Tambahan (Opsional)</label>
                  <textarea 
                    value={catatanStatus}
                    onChange={(e) => setCatatanStatus(e.target.value)}
                    rows={2} 
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
                  ></textarea>
                </div>
              </div>
            )}
            {statusError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertTriangle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{statusError}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setNonaktifModal(false); setStatusError(""); }}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                disabled={isSubmittingStatus}
              >
                Batal
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center"
                style={{ background: mhs.status === "Aktif" ? "#F59E0B" : "#10B981" }}
                onClick={handleUpdateStatus}
                disabled={isSubmittingStatus}
              >
                {isSubmittingStatus ? <Loader2 size={16} className="animate-spin" /> : (mhs.status === "Aktif" ? "Nonaktifkan" : "Aktifkan")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabut KIP-K confirmation modal */}
      {cabutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg text-center mb-2">Cabut KIP-K Mahasiswa</h3>
            <p className="text-gray-500 text-sm text-center mb-2">
              Mahasiswa: <strong>{mhs.nama}</strong>
            </p>
            <p className="text-gray-600 text-xs text-center font-medium mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
              Semester saat pencabutan: {periodeAktif || "—"}
            </p>
            <div className="mb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alasan Pencabutan</label>
                <select 
                  value={alasanCabut}
                  onChange={(e) => setAlasanCabut(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  <option>IPK di Bawah Standar</option>
                  <option>Cuti Tanpa Izin</option>
                  <option>Pelanggaran Berat</option>
                  <option>SP3 Otomatis</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Tambahan (Opsional)</label>
                <textarea 
                  value={catatanCabut}
                  onChange={(e) => setCatatanCabut(e.target.value)}
                  rows={2} 
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ketik NIM untuk konfirmasi pencabutan:
                </label>
                <input
                  value={cabutConfirmNim}
                  onChange={(e) => setCabutConfirmNim(e.target.value)}
                  placeholder={mhs.nim}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />
              </div>
              {cabutError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{cabutError}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setCabutModal(false); setCabutConfirmNim(""); setCabutError(""); }}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                disabled={isSubmittingCabut}
              >
                Batal
              </button>
              <button
                disabled={cabutConfirmNim !== mhs.nim || isSubmittingCabut}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                style={{ background: "#DC2626" }}
                onClick={handleCabutKipk}
              >
                {isSubmittingCabut ? <Loader2 size={16} className="animate-spin" /> : "Cabut Permanen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
