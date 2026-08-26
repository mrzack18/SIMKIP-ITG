import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle } from "lucide-react";

interface Laporan {
  id: number;
  judul: string;
  nomor: string;
  periode: string;
  tanggal: string;
  summary: string;
  status: "Diterima";
}

const DATA: Laporan[] = [
  { id: 1, judul: "Laporan Evaluasi Semester Genap 2025/2026", nomor: "024/LAP/ITG/VIII/2026", periode: "Semester Genap 2025/2026", tanggal: "10 Agustus 2026", summary: "167 mahasiswa, rata-rata IPK 3.18, 3 SP aktif", status: "Diterima" },
  { id: 3, judul: "Laporan Evaluasi Semester Genap 2024/2025 — Teknik Informatika", nomor: "012/LAP/ITG/VIII/2025", periode: "Semester Genap 2024/2025", tanggal: "15 Agustus 2025", summary: "48 mahasiswa, rata-rata IPK 3.29", status: "Diterima" },
  { id: 4, judul: "Laporan Evaluasi Semester Ganjil 2024/2025", nomor: "006/LAP/ITG/II/2025", periode: "Semester Ganjil 2024/2025", tanggal: "3 Februari 2025", summary: "142 mahasiswa, rata-rata IPK 3.15", status: "Diterima" },
];

export default function ProdiLaporanList() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Laporan Evaluasi Semester</h1>
        <p className="text-gray-500 text-sm mt-0.5">Laporan monitoring mahasiswa KIP-K dari Pengelola</p>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {DATA.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Tidak ada laporan yang diterima.</p>
          </div>
        )}
        {DATA.map(r => (
          <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
                <FileText size={22} className="text-[#263F93]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-600 text-gray-800">{r.judul}</h3>
                  <span className="px-2 py-0.5 rounded text-xs font-500 flex items-center gap-1 bg-green-100 text-green-700">
                    <CheckCircle size={13} className="text-green-500" /> {r.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{r.nomor}</p>
                <p className="text-xs text-gray-500 mt-1">{r.periode} · Diterima: {r.tanggal}</p>
                <p className="text-xs text-gray-500 mt-1">{r.summary}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link to={`/prodi/laporan/${r.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-500 text-[#263F93] border border-[#263F93]/30 hover:bg-blue-50 text-center transition-colors">
                  Lihat Detail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
