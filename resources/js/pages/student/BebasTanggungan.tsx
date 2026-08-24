import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertTriangle, Send, Download, X, ChevronRight, XCircle } from "lucide-react";
import logoItg from "@/imports/logo_itg.jpg";

type AppState = "belum" | "menunggu" | "diterbitkan" | "ditolak";

const mahasiswa = {
  nama: "Ahmad Rifaldi",
  nim: "2206001",
  prodi: "Teknik Informatika",
  angkatan: 2022,
};

// 5 required documents in specified order
const REQUIRED_DOCS = ["PKKMB", "MABIM", "Bela Negara", "Sertifikasi", "Berita Acara KP"];

const docDescriptions: Record<string, string> = {
  "PKKMB": "Sertifikat PKKMB telah diverifikasi",
  "MABIM": "Sertifikat MABIM telah diverifikasi",
  "Bela Negara": "Sertifikat Bela Negara telah diverifikasi",
  "Sertifikasi": "Minimal 1 sertifikasi profesional telah diverifikasi",
  "Berita Acara KP": "Berita Acara Kerja Praktik telah diverifikasi",
};

// Mock: all 5 submitted
const submittedDocs: Record<string, { tgl: string }> = {
  "PKKMB": { tgl: "20 Sep 2022" },
  "MABIM": { tgl: "22 Sep 2022" },
  "Bela Negara": { tgl: "15 Nov 2022" },
  "Sertifikasi": { tgl: "10 Mar 2025" },
  "Berita Acara KP": { tgl: "10 Jul 2025" },
};

const rejectionHistory = [
  {
    tgl: "5 Agustus 2026",
    catatan: "Dokumen Berita Acara KP belum memiliki tanda tangan pembimbing lapangan yang sah.",
    oleh: "Encep Jianul Hayat, S.T., M.T.",
  },
  {
    tgl: "12 Agustus 2026",
    catatan: "Sertifikasi yang dilampirkan bukan dari lembaga yang diakui. Harap unggah ulang dengan sertifikasi resmi.",
    oleh: "Encep Jianul Hayat, S.T., M.T.",
  },
];

export default function BebasTanggungan() {
  const [state, setState] = useState<AppState>("belum");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const missingDocs = REQUIRED_DOCS.filter((doc) => !submittedDocs[doc]);
  const allDocsSubmitted = missingDocs.length === 0;
  const submittedCount = REQUIRED_DOCS.filter((doc) => submittedDocs[doc]).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Surat Keterangan Penyelesaian Studi</h1>
        <p className="text-gray-500 text-sm mt-0.5">Mahasiswa KIP-K — {mahasiswa.prodi} · {mahasiswa.nim}</p>
      </div>

      {state === "belum" && (
        <>
          {/* Document checklist */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-600 text-gray-800 text-sm">Dokumen Kewajiban KIP-K</span>
              <span className="font-display font-700 text-lg" style={{ color: allDocsSubmitted ? "#059669" : "#263F93" }}>
                {submittedCount}/{REQUIRED_DOCS.length}
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((submittedCount / REQUIRED_DOCS.length) * 100)}%`,
                  background: allDocsSubmitted ? "#059669" : "#263F93",
                }}
              />
            </div>
            <div className="space-y-2">
              {REQUIRED_DOCS.map((doc) => {
                const submitted = submittedDocs[doc];
                return (
                  <div
                    key={doc}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                      submitted ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                    }`}
                  >
                    {submitted ? (
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-600 ${submitted ? "text-green-800" : "text-red-700"}`}>{doc}</div>
                      <div className="text-xs text-gray-500">{docDescriptions[doc]}</div>
                    </div>
                    {submitted ? (
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-500 text-green-600">Terpenuhi</span>
                        <div className="text-xs text-gray-400">{submitted.tgl}</div>
                      </div>
                    ) : (
                      <span className="text-xs font-500 text-red-600 flex-shrink-0">Belum</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incomplete warning */}
          {!allDocsSubmitted && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-600 text-amber-800 text-sm">Dokumen Belum Lengkap</p>
                  <p className="text-xs text-amber-700 mt-1 mb-2">
                    Permohonan belum dapat diajukan. Dokumen berikut belum diunggah:
                  </p>
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

          {allDocsSubmitted && (
            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <h3 className="font-display font-700 text-lg text-gray-900 mb-1">Semua Dokumen Lengkap</h3>
              <p className="text-gray-500 text-sm mb-5">
                Anda dapat mengajukan permohonan penerbitan Surat Keterangan Penyelesaian Studi KIP-K.
              </p>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-700 text-white mx-auto"
                style={{ background: "#263F93" }}
              >
                <Send size={16} /> Ajukan Permohonan
              </button>
            </div>
          )}

          <div className="text-center text-xs text-gray-400">
            Demo:
            <button onClick={() => setState("menunggu")} className="underline text-[#263F93] ml-2">Menunggu</button>
            <button onClick={() => setState("diterbitkan")} className="underline text-green-600 ml-2">Diterbitkan</button>
            <button onClick={() => setState("ditolak")} className="underline text-red-600 ml-2">Ditolak</button>
          </div>
        </>
      )}

      {state === "menunggu" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-[#263F93]" />
          </div>
          <h3 className="font-display font-700 text-xl text-gray-900 mb-2">Permohonan Sedang Diproses</h3>
          <p className="text-gray-500 text-sm mb-4">Permohonan Anda sedang dicek kelayakannya oleh Pengelola KIP-K.</p>
          <div className="bg-[#EDF0F8] border border-[#263F93]/30 rounded-xl p-4 text-left space-y-2 mb-4 max-w-xs mx-auto">
            {[
              ["Tanggal Pengajuan", "17 Agustus 2026"],
              ["Estimasi Selesai", "3–5 hari kerja"],
              ["Status", "Menunggu Review"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-500">{k}</span>
                <span className="font-500 text-gray-800">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-center mt-4 text-xs text-gray-400">
            <span>Demo:</span>
            <button onClick={() => setState("diterbitkan")} className="underline text-green-600">Diterbitkan</button>
            <button onClick={() => setState("ditolak")} className="underline text-red-600">Ditolak</button>
          </div>
        </div>
      )}

      {state === "diterbitkan" && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">
            <CheckCircle size={22} className="text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-600 text-green-800">Surat Keterangan Telah Diterbitkan</p>
              <p className="text-xs text-green-700 mt-0.5">Diterbitkan pada 20 Agustus 2026 oleh Pengelola KIP-K</p>
            </div>
            <button
              onClick={() => setShowLetter(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 text-white flex-shrink-0"
              style={{ background: "#263F93" }}
            >
              <Download size={14} /> Lihat Surat
            </button>
          </div>

          <button
            onClick={() => setShowLetter(true)}
            className="w-full bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 flex items-center gap-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-14 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-[#263F93]" />
            </div>
            <div className="flex-1">
              <div className="font-600 text-gray-800 text-sm">Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K</div>
              <div className="text-xs text-gray-500 mt-0.5">No: SKPS/KIP-K/ITG/VIII/2026/001 · 20 Agustus 2026</div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>

          {/* Formal surat inline */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-sm font-600 text-gray-700">Pratinjau Surat Penyelesaian</span>
              <button onClick={() => setShowLetter(true)} className="text-xs text-[#263F93] underline">
                Buka Penuh
              </button>
            </div>
            <div className="p-5">
              <div className="border-2 border-[#263F93] rounded-xl p-1">
                <div className="border border-[#263F93] rounded-lg p-5 font-serif text-gray-800 text-xs leading-relaxed">
                  <div className="flex items-center gap-4 border-b-2 border-[#263F93] pb-4 mb-4">
                    <img src={logoItg} alt="ITG" className="h-14 w-14 object-contain flex-shrink-0" />
                    <div className="flex-1 text-center">
                      <p className="font-bold text-xs">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
                      <p className="font-bold text-sm">INSTITUT TEKNOLOGI GARUT</p>
                      <p className="text-xs text-gray-500">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
                    </div>
                  </div>
                  <div className="mb-3 space-y-0.5">
                    {[
                      ["Nomor", "SKPS/KIP-K/ITG/VIII/2026/001"],
                      ["Perihal", "Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K"],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[4rem_0.5rem_1fr] gap-x-1 text-xs">
                        <span className="text-gray-600">{k}</span>
                        <span>:</span>
                        <span className="font-600">{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed mb-3 text-justify">
                    Menerangkan bahwa <strong>{mahasiswa.nama}</strong> (NIM {mahasiswa.nim}) Program Studi {mahasiswa.prodi} Angkatan {mahasiswa.angkatan} telah
                    menyelesaikan seluruh kewajiban KIP-K: PKKMB, MABIM, Bela Negara, Sertifikasi, dan Berita Acara KP.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-center">
                    <div>
                      <p>Pengelola KIP-K,</p>
                      <div className="h-10 my-1" />
                      <p className="font-bold underline">Encep Jianul Hayat, S.T., M.T.</p>
                    </div>
                    <div>
                      <p>Wakil Rektor,</p>
                      <div className="h-10 my-1" />
                      <p className="font-bold underline">Dr. Rina Kurniawati, S.E., M.Si.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {state === "ditolak" && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-600 text-red-800">Permohonan Ditolak</p>
              <p className="text-sm text-red-700 mt-1">
                Permohonan Anda ditolak. Silakan periksa catatan penolakan di bawah, perbaiki dokumen, lalu ajukan ulang.
              </p>
            </div>
          </div>

          {/* Rejection history */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
            <h3 className="font-600 text-gray-800 text-sm mb-3 flex items-center gap-2">
              <XCircle size={15} className="text-[#DC2626]" /> Riwayat Penolakan
            </h3>
            <div className="space-y-3">
              {rejectionHistory.map((r, i) => (
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

          <button
            onClick={() => setState("belum")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-600 text-white"
            style={{ background: "#263F93" }}
          >
            Perbaiki dan Ajukan Ulang
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-[#263F93]" />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 text-center mb-2">Ajukan Permohonan?</h3>
            <p className="text-gray-500 text-sm text-center mb-5">
              Pengelola KIP-K akan mengecek kelayakan dan menerbitkan surat keterangan jika semua kewajiban terpenuhi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-500 text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={() => { setShowConfirm(false); setState("menunggu"); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white"
                style={{ background: "#263F93" }}
              >
                Ya, Ajukan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Letter Modal — full surat */}
      {showLetter && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl my-6 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <h3 className="font-600 text-gray-800 text-sm">Surat Keterangan Penyelesaian Studi</h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                  <Download size={12} /> Unduh PDF
                </button>
                <button onClick={() => setShowLetter(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-6">
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
                    <p className="font-600">{mahasiswa.nama}</p>
                    <p>NIM: {mahasiswa.nim}</p>
                    <p>Program Studi {mahasiswa.prodi}</p>
                    <p className="italic mt-1">di Tempat</p>
                  </div>

                  <p className="mb-3 text-xs">Dengan hormat,</p>

                  <p className="text-xs leading-relaxed mb-3 text-justify">
                    Yang bertanda tangan di bawah ini, Pengelola KIP-K Institut Teknologi Garut, menerangkan dengan sesungguhnya bahwa:
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-3 space-y-1">
                    {[
                      ["Nama", mahasiswa.nama],
                      ["NIM", mahasiswa.nim],
                      ["Program Studi", mahasiswa.prodi],
                      ["Angkatan", String(mahasiswa.angkatan)],
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
                    <li>PKKMB — diverifikasi 20 Sep 2022</li>
                    <li>MABIM — diverifikasi 22 Sep 2022</li>
                    <li>Bela Negara — diverifikasi 15 Nov 2022</li>
                    <li>Sertifikasi Profesional — diverifikasi 10 Mar 2025</li>
                    <li>Berita Acara Kerja Praktik — diverifikasi 10 Jul 2025</li>
                  </ol>
                  <p className="text-xs leading-relaxed text-justify">
                    Demikian surat keterangan ini diterbitkan untuk dapat digunakan sebagaimana mestinya.
                  </p>

                  {/* TTD */}
                  <div className="mt-5 grid grid-cols-2 gap-6 text-xs text-center">
                    <div>
                      <p>Garut, 20 Agustus 2026</p>
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
            </div>
            <div className="p-4 border-t border-[#E2E8F0] flex justify-end gap-3">
              <button onClick={() => setShowLetter(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
                Tutup
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 text-white" style={{ background: "#263F93" }}>
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
