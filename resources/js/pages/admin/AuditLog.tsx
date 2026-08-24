import { useState } from "react";
import { Search, Download, X, CircleDot } from "lucide-react";

interface LogEntry {
  id: number;
  waktu: string;
  jenis: "SP" | "Validasi" | "Hapus" | "Approve" | "Login" | "Ubah";
  aktivitas: string;
  deskripsi: string;
  terkaitNIM: string;
  terkaitNama: string;
  dilakukanOleh: string;
  ip: string;
}

const logs: LogEntry[] = [
  { id: 1, waktu: "2026-08-17T09:32:00", jenis: "SP", aktivitas: "Terbitkan SP1", deskripsi: "SP1 diterbitkan untuk NIM 55201002 karena IPK di bawah standar (2.78)", terkaitNIM: "55201002", terkaitNama: "Sari Dewi Lestari", dilakukanOleh: "Admin Encep", ip: "192.168.1.101" },
  { id: 2, waktu: "2026-08-17T09:15:00", jenis: "Validasi", aktivitas: "Approve Dokumen", deskripsi: "PKKMB", terkaitNIM: "55201008", terkaitNama: "Hesti Rahayu", dilakukanOleh: "Admin Encep", ip: "192.168.1.101" },
  { id: 3, waktu: "2026-08-17T08:45:00", jenis: "Validasi", aktivitas: "Tolak Dokumen", deskripsi: "Laporan KP NIM 55201001 ditolak: file buram", terkaitNIM: "55201001", terkaitNama: "Ahmad Rifaldi", dilakukanOleh: "Admin Encep", ip: "192.168.1.101" },
  { id: 4, waktu: "2026-08-16T16:20:00", jenis: "Approve", aktivitas: "Approve Surat Penyelesaian", deskripsi: "Surat Penyelesaian NIM 55201011 disetujui, PDF diterbitkan", terkaitNIM: "55201011", terkaitNama: "Krisna Bayu", dilakukanOleh: "Admin Encep", ip: "192.168.1.101" },
  { id: 5, waktu: "2026-08-16T14:05:00", jenis: "Hapus", aktivitas: "Hapus Data", deskripsi: "Data mahasiswa NIM 55201099 dihapus permanen", terkaitNIM: "55201099", terkaitNama: "Budi Test", dilakukanOleh: "Admin Encep", ip: "192.168.1.101" },
  { id: 6, waktu: "2026-08-16T10:30:00", jenis: "Login", aktivitas: "Login Sistem", deskripsi: "Admin berhasil login ke sistem", terkaitNIM: "—", terkaitNama: "—", dilakukanOleh: "Admin Encep", ip: "192.168.1.101" },
  { id: 7, waktu: "2026-08-15T15:45:00", jenis: "Ubah", aktivitas: "Ubah Konfigurasi", deskripsi: "Threshold IPK diubah dari 2.75 ke 3.0", terkaitNIM: "—", terkaitNama: "—", dilakukanOleh: "Admin Encep", ip: "192.168.1.101" },
  { id: 8, waktu: "2026-08-15T11:00:00", jenis: "SP", aktivitas: "Terbitkan SP2", deskripsi: "SP2 diterbitkan untuk NIM 55201007 (eskalasi dari SP1)", terkaitNIM: "55201007", terkaitNama: "Gunawan Prakoso", dilakukanOleh: "Admin Encep", ip: "192.168.1.102" },
  { id: 9, waktu: "2026-08-14T09:20:00", jenis: "Validasi", aktivitas: "Approve Dokumen", deskripsi: "Sertifikat PKKMB NIM 55201006 disetujui", terkaitNIM: "55201006", terkaitNama: "Fitriyani Hasanah", dilakukanOleh: "Admin Encep", ip: "192.168.1.101" },
  { id: 10, waktu: "2026-08-13T13:15:00", jenis: "Approve", aktivitas: "Approve Laporan", deskripsi: "Laporan Semester Genap 2025/2026 disetujui Warek III", terkaitNIM: "—", terkaitNama: "—", dilakukanOleh: "Warek III", ip: "10.0.0.55" },
];

const jenisStyle: Record<string, { border: string; badge: string; label: string; icon: React.ReactNode }> = {
  SP: { border: "border-l-red-500", badge: "bg-red-100 text-red-700", label: "SP", icon: <CircleDot size={12} className="text-red-500" /> },
  Validasi: { border: "border-l-green-500", badge: "bg-green-100 text-green-700", label: "Validasi", icon: <CircleDot size={12} className="text-green-500" /> },
  Hapus: { border: "border-l-red-900", badge: "bg-red-200 text-red-900", label: "Hapus Data", icon: <CircleDot size={12} className="text-red-900" /> },
  Approve: { border: "border-l-blue-500", badge: "bg-blue-100 text-blue-700", label: "Approve", icon: <CircleDot size={12} className="text-blue-500" /> },
  Login: { border: "border-l-gray-400", badge: "bg-gray-100 text-gray-600", label: "Login", icon: <CircleDot size={12} className="text-gray-400" /> },
  Ubah: { border: "border-l-yellow-500", badge: "bg-yellow-100 text-yellow-700", label: "Perubahan", icon: <CircleDot size={12} className="text-yellow-500" /> },
};

const relativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} hari yang lalu`;
  if (hours > 0) return `${hours} jam yang lalu`;
  return "Baru saja";
};

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [olehFilter, setOlehFilter] = useState("Semua");
  const [detail, setDetail] = useState<LogEntry | null>(null);

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    return (
      (jenisFilter === "Semua" || l.jenis === jenisFilter) &&
      (olehFilter === "Semua" || l.dilakukanOleh === olehFilter) &&
      (l.deskripsi.toLowerCase().includes(q) || l.terkaitNIM.includes(q) || l.terkaitNama.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Riwayat Aktivitas Sistem</h1>
          <p className="text-gray-500 text-sm mt-0.5">Audit log lengkap untuk keperluan BPK/Inspektorat</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Download size={15} /> Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari NIM, nama, atau deskripsi..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20" />
        </div>
        <select value={jenisFilter} onChange={e => setJenisFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600">
          {["Semua", "SP", "Validasi", "Hapus", "Approve", "Login", "Ubah"].map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={olehFilter} onChange={e => setOlehFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-600">
          {["Semua", "Admin Encep", "Warek III"].map(o => <option key={o}>{o}</option>)}
        </select>
        <input type="date" className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500" />
        <span className="text-gray-300 self-center hidden sm:block">—</span>
        <input type="date" className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500" />
      </div>

      {/* Log table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Waktu", "Aktivitas", "Deskripsi", "Terkait Mahasiswa", "Dilakukan Oleh", "IP Address"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(l => {
                const js = jenisStyle[l.jenis];
                return (
                  <tr key={l.id}
                    onClick={() => setDetail(l)}
                    className={`hover:bg-gray-50/60 cursor-pointer transition-colors border-l-4 ${js.border}`}>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-600 whitespace-nowrap group relative">
                        {relativeTime(l.waktu)}
                        <div className="absolute left-0 top-5 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                          {new Date(l.waktu).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-500 ${js.badge}`}>
                        <span className="flex items-center gap-1.5">{js.icon} {l.aktivitas}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-48 truncate">{l.deskripsi}</td>
                    <td className="px-4 py-3">
                      {l.terkaitNIM !== "—" ? (
                        <div>
                          <div className="font-mono text-xs text-gray-600">{l.terkaitNIM}</div>
                          <div className="text-xs text-gray-400">{l.terkaitNama}</div>
                        </div>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{l.dilakukanOleh}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{l.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Menampilkan {filtered.length} dari {logs.length} entri</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">‹</button>
            <button className="px-2 py-1 rounded border border-[#263F93] bg-[#263F93] text-white">1</button>
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-600 ${jenisStyle[detail.jenis].badge}`}>
                  <span className="flex items-center gap-1.5">{jenisStyle[detail.jenis].icon} {detail.aktivitas}</span>
                </span>
              </div>
              <button onClick={() => setDetail(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Waktu</span>
                  <span className="font-500 text-gray-800">{new Date(detail.waktu).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dilakukan Oleh</span>
                  <span className="font-500 text-gray-800">{detail.dilakukanOleh}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IP Address</span>
                  <span className="font-mono text-gray-600">{detail.ip}</span>
                </div>
                {detail.terkaitNIM !== "—" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">NIM Terkait</span>
                      <span className="font-mono text-gray-800">{detail.terkaitNIM}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nama Terkait</span>
                      <span className="font-500 text-gray-800">{detail.terkaitNama}</span>
                    </div>
                  </>
                )}
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Deskripsi Lengkap</span>
                <p className="mt-1 text-gray-700 leading-relaxed">{detail.deskripsi}</p>
              </div>
            </div>

            <button onClick={() => setDetail(null)}
              className="mt-5 w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
