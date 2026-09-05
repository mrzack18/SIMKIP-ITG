import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, TrendingUp, ArrowRight, BookOpen } from "lucide-react";
import { getProdiDashboardData, ProdiDashboardResponse } from "@/services/dashboardService";
import { useAuth } from "@/context/AuthContext";
import logoItg from "@/imports/logo_itg.jpg";

export default function ProdiDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<ProdiDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProdiDashboardData()
      .then((res) => { if (active) setData(res); })
      .catch((err) => console.error("Prodi dashboard error", err))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const prodiNama = data?.prodi?.nama ?? user?.prodi ?? "Program Studi";


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#263F93]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 min-w-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <img src={logoItg} alt="ITG Logo" className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 object-contain rounded-lg shadow-sm border border-gray-100" />
          <div className="min-w-0">
            <h1 className="font-bold text-xl sm:text-2xl text-[#263F93] leading-tight break-words">
              Selamat datang, {user?.nama ?? "Ketua Prodi"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#D4A72C] text-[#263F93] truncate">
            {prodiNama}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-5 min-w-0">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-[#263F93]/10 flex items-center justify-center">
              <Users size={18} className="text-[#263F93]" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight break-words">
              Total Mahasiswa<br />KIP-K Aktif
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#263F93]">{data?.stats?.total_aktif ?? 0}</p>
          <span className="inline-block max-w-full truncate mt-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            {prodiNama}
          </span>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-5 min-w-0">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight break-words">KIP-K Reguler</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#263F93]">{data?.stats?.reguler ?? 0}</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-5 min-w-0">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-purple-50 flex items-center justify-center">
              <BookOpen size={18} className="text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight break-words">KIP-K Aspirasi</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#263F93]">{data?.stats?.aspirasi ?? 0}</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-5 min-w-0">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight break-words">Rata-rata IPK</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#263F93]">{Number(data?.stats?.rata_ipk ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-5 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
            <h2 className="font-600 text-gray-800 text-sm truncate">Sebaran per Angkatan</h2>
            <span className="text-xs text-gray-400 truncate shrink-0">{prodiNama}</span>
          </div>
          {(data?.sebaran_angkatan?.length ?? 0) === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-gray-400 px-4 text-center">Tidak ada data angkatan.</div>
          ) : (
            <div className="w-full h-[220px] sm:h-[240px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.sebaran_angkatan ?? []} barCategoryGap="30%" margin={{ left: -12, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} minTickGap={4} />
                <YAxis width={28} tick={{ fontSize: 11, fill: "#94A3B8" }} />
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
                <Bar dataKey="Aspirasi" stackId="a" fill="#D4A72C" name="Aspirasi" />
                <Bar dataKey="Dicabut" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]} name="Dicabut" />
              </BarChart>
            </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-5 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
            <h2 className="font-600 text-gray-800 text-sm truncate">Tren Rata-rata IPK per Semester</h2>
            <span className="text-xs text-gray-400 truncate shrink-0">{prodiNama}</span>
          </div>
          {(data?.trend_ipk?.length ?? 0) === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-400 px-4 text-center">Belum ada data IPK.</div>
          ) : (
            <div className="w-full h-[200px] sm:h-[220px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.trend_ipk ?? []} margin={{ left: -14, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="sem" tick={{ fontSize: 11, fill: "#94A3B8" }} minTickGap={4} />
                <YAxis domain={[2.8, 3.5]} width={32} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={((v: number | undefined) => [(v ?? 0).toFixed(2), "Rata-rata IPK"]) as any} />
                <Line type="monotone" dataKey="ipk" stroke="#D4A72C" strokeWidth={2.5} dot={{ r: 4, fill: "#D4A72C" }} />
              </LineChart>
            </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Quick lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between gap-2 min-w-0">
            <h2 className="font-600 text-gray-800 text-sm truncate">Mahasiswa dengan SP Aktif</h2>
            <Link to="/prodi/mahasiswa" className="text-xs text-[#263F93] hover:underline flex items-center gap-1 shrink-0">Lihat Semua <ArrowRight size={12} /></Link>
          </div>
          {(data?.sp_mahasiswa?.length ?? 0) === 0 ? (
            <div className="px-4 sm:px-5 py-8 text-center text-sm text-gray-400">Tidak ada mahasiswa dengan SP aktif</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead><tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500 whitespace-nowrap">NIM / Nama</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500 whitespace-nowrap">SP</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500 whitespace-nowrap">Alasan</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data?.sp_mahasiswa?.map(m => (
                  <tr key={m.nim} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 min-w-[140px]">
                      <p className="font-500 text-gray-800 text-xs break-words">{m.nama}</p>
                      <p className="text-gray-400 text-xs font-mono">{m.nim}</p>
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-500 whitespace-nowrap">{m.sp}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500 break-words min-w-[140px]">{m.alasan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between gap-2 min-w-0">
            <h2 className="font-600 text-gray-800 text-sm truncate">Mahasiswa Semester ≥ 7</h2>
            <Link to="/prodi/mahasiswa" className="text-xs text-[#263F93] hover:underline flex items-center gap-1 shrink-0">Lihat Semua <ArrowRight size={12} /></Link>
          </div>
          {(data?.semester_7plus?.length ?? 0) === 0 ? (
            <div className="px-4 sm:px-5 py-8 text-center text-sm text-gray-400">Belum ada mahasiswa semester ≥ 7</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead><tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500 whitespace-nowrap">NIM / Nama</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500 whitespace-nowrap">Sem</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500 whitespace-nowrap">IPK</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data?.semester_7plus?.map(m => (
                  <tr key={m.nim} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 min-w-[140px]">
                      <p className="font-500 text-gray-800 text-xs break-words">{m.nama}</p>
                      <p className="text-gray-400 text-xs font-mono">{m.nim}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-500 whitespace-nowrap">{m.sem}</td>
                    <td className="px-4 py-3">
                      {m.ipk !== null ? (
                        <span className={`font-700 font-display text-sm whitespace-nowrap ${m.ipk >= 3.0 ? "text-green-600" : "text-red-500"}`}>{m.ipk.toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}