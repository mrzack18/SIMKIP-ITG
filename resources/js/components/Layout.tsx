import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Search } from "lucide-react";
import Sidebar from "./Sidebar";

type Role = "admin" | "mahasiswa" | "prodi" | "warek";

interface LayoutProps {
  role: Role;
  user: { nama: string; nim?: string };
}

const roleLabel: Record<Role, string> = {
  admin: "Pengelola KIP-K",
  mahasiswa: "Mahasiswa",
  prodi: "Program Studi",
  warek: "Wakil Rektor III",
};

const notifications = [
  { id: 1, color: "bg-yellow-400", text: "Dokumen MABIM Ahmad Rifaldi menunggu validasi", time: "2 jam lalu" },
  { id: 2, color: "bg-blue-400",   text: "SP1 Budi Santoso diterbitkan",                  time: "5 jam lalu" },
  { id: 3, color: "bg-green-400",  text: "Laporan Semester telah disetujui Warek",         time: "1 hari lalu" },
];

export default function Layout({ role, user }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => navigate("/");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} onLogout={handleLogout} />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari mahasiswa, NIM..."
                className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 focus:border-[#263F93]/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotif(v => !v); setShowProfile(false); }}
                className="relative w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Bell size={16} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-600">3</span>
              </button>
              {showNotif && (
                <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-lg border border-[#E2E8F0] z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-600 text-gray-800">Notifikasi</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {notifications.map(n => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 leading-snug">{n.text}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                    <button className="text-xs text-[#263F93] font-600 hover:underline">Lihat Semua Notifikasi</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => { setShowProfile(v => !v); setShowNotif(false); }}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#263F93] flex items-center justify-center text-white text-sm font-600">
                  {user.nama.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-500 text-gray-800 leading-tight">{user.nama}</div>
                  {user.nim && <div className="text-xs text-gray-400">{user.nim}</div>}
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
              {showProfile && (
                <div className="absolute right-0 top-11 min-w-48 bg-white rounded-xl shadow-lg border border-[#E2E8F0] z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-700 text-gray-800">{user.nama}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{roleLabel[role]}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate(`/${role}/profil`); setShowProfile(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Profil Saya
                    </button>
                    <div className="border-t border-[#E2E8F0] my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
