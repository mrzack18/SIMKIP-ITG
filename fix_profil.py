import re

with open("resources/js/pages/student/Profil.tsx", "r") as f:
    content = f.read()

# Add import api
if "import { api } from" not in content:
    content = content.replace('import { useState, useRef } from "react";', 'import { useState, useRef, useEffect } from "react";\nimport { api } from "@/services/api";')

# Replace MahasiswaProfil
new_mahasiswa_profil = """function MahasiswaProfil({ user }: { user?: { nama: string; nim?: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Avatar
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
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
"""

start_idx = content.find("function MahasiswaProfil({ user }")
end_idx = content.find("/* ── Non-mahasiswa simple layout")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_mahasiswa_profil + content[end_idx:]

with open("resources/js/pages/student/Profil.tsx", "w") as f:
    f.write(content)

