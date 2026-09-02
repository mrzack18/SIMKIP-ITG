import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import Sidebar from "./Sidebar";
import { getBadgeCounts } from "@/services/dashboardService";

type Role = "admin" | "mahasiswa" | "prodi" | "warek";

interface LayoutProps {
  role: Role;
  user: { nama: string; nim?: string; foto?: string | null };
}

const roleLabel: Record<Role, string> = {
  admin: "Pengelola KIP-K",
  mahasiswa: "Mahasiswa",
  prodi: "Program Studi",
  warek: "Wakil Rektor III",
};



export default function Layout({ role, user }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState<{ dokumen_queue_menunggu: number; bebas_tanggungan_menunggu: number }>({
    dokumen_queue_menunggu: 0,
    bebas_tanggungan_menunggu: 0,
  });
  const navigate = useNavigate();

  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => navigate("/");

  // Fetch badge counts for admin sidebar
  useEffect(() => {
    if (role !== "admin") return;
    let active = true;
    getBadgeCounts()
      .then((res) => {
        if (active) {
          setBadgeCounts({
            dokumen_queue_menunggu: res.dokumen_queue_menunggu,
            bebas_tanggungan_menunggu: res.bebas_tanggungan_menunggu,
          });
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, [role]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user.nama.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() || user.nama.charAt(0);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} onLogout={handleLogout} badgeCounts={badgeCounts} />

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
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => { setShowProfile(v => !v); }}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-[#263F93] flex items-center justify-center text-white text-sm font-600">
                  {user.foto ? (
                    <img src={user.foto} alt={user.nama} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
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
