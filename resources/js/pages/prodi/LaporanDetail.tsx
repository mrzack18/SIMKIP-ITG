import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import logoItg from "@/imports/logo_itg.jpg";

const REPORT = {
  judul: "Laporan Evaluasi Semester Genap 2025/2026",
  nomor: "024/LAP/ITG/VIII/2026",
  periode: "Semester Genap 2025/2026",
  tanggal: "10 Agustus 2026",
  totalMahasiswa: 167,
  rataIPK: 3.18,
  spAktif: 3,
  bebas: 12,
};

const distribusiIPK = [
  { range: "< 2.5", jml: 4 },
  { range: "2.5–2.9", jml: 18 },
  { range: "3.0–3.4", jml: 72 },
  { range: "3.5–3.9", jml: 61 },
  { range: "4.0", jml: 12 },
];

const mahasiswaSample = [
  { nim: "2206001", nama: "Ahmad Rifaldi", prodi: "TI", ipk: 3.35, status: "Aktif" },
  { nim: "2206015", nama: "Budi Setiawan", prodi: "TI", ipk: 2.85, status: "SP1" },
  { nim: "2106003", nama: "Rizky Pratama", prodi: "TI", ipk: 3.55, status: "Aktif" },
  { nim: "2306005", nama: "Eka Saputra", prodi: "TI", ipk: 3.42, status: "Aktif" },
];

export default function ProdiLaporanDetail() {
  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center gap-3">
        <Link to="/prodi/laporan" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
      </div>

      {/* Formal document */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 font-serif max-w-3xl mx-auto">
          {/* Letterhead */}
          <div className="flex items-center gap-5 border-b-2 border-gray-800 pb-5 mb-6">
            <img src={logoItg} alt="ITG" className="w-20 h-20 object-contain flex-shrink-0" />
            <div className="text-center flex-1">
              <p className="font-bold text-base text-gray-800 uppercase">Institut Teknologi Garut</p>
              <p className="text-xs text-gray-600">Biro Kemahasiswaan dan Alumni</p>
              <p className="text-xs text-gray-500">Jl. Mayor Syamsu No.1, Garut 44151 · Telp. (0262) 540895</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="font-bold text-base text-gray-800 uppercase underline">LAPORAN EVALUASI KIP-K</p>
            <p className="text-xs text-gray-500 mt-1">Nomor: {REPORT.nomor}</p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Mahasiswa", val: REPORT.totalMahasiswa },
              { label: "Rata-rata IPK", val: REPORT.rataIPK.toFixed(2) },
              { label: "SP Aktif", val: REPORT.spAktif },
              { label: "Surat Penyelesaian", val: REPORT.bebas },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="font-display font-700 text-2xl text-[#263F93]">{s.val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="mb-6">
            <p className="font-bold text-sm text-gray-700 mb-3">Distribusi IPK Mahasiswa</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={distribusiIPK}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="jml" fill="#263F93" radius={[3, 3, 0, 0]} name="Mahasiswa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sample table */}
          <div className="mb-8">
            <p className="font-bold text-sm text-gray-700 mb-3">Data Mahasiswa (Sample)</p>
            <table className="w-full text-xs border border-gray-200">
              <thead className="bg-gray-50">
                <tr>{["NIM", "Nama", "Prodi", "IPK", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-600 text-gray-600 border-b border-gray-200">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mahasiswaSample.map(m => (
                  <tr key={m.nim}>
                    <td className="px-3 py-2 font-mono text-gray-500">{m.nim}</td>
                    <td className="px-3 py-2 text-gray-700">{m.nama}</td>
                    <td className="px-3 py-2 text-gray-500">{m.prodi}</td>
                    <td className="px-3 py-2 font-700 text-gray-800">{m.ipk.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-500 ${m.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature section */}
          <div className="border-t border-gray-200 pt-6">
            <p className="font-bold text-sm text-gray-700 mb-4">Tanda Tangan</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">Biro Kemahasiswaan</p>
                <div className="h-20 border border-green-200 rounded-xl bg-green-50 flex flex-col items-center justify-center gap-1">
                  <CheckCircle size={20} className="text-green-500" />
                  <p className="text-xs text-green-700 font-500">Sudah Ditandatangani</p>
                  <p className="text-xs text-gray-400">10 Agu 2026</p>
                </div>
                <p className="text-xs font-bold text-gray-700 mt-2">Encep Jianul Hayat, S.T., M.T.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-3 shadow-lg">
        <div className="flex-1" />
        <Link to="/prodi/laporan" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-500 text-gray-600 hover:bg-gray-50">
          <ArrowLeft size={14} /> Kembali
        </Link>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-500 text-white bg-[#263F93] hover:bg-[#1e3276]">
          <Download size={14} /> Download PDF
        </button>
      </div>
    </div>
  );
}
