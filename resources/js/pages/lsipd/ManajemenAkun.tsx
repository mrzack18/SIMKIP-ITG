import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Pencil,
  KeyRound,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import * as userService from "@/services/userService";
import { api } from "@/services/api";
import type { UserRow, CreateUserPayload, UpdateUserPayload } from "@/services/userService";
import type { Role } from "@/types";

interface Prodi { id: number; nama: string; kode: string; is_aktif: boolean }

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "admin", label: "Pengelola KIP-K" },
  { value: "mahasiswa", label: "Mahasiswa" },
  { value: "prodi", label: "Program Studi" },
  { value: "warek", label: "Wakil Rector III" },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "Pengelola KIP-K",
  mahasiswa: "Mahasiswa",
  prodi: "Program Studi",
  warek: "Warek III",
};

const PAGE_SIZE = 10;

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] transition-colors ${className}`}
      {...props}
    />
  );
}

function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] transition-colors bg-white ${className}`}
      {...props}
    />
  );
}

interface UserFormData {
  name: string;
  username: string;
  email: string;
  role: "admin" | "mahasiswa" | "prodi" | "warek";
  prodi_id: string;
}

const emptyForm: UserFormData = { name: "", username: "", email: "", role: "admin", prodi_id: "" };

export default function ManajemenAkun() {
  // List state
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prodis, setProdis] = useState<Prodi[]>([]);

  // Fetch prodis from konfigurasi/all (same source as Konfigurasi.tsx)
  useEffect(() => {
    api.get<{ success: boolean; data: { prodis: Prodi[] } }>("/konfigurasi/all")
      .then((r) => setProdis(r.data.prodis?.filter((p) => p.is_aktif) ?? []))
      .catch(() => {});
  }, []);

  // Filter state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [angkatanFilter, setAngkatanFilter] = useState("Semua");
  const [prodiFilter, setProdiFilter] = useState("Semua");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [angkatans, setAngkatans] = useState<number[]>([]);
  const [searchDebounce, setSearchDebounce] = useState("");

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [formError, setFormError] = useState("");
  const [formSaving, setFormSaving] = useState(false);

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Toast / password display
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearchDebounce(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers({
        search: searchDebounce,
        role: roleFilter,
        angkatan: angkatanFilter !== "Semua" ? angkatanFilter : undefined,
        prodi: prodiFilter !== "Semua" ? prodiFilter : undefined,
        sort,
        page,
        per_page: PAGE_SIZE,
      });
      setUsers(res.data);
      setTotal(res.total);
      setAngkatans(res.filter_options?.angkatans ?? []);
    } catch {
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, searchDebounce, angkatanFilter, prodiFilter, sort]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [searchDebounce, roleFilter, angkatanFilter, prodiFilter, sort]);

  const openCreate = () => {
    setEditId(null);
    setFormData(emptyForm);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (user: UserRow) => {
    setEditId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email ?? "",
      role: user.role as "admin" | "mahasiswa" | "prodi" | "warek",
      prodi_id: user.prodi_id?.toString() ?? "",
    });
    setFormError("");
    setFormOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.name.trim()) { setFormError("Nama harus diisi."); return; }
    if (!formData.username.trim()) { setFormError("Username harus diisi."); return; }
    if (!editId && !formData.email.trim()) { setFormError("Email harus diisi."); return; }

    setFormSaving(true);
    try {
      if (editId) {
        const payload: UpdateUserPayload = {
          name: formData.name,
          username: formData.username,
          email: formData.email || undefined,
          role: formData.role,
          prodi_id: formData.role === "prodi" && formData.prodi_id ? parseInt(formData.prodi_id) : undefined,
        };
        await userService.updateUser(editId, payload);
        showToast("User berhasil diperbarui.");
      } else {
        const payload: CreateUserPayload = {
          name: formData.name,
          username: formData.username,
          email: formData.email || undefined,
          role: formData.role,
          prodi_id: formData.role === "prodi" && formData.prodi_id ? parseInt(formData.prodi_id) : undefined,
        };
        const res = await userService.createUser(payload);
        showToast(`${res.message}\nPassword: ${res.password}`);
      }
      setFormOpen(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err?.message ?? "Gagal menyimpan user.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleToggle = (user: UserRow) => {
    setConfirmTitle(user.is_active ? "Nonaktifkan User?" : "Aktifkan User?");
    setConfirmMessage(
      user.is_active
        ? `Nonaktifkan akun "${user.name}"? User tidak akan bisa login.`
        : `Aktifkan akun "${user.name}"?`
    );
    setConfirmAction(() => async () => {
      setConfirmLoading(true);
      try {
        await userService.toggleUserActive(user.id);
        showToast(user.is_active ? "User dinonaktifkan." : "User diaktifkan.");
        setConfirmOpen(false);
        fetchUsers();
      } catch (err: any) {
        showToast(err?.message ?? "Gagal mengubah status.");
        setConfirmOpen(false);
      } finally {
        setConfirmLoading(false);
      }
    });
    setConfirmOpen(true);
  };

  const handleResetPassword = (user: UserRow) => {
    setConfirmTitle("Reset Password?");
    setConfirmMessage(`Reset password untuk "${user.name}"? Password baru akan ditampilkan setelah reset.`);
    setConfirmAction(() => async () => {
      setConfirmLoading(true);
      try {
        const res = await userService.resetUserPassword(user.id);
        showToast(`Password "${user.name}" berhasil direset.\nPassword baru: ${res.password}`);
        setConfirmOpen(false);
      } catch (err: any) {
        showToast(err?.message ?? "Gagal reset password.");
        setConfirmOpen(false);
      } finally {
        setConfirmLoading(false);
      }
    });
    setConfirmOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Manajemen User</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola akun pengguna sistem KIP-K
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#263F93] hover:bg-[#1B2F73] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={15} />
          Tambah User
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama atau username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] transition-colors bg-white"
        >
          <option value="all">Semua Role</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select
          value={angkatanFilter}
          onChange={(e) => setAngkatanFilter(e.target.value)}
          title="Hanya menyaring akun mahasiswa"
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] transition-colors bg-white text-gray-600"
        >
          <option value="Semua">Semua Angkatan</option>
          {angkatans.map((a) => (
            <option key={a} value={String(a)}>Angkatan {a}</option>
          ))}
        </select>
        <select
          value={prodiFilter}
          onChange={(e) => setProdiFilter(e.target.value)}
          title="Hanya menyaring akun mahasiswa"
          className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/30 focus:border-[#263F93] transition-colors bg-white text-gray-600 truncate"
        >
          <option value="Semua">Semua Prodi</option>
          {prodis.map((p) => (
            <option key={p.id} value={p.nama}>{p.nama}</option>
          ))}
        </select>
        <button
          onClick={() => setSort((s) => (s === "asc" ? "desc" : "asc"))}
          title="Ubah urutan nama"
          className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowUpDown size={14} className="text-gray-400 flex-shrink-0" />
          Nama {sort === "asc" ? "A–Z" : "Z–A"}
        </button>
      </div>

      {(angkatanFilter !== "Semua" || prodiFilter !== "Semua") && (
        <p className="text-xs text-gray-400">
          Filter angkatan dan prodi hanya menyaring akun mahasiswa; akun Pengelola KIP-K,
          Program Studi, dan Warek tetap ditampilkan.
        </p>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="p-3 bg-[#263F93] text-white text-sm rounded-lg shadow-sm whitespace-pre-line">
          {toastMsg}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {["Nama", "Username", "Email", "Role", "Prodi", "Angkatan", "Status", "Aksi"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400 text-sm">
                    <Loader2 size={18} className="animate-spin mx-auto mb-2" />
                    Memuat...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400 text-sm">
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 px-3 text-gray-800 whitespace-nowrap">{user.name}</td>
                    <td className="py-2.5 px-3 text-gray-600 font-mono text-xs whitespace-nowrap">{user.username}</td>
                    <td className="py-2.5 px-3 text-gray-500 text-xs">{user.email ?? "—"}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                        user.role === "admin" ? "bg-blue-100 text-blue-700" :
                        user.role === "mahasiswa" ? "bg-green-100 text-green-700" :
                        user.role === "prodi" ? "bg-purple-100 text-purple-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 text-xs">{user.prodi_nama ?? "—"}</td>
                    <td className="py-2.5 px-3 text-gray-500 text-xs whitespace-nowrap">
                      {user.angkatan ?? "—"}
                    </td>
                    <td className="py-2.5 px-3">
                      {user.is_active ? (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                          Aktif
                        </span>
                      ) : (
                        <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#263F93] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleToggle(user)}
                          className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${user.is_active ? "text-amber-500" : "text-green-500"}`}
                          title={user.is_active ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {user.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button
                          onClick={() => handleResetPassword(user)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#263F93] transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0] text-xs text-gray-500">
            <span>
              Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} dari {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="px-2 font-medium">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Edit User" : "Tambah User"}
        width="max-w-md"
      >
        <div className="space-y-3">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
              <XCircle size={15} className="flex-shrink-0 mt-0.5" />
              {formError}
            </div>
          )}

          <FormField label="Nama Lengkap *">
            <Input
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nama lengkap"
            />
          </FormField>

          <FormField label="Username *">
            <Input
              value={formData.username}
              onChange={(e) => setFormData((f) => ({ ...f, username: e.target.value }))}
              placeholder="Username login"
            />
          </FormField>

          <FormField label="Email">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </FormField>

          <FormField label="Role *">
            <Select
              value={formData.role}
              onChange={(e) => setFormData((f) => ({ ...f, role: e.target.value as UserFormData["role"], prodi_id: "" }))}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Program Studi">
            <Select
              value={formData.prodi_id}
              onChange={(e) => setFormData((f) => ({ ...f, prodi_id: e.target.value }))}
              disabled={formData.role !== "prodi"}
            >
              <option value="">— Pilih Prodi —</option>
              {prodis.map((p) => (
                <option key={p.id} value={p.id}>{p.nama} ({p.kode})</option>
              ))}
            </Select>
          </FormField>

          {!editId && (
            <p className="text-xs text-gray-400">
              Password default: <span className="font-mono">kipk[username]2026</span> — user wajib ganti password saat login pertama.
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <button
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-[#E2E8F0] hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleFormSubmit}
              disabled={formSaving}
              className="px-4 py-2 rounded-lg text-sm text-white bg-[#263F93] hover:bg-[#1B2F73] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {formSaving ? <Loader2 size={14} className="animate-spin" /> : null}
              {formSaving ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah User"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
        title={confirmTitle}
        message={confirmMessage}
        loading={confirmLoading}
      />
    </div>
  );
}
