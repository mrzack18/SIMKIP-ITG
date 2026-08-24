import { Link } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, TrendingUp, ArrowRight } from "lucide-react";

const angkatanData = [
  { name: "2022", Reguler: 14, Aspirasi: 8 },
  { name: "2023", Reguler: 12, Aspirasi: 7 },
  { name: "2024", Reguler: 10, Aspirasi: 5 },
  { name: "2025", Reguler: 8,  Aspirasi: 4 },
  { name: "2026", Reguler: 5,  Aspirasi: 3 },
];

const trendData = [
  { sem: "Sem 1", ipk: 3.05 },
  { sem: "Sem 2", ipk: 3.12 },
  { sem: "Sem 3", ipk: 3.08 },
  { sem: "Sem 4", ipk: 3.15 },
  { sem: "Sem 5", ipk: 3.20 },
  { sem: "Sem 6", ipk: 3.18 },
];

const spMahasiswa = [
  { nim: "2206015", nama: "Budi Setiawan", sp: "SP1", alasan: "IPK < 3.0 (2.85)" },
  { nim: "2206033", nama: "Citra Dewi", sp: "SP1", alasan: "IPK < 3.0 (2.78)" },
];

const semester7plus = [
  { nim: "2006001", nama: "Ahmad Hidayat", sem: 8, ipk: 3.42 },
  { nim: "2006007", nama: "Siti Nurhaliza", sem: 8, ipk: 3.28 },
  { nim: "2106003", nama: "Rizky Pratama", sem: 7, ipk: 3.55 },
];

export default function ProdiDashboard() {
  const stats = [
    { label: "Mahasiswa KIP-K Aktif (TI)", value: "42", icon: <Users size={20} className="text-[#263F93]" />, color: "text-[#263F93]" },
    { label: "Reguler", value: "28", icon: <Users size={20} className="text-blue-500" />, color: "text-blue-600" },
    { label: "Aspirasi", value: "14", icon: <Users size={20} className="text-purple-500" />, color: "text-purple-600" },
    { label: "Rata-rata IPK", value: "3.18", icon: <TrendingUp size={20} className="text-green-500" />, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Dashboard — Teknik Informatika</h1>
        <p className="text-gray-500 text-sm mt-0.5">Pantau perkembangan mahasiswa KIP-K di program studi Anda (read-only)</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-gray-500">{s.label}</span></div>
            <div className={`font-display font-700 text-3xl ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-600 text-gray-800 text-sm">Sebaran per Angkatan</h2>
            <span className="text-xs text-gray-400">Teknik Informatika</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={angkatanData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#E2E8F0" }}
                formatter={(value: number, name: string) => [value, name]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                formatter={(value: string) => (
                  <span style={{ color: "#64748B" }}>{value}</span>
                )}
              />
              <Bar dataKey="Reguler" stackId="a" fill="#263F93" name="Reguler" />
              <Bar dataKey="Aspirasi" stackId="a" fill="#D4A72C" radius={[4, 4, 0, 0]} name="Aspirasi" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-600 text-gray-800 text-sm">Tren Rata-rata IPK per Semester</h2>
            <span className="text-xs text-gray-400">Teknik Informatika</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="sem" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis domain={[2.8, 3.5]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={((v: number | undefined) => [(v ?? 0).toFixed(2), "Rata-rata IPK"]) as any} />
              <Line type="monotone" dataKey="ipk" stroke="#D4A72C" strokeWidth={2.5} dot={{ r: 4, fill: "#D4A72C" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-600 text-gray-800 text-sm">Mahasiswa dengan SP Aktif</h2>
            <Link to="/prodi/mahasiswa" className="text-xs text-[#263F93] hover:underline flex items-center gap-1">Lihat Semua <ArrowRight size={12} /></Link>
          </div>
          {spMahasiswa.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Tidak ada mahasiswa dengan SP aktif</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">NIM / Nama</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">SP</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">Alasan</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {spMahasiswa.map(m => (
                  <tr key={m.nim} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <p className="font-500 text-gray-800 text-xs">{m.nama}</p>
                      <p className="text-gray-400 text-xs">{m.nim}</p>
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-500">{m.sp}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{m.alasan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-600 text-gray-800 text-sm">Mahasiswa Semester ≥ 7</h2>
            <Link to="/prodi/mahasiswa" className="text-xs text-[#263F93] hover:underline flex items-center gap-1">Lihat Semua <ArrowRight size={12} /></Link>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50">
              <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">NIM / Nama</th>
              <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">Sem</th>
              <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">IPK</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {semester7plus.map(m => (
                <tr key={m.nim} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <p className="font-500 text-gray-800 text-xs">{m.nama}</p>
                    <p className="text-gray-400 text-xs">{m.nim}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-500">{m.sem}</td>
                  <td className="px-4 py-3">
                    <span className={`font-700 font-display text-sm ${m.ipk >= 3.0 ? "text-green-600" : "text-red-500"}`}>{m.ipk.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
