import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Plus, Search, Clock } from "lucide-react";
import { spList } from "../../data/mockData";

const levelColor: Record<string, { bg: string; text: string; badge: string }> = {
  SP1: { bg: "#FEF3C7", text: "#92400E", badge: "#F59E0B" },
  SP2: { bg: "#FEE2E2", text: "#991B1B", badge: "#EF4444" },
  SP3: { bg: "#7F1D1D", text: "#FEE2E2", badge: "#7F1D1D" },
};

const statusStyle: Record<string, string> = {
  "Aktif": "bg-yellow-100 text-yellow-700",
  "Masa Tenggang": "bg-orange-100 text-orange-700",
  "Pemberhentian": "bg-red-100 text-red-700",
  "Selesai": "bg-green-100 text-green-700",
};

export default function SPList() {
  const [search, setSearch] = useState("");

  const filtered = spList.filter(s => {
    const q = search.toLowerCase();
    return s.nama.toLowerCase().includes(q) || s.nim.includes(q);
  });

  const counts = {
    sp1: spList.filter(s => s.level === "SP1" && s.status !== "Selesai").length,
    sp2: spList.filter(s => s.level === "SP2" && s.status !== "Selesai").length,
    sp3: spList.filter(s => s.level === "SP3").length,
    selesai: spList.filter(s => s.status === "Selesai").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Surat Peringatan</h1>
          <p className="text-gray-500 text-sm mt-0.5">Daftar dan riwayat penerbitan SP mahasiswa KIP-K</p>
        </div>
        <Link to="/admin/sp/terbitkan"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-500 text-white"
          style={{ background: "#DC2626" }}>
          <Plus size={15} /> Terbitkan SP Baru
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "SP1 Aktif", value: counts.sp1, color: "#F59E0B" },
          { label: "SP2 Aktif", value: counts.sp2, color: "#EF4444" },
          { label: "SP3 (Diberhentikan)", value: counts.sp3, color: "#7F1D1D" },
          { label: "SP Selesai (Dipulihkan)", value: counts.selesai, color: "#059669" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-3 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
            <div>
              <div className="font-display font-700 text-2xl text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari NIM atau Nama..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["NIM", "Nama", "Prodi", "Tingkat SP", "Alasan", "Tgl. Terbit", "Batas Evaluasi", "Status", "Aksi"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(sp => {
                const lc = levelColor[sp.level];
                return (
                  <tr key={sp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{sp.nim.slice(-8)}</td>
                    <td className="px-4 py-3 font-500 text-gray-800">{sp.nama}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{sp.prodi.replace("Teknik ", "T.")}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-700"
                        style={{ background: lc.bg, color: lc.text }}>
                        {sp.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-40 truncate">{sp.alasan}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{sp.tanggalTerbit}</td>
                    <td className="px-4 py-3">
                      {sp.batasEvaluasi !== "-" ? (
                        <div>
                          <div className="text-xs text-gray-600">{sp.batasEvaluasi}</div>
                          {sp.sisa > 0 && (
                            <div className="flex items-center gap-1 text-xs text-orange-500 mt-0.5">
                              <Clock size={10} /> Sisa {sp.sisa} hari
                            </div>
                          )}
                        </div>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-500 ${statusStyle[sp.status] || "bg-gray-100 text-gray-600"}`}>
                        {sp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/sp/${sp.id}`} className="text-xs text-[#263F93] hover:underline font-500">Detail</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <AlertTriangle size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">Tidak ada data sesuai filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
