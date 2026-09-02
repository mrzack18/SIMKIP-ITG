import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { FileText, Download, CheckCircle, AlertTriangle, X, Phone, Mail } from "lucide-react";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";
import logoItg from "@/imports/logo_itg.jpg";

type SPLevel = "SP1" | "SP2" | "SP3";

interface SP {
  id: number;
  level: SPLevel;
  nomorSurat: string;
  tanggal: string;
  perihal?: string;
  alasan: string;
  konsekuensi?: string;
  dasarHukum?: string;
  sisaHari: number;
  outcome?: string;
  nama?: string;
  nim?: string;
  prodi?: string;
  tahunAjaran?: string;
  status?: string;
}

const spBadgeColor: Record<SPLevel, string> = {
  SP1: "bg-amber-100 text-amber-700 border-amber-200",
  SP2: "bg-orange-100 text-orange-700 border-orange-200",
  SP3: "bg-red-100 text-red-700 border-red-200",
};

const spHeaderColor: Record<SPLevel, string> = {
  SP1: "from-amber-500 to-orange-500",
  SP2: "from-orange-600 to-red-600",
  SP3: "from-red-700 to-red-900",
};

const spLevelLabel: Record<SPLevel, string> = {
  SP1: "Pertama",
  SP2: "Kedua",
  SP3: "Ketiga",
};


const spKonsekuensi: Record<SPLevel, string> = {
  SP1: "Diberikan masa perbaikan selama satu (1) semester. Apabila pada akhir masa perbaikan IPK tidak mencapai standar minimum 3,00, maka akan diterbitkan Surat Peringatan Kedua (SP-2).",
  SP2: "Diberikan masa perbaikan selama satu (1) semester. Apabila pada akhir masa perbaikan tidak ada perubahan signifikan, maka akan diterbitkan Surat Peringatan Ketiga (SP-3).",
  SP3: "Pengenaan sanksi berat berupa pencabutan status penerima Beasiswa KIP Kuliah."
};

const spDasarHukum: Record<SPLevel, string> = {
  SP1: "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 10 Tahun 2020 tentang Program Indonesia Pintar, serta Pedoman Pengelolaan KIP-K Institut Teknologi Garut Tahun 2023.",
  SP2: "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 10 Tahun 2020 tentang Program Indonesia Pintar, serta Pedoman Pengelolaan KIP-K Institut Teknologi Garut Tahun 2023.",
  SP3: "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 10 Tahun 2020 tentang Program Indonesia Pintar, serta Pedoman Pengelolaan KIP-K Institut Teknologi Garut Tahun 2023."
};

const spLevelIsi: Record<SPLevel, string> = {
  SP1:
    "Indeks Prestasi Kumulatif (IPK) mahasiswa berada di bawah 2,50 (dua koma lima nol), yang merupakan ambang batas minimum yang dipersyaratkan bagi Penerima Beasiswa KIP Kuliah sesuai ketentuan yang berlaku.",
  SP2:
    "Mahasiswa terbukti melakukan pelanggaran berulang terhadap ketentuan penerima Beasiswa KIP Kuliah, termasuk namun tidak terbatas pada tidak memenuhi kewajiban pelaporan, tidak menghadiri kegiatan yang diwajibkan, dan/atau pelanggaran akademik lainnya setelah sebelumnya telah diterbitkan Surat Peringatan Pertama (SP-1).",
  SP3:
    "Mahasiswa tidak menunjukkan perbaikan yang signifikan setelah diterbitkannya SP-1 dan SP-2, sehingga diberikan Surat Peringatan Ketiga (SP-3) yang merupakan peringatan terakhir sebelum pengenaan sanksi berat berupa pencabutan status penerima Beasiswa KIP Kuliah.",
};

function FormalSurat({ sp }: { sp: SP }) {
  return (
    <div className="border-2 border-[#263F93] rounded-xl p-1">
      <div className="border border-[#263F93] rounded-lg p-6 font-serif text-gray-800 text-sm leading-relaxed">
        {/* Kop surat */}
        <div className="flex items-center gap-4 border-b-2 border-[#263F93] pb-4 mb-6">
          <img src={logoItg} alt="ITG" className="h-16 w-16 object-contain flex-shrink-0" />
          <div className="flex-1 text-center">
            <p className="font-bold text-base uppercase">Kementerian Pendidikan, Kebudayaan, Riset dan Teknologi</p>
            <p className="font-bold text-base uppercase">Institut Teknologi Garut</p>
            <p className="text-sm">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
          </div>
        </div>

        {/* Nomor & perihal */}
        <div className="mb-5 space-y-1">
          {(
            [
              ["Nomor", sp.nomorSurat],
              ["Lampiran", "—"],
              ["Perihal", `Surat Peringatan ${spLevelLabel[sp.level]} (${sp.level}) Penerima KIP-K`],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5rem_0.5rem_1fr] gap-x-2 text-xs">
              <span className="text-gray-600">{k}</span>
              <span>:</span>
              <span className={k === "Perihal" || k === "Nomor" ? "font-semibold" : ""}>{v}</span>
            </div>
          ))}
        </div>

        {/* Kepada */}
        <div className="mb-5 text-xs space-y-0.5">
          <p>Kepada Yth.</p>
          <p className="font-semibold">{sp.nama}</p>
          <p>NIM: {sp.nim}</p>
          <p>Program Studi {sp.prodi}</p>
          <p className="mt-1 italic">di Tempat</p>
        </div>

        <p className="mb-4 text-xs">Dengan hormat,</p>

        <div className="space-y-3 text-xs text-justify leading-relaxed">
          <p>
            Sehubungan dengan evaluasi akademik Penerima Beasiswa KIP Kuliah (KIP-K) Institut Teknologi Garut
            Semester IV Tahun Akademik 2024/2025, bersama surat ini kami menyampaikan bahwa saudara/i tersebut
            di atas dinyatakan mendapatkan{" "}
            <strong>
              Surat Peringatan {spLevelLabel[sp.level]} ({sp.level})
            </strong>{" "}
            dengan dasar sebagai berikut:
          </p>

          <div className="bg-[#FFF8EC] border-l-4 border-[#D4A72C] rounded-r-lg px-4 py-3">
            <p className="font-semibold text-[#7A5A00] mb-1">Dasar Peringatan:</p>
            <p className="text-[#7A5A00]">{spLevelIsi[sp.level]}</p>
          </div>

          <p>Sebagai konsekuensi dari peringatan ini, saudara/i diberikan:</p>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-3">
            <p>{sp.konsekuensi || spKonsekuensi[sp.level]}</p>
          </div>

          <p>Surat Peringatan ini diterbitkan berdasarkan:</p>
          <p className="pl-4">{sp.dasarHukum || spDasarHukum[sp.level]}</p>

          <p>
            Demikian surat peringatan ini disampaikan. Apabila saudara/i memiliki keberatan atau pertanyaan
            lebih lanjut, dipersilakan menghubungi Biro Kemahasiswaan Institut Teknologi Garut pada jam kerja.
          </p>
        </div>

        <div className="mt-6 text-xs">
          <p>Garut, {sp.tanggal}</p>
        </div>

        {/* TTD */}
        <div className="mt-5 flex justify-between text-xs">
          <div className="text-center">
            <p className="mb-0.5">Pengelola KIP-K,</p>
            <div className="h-16" />
            <p className="font-bold underline">Encep Jianul Hayat, S.T., M.T.</p>
            <p className="text-gray-500">NIP. 197804202006041001</p>
          </div>
          <div className="text-center">
            <p className="mb-0.5">Wakil Rektor,</p>
            <div className="h-16" />
            <p className="font-bold underline">Dr. Rina Kurniawati, S.E., M.Si.</p>
            <p className="text-gray-500">NIP. 198203152008012002</p>
          </div>
        </div>

        <div className="mt-5 border-t border-[#E2E8F0] pt-3 text-xs text-gray-500">
          <p className="font-semibold mb-1">Tembusan:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Rektor Institut Teknologi Garut</li>
            <li>Ketua Program Studi Teknik Informatika</li>
            <li>Orang Tua/Wali Mahasiswa yang bersangkutan</li>
            <li>Arsip</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

const formatTA = (ta: string) => ta ? ta.replace("Tahun ", "").replace("-1", " Ganjil").replace("-2", " Genap") : "2025/2026 Ganjil";

export default function SPMahasiswa() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSP, setSelectedSP] = useState<SP | null>(null);
  const [taFilter, setTaFilter] = useState(getCurrentTahunAjaran());
  const [list, setList] = useState<SP[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminContact, setAdminContact] = useState<{ nama: string; no_hp: string | null; email: string | null }>({
    nama: 'Biro Kemahasiswaan',
    no_hp: null,
    email: null,
  });

  const fetchSP = () => {
    setLoading(true);
    api.get<{success: boolean, data: SP[]}>(
      "/sp", 
      taFilter ? { tahun_ajaran: taFilter } : undefined
    ).then((res) => {
      setList(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    api.get<{ success: boolean; data: { nama: string; no_hp: string | null; email: string | null } }>("/admin-contact")
      .then(res => { if (res.data) setAdminContact(res.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchSP();
  }, [taFilter]);

  // Listen for SP status changes (e.g. admin marks as done)
  useEffect(() => {
    const handler = () => fetchSP();
    window.addEventListener('sp:updated', handler);
    return () => window.removeEventListener('sp:updated', handler);
  }, [taFilter]);

  const openDetail = (sp: SP) => {
    setSelectedSP(sp);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSP(null);
  };

  const ACTIVE_SP = list.find((s) => s.status === 'Aktif' || s.status === 'Masa Tenggang');
  const HAS_SP = list.length > 0;

  if (loading) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Surat Peringatan</h1>
          <p className="text-gray-500 text-sm mt-0.5">Status surat peringatan KIP-K Anda</p>
        </div>
        <TahunAjaranFilter value={taFilter} onChange={setTaFilter} />
      </div>

      {!HAS_SP ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <h2 className="font-display font-700 text-xl text-green-800 mb-1">Tidak Ada Surat Peringatan</h2>
          <p className="text-green-600 text-sm">Anda tidak memiliki Surat Peringatan. Pertahankan prestasi Anda!</p>
        </div>
      ) : (
        <>

      {/* Active SP banner */}
      {ACTIVE_SP && (
        <div className={`rounded-2xl bg-gradient-to-br ${spHeaderColor[ACTIVE_SP.level]} text-white p-6 shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-700 bg-white/20 px-2 py-0.5 rounded">{ACTIVE_SP.level} AKTIF</span>
                <span className="text-xs text-white/70">No. {ACTIVE_SP.nomorSurat}</span>
              </div>
              <p className="font-display font-800 text-lg leading-tight mb-1">{ACTIVE_SP.perihal}</p>
              <p className="text-sm text-white/80 mb-4">Diterbitkan: {ACTIVE_SP.tanggal}</p>

              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-xs text-white/60 font-600 uppercase tracking-wide mb-1">Alasan Peringatan</p>
                <p className="text-sm text-white leading-relaxed">{ACTIVE_SP.alasan}</p>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Sisa masa perbaikan</span>
                  <span className="font-700">{ACTIVE_SP.sisaHari} hari</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/80 rounded-full"
                    style={{ width: `${(ACTIVE_SP.sisaHari / 180) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-white/50">dari 180 hari masa perbaikan (1 semester)</p>
              </div>

              <button
                onClick={() => openDetail(ACTIVE_SP)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-600 text-white transition-colors"
              >
                <FileText size={14} /> Lihat Detail & Surat Resmi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SP History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-600 text-gray-800 text-sm">Riwayat Surat Peringatan</h2>
          <p className="text-xs text-gray-400 mt-0.5">Klik item untuk melihat detail dan surat resmi</p>
        </div>
        <div className="p-5">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-6">
              {Array.from(new Set(list.map(s => s.tahunAjaran || "2025/2026 Ganjil"))).map((ta) => (
                <div key={ta} className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0 z-10 text-gray-500 font-bold text-xs">
                      {ta.split(" ")[0]}
                    </div>
                    <h2 className="font-600 text-gray-700 text-sm bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                      Tahun Ajaran {ta}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {list.filter(sp => (sp.tahunAjaran || "2025/2026 Ganjil") === ta).map((sp) => (
                      <div key={sp.id} className="relative pl-12">
                        <div className="absolute left-2.5 top-4 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10" />
                        <button
                          onClick={() => openDetail(sp)}
                          className="w-full bg-gray-50 hover:bg-[#263F93]/5 border border-transparent hover:border-[#263F93]/20 rounded-xl transition-all text-left group"
                        >
                          <div className="flex items-center justify-between px-4 py-3.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`px-2.5 py-0.5 rounded-lg border text-xs font-700 flex-shrink-0 ${spBadgeColor[sp.level]}`}
                              >
                                {sp.level}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-600 text-gray-800 truncate">{sp.perihal}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {sp.tanggal} · No. {sp.nomorSurat}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                              {sp.outcome && (
                                <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 font-500">
                                  Diselesaikan
                                </span>
                              )}
                              <FileText size={15} className="text-gray-300 group-hover:text-[#263F93] transition-colors" />
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-[#EDF0F8] border border-[#263F93] rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "#263F9320" }}
          >
            <FileText size={16} style={{ color: "#263F93" }} />
          </div>
          <div>
            <h3 className="font-600 text-sm mb-2" style={{ color: "#263F93" }}>
              Apa yang harus saya lakukan?
            </h3>
            <ul className="space-y-1.5 text-sm" style={{ color: "#263F93" }}>
              <li>• Baca dan pahami alasan penerbitan surat peringatan ini</li>
              <li>• Penuhi semua kewajiban KIP-K yang belum terpenuhi sesuai persyaratan</li>
              <li>• Hubungi Biro Kemahasiswaan jika Anda memiliki pertanyaan atau keberatan</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-3">
              {adminContact.no_hp && (
                <a
                  href={`https://wa.me/${adminContact.no_hp.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-500 hover:underline"
                  style={{ color: "#263F93" }}
                >
                  <Phone size={12} /> {adminContact.no_hp}
                </a>
              )}
              {adminContact.email && (
                <a
                  href={`mailto:${adminContact.email}`}
                  className="flex items-center gap-1.5 text-xs font-500 hover:underline"
                  style={{ color: "#263F93" }}
                >
                  <Mail size={12} /> {adminContact.email}
                </a>
              )}
              {!adminContact.no_hp && !adminContact.email && (
                <span className="text-xs text-gray-400">Kontak belum diatur oleh admin</span>
              )}
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Detail + Formal letter modal */}
      {showModal && selectedSP && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-[#F8FAFC] rounded-2xl w-full max-w-2xl shadow-2xl my-6">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 rounded-lg border text-xs font-700 ${spBadgeColor[selectedSP.level]}`}
                >
                  {selectedSP.level}
                </span>
                <h3 className="font-600 text-gray-800 text-sm">Detail Surat Peringatan</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                  <Download size={12} /> Unduh PDF
                </button>
                <button
                  onClick={closeModal}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Full SP detail section */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
                <h4 className="font-700 text-[#263F93] text-sm flex items-center gap-2">
                  <AlertTriangle size={15} />
                  Informasi Surat Peringatan
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 font-600 uppercase tracking-wide mb-0.5">Nomor Surat</p>
                    <p className="text-gray-800 font-600">{selectedSP.nomorSurat}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-600 uppercase tracking-wide mb-0.5">Tanggal Diterbitkan</p>
                    <p className="text-gray-800">{selectedSP.tanggal}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 font-600 uppercase tracking-wide mb-0.5">Perihal</p>
                    <p className="text-gray-800 font-600">{selectedSP.perihal || `Surat Peringatan ${spLevelLabel[selectedSP.level]} (${selectedSP.level})`}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-600 uppercase tracking-wide mb-1">Alasan Peringatan</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedSP.alasan}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-600 uppercase tracking-wide mb-1">Yang Harus Dilakukan</p>
                  <div className="bg-[#EDF0F8] border border-[#263F93]/20 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
                    {selectedSP.konsekuensi || spKonsekuensi[selectedSP.level]}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-600 uppercase tracking-wide mb-1">Dasar Hukum</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{selectedSP.dasarHukum || spDasarHukum[selectedSP.level]}</p>
                </div>

                {selectedSP.outcome && (
                  <div>
                    <p className="text-xs text-gray-400 font-600 uppercase tracking-wide mb-1">Hasil Penyelesaian</p>
                    <p className="text-sm text-green-700">{selectedSP.outcome}</p>
                  </div>
                )}

                {!selectedSP.outcome && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      <span className="font-600">Sisa masa perbaikan:</span> {selectedSP.sisaHari} hari dari 180 hari
                    </p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E2E8F0]" />
                <span className="text-xs text-gray-400 font-600 uppercase tracking-wide">Surat Resmi</span>
                <div className="flex-1 h-px bg-[#E2E8F0]" />
              </div>

              {/* Formal surat with kop */}
              <FormalSurat sp={selectedSP} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
