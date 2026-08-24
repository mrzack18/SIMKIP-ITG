import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, FileCheck, AlertTriangle, Award,
  BarChart3, Settings, History, ChevronLeft, ChevronRight,
  Upload, Folder, Bell, User, LogOut, GraduationCap, BookOpen,
} from "lucide-react";
import logoItg from "@/imports/logo_itg.jpg";

type Role = "admin" | "mahasiswa" | "prodi" | "warek";

const adminNav = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/mahasiswa", icon: Users, label: "Manajemen Mahasiswa" },
  { to: "/admin/akademik", icon: BookOpen, label: "Data Akademik" },
  { to: "/admin/dokumen", icon: FileCheck, label: "Validasi Dokumen", badge: 5 },
  { to: "/admin/sp", icon: AlertTriangle, label: "Surat Peringatan" },
  { to: "/admin/bebas-tanggungan", icon: Award, label: "Surat Penyelesaian" },
  { to: "/admin/laporan", icon: BarChart3, label: "Laporan Semester" },
  { to: "/admin/konfigurasi", icon: Settings, label: "Konfigurasi" },
  { to: "/admin/audit", icon: History, label: "Audit Log" },
];

const mahasiswaNav = [
  { to: "/mahasiswa", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/mahasiswa/ipk", icon: BarChart3, label: "Input Nilai Semester" },
  { to: "/mahasiswa/prestasi", icon: Award, label: "Prestasi" },
  { to: "/mahasiswa/organisasi", icon: Users, label: "Keaktifan Organisasi" },
  { to: "/mahasiswa/pelatihan", icon: BookOpen, label: "Pelatihan" },
  { to: "/mahasiswa/upload", icon: Upload, label: "Upload Dokumen" },
  { to: "/mahasiswa/arsip", icon: Folder, label: "Arsip Digital" },
  { to: "/mahasiswa/sp", icon: Bell, label: "Surat Peringatan" },
  { to: "/mahasiswa/bebas-tanggungan", icon: GraduationCap, label: "Surat Penyelesaian" },
  { to: "/mahasiswa/profil", icon: User, label: "Profil" },
];

const prodiNav = [
  { to: "/prodi", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/prodi/mahasiswa", icon: Users, label: "Daftar Mahasiswa" },
  { to: "/prodi/ekspor", icon: BarChart3, label: "Ekspor Laporan" },
  { to: "/prodi/profil", icon: User, label: "Profil" },
];

const warekNav = [
  { to: "/warek", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/warek/laporan", icon: BarChart3, label: "Laporan" },
  { to: "/warek/mahasiswa", icon: Users, label: "Mahasiswa" },
  { to: "/warek/profil", icon: User, label: "Profil" },
];

const navMap: Record<Role, typeof adminNav> = {
  admin: adminNav,
  mahasiswa: mahasiswaNav,
  prodi: prodiNav,
  warek: warekNav,
};

interface SidebarProps {
  role: Role;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export default function Sidebar({ role, collapsed, onToggle, onLogout }: SidebarProps) {
  const nav = navMap[role];

  const roleLabel: Record<Role, string> = {
    admin: "Pengelola KIP-K",
    mahasiswa: "Mahasiswa",
    prodi: "Program Studi",
    warek: "Warek III",
  };

  return (
    <aside
      className={`flex flex-col h-screen fixed top-0 left-0 z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      style={{ background: "linear-gradient(180deg, #263F93 0%, #1B2F73 100%)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <img src={logoItg} alt="ITG" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 flex-shrink-0" />
        {!collapsed && (
          <div>
            <div className="font-display font-700 text-white text-sm leading-tight">SIMKIP-ITG</div>
            <div className="text-white/50 text-[10px]">KIP-K Monitoring</div>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 px-3 py-1.5 rounded-md bg-white/10">
          <span className="text-[#D4A72C] text-xs font-500">{roleLabel[role]}</span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {nav.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split("/").length <= 2}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 group
              ${isActive
                ? "bg-[#D4A72C] text-[#263F93]"
                : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="text-sm font-500 truncate">{label}</span>}
                {badge && !collapsed && (
                  <span className={`ml-auto text-xs font-600 px-1.5 py-0.5 rounded-full ${isActive ? "bg-[#263F93] text-[#D4A72C]" : "bg-[#D4A72C] text-[#263F93]"}`}>
                    {badge}
                  </span>
                )}
                {collapsed && (
                  <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Keluar</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
