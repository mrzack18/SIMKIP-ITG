import { useState, useEffect } from "react"
import { api } from "@/services/api"
import type { Role } from "@/types"
import {
  getPeriodeList,
  createPeriode,
  updatePeriode,
  deletePeriode,
  activatePeriode,
  deactivatePeriode,
  getTahunAjaranList,
  createTahunAjaran,
  updateTahunAjaran,
  deleteTahunAjaran,
  activateTahunAjaran,
  deactivateTahunAjaran,
  type PeriodeItem,
  type TahunAjaranItem,
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
  Loader2,
  Calendar,
  Thermometer,
  BookOpen,
  Timer,
  FileText,
  Building2,
  Table,
  Scale,
  ShieldAlert,
} from "lucide-react"

const Toast = ({ msg, onClose }: { msg: string; onClose: () => void }) => (
  <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg z-50 text-sm animate-fade-in min-w-0">
    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
    <span className="break-words min-w-0 flex-1">{msg}</span>
    <button onClick={onClose} className="ml-2 text-white/60 hover:text-white flex-shrink-0">
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
  <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100 bg-gray-50/50 min-w-0">
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-6 h-6 rounded-full bg-[#263F93] flex items-center justify-center text-white text-xs font-700 flex-shrink-0">
        {num}
      </div>
      <h2 className="font-600 text-gray-800 text-sm truncate">{title}</h2>
    </div>
    {onSave && (
      <button
        onClick={onSave}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 text-white transition-colors shrink-0 whitespace-nowrap"
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
    <div className="flex gap-2 items-center flex-wrap min-w-0">
      <input
        type="text"
        placeholder="Nama Field (misal: Tanggal Sidang)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="flex-1 min-w-0 basis-40 text-xs px-2 py-1.5 border border-gray-200 rounded"
      />
      <select
        value={tipe}
        onChange={(e) => setTipe(e.target.value)}
        className="w-full min-[420px]:w-32 text-xs px-2 py-1.5 border border-gray-200 rounded"
      >
        <option value="text">Teks Singkat</option>
        <option value="date">Tanggal</option>
        <option value="url">Link / URL</option>
        <option value="number">Angka</option>
        <option value="dropdown">Dropdown</option>
      </select>
      <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
        <input type="checkbox" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} /> Wajib
      </label>
      <button
        onClick={handleAdd}
        disabled={saving || !label.trim()}
        className="px-3 py-1.5 bg-[#263F93] text-white text-xs rounded hover:bg-blue-800 disabled:opacity-50 w-full min-[420px]:w-auto whitespace-nowrap"
      >
        {saving ? "..." : "Tambah"}
      </button>
    </div>
  );
}

type TabKey =
  | "threshold" | "tahun" | "periode" | "prodi" | "dokumen"
  | "institusi" | "nilai" | "regulasi" | "pelanggaran"

/** Tab yang boleh dilihat role admin — sengaja hanya 5 dari 9. */
const ADMIN_TAB_KEYS: TabKey[] = ["threshold", "periode", "dokumen", "regulasi", "pelanggaran"]

/**
 * Keempat aturan di tab Regulasi. `key` adalah key di tabel `konfigurasi`;
 * flag aktifnya adalah `${key}_aktif`.
 *
 * "Minimum SKS per Semester" sengaja TIDAK ada di sini: key-nya
 * (`sks_minimum_semester`) tidak dibaca kode mana pun, jadi barisnya hanya akan
 * menampilkan toggle yang tidak mengendalikan apa-apa. Key-nya dibiarkan di DB.
 */
const ATURAN_AKADEMIK: { key: string; nama: string; deskripsi: string; fallback: string }[] = [
  { key: "ipk_minimum",       nama: "IPK Minimum",           fallback: "3.00", deskripsi: "Batas minimum IPK yang harus dicapai mahasiswa KIP-K per semester" },
  { key: "masa_tenggang_sp",  nama: "Masa Tenggang SP",      fallback: "90",   deskripsi: "Jumlah hari yang diberikan kepada mahasiswa untuk memperbaiki pelanggaran setelah SP diterbitkan" },
  { key: "max_semester",      nama: "Batas Semester Studi",  fallback: "8",    deskripsi: "Jumlah semester maksimum yang diperbolehkan untuk penerima KIP-K" },
  { key: "sks_minimum_lulus", nama: "Total SKS Kelulusan",   fallback: "144",  deskripsi: "Total minimum SKS untuk kelulusan mahasiswa KIP-K" },
]

/**
 * Susun baris Regulasi dari payload indexAll().
 *
 * `aktif` dibaca dari `aturan_akademik[`${key}_aktif`]` yang dikirim server
 * sebagai BOOLEAN. Fallback `?? true` menjaga perilaku bila server belum
 * diperbarui — key flag yang belum ada memang berarti aturan hidup.
 */
function buildRegulasi(d: any) {
  return ATURAN_AKADEMIK.map((a, i) => ({
    id: i + 1,
    key: a.key,
    nama: a.nama,
    deskripsi: a.deskripsi,
    tipe: "number" as const,
    nilai: d?.aturan_akademik?.[a.key] ?? a.fallback,
    aktif: d?.aturan_akademik?.[`${a.key}_aktif`] ?? true,
  }))
}

interface KonfigurasiProps {
  /** Role pemakai halaman. Menentukan tab yang tampil. Default "lsipd" (9 tab). */
  role?: Role
}

export default function Konfigurasi({ role = "lsipd" }: KonfigurasiProps) {
  const [activeSection, setActiveSection] = useState("threshold")
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

  // Section 2.5: Tahun Ajaran state
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaranItem[]>([])
  const [modalTahunAjaranOpen, setModalTahunAjaranOpen] = useState(false)
  const [editingTahunAjaran, setEditingTahunAjaran] = useState<TahunAjaranItem | null>(null)
  const [taForm, setTaForm] = useState<{ tahun_akademik: string; semester: "Ganjil" | "Genap"; is_aktif: boolean }>({
    tahun_akademik: "",
    semester: "Ganjil",
    is_aktif: false,
  })
  const [savingTa, setSavingTa] = useState(false)

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
  // Diisi buildRegulasi() saat fetch selesai; bentuknya ditentukan ATURAN_AKADEMIK.
  const [regulasi, setRegulasi] = useState<any[]>([])
  // Tidak ada state "tambah regulasi": keempat baris Regulasi adalah key tetap
  // di tabel konfigurasi (lihat catatan di tab Regulasi).
  const [editRegulasi, setEditRegulasi] = useState<number | null>(null)
  const [editRegulasiRow, setEditRegulasiRow] = useState<{nama: string, deskripsi: string, nilai: string, tipe: "number" | "text"} | null>(null)

  // Section 8 State: Jenis Pelanggaran

  const [tahunAjaranOptions, setTahunAjaranOptions] = useState<string[]>([])

  const fetchPeriodeData = async () => {
    try {
      const list = await getPeriodeList();
      setPeriodeList(list);
    } catch (e: any) {
      console.error("[Konfigurasi] gagal memuat periode:", e?.status, e?.message);
    }
  }

  const fetchData = async () => {
    try {
      const res: any = await api.get("/konfigurasi/all")
      if (res.success) {
        const d = res.data
        setInstitusi(d.institusi)

        // Baris Regulasi disusun dari aturan_akademik — nilai dari key polosnya,
        // status aktif dari `${key}_aktif`. Bentuknya dijaga satu tempat di
        // ATURAN_AKADEMIK supaya tabel, simpan, dan state awal tidak bisa
        // berbeda satu sama lain.
        setRegulasi(buildRegulasi(d))

        setNilaiMutu(d.nilai_mutu || [])
        setJenisPelanggaran(d.jenis_pelanggaran || [])
        setProdis(d.prodis || [])
        setDokumens(d.dokumens || [])
        setTahunAjaranOptions(d.tahun_ajaran_options || [])
        setTahunAjaranList(d.tahun_ajaran_list || [])

        // Preview dampak periode aktif, dikirim indexAll() sebagai mahasiswa_count_aktif.
        if (typeof d.mahasiswa_count_aktif === "number") setTotalMahasiswaAktif(d.mahasiswa_count_aktif)

        const ipkMinObj = regArr.find((r:any) => r.nama === "IPK Minimum")
        if (ipkMinObj) setIpkMin(parseFloat(ipkMinObj.nilai))
      }
    } catch (e: any) {
      console.error("[Konfigurasi] gagal memuat data:", e?.status, e?.message);
    }
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

  
  /**
   * Menyimpan keempat ambang batas akademik beserta flag aktif/nonaktifnya.
   *
   * `rows` eksplisit diperlukan karena setState belum flush saat handler klik
   * berjalan — pemanggil dari tab Regulasi mengirim baris hasil edit langsung.
   * `syncIpkWidget` dimatikan oleh pemanggil itu supaya nilai dari widget IPK
   * tidak menimpa edit baris "IPK Minimum".
   *
   * Flag dikirim sebagai STRING '1'/'0', bukan boolean: kolom `value` bertipe
   * text dan PDO menyimpan boolean false sebagai string KOSONG, yang tidak bisa
   * dibedakan dari nilai rusak. Server menormalkan lagi sebagai lapis kedua.
   */
  const saveRegulasiAll = async (rows = regulasi, syncIpkWidget = true) => {
    const payload: any = {};
    rows.forEach(r => {
       if (!r.key) return;
       payload[r.key] = r.nilai;
       payload[`${r.key}_aktif`] = r.aktif ? '1' : '0';
    });
    if (syncIpkWidget) payload.ipk_minimum = ipkMin; // from the dedicated UI
    try {
      await api.put('/konfigurasi', payload);
      await fetchData();
      setShowIpkWarning(false);
      showToast("Konfigurasi berhasil disimpan");
      return true;
    } catch (e: any) {
      // 403 dari penjaga per-key admin, atau kegagalan jaringan — jangan biarkan
      // modal IPK menggantung tanpa umpan balik.
      console.error("[Konfigurasi] gagal menyimpan:", e?.status, e?.message);
      showToast(e?.message || "Gagal menyimpan konfigurasi");
      return false;
    }
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

  const handleTogglePelanggaran = async (id: number) => {
      try {
          // Pakai endpoint toggle khusus supaya tidak menulis ulang seluruh baris.
          await api.patch('/konfigurasi/pelanggaran/'+id+'/toggle');
          await fetchData();
      } catch (e: any) {
          console.error("[Konfigurasi] gagal mengubah status pelanggaran:", e?.status, e?.message);
          showToast(e?.message || "Gagal mengubah status pelanggaran");
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
    if (!window.confirm(`Aktifkan periode ${item.tahun_akademik} ${item.semester}?\n\nMahasiswa akan bisa input nilai KHS untuk tahun ajaran ini. Periode tahun ajaran lain yang sudah aktif TETAP aktif.`)) return;
    await activatePeriode(item.id);
    showToast(`Periode ${item.tahun_akademik} ${item.semester} diaktifkan`);
    await fetchPeriodeData();
    await fetchData();
  };

  /**
   * Nonaktifkan satu periode saja.
   *
   * Dulu fungsi ini mencari "periode aktif" tunggal lalu meng-update-nya. Sekarang
   * periode yang dinonaktifkan ditentukan dari baris yang diklik, karena bisa ada
   * beberapa periode aktif sekaligus.
   */
  const handleDeactivatePeriode = async (item: PeriodeItem) => {
    if (!window.confirm(`Nonaktifkan periode ${item.tahun_akademik} ${item.semester}?\n\nMahasiswa tidak akan bisa input nilai KHS untuk tahun ajaran ini. Periode tahun ajaran lain tidak terpengaruh.`)) return;
    await deactivatePeriode(item.id);
    showToast(`Periode ${item.tahun_akademik} ${item.semester} dinonaktifkan`);
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

  // ── Tahun Ajaran handlers ──
  const openAddTahunAjaran = () => {
    setEditingTahunAjaran(null);
    setTaForm({ tahun_akademik: "", semester: "Ganjil", is_aktif: false });
    setModalTahunAjaranOpen(true);
  };

  const openEditTahunAjaran = (item: TahunAjaranItem) => {
    setEditingTahunAjaran(item);
    setTaForm({ tahun_akademik: item.tahun_akademik, semester: item.semester as "Ganjil" | "Genap", is_aktif: item.is_aktif });
    setModalTahunAjaranOpen(true);
  };

  const handleSubmitTahunAjaran = async () => {
    const ta = taForm.tahun_akademik.trim();
    if (!ta) { showToast("Tahun akademik wajib diisi (contoh: 2025/2026)"); return; }
    // Validasi format tahun akademik YYYY/YYYY
    if (!/^\d{4}\/\d{4}$/.test(ta)) {
      showToast("Format tahun akademik salah. Gunakan format YYYY/YYYY (contoh: 2025/2026).");
      return;
    }
    setSavingTa(true);
    try {
      if (editingTahunAjaran) {
        await updateTahunAjaran(editingTahunAjaran.id, taForm);
        showToast(`Tahun ajaran ${ta} ${taForm.semester} diperbarui`);
      } else {
        await createTahunAjaran(taForm);
        showToast(`Tahun ajaran ${ta} ${taForm.semester} ditambahkan`);
      }
      setModalTahunAjaranOpen(false);
      await fetchData();
    } catch (e: any) {
      showToast(e?.response?.data?.message ?? e?.message ?? "Gagal menyimpan tahun ajaran");
    } finally {
      setSavingTa(false);
    }
  };

  const handleActivateTahunAjaran = async (item: TahunAjaranItem) => {
    if (item.is_aktif) return;
    if (!window.confirm(`Aktifkan tahun ajaran ${item.tahun_akademik} ${item.semester}?\n\nTahun ajaran ini menjadi dasar default filter dan semester aktif.`)) return;
    try {
      await activateTahunAjaran(item.id);
      showToast(`Tahun ajaran ${item.tahun_akademik} ${item.semester} diaktifkan`);
      await fetchData();
    } catch (e: any) {
      showToast(e?.response?.data?.message ?? "Gagal mengaktifkan tahun ajaran");
    }
  };

  const handleDeactivateTahunAjaran = async (item: TahunAjaranItem) => {
    if (!item.is_aktif) return;
    if (!window.confirm(`Nonaktifkan tahun ajaran ${item.tahun_akademik} ${item.semester}?\n\nTidak akan ada tahun ajaran aktif sampai yang lain diaktifkan.`)) return;
    try {
      await deactivateTahunAjaran(item.id);
      showToast(`Tahun ajaran ${item.tahun_akademik} ${item.semester} dinonaktifkan`);
      await fetchData();
    } catch (e: any) {
      showToast(e?.response?.data?.message ?? "Gagal menonaktifkan tahun ajaran");
    }
  };

  const handleDeleteTahunAjaran = async (item: TahunAjaranItem) => {
    if (item.is_aktif) {
      showToast("Tidak dapat menghapus tahun ajaran yang aktif. Nonaktifkan dulu.");
      return;
    }
    if (!window.confirm(`Hapus tahun ajaran ${item.tahun_akademik} ${item.semester}?\n\nTindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await deleteTahunAjaran(item.id);
      showToast("Tahun ajaran dihapus");
      await fetchData();
    } catch (e: any) {
      showToast(e?.response?.data?.message ?? "Gagal menghapus tahun ajaran");
    }
  };

  const handleSavePelanggaran = async (data: any, id: number|null = null) => {
      try {
          if(id) {
              await api.put('/konfigurasi/pelanggaran/'+id, data);
          } else {
              await api.post('/konfigurasi/pelanggaran', data);
          }
          await fetchData();
          showToast("Tersimpan");
          return true;
      } catch (e: any) {
          // storePelanggaran memvalidasi nama unik → nama duplikat membalas 422.
          console.error("[Konfigurasi] gagal menyimpan pelanggaran:", e?.status, e?.message);
          showToast(e?.message || "Gagal menyimpan jenis pelanggaran");
          return false;
      }
  }

  const handleDeletePelanggaran = async (id: number) => {
      try {
          await api.delete('/konfigurasi/pelanggaran/'+id);
          await fetchData();
          showToast("Jenis pelanggaran dihapus");
      } catch (e: any) {
          console.error("[Konfigurasi] gagal menghapus pelanggaran:", e?.status, e?.message);
          showToast(e?.message || "Gagal menghapus jenis pelanggaran");
      }
  }

  const ALL_TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: "threshold",  label: "IPK",          icon: Thermometer },
    { key: "tahun",      label: "Tahun Ajaran", icon: BookOpen },
    { key: "periode",    label: "Periode Input",icon: Timer },
    { key: "prodi",      label: "Prodi",        icon: GraduationCap },
    { key: "dokumen",    label: "Dokumen",      icon: FileText },
    { key: "institusi",  label: "Institusi",    icon: Building2 },
    { key: "nilai",      label: "Nilai Mutu",   icon: Table },
    { key: "regulasi",   label: "Regulasi",     icon: Scale },
    { key: "pelanggaran",label: "Pelanggaran",  icon: ShieldAlert },
  ]

  // admin hanya melihat sebagian tab; lsipd melihat semuanya.
  const allowedKeys: TabKey[] = role === "admin" ? ADMIN_TAB_KEYS : ALL_TABS.map((t) => t.key)
  const TABS = ALL_TABS.filter((t) => allowedKeys.includes(t.key))

  // Cadangan bila activeSection berada di luar daftar tab role ini — diselesaikan
  // pada render yang sama, tanpa useEffect, sehingga section milik role lain
  // tidak pernah sempat tampil.
  const current: TabKey = allowedKeys.includes(activeSection as TabKey)
    ? (activeSection as TabKey)
    : TABS[0].key
  const show = (key: TabKey) => current === key

  // Nomor section diturunkan dari tab yang SEDANG tampil, supaya penomorannya
  // selalu urut: admin 1..5, lsipd tetap 1..9 seperti sebelumnya.
  const sectionNum = (key: TabKey) => TABS.findIndex((t) => t.key === key) + 1

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-7xl mx-auto min-w-0">
      <div className="min-w-0">
        <h1 className="font-display font-700 text-lg sm:text-xl text-gray-900 leading-tight">
          Konfigurasi Sistem
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Pengaturan global yang mempengaruhi seluruh logika bisnis SIMKIP-ITG
        </p>
      </div>

      {/* Navigasi tab */}
      <div className="sticky top-14 z-20 bg-[#F1F5F9]/95 backdrop-blur-sm flex gap-1.5 overflow-x-auto pb-1.5 -mx-1 px-1 flex-nowrap pt-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = current === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveSection(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-600 whitespace-nowrap transition-colors flex-shrink-0 ${
                isActive
                  ? "bg-[#263F93] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon size={14} className={isActive ? "" : "text-[#263F93]"} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Section 1: IPK Threshold */}
      {show("threshold") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <SectionHeader
            num={sectionNum("threshold")}
            title="Ambang Batas IPK (Threshold)"
            onSave={() => setShowIpkWarning(true)}
          />
        <div className="p-3 sm:p-4 space-y-4 min-w-0">
          <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="shrink-0">
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                IPK Minimum
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit">
                <button
                  onClick={() =>
                    setIpkMin((v) =>
                      Math.max(0, Math.round((v - 0.1) * 10) / 10),
                    )
                  }
                  aria-label="Kurangi IPK minimum"
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
                  aria-label="Tambah IPK minimum"
                  className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-700 text-lg border-l border-gray-200"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 flex-1 min-w-0 break-words">
              Mahasiswa dengan IPK di bawah nilai ini akan ditandai untuk
              evaluasi dan penerbitan SP.
            </p>
          </div>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 sm:px-4 py-3 min-w-0">
            <AlertTriangle
              size={15}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700 break-words min-w-0">
              Perubahan threshold akan mempengaruhi evaluasi seluruh {167}{" "}
              mahasiswa aktif secara real-time.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Section 2: Master Tahun Ajaran */}
      {show("tahun") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100 bg-gray-50/50 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#263F93] flex items-center justify-center text-white text-xs font-700 flex-shrink-0">
                {sectionNum("tahun")}
              </div>
              <div className="min-w-0">
                <h2 className="font-600 text-gray-800 text-sm">Master Tahun Ajaran</h2>
                <p className="text-xs text-gray-500 mt-0.5 break-words">
                  Buat tahun ajaran secara manual mengikuti kalender akademik kampus. Menjadi dasar filter dan periode input nilai.
                </p>
              </div>
            </div>
            <button
              onClick={openAddTahunAjaran}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 text-white transition-colors w-full sm:w-auto shrink-0 whitespace-nowrap"
              style={{ background: "#263F93" }}
            >
              <Plus size={12} /> Tambah Tahun Ajaran
            </button>
          </div>
          <div className="p-3 sm:p-4 min-w-0">
            {tahunAjaranList.length === 0 ? (
              <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-6 text-center">
                Belum ada tahun ajaran. Klik "Tambah Tahun Ajaran" untuk membuat sesuai kalender akademik kampus.
              </div>
            ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Tahun Akademik", "Semester", "Status", "Aksi"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tahunAjaranList.map((ta) => (
                    <tr key={ta.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3 font-600 text-gray-800 whitespace-nowrap">{ta.tahun_akademik}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-600 ${
                          ta.semester === "Ganjil"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {ta.semester}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => ta.is_aktif 
                            ? handleDeactivateTahunAjaran(ta)
                            : handleActivateTahunAjaran(ta)}
                          className={ta.is_aktif
                            ? "flex items-center gap-1.5 text-xs text-green-600 font-500"
                            : "flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 font-500"}
                          title={ta.is_aktif ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                        >
                          {ta.is_aktif ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                          {ta.is_aktif ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditTahunAjaran(ta)} className="text-xs text-[#263F93] hover:underline font-500">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteTahunAjaran(ta)} className="text-xs text-red-500 hover:underline font-500">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Section 3: Periode Input Nilai (single source of truth: tabel periode_akademiks) */}
      {show("periode") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100 bg-gray-50/50 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#263F93] flex items-center justify-center text-white text-xs font-700 flex-shrink-0">
                {sectionNum("periode")}
              </div>
              <div className="min-w-0">
                <h2 className="font-600 text-gray-800 text-sm">Periode Input Nilai KHS</h2>
                <p className="text-xs text-gray-500 mt-0.5 break-words">
                  Atur kapan mahasiswa KIP-K dapat mengajukan nilai KHS untuk divalidasi admin
                </p>
              </div>
            </div>
            <button
              onClick={handleAddPeriode}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-500 text-white transition-colors w-full sm:w-auto shrink-0 whitespace-nowrap"
              style={{ background: "#263F93" }}
            >
              <Plus size={12} /> Tambah Periode
            </button>
          </div>
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 min-w-0">
          <PeriodeAktifCard
            periodesAktif={periodeList.filter(p => p.is_aktif)}
            totalMahasiswaAktif={totalMahasiswaAktif}
            onEdit={handleEditPeriode}
            onDeactivate={handleDeactivatePeriode}
            onActivateAnother={handleAddPeriode}
          />

          <TimelinePeriode
            items={periodeList}
            onActivate={handleActivatePeriode}
            onDeactivate={handleDeactivatePeriode}
            onEdit={handleEditPeriode}
            onDelete={handleDeletePeriode}
          />
        </div>
      </div>
      )}

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

      {/* Tahun Ajaran Form Modal */}
      {modalTahunAjaranOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto min-w-0">
            <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3.5 sm:py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar size={18} className="text-[#263F93] flex-shrink-0" />
                <h3 className="font-display font-700 text-xs sm:text-sm text-gray-900">
                  {editingTahunAjaran ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran"}
                </h3>
              </div>
              <button onClick={() => setModalTahunAjaranOpen(false)} aria-label="Tutup" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0">
                <X size={18} />
              </button>
            </div>
            <div className="p-3 sm:p-4 space-y-4 min-w-0">
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1">Tahun Akademik</label>
                <input
                  type="text"
                  value={taForm.tahun_akademik}
                  onChange={(e) => setTaForm({ ...taForm, tahun_akademik: e.target.value })}
                  placeholder="contoh: 2025/2026"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                />
                <p className="text-[11px] text-gray-400 mt-1">Gunakan format YYYY/YYYY sesuai kalender akademik kampus.</p>
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1">Semester</label>
                <select
                  value={taForm.semester}
                  onChange={(e) => setTaForm({ ...taForm, semester: e.target.value as "Ganjil" | "Genap" })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
              <label className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={taForm.is_aktif}
                  onChange={(e) => setTaForm({ ...taForm, is_aktif: e.target.checked })}
                  className="mt-0.5"
                />
                <div>
                  <div className="text-xs font-600 text-amber-800">Jadikan tahun ajaran aktif</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">
                    Menjadi dasar default filter dan semester aktif. Tahun ajaran aktif lainnya otomatis dinonaktifkan.
                  </div>
                </div>
              </label>
            </div>
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 px-3 sm:px-4 py-3 border-t bg-gray-50/50">
              <button
                onClick={() => setModalTahunAjaranOpen(false)}
                disabled={savingTa}
                className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitTahunAjaran}
                disabled={savingTa}
                className="flex-1 py-2 rounded-lg text-sm font-500 text-white flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
                style={{ background: "#263F93" }}
              >
                {savingTa ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {editingTahunAjaran ? "Simpan Perubahan" : "Tambah Tahun Ajaran"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Master Prodi */}
      {show("prodi") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <SectionHeader num={sectionNum("prodi")} title="Master Data Program Studi" />
        <div className="p-3 sm:p-4 space-y-3 min-w-0">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Nama Prodi", "Kode", "Status", "Aksi"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 pr-3 last:pr-0 text-xs font-600 text-gray-500 uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {prodis.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 pr-3 font-500 text-gray-800 break-words min-w-[140px]">{p.nama}</td>
                  <td className="py-2.5 pr-3 font-mono text-gray-500 whitespace-nowrap">{p.kode}</td>
                  <td className="py-2.5 pr-3">
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
                        <span className="flex items-center gap-1 text-xs text-green-600 whitespace-nowrap">
                          <ToggleRight size={16} /> Aktif
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                          <ToggleLeft size={16} /> Nonaktif
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-[#263F93] hover:underline whitespace-nowrap">
                        Edit
                      </button>
                      <button className="text-xs text-red-500 hover:underline whitespace-nowrap">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {showAddProdi && (
            <div className="flex flex-col sm:flex-row gap-2 mt-3 min-w-0">
              <input
                value={newProdi.nama}
                onChange={(e) =>
                  setNewProdi((f) => ({ ...f, nama: e.target.value }))
                }
                placeholder="Nama Prodi"
                className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
              <input
                value={newProdi.kode}
                onChange={(e) =>
                  setNewProdi((f) => ({ ...f, kode: e.target.value }))
                }
                placeholder="Kode"
                className="w-full sm:w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
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
                className="px-3 py-2 rounded-lg text-sm font-500 text-white whitespace-nowrap"
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
      )}

      {/* Section 5: Dokumen Kewajiban */}
      {show("dokumen") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <SectionHeader
          num={sectionNum("dokumen")}
          title="Jenis Dokumen Kewajiban"
          onSave={() => showToast("Konfigurasi dokumen disimpan")}
        />
        <div className="p-3 sm:p-4 space-y-1 min-w-0">
          {dokumens.map((d: any) => (
            <div key={d.id} className="border-b border-gray-50 last:border-0 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 py-2 min-w-0">
                <button
                  onClick={async () => {
                    try {
                      await api.patch('/konfigurasi/dokumen-jenis/' + d.id + '/toggle');
                      fetchData();
                    } catch { showToast("Gagal mengubah status dokumen"); }
                  }}
                  className="flex-shrink-0"
                >
                  {d.is_wajib ? (
                    <ToggleRight size={22} className="text-[#263F93]" />
                  ) : (
                    <ToggleLeft size={22} className="text-gray-400" />
                  )}
                </button>
                <span className="flex-1 min-w-0 text-sm text-gray-700 break-words">{d.nama}</span>
                <span className="text-xs font-mono text-gray-400 hidden min-[420px]:inline shrink-0">{d.kode}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-500 whitespace-nowrap shrink-0 ${
                    d.is_wajib
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {d.is_wajib ? "Wajib" : "Tidak Wajib"}
                </span>
                <button
                  onClick={() => setExpandedDokumen(expandedDokumen === d.id ? null : d.id)}
                  className="p-1 text-gray-400 hover:text-[#263F93] rounded flex-shrink-0"
                  title="Atur custom fields"
                >
                  <Settings size={16} />
                </button>
              </div>
              {expandedDokumen === d.id && (
                <div className="pl-2 sm:pl-10 pr-0 sm:pr-4 pb-4 min-w-0">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs font-600 text-gray-700 mb-2">Custom Fields (Opsional)</h4>
                    <div className="space-y-2 mb-3 min-w-0">
                      {(d.fields || []).map((f: any) => (
                        <div key={f.id} className="flex items-center gap-2 text-xs bg-white p-2 border border-gray-100 rounded min-w-0">
                          <span className="font-500 text-gray-700 flex-1 min-w-0 break-words">{f.label}</span>
                          <span className="text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded text-[10px] uppercase shrink-0 whitespace-nowrap">{f.tipe}</span>
                          {f.is_required && <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded text-[10px] shrink-0 whitespace-nowrap">Wajib</span>}
                          <button
                            onClick={async () => {
                              if (confirm("Hapus field ini?")) {
                                await api.delete(`/konfigurasi/dokumen-jenis-fields/${f.id}`);
                                fetchData();
                              }
                            }}
                            className="text-red-400 hover:text-red-600 flex-shrink-0"
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
      )}

      {/* Section 6: Informasi Institusi */}
      {show("institusi") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <SectionHeader
            num={sectionNum("institusi")}
            title="Informasi Institusi"
            onSave={() => showToast("Informasi institusi diperbarui")}
          />
        <div className="p-3 sm:p-4 space-y-4 min-w-0">
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
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:border-gray-300 cursor-pointer transition-colors min-w-0">
              <p className="text-xs sm:text-sm text-gray-400 break-words">
                Klik untuk upload logo (PNG/SVG, maks. 2MB)
              </p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Section 7: Konfigurasi Nilai Mutu */}
      {show("nilai") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <SectionHeader
            num={sectionNum("nilai")}
            title="Konfigurasi Nilai Mutu"
            onSave={() => showToast("Konfigurasi nilai mutu berhasil disimpan")}
          />
        <div className="p-3 sm:p-4 space-y-4 min-w-0">
          {/* Deskripsi */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3.5 sm:px-4 py-3 min-w-0">
            <GraduationCap
              size={15}
              className="text-[#263F93] flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-[#263F93] break-words min-w-0">
              Tabel konversi nilai angka ke nilai huruf dan poin mutu.
              Konfigurasi ini digunakan sebagai acuan penilaian mata kuliah
              mahasiswa KIP-K.
            </p>
          </div>

          {/* Tabel Nilai Mutu */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] text-sm">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 min-w-0">
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
                className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-100 min-w-0"
              >
                <div className="text-xs text-gray-400 mb-1 break-words">{card.label}</div>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-700 whitespace-nowrap ${card.color}`}
                >
                  {card.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 sm:px-4 py-3 min-w-0">
            <AlertTriangle
              size={14}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700 break-words min-w-0">
              Perubahan konfigurasi nilai mutu akan mempengaruhi perhitungan IPK
              dan status kelulusan mata kuliah seluruh mahasiswa aktif secara
              real-time.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Section 8: Regulasi & Aturan */}
      {show("regulasi") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <SectionHeader
            num={sectionNum("regulasi")}
            title="Regulasi & Aturan"
            /* syncIpkWidget=false: simpan persis yang tampil di tabel ini. */
            onSave={() => saveRegulasiAll(regulasi, false)}
          />
        <div className="p-3 sm:p-4 space-y-4 min-w-0">
          <div className="overflow-x-auto rounded-xl border border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Nama Aturan", "Deskripsi", "Nilai", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap">
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
                      <button
                        title={r.aktif ? "Klik untuk menonaktifkan aturan ini" : "Klik untuk mengaktifkan aturan ini"}
                        onClick={async () => {
                          // Baris hasil toggle dikirim eksplisit: setState belum flush di sini.
                          // syncIpkWidget=false agar nilai widget IPK tidak ikut tertulis.
                          const next = regulasi.map(x => x.id === r.id ? { ...x, aktif: !x.aktif } : x)
                          const ok = await saveRegulasiAll(next, false)
                          if (!ok) return
                          setRegulasi(next)
                        }}>
                        {r.aktif ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {editRegulasi === r.id && editRegulasiRow ? (
                        <div className="flex gap-1.5">
                          <button onClick={async () => {
                            if (!editRegulasiRow) return
                            // Baris hasil edit dikirim eksplisit: setState belum flush di sini.
                            // syncIpkWidget=false agar edit baris "IPK Minimum" tidak ditimpa widget IPK.
                            const next = regulasi.map(x => x.id === r.id ? { ...x, ...editRegulasiRow } : x)
                            const ok = await saveRegulasiAll(next, false)
                            if (!ok) return
                            setRegulasi(next)
                            setEditRegulasi(null)
                            setEditRegulasiRow(null)
                          }} className="px-2.5 py-1 rounded-lg text-xs font-500 text-white bg-[#263F93]">Simpan</button>
                          <button onClick={() => { setEditRegulasi(null); setEditRegulasiRow(null) }} className="p-1.5 text-gray-400"><X size={13} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditRegulasi(r.id); setEditRegulasiRow({ nama: r.nama, deskripsi: r.deskripsi, nilai: r.nilai, tipe: r.tipe as any }) }} className="text-xs text-[#263F93] hover:underline font-500">Edit</button>
                          {/* Tidak ada tombol Hapus: keempat baris ini adalah key tetap di tabel
                              konfigurasi, jadi menghapusnya hanya membuat fetchData() memulihkan
                              barisnya dari nilai default. */}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tidak ada "Tambah Regulasi Baru": keempat baris ini key tetap di tabel
              konfigurasi, jadi menambah baris hanya menciptakan key asing yang
              ditolak untuk admin (403) dan menjadi key yatim untuk lsipd. */}
        </div>
      </div>
      )}

      {/* Section 9: Jenis Pelanggaran */}
      {show("pelanggaran") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          {/* Tanpa onSave: tiap baris tersimpan sendiri (toggle/edit/tambah/hapus),
              jadi tombol "Simpan" di header tidak punya apa pun untuk disimpan. */}
          <SectionHeader
            num={sectionNum("pelanggaran")}
            title="Jenis Pelanggaran"
          />
        <div className="p-3 sm:p-4 space-y-4 min-w-0">
          <div className="overflow-x-auto rounded-xl border border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Nama Jenis", "Deskripsi", "Eskalasi", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-gray-500 uppercase tracking-wide whitespace-nowrap">
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
                      <button onClick={() => handleTogglePelanggaran(p.id)}>
                        {p.aktif ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {editPelanggaran === p.id && editPelanggaranRow ? (
                        <div className="flex gap-1.5">
                          <button onClick={async () => {
                            if (!editPelanggaranRow) return
                            const ok = await handleSavePelanggaran(editPelanggaranRow, p.id)
                            if (!ok) return
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
                              handleDeletePelanggaran(p.id)
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
            <div className="bg-gray-50 rounded-xl p-3.5 sm:p-4 border border-gray-200 mt-4 space-y-3 min-w-0">
              <h3 className="text-sm font-600 text-gray-800 border-b border-gray-200 pb-2">Tambah Jenis Pelanggaran</h3>
              <div className="grid grid-cols-1 gap-3 min-w-0">
                <div>
                  <label className="block text-xs font-500 text-gray-600 mb-1">Nama</label>
                  <input type="text" value={pelanggaranForm.nama} onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, nama: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-500 text-gray-600 mb-1">Deskripsi</label>
                  <textarea value={pelanggaranForm.deskripsi} onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, deskripsi: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs font-500 text-gray-600 mb-1">Eskalasi</label>
                  <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-2 min-[420px]:gap-4 mt-1">
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
                    <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 min-w-0">
                      <AlertTriangle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-700 break-words min-w-0">Peringatan: Mahasiswa yang melakukan pelanggaran ini akan langsung diberikan SP3 tanpa melalui SP1 dan SP2.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 min-[420px]:justify-end pt-2">
                <button onClick={() => setShowAddPelanggaran(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg whitespace-nowrap">Batal</button>
                <button onClick={async () => {
                  const ok = await handleSavePelanggaran(pelanggaranForm, null);
                  if (!ok) return;
                  setShowAddPelanggaran(false);
                  setPelanggaranForm({ nama: "", deskripsi: "", eskalasi: "normal" });
                }} className="px-4 py-2 text-sm text-white font-500 rounded-lg whitespace-nowrap" style={{ background: "#263F93" }}>Simpan</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddPelanggaran(true)} className="flex items-center gap-2 text-sm text-[#263F93] hover:underline mt-2">
              <Plus size={14} /> Tambah Jenis Pelanggaran
            </button>
          )}
        </div>
      </div>
      )}

      {/* IPK Warning Modal */}
      {showIpkWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl min-w-0">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <h3 className="font-display font-700 text-base sm:text-lg text-gray-900 text-center mb-2">
              Konfirmasi Perubahan
            </h3>
            <p className="text-gray-500 text-sm text-center mb-5 break-words">
              Mengubah threshold IPK ke <strong>{ipkMin}</strong> akan
              mempengaruhi evaluasi seluruh mahasiswa aktif. Lanjutkan?
            </p>
            <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowIpkWarning(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={() => saveRegulasiAll()}
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
