<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IpkSemestr extends Model
{
    use HasFactory;

    /**
     * Status data akademik.
     *
     * 'Disetujui' : benar-benar divalidasi pengelola (atau diajukan mahasiswa lalu
     *               disetujui). Jangan diisi oleh sync LSIPD.
     * 'Draft'     : belum final. Dipakai untuk isian mahasiswa yang belum diajukan,
     *               DAN untuk data akademik hasil sync LSIPD yang belum divalidasi
     *               pengelola (lihat LsipdSyncService).
     * 'Menunggu'  : diajukan mahasiswa, sedang mengantre validasi pengelola.
     * 'Ditolak'   : ditolak pengelola, perlu diperbaiki mahasiswa.
     */
    public const STATUS_MENUNGGU  = 'Menunggu';
    public const STATUS_DISETUJUI = 'Disetujui';
    public const STATUS_DRAFT     = 'Draft';
    public const STATUS_DITOLAK   = 'Ditolak';

    protected $fillable = ['mahasiswa_id', 'semester', 'tahun_ajaran', 'ipk', 'ips', 'file_khs', 'status', 'catatan_admin', 'validated_by', 'validated_at'];
    protected $casts = ['ipk' => 'decimal:2', 'ips' => 'decimal:2', 'validated_at' => 'datetime'];

    public function validatedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'validated_by');
    }

    /**
     * Batasi query ke baris yang dihitung sebagai nilai akademik mahasiswa.
     *
     * PENTING: sebelumnya query pemakaian memfilter `status = 'Disetujui'`. Dulu
     * itu tidak berpengaruh karena SEMUA baris berstatus 'Disetujui' (sync LSIPD
     * menulisnya begitu). Setelah sync memakai 'Draft', filter tersebut akan
     * membuang seluruh data akademik hasil sinkronisasi dan membuat IPK tampil 0.
     *
     * Scope ini juga menyelaraskan tampilan dengan perhitungan resminya:
     * IPKCalculatorService::recalculateAllIPK() menghitung IPK dari SELURUH baris
     * tanpa memandang status.
     */
    public function scopeHitungAkademik($query)
    {
        return $query->whereIn('status', [
            self::STATUS_DISETUJUI,
            self::STATUS_DRAFT,
            self::STATUS_MENUNGGU,
            'Diajukan',
            self::STATUS_DITOLAK,
        ]);
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function mataKuliahs()
    {
        return $this->hasMany(MataKuliah::class, 'ipk_semester_id');
    }
}
