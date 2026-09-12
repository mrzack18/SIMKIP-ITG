/**
 * Reporting Service — laporan prestasi, keaktifan organisasi, dan pelatihan.
 *
 * Dipakai oleh halaman Reporting untuk role admin & prodi. Backend otomatis
 * membatasi data ke prodi milik user saat role === "prodi".
 */
import { api, API_BASE_URL } from "./api";

export type ReportingType = "prestasi" | "organisasi" | "pelatihan";

export interface ReportingFilter {
  tahun_ajaran?: string;
  prodi_id?: string;
  status?: string;
  /** Tingkat (prestasi) atau Jenis (organisasi & pelatihan). */
  tingkat?: string;
  jenis?: string;
}

export interface ReportingRow {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  status: string;
  // Prestasi
  namaPrestasi?: string;
  tingkat?: string;
  pencapaian?: string;
  penyelenggara?: string;
  // Organisasi
  organisasi?: string;
  jenis?: string;
  jabatan?: string;
  periodeMulai?: string;
  periodeSelesai?: string;
  // Pelatihan
  namaPelatihan?: string;
  // Dipakai prestasi & pelatihan
  tanggalMulai?: string;
  tanggalSelesai?: string;
  tempat?: string;
  /**
   * Bentuk Resource lengkap (berkas, deskripsi, catatan) untuk modal detail —
   * sama persis dengan yang dipakai halaman Detail Mahasiswa.
   */
  detail?: Record<string, any>;
}

export interface ReportingResponse {
  success: boolean;
  data: ReportingRow[];
  total: number;
  judul: string;
  /** Ringkasan filter aktif dari backend, format { "Tahun Ajaran": "2025/2026 Ganjil" }. */
  filter: Record<string, string>;
  options: {
    status: string[];
    extra: string[];
  };
}

/** Buang key yang kosong / bernilai "Semua" agar tidak ikut terkirim. */
function toParams(filter: ReportingFilter): string {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (!value || value === "Semua" || value === "Semua Status") return;
    params.append(key, String(value));
  });
  return params.toString();
}

export async function getReporting(
  type: ReportingType,
  filter: ReportingFilter = {}
): Promise<ReportingResponse> {
  const qs = toParams(filter);
  return api.get<ReportingResponse>(`/reporting/${type}${qs ? `?${qs}` : ""}`);
}

/**
 * Unduh laporan sebagai PDF. Endpoint dilindungi token, jadi file diambil
 * sebagai blob lalu ditulis lewat anchor sementara.
 */
export async function downloadReportingPdf(
  type: ReportingType,
  filter: ReportingFilter = {}
): Promise<void> {
  const token = localStorage.getItem("simkip_token");
  const qs = toParams(filter);

  const res = await fetch(`${API_BASE_URL}/reporting/${type}/pdf${qs ? `?${qs}` : ""}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/pdf",
    },
  });

  if (!res.ok) throw new Error("Gagal mengunduh PDF laporan");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Laporan_${type}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
