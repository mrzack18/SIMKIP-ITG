import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import EksporLaporan from "./pages/prodi/EksporLaporan";
import WarekDashboard from "./pages/warek/Dashboard";
import WarekLaporanList from "./pages/warek/LaporanList";
import WarekLaporanDetail from "./pages/warek/LaporanDetail";
import WarekMahasiswaList from "./pages/warek/MahasiswaList";
import WarekMahasiswaDetail from "./pages/prodi/MahasiswaDetail";
import Placeholder from "./pages/Placeholder";

const adminUser = { nama: "Encep Jianul Hayat, S.T., M.T.", nim: undefined };
const studentUser = { nama: "Ahmad Rifaldi", nim: "2206001" };
const prodiUser = { nama: "Teknik Informatika", nim: undefined };
const warekUser = { nama: "Dr. Rina Kurniawati, S.E., M.Si.", nim: undefined };

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route path="/admin" element={<Layout role="admin" user={adminUser} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="mahasiswa" element={<MahasiswaList />} />
          <Route path="mahasiswa/tambah" element={<TambahMahasiswa />} />
          <Route path="mahasiswa/:id" element={<MahasiswaDetail />} />
          <Route path="akademik" element={<DataAkademik />} />
          <Route path="dokumen" element={<DokumenQueue />} />
          <Route path="sp" element={<SPList />} />
          <Route path="sp/terbitkan" element={<TerbitkanSP />} />
          <Route path="sp/:id" element={<SPDetail />} />
          <Route path="bebas-tanggungan" element={<BebasTanggunganList />} />
          <Route path="bebas-tanggungan/:id" element={<BebasTanggunganDetail />} />
          <Route path="laporan" element={<LaporanList />} />
          <Route path="laporan/baru" element={<SusunLaporan />} />
          <Route path="laporan/:id" element={<LaporanDetail />} />
          <Route path="konfigurasi" element={<Konfigurasi />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="profil" element={<Profil role="admin" user={adminUser} />} />
        </Route>

        {/* Student routes */}
        <Route path="/mahasiswa" element={<Layout role="mahasiswa" user={studentUser} />}>
          <Route index element={<StudentDashboard />} />
          <Route path="ipk" element={<InputIPK />} />
          <Route path="prestasi" element={<Prestasi />} />
          <Route path="organisasi" element={<Organisasi />} />
          <Route path="pelatihan" element={<Pelatihan />} />
          <Route path="upload" element={<UploadDokumen />} />
          <Route path="arsip" element={<ArsipDigital />} />
          <Route path="sp" element={<SPMahasiswa />} />
          <Route path="bebas-tanggungan" element={<BebasTanggungan />} />
          <Route path="profil" element={<Profil role="mahasiswa" user={studentUser} />} />
        </Route>

        {/* Prodi routes */}
        <Route path="/prodi" element={<Layout role="prodi" user={prodiUser} />}>
          <Route index element={<ProdiDashboard />} />
          <Route path="mahasiswa" element={<ProdiMahasiswaList />} />
          <Route path="mahasiswa/:id" element={<ProdiMahasiswaDetail />} />
          <Route path="ekspor" element={<EksporLaporan />} />
          <Route path="profil" element={<Profil role="prodi" user={prodiUser} />} />
        </Route>

        {/* Warek routes */}
        <Route path="/warek" element={<Layout role="warek" user={warekUser} />}>
          <Route index element={<WarekDashboard />} />
          <Route path="laporan" element={<WarekLaporanList />} />
          <Route path="laporan/:id" element={<WarekLaporanDetail />} />
          <Route path="mahasiswa" element={<WarekMahasiswaList />} />
          <Route path="mahasiswa/:id" element={<WarekMahasiswaDetail />} />
          <Route path="profil" element={<Profil role="warek" user={warekUser} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
