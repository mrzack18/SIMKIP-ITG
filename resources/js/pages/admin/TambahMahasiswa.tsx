import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Upload, X, CheckCircle, AlertCircle, Eye, EyeOff,
  FileText, Info, Printer, Copy, XCircle, Users, Check, ChevronDown, Trash2, Download, User, BookOpen, Clock, AlertTriangle, Shield, Building2, MapPin, Image as ImageIcon, Loader2
} from "lucide-react";
import { createMahasiswa, checkNim, getMahasiswaFilterOptions } from "@/services/mahasiswaService";

interface FormState {
  nomorSK: string;
  tanggalSK: string;
  fileSK: File | null;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: string;
  kategori: "Reguler" | "Aspirasi";
}

interface Errors {
  nomorSK?: string;
  tanggalSK?: string;
  fileSK?: string;
  nim?: string;
  nama?: string;
  prodi?: string;
  angkatan?: string;
  umum?: string;
}

const initialForm: FormState = {
  nomorSK: "",
  tanggalSK: "",
  fileSK: null,
  nim: "",
  nama: "",
  prodi: "",
  angkatan: "",
  kategori: "Reguler",
};

export default function TambahMahasiswa() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [nimStatus, setNimStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [dragOver, setDragOver] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [prodiList, setProdiList] = useState<{id: number, nama: string, kode: string}[]>([]);
  const [angkatanOptions, setAngkatanOptions] = useState<number[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  
  const [generatedPassword, setGeneratedPassword] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const generatedUsername = form.nim || "—";

  useEffect(() => {
    let active = true;
    setOptionsLoading(true);
    getMahasiswaFilterOptions()
      .then((data) => {
        if (active) {
          setProdiList(data.prodis);
          setAngkatanOptions(data.angkatans);
          setOptionsLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setOptionsError(err?.message ?? "Gagal memuat opsi");
          setOptionsLoading(false);
        }
      });
    return () => { active = false; };
  }, []);

  const checkNIM = async () => {
    if (!form.nim) return;
    setNimStatus("checking");
    try {
      const result = await checkNim(form.nim);
      const exists = result.exists;
      setNimStatus(exists ? "error" : "ok");
      if (exists) setErrors(e => ({ ...e, nim: "NIM sudah terdaftar dalam sistem." }));
      else setErrors(e => { const n = { ...e }; delete n.nim; return n; });
    } catch (err: any) {
      setNimStatus("idle");
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(e => ({ ...e, fileSK: "Ukuran file tidak boleh lebih dari 5MB." }));
      return;
    }
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      setErrors(e => ({ ...e, fileSK: "Format file harus PDF, JPG, atau PNG." }));
      return;
    }
    setErrors(e => { const n = { ...e }; delete n.fileSK; return n; });
    setForm(f => ({ ...f, fileSK: file }));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!form.nomorSK) newErrors.nomorSK = "Nomor SK wajib diisi.";
    if (!form.tanggalSK) newErrors.tanggalSK = "Tanggal SK wajib diisi.";
    if (!form.nim) newErrors.nim = "NIM wajib diisi.";
    else if (nimStatus === "error") newErrors.nim = "NIM sudah terdaftar.";
    if (!form.nama) newErrors.nama = "Nama lengkap wajib diisi.";
    if (!form.prodi) newErrors.prodi = "Program Studi wajib dipilih.";
    if (!form.angkatan) newErrors.angkatan = "Angkatan wajib dipilih.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (resetAfter = false) => {
    if (!validate()) return;
    setSubmitting(true);
    setErrors(e => { const n = { ...e }; delete n.umum; return n; });

    const prodiObj = prodiList.find(p => p.nama === form.prodi);
    if (!prodiObj) {
      setErrors(e => ({ ...e, prodi: "Program Studi tidak valid." }));
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append("nim", form.nim);
    payload.append("nama", form.nama);
    payload.append("prodi_id", String(prodiObj.id));
    payload.append("angkatan", form.angkatan);
    payload.append("kategori", form.kategori);
    payload.append("nomor_sk", form.nomorSK);
    payload.append("tanggal_sk", form.tanggalSK);
    if (form.fileSK) payload.append("file_sk", form.fileSK);

    try {
      const result = await createMahasiswa(payload as any);
      setGeneratedPassword(result.credentials.password);
      setSubmitting(false);
      if (resetAfter) {
        setForm(initialForm);
        setNimStatus("idle");
        setGeneratedPassword("");
      } else {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      const msg = err?.message ?? "Gagal mendaftarkan mahasiswa.";
      setErrors(e => ({ ...e, umum: msg }));
      setSubmitting(false);
    }
  };

  const copyCredentials = () => {
    const text = `Username: ${generatedUsername}\nPassword: ${generatedPassword}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={12} /> {msg}</p> : null;

  const inputClass = (err?: string) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
      err ? "border-red-300 focus:ring-red-200 bg-red-50/30" : "border-gray-200 focus:ring-[#263F93]/20 focus:border-[#263F93]/40"
    }`;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Breadcrumb and Filter */}
      <div className="flex items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Link to="/admin/mahasiswa" className="hover:text-gray-700 flex items-center gap-1">
            <ChevronLeft size={15} /> Manajemen Mahasiswa
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-500">Tambah Mahasiswa</span>
        </div>
      </div>

      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Registrasi Mahasiswa KIP-K Baru</h1>
        <p className="text-gray-500 text-sm mt-0.5">Isi data SK dan informasi mahasiswa untuk membuat akun otomatis.</p>
      </div>

      {errors.umum && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{errors.umum}</p>
        </div>
      )}

      {optionsError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">{optionsError}</p>
        </div>
      )}

      {/* Section 1: Data SK */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-6 h-6 rounded-full bg-[#263F93] flex items-center justify-center text-white text-xs font-700">1</div>
          <h2 className="font-600 text-gray-800 text-sm">Data SK Penetapan KIP-K</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Nomor SK <span className="text-red-500">*</span>
              </label>
              <input
                value={form.nomorSK}
                onChange={set("nomorSK")}
                placeholder="Contoh: SK/KIP/ITG/2026/001"
                className={inputClass(errors.nomorSK)}
              />
              <p className="mt-1 text-xs text-gray-400">Format: SK/KIP/ITG/[TAHUN]/[NO]</p>
              <FieldError msg={errors.nomorSK} />
            </div>

            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Tanggal SK <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.tanggalSK}
                onChange={set("tanggalSK")}
                className={inputClass(errors.tanggalSK)}
              />
              <FieldError msg={errors.tanggalSK} />
            </div>
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-1.5">Upload File SK</label>
            {!form.fileSK ? (
              <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver ? "border-[#263F93] bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Upload size={28} className={`mx-auto mb-2 ${dragOver ? "text-[#263F93]" : "text-gray-300"}`} />
                <p className="text-sm font-500 text-gray-600">Seret file ke sini atau <span className="text-[#263F93]">klik untuk memilih</span></p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG · Maks. 5MB</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  {form.fileSK.type.startsWith("image/") ? <ImageIcon size={20} className="text-blue-600" /> : <FileText size={20} className="text-green-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-500 text-gray-800 truncate">{form.fileSK.name}</p>
                  <p className="text-xs text-gray-400">{(form.fileSK.size / 1024).toFixed(0)} KB</p>
                </div>
                <button onClick={() => setForm(f => ({ ...f, fileSK: null }))}
                  className="p-1.5 rounded-lg hover:bg-green-100 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
            )}
            <FieldError msg={errors.fileSK} />
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        </div>
      </div>

      {/* Section 2: Data Mahasiswa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-6 h-6 rounded-full bg-[#263F93] flex items-center justify-center text-white text-xs font-700">2</div>
          <h2 className="font-600 text-gray-800 text-sm">Data Mahasiswa</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NIM */}
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                NIM <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  value={form.nim}
                  onChange={e => { set("nim")(e); setNimStatus("idle"); }}
                  onBlur={checkNIM}
                  placeholder="Contoh: 2206099"
                  className={`${inputClass(errors.nim)} pr-8`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {nimStatus === "checking" && <div className="w-4 h-4 border-2 border-gray-300 border-t-[#263F93] rounded-full animate-spin" />}
                  {nimStatus === "ok" && <CheckCircle size={16} className="text-green-500" />}
                  {nimStatus === "error" && <AlertCircle size={16} className="text-red-500" />}
                </div>
              </div>
              {nimStatus === "ok" && <p className="mt-1.5 flex items-center gap-1 text-xs text-green-600"><CheckCircle size={12} /> NIM tersedia</p>}
              <FieldError msg={errors.nim} />
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                value={form.nama}
                onChange={set("nama")}
                placeholder="Nama sesuai KTP"
                className={inputClass(errors.nama)}
              />
              <FieldError msg={errors.nama} />
            </div>

            {/* Prodi */}
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Program Studi <span className="text-red-500">*</span>
              </label>
              <select
                value={form.prodi}
                onChange={set("prodi")}
                disabled={optionsLoading}
                className={inputClass(errors.prodi)}
              >
                <option value="">{optionsLoading ? "Memuat prodi…" : "Pilih Program Studi"}</option>
                {prodiList.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
              </select>
              <FieldError msg={errors.prodi} />
            </div>

            {/* Angkatan */}
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">
                Angkatan <span className="text-red-500">*</span>
              </label>
              <select value={form.angkatan} onChange={set("angkatan")} disabled={optionsLoading} className={inputClass(errors.angkatan)}>
                <option value="">{optionsLoading ? "Memuat angkatan..." : "Pilih Angkatan"}</option>
                {angkatanOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <FieldError msg={errors.angkatan} />
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-500 text-gray-700 mb-2">
              Kategori Kepesertaan <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {(["Reguler", "Aspirasi"] as const).map(kat => (
                <label key={kat} className={`flex items-start gap-3 flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  form.kategori === kat ? "border-[#263F93] bg-blue-50/50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input type="radio" name="kategori" value={kat} checked={form.kategori === kat}
                    onChange={() => setForm(f => ({ ...f, kategori: kat }))}
                    className="mt-0.5 accent-[#263F93]" />
                  <div>
                    <p className="text-sm font-600 text-gray-800">{kat}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {kat === "Reguler"
                        ? "Penerima KIP-K jalur reguler berdasarkan seleksi nasional."
                        : "Penerima KIP-K jalur aspirasi (rekomendasi DPR/instansi)."}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Kredensial */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-6 h-6 rounded-full bg-[#263F93] flex items-center justify-center text-white text-xs font-700">3</div>
          <h2 className="font-600 text-gray-800 text-sm">Kredensial Akun (Otomatis)</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">Username (NIM)</label>
              <input value={generatedUsername} disabled
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed font-mono" />
            </div>

            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">Password Default</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={generatedPassword || "—"}
                  disabled
                  className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed font-mono"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <Info size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Password default akan diberikan kepada mahasiswa. <strong>Mahasiswa wajib mengubah password saat login pertama</strong> sebelum dapat mengakses fitur sistem.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/mahasiswa" className="text-sm text-gray-500 hover:text-gray-700">Batal</Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit(true)}
            disabled={submitting || optionsLoading}
            className="px-4 py-2.5 border border-[#263F93] rounded-lg text-sm font-500 text-[#263F93] hover:bg-blue-50 disabled:opacity-50 transition-colors">
            Simpan & Tambah Lagi
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting || optionsLoading}
            className="px-5 py-2.5 rounded-lg text-sm font-500 text-white disabled:opacity-50 transition-colors flex items-center gap-2"
            style={{ background: submitting ? "#94A3B8" : "#263F93" }}>
            {submitting
              ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</>
              : "Simpan & Daftarkan"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <h3 className="font-display font-700 text-xl text-gray-900 text-center mb-1">Berhasil Didaftarkan!</h3>
            <p className="text-gray-500 text-sm text-center mb-5">
              Mahasiswa <strong>{form.nama}</strong> berhasil didaftarkan ke SIMKIP-ITG.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-5">
              <p className="text-xs font-600 text-gray-500 uppercase tracking-wide mb-2">Kredensial Akun</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">NIM / Username</span>
                <span className="font-mono font-600 text-gray-800">{form.nim}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Password Default</span>
                <span className="font-mono font-600 text-gray-800">{generatedPassword}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={copyCredentials}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-500 text-gray-700 hover:bg-gray-50">
                {copied ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}
                {copied ? "Tersalin!" : "Salin"}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-500 text-gray-700 hover:bg-gray-50">
                <Printer size={15} /> Cetak
              </button>
              <button onClick={() => { setShowSuccessModal(false); navigate("/admin/mahasiswa"); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-500 text-white"
                style={{ background: "#263F93" }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
