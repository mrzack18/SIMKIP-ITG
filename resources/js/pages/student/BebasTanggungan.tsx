import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertTriangle, FileText, Download, User, CheckCircle2, ChevronRight, Loader2, Send, XCircle } from "lucide-react";
import { api } from "@/services/api";
import { TahunAjaranFilter, getCurrentTahunAjaran } from "@/components/ui/TahunAjaranFilter";
import { useAuth } from "@/context/AuthContext";

type AppState = "belum" | "menunggu" | "diterbitkan" | "ditolak";

interface Dokumen {
  nama: string;
  status: string | null;
  tanggal_upload: string | null;
  catatan: string | null;
}

interface ChecklistItem {
  syarat: string;
  terpenuhi: boolean;
  keterangan: string | null;
}

interface Rejection {
  tgl: string;
  catatan: string;
  oleh: string;
}

interface Permohonan {
  status: AppState;
  nomorSurat: string;
  tanggalTerbit: string;
  tanggalAjukan: string;
  rejectionHistory: Rejection[];
}

export default function BebasTanggungan() {
  const { user } = useAuth();
  const mahasiswa = {
    nama: user?.nama || "Mahasiswa",
    nim: user?.nim || "",
    prodi: user?.prodi || ""
  };
  
  const [state, setState] = useState<AppState>("belum");
  const [taFilter, setTaFilter] = useState(getCurrentTahunAjaran());
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [dokumenList, setDokumenList] = useState<Dokumen[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [permohonan, setPermohonan] = useState<Permohonan | null>(null);
  const [canApply, setCanApply] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/bebas-tanggungan');
      const dataObj = res.data; // Using res.data because api service might extract it or return it directly depending on axios config
      
      // In case api service unwraps `{ success, data, checklist, dokumen }` directly into `res`
      const payload = (res as any).success !== undefined ? res : (res as any).data;
      
      setDokumenList(payload?.dokumen || []);
      setChecklist(payload?.checklist || []);
      setCanApply(payload?.can_apply || false);
      setState(payload?.status || "belum");
      if (payload?.data && Object.keys(payload.data).length > 0) {
        setPermohonan(payload.data);
      } else {
        setPermohonan(null);
      }
    } catch (error) {
      console.error("Gagal memuat data bebas tanggungan:", error);
    }
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    try {
      await api.post('/bebas-tanggungan');
      fetchData(); // Reload data
    } catch (error: any) {
      alert(error.response?.data?.message || "Syarat Bebas Tanggungan Belum Terpenuhi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await api.get('/bebas-tanggungan/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengunduh surat (Status belum diterbitkan atau Error Jaringan).");
    }
  };

  const activeRejectionHistory = permohonan?.rejectionHistory || [];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-700 text-2xl text-gray-900">Surat Keterangan Penyelesaian Studi</h1>
          <p className="text-gray-500 text-sm mt-0.5">Mahasiswa KIP-K — {mahasiswa.prodi} · {mahasiswa.nim}</p>
        </div>
        <TahunAjaranFilter value={taFilter} onChange={setTaFilter} />
      </div>

      {state === "belum" && (
        <>
          {/* Checklist Syarat */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-600 text-gray-800 text-sm">Syarat Pengajuan Bebas Tanggungan</span>
            </div>
            <div className="space-y-3">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
                    item.terpenuhi ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                  }`}
                >
                  {item.terpenuhi ? (
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-600 ${item.terpenuhi ? "text-green-800" : "text-red-700"}`}>
                      {item.syarat}
                    </div>
                    {item.keterangan && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.keterangan}</div>
                    )}
                    {/* Khusus dokumen, list dokumen yang belum disetujui jika syarat dokumen belum terpenuhi */}
                    {idx === 0 && dokumenList.length > 0 && !item.terpenuhi && (
                      <ul className="mt-2 space-y-1">
                        {dokumenList.filter(d => d.status !== 'Disetujui').map(doc => (
                          <li key={doc.nama} className="flex items-center gap-1.5 text-xs text-red-600">
                            <XCircle size={12} /> {doc.nama} {doc.status ? `(${doc.status})` : "(Belum unggah)"}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {item.terpenuhi ? (
                    <span className="text-xs font-500 text-green-600 flex-shrink-0">Terpenuhi</span>
                  ) : (
                    <span className="text-xs font-500 text-red-600 flex-shrink-0">Belum</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pengajuan */}
          {canApply ? (
            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <h3 className="font-display font-700 text-lg text-gray-900 mb-1">Semua Syarat Terpenuhi</h3>
              <p className="text-gray-500 text-sm mb-5">
                Anda dapat mengajukan permohonan penerbitan Surat Keterangan Penyelesaian Studi KIP-K.
              </p>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-700 text-white mx-auto"
                style={{ background: "#263F93" }}
              >
                <Send size={16} /> Ajukan Permohonan
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-600 text-amber-800 text-sm">Syarat Belum Lengkap</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Permohonan belum dapat diajukan karena masih ada syarat yang belum terpenuhi. Silakan lengkapi syarat-syarat di atas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {state === "menunggu" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-[#263F93]" />
          </div>
          <h3 className="font-display font-700 text-xl text-gray-900 mb-2">Permohonan Sedang Diproses</h3>
          <p className="text-gray-500 text-sm mb-4">Permohonan Anda sedang dicek kelayakannya oleh Pengelola KIP-K.</p>
          <div className="bg-[#EDF0F8] border border-[#263F93]/30 rounded-xl p-4 text-left space-y-2 mb-4 max-w-xs mx-auto">
            {[
              ["Tanggal Pengajuan", permohonan?.tanggalAjukan || "Sedang diproses"],
              ["Estimasi Selesai", "3–5 hari kerja"],
              ["Status", "Menunggu Review"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-500">{k}</span>
                <span className="font-500 text-gray-800">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {state === "diterbitkan" && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">
            <CheckCircle size={22} className="text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-600 text-green-800">Surat Keterangan Telah Diterbitkan</p>
              <p className="text-xs text-green-700 mt-0.5">Diterbitkan pada {permohonan?.tanggalTerbit || "-"} oleh Pengelola KIP-K</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download size={28} className="text-[#263F93]" />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 mb-1">Unduh Surat Keterangan</h3>
            <p className="text-gray-500 text-sm mb-5">
              Surat Keterangan Penyelesaian Studi Anda telah ditandatangani secara digital dan siap untuk diunduh.
            </p>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-700 text-white mx-auto"
              style={{ background: "#263F93" }}
            >
              <Download size={16} /> Download PDF Surat
            </button>
          </div>
        </div>
      )}

      {state === "ditolak" && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-600 text-red-800">Permohonan Ditolak</p>
              <p className="text-sm text-red-700 mt-1">
                Permohonan Anda ditolak. Silakan periksa catatan penolakan di bawah, perbaiki persyaratan, lalu ajukan ulang.
              </p>
            </div>
          </div>

          {/* Rejection history */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
            <h3 className="font-600 text-gray-800 text-sm mb-3 flex items-center gap-2">
              <XCircle size={15} className="text-[#DC2626]" /> Riwayat Penolakan
            </h3>
            <div className="space-y-3">
              {activeRejectionHistory.map((r, i) => (
                <div key={i} className="border border-red-100 rounded-xl p-4 bg-red-50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-600 text-red-700">Penolakan #{i + 1}</span>
                    <span className="text-xs text-gray-500">{r.tgl}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed mb-1.5">
                    <span className="font-600">Catatan Penolakan: </span>{r.catatan}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ditolak oleh: <span className="font-500 text-gray-700">{r.oleh}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)} disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-600 text-white"
            style={{ background: "#263F93" }}
          >
            Perbaiki dan Ajukan Ulang
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-[#263F93]" />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 text-center mb-2">Ajukan Permohonan?</h3>
            <p className="text-gray-500 text-sm text-center mb-5">
              Pengelola KIP-K akan mengecek kelayakan dan menerbitkan surat keterangan jika semua kewajiban terpenuhi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-500 text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit} disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white"
                style={{ background: "#263F93" }}
              >
                Ya, Ajukan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
