import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertTriangle, FileText, Download, User, CheckCircle2, ChevronRight, Loader2, Send, XCircle } from "lucide-react";
import { api } from "@/services/api";
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
      const token = localStorage.getItem("simkip_token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'}/bebas-tanggungan/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/pdf",
          },
        }
      );
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank');
    } catch (err: any) {
      alert(err.message || "Gagal mengunduh surat (Status belum diterbitkan atau Error Jaringan).");
    }
  };

  const activeRejectionHistory = permohonan?.rejectionHistory || [];

  return (
    <div className="max-w-2xl mx-auto w-full space-y-3 sm:space-y-4 min-w-0">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="font-display font-700 text-lg sm:text-xl text-gray-900 leading-tight break-words">Surat Keterangan Penyelesaian Studi</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5 break-words">Mahasiswa KIP-K — {mahasiswa.prodi} · {mahasiswa.nim}</p>
        </div>
      </div>

      {state === "belum" && (
        <>
          {/* Checklist Syarat */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3 sm:p-4 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
              <span className="font-600 text-gray-800 text-sm">Syarat Pengajuan Bebas Tanggungan</span>
            </div>
            <div className="space-y-3 min-w-0">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 px-3.5 sm:px-4 py-3 rounded-xl border min-w-0 ${
                    item.terpenuhi ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                  }`}
                >
                  {item.terpenuhi ? (
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-600 break-words ${item.terpenuhi ? "text-green-800" : "text-red-700"}`}>
                      {item.syarat}
                    </div>
                    {item.keterangan && (
                      <div className="text-xs text-gray-500 mt-0.5 break-words">{item.keterangan}</div>
                    )}
                    {/* Khusus dokumen, list dokumen yang belum disetujui jika syarat dokumen belum terpenuhi */}
                    {idx === 0 && dokumenList.length > 0 && !item.terpenuhi && (
                      <ul className="mt-2 space-y-1 min-w-0">
                        {dokumenList.filter(d => d.status !== 'Disetujui').map(doc => (
                          <li key={doc.nama} className="flex items-start gap-1.5 text-xs text-red-600 min-w-0">
                            <XCircle size={12} className="flex-shrink-0 mt-0.5" /> <span className="break-words">{doc.nama} {doc.status ? `(${doc.status})` : "(Belum unggah)"}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {item.terpenuhi ? (
                    <span className="text-xs font-500 text-green-600 flex-shrink-0 whitespace-nowrap">Terpenuhi</span>
                  ) : (
                    <span className="text-xs font-500 text-red-600 flex-shrink-0 whitespace-nowrap">Belum</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pengajuan */}
          {canApply ? (
            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 sm:p-6 text-center min-w-0">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <h3 className="font-display font-700 text-base sm:text-lg text-gray-900 mb-1">Semua Syarat Terpenuhi</h3>
              <p className="text-gray-500 text-xs sm:text-sm mb-5 break-words">
                Anda dapat mengajukan permohonan penerbitan Surat Keterangan Penyelesaian Studi KIP-K.
              </p>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-700 text-white mx-auto w-full sm:w-auto whitespace-nowrap"
                style={{ background: "#263F93" }}
              >
                <Send size={16} /> Ajukan Permohonan
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 min-w-0">
              <div className="flex items-start gap-3 min-w-0">
                <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-600 text-amber-800 text-sm">Syarat Belum Lengkap</p>
                  <p className="text-xs text-amber-700 mt-1 break-words">
                    Permohonan belum dapat diajukan karena masih ada syarat yang belum terpenuhi. Silakan lengkapi syarat-syarat di atas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {state === "menunggu" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 sm:p-6 text-center min-w-0">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-[#263F93]" />
          </div>
          <h3 className="font-display font-700 text-lg sm:text-xl text-gray-900 mb-2">Permohonan Sedang Diproses</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 break-words">Permohonan Anda sedang dicek kelayakannya oleh Pengelola KIP-K.</p>
          <div className="bg-[#EDF0F8] border border-[#263F93]/30 rounded-xl p-4 text-left space-y-2 mb-4 max-w-xs mx-auto min-w-0">
            {[
              ["Tanggal Pengajuan", permohonan?.tanggalAjukan || "Sedang diproses"],
              ["Estimasi Selesai", "3–5 hari kerja"],
              ["Status", "Menunggu Review"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 text-sm min-w-0">
                <span className="text-gray-500 shrink-0">{k}</span>
                <span className="font-500 text-gray-800 text-right break-words min-w-0">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {state === "diterbitkan" && (
        <div className="space-y-4 min-w-0">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 flex items-start gap-3 min-w-0">
            <CheckCircle size={22} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-600 text-green-800 text-xs sm:text-sm">Surat Keterangan Telah Diterbitkan</p>
              <p className="text-xs text-green-700 mt-0.5 break-words">Diterbitkan pada {permohonan?.tanggalTerbit || "-"} oleh Pengelola KIP-K</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 sm:p-6 text-center min-w-0">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download size={28} className="text-[#263F93]" />
            </div>
            <h3 className="font-display font-700 text-base sm:text-lg text-gray-900 mb-1">Unduh Surat Keterangan</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-5 break-words">
              Surat Keterangan Penyelesaian Studi Anda telah ditandatangani secara digital dan siap untuk diunduh.
            </p>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-700 text-white mx-auto w-full sm:w-auto whitespace-nowrap"
              style={{ background: "#263F93" }}
            >
              <Download size={16} /> Download PDF Surat
            </button>
          </div>
        </div>
      )}

      {state === "ditolak" && (
        <div className="space-y-4 min-w-0">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-start gap-3 min-w-0">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-600 text-red-800 text-xs sm:text-sm">Permohonan Ditolak</p>
              <p className="text-xs sm:text-sm text-red-700 mt-1 break-words">
                Permohonan Anda ditolak. Silakan periksa catatan penolakan di bawah, perbaiki persyaratan, lalu ajukan ulang.
              </p>
            </div>
          </div>

          {/* Rejection history */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3 sm:p-4 min-w-0">
            <h3 className="font-600 text-gray-800 text-sm mb-3 flex items-center gap-2">
              <XCircle size={15} className="text-[#DC2626] flex-shrink-0" /> Riwayat Penolakan
            </h3>
            <div className="space-y-3 min-w-0">
              {activeRejectionHistory.map((r, i) => (
                <div key={i} className="border border-red-100 rounded-xl p-3.5 sm:p-4 bg-red-50 min-w-0">
                  <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-0.5 sm:gap-2 mb-1.5 min-w-0">
                    <span className="text-xs font-600 text-red-700">Penolakan #{i + 1}</span>
                    <span className="text-xs text-gray-500 shrink-0">{r.tgl}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed mb-1.5 break-words">
                    <span className="font-600">Catatan Penolakan: </span>{r.catatan}
                  </p>
                  <p className="text-xs text-gray-500 break-words">
                    Ditolak oleh: <span className="font-500 text-gray-700">{r.oleh}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)} disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-600 text-white w-full sm:w-auto whitespace-nowrap"
            style={{ background: "#263F93" }}
          >
            Perbaiki dan Ajukan Ulang
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl min-w-0">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-[#263F93]" />
            </div>
            <h3 className="font-display font-700 text-base sm:text-lg text-gray-900 text-center mb-2">Ajukan Permohonan?</h3>
            <p className="text-gray-500 text-xs sm:text-sm text-center mb-5 break-words">
              Pengelola KIP-K akan mengecek kelayakan dan menerbitkan surat keterangan jika semua kewajiban terpenuhi.
            </p>
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
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
