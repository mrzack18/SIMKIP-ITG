import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import logoItg from "@/imports/logo_itg.jpg";
import { api, API_BASE_URL } from "@/services/api";
import { getCurrentTahunAjaran,  TahunAjaranFilter } from "@/components/ui/TahunAjaranFilter";

interface LaporanDetailData {
  id: number;
  judul: string;
  nomorSurat: string;
  periode: string;
  tahunAkademik: string;
  semester: string;
  tanggalLaporan: string;
  catatan: string | null;
  cakupan: string;
  angkatan: string | null;
  prodi: string | null;
  status: string;
  dibuatOleh: string;
  catatanWarek: string | null;
}

interface StatistikResponse {
  totalMahasiswa: number;
  rataIpk: number | null;
  spAktif: number;
  suratPenyelesaian: number;
  ipkBuckets: { range: string; count: number }[];
  mahasiswas: {
    id: number;
    nim: string;
    nama: string;
    prodi: string;
    ipk: number;
    status: string;
  }[];
}

interface DetailResponse {
  success: boolean;
  data: LaporanDetailData;
  statistics: StatistikResponse;
}

export default function ProdiLaporanDetail() {
  const { id } = useParams<{ id: string }>();
  const [tahunAjaran, setTahunAjaran] = useState(getCurrentTahunAjaran());
  const [data, setData] = useState<DetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.get<DetailResponse>(`/laporan/${id}`)
      .then((res) => { if (active) setData(res) })
      .catch((err) => { if (active) setError(err?.message ?? "Gagal memuat laporan") })
      .finally(() => { if (active) setLoading(false) });
    return () => { active = false };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#263F93]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0">
        <Link to="/prodi/laporan" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-6 text-center text-sm text-red-700 break-words">
          {error ?? "Laporan tidak ditemukan."}
        </div>
      </div>
    );
  }

  const l = data.data;
  const s = data.statistics ?? ({} as StatistikResponse);
  const distribusiIPK = (s.ipkBuckets ?? []).map((b) => ({ range: b.range, jml: b.count }));
  const mahasiswaSample = (s.mahasiswas ?? []).slice(0, 4);
  const tanggalFormatted = l.tanggalLaporan
    ? new Date(l.tanggalLaporan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "-";

  const handleDownloadPdf = async () => {
    try {
      const token = localStorage.getItem("simkip_token");
      const res = await fetch(`${API_BASE_URL}/laporan/${l.id}/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}`, "X-Requested-With": "XMLHttpRequest" } : { "X-Requested-With": "XMLHttpRequest" },
      });
      if (!res.ok) throw new Error("Gagal mengunduh PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_${l.nomorSurat?.replace(/\//g, "_") ?? l.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Gagal mengunduh PDF laporan.");
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 pb-24 w-full max-w-7xl mx-auto min-w-0">
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-2 min-w-0">
        <Link to="/prodi/laporan" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 shrink-0">
          <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <div className="self-start min-[480px]:self-auto min-w-0">
          <TahunAjaranFilter value={tahunAjaran} onChange={setTahunAjaran} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
        <div className="p-3 sm:p-8 font-serif max-w-3xl mx-auto min-w-0">
          <div className="flex items-center gap-3 sm:gap-5 border-b-2 border-gray-800 pb-3 sm:pb-5 mb-4 sm:mb-6 min-w-0">
            <img src={logoItg} alt="ITG" className="w-12 h-12 sm:w-20 sm:h-20 object-contain flex-shrink-0" />
            <div className="text-center flex-1 min-w-0">
              <p className="font-bold text-xs sm:text-base text-gray-800 uppercase leading-snug">Institut Teknologi Garut</p>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">Biro Kemahasiswaan dan Alumni</p>
              <p className="text-[10px] sm:text-xs text-gray-500 leading-snug break-words">Jl. Mayor Syamsu No.1, Garut 44151 · Telp. (0262) 540895</p>
            </div>
          </div>

          <div className="text-center mb-4 sm:mb-6 min-w-0">
            <p className="font-bold text-xs sm:text-sm text-gray-800 uppercase underline break-words">LAPORAN EVALUASI KIP-K</p>
            <p className="text-xs text-gray-500 mt-1 break-all">Nomor: {l.nomorSurat}</p>
            <p className="text-xs font-semibold text-[#263F93] mt-1 break-words">Tahun Ajaran: {l.periode || (l.tahunAkademik + " " + l.semester)}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 min-w-0">
            {[
              { label: "Total Mahasiswa", val: s.totalMahasiswa ?? 0 },
              { label: "Rata-rata IPK",   val: s.rataIpk != null ? Number(s.rataIpk).toFixed(2) : "0.00" },
              { label: "SP Aktif",        val: s.spAktif ?? 0 },
              { label: "Surat Penyelesaian", val: s.suratPenyelesaian ?? 0 },
            ].map((st) => (
              <div key={st.label} className="bg-gray-50 rounded-xl p-2.5 sm:p-3 text-center min-w-0">
                <p className="font-display font-700 text-lg sm:text-xl text-[#263F93] break-words">{st.val}</p>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 break-words">{st.label}</p>
              </div>
            ))}
          </div>

          <div className="mb-4 sm:mb-6 min-w-0">
            <p className="font-bold text-xs sm:text-sm text-gray-700 mb-3">Distribusi IPK Mahasiswa</p>
            {distribusiIPK.length === 0 ? (
              <div className="h-[180px] flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-200 rounded px-4 text-center">Belum ada data IPK.</div>
            ) : (
              <div className="w-full h-[180px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribusiIPK} margin={{ left: -14, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#94A3B8" }} minTickGap={4} />
                  <YAxis width={30} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="jml" fill="#263F93" radius={[3, 3, 0, 0]} name="Mahasiswa" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mb-6 sm:mb-8 min-w-0">
            <p className="font-bold text-xs sm:text-sm text-gray-700 mb-3">Data Mahasiswa (Sample)</p>
            {mahasiswaSample.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded p-4 text-center text-sm text-gray-400">Tidak ada data mahasiswa.</div>
            ) : (
              <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[520px] text-xs border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>{["NIM", "Nama", "Prodi", "IPK", "Status"].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-600 text-gray-600 border-b border-gray-200 whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mahasiswaSample.map(m => (
                    <tr key={m.nim}>
                      <td className="px-3 py-2 font-mono text-gray-500 whitespace-nowrap">{m.nim}</td>
                      <td className="px-3 py-2 text-gray-700 break-words min-w-[120px]">{m.nama}</td>
                      <td className="px-3 py-2 text-gray-500 break-words min-w-[100px]">{m.prodi}</td>
                      <td className="px-3 py-2 font-700 text-gray-800 whitespace-nowrap">{Number(m.ipk).toFixed(2)}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-500 whitespace-nowrap ${(m.status === "Aktif") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{m.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 sm:pt-6 min-w-0">
            <p className="font-bold text-xs sm:text-sm text-gray-700 mb-4">Tanda Tangan</p>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4 sm:gap-8 min-w-0">
              <div className="text-center min-w-0">
                <p className="text-xs text-gray-500 mb-3">Biro Kemahasiswaan</p>
                <div className="h-20 border border-green-200 rounded-xl bg-green-50 flex flex-col items-center justify-center gap-1">
                  <CheckCircle size={20} className="text-green-500" />
                  <p className="text-xs text-green-700 font-500">Sudah Ditandatangani</p>
                  <p className="text-xs text-gray-400 break-words">{tanggalFormatted}</p>
                </div>
                <p className="text-xs font-bold text-gray-700 mt-2 break-words">{l.dibuatOleh ?? "Pengelola KIP-K"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 shadow-lg">
        <div className="hidden sm:block flex-1" />
        <Link to="/prodi/laporan" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-500 text-gray-600 hover:bg-gray-50 whitespace-nowrap">
          <ArrowLeft size={14} /> Kembali
        </Link>
        <button onClick={handleDownloadPdf}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-500 text-white bg-[#263F93] hover:bg-[#1e3276] whitespace-nowrap">
          <Download size={14} /> Download PDF
        </button>
      </div>
    </div>
  );
}