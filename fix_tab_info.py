import re

with open('resources/js/components/modules/admin/mahasiswa/TabInfoPribadi.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update imports
text = text.replace('import { kendalaList } from "@/data/mockData"', '')
text = text.replace('import { useState } from "react"', 'import { useState, useEffect } from "react"\nimport { getCatatanInternal, storeCatatanInternal } from "@/services/mahasiswaService"\nimport { formatTahunAjaran } from "@/components/ui/TahunAjaranFilter"')

# 2. Update function signature
text = text.replace('export function TabInfoPribadi({ data }: { data: Mahasiswa | null }) {', 'export function TabInfoPribadi({ data, tahunAjaran }: { data: Mahasiswa | null, tahunAjaran: string }) {')

# 3. Add state and logic for catatan
state_logic = """
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
          setCatatanList(res.data || []);
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
      setCatatanList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
"""

text = re.sub(r'const \[catatan, setCatatan\] = useState\(""\)', state_logic, text)

# 4. Replace UI section
old_catatan_ui = r'\{\/\* Catatan internal \*\/\}.*?</div>\s*</div>\s*</div>\s*\)\s*\}'

new_catatan_ui = r'''      {/* Catatan internal */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">
            Catatan Internal
          </label>
          <button
            onClick={() => setCatatanModal(true)}
            className="px-3 py-1.5 text-xs font-medium text-white rounded-lg flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: "#263F93" }}
          >
            + Tambah Catatan/Kendala
          </button>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-gray-500 italic">Memuat catatan...</p>
          ) : catatanList.length === 0 ? (
            <p className="text-sm text-gray-400 italic p-4 text-center border border-dashed rounded-xl">Belum ada catatan internal pada periode ini.</p>
          ) : (
            catatanList.map((c: any) => {
               const dateStr = new Date(c.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
               return (
                <div key={c.id} className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-sm shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">{c.kategori} - {c.tahun_ajaran}</span>
                    <span className="text-xs text-gray-500">{dateStr}</span>
                  </div>
                  <p className="text-gray-600">{c.deskripsi}</p>
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
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <h3 className="font-bold text-gray-800">Tambah Catatan/Kendala</h3>
                <button
                  onClick={() => setCatatanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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
              <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
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
'''

text = re.sub(old_catatan_ui, new_catatan_ui, text, flags=re.DOTALL)

with open('resources/js/components/modules/admin/mahasiswa/TabInfoPribadi.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
