import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle, Search, CheckCircle, X, Info, Loader2, XCircle } from "lucide-react";
import { getMahasiswaList } from "@/services/mahasiswaService";
import { terbitkanSP } from "@/services/spService";
import type { Mahasiswa } from "@/types";

type SPLevel = "SP1" | "SP2" | "SP3";
type JenisP = "" | "Akademik" | "Non-Akademik" | "Cuti Tanpa Izin";

const levelColor: Record<SPLevel, string> = { SP1: "#F59E0B", SP2: "#EF4444", SP3: "#7F1D1D" };

const getNextSP = (current: string | null): SPLevel => {
  if (!current) return "SP1";
  if (current === "SP1") return "SP2";
  return "SP3";
};

export default function TerbitkanSP() {
  const navigate = useNavigate();

  // Search state
  const [query, setQuery]               = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<Mahasiswa[]>([]);
  const [searching, setSearching]       = useState(false);
  const [selected, setSelected]         = useState<Mahasiswa | null>(null);

  // Form state
  const [spLevel, setSpLevel]     = useState<SPLevel>("SP1");
  const [jenisP, setJenisP]       = useState<JenisP>("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalTerbit, setTanggalTerbit] = useState(() => new Date().toISOString().slice(0, 10));
  const [batasEvaluasi, setBatasEvaluasi] = useState("");
  const [catatan, setCatatan]     = useState("");

  // UI state
  const [showConfirm, setShowConfirm]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState("");
  const [createdId, setCreatedId]       = useState<number | null>(null);
  const [errors, setErrors]             = useState<Record<string, string>>({});

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelected(null);
    setShowDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setSearchResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await getMahasiswaList({ search: val.trim(), status: "Aktif", limit: 5, page: 1 });
        setSearchResults(res.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  const selectStudent = (m: Mahasiswa) => {
    setSelected(m);
    setQuery(m.nama);
    setShowDropdown(false);
    setSearchResults([]);
    setSpLevel(getNextSP(m.sp));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selected)                e.student   = "Pilih mahasiswa terlebih dahulu.";
    if (!jenisP)                  e.jenis     = "Pilih jenis pelanggaran.";
    if (deskripsi.length < 20)    e.deskripsi = "Deskripsi minimal 20 karakter.";
    if (!tanggalTerbit)           e.tanggal   = "Tanggal terbit wajib diisi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) setShowConfirm(true); };

  const handleConfirm = async () => {
    if (!selected) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await terbitkanSP({
        mahasiswa_id:      selected.id,
        level:             jenisP === "Cuti Tanpa Izin" ? "SP3" : spLevel,
        jenis_pelanggaran: jenisP,
        deskripsi,
        tanggal_terbit:    tanggalTerbit,
        batas_evaluasi:    batasEvaluasi || null,
        catatan:           catatan || null,
      } as any);
      setCreatedId((res as any)?.id ?? null);
      setShowConfirm(false);
    } catch (err: any) {
      setSubmitError(err?.message ?? "Gagal menerbitkan SP. Coba lagi.");
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (createdId !== null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <div className="text-center">
          <p className="font-600 text-gray-800">Surat Peringatan berhasil diterbitkan</p>
          <p className="text-sm text-gray-400 mt-1">SP#{createdId} tercatat di sistem</p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate(`/admin/sp/${createdId}`)}
            className="px-5 py-2.5 rounded-lg text-sm font-500 text-white"
            style={{ background: "#263F93" }}
          >
            Lihat Detail SP
          </button>
          <Link to="/admin/sp" className="px-5 py-2.5 rounded-lg text-sm font-500 border border-gray-200 text-gray-600 hover:bg-gray-50">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5" onClick={() => setShowDropdown(false)}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/sp" className="hover:text-gray-700 flex items-center gap-1">
          <ChevronLeft size={15} /> Surat Peringatan
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-500">Terbitkan SP Baru</span>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-red-600 text-white rounded-xl px-4 py-3.5">
        <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">
          <strong>Perhatian:</strong> Penerbitan Surat Peringatan adalah tindakan resmi yang akan tercatat dalam rekam jejak mahasiswa dan <strong>tidak dapat dibatalkan</strong>.
        </p>
      </div>

      {submitError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      {/* Section 1: Pilih Mahasiswa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-700">1</div>
          <h2 className="font-600 text-gray-800 text-sm">Pilih Mahasiswa</h2>
        </div>
        <div className="p-5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
            {searching && <Loader2 size={14} className="absolute right-3 top-3.5 text-gray-400 animate-spin" />}
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => query && setShowDropdown(true)}
              placeholder="Cari NIM atau Nama mahasiswa..."
              className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 focus:border-[#263F93]/40"
            />
            {showDropdown && query && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-y-auto max-h-64">
                {searchResults.map((m) => (
                  <button key={m.id} onClick={() => selectStudent(m)}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-[#263F93] flex items-center justify-center text-white text-sm font-600 flex-shrink-0">
                      {(m.nama ?? "?").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-500 text-gray-800">{m.nama}</div>
                      <div className="text-xs text-gray-400">{m.nim} · {m.prodi} · IPK {m.ipk?.toFixed(2) ?? "—"}</div>
                    </div>
                    {m.sp && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-600">{m.sp}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {showDropdown && query && !searching && searchResults.length === 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 px-4 py-3 text-sm text-gray-400">
                Tidak ada mahasiswa aktif ditemukan.
              </div>
            )}
          </div>
          {errors.student && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> {errors.student}</p>}

          {selected && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#263F93] flex items-center justify-center text-white font-600">
                  {(selected.nama ?? "?").charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-600 text-gray-800 text-sm">{selected.nama}</p>
                  <p className="text-xs text-gray-500">{selected.nim} · {selected.prodi} · Angkatan {selected.angkatan}</p>
                </div>
                <button onClick={() => { setSelected(null); setQuery(""); }} className="p-1.5 hover:bg-blue-100 rounded-lg text-gray-400">
                  <X size={15} />
                </button>
              </div>
              {selected.sp && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                  <Info size={14} className="inline mr-1" />
                  Mahasiswa ini sudah memiliki <strong>{selected.sp} aktif</strong>. SP berikutnya yang disarankan adalah <strong>{getNextSP(selected.sp)}</strong>.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Detail Pelanggaran */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-700">2</div>
          <h2 className="font-600 text-gray-800 text-sm">Detail Pelanggaran</h2>
        </div>
        <div className="p-5 space-y-4">
          {/* SP Level */}
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-2">Tingkat SP <span className="text-red-500">*</span></label>
            <div className="flex gap-3">
              {(["SP1", "SP2", "SP3"] as SPLevel[]).map((lvl) => (
                <label key={lvl}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl cursor-pointer transition-all text-sm font-600 ${
                    spLevel === lvl ? "border-transparent text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                  style={spLevel === lvl ? { background: levelColor[lvl] } : {}}>
                  <input type="radio" name="splevel" value={lvl} checked={spLevel === lvl}
                    onChange={() => setSpLevel(lvl)} className="hidden" />
                  {lvl}
                </label>
              ))}
            </div>
          </div>

          {/* Jenis Pelanggaran */}
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">Jenis Pelanggaran <span className="text-red-500">*</span></label>
            <select value={jenisP} onChange={(e) => setJenisP(e.target.value as JenisP)}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.jenis ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[#263F93]/20"
              }`}>
              <option value="">Pilih Jenis Pelanggaran</option>
              <option value="Akademik">Akademik (IPK di Bawah Standar)</option>
              <option value="Non-Akademik">Non-Akademik (Pelanggaran Kode Etik)</option>
              <option value="Cuti Tanpa Izin">Cuti Tanpa Izin (Langsung SP3)</option>
            </select>
            {errors.jenis && <p className="mt-1.5 text-xs text-red-600">{errors.jenis}</p>}
          </div>

          {jenisP === "Cuti Tanpa Izin" && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-300 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                <strong>Pelanggaran ini langsung ditetapkan sebagai SP3</strong> dan mengakibatkan PEMBERHENTIAN PERMANEN dari kepesertaan KIP-K.
              </p>
            </div>
          )}

          {jenisP === "Akademik" && selected && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5">
              <span className="text-sm text-orange-700">IPK Terakhir Mahasiswa:</span>
              <span className="font-display font-700 text-orange-700">{selected.ipk?.toFixed(2) ?? "—"}</span>
              {(selected.ipk ?? 0) < 3.0 && <span className="text-xs text-orange-500">(di bawah standar 3.0)</span>}
            </div>
          )}

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">
              Deskripsi Pelanggaran / Alasan SP <span className="text-red-500">*</span>
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={4}
              placeholder="Jelaskan secara detail alasan penerbitan Surat Peringatan ini..."
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none transition-colors ${
                errors.deskripsi ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[#263F93]/20"
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.deskripsi
                ? <p className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> {errors.deskripsi}</p>
                : <span />}
              <span className={`text-xs ${deskripsi.length >= 20 ? "text-green-500" : "text-gray-400"}`}>
                {deskripsi.length}/20 min
              </span>
            </div>
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">Tanggal Terbit <span className="text-red-500">*</span></label>
              <input type="date" value={tanggalTerbit} onChange={(e) => setTanggalTerbit(e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.tanggal ? "border-red-300" : "border-gray-200 focus:ring-[#263F93]/20"}`} />
              {errors.tanggal && <p className="mt-1 text-xs text-red-600">{errors.tanggal}</p>}
            </div>
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">Batas Evaluasi <span className="text-gray-400 text-xs">(opsional)</span></label>
              <input type="date" value={batasEvaluasi} onChange={(e) => setBatasEvaluasi(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20" />
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">Catatan Tambahan <span className="text-gray-400 text-xs">(opsional)</span></label>
            <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={2}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 resize-none" />
          </div>
        </div>
      </div>

      {/* Section 3: Konsekuensi */}
      <div className={`rounded-xl border overflow-hidden shadow-sm ${spLevel === "SP3" ? "border-red-300 bg-red-50" : "border-gray-100 bg-white"}`}>
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-inherit">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-700" style={{ background: levelColor[spLevel] }}>3</div>
          <h2 className="font-600 text-gray-800 text-sm">Konsekuensi (Otomatis)</h2>
          <span className="ml-auto text-xs px-2 py-0.5 rounded font-600 text-white" style={{ background: levelColor[spLevel] }}>{spLevel}</span>
        </div>
        <div className="p-5">
          <p className={`text-sm leading-relaxed ${spLevel === "SP3" ? "text-red-700 font-500" : "text-gray-600"}`}>
            {spLevel === "SP1" && "Mahasiswa diberikan masa perbaikan selama 1 semester berikutnya."}
            {spLevel === "SP2" && "Mahasiswa diberikan kesempatan perbaikan terakhir selama 1 semester."}
            {spLevel === "SP3" && "Status KIP-K DICABUT PERMANEN. Akun mahasiswa akan dinonaktifkan mulai semester berikutnya."}
          </p>
          {spLevel === "SP3" && (
            <div className="mt-3 flex items-center gap-2 bg-red-100 border border-red-300 rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="text-red-700" />
              <span className="text-xs text-red-700 font-600">Tindakan ini bersifat permanen dan tidak dapat dipulihkan.</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center justify-between gap-3">
        <Link to="/admin/sp" className="text-sm text-gray-500 hover:text-gray-700">Batal</Link>
        <button onClick={handleSubmit} disabled={submitting}
          className="px-6 py-2.5 rounded-lg text-sm font-500 text-white flex items-center gap-2 disabled:opacity-40"
          style={{ background: "#DC2626" }}>
          {submitting ? <><Loader2 size={15} className="animate-spin" /> Memproses...</> : <><AlertTriangle size={15} /> Terbitkan Surat Peringatan</>}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: `${levelColor[spLevel]}20` }}>
              <AlertTriangle size={28} style={{ color: levelColor[spLevel] }} />
            </div>
            <h3 className="font-display font-700 text-lg text-gray-900 text-center mb-2">Konfirmasi Penerbitan</h3>
            <p className="text-gray-500 text-sm text-center mb-1">Apakah Anda yakin ingin menerbitkan</p>
            <p className="text-center font-700 text-base mb-4" style={{ color: levelColor[spLevel] }}>
              {jenisP === "Cuti Tanpa Izin" ? "SP3" : spLevel} untuk {selected.nim} – {selected.nama}?
            </p>
            <p className="text-xs text-gray-400 text-center mb-5">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} disabled={submitting}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-500 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                Batal
              </button>
              <button onClick={handleConfirm} disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white flex items-center justify-center gap-2 disabled:opacity-40"
                style={{ background: levelColor[spLevel] }}>
                {submitting ? <><Loader2 size={14} className="animate-spin" /> Memproses...</> : "Ya, Terbitkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
