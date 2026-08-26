<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mahasiswa extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'nim', 'nama', 'prodi_id', 'angkatan',
        'kategori', 'status', 'nomor_sk', 'tanggal_sk', 'file_sk',
        'alasan_nonaktif', 'tanggal_nonaktif',
        'semester_dicabut', 'tanggal_dicabut', 'alasan_dicabut', 'dicabut_oleh',
    ];

    protected $casts = [
        'tanggal_sk' => 'date',
        'tanggal_nonaktif' => 'date',
        'tanggal_dicabut' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    public function ipkSemestrs()
    {
        return $this->hasMany(IpkSemestr::class)->orderBy('semester');
    }

    public function dokumens()
    {
        return $this->hasMany(Dokumen::class);
    }

    public function suratPeringatans()
    {
        return $this->hasMany(SuratPeringatan::class)->orderBy('created_at');
    }

    public function prestasis()
    {
        return $this->hasMany(Prestasi::class)->latest();
    }

    public function organisasis()
    {
        return $this->hasMany(Organisasi::class)->latest();
    }

    public function pelatihans()
    {
        return $this->hasMany(Pelatihan::class)->latest();
    }

    public function bebasTanggungan()
    {
        return $this->hasOne(BebasTanggungan::class);
    }

    public function scopeWithDetails($query)
    {
        $query->addSelect([
            'ipk_calc' => \App\Models\IpkSemestr::select('ipk')
                ->whereColumn('mahasiswa_id', 'mahasiswas.id')
                ->orderByDesc('semester')
                ->limit(1),
            
            'prev_ipk_calc' => \App\Models\IpkSemestr::select('ipk')
                ->whereColumn('mahasiswa_id', 'mahasiswas.id')
                ->orderByDesc('semester')
                ->skip(1)
                ->limit(1),

            'sp_calc' => \App\Models\SuratPeringatan::select('level')
                ->whereColumn('mahasiswa_id', 'mahasiswas.id')
                ->whereIn('status', ['Aktif', 'Masa Tenggang'])
                ->orderByDesc('level')
                ->limit(1),
        ])
        ->withCount('ipkSemestrs as semester_calc')
        ->with('prodi');
    }

    /** IPK semester terakhir */
    public function getIpkTerakhirAttribute(): float
    {
        if (isset($this->attributes['ipk_calc'])) {
            return (float) $this->attributes['ipk_calc'];
        }
        $last = $this->ipkSemestrs()->latest('semester')->first();
        return $last ? (float) $last->ipk : 0.0;
    }

    /** Semester aktif (jumlah semester yang sudah diinput) */
    public function getSemesterAktifAttribute(): int
    {
        if (isset($this->attributes['semester_calc'])) {
            return (int) $this->attributes['semester_calc'];
        }
        return $this->ipkSemestrs()->count();
    }

    /** SP aktif tertinggi */
    public function getSpAktifAttribute(): ?string
    {
        if (isset($this->attributes['sp_calc'])) {
            return $this->attributes['sp_calc'];
        }
        $sp = $this->suratPeringatans()
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->orderByDesc('level')
            ->first();
        return $sp?->level;
    }

    /** Trend Delta */
    public function getTrendDeltaCalcAttribute(): float
    {
        if (!isset($this->attributes['ipk_calc'])) return 0.0;
        $ipk = (float) $this->attributes['ipk_calc'];
        $prev = isset($this->attributes['prev_ipk_calc']) ? (float) $this->attributes['prev_ipk_calc'] : null;
        if ($prev === null) return 0.0;
        return round($ipk - $prev, 2);
    }
}
