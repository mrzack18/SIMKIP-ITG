import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, CheckCircle, XCircle, ChevronDown, ChevronUp, AlertTriangle, Download, Printer, BarChart, Folder, Clock } from "lucide-react";
import logoItg from "@/imports/logo_itg.jpg";

// 5 required docs in order
const REQUIRED_DOCS = ["PKKMB", "MABIM", "Bela Negara", "Sertifikasi", "Berita Acara KP"];

type DocStatus = "Disetujui" | "Menunggu" | "Ditolak";
type StudentStatus = "menunggu" | "diterbitkan" | "ditolak";

interface DocEntry {
  nama: string;
  status: DocStatus;
  tgl: string;
}

interface RejectionEntry {
  tgl: string;
  catatan: string;
  oleh: string;
}

interface StudentData {
  nama: string;
  nim: string;
  prodi: string;
  angkatan: number;
  semester: number;
  tanggalAjukan: string;
  status: StudentStatus;
  dokumen: DocEntry[];
  penolakanHistory: RejectionEntry[];
  sksDitempuh: number;
  sksTotal: number;
}

// Sample mock data for 3 students
const mockStudents: Record<string, StudentData> = {
  "2206001": {
    nama: "Ahmad Rifaldi",
    nim: "2206001",
    prodi: "Teknik Informatika",
    angkatan: 2022,
    semester: 8,
    tanggalAjukan: "17 Agustus 2026",
    status: "diterbitkan",
    dokumen: [
      { nama: "PKKMB", status: "Disetujui", tgl: "20 Sep 2022" },
      { nama: "MABIM", status: "Disetujui", tgl: "22 Sep 2022" },
      { nama: "Bela Negara", status: "Disetujui", tgl: "15 Nov 2022" },
      { nama: "Sertifikasi", status: "Disetujui", tgl: "10 Mar 2025" },
      { nama: "Berita Acara KP", status: "Disetujui", tgl: "10 Jul 2025" },
    ],
    penolakanHistory: [],
    sksDitempuh: 144,
    sksTotal: 144,
  },
  "2206042": {
    nama: "Siti Nurhaliza",
    nim: "2206042",
    prodi: "Teknik Elektro",
    angkatan: 2022,
    semester: 8,
    tanggalAjukan: "18 Agustus 2026",
    status: "menunggu",
    dokumen: [
      { nama: "PKKMB", status: "Disetujui", tgl: "20 Sep 2022" },
      { nama: "MABIM", status: "Disetujui", tgl: "22 Sep 2022" },
      { nama: "Bela Negara", status: "Disetujui", tgl: "15 Nov 2022" },
      // Sertifikasi and Berita Acara KP not submitted
    ],
    penolakanHistory: [],
    sksDitempuh: 130,
    sksTotal: 144,
  },
  "2206078": {
    nama: "Rizky Pratama",
    nim: "2206078",
    prodi: "Teknik Mesin",
    angkatan: 2022,
    semester: 8,
    tanggalAjukan: "10 Agustus 2026",
    status: "ditolak",
    dokumen: [
      { nama: "PKKMB", status: "Disetujui", tgl: "20 Sep 2022" },
      { nama: "MABIM", status: "Disetujui", tgl: "22 Sep 2022" },
      { nama: "Bela Negara", status: "Disetujui", tgl: "15 Nov 2022" },
      { nama: "Sertifikasi", status: "Ditolak", tgl: "5 Agu 2026" },
      { nama: "Berita Acara KP", status: "Ditolak", tgl: "3 Agu 2026" },
    ],
    penolakanHistory: [
      {
        tgl: "5 Agustus 2026",
        catatan: "Dokumen Berita Acara KP tidak memiliki tanda tangan pembimbing lapangan yang sah.",
        oleh: "Encep Jianul Hayat, S.T., M.T.",
      },
      {
        tgl: "12 Agustus 2026",
        catatan: "Sertifikasi yang dilampirkan bukan dari lembaga yang diakui. Harap lampirkan sertifikasi resmi dari lembaga terakreditasi.",
        oleh: "Encep Jianul Hayat, S.T., M.T.",
      },
    ],
    sksDitempuh: 144,
    sksTotal: 144,
  },
};

const ipkData = [
  { sem: 1, ipk: 3.20 }, { sem: 2, ipk: 3.45 }, { sem: 3, ipk: 3.65 },
  { sem: 4, ipk: 3.30 }, { sem: 5, ipk: 3.48 }, { sem: 6, ipk: 3.45 },
  { sem: 7, ipk: 3.52 }, { sem: 8, ipk: 3.60 },
];

interface CollapsibleSection {
  title: string;
  icon: React.ReactNode;
  ok: boolean;
  children: React.ReactNode;
}

function Section({ title, icon, ok, children }: CollapsibleSection) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`rounded-xl border overflow-hidden ${ok ? "border-green-200" : "border-yellow-300"}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-4 ${ok ? "bg-green-50" : "bg-yellow-50"}`}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-400 flex items-center justify-center">{icon}</div>
          <span className="font-600 text-gray-800 text-sm">{title}</span>
          {ok ? (
            <CheckCircle size={15} className="text-green-500" />
          ) : (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-500">Perlu Perhatian</span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="p-5 bg-white">{children}</div>}
    </div>
  );
}

function FormalSurat({ student }: { student: StudentData }) {
  const avgIPK = (ipkData.reduce((s, d) => s + d.ipk, 0) / ipkData.length).toFixed(2);
  return (
    <div className="border-2 border-[#263F93] rounded-xl p-1">
      <div className="border border-[#263F93] rounded-lg p-6 font-serif text-gray-800 text-xs leading-relaxed">
        {/* Kop surat */}
        <div className="flex items-center gap-4 border-b-2 border-[#263F93] pb-4 mb-6">
          <img src={logoItg} alt="ITG" className="h-16 w-16 object-contain flex-shrink-0" />
          <div className="flex-1 text-center">
            <p className="font-bold text-xs">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
            <p className="font-bold text-base">INSTITUT TEKNOLOGI GARUT</p>
            <p className="text-xs text-gray-500">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
            <p className="text-xs text-gray-400">Telp. (0262) 540895 · www.itg.ac.id · info@itg.ac.id</p>
          </div>
        </div>

        {/* Judul */}
        <div className="text-center mb-5">
          <p className="font-bold text-sm underline uppercase tracking-wide">
            Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K
          </p>
        </div>

        {/* Nomor surat */}
        <div className="mb-4 space-y-1">
          {[
            ["Nomor", "SKPS/KIP-K/ITG/VIII/2026/001"],
            ["Lampiran", "—"],
            ["Perihal", "Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5rem_0.5rem_1fr] gap-x-2 text-xs">
              <span className="text-gray-600">{k}</span>
              <span>:</span>
              <span className={k !== "Lampiran" ? "font-600" : ""}>{v}</span>
            </div>
          ))}
        </div>

        {/* Kepada */}
        <div className="mb-4 text-xs space-y-0.5">
          <p>Kepada Yth.</p>
          <p className="font-600">{student.nama}</p>
          <p>NIM: {student.nim}</p>
          <p>Program Studi {student.prodi}</p>
          <p className="italic mt-1">di Tempat</p>
        </div>

        <p className="mb-3 text-xs">Dengan hormat,</p>

        <p className="text-xs leading-relaxed mb-3 text-justify">
          Yang bertanda tangan di bawah ini, Pengelola KIP-K Institut Teknologi Garut, menerangkan dengan sesungguhnya bahwa:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-3 space-y-1">
          {[
            ["Nama", student.nama],
            ["NIM", student.nim],
            ["Program Studi", student.prodi],
            ["Angkatan", String(student.angkatan)],
            ["Semester", String(student.semester)],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5rem_0.5rem_1fr] gap-x-2 text-xs">
              <span className="text-gray-500">{k}</span>
              <span>:</span>
              <span className="font-600">{v}</span>
            </div>
          ))}
        </div>

        <p className="text-xs leading-relaxed mb-2 text-justify">
          Telah <strong>menyelesaikan seluruh kewajiban sebagai penerima Kartu Indonesia Pintar Kuliah (KIP-K)</strong> di
          Institut Teknologi Garut, yang meliputi:
        </p>
        <ol className="list-decimal list-inside space-y-0.5 pl-2 text-xs mb-3">
          {student.dokumen.map((d) => (
            <li key={d.nama}>{d.nama} — diverifikasi {d.tgl}</li>
          ))}
          <li>Indeks Prestasi Kumulatif (IPK) rata-rata {avgIPK} — memenuhi standar minimum KIP-K (≥ 3,00)</li>
          <li>Tidak memiliki riwayat Surat Peringatan aktif</li>
        </ol>
        <p className="text-xs leading-relaxed text-justify">
          Demikian surat keterangan ini diterbitkan untuk dapat digunakan sebagaimana mestinya.
        </p>

        {/* TTD */}
        <div className="mt-5 grid grid-cols-2 gap-6 text-xs text-center">
          <div>
            <p>Garut, {student.tanggalAjukan}</p>
            <p className="mt-0.5">Pengelola KIP-K,</p>
            <div className="h-14 my-1" />
            <p className="font-bold underline">Encep Jianul Hayat, S.T., M.T.</p>
            <p className="text-gray-500">NIP. 197804202006041001</p>
          </div>
          <div>
            <p>Mengetahui,</p>
            <p className="mt-0.5">Wakil Rektor,</p>
            <div className="h-14 my-1" />
            <p className="font-bold underline">Dr. Rina Kurniawati, S.E., M.Si.</p>
            <p className="text-gray-500">NIP. 198203152008012002</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BebasTanggunganDetail() {
  const [searchParams] = useSearchParams();
  const nimParam = searchParams.get("nim") || "2206001";
  const student = mockStudents[nimParam] || mockStudents["2206001"];

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentStatus, setCurrentStatus] = useState<StudentStatus>(student.status);
  const [approveChecked, setApproveChecked] = useState(false);

  const avgIPK = (ipkData.reduce((s, d) => s + d.ipk, 0) / ipkData.length).toFixed(2);

  // Compute which docs are missing
  const submittedDocNames = student.dokumen.map((d) => d.nama);
  const missingDocs = REQUIRED_DOCS.filter((doc) => !submittedDocNames.includes(doc));
  const allDocsSubmitted = missingDocs.length === 0;
  const allDocsApproved = student.dokumen.length === 5 && student.dokumen.every((d) => d.status === "Disetujui");

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/bebas-tanggungan" className="hover:text-gray-700 flex items-center gap-1">
          <ChevronLeft size={15} /> Surat Penyelesaian
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-500">Review {student.nim}</span>
      </div>

      {/* Demo switcher */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-3 flex items-center gap-3 text-xs text-gray-500">
        <span className="font-500">Demo mahasiswa:</span>
        {Object.values(mockStudents).map((s) => (
          <a
            key={s.nim}
            href={`?nim=${s.nim}`}
            className={`px-2.5 py-1 rounded-lg border font-500 transition-colors ${
              nimParam === s.nim
                ? "bg-[#263F93] text-white border-[#263F93]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s.nama.split(" ")[0]} ({s.status === "diterbitkan" ? "✓ Diterbitkan" : s.status === "ditolak" ? "✗ Ditolak" : "• Menunggu"})
          </a>
        ))}
      </div>

      {/* Student card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#263F93] flex items-center justify-center text-white font-display font-700 text-xl flex-shrink-0">
            {student.nama.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-700 text-lg text-gray-900">{student.nama}</h2>
            <p className="text-sm text-gray-500">{student.nim} · {student.prodi} · Angkatan {student.angkatan}</p>
            <p className="text-xs text-gray-400 mt-0.5">Diajukan: {student.tanggalAjukan}</p>
          </div>
          <div className="text-right flex-shrink-0">
            {currentStatus === "diterbitkan" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-600 bg-green-100 text-green-700">
                <CheckCircle size={12} /> Diterbitkan
              </span>
            )}
            {currentStatus === "ditolak" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-600 bg-red-100 text-red-700">
                <XCircle size={12} /> Ditolak
              </span>
            )}
            {currentStatus === "menunggu" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-600 bg-blue-100 text-blue-700">
                <Clock size={12} /> Menunggu Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Incomplete docs warning */}
      {!allDocsSubmitted && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-600 text-amber-800 text-sm">Dokumen Belum Lengkap ({submittedDocNames.length}/5)</p>
              <p className="text-xs text-amber-700 mt-1 mb-2">Dokumen berikut belum diunggah oleh mahasiswa:</p>
              <ul className="space-y-1">
                {missingDocs.map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-xs text-amber-800">
                    <XCircle size={12} className="text-amber-500 flex-shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Sections */}
      <div className="space-y-3">
        <Section title="Riwayat Akademik" icon={<BarChart size={18} />} ok={student.sksDitempuh >= student.sksTotal}>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {ipkData.map((d) => (
                <div key={d.sem} className={`text-center p-2 rounded-lg text-xs ${d.ipk >= 3.0 ? "bg-green-50" : "bg-red-50"}`}>
                  <div className="text-gray-400 mb-0.5">Sem {d.sem}</div>
                  <div className={`font-display font-700 ${d.ipk >= 3.0 ? "text-green-700" : "text-red-700"}`}>{d.ipk}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">IPK Rata-rata: <strong className="text-gray-800">{avgIPK}</strong></span>
              <span className="flex items-center gap-1 text-green-600"><CheckCircle size={12} /> Semua semester di atas standar</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-gray-500">Total SKS: <strong className="text-gray-800">{student.sksDitempuh}/{student.sksTotal}</strong></span>
              <span className={`flex items-center gap-1 ${student.sksDitempuh >= student.sksTotal ? 'text-green-600' : 'text-red-600'}`}>
                {student.sksDitempuh >= student.sksTotal ? <CheckCircle size={12} /> : <XCircle size={12} />} 
                {student.sksDitempuh >= student.sksTotal ? 'Semua matkul lulus 144 SKS' : 'SKS belum mencukupi'}
              </span>
            </div>
          </div>
        </Section>

        <Section
          title={`Dokumen Kewajiban (${submittedDocNames.length}/5${allDocsApproved ? " — Lengkap" : ""})`}
          icon={<Folder size={18} />}
          ok={allDocsSubmitted && allDocsApproved}
        >
          <div className="space-y-2">
            {REQUIRED_DOCS.map((docName) => {
              const entry = student.dokumen.find((d) => d.nama === docName);
              if (!entry) {
                return (
                  <div key={docName} className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                    <XCircle size={15} className="text-red-400 flex-shrink-0" />
                    <span className="flex-1 text-red-700 font-500">{docName}</span>
                    <span className="text-xs text-red-500 font-500">Belum diunggah</span>
                  </div>
                );
              }
              const isApproved = entry.status === "Disetujui";
              const isRejected = entry.status === "Ditolak";
              return (
                <div
                  key={docName}
                  className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg border ${
                    isApproved ? "bg-green-50 border-green-100" : isRejected ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                  ) : isRejected ? (
                    <XCircle size={15} className="text-red-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle size={15} className="text-yellow-500 flex-shrink-0" />
                  )}
                  <span className={`flex-1 font-500 ${isApproved ? "text-gray-700" : isRejected ? "text-red-700" : "text-yellow-700"}`}>
                    {docName}
                  </span>
                  <span className="text-xs text-gray-400">{entry.tgl}</span>
                  <span className={`text-xs font-600 ${isApproved ? "text-green-600" : isRejected ? "text-red-600" : "text-yellow-600"}`}>
                    {entry.status}
                  </span>
                </div>
              );
            })}
            <div className={`mt-2 pt-2 border-t border-gray-100 text-xs font-500 flex items-center gap-1 ${allDocsApproved ? "text-green-600" : "text-yellow-600"}`}>
              {allDocsApproved ? (
                <><CheckCircle size={12} /> 5/5 Lengkap &amp; Tervalidasi</>
              ) : (
                <><AlertTriangle size={12} /> {submittedDocNames.length}/5 dokumen tersedia</>
              )}
            </div>
          </div>
        </Section>

        <Section title="Riwayat Surat Peringatan" icon={<AlertTriangle size={18} />} ok>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle size={15} /> Tidak ada SP aktif maupun riwayat SP yang belum diselesaikan.
          </div>
        </Section>
      </div>

      {/* Rejection history (shown when status is ditolak) */}
      {currentStatus === "ditolak" && student.penolakanHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
          <h3 className="font-600 text-gray-800 text-sm mb-3 flex items-center gap-2">
            <XCircle size={15} className="text-[#DC2626]" /> Riwayat Penolakan
          </h3>
          <div className="space-y-3">
            {student.penolakanHistory.map((r, i) => (
              <div key={i} className="border border-red-100 rounded-xl p-4 bg-red-50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-600 text-red-700">Penolakan #{i + 1}</span>
                  <span className="text-xs text-gray-500">{r.tgl}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-1.5">
                  <span className="font-600">Catatan Penolakan: </span>{r.catatan}
                </p>
                <p className="text-xs text-gray-500">
                  Ditolak oleh: <span className="font-500 text-gray-700">{r.oleh}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall assessment */}
      {allDocsSubmitted && allDocsApproved ? (
        <div className="flex items-start gap-3 bg-green-50 border border-green-300 rounded-xl px-5 py-4">
          <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-600 text-green-800">Semua persyaratan terpenuhi</p>
            <p className="text-sm text-green-700 mt-0.5">Mahasiswa layak mendapatkan Surat Keterangan Penyelesaian KIP-K.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-4">
          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Terdapat dokumen yang belum lengkap atau belum diverifikasi. Permohonan belum dapat diterbitkan.
          </p>
        </div>
      )}

      {/* Formal surat — shown when diterbitkan */}
      {currentStatus === "diterbitkan" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-600 text-gray-800 text-sm flex items-center gap-2">
              <CheckCircle size={15} className="text-[#059669]" /> Surat Penyelesaian Telah Diterbitkan
            </h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                <Download size={12} /> Unduh PDF
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                <Printer size={12} /> Cetak
              </button>
            </div>
          </div>
          <div className="p-5">
            <FormalSurat student={student} />
          </div>
        </div>
      )}

      {/* Action buttons — only for menunggu */}
      {currentStatus === "menunggu" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-5 py-4 flex flex-wrap items-center gap-3">
          <Link to="/admin/bebas-tanggungan" className="text-sm text-gray-500 hover:text-gray-700">
            ← Kembali
          </Link>
          <div className="flex-1" />
          {!showReject ? (
            <>
              <button
                onClick={() => setShowReject(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <XCircle size={15} /> Tolak
              </button>
              <button
                onClick={() => setShowApprove(true)}
                disabled={!allDocsApproved}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ background: "#059669" }}
              >
                <CheckCircle size={15} /> Terbitkan Surat Penyelesaian
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={2}
                placeholder="Catatan penolakan..."
                className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:outline-none resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowReject(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Batal</button>
                <button
                  onClick={() => { setCurrentStatus("ditolak"); setShowReject(false); }}
                  className="px-4 py-2 rounded-lg text-sm font-500 text-white"
                  style={{ background: "#DC2626" }}
                >
                  Konfirmasi Penolakan
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStatus !== "menunggu" && (
        <div className="flex justify-start">
          <Link to="/admin/bebas-tanggungan" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ChevronLeft size={15} /> Kembali ke Daftar
          </Link>
        </div>
      )}

      {/* Approve Confirm Modal */}
      {showApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 text-center mb-2">Konfirmasi Penerbitan</h3>
            <p className="text-gray-500 text-sm text-center mb-4">
              Dengan menerbitkan, sistem akan membuat Surat Keterangan Penyelesaian Studi untuk <strong>{student.nama}</strong>.
            </p>
            <label className="flex items-start gap-2 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={approveChecked}
                onChange={(e) => setApproveChecked(e.target.checked)}
                className="mt-0.5 accent-[#059669]"
              />
              <span className="text-xs text-gray-600">
                Saya telah memeriksa seluruh persyaratan dan menyatakan mahasiswa ini layak mendapatkan Surat Keterangan Penyelesaian Studi.
              </span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowApprove(false); setApproveChecked(false); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-500 text-gray-600"
              >
                Batal
              </button>
              <button
                disabled={!approveChecked}
                onClick={() => { setShowApprove(false); setCurrentStatus("diterbitkan"); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#059669" }}
              >
                Terbitkan Surat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
