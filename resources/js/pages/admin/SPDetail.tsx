import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, AlertTriangle, CheckCircle, Clock, Printer, ChevronDown, ChevronUp, FileText, BarChart } from "lucide-react";
import { spList } from "../../data/mockData";
import logoItg from "@/imports/logo_itg.jpg";

const levelColor: Record<string, { bg: string; text: string; border: string }> = {
  SP1: { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  SP2: { bg: "#FEE2E2", text: "#991B1B", border: "#EF4444" },
  SP3: { bg: "#7F1D1D", text: "#FEE2E2", border: "#7F1D1D" },
};

const timeline = [
  {
    level: "SP1",
    date: "15 Maret 2025",
    alasan: "IPK semester 3 berada di bawah standar minimum (2.78 < 3.0)",
    outcome: "resolved" as const,
    outcomeText: "IPK membaik ke 3.10 — Selesai",
    detail: "Mahasiswa berhasil meningkatkan IPK melebihi standar pada evaluasi akhir semester.",
  },
  {
    level: "SP2",
    date: "15 Maret 2026",
    alasan: "IPK semester 5 kembali turun di bawah standar minimum (2.90 < 3.0)",
    outcome: "active" as const,
    outcomeText: "Aktif — Masa Tenggang",
    detail: "Mahasiswa diberikan waktu 1 semester untuk memperbaiki IPK.",
  },
];

const ROMAN_MONTHS: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI",
  7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI", 12: "XII",
};

function parseRomanMonth(dateStr: string): { romanMonth: string; year: string } {
  // dateStr e.g. "15 Maret 2025"
  const months: Record<string, number> = {
    januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
    juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12,
  };
  const parts = dateStr.toLowerCase().split(" ");
  const monthNum = months[parts[1]] || 8;
  const year = parts[2] || "2026";
  return { romanMonth: ROMAN_MONTHS[monthNum], year };
}

function SPBodyText({ level, alasan, batasEvaluasi }: { level: string; alasan: string; batasEvaluasi: string }) {
  if (level === "SP1") {
    return (
      <p>
        Berdasarkan hasil evaluasi akademik semester berjalan, Saudara dinyatakan mendapatkan Surat Peringatan
        Pertama (SP-1) dikarenakan: {alasan}. Saudara diberikan waktu hingga <strong>{batasEvaluasi}</strong> untuk
        memperbaiki kondisi akademik. Apabila tidak ada perbaikan, maka akan diterbitkan SP-2.
      </p>
    );
  }
  if (level === "SP2") {
    return (
      <p>
        Saudara kembali mendapatkan evaluasi negatif setelah SP-1 sebelumnya. Dengan diterbitkannya SP-2 ini,
        Saudara diwajibkan untuk segera berkonsultasi dengan pembimbing akademik. Batas evaluasi:{" "}
        <strong>{batasEvaluasi}</strong>.
      </p>
    );
  }
  // SP3
  return (
    <p>
      Ini merupakan surat peringatan terakhir sebelum dilakukannya proses pemberhentian sebagai penerima KIP-K.
      Saudara diminta untuk segera menghubungi Pengelola KIP-K dalam waktu 7 hari kerja sejak surat ini diterbitkan.
    </p>
  );
}

export default function SPDetail() {
  const { id } = useParams();
  const sp = spList.find(s => s.id === Number(id)) || spList[1];
  const lc = levelColor[sp.level] || levelColor.SP1;
  const [showMarkDone, setShowMarkDone] = useState(false);
  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(null);
  const [showSuratModal, setShowSuratModal] = useState(false);

  const totalDays = 180;
  const elapsed = totalDays - sp.sisa;
  const progressPct = Math.min(100, (elapsed / totalDays) * 100);

  const { romanMonth, year } = parseRomanMonth(sp.tanggalTerbit);
  const nomorSurat = `SP/${sp.level}/ITG/${romanMonth}/${year}/001`;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/sp" className="hover:text-gray-700 flex items-center gap-1">
          <ChevronLeft size={15} /> Surat Peringatan
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-500">Detail SP — {sp.nama}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap items-start gap-6">
          {/* SP Level Badge */}
          <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border-2"
            style={{ background: lc.bg, borderColor: lc.border }}>
            <span className="text-xs font-600" style={{ color: lc.text }}>SURAT</span>
            <span className="font-display font-800 text-2xl leading-none" style={{ color: lc.text }}>
              {sp.level.replace("SP", "")}
            </span>
            <span className="text-xs font-600" style={{ color: lc.text }}>SP</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h2 className="font-display font-700 text-xl text-gray-900">{sp.nama}</h2>
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 ${
                sp.status === "Aktif" ? "bg-yellow-100 text-yellow-700" :
                sp.status === "Masa Tenggang" ? "bg-orange-100 text-orange-700" :
                sp.status === "Pemberhentian" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {sp.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">{sp.nim.slice(-8)} · {sp.prodi} · Angkatan {sp.angkatan || "2022"}</p>
            <p className="text-xs text-gray-400 mt-1">Diterbitkan: {sp.tanggalTerbit}</p>
          </div>

          {sp.batasEvaluasi !== "-" && (
            <div className="w-full sm:w-auto">
              <div className="text-xs text-gray-500 mb-1">Evaluasi hingga: <span className="font-500 text-gray-700">{sp.batasEvaluasi}</span></div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-32">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${progressPct}%`,
                    background: progressPct > 80 ? "#DC2626" : progressPct > 50 ? "#F59E0B" : "#059669"
                  }} />
                </div>
                <span className="text-xs text-gray-500">{Math.round(progressPct)}%</span>
              </div>
              {sp.sisa > 0 ? (
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <Clock size={11} /> Tersisa {sp.sisa} hari
                </div>
              ) : (
                <div className="text-xs text-red-600 font-600">Masa tenggang habis</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h3 className="font-600 text-gray-800 text-sm border-b border-gray-100 pb-3">Detail Pelanggaran</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Jenis Pelanggaran</span>
            <div className="mt-1">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-500">Akademik</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Diterbitkan Oleh</span>
            <div className="mt-1 font-500 text-gray-700">Encep Jianul Hayat, S.T., M.T.</div>
            <div className="text-xs text-gray-400">{sp.tanggalTerbit} · 09:32 WIB</div>
          </div>
          <div className="sm:col-span-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Alasan / Deskripsi</span>
            <p className="mt-1 text-gray-700 leading-relaxed">{sp.alasan}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Bukti Pendukung</span>
            <button className="mt-1 flex items-center gap-1.5 text-sm text-[#263F93] hover:underline">
              <BarChart size={16} /> Lihat Data IPK Mahasiswa
            </button>
          </div>
        </div>
      </div>

      {/* SP History Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-600 text-gray-800 text-sm mb-4">Riwayat Surat Peringatan</h3>
        <div className="space-y-0">
          {timeline.map((t, i) => {
            const tlc = levelColor[t.level];
            const isExpanded = expandedTimeline === i;
            return (
              <div key={i} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 border-2 z-10"
                    style={{ background: tlc.bg, borderColor: tlc.border, color: tlc.text }}>
                    {t.level.replace("SP", "")}
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" style={{ minHeight: 24 }} />}
                </div>

                <div className={`flex-1 pb-5 ${i < timeline.length - 1 ? "" : "pb-0"}`}>
                  <button onClick={() => setExpandedTimeline(isExpanded ? null : i)}
                    className="w-full text-left">
                    <div className={`rounded-xl border p-4 hover:shadow-sm transition-shadow cursor-pointer ${
                      t.outcome === "resolved" ? "bg-green-50 border-green-200" :
                      t.outcome === "active" ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-600" style={{ color: tlc.text }}>{t.level}</span>
                            <span className="text-xs text-gray-400">{t.date}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{t.alasan}</p>
                          <div className={`flex items-center gap-1.5 mt-2 text-xs font-500 ${
                            t.outcome === "resolved" ? "text-green-600" : t.outcome === "active" ? "text-orange-600" : "text-red-600"
                          }`}>
                            {t.outcome === "resolved"
                              ? <CheckCircle size={12} />
                              : t.outcome === "active"
                              ? <Clock size={12} />
                              : <AlertTriangle size={12} />}
                            {t.outcomeText}
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                          : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                      </div>
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-current/10 text-xs text-gray-600 leading-relaxed">
                          {t.detail}
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setShowMarkDone(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white transition-colors"
          style={{ background: "#059669" }}>
          <CheckCircle size={15} /> Tandai Selesai (Mahasiswa Membaik)
        </button>
        <Link to="/admin/sp/terbitkan"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 text-white transition-colors"
          style={{ background: "#DC2626" }}>
          <AlertTriangle size={15} /> Eskalasi ke {sp.level === "SP1" ? "SP2" : "SP3"}
        </Link>
        <button onClick={() => setShowSuratModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 border border-[#263F93] text-[#263F93] hover:bg-blue-50 transition-colors">
          <FileText size={15} /> Lihat Surat Resmi
        </button>
        <button onClick={() => setShowSuratModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <Printer size={15} /> Cetak Surat Peringatan
        </button>
      </div>

      {/* Mark Done Confirmation */}
      {showMarkDone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 text-center mb-2">Tandai SP Selesai?</h3>
            <p className="text-gray-500 text-sm text-center mb-5">
              Mahasiswa <strong>{sp.nama}</strong> dinyatakan telah memperbaiki kondisi dan {sp.level} akan ditandai sebagai <strong>Selesai</strong>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowMarkDone(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-500 text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={() => setShowMarkDone(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-500 text-white"
                style={{ background: "#059669" }}>
                Ya, Tandai Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Surat Resmi Modal */}
      {showSuratModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-600 text-gray-800">Surat Peringatan Resmi</h3>
              <button onClick={() => setShowSuratModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 text-lg leading-none">✕</button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="border-2 border-[#263F93] rounded-xl p-1">
                <div className="border border-[#263F93] rounded-lg p-6">
                  {/* Kop surat */}
                  <div className="flex items-center gap-4 border-b-2 border-[#263F93] pb-4 mb-6">
                    <img src={logoItg} alt="Logo ITG" className="h-16 w-16 object-contain flex-shrink-0" />
                    <div className="flex-1 text-center">
                      <p className="text-xs font-semibold">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
                      <p className="font-bold text-sm uppercase tracking-wide">INSTITUT TEKNOLOGI GARUT</p>
                      <p className="text-xs text-gray-600">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
                      <p className="text-xs text-gray-600">Telp. (0262) 2800433 | www.itg.ac.id</p>
                    </div>
                  </div>

                  {/* Metadata grid */}
                  <div className="grid grid-cols-[120px_8px_1fr] gap-y-1 text-sm mb-6">
                    <span>Nomor</span><span>:</span><span>{nomorSurat}</span>
                    <span>Tanggal</span><span>:</span><span>{sp.tanggalTerbit}</span>
                    <span>Perihal</span><span>:</span>
                    <span className="font-semibold">Surat Peringatan {sp.level} — {sp.alasan.split(" ").slice(0, 6).join(" ")}...</span>
                  </div>

                  {/* Kepada */}
                  <div className="mb-6 text-sm">
                    <p>Kepada Yth,</p>
                    <p className="font-semibold">{sp.nama}</p>
                    <p>NIM: {sp.nim.slice(-8)} | {sp.prodi}</p>
                  </div>

                  {/* Salam pembuka */}
                  <div className="text-sm mb-4">
                    <p>Dengan hormat,</p>
                  </div>

                  {/* Body - level-specific content */}
                  <div className="text-sm space-y-3 leading-relaxed mb-8">
                    <SPBodyText level={sp.level} alasan={sp.alasan} batasEvaluasi={sp.batasEvaluasi} />
                    <p>
                      Demikian surat peringatan ini kami sampaikan. Besar harapan kami agar Saudara dapat segera
                      menindaklanjuti hal ini demi kelangsungan studi Saudara sebagai penerima manfaat KIP-K.
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 gap-8 mt-8 text-sm text-center">
                    <div>
                      <p>Garut, {sp.tanggalTerbit}</p>
                      <p className="font-medium">Pengelola KIP-K</p>
                      <div className="h-16" />
                      <p className="font-bold underline">Encep Jianul Hayat, S.T., M.T.</p>
                      <p className="text-xs text-gray-500">NIP. 197805142006041001</p>
                    </div>
                    <div>
                      <p>Mengetahui,</p>
                      <p className="font-medium">Wakil Rektor Bidang Kemahasiswaan</p>
                      <div className="h-16" />
                      <p className="font-bold underline">Dr. Rina Kurniawati, S.E., M.Si.</p>
                      <p className="text-xs text-gray-500">NIP. 198203252008012002</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setShowSuratModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Tutup
              </button>
              <button onClick={() => window.print()}
                className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2"
                style={{ background: "#263F93" }}>
                <Printer size={14} /> Cetak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
