<?php

namespace App\Services;

use App\Exceptions\LsipdException;
use App\Helpers\TahunAjaranHelper;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\IpkSemestr;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class LsipdSyncService
{
    /**
     * Sinkronkan biodata seluruh mahasiswa KIP-K dari LSIPD.
     * Mahasiswa baru akan otomatis dibuatkan User record (default password kip{nim}2026).
     *
     * @return array{inserted:int, updated:int, skipped:int, total:int, prodi_missing:int}
     */
    public static function syncAllMahasiswa(?callable $onProgress = null): array
    {
        $items = LsipdClientService::getMahasiswaList();

        $stats = [
            'inserted'       => 0,
            'updated'        => 0,
            'unchanged'      => 0,
            'skipped'        => 0,
            'total'          => count($items),
            'prodi_missing'  => 0,
        ];

        $total = count($items);

        foreach ($items as $index => $item) {
            $nim = trim((string) ($item['nim'] ?? ''));
            if ($nim === '') {
                $stats['skipped']++;
                if ($onProgress) {
                    $onProgress($stats, $index + 1, $total);
                }
                continue;
            }

            $prodiResolved = ! empty($item['prodi_kode'])
                && self::resolveProdiId((string) $item['prodi_kode']) !== null;
            if (! empty($item['prodi_kode']) && ! $prodiResolved) {
                $stats['prodi_missing']++;
            }

            try {
                $result = self::upsertMahasiswa($item);
                $stats[$result]++;
            } catch (\Throwable $e) {
                Log::warning('LSIPD sync mahasiswa dilewati', [
                    'nim'    => $nim,
                    'reason' => $e->getMessage(),
                ]);
                $stats['skipped']++;
            }

            if ($onProgress) {
                $onProgress($stats, $index + 1, $total);
            }
        }

        return $stats;
    }

    /**
     * Sinkronkan biodata satu mahasiswa berdasarkan NIM.
     * Return Mahasiswa lokal (existing atau baru dibuat).
     */
    public static function syncMahasiswaByNim(string $nim): ?Mahasiswa
    {
        $items = LsipdClientService::getMahasiswaList();
        $target = null;

        foreach ($items as $item) {
            if ((string) ($item['nim'] ?? '') === $nim) {
                $target = $item;
                break;
            }
        }

        if (! $target) {
            throw new LsipdException(
                "NIM {$nim} tidak ditemukan di daftar mahasiswa LSIPD.",
                404,
            );
        }

        $result = self::upsertMahasiswa($target);

        return $result === 'skipped'
            ? null
            : Mahasiswa::where('nim', $nim)->first();
    }

    /**
     * Sinkronkan transkrip + progres akademik untuk satu mahasiswa.
     *
     * @return array{semester_inserted:int, mata_kuliah_inserted:int, last_ipk:float|null}
     */
    public static function syncTranskrip(string $nim): array
    {
        $mahasiswa = Mahasiswa::where('nim', $nim)->first();
        if (! $mahasiswa) {
            throw new LsipdException(
                "Mahasiswa dengan NIM {$nim} belum ada di SIMKIP. Sinkronkan biodata dulu.",
                404,
            );
        }

        $data = LsipdClientService::getTranskrip($nim);
        if (! $data) {
            throw new LsipdException("Data transkrip kosong untuk NIM {$nim}.", 404);
        }

        return self::writeTranskrip($mahasiswa, $data);
    }

    /**
     * Batch sync transkrip untuk semua mahasiswa lokal. Error per-NIM di-log dan dilewati.
     *
     * @return array{success:int, failed:int, total:int, last_processed:string|null}
     */
    public static function syncAllTranskrip(?callable $onProgress = null): array
    {
        $stats = ['success' => 0, 'failed' => 0, 'total' => 0, 'last_processed' => null];
        $mahasiswas = Mahasiswa::orderBy('nim')->get();

        foreach ($mahasiswas as $mahasiswa) {
            $stats['total']++;
            $stats['last_processed'] = $mahasiswa->nim;

            try {
                $data = LsipdClientService::getTranskrip($mahasiswa->nim);
                if (! $data) {
                    Log::info('LSIPD syncTranskrip dilewati (data kosong)', ['nim' => $mahasiswa->nim]);
                    $stats['failed']++;
                    continue;
                }
                self::writeTranskrip($mahasiswa, $data);
                $stats['success']++;
            } catch (\Throwable $e) {
                Log::warning('LSIPD syncTranskrip gagal', [
                    'nim'    => $mahasiswa->nim,
                    'reason' => $e->getMessage(),
                ]);
                $stats['failed']++;
            }

            if ($onProgress) {
                $onProgress($stats, $mahasiswa);
            }
        }

        return $stats;
    }

    /**
     * @return array{semester_inserted:int, mata_kuliah_inserted:int, last_ipk:float|null}
     */
    private static function writeTranskrip(Mahasiswa $mahasiswa, array $data): array
    {
        return DB::transaction(function () use ($data, $mahasiswa) {
            $semesterInserted = self::upsertProgresAkademik($mahasiswa, $data);
            $mkInserted = self::upsertTranskripMk($mahasiswa, $data);

            IPKCalculatorService::recalculateAllIPK($mahasiswa->id);

            $lastIpk = IpkSemestr::where('mahasiswa_id', $mahasiswa->id)
                ->orderByDesc('semester')
                ->value('ipk');

            return [
                'semester_inserted'     => $semesterInserted,
                'mata_kuliah_inserted'  => $mkInserted,
                'last_ipk'              => $lastIpk !== null ? (float) $lastIpk : null,
            ];
        });
    }

    /**
     * @return 'inserted'|'updated'|'unchanged'|'skipped'
     */
    private static function upsertMahasiswa(array $item): string
    {
        $nim = trim((string) ($item['nim'] ?? ''));
        $existing = Mahasiswa::where('nim', $nim)->first();

        $prodiId = null;
        if (! empty($item['prodi_kode'])) {
            $prodiId = self::resolveProdiId((string) $item['prodi_kode']);
            if (! $prodiId) {
                Log::warning('LSIPD: prodi tidak dikenali, lewati insert/update', [
                    'nim'        => $nim,
                    'prodi_kode' => $item['prodi_kode'],
                ]);
                return 'skipped';
            }
        }

        $payload = self::mapMahasiswaPayload($item, $existing, $prodiId);

        if ($existing) {
            $existing->fill($payload);
            if ($existing->isDirty()) {
                $existing->save();
                return 'updated';
            }
            return 'unchanged';
        }

        if (! $prodiId) {
            Log::warning('LSIPD: tidak bisa create Mahasiswa baru tanpa prodi_id', ['nim' => $nim]);
            return 'skipped';
        }

        $nama = (string) ($payload['nama'] ?? '');
        $user = self::findOrCreateUser($nim, $nama, (string) ($payload['no_hp'] ?? null));

        Mahasiswa::create($payload + [
            'user_id'    => $user->id,
            'nim'        => $nim,
            'kategori'   => $payload['kategori'] ?? 'Reguler',
            'status'     => $payload['status'] ?? 'Aktif',
            'prodi_id'   => $prodiId,
            'nomor_sk'   => 'LSIPD-SYNC',
            'tanggal_sk' => Carbon::now()->toDateString(),
        ]);

        Log::info('LSIPD: Mahasiswa baru diimpor', [
            'nim'  => $nim,
            'nama' => $nama,
            'user' => $user->username,
        ]);

        return 'inserted';
    }

    private static function findOrCreateUser(string $nim, string $nama, ?string $noHp): User
    {
        $user = User::where('username', $nim)->first();
        if ($user) {
            return $user;
        }

        $email = self::generateEmail($nim, $nama);
        $existingEmail = User::where('email', $email)->first();
        if ($existingEmail) {
            $email = $nim . '@student.itg.ac.id';
        }

        return User::create([
            'name'                 => $nama ?: 'Mahasiswa ' . $nim,
            'username'             => $nim,
            'email'                => $email,
            'password'             => Hash::make('kip' . $nim . '2026'),
            'role'                 => 'mahasiswa',
            'is_password_changed'  => false,
            'no_hp'                => $noHp,
        ]);
    }

    private static function generateEmail(string $nim, string $nama): string
    {
        $slug = strtolower(trim(preg_replace('/\s+/', '.', $nama) ?? '', '.'));
        return ($slug !== '' ? $slug : $nim) . '@student.itg.ac.id';
    }

    /**
     * @return array<string, mixed>
     */
    private static function mapMahasiswaPayload(array $item, ?Mahasiswa $existing, ?int $prodiId): array
    {
        $payload = [];

        if (! empty($item['nama'])) {
            $payload['nama'] = (string) $item['nama'];
        }
        if (array_key_exists('tempat_lahir', $item)) {
            $payload['tempat_lahir'] = $item['tempat_lahir'] ?: null;
        }
        if (! empty($item['tanggal_lahir'])) {
            try {
                $payload['tanggal_lahir'] = Carbon::parse($item['tanggal_lahir'])->toDateString();
            } catch (\Throwable) {
                $payload['tanggal_lahir'] = null;
            }
        }
        if (! empty($item['jenis_kelamin'])) {
            $jk = (string) $item['jenis_kelamin'];
            if (in_array($jk, ['Laki-laki', 'Perempuan'], true)) {
                $payload['jenis_kelamin'] = $jk;
            }
        }
        if (array_key_exists('alamat', $item)) {
            $payload['alamat'] = $item['alamat'] ?: null;
        }
        if (array_key_exists('no_hp', $item)) {
            $payload['no_hp'] = $item['no_hp'] ?: null;
        }
        if ($prodiId !== null) {
            $payload['prodi_id'] = $prodiId;
        }
        if (! empty($item['angkatan'])) {
            $payload['angkatan'] = (int) $item['angkatan'];
        }

        return $payload;
    }

    private static function resolveProdiId(string $nama): ?int
    {
        $nama = trim($nama);
        if ($nama === '') {
            return null;
        }

        $normalized = preg_replace('/\s+/', ' ', $nama);
        $byNama = Prodi::whereRaw('LOWER(nama) = ?', [strtolower($normalized)])->first();
        if ($byNama) {
            return $byNama->id;
        }

        $kandidat = Prodi::whereRaw('LOWER(nama) LIKE ?', ['%' . strtolower($normalized) . '%'])
            ->orWhereRaw('LOWER(?) LIKE CONCAT("%", LOWER(nama), "%")', [$normalized])
            ->first();

        return $kandidat?->id;
    }

    /**
     * Tahun ajaran untuk satu semester mahasiswa, diturunkan dari angkatan.
     *
     * LSIPD tidak mengirim tahun ajaran: field `tahun_ajaran` pada respons
     * /kipk/transkrip berisi "Semester 1", "Semester 2", dst, dan tidak ada field
     * lain yang memuat TA (sudah diperiksa: ringkasan, transkrip, dan daftar
     * mahasiswa hanya memuat ipk/sks, kode+nama mk, dan biodata + angkatan).
     * Jadi satu-satunya sumber adalah `angkatan`.
     *
     * Bila angkatan tidak diketahui, kembalikan string kosong — lebih baik kosong
     * daripada menyimpan "Semester 3" yang menyesatkan pembaca kolom ini.
     */
    private static function tahunAjaranUntuk(Mahasiswa $mahasiswa, int $semester): string
    {
        return TahunAjaranHelper::tahunAjaranDariSemester(
            (int) $mahasiswa->angkatan,
            $semester,
        );
    }

    /**
     * Status yang TIDAK boleh ditimpa oleh sync.
     *
     * Baris yang sudah punya jejak keputusan manusia — divalidasi/ditolak pengelola,
     * atau catatan admin — adalah hasil kerja pengelola dan tidak boleh direset sync.
     * 'Menunggu'/'Diajukan' juga dipertahankan supaya pengajuan mahasiswa yang sedang
     * mengantre tidak hilang diam-diam dari antrian validasi.
     *
     * Sisanya ('Disetujui' sisa impor lama, 'Draft') tetap di-set ke 'Draft' agar
     * baris lama yang dulu salah berlabel ikut terkoreksi.
     */
    private static function statusDikunciManusia(IpkSemestr $ipk): bool
    {
        if ($ipk->validated_by !== null || $ipk->validated_at !== null) {
            return true;
        }
        if (! empty($ipk->catatan_admin)) {
            return true;
        }
        return in_array($ipk->status, ['Menunggu', 'Diajukan'], true);
    }

    private static function upsertProgresAkademik(Mahasiswa $mahasiswa, array $data): int
    {
        $progres = $data['progres_akademik'] ?? [];
        $count = 0;

        foreach ($progres as $row) {
            $semester = (int) ($row['semester'] ?? 0);
            if ($semester <= 0) {
                continue;
            }

            $existing = IpkSemestr::where('mahasiswa_id', $mahasiswa->id)
                ->where('semester', $semester)
                ->first();

            $atribut = [
                // TIDAK memakai $row['tahun_ajaran'] dari LSIPD: field itu berisi
                // "Semester 1", "Semester 2", dst — bukan tahun ajaran. Upstream
                // tidak mengirim TA sama sekali, jadi diturunkan dari angkatan.
                'tahun_ajaran' => self::tahunAjaranUntuk($mahasiswa, $semester),
                'ips'          => isset($row['ips']) ? (float) $row['ips'] : 0,
                'ipk'          => isset($row['ipk']) ? (float) $row['ipk'] : 0,
            ];

            // Status hanya di-set saat baris baru, atau saat baris lama tidak punya
            // jejak keputusan manusia. Lihat statusDikunciManusia().
            if (! $existing || ! self::statusDikunciManusia($existing)) {
                // 'Draft' — BUKAN 'Disetujui'. Data ini diimpor dari akademik, belum
                // pernah divalidasi Pengelola KIP-K, dan mahasiswa tidak pernah
                // mengajukannya. Kalau ditulis 'Disetujui', antrian validasi KHS
                // (DokumenQueue) ikut terisi baris yang tidak diajukan siapa pun.
                // 'Draft' juga membuat nilainya tetap bisa diperiksa/diperbaiki
                // mahasiswa lewat halaman Input Nilai Semester.
                $atribut['status'] = 'Draft';
            }

            if ($existing) {
                $existing->update($atribut);
            } else {
                IpkSemestr::create($atribut + [
                    'mahasiswa_id' => $mahasiswa->id,
                    'semester'     => $semester,
                ]);
            }
            $count++;
        }

        return $count;
    }

    private const NILAI_HURUF_VALID = ['A', 'AB', 'B', 'BC', 'C', 'D', 'E'];

    private static function upsertTranskripMk(Mahasiswa $mahasiswa, array $data): int
    {
        $transkrip = $data['transkrip'] ?? [];
        $count = 0;

        foreach ($transkrip as $semKey => $mks) {
            $semester = (int) $semKey;
            if ($semester <= 0 || ! is_array($mks)) {
                continue;
            }

            $ipkSemester = IpkSemestr::where('mahasiswa_id', $mahasiswa->id)
                ->where('semester', $semester)
                ->first();

            if ($ipkSemester) {
                // Jangan timpa status yang sudah ditentukan manusia (lihat
                // statusDikunciManusia()). Dulu firstOrCreate() dipakai di sini,
                // sehingga baris yang sudah ada tidak pernah dikoreksi statusnya —
                // sisa impor lama tetap berlabel 'Disetujui' selamanya.
                if (! self::statusDikunciManusia($ipkSemester)) {
                    $ipkSemester->update(['status' => 'Draft']);
                }
            } else {
                $ipkSemester = IpkSemestr::create([
                    'mahasiswa_id' => $mahasiswa->id,
                    'semester'     => $semester,
                    // Sama seperti upsertProgresAkademik(): transkrip juga tidak
                    // membawa TA, jadi diturunkan dari angkatan. Dulu diisi ''.
                    'tahun_ajaran' => self::tahunAjaranUntuk($mahasiswa, $semester),
                    'ips'          => 0,
                    'ipk'          => 0,
                    // Bukan 'Disetujui' — lihat penjelasan di upsertProgresAkademik().
                    'status'       => 'Draft',
                ]);
            }

            MataKuliah::where('ipk_semester_id', $ipkSemester->id)->delete();

            $mapped = [];
            foreach ($mks as $mk) {
                $huruf = strtoupper((string) ($mk['nlakh'] ?? ''));
                if (! in_array($huruf, self::NILAI_HURUF_VALID, true)) {
                    Log::info('LSIPD: nilai_huruf tidak valid, dilewati', [
                        'nim'         => $mahasiswa->nim,
                        'semester'    => $semester,
                        'kdmk'        => $mk['kdmk'] ?? null,
                        'nlakh'       => $mk['nlakh'] ?? null,
                    ]);
                    continue;
                }
                $mapped[] = [
                    'kode'        => strtoupper((string) ($mk['kdmk'] ?? '')),
                    'nama'        => (string) ($mk['nakmk'] ?? ''),
                    'sks'         => (int) ($mk['sksmk'] ?? 0),
                    'nilai_huruf' => $huruf,
                ];
            }

            $prepared = IPKCalculatorService::prepareMataKuliah($mapped);

            foreach (array_chunk($prepared, 100) as $chunk) {
                MataKuliah::insert(
                    array_map(fn ($row) => $row + ['ipk_semester_id' => $ipkSemester->id, 'created_at' => now(), 'updated_at' => now()], $chunk),
                );
            }

            $count += count($prepared);
        }

        return $count;
    }
}
