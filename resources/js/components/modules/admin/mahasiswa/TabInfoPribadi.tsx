import { User, GraduationCap, Phone, Clock, Users, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { getCatatanInternal, storeCatatanInternal } from "@/services/mahasiswaService"
import { formatTahunAjaran } from "@/components/ui/TahunAjaranFilter"

import type { Mahasiswa } from "@/types"

export function TabInfoPribadi({ data, tahunAjaran }: { data: Mahasiswa | null, tahunAjaran: string }) {
  
  const [catatanList, setCatatanList] = useState<any[]>([]);
  const [catatanModal, setCatatanModal] = useState(false);
  const [kategori, setKategori] = useState("Akademik");
  const [deskripsi, setDeskripsi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data?.id) {
      setIsLoading(true);
      getCatatanInternal(data.id, tahunAjaran)
        .then((res: any) => {
          setCatatanList(res || []);
        })
        .finally(() => setIsLoading(false));
    }
  }, [data?.id, tahunAjaran]);

  const handleSaveCatatan = async () => {
    if (!data?.id || !deskripsi.trim()) return;
    setIsSubmitting(true);
    try {
      await storeCatatanInternal(data.id, {
        tahun_ajaran: tahunAjaran,
        kategori,
        deskripsi
      });
      setCatatanModal(false);
      setDeskripsi("");
      // Refresh list
      const res = await getCatatanInternal(data.id, tahunAjaran);
      setCatatanList(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) return null;

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0">
        {/* Basic Info Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm min-w-0">
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2E8F0]">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
              <User size={18} className="text-gray-500 flex-shrink-0" />
              Informasi Dasar
            </h3>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
            <div className="sm:col-span-2 min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Nama Lengkap</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.nama || "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">NIM</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-all">{data.nim || "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Kategori KIP-K</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.kategori ? `KIP-K ${data.kategori}` : "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">NIK</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-all">{data.nik || "—"}</span>
            </div>

            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Tempat Lahir</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.tempatLahir || "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Tanggal Lahir</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.tanggalLahir || "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Jenis Kelamin</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.jenisKelamin || "—"}</span>
            </div>
          </div>
        </div>

        {/* Academic Info Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm min-w-0">
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2E8F0]">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
              <GraduationCap size={18} className="text-gray-500 flex-shrink-0" />
              Informasi Akademik
            </h3>
          </div>
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 min-w-0">
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Program Studi</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.prodi || "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Angkatan</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.angkatan || "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Status Mahasiswa</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.status || "—"}</span>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm md:col-span-2 min-w-0">
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2E8F0]">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
              <Phone size={18} className="text-gray-500 flex-shrink-0" />
              Kontak & Alamat
            </h3>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Email</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-all">{data.email || <span className="text-gray-400 italic">Belum ada data</span>}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Nomor HP</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-all">{data.noHp || <span className="text-gray-400 italic">Belum ada data</span>}</span>
            </div>
            <div className="sm:col-span-2 min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Alamat Lengkap</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.alamat || "—"}</span>
            </div>
            
            <div className="sm:col-span-2 mt-1 sm:mt-2 pt-3 sm:pt-4 border-t border-gray-100 min-w-0">
              <span className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Riwayat Nomor HP</span>
              <div className="space-y-0 min-w-0">
                {data.noHp && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 min-w-0">
                    <div className="flex flex-col items-center self-stretch pt-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#16a34a" }} />
                      {data?.contactHistories?.length > 0 && (
                        <div className="w-px flex-1 mt-1" style={{ background: "#E2E8F0" }} />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                      <div className="min-w-0">
                        <p className="text-sm font-500 text-gray-700 break-all">{data.noHp}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} className="flex-shrink-0" /> Saat Ini
                        </p>
                      </div>
                      <span className="text-xs font-500 px-2 py-0.5 rounded-full bg-green-100 text-green-700 whitespace-nowrap shrink-0">Aktif</span>
                    </div>
                  </div>
                )}
                {data?.contactHistories?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 min-w-0">
                    <div className="flex flex-col items-center self-stretch pt-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#CBD5E1" }} />
                      {idx < data.contactHistories.length - 1 && (
                        <div className="w-px flex-1 mt-1" style={{ background: "#E2E8F0" }} />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                      <div className="min-w-0">
                        <p className="text-sm font-500 text-gray-700 break-all">{item.nomor}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} className="flex-shrink-0" /> {item.sem}
                        </p>
                      </div>
                      <span className="text-xs font-500 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 whitespace-nowrap shrink-0">Tidak Aktif</span>
                    </div>
                  </div>
                ))}
                {!data.noHp && !data?.contactHistories?.length && (
                  <p className="text-sm text-gray-400 italic">Belum ada riwayat kontak.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Family Info Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm md:col-span-2 min-w-0">
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2E8F0]">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-gray-500 flex-shrink-0" />
              Informasi Orang Tua/Wali
            </h3>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Nama Ayah</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.namaAyah || "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">Nama Ibu</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-words">{data.namaIbu || "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">No. HP Ayah</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-all">{data.telAyah || "—"}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">No. HP Ibu</span>
              <span className="block font-medium text-xs sm:text-sm text-gray-900 break-all">{data.telIbu || "—"}</span>
            </div>
          </div>
        </div>

            {/* Catatan internal */}
      <div className="min-w-0">
        <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-2 mb-3">
          <label className="block text-sm font-semibold text-gray-700">
            Catatan Internal
          </label>
          <button
            onClick={() => setCatatanModal(true)}
            className="px-3 py-1.5 text-xs font-medium text-white rounded-lg flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity w-full min-[420px]:w-auto whitespace-nowrap"
            style={{ background: "#263F93" }}
          >
            + Tambah Catatan/Kendala
          </button>
        </div>
        
        <div className="space-y-3 min-w-0">
          {isLoading ? (
            <p className="text-sm text-gray-500 italic">Memuat catatan...</p>
          ) : catatanList.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-400 italic p-4 text-center border border-dashed rounded-xl">Belum ada catatan internal pada periode ini.</p>
          ) : (
            catatanList.map((c: any) => {
               const dateStr = new Date(c.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
               return (
                <div key={c.id} className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-sm shadow-sm min-w-0">
                  <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-0.5 sm:gap-2 mb-1 min-w-0">
                    <span className="font-semibold text-xs sm:text-sm text-gray-800 break-words">{c.kategori} - {c.tahun_ajaran}</span>
                    <span className="text-xs text-gray-500 shrink-0">{dateStr}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">{c.deskripsi}</p>
                </div>
               );
            })
          )}
        </div>

        {catatanModal && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setCatatanModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 min-w-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3 min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-gray-800 truncate">Tambah Catatan/Kendala</h3>
                <button
                  onClick={() => setCatatanModal(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <XCircle size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <span className="block text-xs font-semibold text-blue-800 mb-0.5">Tahun Ajaran Aktif</span>
                  <span className="text-sm text-blue-900 font-medium">{formatTahunAjaran(tahunAjaran)}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Kategori Kendala</label>
                  <select 
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                  >
                    <option>Akademik</option>
                    <option>Kesehatan</option>
                    <option>Keluarga</option>
                    <option>Perilaku</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Masukkan deskripsi..."
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 resize-none"
                  ></textarea>
                </div>
              </div>
              <div className="pt-2 flex flex-col-reverse min-[420px]:flex-row min-[420px]:justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  onClick={() => setCatatanModal(false)}
                  className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveCatatan}
                  disabled={isSubmitting || !deskripsi.trim()}
                  className="px-4 py-2 text-sm font-medium text-white rounded-xl hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#263F93" }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      </div>
    </div>
  )
}

