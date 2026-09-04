import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, FileCheck, AlertTriangle, Award,
  BarChart3, Settings, History, ChevronLeft, ChevronRight,
  Upload, Folder, Bell, User, LogOut, GraduationCap, BookOpen,
  FileText, X,
} from "lucide-react";
import logoItg from "@/imports/logo_itg.jpg";

type Role = "admin" | "mahasiswa" | "prodi" | "warek";

const adminNav = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/mahasiswa", icon: Users, label: "Manajemen Mahasiswa" },
  { to: "/admin/akademik", icon: BookOpen, label: "Data Akademik" },
  { to: "/admin/dokumen", icon: FileCheck, label: "Validasi Dokumen" },
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
  { to: "/prodi/laporan", icon: FileText, label: "Laporan Semester" },
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

interface BadgeCounts {
  dokumen_queue_menunggu: number;
  bebas_tanggungan_menunggu: number;
}

interface SidebarProps {
  role: Role;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  badgeCounts?: BadgeCounts;
  mobileOpen?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
}

export default function Sidebar({ role, collapsed, onToggle, onLogout, badgeCounts, mobileOpen = false, onClose, onNavigate }: SidebarProps) {
  const nav = navMap[role];

  const roleLabel: Record<Role, string> = {
    admin: "Pengelola KIP-K",
    mahasiswa: "Mahasiswa",
    prodi: "Program Studi",
    warek: "Warek III",
  };

  return (
    <aside
      className={`flex flex-col h-screen supports-[height:100dvh]:h-dvh fixed top-0 left-0 z-40 w-[280px] max-w-[85vw] sm:w-64 sm:max-w-none shadow-xl lg:shadow-none transition-transform duration-300 lg:transition-all lg:translate-x-0 ${collapsed ? "lg:w-16" : "lg:w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ background: "linear-gradient(180deg, #263F93 0%, #1B2F73 100%)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 sm:py-5 border-b border-white/10 min-w-0">
        <img src={logoItg} alt="ITG" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 flex-shrink-0" />
        <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
          <div className="font-display font-700 text-white text-sm leading-tight truncate">SIMKIP-ITG</div>
          <div className="text-white/50 text-[10px]">KIP-K Monitoring</div>
        </div>
        {/* Close button — mobile drawer only */}
        <button
          onClick={onClose}
          aria-label="Tutup menu navigasi"
          className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Role badge */}
      <div className={`mx-3 mt-3 mb-1 px-3 py-1.5 rounded-md bg-white/10 ${collapsed ? "lg:hidden" : ""}`}>
        <span className="text-[#D4A72C] text-xs font-500 truncate block">{roleLabel[role]}</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 min-h-0">
        {nav.map(({ to, icon: Icon, label }) => {
          // Determine badge count for admin routes
          const badgeCount = (() => {
            if (role !== "admin" || !badgeCounts) return undefined;
            if (to === "/admin/dokumen") return badgeCounts.dokumen_queue_menunggu;
            if (to === "/admin/bebas-tanggungan") return badgeCounts.bebas_tanggungan_menunggu;
            return undefined;
          })();

          return (
            <NavLink
              key={to}
              to={to}
              end={to.split("/").length <= 2}
              onClick={onNavigate}
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
                  <span className={`text-sm font-500 truncate ${collapsed ? "lg:hidden" : ""}`}>{label}</span>
                  {badgeCount !== undefined && badgeCount > 0 && (
                    <span className={`ml-auto text-xs font-600 px-1.5 py-0.5 rounded-full ${collapsed ? "lg:hidden" : ""} ${isActive ? "bg-[#263F93] text-[#D4A72C]" : "bg-[#D4A72C] text-[#263F93]"}`}>
                      {badgeCount}
                    </span>
                  )}
                  {collapsed && (
                    <span className="hidden lg:block absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {label}
                      {badgeCount !== undefined && badgeCount > 0 && (
                        <span className="ml-1.5 bg-[#D4A72C] text-[#263F93] text-[10px] font-600 px-1.5 py-0.5 rounded-full">
                          {badgeCount}
                        </span>
                      )}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className={`text-sm ${collapsed ? "lg:hidden" : ""}`}>Keluar</span>
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
