import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight, Check, Download, Info } from "lucide-react";
import { mahasiswaList } from "../../data/mockData";
import logoItg from "@/imports/logo_itg.jpg";

const STEPS = [
  { label: "Informasi Laporan", num: 1 },
  { label: "Review Data", num: 2 },
  { label: "Preview & Kirim", num: 3 },
];

const ipkBuckets = [
  { range: "< 2.5", count: 1 },
  { range: "2.5–2.9", count: 3 },
  { range: "3.0–3.4", count: 7 },
  { range: "3.5–3.9", count: 6 },
  { range: "4.0", count: 2 },
];

const ANGKATAN_LIST = ["2022", "2023", "2024", "2025", "2026"];
const PRODI_LIST = [
  "Teknik Informatika",
  "Sistem Informasi",
  "Teknik Industri",
  "Teknik Sipil",
  "Arsitektur",
];

type Cakupan = "semua" | "angkatan" | "prodi" | "keduanya";

export default function SusunLaporan() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nomorSurat: "024/LAP/ITG/VIII/2026",
    judul: "Laporan Evaluasi Semester Genap Tahun Akademik 2025/2026",
    tahunAkademik: "2025/2026",
    semester: "Genap",
    tanggalLaporan: "2026-08-19",
    catatan: "",
    cakupan: "semua" as Cakupan,
    angkatan: "2022",
    prodi: "Teknik Informatika",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const step1Valid =
    form.nomorSurat.trim() !== "" &&
    form.judul.trim() !== "" &&
    form.tanggalLaporan !== "";

  const judul = (() => {
    const base = `LAPORAN EVALUASI SEMESTER ${form.semester.toUpperCase()} TA ${form.tahunAkademik}`;
    if (form.cakupan === "angkatan") return `${base} — ANGKATAN ${form.angkatan}`;
    if (form.cakupan === "prodi") return `${base} — ${form.prodi.toUpperCase()}`;
    if (form.cakupan === "keduanya") return `${base} — ANGKATAN ${form.angkatan} ${form.prodi.toUpperCase()}`;
    return base;
  })();

  const totalMhs = mahasiswaList.length;
  const rataIPK = (mahasiswaList.reduce((s, m) => s + m.ipk, 0) / totalMhs).toFixed(2);
  const berSP = mahasiswaList.filter((m) => m.sp).length;

  const tanggalFmt = new Date(form.tanggalLaporan).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Check size={32} className="text-[#263F93]" />
        </div>
        <p className="font-600 text-gray-800">Laporan berhasil dikirim ke Warek III</p>
        <p className="text-sm text-gray-400">Mengarahkan ke halaman detail…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/laporan" className="hover:text-gray-700 flex items-center gap-1">
          <ChevronLeft size={15} /> Laporan Semester
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-500">Susun Laporan Baru</span>
      </div>

      {/* Step Indicator — sticky */}
      <div className="sticky top-0 z-20 bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-6 py-4">
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-700 transition-all ${
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                      ? "text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  style={i === step ? { background: "#263F93" } : undefined}
                >
                  {i < step ? <Check size={14} /> : s.num}
                </div>
                <span
                  className={`text-xs mt-1 font-500 ${
                    i === step ? "text-[#263F93]" : i < step ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 -mt-5 mx-2 transition-all ${
                    i < step ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── STEP 1: Informasi Laporan ── */}
      {step === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5 space-y-5">
          <h2 className="font-600 text-gray-800">Informasi Laporan</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Nomor Surat <span className="text-red-400">*</span>
              </label>
              <input
                value={form.nomorSurat}
                onChange={set("nomorSurat")}
                placeholder="024/LAP/ITG/VIII/2026"
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Tahun Akademik
              </label>
              <select
                value={form.tahunAkademik}
                onChange={set("tahunAkademik")}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none bg-white"
              >
                {["2025/2026", "2024/2025", "2023/2024"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Judul Laporan <span className="text-red-400">*</span>
              </label>
              <input
                value={form.judul}
                onChange={set("judul")}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">Semester</label>
              <div className="flex gap-4 mt-1">
                {["Ganjil", "Genap"].map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="radio"
                      name="semester"
                      value={s}
                      checked={form.semester === s}
                      onChange={set("semester")}
                      className="accent-[#263F93]"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Tanggal Laporan <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.tanggalLaporan}
                onChange={set("tanggalLaporan")}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Catatan / Ringkasan{" "}
                <span className="text-gray-400">(opsional)</span>
              </label>
              <textarea
                value={form.catatan}
                onChange={set("catatan")}
                rows={3}
                placeholder="Ringkasan kondisi mahasiswa KIP-K semester ini..."
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Cakupan Laporan */}
          <div className="border border-[#E2E8F0] rounded-xl p-4 space-y-3">
            <h3 className="font-600 text-gray-800 text-sm">Cakupan Laporan</h3>

            {(
              [
                { value: "semua", label: "Seluruh Mahasiswa KIP-K (semua prodi, semua angkatan)" },
                { value: "angkatan", label: "Per Angkatan saja" },
                { value: "prodi", label: "Per Program Studi saja" },
                { value: "keduanya", label: "Per Angkatan + Program Studi" },
              ] as { value: Cakupan; label: string }[]
            ).map((opt) => (
              <div key={opt.value} className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    name="cakupan"
                    value={opt.value}
                    checked={form.cakupan === opt.value}
                    onChange={set("cakupan")}
                    className="accent-[#263F93]"
                  />
                  {opt.label}
                </label>

                {/* Conditional dropdowns */}
                {(opt.value === "angkatan" || opt.value === "keduanya") &&
                  form.cakupan === opt.value && (
                    <div className="ml-6">
                      <select
                        value={form.angkatan}
                        onChange={set("angkatan")}
                        className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none bg-white"
                      >
                        {ANGKATAN_LIST.map((a) => (
                          <option key={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                  )}

                {(opt.value === "prodi" || opt.value === "keduanya") &&
                  form.cakupan === opt.value && (
                    <div className="ml-6">
                      <select
                        value={form.prodi}
                        onChange={set("prodi")}
                        className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none bg-white"
                      >
                        {PRODI_LIST.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}
              </div>
            ))}

            <div className="mt-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-xs text-blue-700">
              <Info size={16} className="mt-0.5 text-[#263F93]" />
              <span>
                Laporan akan dibuat berdasarkan cakupan yang dipilih. Anda bisa membuat beberapa
                laporan terpisah untuk cakupan berbeda.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Review Data ── */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
            <h2 className="font-600 text-gray-800 mb-1">Review Data Mahasiswa</h2>
            <p className="text-xs text-gray-400 mb-4">
              Cakupan:{" "}
              {form.cakupan === "semua"
                ? "Seluruh Mahasiswa KIP-K"
                : form.cakupan === "angkatan"
                ? `Angkatan ${form.angkatan}`
                : form.cakupan === "prodi"
                ? form.prodi
                : `Angkatan ${form.angkatan} — ${form.prodi}`}
            </p>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Total Mahasiswa", val: totalMhs },
                { label: "Rata-rata IPK", val: rataIPK },
                { label: "Mahasiswa Ber-SP", val: berSP },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 text-center border border-[#E2E8F0]"
                  style={{ background: "#F8FAFC" }}
                >
                  <div className="font-display font-700 text-xl text-gray-900">{val}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* IPK histogram */}
            <div className="mb-5">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide mb-2">
                Distribusi IPK Mahasiswa
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={ipkBuckets} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#263F93" radius={[4, 4, 0, 0]} name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Preview table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                    {["NIM", "Nama", "Prodi", "Angkatan", "IPK", "SP", "Status"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 font-600 text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mahasiswaList.slice(0, 5).map((m) => (
                    <tr key={m.id} className={m.ipk < 3.0 ? "bg-red-50/30" : ""}>
                      <td className="px-3 py-2 font-mono text-gray-500">{m.nim.slice(-8)}</td>
                      <td className="px-3 py-2 font-500 text-gray-800">{m.nama}</td>
                      <td className="px-3 py-2 text-gray-500">{m.prodi.replace("Teknik ", "T.")}</td>
                      <td className="px-3 py-2 text-gray-500">{m.angkatan}</td>
                      <td
                        className="px-3 py-2 font-600"
                        style={{ color: m.ipk >= 3.0 ? "#059669" : "#DC2626" }}
                      >
                        {m.ipk}
                      </td>
                      <td className="px-3 py-2">
                        {m.sp ? (
                          <span className="text-red-600 font-600">{m.sp}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-500 ${
                            m.ipk >= 3.0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {m.ipk >= 3.0 ? "Baik" : "Perlu Perhatian"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Menampilkan 5 dari {totalMhs} mahasiswa
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Download size={14} /> Export Preview ke Excel
          </button>
        </div>
      )}

      {/* ── STEP 3: Preview Laporan ── */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
            <h2 className="font-600 text-gray-800 mb-4">Preview Laporan</h2>

            {/* Formal letter — canonical double-border format */}
            <div className="border-2 border-[#263F93] rounded-xl p-1">
              <div className="border border-[#263F93] rounded-lg p-8 space-y-5 text-xs text-gray-700 bg-white">

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
                  <span className="text-gray-600">Nomor</span><span>:</span><span>{form.nomorSurat || "[Nomor Surat]"}</span>
                  <span className="text-gray-600">Tanggal</span><span>:</span><span>{tanggalFmt}</span>
                  <span className="text-gray-600">Perihal</span><span>:</span><span className="font-semibold">Laporan Perkembangan Mahasiswa KIP-K</span>
                  <span className="text-gray-600">Kepada Yth.</span><span>:</span><span>Wakil Rektor III ITG</span>
                </div>

                {/* Judul laporan */}
                <div className="text-center py-2">
                  <p className="font-bold text-sm uppercase">{judul}</p>
                </div>

                {/* Summary stats table */}
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">I. Ringkasan Data</p>
                  <table className="w-full text-xs border border-[#E2E8F0]">
                    <thead>
                      <tr style={{ background: "#F8FAFC" }}>
                        <th className="border border-[#E2E8F0] px-3 py-2 text-left font-semibold">Keterangan</th>
                        <th className="border border-[#E2E8F0] px-3 py-2 text-center font-semibold">Jumlah Mahasiswa</th>
                        <th className="border border-[#E2E8F0] px-3 py-2 text-center font-semibold">Rata-rata IPK</th>
                        <th className="border border-[#E2E8F0] px-3 py-2 text-center font-semibold">Ber-SP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-[#E2E8F0] px-3 py-2 text-gray-600">
                          {form.cakupan === "semua"
                            ? "Seluruh Mahasiswa KIP-K"
                            : form.cakupan === "angkatan"
                            ? `Angkatan ${form.angkatan}`
                            : form.cakupan === "prodi"
                            ? form.prodi
                            : `Angkatan ${form.angkatan} — ${form.prodi}`}
                        </td>
                        <td className="border border-[#E2E8F0] px-3 py-2 text-center font-bold">{totalMhs}</td>
                        <td className="border border-[#E2E8F0] px-3 py-2 text-center font-bold">{rataIPK}</td>
                        <td className="border border-[#E2E8F0] px-3 py-2 text-center font-bold">{berSP}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* IPK distribution chart */}
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1">II. Distribusi IPK</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={ipkBuckets} margin={{ left: -20, top: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="range" tick={{ fontSize: 9, fill: "#94A3B8" }} />
                      <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                      <Bar dataKey="count" fill="#263F93" radius={[3, 3, 0, 0]} name="Jumlah" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Sample data table */}
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1">III. Sampel Data Mahasiswa</p>
                  <table className="w-full text-xs border border-[#E2E8F0]">
                    <thead>
                      <tr style={{ background: "#F8FAFC" }}>
                        {["NIM", "Nama", "Prodi", "Angkatan", "IPK", "SP"].map((h) => (
                          <th key={h} className="border border-[#E2E8F0] px-2 py-1.5 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mahasiswaList.slice(0, 5).map((m) => (
                        <tr key={m.id}>
                          <td className="border border-[#E2E8F0] px-2 py-1.5 font-mono">{m.nim.slice(-8)}</td>
                          <td className="border border-[#E2E8F0] px-2 py-1.5">{m.nama}</td>
                          <td className="border border-[#E2E8F0] px-2 py-1.5">{m.prodi.replace("Teknik ", "T.")}</td>
                          <td className="border border-[#E2E8F0] px-2 py-1.5">{m.angkatan}</td>
                          <td className="border border-[#E2E8F0] px-2 py-1.5 font-bold"
                            style={{ color: m.ipk >= 3.0 ? "#059669" : "#DC2626" }}>
                            {m.ipk}
                          </td>
                          <td className="border border-[#E2E8F0] px-2 py-1.5">{m.sp || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Catatan */}
                {form.catatan && (
                  <div>
                    <p className="font-bold text-gray-700 mb-1">Catatan:</p>
                    <p className="text-gray-600 leading-relaxed">{form.catatan}</p>
                  </div>
                )}

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 mt-10 text-sm text-center">
                  <div>
                    <p>Garut, {tanggalFmt}</p>
                    <p className="font-medium">Pengelola KIP-K</p>
                    <div className="h-16" />
                    <p className="font-bold underline">Encep Jianul Hayat, S.T., M.T.</p>
                    <p className="text-xs text-gray-500">NIP. 197804202006041001</p>
                  </div>
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-medium">Wakil Rektor</p>
                    <div className="h-16" />
                    <p className="font-bold underline">Dr. Rina Kurniawati, S.E., M.Si.</p>
                    <p className="text-xs text-gray-500">NIP. 198203152008012002</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation bar */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-5 py-4 flex items-center justify-between">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft size={16} /> Kembali
          </button>
        ) : (
          <Link to="/admin/laporan" className="text-sm text-gray-500 hover:text-gray-700">
            Batal
          </Link>
        )}

        {step < 2 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !step1Valid}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#263F93" }}
          >
            Selanjutnya <ChevronRight size={15} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSubmitted(true); setTimeout(() => navigate("/admin/laporan/1"), 1500); }}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-500 text-gray-600 hover:bg-gray-50"
            >
              Simpan Draf
            </button>
            <button
              onClick={() => { setSubmitted(true); setTimeout(() => navigate("/admin/laporan/1"), 1500); }}
              className="px-5 py-2.5 rounded-lg text-sm font-700 text-white"
              style={{ background: "#263F93" }}
            >
              Kirim ke Warek III
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
