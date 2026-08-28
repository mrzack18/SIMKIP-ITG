import { useState, useRef, useEffect } from "react";
import { api } from "@/services/api";
import {
  Eye, EyeOff, CheckCircle, X, Pencil, Camera, Phone, AlertCircle, Clock,
} from "lucide-react";

interface ProfilProps {
  role?: "mahasiswa" | "admin" | "prodi" | "warek";
  user?: { nama: string; nim?: string };
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  const colors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
  const textColors = ["", "text-red-600", "text-yellow-600", "text-blue-600", "text-green-600"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? colors[score] : "bg-gray-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-500 ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}

function PasswordField({ label, value, show, onToggle, onChange }: {
  label: string; value: string; show: boolean;
  onToggle: () => void; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-500 text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
          placeholder="••••••••"
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-500 text-gray-700">{value}</div>
    </div>
  );
}

/* ── Mahasiswa full layout ─────────────────────────────────────────────── */
function MahasiswaProfil({ user }: { user?: { nama: string; nim?: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Avatar
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [nik, setNik] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [namaAyah, setNamaAyah] = useState("");
  const [namaIbu, setNamaIbu] = useState("");
  const [telAyah, setTelAyah] = useState("");
  const [telIbu, setTelIbu] = useState("");

  // HP
  const [showHpForm, setShowHpForm] = useState(false);
  const [newHp, setNewHp] = useState("");

  // Password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  
  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ""});

  useEffect(() => {
    api.get('/profile').then((res: any) => {
      const d = res.data;
      setData(d);
      setPhotoUrl(d.foto || null);
      setNik(d.nik || "");
      setTempatLahir(d.tempat_lahir || "");
      setJenisKelamin(d.jenis_kelamin || "");
      setTanggalLahir(d.tanggal_lahir || "");
      setAlamat(d.alamat || "");
      setNamaAyah(d.nama_ayah || "");
      setNamaIbu(d.nama_ibu || "");
      setTelAyah(d.tel_ayah || "");
      setTelIbu(d.tel_ibu || "");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
      setPhotoFile(file);
    }
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    if (nik) formData.append("nik", nik);
    if (tempatLahir) formData.append("tempat_lahir", tempatLahir);
    if (jenisKelamin) formData.append("jenis_kelamin", jenisKelamin);
    if (tanggalLahir) formData.append("tanggal_lahir", tanggalLahir);
    if (alamat) formData.append("alamat", alamat);
    if (namaAyah) formData.append("nama_ayah", namaAyah);
    if (namaIbu) formData.append("nama_ibu", namaIbu);
    if (telAyah) formData.append("tel_ayah", telAyah);
    if (telIbu) formData.append("tel_ibu", telIbu);
    if (photoFile) formData.append("foto_profil", photoFile);

    try {
      await api.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setEditMode(false);
      setToast({ show: true, msg: "Profil berhasil diperbarui" });
      setTimeout(() => setToast({ show: false, msg: "" }), 3000);
      // reload
      const res = await api.get('/profile');
      setData(res.data);
    } catch (e: any) {
      alert("Gagal menyimpan profil");
    }
  };

  const handleSaveHp = async () => {
    if (!newHp) return;
    try {
      const formData = new FormData();
      formData.append("no_hp", newHp);
      await api.post("/profile", formData);
      setShowHpForm(false);
      setNewHp("");
      setToast({ show: true, msg: "Nomor HP berhasil diperbarui" });
      setTimeout(() => setToast({ show: false, msg: "" }), 3000);
      const res = await api.get('/profile');
      setData(res.data);
    } catch (e: any) {
      alert("Gagal mengupdate nomor HP");
    }
  };

  const handleSavePw = async () => {
    if (!pwForm.current) { setPwError("Password saat ini wajib diisi."); return; }
    if (pwForm.newPw.length < 8) { setPwError("Password baru minimal 8 karakter."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Konfirmasi password tidak cocok."); return; }
    setPwError("");
    
    try {
      await api.post("/profile/password", {
        password_lama: pwForm.current,
        password_baru: pwForm.newPw,
        konfirmasi: pwForm.confirm
      });
      setPwForm({ current: "", newPw: "", confirm: "" });
      setToast({ show: true, msg: "Password berhasil diperbarui" });
      setTimeout(() => setToast({ show: false, msg: "" }), 3000);
    } catch (e: any) {
      setPwError(e.response?.data?.message || "Gagal mengubah password");
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Memuat profil...</div>;

  const nama = data?.nama || "";
  const initials = nama.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase();

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-500">
          <CheckCircle size={16} /> {toast.msg}
        </div>
      )}

      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Profil Saya</h1>
        <p className="text-gray-500 text-sm mt-0.5">Informasi akun dan pengaturan keamanan</p>
      </div>

      {/* SECTION 1 — Informasi Pribadi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-600 text-gray-800 text-sm">Informasi Pribadi</h2>
          <button
            onClick={() => setEditMode(v => !v)}
            className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-lg border transition-colors"
            style={editMode ? { background: "#263F93", color: "#fff", borderColor: "#263F93" } : { color: "#263F93", borderColor: "#263F93" }}
          >
            <Pencil size={12} />
            {editMode ? "Batal Edit" : "Edit"}
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group" style={{ width: 120, height: 120 }}>
            <div
              className="w-full h-full rounded-full flex items-center justify-center overflow-hidden text-white font-display font-800 text-3xl"
              style={{ background: "#263F93" }}
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Foto profil" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera size={20} className="text-white mb-1" />
              <span className="text-white text-xs font-500">Ganti Foto</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          {editMode && photoFile && (
            <p className="mt-2 text-xs text-blue-600">Foto siap diupload (Simpan Perubahan)</p>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-600"
            style={{ background: "#D4A72C", color: "#263F93" }}
          >
            <Camera size={13} /> Ubah Foto
          </button>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">NIM</p>
            <p className="text-sm font-500 text-gray-700">{data?.nim || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Nama Lengkap</p>
            <p className="text-sm font-500 text-gray-700">{data?.nama || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Email</p>
            <p className="text-sm font-500 text-gray-700">{data?.email || "-"}</p>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-0.5 block">NIK</label>
            {editMode ? (
              <input
                value={nik}
                onChange={e => setNik(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            ) : (
              <p className="text-sm font-500 text-gray-700">{data?.nik || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-0.5 block">Tempat Lahir</label>
            {editMode ? (
              <input
                value={tempatLahir}
                onChange={e => setTempatLahir(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            ) : (
              <p className="text-sm font-500 text-gray-700">{data?.tempat_lahir || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-0.5 block">Jenis Kelamin</label>
            {editMode ? (
              <select
                value={jenisKelamin}
                onChange={e => setJenisKelamin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 bg-white"
              >
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            ) : (
              <p className="text-sm font-500 text-gray-700">{data?.jenis_kelamin || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-0.5 block">Tanggal Lahir</label>
            {editMode ? (
              <input
                type="date"
                value={tanggalLahir}
                onChange={e => setTanggalLahir(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            ) : (
              <p className="text-sm font-500 text-gray-700">{data?.tanggal_lahir || "-"}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Program Studi</p>
            <p className="text-sm font-500 text-gray-700">{data?.prodi || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Angkatan</p>
            <p className="text-sm font-500 text-gray-700">{data?.angkatan || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Kategori KIP-K</p>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-500 rounded">{data?.kategori || "-"}</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Status Akun</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-500 rounded">
              <CheckCircle size={11} /> {data?.status || "-"}
            </span>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-gray-400 mb-0.5 block">Alamat Lengkap</label>
            {editMode ? (
              <textarea
                value={alamat}
                onChange={e => setAlamat(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 resize-none"
              />
            ) : (
              <p className="text-sm font-500 text-gray-700">{data?.alamat || "-"}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2 — Data Orang Tua */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-600 text-gray-800 text-sm mb-5">Data Orang Tua</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className="text-xs text-gray-400 mb-0.5 block">Nama Ayah</label>
            {editMode ? (
              <input
                value={namaAyah}
                onChange={e => setNamaAyah(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            ) : (
              <p className="text-sm font-500 text-gray-700">{data?.nama_ayah || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-0.5 block">Nama Ibu</label>
            {editMode ? (
              <input
                value={namaIbu}
                onChange={e => setNamaIbu(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            ) : (
              <p className="text-sm font-500 text-gray-700">{data?.nama_ibu || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-0.5 block">Nomor Telepon Ayah</label>
            {editMode ? (
              <input
                value={telAyah}
                onChange={e => setTelAyah(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            ) : (
              <p className="text-sm font-500 text-gray-700">{data?.tel_ayah || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-0.5 block">Nomor Telepon Ibu</label>
            {editMode ? (
              <input
                value={telIbu}
                onChange={e => setTelIbu(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            ) : (
              <p className="text-sm font-500 text-gray-700">{data?.tel_ibu || "-"}</p>
            )}
          </div>
        </div>
        {editMode && (
          <div className="mt-5">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2.5 rounded-xl text-sm font-700 text-white shadow-sm"
              style={{ background: "#263F93" }}
            >
              Simpan Perubahan
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3 — Nomor Handphone Pribadi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-600 text-gray-800 text-sm mb-5">Nomor Handphone Mahasiswa</h2>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#263F9318" }}>
            <Phone size={18} style={{ color: "#263F93" }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-700 text-gray-900">{data?.no_hp || "Belum diatur"}</span>
              {data?.no_hp && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-600 rounded-full">Aktif</span>}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4">
          <AlertCircle size={15} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700 leading-relaxed">
            Segera perbarui jika ganti nomor HP agar dapat dihubungi oleh Pengelola KIP-K
          </p>
        </div>

        <button
          onClick={() => setShowHpForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-600 transition-colors mb-4"
          style={{ color: "#263F93", borderColor: "#263F93" }}
        >
          <Phone size={14} />
          {showHpForm ? "Batal" : "Ganti Nomor HP"}
        </button>

        {showHpForm && (
          <div className="flex items-center gap-3">
            <input
              type="tel"
              value={newHp}
              onChange={e => setNewHp(e.target.value)}
              placeholder="Nomor baru, contoh: 0813-1234-5678"
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
            />
            <button
              onClick={handleSaveHp}
              className="px-5 py-2.5 rounded-lg text-sm font-700 text-white flex-shrink-0"
              style={{ background: "#263F93" }}
            >
              Simpan
            </button>
          </div>
        )}

        {/* History timeline */}
        <div className="border-t border-gray-100 pt-4 mt-4 space-y-0">
          <p className="text-xs font-600 text-gray-500 mb-3">Riwayat</p>
          {data?.no_hp && (
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex flex-col items-center self-stretch pt-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#16a34a" }} />
                {data?.contact_histories?.length > 0 && (
                  <div className="w-px flex-1 mt-1" style={{ background: "#E2E8F0" }} />
                )}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-500 text-gray-700">{data.no_hp}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> Saat Ini
                  </p>
                </div>
                <span className="text-xs font-500 px-2 py-0.5 rounded-full" style={{ background: "#dcfce7", color: "#15803d" }}>Aktif</span>
              </div>
            </div>
          )}
          
          {data?.contact_histories?.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex flex-col items-center self-stretch pt-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#CBD5E1" }} />
                {idx < data.contact_histories.length - 1 && (
                  <div className="w-px flex-1 mt-1" style={{ background: "#E2E8F0" }} />
                )}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-500 text-gray-700">{item.nomor}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {item.sem}
                  </p>
                </div>
                <span className="text-xs font-500 px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#94a3b8" }}>Tidak Aktif</span>
              </div>
            </div>
          ))}

          {!data?.no_hp && !data?.contact_histories?.length && (
            <p className="text-xs text-gray-400 italic">Belum ada data nomor handphone.</p>
          )}
        </div>
      </div>

      {/* SECTION 4 — Ubah Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-600 text-gray-800 text-sm mb-5">Ubah Password</h2>
        <div className="space-y-4">
          <PasswordField
            label="Password Saat Ini"
            value={pwForm.current}
            show={showCurrent}
            onToggle={() => setShowCurrent(p => !p)}
            onChange={v => setPwForm(f => ({ ...f, current: v }))}
          />
          <div>
            <PasswordField
              label="Password Baru"
              value={pwForm.newPw}
              show={showNew}
              onToggle={() => setShowNew(p => !p)}
              onChange={v => setPwForm(f => ({ ...f, newPw: v }))}
            />
            <PasswordStrength password={pwForm.newPw} />
          </div>
          <PasswordField
            label="Konfirmasi Password Baru"
            value={pwForm.confirm}
            show={showConfirm}
            onToggle={() => setShowConfirm(p => !p)}
            onChange={v => setPwForm(f => ({ ...f, confirm: v }))}
          />
          {pwForm.confirm && pwForm.confirm !== pwForm.newPw && (
            <p className="text-xs text-red-600 flex items-center gap-1"><X size={12} /> Password tidak cocok</p>
          )}
          {pwError && <p className="text-xs text-red-600">{pwError}</p>}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSavePw}
              className="px-6 py-2.5 rounded-xl text-sm font-700 text-white shadow-sm"
              style={{ background: "#263F93" }}
            >
              Simpan Password
            </button>
            <button
              onClick={() => { setPwForm({ current: "", newPw: "", confirm: "" }); setPwError(""); }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ── Non-mahasiswa simple layout ──────────────────────────────────────── */
function SimpleRoleProfil({ role, user }: { role: string; user?: { nama: string; nim?: string } }) {
  const nama = user?.nama || "User";
  const initials = nama.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

  const roleLabel: Record<string, string> = {
    admin: "Pengelola KIP-K",
    prodi: "Program Studi",
    warek: "Wakil Rektor III",
  };

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!form.current) { setError("Password saat ini wajib diisi."); return; }
    if (form.newPw.length < 8) { setError("Password baru minimal 8 karakter."); return; }
    if (form.newPw !== form.confirm) { setError("Konfirmasi password tidak cocok."); return; }
    setError("");
    setForm({ current: "", newPw: "", confirm: "" });
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-500">
          <CheckCircle size={16} /> Password berhasil diperbarui
        </div>
      )}

      <div>
        <h1 className="font-display font-700 text-2xl text-gray-900">Profil Saya</h1>
        <p className="text-gray-500 text-sm mt-0.5">Informasi akun dan pengaturan keamanan</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-600 text-gray-800 text-sm mb-5">Informasi Profil</h2>
        <div className="flex items-start gap-5 mb-6">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display font-800 text-xl"
              style={{ background: "#263F93" }}>
              {initials}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md text-white font-700"
              style={{ background: "#D4A72C", fontSize: "10px", color: "#1a2d6e" }}>
              {roleLabel[role] || role}
            </span>
          </div>
          <div>
            <h3 className="font-700 text-gray-900 text-lg">{nama}</h3>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-500 rounded">
              <CheckCircle size={11} /> Akun Aktif
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {role === "admin" && (
            <>
              <Field label="Nama" value={nama} />
              <Field label="Username" value="encep.admin" />
              <Field label="Role" value={<span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-500 rounded">Pengelola KIP-K</span>} />
            </>
          )}
          {role === "prodi" && (
            <>
              <Field label="Nama Program Studi" value="Teknik Informatika" />
              <Field label="Username" value="prodi.ti" />
            </>
          )}
          {role === "warek" && (
            <>
              <Field label="Nama" value={nama} />
              <Field label="Username" value="warek3.itg" />
              <Field label="Role" value={<span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-500 rounded">Wakil Rektor III</span>} />
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-600 text-gray-800 text-sm mb-5">Ubah Password</h2>
        <div className="space-y-4">
          <PasswordField
            label="Password Saat Ini"
            value={form.current}
            show={showCurrent}
            onToggle={() => setShowCurrent(p => !p)}
            onChange={v => setForm(f => ({ ...f, current: v }))}
          />
          <div>
            <PasswordField
              label="Password Baru"
              value={form.newPw}
              show={showNew}
              onToggle={() => setShowNew(p => !p)}
              onChange={v => setForm(f => ({ ...f, newPw: v }))}
            />
            <PasswordStrength password={form.newPw} />
          </div>
          <PasswordField
            label="Konfirmasi Password Baru"
            value={form.confirm}
            show={showConfirm}
            onToggle={() => setShowConfirm(p => !p)}
            onChange={v => setForm(f => ({ ...f, confirm: v }))}
          />
          {form.confirm && form.confirm !== form.newPw && (
            <p className="text-xs text-red-600 flex items-center gap-1"><X size={12} /> Password tidak cocok</p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-sm font-700 text-white shadow-sm"
              style={{ background: "#263F93" }}>
              Simpan Password
            </button>
            <button onClick={() => { setForm({ current: "", newPw: "", confirm: "" }); setError(""); }}
              className="text-sm text-gray-500 hover:text-gray-700">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Root export ──────────────────────────────────────────────────────── */
export default function Profil({ role = "mahasiswa", user }: ProfilProps) {
  if (role === "mahasiswa") return <MahasiswaProfil user={user} />;
  return <SimpleRoleProfil role={role} user={user} />;
}
