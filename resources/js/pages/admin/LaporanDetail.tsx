import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, Download, Printer, CheckCircle, RotateCcw, QrCode, Clock } from "lucide-react";
import { mahasiswaList, angkatanStats } from "../../data/mockData";
import logoItg from "@/imports/logo_itg.jpg";

const ipkTrend = [
  { sem: "Sem 1", avg: 3.10 }, { sem: "Sem 2", avg: 3.18 }, { sem: "Sem 3", avg: 3.22 },
  { sem: "Sem 4", avg: 3.15 }, { sem: "Sem 5", avg: 3.21 }, { sem: "Sem 6", avg: 3.24 },
];

export default function LaporanDetail() {
  const { id } = useParams();
  const [showApprove, setShowApprove] = useState(false);
  const [showRevisi, setShowRevisi] = useState(false);
  const [revisiNote, setRevisiNote] = useState("");
  const [approved, setApproved] = useState(false);
  const [checked, setChecked] = useState(false);
  const role = "admin"; // could be "warek" in real app

  const isApproved = approved || id === "1";
  const isPending = id === "2";

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/laporan" className="hover:text-gray-700 flex items-center gap-1">
          <ChevronLeft size={15} /> Laporan Semester
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-500">Detail Laporan</span>
      </div>

      {/* Formal report document */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Pending watermark */}
        {!isApproved && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-5 py-2.5 flex items-center justify-center gap-2">
            <span className="text-xs font-600 text-yellow-700 flex items-center justify-center gap-1"><Clock size={14} /> Menunggu Persetujuan Warek III</span>
          </div>
        )}

        <div className="p-8">
          {/* Double border formal letter wrapper */}
          <div className="border-2 border-[#263F93] rounded-xl p-1">
            <div className="border border-[#263F93] rounded-lg p-8 space-y-6">

              {/* Kop surat */}
              <div className="flex items-center gap-4 border-b-2 border-[#263F93] pb-5 mb-6">
                <img src={logoItg} alt="Logo ITG" className="h-16 w-16 object-contain" />
                <div className="flex-1 text-center">
                  <p className="text-sm font-semibold">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
                  <p className="font-bold text-base uppercase tracking-wide">INSTITUT TEKNOLOGI GARUT</p>
                  <p className="text-xs text-gray-600">Jl. Mayor Syamsu No. 1, Jayaraga, Garut 44151</p>
                  <p className="text-xs text-gray-600">Telp. (0262) 2800433 | www.itg.ac.id</p>
                </div>
              </div>

              {/* Nomor, tanggal, perihal */}
              <div className="grid grid-cols-[120px_8px_1fr] gap-y-1.5 text-sm mb-6">
                <span className="text-gray-600">Nomor</span><span>:</span><span>045/BKKH-ITG/VIII/2026</span>
                <span className="text-gray-600">Tanggal</span><span>:</span><span>17 Agustus 2026</span>
                <span className="text-gray-600">Perihal</span><span>:</span><span className="font-semibold">Laporan Perkembangan Mahasiswa KIP-K</span>
                <span className="text-gray-600">Kepada Yth.</span><span>:</span><span>Wakil Rektor III ITG</span>
              </div>

              {/* Summary cards */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-3">I. Ringkasan Data Mahasiswa KIP-K</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Total Mahasiswa", val: "167", color: "#263F93" },
                    { label: "Mahasiswa Reguler", val: "102 (61%)", color: "#059669" },
                    { label: "Mahasiswa Aspirasi", val: "65 (39%)", color: "#7C3AED" },
                    { label: "Rata-rata IPK", val: "3.24", color: "#D4A72C" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="rounded-xl p-3 border-l-4" style={{ borderColor: color, background: "#F8FAFC" }}>
                      <div className="font-bold text-lg" style={{ color }}>{val}</div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-2">Sebaran per Angkatan</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={angkatanStats} margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="angkatan" tick={{ fontSize: 10, fill: "#94A3B8" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Bar dataKey="reguler" stackId="a" fill="#263F93" name="Reguler" />
                      <Bar dataKey="aspirasi" stackId="a" fill="#D4A72C" name="Aspirasi" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-2">Tren Rata-rata IPK</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={ipkTrend} margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="sem" tick={{ fontSize: 10, fill: "#94A3B8" }} />
                      <YAxis domain={[3.0, 3.4]} tick={{ fontSize: 10, fill: "#94A3B8" }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Line type="monotone" dataKey="avg" stroke="#263F93" strokeWidth={2.5} dot={{ fill: "#263F93", r: 3 }} name="IPK Avg" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data table */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-3">II. Data Mahasiswa</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-[#E2E8F0]">
                    <thead>
                      <tr style={{ background: "#F8FAFC" }} className="border-b border-[#E2E8F0]">
                        {["NIM", "Nama", "Prodi", "IPK", "Prestasi", "Org.", "SP", "Catatan"].map(h => (
                          <th key={h} className="text-left px-3 py-2 font-semibold text-gray-500 border-r border-[#E2E8F0] last:border-r-0">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {mahasiswaList.slice(0, 6).map(m => (
                        <tr key={m.id} className={m.ipk < 3.0 ? "bg-red-50/30" : ""}>
                          <td className="px-3 py-2 font-mono text-gray-500 border-r border-[#E2E8F0]">{m.nim.slice(-6)}</td>
                          <td className="px-3 py-2 font-medium text-gray-800 border-r border-[#E2E8F0]">{m.nama}</td>
                          <td className="px-3 py-2 text-gray-500 border-r border-[#E2E8F0]">{m.prodi.replace("Teknik ", "T.")}</td>
                          <td className="px-3 py-2 font-semibold border-r border-[#E2E8F0]" style={{ color: m.ipk >= 3.0 ? "#059669" : "#DC2626" }}>{m.ipk}</td>
                          <td className="px-3 py-2 text-gray-500 border-r border-[#E2E8F0]">2</td>
                          <td className="px-3 py-2 text-gray-500 border-r border-[#E2E8F0]">1</td>
                          <td className="px-3 py-2 border-r border-[#E2E8F0]">{m.sp ? <span className="text-red-600 font-semibold">{m.sp}</span> : "—"}</td>
                          <td className="px-3 py-2 text-gray-400">{m.ipk < 3.0 ? "Perlu perhatian" : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 mt-10 text-sm text-center">
                <div>
                  <p>Garut, 17 Agustus 2026</p>
                  <p className="font-medium">Pengelola KIP-K</p>
                  {isApproved ? (
                    <div className="w-20 h-16 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center mx-auto my-2">
                      <QrCode size={28} className="text-[#263F93]" />
                    </div>
                  ) : (
                    <div className="h-16" />
                  )}
                  <p className="font-bold underline">Encep Jianul Hayat, S.T., M.T.</p>
                  <p className="text-xs text-gray-500">NIP. 197804202006041001</p>
                </div>
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-medium">Wakil Rektor</p>
                  {isApproved ? (
                    <div className="w-20 h-16 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center mx-auto my-2">
                      <QrCode size={28} className="text-green-600" />
                    </div>
                  ) : (
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-xs text-yellow-600 border border-dashed border-yellow-300 rounded px-2 py-1">Menunggu Approval</span>
                    </div>
                  )}
                  <p className="font-bold underline">Dr. Rina Kurniawati, S.E., M.Si.</p>
                  <p className="text-xs text-gray-500">NIP. 198203152008012002</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-4 bg-white rounded-xl shadow-lg border border-gray-200 px-5 py-4 flex flex-wrap items-center gap-3">
        {isApproved ? (
          <>
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-500">
              <CheckCircle size={15} /> Laporan Disetujui — 20 Agustus 2026
            </span>
            <div className="flex-1" />
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Printer size={14} /> Cetak
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 text-white" style={{ background: "#263F93" }}>
              <Download size={14} /> Download PDF
            </button>
          </>
        ) : role === "admin" ? (
          <>
            <span className="text-sm text-yellow-600 font-500 flex items-center gap-1"><Clock size={14} /> Menunggu persetujuan Warek III</span>
            <div className="flex-1" />
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Printer size={14} /> Cetak
            </button>
          </>
        ) : (
          <>
            <div className="flex-1" />
            <button onClick={() => setShowRevisi(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 border border-orange-200 text-orange-600 hover:bg-orange-50">
              <RotateCcw size={14} /> Kembalikan untuk Revisi
            </button>
            <button onClick={() => setShowApprove(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-700 text-white"
              style={{ background: "#059669" }}>
              <CheckCircle size={15} /> Setujui Laporan
            </button>
          </>
        )}
      </div>

      {/* Approve Modal */}
      {showApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 text-center mb-3">Setujui Laporan?</h3>
            <label className="flex items-start gap-2 mb-5 cursor-pointer">
              <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="mt-0.5 accent-[#059669]" />
              <span className="text-xs text-gray-600">Saya telah membaca dan menyetujui isi laporan ini. Tanda tangan digital akan diterapkan.</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setShowApprove(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Batal</button>
              <button disabled={!checked} onClick={() => { setShowApprove(false); setApproved(true); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white disabled:opacity-40"
                style={{ background: "#059669" }}>
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revisi Modal */}
      {showRevisi && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-display font-700 text-lg text-gray-900 mb-3">Kembalikan untuk Revisi</h3>
            <textarea value={revisiNote} onChange={e => setRevisiNote(e.target.value)} rows={4}
              placeholder="Catatan revisi untuk Admin..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowRevisi(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Batal</button>
              <button onClick={() => setShowRevisi(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white"
                style={{ background: "#D97706" }}>
                Kirim Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
