import { api } from "./api";

export interface DokumenJenisItem {
  id: number;
  nama: string;
  kode: string | null;
  deskripsi: string | null;
  is_wajib: boolean;
  urutan: number;
}

export interface SignatureConfig {
  pengelola_nama: string;
  pengelola_nip: string;
  warek_nama: string;
  warek_nip: string;
}

export interface InstitusiConfig {
  nama: string;
  alamat: string;
  telp: string;
}

/**
 * Ambang batas akademik + flag aktif/nonaktifnya, sebagaimana dikirim indexAll().
 *
 * Perhatikan asimetrinya: server MENGIRIM flag sebagai boolean, tapi PUT menerima
 * string '1'/'0'. Lihat saveRegulasiAll() di pages/admin/Konfigurasi.tsx.
 */
export interface AturanAkademikData {
  ipk_minimum: string;
  ipk_minimum_aktif: boolean;
  masa_tenggang_sp: string;
  masa_tenggang_sp_aktif: boolean;
  max_semester: string;
  max_semester_aktif: boolean;
  /** Tidak lagi tampil di tab Regulasi; key-nya dibiarkan ada. */
  sks_minimum_semester: string;
  sks_minimum_lulus: string;
  sks_minimum_lulus_aktif: boolean;
}

export interface PeriodeItem {
  id: number;
  tahun_akademik: string;
  semester: string;
  tanggal_buka: string;
  tanggal_tutup: string;
  is_aktif: boolean;
}

/**
 * Bentuk data GET /konfigurasi/all.
 *
 * Sebelumnya interface ini menjanjikan `regulasi` yang TIDAK PERNAH dikirim
 * server, sementara `aturan_akademik` dan `periode_aktif` yang justru ada tidak
 * tercantum sama sekali — jadi TypeScript tidak bisa menangkap pemakaian yang salah.
 */
interface KonfigurasiAllData {
  institusi: InstitusiConfig;
  signature: SignatureConfig;
  aturan_akademik: AturanAkademikData;
  periode_aktif: {
    tahun_akademik: string;
    semester: string;
    tahun_ajaran: string;
    /** Tanggal ISO 'YYYY-MM-DD' sebagai string polos, bukan objek. */
    buka: string;
    tutup: string;
    is_aktif: boolean;
  };
  nilai_mutu: any[];
  jenis_pelanggaran: any[];
  periode_history: PeriodeItem[];
  prodis: any[];
  dokumens: DokumenJenisItem[];
  mahasiswa_count_aktif: number;
}

interface KonfigurasiAllResponse {
  success: boolean;
  data: KonfigurasiAllData;
}

export async function getKonfigurasiAll(): Promise<KonfigurasiAllResponse> {
  // URL-nya TANPA prefix /admin — route-nya api/konfigurasi/all. Sebelumnya
  // menunjuk /admin/konfigurasi/all yang tidak pernah ada, dan kegagalannya
  // ditelan catch kosong di tujuh halaman sehingga blok tanda tangan PDF
  // diam-diam jatuh ke nama bawaan.
  return api.get<KonfigurasiAllResponse>("/konfigurasi/all");
}

// getDokumenJenisList() dihapus: tidak punya pemanggil sama sekali, dan URL-nya
// salah dengan cara yang sama. Daftar dokumen sudah tersedia lewat
// getKonfigurasiAll().data.dokumens.

export interface PelanggaranItem {
  id: number;
  nama: string;
  deskripsi: string | null;
  eskalasi: string;
  aktif: boolean;
}

export async function getPelanggaranList(): Promise<PelanggaranItem[]> {
  const res = await api.get<{ success: boolean; data: PelanggaranItem[] }>("/konfigurasi/pelanggaran");
  return res.data ?? [];
}

// ─── Tahun Ajaran CRUD ────────────────────────────────────────────

export interface TahunAjaranItem {
  id: number;
  tahun_akademik: string;
  semester: "Ganjil" | "Genap";
  is_aktif: boolean;
}

export async function getTahunAjaranList(): Promise<TahunAjaranItem[]> {
  const res = await api.get<{ success: boolean; data: TahunAjaranItem[] }>("/konfigurasi/tahun-ajaran");
  return res.data ?? [];
}

export async function createTahunAjaran(input: {
  tahun_akademik: string;
  semester: "Ganjil" | "Genap";
  is_aktif?: boolean;
}): Promise<TahunAjaranItem> {
  const res = await api.post<{ success: boolean; data: TahunAjaranItem }>("/konfigurasi/tahun-ajaran", input);
  return res.data;
}

export async function updateTahunAjaran(id: number, input: {
  tahun_akademik: string;
  semester: "Ganjil" | "Genap";
  is_aktif?: boolean;
}): Promise<TahunAjaranItem> {
  const res = await api.put<{ success: boolean; data: TahunAjaranItem }>(`/konfigurasi/tahun-ajaran/${id}`, input);
  return res.data;
}

export async function deleteTahunAjaran(id: number): Promise<void> {
  await api.delete(`/konfigurasi/tahun-ajaran/${id}`);
}

export async function activateTahunAjaran(id: number): Promise<TahunAjaranItem> {
  const res = await api.patch<{ success: boolean; data: TahunAjaranItem }>(`/konfigurasi/tahun-ajaran/${id}/activate`);
  return res.data;
}

export async function deactivateTahunAjaran(id: number): Promise<TahunAjaranItem> {
  const res = await api.patch<{ success: boolean; data: TahunAjaranItem }>(`/konfigurasi/tahun-ajaran/${id}/deactivate`);
  return res.data;
}

// ─── Periode Akademik CRUD ────────────────────────────────────────────

export interface PeriodeCreateInput {
  tahun_akademik: string;
  semester: "Ganjil" | "Genap";
  tanggal_buka: string;
  tanggal_tutup: string;
  is_aktif?: boolean;
}

export async function getPeriodeList(): Promise<PeriodeItem[]> {
  const res = await api.get<{ success: boolean; data: PeriodeItem[] }>("/konfigurasi/periode-akademik");
  return res.data ?? [];
}

export async function createPeriode(input: PeriodeCreateInput): Promise<PeriodeItem> {
  const res = await api.post<{ success: boolean; data: PeriodeItem }>("/konfigurasi/periode-akademik", input);
  return res.data;
}

export async function updatePeriode(id: number, input: Partial<PeriodeCreateInput>): Promise<PeriodeItem> {
  const res = await api.put<{ success: boolean; data: PeriodeItem }>(`/konfigurasi/periode-akademik/${id}`, input);
  return res.data;
}

export async function deletePeriode(id: number): Promise<void> {
  await api.delete(`/konfigurasi/periode-akademik/${id}`);
}

export async function activatePeriode(id: number): Promise<PeriodeItem> {
  const res = await api.patch<{ success: boolean; data: PeriodeItem }>(`/konfigurasi/periode-akademik/${id}/activate`);
  return res.data;
}

/**
 * Nonaktifkan satu periode tanpa menyentuh periode lain.
 *
 * Periode lain yang sedang aktif TETAP aktif — beberapa tahun ajaran boleh
 * dibuka bersamaan.
 */
export async function deactivatePeriode(id: number): Promise<PeriodeItem> {
  const res = await api.patch<{ success: boolean; data: PeriodeItem }>(`/konfigurasi/periode-akademik/${id}/deactivate`);
  return res.data;
}
