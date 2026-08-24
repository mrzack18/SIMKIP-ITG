import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { AlertTriangle, CheckCircle, Clock, FileText, BookOpen, Trophy, Users, Upload, ChevronRight, TrendingUp } from "lucide-react";
import { ipkHistory } from "../../data/mockData";

const mahasiswa = {
  nama: "Ahmad Rifaldi",
  nim: "2206001",
  prodi: "Teknik Informatika",
  angkatan: 2022,
  kategori: "Reguler",
  semester: 6,
  ipk: 3.45,
  sp: null as null | string,
  docsApproved: 2,
  docsTotal: 5,
};

const dokumenStatus = [
  { nama: "Sertifikat PKKMB", status: "Disetujui" },
  { nama: "Sertifikat MABIM", status: "Disetujui" },
  { nama: "Sertifikasi Bela Negara", status: "Menunggu Validasi" },
  { nama: "Sertifikasi (Keahlian/Kompetensi)", status: "Belum Diunggah" },
  { nama: "Berita Acara KP", status: "Ditolak" },
];

const docIcon = (status: string) => {
  if (status === "Disetujui") return <CheckCircle size={16} className="text-green-500" />;
  if (status === "Menunggu Validasi") return <Clock size={16} className="text-yellow-500" />;
  if (status === "Ditolak") return <AlertTriangle size={16} className="text-red-500" />;
  return <FileText size={16} className="text-gray-300" />;
};

export default function StudentDashboard() {
  const activePeriod = true; // Simulate active input period

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Halo, {mahasiswa.nama.split(" ")[0]}!</h1>
        <p className="text-gray-500 text-sm mt-0.5">Senin, 17 Agustus 2026 · NIM {mahasiswa.nim.slice(-8)}</p>
      </div>

      {/* Alert banners */}
      <div className="space-y-2">
        {mahasiswa.sp && (
          <div className="flex items-start gap-3 bg-red-600 text-white rounded-xl px-4 py-3">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="font-600">Anda menerima {mahasiswa.sp}.</span> Alasan: IPK di bawah standar. Anda memiliki waktu 1 semester untuk memperbaiki.
            </div>
            <Link to="/mahasiswa/sp" className="text-white/80 hover:text-white text-xs underline whitespace-nowrap">Lihat Detail</Link>
          </div>
        )}

        {/* Rejected doc banner */}
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
          <FileText size={16} className="text-yellow-600 flex-shrink-0" />
          <div className="text-sm text-yellow-800 flex-1">
            <span className="font-600">Dokumen Berita Acara Kerja Praktik</span> Anda ditolak. Alasan: File buram, mohon upload ulang.
          </div>
          <Link to="/mahasiswa/upload" className="text-yellow-700 hover:text-yellow-900 text-xs underline whitespace-nowrap">Upload Ulang</Link>
        </div>

        {activePeriod && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <BookOpen size={16} className="text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-800 flex-1">
              <span className="font-600">Periode input nilai IPK aktif</span> hingga 15 September 2026.
            </div>
            <Link to="/mahasiswa/ipk" className="text-blue-700 hover:text-blue-900 text-xs underline whitespace-nowrap">Input Sekarang</Link>
          </div>
        )}
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#F1F5F9" strokeWidth="6" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="#263F93" strokeWidth="6"
                strokeDasharray={`${(mahasiswa.semester / 8) * 163} 163`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-700 text-sm text-[#263F93]">{mahasiswa.semester}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">Semester Saat Ini</div>
          <div className="text-xs text-gray-400 mt-0.5">dari 8</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="font-display font-700 text-3xl text-gray-900 mb-1">{mahasiswa.ipk}</div>
          <div className="flex items-center justify-center gap-1 text-green-500 text-xs mb-1">
            <TrendingUp size={12} /> +0.21 dari Sem 5
          </div>
          <div className="text-xs text-gray-500">IPK Terakhir</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="font-display font-700 text-3xl text-gray-900 mb-1">{mahasiswa.docsApproved}<span className="text-base text-gray-300">/{mahasiswa.docsTotal}</span></div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2 mb-1">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(mahasiswa.docsApproved / mahasiswa.docsTotal) * 100}%` }} />
          </div>
          <div className="text-xs text-gray-500">Dokumen Tervalidasi</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={22} className="text-green-500" />
          </div>
          <div className="text-xs font-600 text-green-600">Aktif ✓</div>
          <div className="text-xs text-gray-500 mt-0.5">Status KIP-K</div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-600 text-gray-700 text-sm mb-3">Aksi Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Input IPK", icon: BookOpen, to: "/mahasiswa/ipk", active: activePeriod, note: activePeriod ? "Aktif" : "Belum Dibuka", color: "#263F93" },
            { label: "Tambah Prestasi", icon: Trophy, to: "/mahasiswa/prestasi", active: true, note: "4 prestasi", color: "#D4A72C" },
            { label: "Tambah Organisasi", icon: Users, to: "/mahasiswa/organisasi", active: true, note: "2 organisasi", color: "#7C3AED" },
            { label: "Upload Dokumen", icon: Upload, to: "/mahasiswa/upload", active: true, note: "1 perlu revisi", color: "#DC2626" },
          ].map(({ label, icon: Icon, to, active, note, color }) => (
            <Link key={label} to={active ? to : "#"}
              className={`flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border transition-all ${
                active ? "border-gray-100 hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "border-gray-100 opacity-60 cursor-not-allowed"
              }`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div className="text-xs font-600 text-gray-700 text-center">{label}</div>
              <span className="text-xs text-gray-400">{note}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* IPK chart + Doc checklist side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* IPK Chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-600 text-gray-800 text-sm mb-4 flex items-center justify-between">
            Progres IPK Saya
            <Link to="/mahasiswa/ipk" className="text-xs text-[#263F93] hover:underline flex items-center gap-1">
              Detail <ChevronRight size={12} />
            </Link>
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ipkHistory} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="semester" tickFormatter={v => `S${v}`} tick={{ fontSize: 10, fill: "#94A3B8" }} />
              <YAxis domain={[2, 4]} tick={{ fontSize: 10, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={((v: number | undefined) => [(v ?? 0).toFixed(2), "IPK"]) as any} />
              <ReferenceLine y={3.0} stroke="#DC2626" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="ipk" stroke="#263F93" strokeWidth={2.5} dot={{ fill: "#263F93", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Document checklist */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-600 text-gray-800 text-sm mb-4 flex items-center justify-between">
            Dokumen Kewajiban
            <Link to="/mahasiswa/upload" className="text-xs text-[#263F93] hover:underline flex items-center gap-1">
              Upload <ChevronRight size={12} />
            </Link>
          </h3>
          <div className="space-y-2.5">
            {dokumenStatus.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                {docIcon(d.status)}
                <span className="text-sm text-gray-700 flex-1">{d.nama}</span>
                <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${
                  d.status === "Disetujui" ? "bg-green-100 text-green-700" :
                  d.status === "Menunggu Validasi" ? "bg-yellow-100 text-yellow-700" :
                  d.status === "Ditolak" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-400"
                }`}>{d.status === "Belum Diunggah" ? "Belum" : d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
