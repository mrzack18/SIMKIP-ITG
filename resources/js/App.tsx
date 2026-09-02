import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { getCurrentUser } from "@/services/authService";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/admin/Dashboard";
import MahasiswaList from "./pages/admin/MahasiswaList";
import MahasiswaDetail from "./pages/admin/MahasiswaDetail";
import TambahMahasiswa from "./pages/admin/TambahMahasiswa";
import DokumenQueue from "./pages/admin/DokumenQueue";
import SPList from "./pages/admin/SPList";
import SPDetail from "./pages/admin/SPDetail";
import TerbitkanSP from "./pages/admin/TerbitkanSP";
import DataAkademik from "./pages/admin/DataAkademik";
import BebasTanggunganList from "./pages/admin/BebasTanggunganList";
import BebasTanggunganDetail from "./pages/admin/BebasTanggunganDetail";
import LaporanList from "./pages/admin/LaporanList";
import SusunLaporan from "./pages/admin/SusunLaporan";
import LaporanDetail from "./pages/admin/LaporanDetail";
import Konfigurasi from "./pages/admin/Konfigurasi";
import AuditLog from "./pages/admin/AuditLog";
import StudentDashboard from "./pages/student/Dashboard";
import UploadDokumen from "./pages/student/UploadDokumen";
import InputIPK from "./pages/student/InputIPK";
import Prestasi from "./pages/student/Prestasi";
import Organisasi from "./pages/student/Organisasi";
import ArsipDigital from "./pages/student/ArsipDigital";
import Pelatihan from "./pages/student/Pelatihan";
import SPMahasiswa from "./pages/student/SPMahasiswa";
import BebasTanggungan from "./pages/student/BebasTanggungan";
import Profil from "./pages/student/Profil";
import ProdiDashboard from "./pages/prodi/Dashboard";
import ProdiMahasiswaList from "./pages/prodi/MahasiswaList";
import ProdiMahasiswaDetail from "./pages/prodi/MahasiswaDetail";
import ProdiLaporanList from "./pages/prodi/LaporanList";
import ProdiLaporanDetail from "./pages/prodi/LaporanDetail";
import EksporLaporan from "./pages/prodi/EksporLaporan";
import WarekDashboard from "./pages/warek/Dashboard";
import WarekLaporanList from "./pages/warek/LaporanList";
import WarekLaporanDetail from "./pages/warek/LaporanDetail";
import WarekMahasiswaList from "./pages/warek/MahasiswaList";
import WarekMahasiswaDetail from "./pages/warek/MahasiswaDetail";
import Placeholder from "./pages/Placeholder";

/** Resolve user object from auth session for the layout profile dropdown. */
function resolveLayoutUser(role: string) {
  const u = getCurrentUser();
  return {
    nama: u?.nama ?? u?.name ?? "User",
    nim: u?.nim ?? undefined,
    foto: u?.foto ?? null,
  };
}

/** Wrapper that reads auth from context and passes resolved user to Layout. */
function LayoutWrapper({ role }: { role: "admin" | "mahasiswa" | "prodi" | "warek" }) {
  const { isLoading, user: authUser } = useAuth();
  // Re-derive from localStorage each time authUser changes so foto updates propagate
  const user = resolveLayoutUser(role);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#263F93]" />
      </div>
    );
  }
  return <Layout role={role} user={user} key={authUser?.foto ?? "no-foto"} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route path="/admin" element={<LayoutWrapper role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="mahasiswa" element={<MahasiswaList />} />
            <Route path="mahasiswa/tambah" element={<TambahMahasiswa />} />
            <Route path="mahasiswa/:id" element={<MahasiswaDetail />} />
            <Route path="akademik" element={<DataAkademik />} />
            <Route path="dokumen" element={<DokumenQueue />} />
            <Route path="sp" element={<SPList />} />
            <Route path="sp/terbit kan" element={<TerbitkanSP />} />
            <Route path="sp/:id" element={<SPDetail />} />
            <Route path="bebas-tanggungan" element={<BebasTanggunganList />} />
            <Route path="bebas-tanggungan/:id" element={<BebasTanggunganDetail />} />
            <Route path="laporan" element={<LaporanList />} />
            <Route path="laporan/baru" element={<SusunLaporan />} />
            <Route path="laporan/:id" element={<LaporanDetail />} />
            <Route path="konfigurasi" element={<Konfigurasi />} />
            <Route path="audit" element={<AuditLog />} />
            <Route path="profil" element={<Profil role="admin" />} />
          </Route>

          {/* Student routes */}
          <Route path="/mahasiswa" element={<LayoutWrapper role="mahasiswa" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="ipk" element={<InputIPK />} />
            <Route path="prestasi" element={<Prestasi />} />
            <Route path="organisasi" element={<Organisasi />} />
            <Route path="pelatihan" element={<Pelatihan />} />
            <Route path="upload" element={<UploadDokumen />} />
            <Route path="arsip" element={<ArsipDigital />} />
            <Route path="sp" element={<SPMahasiswa />} />
            <Route path="bebas-tanggungan" element={<BebasTanggungan />} />
            <Route path="profil" element={<Profil role="mahasiswa" />} />
          </Route>

          {/* Prodi routes */}
          <Route path="/prodi" element={<LayoutWrapper role="prodi" />}>
            <Route index element={<ProdiDashboard />} />
            <Route path="mahasiswa" element={<ProdiMahasiswaList />} />
            <Route path="mahasiswa/:id" element={<ProdiMahasiswaDetail />} />
            <Route path="laporan" element={<ProdiLaporanList />} />
            <Route path="laporan/:id" element={<ProdiLaporanDetail />} />
            <Route path="ekspor" element={<EksporLaporan />} />
            <Route path="profil" element={<Profil role="prodi" />} />
          </Route>

          {/* Warek routes */}
          <Route path="/warek" element={<LayoutWrapper role="warek" />}>
            <Route index element={<WarekDashboard />} />
            <Route path="laporan" element={<WarekLaporanList />} />
            <Route path="laporan/:id" element={<WarekLaporanDetail />} />
            <Route path="mahasiswa" element={<WarekMahasiswaList />} />
            <Route path="mahasiswa/:id" element={<WarekMahasiswaDetail />} />
            <Route path="profil" element={<Profil role="warek" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
