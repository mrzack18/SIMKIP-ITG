import { useState, useRef } from "react";
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
  const nama = user?.nama || "Ahmad Rifaldi";
  const nim = user?.nim || "2206001";
  const initials = nama.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

  // Avatar
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit mode (pribadi + ortu in one toggle for simplicity, split if needed)
  const [editMode, setEditMode] = useState(false);
  const [tanggalLahir, setTanggalLahir] = useState("15 Maret 2003");
  const [alamat, setAlamat] = useState("Jl. Merdeka No. 12, Garut, Jawa Barat");
  const [namaAyah, setNamaAyah] = useState("Bapak Hasan");
  const [namaIbu, setNamaIbu] = useState("Ibu Siti");
  const [telAyah, setTelAyah] = useState("0813-1111-2222");
  const [telIbu, setTelIbu] = useState("0812-3333-4444");

  // HP
  const [showHpForm, setShowHpForm] = useState(false);
  const [newHp, setNewHp] = useState("");

  const contactHistory = [
    { sem: "Sem 5 – sekarang", nomor: "0812-3456-7890", aktif: true },
    { sem: "Sem 3 – Sem 4", nomor: "0857-9876-5432", aktif: false },
    { sem: "Sem 1 – Sem 2", nomor: "0811-2222-3333", aktif: false },
  ];

  // Password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [toast, setToast] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoUrl(URL.createObjectURL(file));
  };

  const handleSavePw = () => {
    if (!pwForm.current) { setPwError("Password saat ini wajib diisi."); return; }
    if (pwForm.newPw.length < 8) { setPwError("Password baru minimal 8 karakter."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Konfirmasi password tidak cocok."); return; }
    setPwError("");
    setPwForm({ current: "", newPw: "", confirm: "" });
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
            {editMode ? "Selesai Edit" : "Edit"}
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
          {/* NIM — always readonly */}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">NIM</p>
            <p className="text-sm font-500 text-gray-700">{nim}</p>
          </div>
          {/* Nama Lengkap — readonly */}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Nama Lengkap</p>
            <p className="text-sm font-500 text-gray-700">{nama}</p>
          </div>
          {/* Tanggal Lahir */}
          <div>
            <label className="text-xs text-gray-400 mb-0.5 block">Tanggal Lahir</label>
            {editMode ? (
              <input
                value={tanggalLahir}
                onChange={e => setTanggalLahir(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
              />
            ) : (
              <p className="text-sm font-500 text-gray-700">{tanggalLahir}</p>
            )}
          </div>
          {/* Program Studi */}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Program Studi</p>
            <p className="text-sm font-500 text-gray-700">Teknik Informatika</p>
          </div>
          {/* Angkatan */}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Angkatan</p>
            <p className="text-sm font-500 text-gray-700">2022</p>
          </div>
          {/* Kategori KIP-K */}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Kategori KIP-K</p>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-500 rounded">Reguler</span>
          </div>
          {/* Status Akun */}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Status Akun</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-500 rounded">
              <CheckCircle size={11} /> Aktif
            </span>
          </div>
          {/* Alamat — full width */}
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
              <p className="text-sm font-500 text-gray-700">{alamat}</p>
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
              <p className="text-sm font-500 text-gray-700">{namaAyah}</p>
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
              <p className="text-sm font-500 text-gray-700">{namaIbu}</p>
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
              <p className="text-sm font-500 text-gray-700">{telAyah}</p>
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
              <p className="text-sm font-500 text-gray-700">{telIbu}</p>
            )}
          </div>
        </div>
        {editMode && (
          <div className="mt-5">
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2.5 rounded-xl text-sm font-700 text-white shadow-sm"
              style={{ background: "#263F93" }}
            >
              Simpan Perubahan
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3 — Riwayat Nomor Kontak */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-600 text-gray-800 text-sm mb-5">Riwayat Nomor Kontak</h2>

        {/* Current number */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#263F9318" }}>
            <Phone size={18} style={{ color: "#263F93" }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-700 text-gray-900">0812-3456-7890</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-600 rounded-full">Aktif</span>
            </div>
            <p className="text-xs text-gray-400">Sejak Semester 5</p>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4">
          <AlertCircle size={15} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700 leading-relaxed">
            Segera perbarui jika ganti nomor HP agar dapat dihubungi oleh Pengelola KIP-K
          </p>
        </div>

        {/* Ganti Nomor button */}
        <button
          onClick={() => setShowHpForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-600 transition-colors mb-4"
          style={{ color: "#263F93", borderColor: "#263F93" }}
        >
          <Phone size={14} />
          {showHpForm ? "Batal" : "Ganti Nomor HP"}
        </button>

        {showHpForm && (
          <div className="flex items-center gap-3 mb-4">
            <input
              type="tel"
              value={newHp}
              onChange={e => setNewHp(e.target.value)}
              placeholder="Nomor baru, contoh: 0813-1234-5678"
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20"
            />
            <button
              onClick={() => { setShowHpForm(false); setNewHp(""); }}
              className="px-5 py-2.5 rounded-lg text-sm font-700 text-white flex-shrink-0"
              style={{ background: "#263F93" }}
            >
              Simpan
            </button>
          </div>
        )}

        {/* History timeline */}
        <div className="border-t border-gray-100 pt-4 space-y-0">
          <p className="text-xs font-600 text-gray-500 mb-3">Riwayat</p>
          {contactHistory.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex flex-col items-center self-stretch pt-1">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: item.aktif ? "#16a34a" : "#CBD5E1" }}
                />
                {idx < contactHistory.length - 1 && (
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
                <span
                  className="text-xs font-500 px-2 py-0.5 rounded-full"
                  style={item.aktif
                    ? { background: "#dcfce7", color: "#15803d" }
                    : { background: "#f1f5f9", color: "#94a3b8" }}
                >
                  {item.aktif ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>
          ))}
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
  const nama = user?.nama || "Ahmad Rifaldi";
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
