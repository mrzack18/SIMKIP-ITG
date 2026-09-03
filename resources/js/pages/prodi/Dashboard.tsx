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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img src={logoItg} alt="ITG Logo" className="h-12 w-12 object-contain rounded-lg shadow-sm border border-gray-100" />
          <div>
            <h1 className="font-bold text-2xl text-[#263F93]">
              Selamat datang, {user?.nama ?? "Ketua Prodi"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[#D4A72C] text-[#263F93]">
            {prodiNama}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center">
              <Users size={18} className="text-[#263F93]" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight">
              Total Mahasiswa<br />KIP-K Aktif
            </p>
          </div>
          <p className="text-3xl font-bold text-[#263F93]">{data?.stats?.total_aktif ?? 0}</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            {prodiNama}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight">KIP-K Reguler</p>
          </div>
          <p className="text-3xl font-bold text-[#263F93]">{data?.stats?.reguler ?? 0}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <BookOpen size={18} className="text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight">KIP-K Aspirasi</p>
          </div>
          <p className="text-3xl font-bold text-[#263F93]">{data?.stats?.aspirasi ?? 0}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight">Rata-rata IPK</p>
          </div>
          <p className="text-3xl font-bold text-[#263F93]">{Number(data?.stats?.rata_ipk ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-600 text-gray-800 text-sm">Sebaran per Angkatan</h2>
            <span className="text-xs text-gray-400">{prodiNama}</span>
          </div>
          {(data?.sebaran_angkatan?.length ?? 0) === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">Tidak ada data angkatan.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.sebaran_angkatan ?? []} barCategoryGap="30%">
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
                <Bar dataKey="Aspirasi" stackId="a" fill="#D4A72C" name="Aspirasi" />
                <Bar dataKey="Dicabut" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]} name="Dicabut" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-600 text-gray-800 text-sm">Tren Rata-rata IPK per Semester</h2>
            <span className="text-xs text-gray-400">{prodiNama}</span>
          </div>
          {(data?.trend_ipk?.length ?? 0) === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">Belum ada data IPK.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data?.trend_ipk ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="sem" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis domain={[2.8, 3.5]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={((v: number | undefined) => [(v ?? 0).toFixed(2), "Rata-rata IPK"]) as any} />
                <Line type="monotone" dataKey="ipk" stroke="#D4A72C" strokeWidth={2.5} dot={{ r: 4, fill: "#D4A72C" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-600 text-gray-800 text-sm">Mahasiswa dengan SP Aktif</h2>
            <Link to="/prodi/mahasiswa" className="text-xs text-[#263F93] hover:underline flex items-center gap-1">Lihat Semua <ArrowRight size={12} /></Link>
          </div>
          {(data?.sp_mahasiswa?.length ?? 0) === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Tidak ada mahasiswa dengan SP aktif</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">NIM / Nama</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">SP</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">Alasan</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data?.sp_mahasiswa?.map(m => (
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
          {(data?.semester_7plus?.length ?? 0) === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Belum ada mahasiswa semester ≥ 7</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">NIM / Nama</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">Sem</th>
                <th className="px-4 py-2.5 text-left text-xs font-600 text-gray-500">IPK</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data?.semester_7plus?.map(m => (
                  <tr key={m.nim} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <p className="font-500 text-gray-800 text-xs">{m.nama}</p>
                      <p className="text-gray-400 text-xs">{m.nim}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-500">{m.sem}</td>
                    <td className="px-4 py-3">
                      {m.ipk !== null ? (
                        <span className={`font-700 font-display text-sm ${m.ipk >= 3.0 ? "text-green-600" : "text-red-500"}`}>{m.ipk.toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}