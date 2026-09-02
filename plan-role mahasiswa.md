### Plan — Pembatasan Input & Validasi Nilai Mahasiswa

1. **Gunakan periode dari konfigurasi Admin**
   - Periode input nilai pada role mahasiswa mengambil data periode yang sudah dibuat/dikonfigurasi oleh Admin.
   - Cek tanggal/waktu saat mahasiswa membuka halaman input nilai.

2. **Disable input berdasarkan periode**
   - Jika **sebelum periode dimulai** → seluruh input nilai disabled.
   - Jika **dalam periode** → mahasiswa dapat menginput nilai.
   - Jika **setelah periode berakhir** → seluruh input nilai disabled.

3. **Status pengajuan nilai mahasiswa**
   Terapkan status:
   - `Draft` → mahasiswa masih dapat menginput dan mengubah nilai.
   - `Diajukan` → mahasiswa sudah mengajukan untuk divalidasi Admin, seluruh input disabled.
   - `Ditolak` → mahasiswa dapat menginput/memperbaiki nilai kembali.
   - `Disetujui` → seluruh input disabled dan tidak dapat diubah.

4. **Perubahan tombol**
   - Saat status `Draft`:
     - Tombol **"Simpan Nilai"** diganti menjadi **"Ajukan Nilai untuk Divalidasi"**.
   - Setelah mahasiswa mengajukan:
     - Tombol/input menjadi disabled.
   - Jika Admin **menolak**:
     - Input kembali aktif.
     - Tombol berubah menjadi **"Ajukan Ulang"**.
   - Jika Admin **menyetujui**:
     - Input tetap disabled.

5. **Validasi harus dilakukan di Backend**
   - Jangan hanya disable melalui UI.
   - Backend harus memastikan mahasiswa tidak dapat mengubah/mengajukan nilai jika:
     - periode belum dimulai,
     - periode sudah berakhir,
     - status sedang `Diajukan`,
     - atau status sudah `Disetujui`.

6. **Alur akhirnya**

```text
Draft
  ↓
Ajukan Nilai untuk Divalidasi
  ↓
Diajukan
  ├── Disetujui → Locked
  │
  └── Ditolak → Input aktif
                    ↓
                Ajukan Ulang
                    ↓
                 Diajukan
```

7. **Catatan penting**
   - Status **periode** dan **status validasi nilai** sebaiknya dipisahkan.
   - Jadi meskipun periode masih aktif, mahasiswa tetap tidak bisa mengedit jika pengajuannya sedang menunggu validasi atau sudah disetujui.
   - Jika periode sudah berakhir, **semua status tetap tidak bisa diedit**, termasuk yang sebelumnya ditolak.