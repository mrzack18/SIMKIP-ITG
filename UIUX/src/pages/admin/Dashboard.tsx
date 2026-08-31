import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  FileText,
  AlertTriangle,
  BookOpen,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
} from "lucide-react";
import logoItg from "@/imports/logo_itg.jpg";

// ── Mock data for Rekapitulasi Kendala Mahasiswa ─────────────────────────────
const kendalaMahasiswaData = [
  { name: "Finansial", value: 45, color: "#263F93" },
  { name: "Akademik", value: 30, color: "#D4A72C" },
  { name: "Fasilitas", value: 15, color: "#4F46E5" },
  { name: "Lainnya", value: 10, color: "#94A3B8" },
];

const tahunAjaranList = [
  "2024/2025 Ganjil",
  "2024/2025 Genap",
  "2025/2026 Ganjil",
  "2025/2026 Genap",
  "2026/2027 Ganjil",
];

// ── Summary chart data (Reguler vs Aspirasi) ─────────────────────────────────
const prodiSebaranData = [
  { name: "Teknik Informatika", Reguler: 26, Aspirasi: 16 },
  { name: "Sistem Informasi",   Reguler: 20, Aspirasi: 11 },
  { name: "Teknik Industri",    Reguler: 12, Aspirasi: 8  },
  { name: "Teknik Sipil",       Reguler: 10, Aspirasi: 6  },
  { name: "Arsitektur",         Reguler: 8,  Aspirasi: 4  },
];

const angkatanSebaranData = [
  { name: "2022", Reguler: 22, Aspirasi: 13 },
  { name: "2023", Reguler: 19, Aspirasi: 12 },
  { name: "2024", Reguler: 15, Aspirasi: 9  },
  { name: "2025", Reguler: 11, Aspirasi: 7  },
  { name: "2026", Reguler: 8,  Aspirasi: 5  },
];

// ── Per-prodi per-angkatan data ───────────────────────────────────────────────
const sebaranPerProdiAngkatan: Record<string, { name: string; Reguler: number; Aspirasi: number }[]> = {
  "Semua": [
    { name: "Teknik Informatika", Reguler: 26, Aspirasi: 16 },
    { name: "Sistem Informasi",   Reguler: 20, Aspirasi: 11 },
    { name: "Teknik Industri",    Reguler: 12, Aspirasi: 8  },
    { name: "Teknik Sipil",       Reguler: 10, Aspirasi: 6  },
    { name: "Arsitektur",         Reguler: 8,  Aspirasi: 4  },
  ],
  "2022": [
    { name: "Teknik Informatika", Reguler: 8, Aspirasi: 4 },
    { name: "Sistem Informasi",   Reguler: 6, Aspirasi: 2 },
    { name: "Teknik Industri",    Reguler: 4, Aspirasi: 2 },
    { name: "Teknik Sipil",       Reguler: 3, Aspirasi: 2 },
    { name: "Arsitektur",         Reguler: 2, Aspirasi: 2 },
  ],
  "2023": [
    { name: "Teknik Informatika", Reguler: 7, Aspirasi: 3 },
    { name: "Sistem Informasi",   Reguler: 5, Aspirasi: 3 },
    { name: "Teknik Industri",    Reguler: 3, Aspirasi: 2 },
    { name: "Teknik Sipil",       Reguler: 2, Aspirasi: 2 },
    { name: "Arsitektur",         Reguler: 2, Aspirasi: 1 },
  ],
  "2024": [
    { name: "Teknik Informatika", Reguler: 5, Aspirasi: 3 },
    { name: "Sistem Informasi",   Reguler: 4, Aspirasi: 3 },
    { name: "Teknik Industri",    Reguler: 3, Aspirasi: 2 },
    { name: "Teknik Sipil",       Reguler: 2, Aspirasi: 1 },
    { name: "Arsitektur",         Reguler: 2, Aspirasi: 1 },
  ],
  "2025": [
    { name: "Teknik Informatika", Reguler: 4, Aspirasi: 3 },
    { name: "Sistem Informasi",   Reguler: 3, Aspirasi: 2 },
    { name: "Teknik Industri",    Reguler: 1, Aspirasi: 1 },
    { name: "Teknik Sipil",       Reguler: 2, Aspirasi: 1 },
    { name: "Arsitektur",         Reguler: 1, Aspirasi: 0 },
  ],
  "2026": [
    { name: "Teknik Informatika", Reguler: 2, Aspirasi: 3 },
    { name: "Sistem Informasi",   Reguler: 2, Aspirasi: 1 },
    { name: "Teknik Industri",    Reguler: 1, Aspirasi: 1 },
    { name: "Teknik Sipil",       Reguler: 1, Aspirasi: 0 },
    { name: "Arsitektur",         Reguler: 1, Aspirasi: 0 },
  ],
};

// ── SP widget data ─────────────────────────────────────────────────────────
const spAktif = [
  { nama: "Sari Dewi Lestari",  nim: "2206002", prodi: "SI",    sp: "SP2", sisa: 45 },
  { nama: "Budi Santoso",       nim: "2303001", prodi: "T.Ind", sp: "SP1", sisa: 82 },
  { nama: "Indra Permana",      nim: "2211002", prodi: "T.Sip", sp: "SP1", sisa: 60 },
  { nama: "Hesti Rahayu",       nim: "2303002", prodi: "T.Ind", sp: "SP3", sisa: 12 },
];

// ── Dokumen queue widget data ──────────────────────────────────────────────
const dokumenQueue = [
  { jenis: "Sertifikat PKKMB",     nama: "Ahmad Rifaldi" },
  { jenis: "Sertifikat MABIM",     nama: "Juwita Ramadhani" },
  { jenis: "Bukti Sidang Skripsi", nama: "Krisna Bayu" },
  { jenis: "Sertifikasi",          nama: "Lena Pertiwi" },
];

// ── SP badge helper ────────────────────────────────────────────────────────
function SpBadges({ level }: { level: "SP1" | "SP2" | "SP3" }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
          level === "SP1"
            ? "bg-amber-100 text-amber-700"
            : "bg-gray-100 text-gray-400 line-through"
        }`}
      >
        SP1
      </span>
      {(level === "SP2" || level === "SP3") && (
        <span
          className={`px-1.5 py-0.5 rounded text-xs font-medium ${
            level === "SP2"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-400 line-through"
          }`}
        >
          SP2
        </span>
      )}
      {level === "SP3" && (
        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-red-900/10 text-red-900">
          SP3
        </span>
      )}
    </div>
  );
}

// ── Custom tooltip for per-prodi chart ────────────────────────────────────
function ProdiChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs text-gray-600 mb-0.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: p.fill }} />
          <span>{p.name}:</span>
          <span className="font-semibold text-gray-800">{p.value}</span>
        </div>
      ))}
      <div className="border-t border-[#E2E8F0] mt-1.5 pt-1.5 text-xs text-gray-600 flex justify-between">
        <span>Total:</span>
        <span className="font-semibold text-gray-800">{total}</span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [selectedAngkatan, setSelectedAngkatan] = useState<string>("Semua");
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<string>("2024/2025 Ganjil");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img src={logoItg} alt="ITG Logo" className="h-12 w-12 object-contain rounded-lg shadow-sm border border-gray-100" />
          <div>
            <h1 className="font-bold text-2xl text-[#263F93]">
              Selamat datang, Pak Encep Jianul
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">19 Agustus 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-xl shadow-sm">
            <Calendar size={15} className="text-[#263F93]" />
            <label className="text-xs font-semibold text-gray-600">Tahun Ajaran:</label>
            <select
              value={selectedTahunAjaran}
              onChange={(e) => setSelectedTahunAjaran(e.target.value)}
              className="text-xs font-medium text-gray-800 bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              {tahunAjaranList.map((ta) => (
                <option key={ta} value={ta}>{ta}</option>
              ))}
            </select>
          </div>
          <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[#D4A72C] text-[#263F93]">
            Pengelola KIP-K
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
          <p className="text-3xl font-bold text-[#263F93]">167</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            +3 dari semester lalu
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight">KIP-K Reguler</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">102</p>
          <p className="text-xs text-gray-400 mt-1">61% dari total</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight">KIP-K Aspirasi</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">65</p>
          <p className="text-xs text-gray-400 mt-1">39% dari total</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <FileText size={18} className="text-amber-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 leading-tight">
              Dokumen Menunggu<br />Validasi
            </p>
          </div>
          <p className="text-3xl font-bold text-gray-800">5</p>
          <Link
            to="/admin/dokumen"
            className="inline-flex items-center gap-1 mt-2 text-xs text-[#263F93] hover:underline font-medium"
          >
            Review <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Summary charts: Sebaran per Prodi + Sebaran per Angkatan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sebaran per Program Studi — horizontal stacked */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-1">Sebaran per Program Studi</h2>
          <p className="text-xs text-gray-400 mb-4">KIP-K Reguler &amp; Aspirasi per prodi</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={prodiSebaranData} layout="vertical" barCategoryGap="25%" barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="Reguler" fill="#263F93" radius={[0, 3, 3, 0]} maxBarSize={12} stackId="a" />
              <Bar dataKey="Aspirasi" fill="#D4A72C" radius={[0, 3, 3, 0]} maxBarSize={12} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#263F93]" /><span className="text-xs text-[#64748B]">Reguler</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D4A72C]" /><span className="text-xs text-[#64748B]">Aspirasi</span></div>
          </div>
        </div>

        {/* Sebaran per Angkatan — vertical stacked */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-1">Sebaran per Angkatan</h2>
          <p className="text-xs text-gray-400 mb-4">KIP-K Reguler &amp; Aspirasi per tahun masuk</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={angkatanSebaranData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="Reguler" fill="#263F93" radius={[0, 0, 0, 0]} stackId="b" />
              <Bar dataKey="Aspirasi" fill="#D4A72C" radius={[3, 3, 0, 0]} stackId="b" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#263F93]" /><span className="text-xs text-[#64748B]">Reguler</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D4A72C]" /><span className="text-xs text-[#64748B]">Aspirasi</span></div>
          </div>
        </div>
      </div>

      {/* Middle charts: Per-prodi with Angkatan filter + Rekapitulasi Kendala Mahasiswa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Per-prodi chart with angkatan filter */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h2 className="font-bold text-gray-800">Sebaran Mahasiswa KIP-K per Prodi</h2>
              <select
                value={selectedAngkatan}
                onChange={(e) => setSelectedAngkatan(e.target.value)}
                className="border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              >
                {["Semua", "2022", "2023", "2024", "2025", "2026"].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-400 mb-3">Distribusi program studi berdasarkan angkatan yang dipilih</p>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={sebaranPerProdiAngkatan[selectedAngkatan]}
              layout="vertical"
              barCategoryGap="25%"
              barGap={3}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ProdiChartTooltip />} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="Reguler" fill="#263F93" stackId="c" radius={[0, 0, 0, 0]} maxBarSize={14} />
              <Bar dataKey="Aspirasi" fill="#D4A72C" stackId="c" radius={[0, 3, 3, 0]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-6 mt-3 pt-2 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#263F93]" /><span className="text-xs text-[#64748B]">Reguler</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D4A72C]" /><span className="text-xs text-[#64748B]">Aspirasi</span></div>
          </div>
        </div>

        {/* Rekapitulasi Kendala Mahasiswa Chart Widget */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-gray-800">Rekapitulasi Kendala Mahasiswa</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#263F93]">
                Total: 100 Kasus
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">Distribusi kategori kendala yang dilaporkan mahasiswa KIP-K</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
            <div className="w-full sm:w-1/2 h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kendalaMahasiswaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {kendalaMahasiswaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} Kasus (${value}%)`, "Jumlah"]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#E2E8F0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2.5">
              {kendalaMahasiswaData.map((item) => (
                <div key={item.name} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600 font-medium truncate">{item.name}</span>
                  </div>
                  <p className="text-base font-bold text-gray-800">
                    {item.value} <span className="text-xs font-normal text-gray-500">({item.value}%)</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#F1F5F9] mt-3">
            <span>Tahun Ajaran: <strong className="text-gray-700">{selectedTahunAjaran}</strong></span>
            <span className="text-[#263F93] font-medium">Finansial dominan (45%)</span>
          </div>
        </div>
      </div>

      {/* Two-column widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* SP Widget */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Mahasiswa dengan SP Aktif</h2>
            <Link
              to="/admin/sp"
              className="text-xs text-[#263F93] hover:underline font-medium flex items-center gap-1"
            >
              Lihat Semua <ArrowRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  {["Nama", "NIM", "Prodi", "SP", "Sisa hari"].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide pr-3 last:pr-0 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {spAktif.map((s) => (
                  <tr key={s.nim} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-2.5 pr-3 font-medium text-gray-800 text-xs whitespace-nowrap">{s.nama}</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-gray-500">{s.nim}</td>
                    <td className="py-2.5 pr-3 text-xs text-gray-500">{s.prodi}</td>
                    <td className="py-2.5 pr-3">
                      <SpBadges level={s.sp as "SP1" | "SP2" | "SP3"} />
                    </td>
                    <td className="py-2.5 text-xs">
                      <span className={s.sisa <= 20 ? "text-red-600 font-semibold" : "text-gray-600"}>
                        {s.sisa}h
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dokumen Queue Widget */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Antrian Validasi Dokumen</h2>
            <Link
              to="/admin/dokumen"
              className="text-xs text-[#263F93] hover:underline font-medium flex items-center gap-1"
            >
              Review <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {dokumenQueue.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3 border border-[#E2E8F0]"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{d.jenis}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.nama}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium whitespace-nowrap ml-3">
                  Menunggu
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">14</p>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">
              Mahasiswa Semester &gt;8
              <br />
              <span className="text-amber-600">(Melebihi batas studi KIP-K)</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">7</p>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">
              SP Diterbitkan
              <br />
              Semester Ini
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-[#263F93]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">3</p>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">
              Permohonan Surat Penyelesaian
              <br />
              <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">pending</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
