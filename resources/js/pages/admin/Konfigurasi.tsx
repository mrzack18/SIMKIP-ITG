import { useState, useEffect } from "react"
import { api } from "@/services/api"
import {
  getPeriodeList,
  createPeriode,
  updatePeriode,
  deletePeriode,
  activatePeriode,
  type PeriodeItem,
} from "@/services/konfigurasiService"
import {
  PeriodeAktifCard,
  PeriodeFormModal,
  TimelinePeriode,
} from "@/components/admin/periode"
import {
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  Pencil,
  X,
  XCircle,
  Info,
  Settings,
} from "lucide-react"

const Toast = ({ msg, onClose }: { msg: string; onClose: () => void }) => (
  <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg z-50 text-sm animate-fade-in">
    <CheckCircle size={16} className="text-green-400" />
    {msg}
    <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
      ✕
    </button>
  </div>
)

const SectionHeader = ({
  num,
  title,
  onSave,
}: {
  num: number
  title: string
  onSave?: () => void
}) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
    <div className="flex items-center gap-2.5">
      <div className="w-6 h-6 rounded-full bg-[#263F93] flex items-center justify-center text-white text-xs font-700">
        {num}
      </div>
      <h2 className="font-600 text-gray-800 text-sm">{title}</h2>
    </div>
    {onSave && (
      <button
        onClick={onSave}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 text-white transition-colors"
        style={{ background: "#263F93" }}
      >
        <Save size={12} /> Simpan
      </button>
    )}
  </div>
)

function AddFieldInline({ dokumenId, onAdded }: { dokumenId: number; onAdded: () => void }) {
  const [label, setLabel] = useState("");
  const [tipe, setTipe] = useState("text");
  const [isRequired, setIsRequired] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!label.trim()) return;
    setSaving(true);
    try {
      await api.post(`/konfigurasi/dokumen-jenis/${dokumenId}/fields`, { label, tipe, is_required: isRequired });
      setLabel("");
      setIsRequired(false);
      onAdded();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <input
        type="text"
        placeholder="Nama Field (misal: Tanggal Sidang)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="flex-1 min-w-0 text-xs px-2 py-1.5 border border-gray-200 rounded"
      />
      <select
        value={tipe}
        onChange={(e) => setTipe(e.target.value)}
        className="w-32 text-xs px-2 py-1.5 border border-gray-200 rounded"
      >
        <option value="text">Teks Singkat</option>
        <option value="date">Tanggal</option>
        <option value="url">Link / URL</option>
        <option value="number">Angka</option>
        <option value="dropdown">Dropdown</option>
      </select>
      <label className="flex items-center gap-1 text-xs text-gray-600">
        <input type="checkbox" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} /> Wajib
      </label>
      <button
        onClick={handleAdd}
        disabled={saving || !label.trim()}
        className="px-3 py-1.5 bg-[#263F93] text-white text-xs rounded hover:bg-blue-800 disabled:opacity-50"
      >
        {saving ? "..." : "Tambah"}
      </button>
    </div>
  );
}

export default function Konfigurasi() {
  const [ipkMin, setIpkMin] = useState(3.0)
  const [showIpkWarning, setShowIpkWarning] = useState(false)
  const [institusi, setInstitusi] = useState({
    nama: "Institut Teknologi Garut",
    alamat: "Jl. Mayor Syamsu No. 1, Garut, Jawa Barat",
  })
  const [newProdi, setNewProdi] = useState({ nama: "", kode: "" })
  const [showAddProdi, setShowAddProdi] = useState(false)
  const [expandedDokumen, setExpandedDokumen] = useState<number | null>(null)

  // Section 2 state (Periode)
  const [periodeList, setPeriodeList] = useState<PeriodeItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPeriode, setEditingPeriode] = useState<PeriodeItem | null>(null)
  const [totalMahasiswaAktif, setTotalMahasiswaAktif] = useState(0)

  // Section 3: Prodi state
  const [prodis, setProdis] = useState<any[]>([])

  // Section 4: Dokumen state
  const [dokumens, setDokumens] = useState<any[]>([])
  const [toast, setToast] = useState("")

  // Nilai Mutu state
  const [nilaiMutu, setNilaiMutu] = useState<any[]>([])
  /* 
    { id: 1, min: 80, max: 100, huruf: "A", poin: 4.0, lulus: true },
    { id: 2, min: 75, max: 79, huruf: "AB", poin: 3.5, lulus: true },
    { id: 3, min: 70, max: 74, huruf: "B", poin: 3.0, lulus: true },
    { id: 4, min: 65, max: 69, huruf: "BC", poin: 2.5, lulus: true },
    { id: 5, min: 60, max: 64, huruf: "C", poin: 2.0, lulus: true },
    { id: 6, min: 55, max: 59, huruf: "D", poin: 1.0, lulus: false },
  */
  const [editingNilai, setEditingNilai] = useState<number | null>(null)
  const [editRow, setEditRow] = useState<{
    min: number
    max: number
    huruf: string
    poin: number
    lulus: boolean
  } | null>(null)

  // Section 7 State: Regulasi & Aturan
  const [regulasi, setRegulasi] = useState<any[]>([])
  /* 
    { id: 1, nama: "IPK Minimum", deskripsi: "Batas minimum IPK yang harus dicapai mahasiswa KIP-K per semester", nilai: "3.00", tipe: "number", aktif: true },
    { id: 2, nama: "Masa Tenggang SP", deskripsi: "Jumlah hari yang diberikan kepada mahasiswa untuk memperbaiki pelanggaran setelah SP diterbitkan", nilai: "90", tipe: "number", aktif: true },
    { id: 3, nama: "Batas Semester Studi", deskripsi: "Jumlah semester maksimum yang diperbolehkan untuk penerima KIP-K", nilai: "8", tipe: "number", aktif: true },
    { id: 4, nama: "Minimum SKS per Semester", deskripsi: "Jumlah SKS minimum yang harus diambil mahasiswa per semester", nilai: "18", tipe: "number", aktif: true },
  */
  const [showAddRegulasi, setShowAddRegulasi] = useState(false)
  const [editRegulasi, setEditRegulasi] = useState<number | null>(null)
  const [regulasiForm, setRegulasiForm] = useState({ nama: "", deskripsi: "", nilai: "", tipe: "number" as "number" | "text" })
  const [editRegulasiRow, setEditRegulasiRow] = useState<{nama: string, deskripsi: string, nilai: string, tipe: "number" | "text"} | null>(null)

  // Section 8 State: Jenis Pelanggaran

  const [tahunAjaranOptions, setTahunAjaranOptions] = useState<string[]>([])

  const fetchPeriodeData = async () => {
    try {
      const list = await getPeriodeList();
      setPeriodeList(list);
      // Hitung mahasiswa KIP-K aktif sebagai preview dampak
      const mhsRes: any = await api.get("/konfigurasi/all");
      const stats = mhsRes?.data?.mahasiswa_count_aktif ?? null;
      if (typeof stats === "number") setTotalMahasiswaAktif(stats);
    } catch {}
  }

  const fetchData = async () => {
    try {
      const res: any = await api.get("/konfigurasi/all")
      if (res.success) {
        const d = res.data
        setInstitusi(d.institusi)

        // Map aturan_akademik to regulasi array for the UI
        const regArr = d.regulasi || [
          { id: 1, nama: "IPK Minimum", deskripsi: "Batas minimum IPK yang harus dicapai mahasiswa KIP-K per semester", nilai: d.aturan_akademik?.ipk_minimum || "3.00", tipe: "number", aktif: true },
          { id: 2, nama: "Masa Tenggang SP", deskripsi: "Jumlah hari yang diberikan kepada mahasiswa untuk memperbaiki pelanggaran setelah SP diterbitkan", nilai: d.aturan_akademik?.masa_tenggang_sp || "90", tipe: "number", aktif: true },
          { id: 3, nama: "Batas Semester Studi", deskripsi: "Jumlah semester maksimum yang diperbolehkan untuk penerima KIP-K", nilai: d.aturan_akademik?.max_semester || "8", tipe: "number", aktif: true },
          { id: 4, nama: "Minimum SKS per Semester", deskripsi: "Jumlah SKS minimum yang harus diambil mahasiswa per semester", nilai: d.aturan_akademik?.sks_minimum_semester || "18", tipe: "number", aktif: true },
          { id: 5, nama: "Total SKS Kelulusan", deskripsi: "Total minimum SKS untuk kelulusan mahasiswa KIP-K", nilai: d.aturan_akademik?.sks_minimum_lulus || "144", tipe: "number", aktif: true }
        ];
        setRegulasi(regArr)

        setNilaiMutu(d.nilai_mutu || [])
        setJenisPelanggaran(d.jenis_pelanggaran || [])
        setProdis(d.prodis || [])
        setDokumens(d.dokumens || [])
        setTahunAjaranOptions(d.tahun_ajaran_options || [])

        const ipkMinObj = regArr.find((r:any) => r.nama === "IPK Minimum")
        if (ipkMinObj) setIpkMin(parseFloat(ipkMinObj.nilai))
      }
    } catch(e) {}
  }

  useEffect(() => {
    fetchData()
    fetchPeriodeData()
  }, [])

  const [jenisPelanggaran, setJenisPelanggaran] = useState<any[]>([])
  /* 
    { id: 1, nama: "Akademik", deskripsi: "IPK di bawah standar minimum yang ditetapkan", eskalasi: "normal", aktif: true },
    { id: 2, nama: "Non-Akademik", deskripsi: "Pelanggaran kode etik atau tata tertib kampus", eskalasi: "normal", aktif: true },
  */
  const [showAddPelanggaran, setShowAddPelanggaran] = useState(false)
  const [pelanggaranForm, setPelanggaranForm] = useState({ nama: "", deskripsi: "", eskalasi: "normal" as "normal" | "langsung_sp3" })
  const [editPelanggaran, setEditPelanggaran] = useState<number | null>(null)
  const [editPelanggaranRow, setEditPelanggaranRow] = useState<{nama: string, deskripsi: string, eskalasi: "normal" | "langsung_sp3"} | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  
  const saveRegulasiAll = async () => {
    const payload: any = {};
    regulasi.forEach(r => {
       if(r.nama === 'IPK Minimum') payload.ipk_minimum = r.nilai;
       if(r.nama === 'Masa Tenggang SP') payload.masa_tenggang_sp = r.nilai;
       if(r.nama === 'Batas Semester Studi') payload.max_semester = r.nilai;
       if(r.nama === 'Minimum SKS per Semester') payload.sks_minimum_semester = r.nilai;
       if(r.nama === 'Total SKS Kelulusan') payload.sks_minimum_lulus = r.nilai;
    });
    payload.ipk_minimum = ipkMin; // from the dedicated UI
    await api.put('/konfigurasi', payload);
    fetchData();
    setShowIpkWarning(false);
    showToast("Konfigurasi berhasil disimpan");
  }

  const handleProdiSave = async () => {
     if(newProdi.nama && newProdi.kode) {
        await api.post('/konfigurasi/prodi', newProdi);
        setNewProdi({nama: '', kode: ''});
        setShowAddProdi(false);
        fetchData();
        showToast("Prodi berhasil ditambahkan");
     }
  }

  const handleDeleteNilaiMutu = async (id: number) => {
      await api.delete('/konfigurasi/nilai-mutu/'+id);
      fetchData();
      showToast("Dihapus");
  }
  
  const handleSaveNilaiMutu = async (id: number, data: any) => {
      if(id === 0) {
          await api.post('/konfigurasi/nilai-mutu', data);
      } else {
          await api.put('/konfigurasi/nilai-mutu/'+id, data);
      }
      fetchData();
      showToast("Tersimpan");
  }

  const handleTogglePelanggaran = async (id: number, aktif: boolean) => {
      // Actually we just update aktif
      const p = jenisPelanggaran.find(x => x.id === id);
      if(p) {
          await api.put('/konfigurasi/pelanggaran/'+id, {...p, aktif: !aktif});
          fetchData();
      }
  }
  // Section 2 handlers (Periode)
  const handleCreateOrUpdatePeriode = async (data: {
    tahun_akademik: string;
    semester: "Ganjil" | "Genap";
    tanggal_buka: string;
    tanggal_tutup: string;
    is_aktif: boolean;
  }) => {
    if (editingPeriode) {
      await updatePeriode(editingPeriode.id, data);
      showToast("Periode berhasil diperbarui");
    } else {
      await createPeriode(data);
      showToast("Periode berhasil ditambahkan");
    }
    await fetchPeriodeData();
    await fetchData();
  };

  const handleActivatePeriode = async (item: PeriodeItem) => {
    if (!window.confirm(`Aktifkan periode ${item.tahun_akademik} ${item.semester}?\n\nMahasiswa akan langsung bisa input nilai KHS untuk periode ini. Periode lain akan otomatis dinonaktifkan.`)) return;
    await activatePeriode(item.id);
    showToast(`Periode ${item.tahun_akademik} ${item.semester} diaktifkan`);
    await fetchPeriodeData();
    await fetchData();
  };

  const handleDeactivatePeriode = async () => {
    const active = periodeList.find(p => p.is_aktif);
    if (!active) return;
    if (!window.confirm(`Nonaktifkan periode ${active.tahun_akademik} ${active.semester}?\n\nMahasiswa tidak akan bisa input nilai KHS sampai periode baru diaktifkan.`)) return;
    // Update dengan is_aktif=false
    await updatePeriode(active.id, {
      tahun_akademik: active.tahun_akademik,
      semester: active.semester as "Ganjil" | "Genap",
      tanggal_buka: active.tanggal_buka?.substring(0, 10) ?? "",
      tanggal_tutup: active.tanggal_tutup?.substring(0, 10) ?? "",
      is_aktif: false,
    });
    showToast("Periode dinonaktifkan");
    await fetchPeriodeData();
    await fetchData();
  };

  const handleDeletePeriode = async (item: PeriodeItem) => {
    if (item.is_aktif) {
      showToast("Tidak dapat menghapus periode aktif. Nonaktifkan dulu.");
      return;
    }
    if (!window.confirm(`Hapus periode ${item.tahun_akademik} ${item.semester}?\n\nTindakan ini tidak dapat dibatalkan.`)) return;
    await deletePeriode(item.id);
    showToast("Periode dihapus");
    await fetchPeriodeData();
    await fetchData();
  };

  const handleEditPeriode = (item: PeriodeItem) => {
    setEditingPeriode(item);
    setModalOpen(true);
  };

  const handleAddPeriode = () => {
    setEditingPeriode(null);
    setModalOpen(true);
  };

  const handleSavePelanggaran = async (data: any, id: number|null = null) => {
      if(id) {
          await api.put('/konfigurasi/pelanggaran/'+id, data);
      } else {
          await api.post('/konfigurasi/pelanggaran', data);
      }
      fetchData();
      showToast("Tersimpan");
  }


  

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">
          Konfigurasi Sistem
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Pengaturan global yang mempengaruhi seluruh logika bisnis SIMKIP-ITG
        </p>
      </div>

      {/* Section 1: IPK Threshold */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={1}
          title="Ambang Batas IPK (Threshold)"
          onSave={() => setShowIpkWarning(true)}
        />
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                IPK Minimum
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setIpkMin((v) =>
                      Math.max(0, Math.round((v - 0.1) * 10) / 10),
                    )
                  }
                  className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-700 text-lg border-r border-gray-200"
                >
                  −
                </button>
                <input
                  type="number"
                  value={ipkMin}
                  step={0.1}
                  min={0}
                  max={4}
                  onChange={(e) => setIpkMin(parseFloat(e.target.value))}
                  className="w-20 px-3 py-2.5 text-center text-lg font-display font-700 text-gray-900 focus:outline-none"
                />
                <button
                  onClick={() =>
                    setIpkMin((v) =>
                      Math.min(4, Math.round((v + 0.1) * 10) / 10),
                    )
                  }
                  className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-700 text-lg border-l border-gray-200"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 flex-1">
              Mahasiswa dengan IPK di bawah nilai ini akan ditandai untuk
              evaluasi dan penerbitan SP.
            </p>
          </div>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle
              size={15}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700">
              Perubahan threshold akan mempengaruhi evaluasi seluruh {167}{" "}
              mahasiswa aktif secara real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Periode Input Nilai (single source of truth: tabel periode_akademiks) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#263F93] flex items-center justify-center text-white text-xs font-700">
              2
            </div>
            <div>
              <h2 className="font-600 text-gray-800 text-sm">Periode Input Nilai KHS</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Atur kapan mahasiswa KIP-K dapat mengajukan nilai KHS untuk divalidasi admin
              </p>
            </div>
          </div>
          <button
            onClick={handleAddPeriode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 text-white transition-colors"
            style={{ background: "#263F93" }}
          >
            <Plus size={12} /> Tambah Periode
          </button>
        </div>
        <div className="p-5 space-y-5">
          <PeriodeAktifCard
            active={periodeList.find(p => p.is_aktif) || null}
            totalMahasiswaAktif={totalMahasiswaAktif}
            onEdit={() => {
              const active = periodeList.find(p => p.is_aktif);
              if (active) handleEditPeriode(active);
            }}
            onDeactivate={handleDeactivatePeriode}
            onActivateAnother={handleAddPeriode}
          />

          <TimelinePeriode
            items={periodeList}
            onActivate={handleActivatePeriode}
            onEdit={handleEditPeriode}
            onDelete={handleDeletePeriode}
          />
        </div>
      </div>

      <PeriodeFormModal
        open={modalOpen}
        initial={editingPeriode}
        tahunAjaranOptions={tahunAjaranOptions}
        onClose={() => {
          setModalOpen(false);
          setEditingPeriode(null);
        }}
        onSubmit={handleCreateOrUpdatePeriode}
      />

      {/* Section 3: Master Prodi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader num={3} title="Master Data Program Studi" />
        <div className="p-5 space-y-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Nama Prodi", "Kode", "Status", "Aksi"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 text-xs font-600 text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {prodis.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 font-500 text-gray-800">{p.nama}</td>
                  <td className="py-2.5 font-mono text-gray-500">{p.kode}</td>
                  <td className="py-2.5">
                    <button
                      onClick={() =>
                        setProdis((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, aktif: !x.aktif } : x,
                          ),
                        )
                      }
                    >
                      {p.aktif ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <ToggleRight size={16} /> Aktif
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <ToggleLeft size={16} /> Nonaktif
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-[#263F93] hover:underline">
                        Edit
                      </button>
                      <button className="text-xs text-red-500 hover:underline">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showAddProdi && (
            <div className="flex gap-2 mt-3">
              <input
                value={newProdi.nama}
                onChange={(e) =>
                  setNewProdi((f) => ({ ...f, nama: e.target.value }))
                }
                placeholder="Nama Prodi"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
              <input
                value={newProdi.kode}
                onChange={(e) =>
                  setNewProdi((f) => ({ ...f, kode: e.target.value }))
                }
                placeholder="Kode"
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
              <button
                onClick={() => {
                  setProdis((p) => [
                    ...p,
                    {
                      id: Date.now(),
                      nama: newProdi.nama,
                      kode: newProdi.kode,
                      aktif: true,
                    },
                  ])
                  setShowAddProdi(false)
                  setNewProdi({ nama: "", kode: "" })
                }}
                className="px-3 py-2 rounded-lg text-sm font-500 text-white"
                style={{ background: "#059669" }}
              >
                Simpan
              </button>
            </div>
          )}

          <button
            onClick={() => setShowAddProdi(true)}
            className="flex items-center gap-2 text-sm text-[#263F93] hover:underline mt-2"
          >
            <Plus size={14} /> Tambah Prodi
          </button>
        </div>
      </div>

      {/* Section 4: Dokumen Kewajiban */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={4}
          title="Jenis Dokumen Kewajiban"
          onSave={() => showToast("Konfigurasi dokumen disimpan")}
        />
        <div className="p-5 space-y-1">
          {dokumens.map((d: any) => (
            <div key={d.id} className="border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3 py-2">
                <button
                  onClick={async () => {
                    try {
                      await api.patch('/konfigurasi/dokumen-jenis/' + d.id + '/toggle');
                      fetchData();
                    } catch { showToast("Gagal mengubah status dokumen"); }
                  }}
                >
                  {d.is_wajib ? (
                    <ToggleRight size={22} className="text-[#263F93]" />
                  ) : (
                    <ToggleLeft size={22} className="text-gray-400" />
                  )}
                </button>
                <span className="flex-1 text-sm text-gray-700">{d.nama}</span>
                <span className="text-xs font-mono text-gray-400">{d.kode}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-500 ${
                    d.is_wajib
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {d.is_wajib ? "Wajib" : "Tidak Wajib"}
                </span>
                <button
                  onClick={() => setExpandedDokumen(expandedDokumen === d.id ? null : d.id)}
                  className="p-1 text-gray-400 hover:text-[#263F93] rounded"
                  title="Atur custom fields"
                >
                  <Settings size={16} />
                </button>
              </div>
              {expandedDokumen === d.id && (
                <div className="pl-10 pr-4 pb-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs font-600 text-gray-700 mb-2">Custom Fields (Opsional)</h4>
                    <div className="space-y-2 mb-3">
                      {(d.fields || []).map((f: any) => (
                        <div key={f.id} className="flex items-center gap-2 text-xs bg-white p-2 border border-gray-100 rounded">
                          <span className="font-500 text-gray-700 flex-1">{f.label}</span>
                          <span className="text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded text-[10px] uppercase">{f.tipe}</span>
                          {f.is_required && <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded text-[10px]">Wajib</span>}
                          <button
                            onClick={async () => {
                              if (confirm("Hapus field ini?")) {
                                await api.delete(`/konfigurasi/dokumen-jenis-fields/${f.id}`);
                                fetchData();
                              }
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {(!d.fields || d.fields.length === 0) && (
                        <div className="text-xs text-gray-400 italic">Belum ada custom fields</div>
                      )}
                    </div>
                    <AddFieldInline dokumenId={d.id} onAdded={fetchData} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Informasi Institusi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={5}
          title="Informasi Institusi"
          onSave={() => showToast("Informasi institusi diperbarui")}
        />
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">
              Nama Institusi
            </label>
            <input
              value={institusi.nama}
              onChange={(e) =>
                setInstitusi((f) => ({ ...f, nama: e.target.value }))
              }
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">
              Alamat
            </label>
            <input
              value={institusi.alamat}
              onChange={(e) =>
                setInstitusi((f) => ({ ...f, alamat: e.target.value }))
              }
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">
              Logo Institusi
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 cursor-pointer transition-colors">
              <p className="text-sm text-gray-400">
                Klik untuk upload logo (PNG/SVG, maks. 2MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Konfigurasi Nilai Mutu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={6}
          title="Konfigurasi Nilai Mutu"
          onSave={() => showToast("Konfigurasi nilai mutu berhasil disimpan")}
        />
        <div className="p-5 space-y-4">
          {/* Deskripsi */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <GraduationCap
              size={15}
              className="text-[#263F93] flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-[#263F93]">
              Tabel konversi nilai angka ke nilai huruf dan poin mutu.
              Konfigurasi ini digunakan sebagai acuan penilaian mata kuliah
              mahasiswa KIP-K.
            </p>
          </div>

          {/* Tabel Nilai Mutu */}
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "Rentang Nilai",
                    "Nilai Huruf",
                    "Poin Mutu",
                    "Status",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {nilaiMutu.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      editingNilai === row.id
                        ? "bg-blue-50/40"
                        : "hover:bg-gray-50/60"
                    }`}
                  >
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={editRow.min}
                            onChange={(e) =>
                              setEditRow((r) =>
                                r ? { ...r, min: Number(e.target.value) } : r,
                              )
                            }
                            className="w-14 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                          />
                          <span className="text-gray-400">–</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={editRow.max}
                            onChange={(e) =>
                              setEditRow((r) =>
                                r ? { ...r, max: Number(e.target.value) } : r,
                              )
                            }
                            className="w-14 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                          />
                        </div>
                      ) : (
                        <span className="font-mono font-600 text-gray-700">
                          {row.min} – {row.max}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <input
                          type="text"
                          value={editRow.huruf}
                          onChange={(e) =>
                            setEditRow((r) =>
                              r
                                ? { ...r, huruf: e.target.value.toUpperCase() }
                                : r,
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center font-700 focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                        />
                      ) : (
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-sm font-700 ${
                            row.lulus
                              ? row.huruf === "A"
                                ? "bg-[#263F93] text-white"
                                : row.huruf === "AB"
                                  ? "bg-blue-100 text-blue-800"
                                  : row.huruf === "B"
                                    ? "bg-indigo-100 text-indigo-700"
                                    : row.huruf === "BC"
                                      ? "bg-teal-100 text-teal-700"
                                      : "bg-green-100 text-green-700"
                              : row.huruf === "D"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.huruf}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <input
                          type="number"
                          step={0.5}
                          min={0}
                          max={4}
                          value={editRow.poin}
                          onChange={(e) =>
                            setEditRow((r) =>
                              r
                                ? { ...r, poin: parseFloat(e.target.value) }
                                : r,
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                        />
                      ) : (
                        <span className="font-mono text-gray-700">
                          {row.poin.toFixed(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <button
                          onClick={() =>
                            setEditRow((r) =>
                              r ? { ...r, lulus: !r.lulus } : r,
                            )
                          }
                          className="flex items-center gap-1 text-xs font-500"
                        >
                          {editRow.lulus ? (
                            <>
                              <ToggleRight
                                size={18}
                                className="text-green-500"
                              />{" "}
                              <span className="text-green-700">Lulus</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={18} className="text-gray-400" />{" "}
                              <span className="text-gray-500">Tidak Lulus</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-600 ${
                            row.lulus
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.lulus ? (
                            <span className="flex items-center gap-1.5 justify-center"><CheckCircle size={14} /> Lulus</span>
                          ) : (
                            <span className="flex items-center gap-1.5 justify-center"><XCircle size={14} /> Tidak Lulus</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingNilai === row.id && editRow ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              if (editRow) {
                                setNilaiMutu((prev) =>
                                  prev.map((r) =>
                                    r.id === row.id ? { ...r, ...editRow } : r,
                                  ),
                                )
                                showToast(
                                  `Nilai ${editRow.huruf} berhasil diperbarui`,
                                )
                              }
                              setEditingNilai(null)
                              setEditRow(null)
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-500 text-white bg-[#263F93] hover:opacity-90"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => {
                              setEditingNilai(null)
                              setEditRow(null)
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingNilai(row.id)
                            setEditRow({
                              min: row.min,
                              max: row.max,
                              huruf: row.huruf,
                              poin: row.poin,
                              lulus: row.lulus,
                            })
                          }}
                          className="flex items-center gap-1 text-xs text-[#263F93] hover:underline font-500"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Preview Keterangan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Nilai Tertinggi",
                value: "A (80–100)",
                color: "bg-[#263F93] text-white",
              },
              {
                label: "Batas Lulus",
                value: "C (60–64)",
                color: "bg-green-100 text-green-800",
              },
              {
                label: "Batas Tidak Lulus",
                value: "D (55–59)",
                color: "bg-orange-100 text-orange-800",
              },
              {
                label: "Nilai Terendah",
                value: "E (0–54)",
                color: "bg-red-100 text-red-800",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
              >
                <div className="text-xs text-gray-400 mb-1">{card.label}</div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-700 ${card.color}`}
                >
                  {card.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle
              size={14}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700">
              Perubahan konfigurasi nilai mutu akan mempengaruhi perhitungan IPK
              dan status kelulusan mata kuliah seluruh mahasiswa aktif secara
              real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Section 7: Regulasi & Aturan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={7}
          title="Regulasi & Aturan"
          onSave={() => showToast("Regulasi berhasil disimpan")}
        />
        <div className="p-5 space-y-4">
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Nama Aturan", "Deskripsi", "Nilai", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {regulasi.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 align-top">
                      {editRegulasi === r.id && editRegulasiRow ? (
                        <input
                          type="text"
                          value={editRegulasiRow.nama}
                          onChange={(e) => setEditRegulasiRow({ ...editRegulasiRow, nama: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                        />
                      ) : (
                        <span className="font-600 text-gray-800">{r.nama}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top min-w-[250px]">
                      {editRegulasi === r.id && editRegulasiRow ? (
                        <textarea
                          value={editRegulasiRow.deskripsi}
                          onChange={(e) => setEditRegulasiRow({ ...editRegulasiRow, deskripsi: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                          rows={2}
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">{r.deskripsi}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {editRegulasi === r.id && editRegulasiRow ? (
                        <input
                          type={editRegulasiRow.tipe}
                          value={editRegulasiRow.nilai}
                          onChange={(e) => setEditRegulasiRow({ ...editRegulasiRow, nilai: e.target.value })}
                          className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                        />
                      ) : (
                        <span className="font-mono font-600 text-[#263F93] bg-blue-50 px-2 py-1 rounded">
                          {r.nilai}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <button onClick={() => setRegulasi(prev => prev.map(x => x.id === r.id ? { ...x, aktif: !x.aktif } : x))}>
                        {r.aktif ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {editRegulasi === r.id && editRegulasiRow ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => {
                            if (editRegulasiRow) {
                              setRegulasi(prev => prev.map(x => x.id === r.id ? { ...x, ...editRegulasiRow } : x))
                              showToast(`Aturan berhasil diperbarui`)
                            }
                            setEditRegulasi(null)
                            setEditRegulasiRow(null)
                          }} className="px-2.5 py-1 rounded-lg text-xs font-500 text-white bg-[#263F93]">Simpan</button>
                          <button onClick={() => { setEditRegulasi(null); setEditRegulasiRow(null) }} className="p-1.5 text-gray-400"><X size={13} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditRegulasi(r.id); setEditRegulasiRow({ nama: r.nama, deskripsi: r.deskripsi, nilai: r.nilai, tipe: r.tipe as any }) }} className="text-xs text-[#263F93] hover:underline font-500">Edit</button>
                          <button onClick={() => {
                            if (window.confirm("Hapus regulasi ini?")) {
                              setRegulasi(prev => prev.filter(x => x.id !== r.id))
                              showToast("Regulasi dihapus")
                            }
                          }} className="text-xs text-red-500 hover:underline font-500">Hapus</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAddRegulasi ? (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-4 space-y-3">
              <h3 className="text-sm font-600 text-gray-800 border-b border-gray-200 pb-2">Tambah Regulasi Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-500 text-gray-600 mb-1">Nama Aturan</label>
                  <input type="text" value={regulasiForm.nama} onChange={(e) => setRegulasiForm({ ...regulasiForm, nama: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-500 text-gray-600 mb-1">Tipe Nilai</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" checked={regulasiForm.tipe === "number"} onChange={() => setRegulasiForm({ ...regulasiForm, tipe: "number" })} className="text-[#263F93]" /> Angka</label>
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" checked={regulasiForm.tipe === "text"} onChange={() => setRegulasiForm({ ...regulasiForm, tipe: "text" })} className="text-[#263F93]" /> Teks</label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-500 text-gray-600 mb-1">Deskripsi</label>
                  <textarea value={regulasiForm.deskripsi} onChange={(e) => setRegulasiForm({ ...regulasiForm, deskripsi: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
                </div>
                <div>
                  <label className="block text-xs font-500 text-gray-600 mb-1">Nilai/Parameter</label>
                  <input type={regulasiForm.tipe} value={regulasiForm.nilai} onChange={(e) => setRegulasiForm({ ...regulasiForm, nilai: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setShowAddRegulasi(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Batal</button>
                <button onClick={() => {
                  setRegulasi(prev => [...prev, { id: Date.now(), ...regulasiForm, aktif: true }]);
                  setShowAddRegulasi(false);
                  setRegulasiForm({ nama: "", deskripsi: "", nilai: "", tipe: "number" });
                  showToast("Regulasi baru ditambahkan");
                }} className="px-4 py-2 text-sm text-white font-500 rounded-lg" style={{ background: "#263F93" }}>Simpan</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddRegulasi(true)} className="flex items-center gap-2 text-sm text-[#263F93] hover:underline mt-2">
              <Plus size={14} /> Tambah Regulasi Baru
            </button>
          )}
        </div>
      </div>

      {/* Section 8: Jenis Pelanggaran */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionHeader
          num={8}
          title="Jenis Pelanggaran"
          onSave={() => showToast("Jenis pelanggaran disimpan")}
        />
        <div className="p-5 space-y-4">
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Nama Jenis", "Deskripsi", "Eskalasi", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jenisPelanggaran.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 align-top font-600 text-gray-800">
                      {editPelanggaran === p.id && editPelanggaranRow ? (
                        <input
                          type="text"
                          value={editPelanggaranRow.nama}
                          onChange={(e) => setEditPelanggaranRow({ ...editPelanggaranRow, nama: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                        />
                      ) : p.nama}
                    </td>
                    <td className="px-4 py-3 align-top text-gray-500 text-xs min-w-[200px]">
                      {editPelanggaran === p.id && editPelanggaranRow ? (
                        <textarea
                          value={editPelanggaranRow.deskripsi}
                          onChange={(e) => setEditPelanggaranRow({ ...editPelanggaranRow, deskripsi: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                          rows={2}
                        />
                      ) : p.deskripsi}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {editPelanggaran === p.id && editPelanggaranRow ? (
                        <select
                          value={editPelanggaranRow.eskalasi}
                          onChange={(e) => setEditPelanggaranRow({ ...editPelanggaranRow, eskalasi: e.target.value as any })}
                          className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                        >
                          <option value="normal">Normal (SP1→SP2→SP3)</option>
                          <option value="langsung_sp3">Langsung SP3</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-[10px] font-700 uppercase tracking-wide ${p.eskalasi === 'langsung_sp3' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {p.eskalasi === 'langsung_sp3' ? 'Langsung SP3' : 'Normal (SP1→SP2→SP3)'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <button onClick={() => setJenisPelanggaran(prev => prev.map(x => x.id === p.id ? { ...x, aktif: !x.aktif } : x))}>
                        {p.aktif ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {editPelanggaran === p.id && editPelanggaranRow ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => {
                            if (editPelanggaranRow) {
                              setJenisPelanggaran(prev => prev.map(x => x.id === p.id ? { ...x, ...editPelanggaranRow } : x))
                              showToast(`Pelanggaran berhasil diperbarui`)
                            }
                            setEditPelanggaran(null)
                            setEditPelanggaranRow(null)
                          }} className="px-2.5 py-1 rounded-lg text-xs font-500 text-white bg-[#263F93]">Simpan</button>
                          <button onClick={() => { setEditPelanggaran(null); setEditPelanggaranRow(null) }} className="p-1.5 text-gray-400"><X size={13} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditPelanggaran(p.id); setEditPelanggaranRow({ nama: p.nama, deskripsi: p.deskripsi, eskalasi: p.eskalasi as any }) }} className="text-xs text-[#263F93] hover:underline font-500">Edit</button>
                          <button onClick={() => {
                            if ([1, 2, 3].includes(p.id)) {
                              showToast("Jenis pelanggaran bawaan tidak dapat dihapus");
                            } else if (window.confirm("Hapus jenis pelanggaran ini?")) {
                              setJenisPelanggaran(prev => prev.filter(x => x.id !== p.id))
                              showToast("Jenis pelanggaran dihapus")
                            }
                          }} className="text-xs text-red-500 hover:underline font-500">Hapus</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAddPelanggaran ? (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-4 space-y-3">
              <h3 className="text-sm font-600 text-gray-800 border-b border-gray-200 pb-2">Tambah Jenis Pelanggaran</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-500 text-gray-600 mb-1">Nama</label>
                  <input type="text" value={pelanggaranForm.nama} onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, nama: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-500 text-gray-600 mb-1">Deskripsi</label>
                  <textarea value={pelanggaranForm.deskripsi} onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, deskripsi: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
                </div>
                <div>
                  <label className="block text-xs font-500 text-gray-600 mb-1">Eskalasi</label>
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" checked={pelanggaranForm.eskalasi === "normal"} onChange={() => setPelanggaranForm({ ...pelanggaranForm, eskalasi: "normal" })} className="text-[#263F93]" />
                      Normal (urut SP1→SP2→SP3)
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" checked={pelanggaranForm.eskalasi === "langsung_sp3"} onChange={() => setPelanggaranForm({ ...pelanggaranForm, eskalasi: "langsung_sp3" })} className="text-red-600" />
                      Langsung SP3
                    </label>
                  </div>
                  {pelanggaranForm.eskalasi === "langsung_sp3" && (
                    <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      <AlertTriangle size={14} className="text-red-600 mt-0.5" />
                      <p className="text-xs text-red-700">Peringatan: Mahasiswa yang melakukan pelanggaran ini akan langsung diberikan SP3 tanpa melalui SP1 dan SP2.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setShowAddPelanggaran(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Batal</button>
                <button onClick={() => {
                  setJenisPelanggaran(prev => [...prev, { id: Date.now(), ...pelanggaranForm, aktif: true }]);
                  setShowAddPelanggaran(false);
                  setPelanggaranForm({ nama: "", deskripsi: "", eskalasi: "normal" });
                  showToast("Jenis pelanggaran baru ditambahkan");
                }} className="px-4 py-2 text-sm text-white font-500 rounded-lg" style={{ background: "#263F93" }}>Simpan</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddPelanggaran(true)} className="flex items-center gap-2 text-sm text-[#263F93] hover:underline mt-2">
              <Plus size={14} /> Tambah Jenis Pelanggaran
            </button>
          )}
        </div>
      </div>

      {/* IPK Warning Modal */}
      {showIpkWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 text-center mb-2">
              Konfirmasi Perubahan
            </h3>
            <p className="text-gray-500 text-sm text-center mb-5">
              Mengubah threshold IPK ke <strong>{ipkMin}</strong> akan
              mempengaruhi evaluasi seluruh mahasiswa aktif. Lanjutkan?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowIpkWarning(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={saveRegulasiAll}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white"
                style={{ background: "#D97706" }}
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </div>
  )
}
