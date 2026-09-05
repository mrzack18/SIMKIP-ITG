import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Save,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import type { PeriodeItem } from "@/services/konfigurasiService";

interface Props {
  open: boolean;
  initial: PeriodeItem | null;
  tahunAjaranOptions: string[];
  onClose: () => void;
  onSubmit: (data: {
    tahun_akademik: string;
    semester: "Ganjil" | "Genap";
    tanggal_buka: string;
    tanggal_tutup: string;
    is_aktif: boolean;
  }) => Promise<void>;
}

const formatTgl = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function PeriodeFormModal({
  open,
  initial,
  tahunAjaranOptions,
  onClose,
  onSubmit,
}: Props) {
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [semester, setSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [tglBuka, setTglBuka] = useState("");
  const [tglTutup, setTglTutup] = useState("");
  const [isAktif, setIsAktif] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      if (initial) {
        setTahunAjaran(initial.tahun_akademik);
        setSemester(initial.semester as "Ganjil" | "Genap");
        setTglBuka(initial.tanggal_buka?.substring(0, 10) ?? "");
        setTglTutup(initial.tanggal_tutup?.substring(0, 10) ?? "");
        setIsAktif(initial.is_aktif);
      } else {
        // Default: TA aktif dari opsi (yang pertama), semester Genap (umumnya periode ditutup akhir tahun)
        setTahunAjaran(tahunAjaranOptions[0] ?? "");
        setSemester("Genap");
        setTglBuka("");
        setTglTutup("");
        setIsAktif(false);
      }
    }
  }, [open, initial, tahunAjaranOptions]);

  if (!open) return null;

  const handleSubmit = async () => {
    setError("");
    if (!tahunAjaran) return setError("Pilih tahun ajaran.");
    if (!tglBuka || !tglTutup) return setError("Tanggal buka & tutup wajib diisi.");
    if (tglTutup <= tglBuka) return setError("Tanggal tutup harus setelah tanggal buka.");

    setSaving(true);
    try {
      await onSubmit({
        tahun_akademik: tahunAjaran,
        semester,
        tanggal_buka: tglBuka,
        tanggal_tutup: tglTutup,
        is_aktif: isAktif,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Gagal menyimpan periode.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3.5 sm:py-4 border-b min-w-0" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center gap-2 min-w-0">
            <Calendar size={18} className="text-[#263F93] flex-shrink-0" />
            <h3 className="font-display font-700 text-xs sm:text-sm text-gray-900 truncate">
              {initial ? "Edit Periode" : "Tambah Periode"}
            </h3>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-4 space-y-4 min-w-0">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle size={13} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-600 text-gray-600 mb-1">Tahun Ajaran</label>
              <select
                value={tahunAjaran}
                onChange={(e) => setTahunAjaran(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              >
                <option value="">— Pilih —</option>
                {tahunAjaranOptions.map((ta) => (
                  <option key={ta} value={ta.split(" ")[0]}>
                    {ta.split(" ")[0]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-600 text-gray-600 mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as "Ganjil" | "Genap")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-600 text-gray-600 mb-1">Tanggal Buka</label>
              <input
                type="date"
                value={tglBuka}
                onChange={(e) => setTglBuka(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-600 text-gray-600 mb-1">Tanggal Tutup</label>
              <input
                type="date"
                value={tglTutup}
                onChange={(e) => setTglTutup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            </div>
          </div>

          {tglBuka && tglTutup && tglTutup > tglBuka && (
            <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              Periode dibuka selama <strong>{Math.ceil((new Date(tglTutup).getTime() - new Date(tglBuka).getTime()) / (1000 * 60 * 60 * 24))} hari</strong> ({formatTgl(tglBuka)} – {formatTgl(tglTutup)})
            </div>
          )}

          <label className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={isAktif}
              onChange={(e) => setIsAktif(e.target.checked)}
              className="mt-0.5"
            />
            <div>
              <div className="text-xs font-600 text-amber-800">Aktifkan periode ini sekarang</div>
              <div className="text-[11px] text-amber-700 mt-0.5">
                Periode lain yang aktif akan otomatis dinonaktifkan. Mahasiswa akan langsung bisa input nilai KHS.
              </div>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse min-[420px]:flex-row gap-2 px-3 sm:px-4 py-3 border-t" style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}>
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2 rounded-lg text-sm font-500 text-white flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
            style={{ background: "#263F93" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {initial ? "Simpan Perubahan" : "Tambah Periode"}
          </button>
        </div>
      </div>
    </div>
  );
}
