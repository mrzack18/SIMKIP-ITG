# Draft API Schema - Integrasi SIMKIP-ITG dengan LSIPD

**Versi:** 1.0.0  
**Tanggal:** 04 September 2026  
**Tujuan:** Agar data mahasiswa dan data akademik tidak perlu input manual ke SIMKIP

---

## Endpoint 1: Data Semua Mahasiswa

**GET** `/api/lsipd/mahasiswa`

**Query Params (opsional):**
- `prodi` → filter kode prodi (TI/SI/TE/TS/AR)
- `angkatan` → filter tahun angkatan
- `status` → filter status (Aktif/Lulus/Nonaktif)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "nim": "2023001",
      "nama": "Budi Santoso",
      "tempat_lahir": "Bandung",
      "tanggal_lahir": "2003-05-15",
      "jenis_kelamin": "Laki-laki",
      "alamat": "Jl. Merdeka No. 10, Bandung",
      "no_hp": "081234567890",
      "prodi_kode": "S1 Teknik Informatika",
      "angkatan": 2023,
    }
  ]
}
```

## Endpoint 2: IPS & IPK per Semester

**GET** `/api/lsipd/mahasiswa/{nim}/ips`

**Query Params (opsional):**
- `semester` → filter semester tertentu (1-8)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "nim": "2023001",
      "semester": 1,
      "tahun_ajaran": "2023/2024 Ganjil",
      "ips": 3.75,
      "ipk": 3.75
    },
    {
      "nim": "2023001",
      "semester": 2,
      "tahun_ajaran": "2023/2024 Genap",
      "ips": 3.50,
      "ipk": 3.63
    }
  ]
}
```

## Endpoint 3: Daftar Mata Kuliah + Nilai

**GET** `/api/lsipd/mahasiswa/{nim}/mata-kuliah`

**Query Params (opsional):**
- `semester` → filter semester tertentu

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "nim": "2023001",
      "semester": 1,
      "tahun_ajaran": "2023/2024 Ganjil",
      "mata_kuliah": [
        {
          "kode_mk": "TI101",
          "nama_mk": "Pemrograman Dasar",
          "sks": 3,
          "nilai_huruf": "A"
        },
        {
          "kode_mk": "TI102",
          "nama_mk": "Matematika Diskrit",
          "sks": 3,
          "nilai_huruf": "AB"
        },
        {
          "kode_mk": "UN101",
          "nama_mk": "Bahasa Indonesia",
          "sks": 2,
          "nilai_huruf": "A"
        }
      ]
    }
  ]
}
```