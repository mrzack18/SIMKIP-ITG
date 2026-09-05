import React, { useState } from "react"
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart,
  Folder,
  Printer,
  Download,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import type { MahasiswaBebasTanggunganResponse } from "@/types"
import type { SignatureConfig } from "@/services/konfigurasiService"
import logoItg from "@/imports/logo_itg.jpg"

interface CollapsibleSection {
  title: string
  icon: React.ReactNode
  ok: boolean
  children: React.ReactNode
}

function Section({ title, icon, ok, children }: CollapsibleSection) {
  const [open, setOpen] = useState(true)
  return (
    <div className={`rounded-xl border overflow-hidden min-w-0 ${ok ? "border-green-200" : "border-yellow-300"}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-4 sm:px-5 py-3.5 sm:py-4 min-w-0 ${ok ? "bg-green-50" : "bg-yellow-50"}`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="text-gray-400 flex items-center justify-center flex-shrink-0">{icon}</div>
          <span className="font-600 text-gray-800 text-xs sm:text-sm break-words text-left">{title}</span>
          {ok ? (
            <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
          ) : (
            <span className="text-[11px] sm:text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-500 whitespace-nowrap shrink-0">Perlu Perhatian</span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && <div className="p-4 sm:p-5 bg-white min-w-0">{children}</div>}
    </div>
  )
}

function FormalSurat({
  student,
  signature,
}: {
  student: MahasiswaBebasTanggunganResponse["mahasiswa"] & {
    permohonan: NonNullable<MahasiswaBebasTanggunganResponse["permohonan"]>
  }
  signature?: SignatureConfig
}) {
  const sig = signature ?? {
    pengelola_nama: "Encep Jianul Hayat, S.T., M.T.",
    pengelola_nip: "197804202006041001",
    warek_nama: "Dr. Rina Kurniawati, S.E., M.Si.",
    warek_nip: "198203252008012002",
  }
  return (
    <div className="border-2 border-[#263F93] rounded-xl p-1 min-w-0">
      <div className="border border-[#263F93] rounded-lg p-3 sm:p-6 font-serif text-gray-800 text-xs leading-relaxed min-w-0">
        {/* Kop surat */}
        <div className="flex items-center gap-2.5 sm:gap-4 border-b-2 border-[#263F93] pb-3 sm:pb-4 mb-4 sm:mb-6 min-w-0">
          <img src={logoItg} alt="ITG" className="h-11 w-11 sm:h-16 sm:w-16 object-contain flex-shrink-0" />
          <div className="flex-1 text-center min-w-0">
            <p className="font-bold text-[10px] sm:text-xs leading-snug">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
            <p className="font-bold text-sm sm:text-base leading-snug">INSTITUT TEKNOLOGI GARUT</p>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-snug">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
            <p className="text-[10px] sm:text-xs text-gray-400 leading-snug break-words">Telp. (0262) 540895 · www.itg.ac.id · info@itg.ac.id</p>
          </div>
        </div>

        {/* Judul */}
        <div className="text-center mb-4 sm:mb-5 min-w-0">
          <p className="font-bold text-xs sm:text-sm underline uppercase tracking-wide leading-snug">
            Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K
          </p>
        </div>

        {/* Nomor surat */}
        <div className="mb-4 space-y-1 min-w-0">
          {[
            ["Nomor", student.permohonan.nomorSurat ?? "—"],
            ["Lampiran", "—"],
            ["Perihal", "Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[4.5rem_0.5rem_1fr] sm:grid-cols-[5rem_0.5rem_1fr] gap-x-2 text-xs min-w-0">
              <span className="text-gray-600">{k}</span>
              <span>:</span>
              <span className={`break-words min-w-0 ${k !== "Lampiran" ? "font-600" : ""}`}>{v}</span>
            </div>
          ))}
        </div>

        {/* Kepada */}
        <div className="mb-4 text-xs space-y-0.5 min-w-0">
          <p>Kepada Yth.</p>
          <p className="font-600 break-words">{student.nama}</p>
          <p className="break-words">NIM: {student.nim}</p>
          <p className="break-words">Program Studi {student.prodi}</p>
          <p className="italic mt-1">di Tempat</p>
        </div>

        <p className="mb-3 text-xs">Dengan hormat,</p>

        <p className="text-xs leading-relaxed mb-3 text-justify">
          Yang bertanda tangan di bawah ini, Pengelola KIP-K Institut Teknologi Garut, menerangkan dengan sesungguhnya
          bahwa:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 mb-3 space-y-1 min-w-0">
          {[
            ["Nama", student.nama],
            ["NIM", student.nim],
            ["Program Studi", student.prodi],
            ["Angkatan", String(student.angkatan)],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[4.5rem_0.5rem_1fr] sm:grid-cols-[5rem_0.5rem_1fr] gap-x-2 text-xs min-w-0">
              <span className="text-gray-500">{k}</span>
              <span>:</span>
              <span className="font-600 break-words min-w-0">{v}</span>
            </div>
          ))}
        </div>

        <p className="text-xs leading-relaxed mb-2 text-justify">
          Telah <strong>menyelesaikan seluruh kewajiban sebagai penerima Kartu Indonesia Pintar Kuliah (KIP-K)</strong>{" "}
          di Institut Teknologi Garut.
        </p>
        <p className="text-xs leading-relaxed text-justify mb-4 sm:mb-5">
          Demikian surat keterangan ini diterbitkan untuk dapat digunakan sebagaimana mestinya.
        </p>

        {/* TTD */}
        <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 sm:gap-6 text-[11px] sm:text-xs text-center min-w-0">
          <div className="min-w-0">
            <p className="break-words">Garut, {student.permohonan.tanggalAjukan}</p>
            <p className="mt-0.5">Pengelola KIP-K,</p>
            <div className="h-10 sm:h-14 my-1" />
            <p className="font-bold underline break-words">{sig.pengelola_nama}</p>
            <p className="text-gray-500 break-words">NIP. {sig.pengelola_nip}</p>
          </div>
          <div className="min-w-0">
            <p>Mengetahui,</p>
            <p className="mt-0.5">Wakil Rektor,</p>
            <div className="h-10 sm:h-14 my-1" />
            <p className="font-bold underline break-words">{sig.warek_nama}</p>
            <p className="text-gray-500 break-words">NIP. {sig.warek_nip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TabSuratPenyelesaian({
  data,
  loading,
  error,
  signature,
}: {
  data: MahasiswaBebasTanggunganResponse | null
  loading: boolean
  error: any
  signature?: SignatureConfig | null
}) {

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 text-[#263F93]" />
        <p className="text-sm sm:text-base">Memuat data Surat Penyelesaian...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-red-500">
        <AlertTriangle size={32} className="mb-3" />
        <p className="text-sm sm:text-base break-words">{error?.message || "Gagal memuat data Surat Penyelesaian."}</p>
      </div>
    )
  }

  const { permohonan, checklist, dokumen, rejection_history } = data
  const currentStatus = permohonan?.status || "belum_mengajukan"

  // Hitung status keseluruhan dari checklist backend
  const allConditionsMet = checklist.every((c) => c.terpenuhi)
  const allDocsApproved = dokumen.length > 0 && dokumen.every((d) => d.status === "Disetujui")
  const missingDocs = dokumen.filter((d) => d.status !== "Disetujui")

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {/* Status Header */}
      <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-2 sm:gap-3 bg-gray-50 border border-[#E2E8F0] rounded-xl p-3.5 sm:p-4 min-w-0">
        <div className="min-w-0">
          <h3 className="font-600 text-sm sm:text-base text-gray-800">Status Surat Penyelesaian</h3>
          {permohonan ? (
            <p className="text-xs text-gray-500 mt-0.5 break-words">Diajukan pada: {permohonan.tanggalAjukan}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-0.5">Mahasiswa belum melakukan pengajuan.</p>
          )}
        </div>
        <div className="shrink-0 self-start min-[420px]:self-auto">
          {currentStatus === "diterbitkan" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-600 bg-green-100 text-green-700 whitespace-nowrap">
              <CheckCircle size={16} className="flex-shrink-0" /> Diterbitkan
            </span>
          )}
          {currentStatus === "ditolak" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-600 bg-red-100 text-red-700 whitespace-nowrap">
              <XCircle size={16} className="flex-shrink-0" /> Ditolak
            </span>
          )}
          {currentStatus === "menunggu" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-600 bg-blue-100 text-blue-700 whitespace-nowrap">
              <Clock size={16} className="flex-shrink-0" /> Menunggu Review
            </span>
          )}
          {currentStatus === "belum_mengajukan" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-600 bg-gray-200 text-gray-600 whitespace-nowrap">
              <AlertTriangle size={16} className="flex-shrink-0" /> Belum Mengajukan
            </span>
          )}
        </div>
      </div>

      {/* Incomplete docs warning */}
      {missingDocs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 min-w-0">
          <div className="flex items-start gap-3 min-w-0">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-600 text-amber-800 text-xs sm:text-sm break-words">
                Dokumen Belum Lengkap ({dokumen.length - missingDocs.length}/{dokumen.length})
              </p>
              <p className="text-xs text-amber-700 mt-1 mb-2">
                Dokumen berikut belum memenuhi syarat (belum diunggah/ditolak/menunggu):
              </p>
              <ul className="space-y-1 min-w-0">
                {missingDocs.map((doc) => (
                  <li key={doc.nama} className="flex items-start gap-2 text-xs text-amber-800 min-w-0">
                    <XCircle size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{doc.nama} — {doc.status || "Belum diunggah"}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Sections from Backend API */}
      <div className="space-y-3">
        <Section
          title="Evaluasi Akademik & SP"
          icon={<BarChart size={18} />}
          ok={checklist
            .filter(
              (c) =>
                c.syarat.includes("IPK") ||
                c.syarat.includes("SP") ||
                c.syarat.includes("SKS") ||
                c.syarat.includes("MK")
            )
            .every((c) => c.terpenuhi)}
        >
          <div className="space-y-3">
            {checklist
              .filter((c) => !c.syarat.includes("dokumen"))
              .map((c, i) => (
                <div key={i} className="flex items-start justify-between gap-2 sm:gap-3 text-xs pb-2 border-b border-gray-50 last:border-0 last:pb-0 min-w-0">
                  <span className="text-gray-700 font-500 break-words min-w-0">{c.syarat}</span>
                  <span className={`flex items-center gap-1 shrink-0 text-right ${c.terpenuhi ? "text-green-600" : "text-red-600"}`}>
                    {c.terpenuhi ? <CheckCircle size={12} className="flex-shrink-0" /> : <XCircle size={12} className="flex-shrink-0" />}
                    <span className="break-words">{c.terpenuhi ? "Terpenuhi" : c.keterangan || "Belum Terpenuhi"}</span>
                  </span>
                </div>
              ))}
          </div>
        </Section>

        <Section
          title={`Dokumen Kewajiban (${dokumen.filter((d) => d.status === "Disetujui").length}/${dokumen.length}${
            allDocsApproved ? " — Lengkap" : ""
          })`}
          icon={<Folder size={18} />}
          ok={allDocsApproved}
        >
          <div className="space-y-2">
            {dokumen.map((entry) => {
              const isApproved = entry.status === "Disetujui"
              const isRejected = entry.status === "Ditolak"
              const isMissing = !entry.status

              return (
                <div
                  key={entry.nama}
                  className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm px-3 py-2 rounded-lg border min-w-0 ${
                    isApproved
                      ? "bg-green-50 border-green-100"
                      : isRejected || isMissing
                      ? "bg-red-50 border-red-100"
                      : "bg-yellow-50 border-yellow-100"
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                  ) : isRejected || isMissing ? (
                    <XCircle size={15} className="text-red-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle size={15} className="text-yellow-500 flex-shrink-0" />
                  )}
                  <span
                    className={`flex-1 min-w-[120px] basis-1/2 font-500 break-words ${
                      isApproved ? "text-gray-700" : isRejected || isMissing ? "text-red-700" : "text-yellow-700"
                    }`}
                  >
                    {entry.nama}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">{entry.tanggal_upload || "—"}</span>
                  <span
                    className={`text-xs font-600 shrink-0 ${
                      isApproved ? "text-green-600" : isRejected || isMissing ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {entry.status || "Belum diunggah"}
                  </span>
                </div>
              )
            })}
          </div>
        </Section>
      </div>

      {/* Rejection History & PDF Preview */}
      {currentStatus === "ditolak" && (
        <Section title="Riwayat Penolakan" icon={<AlertTriangle size={18} />} ok={false}>
          {rejection_history.length > 0 ? (
            <div className="space-y-4 min-w-0">
              {rejection_history.map((h, i) => (
                <div key={i} className="flex gap-3 sm:gap-4 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5"></div>
                    {i !== rejection_history.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                  </div>
                  <div className="flex-1 pb-4 min-w-0">
                    <div className="flex flex-col min-[420px]:flex-row min-[420px]:justify-between min-[420px]:items-start gap-0.5 sm:gap-2 mb-1 min-w-0">
                      <span className="text-xs sm:text-sm font-600 text-gray-900 break-words">Ditolak oleh {h.oleh}</span>
                      <span className="text-xs text-gray-500 shrink-0">{h.tgl}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 break-words">{h.catatan}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 px-4 text-center text-gray-400 text-xs sm:text-sm border border-dashed border-gray-200 rounded-xl">
              Belum ada riwayat penolakan tercatat.
            </div>
          )}
        </Section>
      )}

      {currentStatus === "diterbitkan" && (
        <div className="mt-6 sm:mt-8 border-t border-[#E2E8F0] pt-6 sm:pt-8 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 min-w-0">
            <h3 className="font-600 text-sm sm:text-base text-gray-800 flex items-center gap-2">
              <Printer size={18} className="text-gray-500 flex-shrink-0" />
              Preview Surat Formal
            </h3>
            <a
              href={`/api/bebas-tanggungan/${permohonan?.id}/pdf?token=${typeof localStorage !== 'undefined' ? localStorage.getItem("simkip_token") || "" : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#263F93] text-white rounded-xl text-xs sm:text-sm font-500 hover:bg-[#1E3275] transition-colors shadow-sm w-full sm:w-auto whitespace-nowrap"
            >
              <Download size={16} className="flex-shrink-0" /> Download PDF
            </a>
          </div>
          <div className="overflow-x-auto min-w-0">
            <FormalSurat student={{ ...data.mahasiswa, permohonan: permohonan as any }} signature={signature ?? undefined} />
          </div>
        </div>
      )}

      {/* Overall assessment */}
      {allConditionsMet ? (
        <div className="flex items-start gap-3 bg-green-50 border border-green-300 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 min-w-0">
          <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-600 text-sm sm:text-base text-green-800">Semua persyaratan terpenuhi</p>
            <p className="text-xs sm:text-sm text-green-700 mt-0.5">Mahasiswa layak mendapatkan Surat Keterangan Penyelesaian KIP-K.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-300 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 min-w-0">
          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-yellow-700 break-words min-w-0">
            Terdapat syarat atau dokumen yang belum lengkap/diverifikasi. Permohonan belum dapat diterbitkan.
          </p>
        </div>
      )}
    </div>
  )
}
