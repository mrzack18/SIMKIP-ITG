# Implementation Plan — Role Admin (SIMKIP-ITG)
**Tanggal**: 2026-08-28  
**Based on**: `discovery_admin_next_phase_100_readonly.md`  
**Mode**: Implementation-ready (siap dieksekusi setelah approval final)  
**Prinsip**: 
- ✅ FE yang sudah di-approve = **Fixed Requirement** (tidak boleh dihapus/disederhanakan)
- ✅ BACKEND + DATABASE dibangun untuk memenuhi FE
- ✅ ZERO UI/UX change — hanya wiring/state management
- ✅ ZERO new migration (semua entity sudah ada)

---

## 0. Daftar File yang **TIDAK BOLEH** Disentuh (FINAL ACCEPTANCE / UI Approved)

| File / Area | Status |
| --- | --- |
| `resources/js/pages/student/*` | FINAL ACCEPTANCE (commit `24d168f`) |
| `resources/js/pages/prodi/*` | FINAL ACCEPTANCE |
| `resources/js/pages/warek/*` | FINAL ACCEPTANCE |
| `resources/js/pages/admin/*` (komponen visual) | **UI/UX approved** — boleh wiring state, JANGAN ubah layout/visual |
| `app/Http/Controllers/Api/AuthController` | FINAL — jangan disentuh |
| `app/Services/BebasTanggunganService` | FINAL — business rule approved |
| `app/Services/SPValidationService` | FINAL |
| `app/Services/IPKCalculatorService` | FINAL |
| `app/Services/PdfGeneratorService` | FINAL (sudah baca konfigurasi BE) |
| `app/Models/*` | FINAL — schemas approved |
| `database/migrations/*` | FINAL — tidak ada migration baru |

**Konsekuensi**: Implementation ini **strictly additive + state wiring**. Tidak ada perubahan UI/UX, tidak ada perubahan business rule, tidak ada perubahan migration.

---

## Ringkasan Task

| Phase | Tasks | Severity | Backend Files | Frontend Files |
| --- | --- | --- | --- | --- |
| **Phase 1** | 5 tasks | P0 HIGH (Security) | 4 files | 1 file |
| **Phase 2** | 6 tasks | P1 (FE Integration) | 1 file (signatures endpoint, optional) | 8 files |
| **Phase 3** | 8 tasks | P2 (Post-launch) | 3 files | 6 files |
| **Total** | **19 tasks** | — | **~8 files** | **~15 files** |

**Zero DB migration. Zero UI/UX change. Zero business rule change.**

---

# PHASE 1 — P0 SECURITY (BLOCKING untuk production)

> **Tujuan**: Menghilangkan 5 risiko security yang ditemukan di audit. Phase ini WAJIB selesai sebelum production go-live.

## T1.1 — Login Rate Limiting

**Severity**: 🔴 HIGH  
**Modul**: Authentication  
**Penanggung Jawab**: Backend

### Files to Change
- `routes/api.php` (1 line)
- `app/Http/Controllers/Api/AuthController.php` (verify)

### Changes Detail
**`routes/api.php`** line 18 — tambahkan throttle middleware:
```php
// BEFORE
Route::post("/auth/login", [AuthController::class, "login"]);

// AFTER
Route::post("/auth/login", [AuthController::class, "login"])
    ->middleware("throttle:5,1"); // max 5 attempts per minute per IP
```

**`app/Http/Controllers/Api/AuthController.php`** `login()` — wrap dalam `RateLimiter::attempt()` atau biarkan middleware handle:
- Tidak wajib jika pakai throttle middleware Laravel built-in
- Tambahkan error message custom: `"Terlalu banyak percobaan login. Coba lagi dalam X detik."`

### Acceptance
- ✅ Login berhasil ke-6 dalam 1 menit → return HTTP 429
- ✅ Login berhasil setelah 1 menit cooldown → return HTTP 200
- ✅ Brute force attack terhadap 1 akun akan ter-throttle
- ✅ Tidak mengganggu user normal (5 attempts/menit cukup)

### Verification
```bash
# Test: 6× login gagal dalam 1 menit
for i in 1 2 3 4 5 6; do
  curl -X POST http://localhost:8000/api/auth/login -d 'username=admin&password=wrong'
done
# Expected: ke-6 = HTTP 429 Too Many Requests
```

### Dependencies
- Tidak ada

---

## T1.2 — Admin Authorization Guard untuk Dokumen Queue

**Severity**: 🔴 HIGH  
**Modul**: Dokumen Queue Admin  
**Penanggung Jawab**: Backend

### Files to Change
- `routes/api.php` (1 route group wrap)

### Changes Detail
**`routes/api.php`** lines 109-111 — wrap dalam `role:admin` middleware:
```php
// BEFORE
Route::get("/admin/dokumen-queue", [DokumenController::class, "queue"]);
Route::put("/admin/dokumen-queue/{id}/validate", [DokumenController::class, "validateDokumen"]);

// AFTER
Route::middleware("role:admin")->prefix("admin/dokumen-queue")->group(function () {
    Route::get("/", [DokumenController::class, "queue"]);
    Route::put("/{id}/validate", [DokumenController::class, "validateDokumen"]);
});
```

### Acceptance
- ✅ GET `/api/admin/dokumen-queue` dengan role=mahasiswa → 403
- ✅ GET `/api/admin/dokumen-queue` dengan role=admin → 200
- ✅ PUT validate dengan role=mahasiswa → 403
- ✅ PUT validate dengan role=admin → 200
- ✅ Response body: `{"success":false,"message":"Akses ditolak..."}`

### Verification
```bash
# Login as mahasiswa, dapat token
TOKEN_MHS=$(curl -s -X POST http://localhost:8000/api/auth/login -d 'username=2206001&password=...' | jq -r .token)
curl -X GET http://localhost:8000/api/admin/dokumen-queue -H "Authorization: Bearer $TOKEN_MHS"
# Expected: 403
```

### Dependencies
- `CheckRole` middleware sudah ada di `app/Http/Middleware/CheckRole.php`

---

## T1.3 — Role Guard untuk Bebas Tanggungan Approve/Reject

**Severity**: 🔴 HIGH  
**Modul**: Bebas Tanggungan Admin  
**Penanggung Jawab**: Backend

### Files to Change
- `routes/api.php` (2 routes)

### Changes Detail
**`routes/api.php`** lines 119-120:
```php
// BEFORE
Route::patch("/bebas-tanggungan/{id}/approve", [BebasTanggunganController::class, "approve"]);
Route::patch("/bebas-tanggungan/{id}/reject",  [BebasTanggunganController::class, "reject"]);

// AFTER
Route::patch("/bebas-tanggungan/{id}/approve", [BebasTanggunganController::class, "approve"])
    ->middleware("role:admin");
Route::patch("/bebas-tanggungan/{id}/reject",  [BebasTanggunganController::class, "reject"])
    ->middleware("role:admin");
```

### Acceptance
- ✅ PATCH approve dengan role=mahasiswa → 403
- ✅ PATCH approve dengan role=admin → 200
- ✅ Sama untuk reject

### Verification
```bash
TOKEN_MHS=$(...) # as before
curl -X PATCH http://localhost:8000/api/bebas-tanggungan/1/approve -H "Authorization: Bearer $TOKEN_MHS"
# Expected: 403
```

### Dependencies
- `CheckRole` middleware sudah ada

---

## T1.4 — IDOR Protection untuk Mahasiswa Detail/Sub-resources

**Severity**: 🔴 HIGH  
**Modul**: Mahasiswa  
**Penanggung Jawab**: Backend

### Files to Change
- `app/Http/Controllers/Api/Admin/MahasiswaController.php` (5 methods)
- `app/Http/Controllers/Api/MahasiswaController.php` (verify existing checks)

### Changes Detail

**`app/Http/Controllers/Api/Admin/MahasiswaController.php`** — setiap method yang baca data spesifik mahasiswa, tambahkan role guard atau ownership check.

Per audit, method berikut di `Api/Admin/MahasiswaController` saat ini **tidak cek role** di dalam method (cuma `auth:sanctum` middleware):
- `show(int $id)` line 170-175
- `dokumen(Request $request, int $id)` line 316-339
- `rekapAkademik` line 269-288 — tapi ini bukan by ID, ini `*::get()`
- `rekapPrestasi/Organisasi/Pelatihan` line 290-386 — juga `*::get()`, bukan by ID

Method **by id** di umbrella `Api/MahasiswaController` SUDAH punya check (`ipk()`, `dokumen()`, dll) untuk role=mahasiswa (403) dan role=prodi (cek `prodi_id`). Tapi **tidak ada proteksi admin-only** — saat ini siapapun (termasuk mahasiswa prodi lain) bisa akses.

### Rekomendasi

**Opsi A — restrict to admin role** (Paling aman, sesuai FE flow):
Di `Api/MahasiswaController` umbrella methods (`ipk`, `dokumen`, `prestasi`, `organisasi`, `pelatihan`, `bebasTanggungan`), tambahkan:
```php
if (!in_array($req->user()->role, ['admin', 'prodi', 'warek'])) abort(403);
```
Sudah ada untuk `filterOptions` (line 56) — perlu ditambahkan ke method lain.

**Opsi B — preserve prodi-scoped access** (lebih permisif):
Biarkan mahasiswa/prodi akses hanya data prodi sendiri. Sudah ada logic ini untuk prodi (line 99, 111).

**Rekomendasi**: Gunakan **Opsi A** untuk method yang diakses Admin FE (`ipk`, `dokumen`, `prestasi`, `organisasi`, `pelatihan` di tab MahasiswaDetail) karena FE Admin diasumsikan full-access. Method `bebasTanggungan` perlu tambahan check role.

### Acceptance
- ✅ GET `/api/mahasiswa/{id}/ipk` dengan role=mahasiswa → 403 (sudah ada, verify)
- ✅ GET `/api/mahasiswa/{id}/ipk` dengan role=prodi yang berbeda prodi → 403
- ✅ GET `/api/mahasiswa/{id}/ipk` dengan role=admin → 200
- ✅ GET `/api/mahasiswa/{id}/dokumen` sama rules

### Dependencies
- Tidak ada

---

## T1.5 — Hide Approve/Return Buttons di LaporanDetail untuk Admin

**Severity**: 🔴 HIGH  
**Modul**: Laporan  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/pages/admin/LaporanDetail.tsx`

### Changes Detail

**`resources/js/pages/admin/LaporanDetail.tsx`** line 297-353 — sticky action bar:
- Hapus tombol "Setujui" + "Kembalikan" untuk Admin (logic check via `useAuth()` atau props `user.role`)
- Admin hanya boleh: lihat, submit (Draft→Diajukan), edit, download PDF
- Warek (via role check) yang boleh approve/return

### Logic
```tsx
import { useAuth } from "@/contexts/AuthContext"; // atau equivalent
const { user } = useAuth();
const canApprove = user.role === "warek";

// Di sticky action bar
{isPending && canApprove && (
  <>
    <button onClick={...handleApprove}>Setujui</button>
    <button onClick={...handleReject}>Kembalikan</button>
  </>
)}
```

### Acceptance
- ✅ Login sebagai Admin → tidak ada tombol "Setujui" / "Kembalikan"
- ✅ Login sebagai Warek → tombol tetap muncul
- ✅ Approve Modal + Revisi Modal hanya dipanggil jika `canApprove`
- ✅ Existing behavior Warek tidak terganggu

### Dependencies
- `AuthContext` di FE — verify exists; jika tidak, gunakan `localStorage.getItem('simkip_user')`

---

# PHASE 2 — P1 FE INTEGRATION

> **Tujuan**: Mengganti hardcoded FE lists/constants dengan data dari BE. Backend sudah menyediakan semua endpoint — Phase ini murni FE wiring.

## T2.1 — Wire AuditLog ke BE Endpoint

**Severity**: 🟠 MEDIUM  
**Modul**: Audit Log  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/services/auditService.ts` (NEW)
- `resources/js/pages/admin/AuditLog.tsx`

### Changes Detail

**`resources/js/services/auditService.ts`** (new file):
```typescript
import { api } from "./api";

export interface AuditLogFilter {
  search?: string;
  jenis?: string;
  dari?: string;
  sampai?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogEntry {
  id: number;
  waktu: string;
  jenis: string;
  aktivitas: string;
  deskripsi: string | null;
  terkait_nim: string | null;
  terkait_nama: string | null;
  dilakukan_oleh: string;
  ip: string;
}

export interface AuditLogResponse {
  data: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getAuditLogs(filter: AuditLogFilter = {}): Promise<AuditLogResponse> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  return api.get<AuditLogResponse>(`/audit?${params.toString()}`);
}
```

**`resources/js/pages/admin/AuditLog.tsx`**:
- Hapus static array `logs` (line 16-27)
- Tambah state `useState<AuditLogEntry[]>([])`, loading, error, total
- Tambah useEffect: `getAuditLogs({page: 1, limit: 20}).then(setLogs)`
- Map BE response ke FE shape (jenis, aktivitas, deskripsi, terkait_nim/nama, dilakukan_oleh, ip_address, waktu)

### Acceptance
- ✅ AuditLog page menampilkan data real dari BE
- ✅ Filter search/jenis/date range mengirim request ke `/api/audit`
- ✅ Tidak ada data hardcoded sample

### Dependencies
- BE endpoint `/api/audit` sudah ada (`AuditController@index`)

---

## T2.2 — Replace Hardcoded Prodi List dengan BE

**Severity**: 🟠 MEDIUM  
**Modul**: Konfigurasi, DataAkademik, SusunLaporan, DokumenQueue  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/pages/admin/DataAkademik.tsx` line 30
- `resources/js/pages/admin/SusunLaporan.tsx` line 18-23
- `resources/js/pages/admin/Konfigurasi.tsx` line 27-33
- `resources/js/pages/admin/DokumenQueue.tsx` line 25

### Changes Detail

Untuk semua file di atas, ganti:
```typescript
const prodiOptions = ["Semua", "Teknik Informatika", ...]; // hardcoded
```

Dengan hook yang load dari BE:
```typescript
import { getMahasiswaFilterOptions } from "@/services/mahasiswaService";

// Inside component
const [prodiList, setProdiList] = useState<{id: number; nama: string}[]>([]);
useEffect(() => {
  getMahasiswaFilterOptions().then(opts => setProdiList(opts.prodis));
}, []);

const prodiOptions = ["Semua", ...prodiList.map(p => p.nama)];
```

### Acceptance
- ✅ Tambah Prodi baru di Admin Konfigurasi → muncul di semua dropdown
- ✅ Nonaktifkan Prodi (is_aktif=false) tidak muncul (filter BE sudah handle)
- ✅ Tidak ada hardcoded prodi list di FE Admin

### Dependencies
- `getMahasiswaFilterOptions()` sudah ada

---

## T2.3 — Replace Hardcoded Jenis Dokumen List dengan BE

**Severity**: 🟠 MEDIUM  
**Modul**: Konfigurasi, DokumenQueue  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/services/konfigurasiService.ts` (NEW atau extend)
- `resources/js/pages/admin/DokumenQueue.tsx` line 13-24
- `resources/js/pages/admin/Konfigurasi.tsx` line 35-41

### Changes Detail

**`resources/js/services/konfigurasiService.ts`** (new file):
```typescript
import { api } from "./api";

export interface DokumenJenis {
  id: number;
  nama: string;
  kode: string | null;
  deskripsi: string | null;
  is_wajib: boolean;
  urutan: number;
}

export async function getDokumenJenisList(): Promise<DokumenJenis[]> {
  const res = await api.get<{success: boolean; data: DokumenJenis[]}>("/admin/konfigurasi/dokumen-jenis");
  return res.data;
}
```

**`resources/js/pages/admin/DokumenQueue.tsx`** — replace static `jenisDokumen`:
```typescript
const [dokumenJenis, setDokumenJenis] = useState<DokumenJenis[]>([]);
useEffect(() => {
  getDokumenJenisList().then(setDokumenJenis);
}, []);

const jenisDokumen = ["Semua", ...dokumenJenis.map(d => d.nama)];
```

### Acceptance
- ✅ Tambah Jenis Dokumen baru di Admin Konfigurasi → muncul di filter DokumenQueue
- ✅ Filter jenis menggunakan data real BE
- ✅ Tidak ada hardcoded list

### Dependencies
- BE endpoint `/api/admin/konfigurasi/dokumen-jenis` sudah ada

---

## T2.4 — Replace Hardcoded Tahun Akademik dengan BE Periode

**Severity**: 🟠 MEDIUM  
**Modul**: Laporan  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/pages/admin/LaporanList.tsx` line 200
- `resources/js/pages/admin/SusunLaporan.tsx` line 238-240

### Changes Detail

Ganti hardcoded `["2025/2026", "2024/2025", "2023/2024"]` dengan hasil dari `getKonfigurasiAll()` atau tambah helper `getPeriodeList()`:

```typescript
// LaporanList.tsx & SusunLaporan.tsx
import { getKonfigurasiAll } from "@/services/konfigurasiService";
const [periodeList, setPeriodeList] = useState<{tahun_akademik: string; semester: string}[]>([]);
useEffect(() => {
  getKonfigurasiAll().then(res => {
    const unique = new Set(res.data.periode_history.map(p => p.tahun_akademik));
    setPeriodeList(Array.from(unique).map(y => ({tahun_akademik: y, semester: "Ganjil"})));
  });
}, []);
```

Atau lebih sederhana — extract dari `periode_history` field.

### Acceptance
- ✅ Tambah Periode baru → muncul di filter Tahun Akademik
- ✅ Tidak ada hardcoded

### Dependencies
- BE endpoint `/api/admin/konfigurasi/all` sudah ada, sudah return `periode_history`

---

## T2.5 — Replace Hardcoded Daftar Fakultas / Fakultas tidak ada (skip)

> **Catatan**: Setelah audit, tidak ada field "Fakultas" di FE atau BE — skip task ini.

---

## T2.6 — Replace Hardcoded Signature dengan BE Konfigurasi

**Severity**: 🟠 MEDIUM  
**Modul**: Formal Letter Preview (BT, SP, Laporan, MahasiswaDetail)  
**Penanggung Jawab**: Frontend (Backend opsional untuk seeding)

### Files to Change
- `resources/js/pages/admin/MahasiswaDetail.tsx` line 1760-1768 (TTD di `FormalSurat`)
- `resources/js/pages/admin/BebasTanggunganDetail.tsx` line 155, 162 (TTD di `FormalSurat`)
- `resources/js/pages/admin/SPDetail.tsx` line 494, 500-501 (TTD di modal "Lihat Surat Resmi")
- `resources/js/pages/admin/SusunLaporan.tsx` line 615-625 (TTD di Preview)
- `resources/js/pages/admin/LaporanDetail.tsx` line 270, 287 (TTD)
- `resources/js/services/konfigurasiService.ts` (extend untuk ambil signature)

### Changes Detail

**`resources/js/services/konfigurasiService.ts`** — extend:
```typescript
export interface KonfigurasiAllResponse {
  institusi: { nama: string; alamat: string };
  regulasi: any[];
  nilai_mutu: any[];
  jenis_pelanggaran: any[];
  periode_history: any[];
  prodis: any[];
  dokumens: any[];
}

// Extend dengan signature fields
export interface SignatureConfig {
  pengelola_nama: string;
  pengelola_nip: string;
  warek_nama: string;
  warek_nip: string;
}

export async function getSignatureConfig(): Promise<SignatureConfig> {
  // ambil dari /api/admin/konfigurasi/all dan extract dari konfigurasi
  // atau tambah endpoint dedicated /api/admin/konfigurasi/signatures
}
```

**Catatan**: BE Konfigurasi sudah membaca `pengelola_nama`, `pengelola_nip`, `warek_nama`, `warek_nip` di `PdfGeneratorService` tapi tidak expose di `indexAll()`. Ada 2 opsi:

**Opsi A** (recommended, minimal): Tambah field signature ke response `indexAll()`:
```php
// app/Http/Controllers/Api/Admin/KonfigurasiController.php indexAll()
return response()->json([
    'success' => true,
    'data' => [
        // ... existing fields ...
        'signature' => [
            'pengelola_nama' => $konfig['pengelola_nama'] ?? 'Encep Jianul Hayat, S.T., M.T.',
            'pengelola_nip'  => $konfig['pengelola_nip'] ?? '197804202006041001',
            'warek_nama'     => $konfig['warek_nama'] ?? 'Dr. Rina Kurniawati, S.E., M.Si.',
            'warek_nip'      => $konfig['warek_nip'] ?? '198203252008012002',
        ],
    ],
]);
```

**Opsi B** (lebih clean): Pakai endpoint existing `/api/admin/konfigurasi/periode` atau bikin `/api/admin/konfigurasi/signature` dedicated. Tapi Opsi A lebih sederhana karena `indexAll` sudah ada.

**Opsional Backend seeding**: Tambah ke `database/seeders/KonfigurasiSeeder.php`:
```php
['key' => 'pengelola_nama',     'value' => 'Encep Jianul Hayat, S.T., M.T.', 'label' => 'Nama Pengelola KIP-K', 'tipe' => 'text'],
['key' => 'pengelola_nip',      'value' => '197804202006041001',               'label' => 'NIP Pengelola KIP-K',   'tipe' => 'text'],
['key' => 'warek_nama',         'value' => 'Dr. Rina Kurniawati, S.E., M.Si.', 'label' => 'Nama Warek III',         'tipe' => 'text'],
['key' => 'warek_nip',          'value' => '198203252008012002',               'label' => 'NIP Warek III',          'tipe' => 'text'],
```

(Ini opsional karena BE sudah punya fallback default di `PdfGeneratorService`.)

### Acceptance
- ✅ TTD di preview BT, SP, Laporan, MahasiswaDetail menggunakan data dari BE
- ✅ Edit signature di konfigurasis table (manual via tinker) → otomatis reflect di semua preview

### Dependencies
- `Konfigurasi` model sudah support get/set via static method

---

# PHASE 3 — P2 POST-LAUNCH IMPROVEMENTS

> **Tujuan**: Polish dan inkremental improvement. Tidak memblokir production. Bisa di-deploy setelah launch atau ditunda.

## T3.1 — Authorization Check untuk Dokumen File Serving

**Severity**: 🟠 MEDIUM  
**Modul**: Dokumen Storage  
**Penanggung Jawab**: Backend

### Files to Change
- `app/Http/Controllers/Api/Admin/DokumenController.php` `serveFile` line 167-175

### Changes Detail
```php
public function serveFile(int $id): mixed
{
    $dok = Dokumen::with('mahasiswa')->findOrFail($id);
    
    // Authorization: hanya admin, owner mahasiswa, atau prodi yg sesuai
    $user = auth()->user();
    $allowed = match($user->role) {
        'admin'  => true,
        'warek'  => true,
        'prodi'  => $user->prodi_id === $dok->mahasiswa->prodi_id,
        default  => false, // mahasiswa tidak boleh download via admin endpoint
    };
    
    if (! $allowed) abort(403, 'Anda tidak berhak mengakses file ini.');
    
    $path = storage_path('app/public/' . $dok->path_file);
    if (! file_exists($path)) {
        return response()->json(['success' => false, 'message' => 'File tidak ditemukan.'], 404);
    }
    return response()->file($path);
}
```

### Acceptance
- ✅ GET file dokumen dengan role=mahasiswa → 403
- ✅ GET file dokumen dengan role=prodi yang berbeda prodi → 403
- ✅ GET file dokumen dengan role=admin → 200
- ✅ GET file dokumen dengan role=prodi yang sesuai → 200

### Dependencies
- Tidak ada

---

## T3.2 — Tambah Filter `mahasiswa_id` untuk Rekap Prestasi/Organisasi/Pelatihan

**Severity**: 🟡 LOW (efisiensi)  
**Modul**: Akademik  
**Penanggung Jawab**: Backend

### Files to Change
- `app/Http/Controllers/Api/Admin/MahasiswaController.php` `rekapPrestasi/Organisasi/Pelatihan` lines 290-386

### Changes Detail

**`rekapPrestasi(Request $request)`** line 290-314 — tambah optional `mahasiswa_id` filter:
```php
public function rekapPrestasi(Request $request): JsonResponse
{
    $query = \App\Models\Prestasi::with(['mahasiswa.prodi'])->latest();
    if ($request->mahasiswa_id) {
        $query->where('mahasiswa_id', $request->mahasiswa_id);
    }
    // ... existing logic ...
}
```

Sama untuk `rekapOrganisasi` dan `rekapPelatihan`.

### Acceptance
- ✅ `GET /api/akademik/prestasi?mahasiswa_id=5` → hanya return prestasi milik mhs 5
- ✅ `GET /api/akademik/prestasi` (no filter) → return semua (backward compat)

### Dependencies
- Tidak ada

---

## T3.3 — SP Format Nomor Surat: FE Pakai Field dari BE

**Severity**: 🟡 LOW  
**Modul**: SP Detail  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/pages/admin/SPDetail.tsx` line 23-29 (function `nomorSurat`)

### Changes Detail
Hapus function `nomorSurat()` yang generate client-side. Gunakan `sp.nomorSurat` dari response BE:
```typescript
// BEFORE (line 172)
const nSurat = nomorSurat(sp.level, sp.tanggalTerbit, sp.id);

// AFTER
const nSurat = sp.nomorSurat ?? '—';
```

Verifikasi bahwa `SuratPeringatanResource` sudah return `nomorSurat` — YES (line `nomorSurat => $this->nomor_surat`).

### Acceptance
- ✅ Nomor surat di preview SP match dengan nomor surat di database & PDF BT

### Dependencies
- BE `SuratPeringatanResource` sudah return `nomorSurat`

---

## T3.4 — Extend Konfigurasi Update untuk Support Institusi Fields

**Severity**: 🟡 LOW  
**Modul**: Konfigurasi  
**Penanggung Jawab**: Backend

### Files to Change
- `app/Http/Controllers/Api/Admin/KonfigurasiController.php` `update()` line 20-26

### Changes Detail
```php
public function update(Request $request): JsonResponse
{
    // Existing logic: foreach key-value update
    // BUT juga support 'nama_institusi', 'alamat_institusi', 'telp_institusi', 'pengelola_nama', dll
    foreach ($request->all() as $key => $value) {
        Konfigurasi::where('key', $key)->update(['value' => $value]);
    }
    return response()->json(['success' => true, 'message' => 'Konfigurasi disimpan.']);
}
```

Logic existing sebenarnya sudah handle semua keys (foreach). Verify saja `KonfigurasiSeeder` sudah seed `nama_institusi`, `alamat_institusi`, `telp_institusi`.

**Konfirmasi dari audit**: sudah ada di seeder line 16-19. ✅

### Acceptance
- ✅ FE Konfigurasi Section 5 (Informasi Institusi) bisa save nama & alamat institusi
- ✅ Save reflect di preview surat

### Dependencies
- Konfigurasi::get static helper sudah support text values

---

## T3.5 — Replace Hardcoded Masa Tenggang di SPDetail

**Severity**: 🟡 LOW  
**Modul**: SP Detail  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/pages/admin/SPDetail.tsx` line 169

### Changes Detail
```typescript
// BEFORE
const totalDays = 180;

// AFTER
import { getKonfigurasiAll } from "@/services/konfigurasiService";
const [masaTenggang, setMasaTenggang] = useState(180);
useEffect(() => {
  getKonfigurasiAll().then(res => {
    const reg = res.data.regulasi.find(r => r.nama === "Masa Tenggang SP");
    if (reg) setMasaTenggang(Number(reg.nilai));
  });
}, []);

const totalDays = masaTenggang;
```

### Acceptance
- ✅ Edit "Masa Tenggang SP" di Konfigurasi → progress bar SPDetail update
- ✅ Tidak ada hardcoded 180

### Dependencies
- `getKonfigurasiAll()` sudah ada di plan T2.6 / extend konfigurasiService

---

## T3.6 — Replace Hardcoded Sapaan Personal di Dashboard

**Severity**: 🟡 LOW  
**Modul**: Dashboard Admin  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/pages/admin/Dashboard.tsx` line 135

### Changes Detail
```typescript
// BEFORE
<h1>Selamat datang, Pak Encep Jianul</h1>

// AFTER
import { useAuth } from "@/contexts/AuthContext";
const { user } = useAuth();
<h1>Selamat datang, {user?.name ?? "Admin"}</h1>
```

### Acceptance
- ✅ Sapaan dinamis sesuai user login
- ✅ Fallback "Admin" jika name tidak ada

### Dependencies
- AuthContext (verify exists)

---

## T3.7 — Replace Hardcoded Semester Placeholder di MahasiswaDetail

**Severity**: 🟡 LOW  
**Modul**: MahasiswaDetail  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/pages/admin/MahasiswaDetail.tsx` line 2585

### Changes Detail
```typescript
// BEFORE (line 2585)
<p>Semester saat pencabutan: Ganjil 2026/2027</p>

// AFTER
const [semesterAktif, setSemesterAktif] = useState<string>("");
const [tahunAjaranAktif, setTahunAjaranAktif] = useState<string>("");
useEffect(() => {
  getKonfigurasiAll().then(res => {
    // ... extract from regulasi array or fetch from dedicated endpoint
    setSemesterAktif("Genap");
    setTahunAjaranAktif("2025/2026");
  });
}, []);

<p>Semester saat pencabutan: {semesterAktif} {tahunAjaranAktif}</p>
```

### Acceptance
- ✅ Placeholder dinamis sesuai konfigurasi aktif
- ✅ Tidak ada hardcoded "Ganjil 2026/2027"

### Dependencies
- `Konfigurasi::get('semester_aktif')` & `tahun_akademik_aktif` sudah ada di BE

---

## T3.8 — Replace Hardcoded Periode Aktif Text di DataAkademik & Konfigurasi

**Severity**: 🟡 LOW  
**Modul**: DataAkademik, Konfigurasi  
**Penanggung Jawab**: Frontend

### Files to Change
- `resources/js/pages/admin/DataAkademik.tsx` line 938
- `resources/js/pages/admin/Konfigurasi.tsx` line 317

### Changes Detail
Ganti hardcoded "1 Sep – 15 Sep 2026" dengan computed dari state `tglBuka/tglTutup` (Konfigurasi.tsx sudah punya state ini).

**Konfigurasi.tsx**:
```typescript
const periodeLabel = periodeAktif 
  ? `${formatDate(tglBuka)} – ${formatDate(tglTutup)}`
  : "Tidak ada periode aktif";
```

**DataAkademik.tsx**: sama, fetch dari BE `/api/konfigurasi/periode`.

### Acceptance
- ✅ Periode text dinamis dari konfigurasi BE

---

# Verification Matrix (Post-Implementation)

| Modul | Phase | Acceptance Test |
| --- | --- | --- |
| Login | T1.1 | 6× login gagal dalam 1 menit → 429 |
| DokumenQueue | T1.2 | Mahasiswa token → 403 |
| BebasTanggungan | T1.3 | Mahasiswa token PATCH approve → 403 |
| Mahasiswa Detail | T1.4 | Prodi non-scope GET `/mahasiswa/{id}/ipk` → 403 |
| LaporanDetail | T1.5 | Login as Admin → tidak ada tombol Approve |
| AuditLog | T2.1 | Halaman menampilkan data real, filter berfungsi |
| Konfigurasi/Prodi | T2.2 | Tambah Prodi di Konfig → muncul di dropdown DataAkademik/SusunLaporan/DokumenQueue |
| DokumenQueue | T2.3 | Filter jenis berisi data dari BE |
| Laporan | T2.4 | Tahun akademik filter berisi data dari BE |
| Formal Surat | T2.6 | TTD menggunakan konfigurasi BE |
| File Storage | T3.1 | Akses dokumen via ID dengan token salah → 403 |
| Akademik Rekap | T3.2 | `?mahasiswa_id=X` filter berfungsi |
| SP Detail | T3.3 | Nomor surat = field dari BE, bukan generate client |
| Konfigurasi | T3.4 | Save institusi reflect di preview |
| SP Detail | T3.5 | Masa tenggang dari BE |
| Dashboard | T3.6 | Sapaan = user.name |
| MahasiswaDetail | T3.7 | Placeholder semester dari BE |
| Konfigurasi | T3.8 | Periode aktif text dari BE |

---

# Rollback Plan

Karena semua perubahan adalah additive + wiring:
1. **Phase 1**: Revert middleware addition → kembali ke insecure tapi FE tetap jalan
2. **Phase 2**: Revert FE wiring → kembali ke hardcoded (FE tetap jalan tapi stale)
3. **Phase 3**: Revert masing-masing task secara individual

**Zero data migration risk** — tidak ada perubahan schema database.

---

# Eksekusi Plan

## Sprint 1 (P0 — Blocking, harus selesai sebelum production)
- T1.1 Login Throttle (~15 menit)
- T1.2 Dokumen Queue Role (~10 menit)
- T1.3 BT Approve Role (~10 menit)
- T1.4 Mahasiswa IDOR Protection (~30 menit)
- T1.5 Laporan Hide Approve (~20 menit)
**Total Sprint 1**: ~1.5 jam backend + ~30 menit frontend

## Sprint 2 (P1 — Pre-launch FE Integration)
- T2.1 AuditLog wire (~45 menit)
- T2.2 Prodi list wire (~60 menit, 4 files)
- T2.3 Dokumen Jenis wire (~45 menit)
- T2.4 Tahun Akademik wire (~30 menit)
- T2.6 Signature wire (~60 menit, 6 files)
**Total Sprint 2**: ~4 jam

## Sprint 3 (P2 — Post-launch Polish)
- T3.1–T3.8 (~3-4 jam)

**Grand Total**: ~8-10 jam implementasi.

---

# Approval Required

Sebelum eksekusi, mohon approval untuk:

1. **Phase sequencing** — eksekusi Sprint 1 → Sprint 2 → Sprint 3 secara berurutan?
2. **Backend-only opsional** untuk Sprint 2 — T2.6 Opsi A (extend `indexAll`) atau Opsi B (endpoint dedicated)?
3. **Konfirmasi FE-only untuk Sprint 3** — atau BE tambahan?
4. **Test strategy** — apakah perlu unit test / feature test untuk setiap task?

**STOP — Menunggu approval untuk eksekusi Implementation Plan.**
