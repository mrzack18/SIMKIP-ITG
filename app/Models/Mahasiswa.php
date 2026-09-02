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
        'nik', 'nisn', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
        'alamat', 'nama_ayah', 'nama_ibu', 'tel_ayah', 'tel_ibu'
    ];

    protected $casts = [
        'tanggal_sk' => 'date',
        'tanggal_nonaktif' => 'date',
        'tanggal_dicabut' => 'date',
        'tanggal_lahir' => 'date',
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

    public function catatanInternals()
    {
        return $this->hasMany(CatatanInternal::class);
    }

    public function scopeWithDetails($query, $tahunAjaran = null)
    {
        $query->addSelect([
            'ipk_calc' => \App\Models\IpkSemestr::select('ipk')
                ->whereColumn('mahasiswa_id', 'mahasiswas.id')
                ->where('status', 'Disetujui')
                ->when($tahunAjaran, function($q) use ($tahunAjaran) {
                    $range = \App\Helpers\TahunAjaranHelper::getDateRange($tahunAjaran);
                    if ($range) $q->where('created_at', '<=', $range[1]);
                })
                ->orderByDesc('semester')
                ->limit(1),

            'prev_ipk_calc' => \App\Models\IpkSemestr::select('ipk')
                ->whereColumn('mahasiswa_id', 'mahasiswas.id')
                ->where('status', 'Disetujui')
                ->when($tahunAjaran, function($q) use ($tahunAjaran) {
                    $range = \App\Helpers\TahunAjaranHelper::getDateRange($tahunAjaran);
                    if ($range) $q->where('created_at', '<=', $range[1]);
                })
                ->orderByDesc('semester')
                ->skip(1)
                ->limit(1),

            'sp_calc' => \App\Models\SuratPeringatan::select('level')
                ->whereColumn('mahasiswa_id', 'mahasiswas.id')
                ->whereIn('status', ['Aktif', 'Masa Tenggang'])
                ->when($tahunAjaran, function($q) use ($tahunAjaran) {
                     $range = \App\Helpers\TahunAjaranHelper::getDateRange($tahunAjaran);
                     if ($range) {
                         $q->where('tanggal_terbit', '<=', $range[1]);
                     }
                })
                ->orderByDesc('level')
                ->limit(1),

            'mk_belum_lulus' => \App\Models\MataKuliah::selectRaw('COUNT(*)')
                ->whereIn('ipk_semester_id', \App\Models\IpkSemestr::select('id')
                    ->whereColumn('mahasiswa_id', 'mahasiswas.id')
                    ->where('status', 'Disetujui')
                    ->when($tahunAjaran, function($q) use ($tahunAjaran) {
                        $range = \App\Helpers\TahunAjaranHelper::getDateRange($tahunAjaran);
                        if ($range) $q->where('created_at', '<=', $range[1]);
                    }))
                ->where('lulus', false),
        ])
        ->with('prodi');

        if ($tahunAjaran) {
            if (preg_match('/^(\d{4})\/\d{4}\s+(Ganjil|Genap)$/', $tahunAjaran, $matches)) {
                $startYear = (int) $matches[1];
                
                // Exclude students who haven't entered yet
                $query->where('angkatan', '<=', $startYear);
                
                // Exclude students who graduated/were revoked BEFORE this academic year started
                // A Ganjil semester starts Sep 1 of $startYear. A Genap semester starts Feb 1 of $startYear+1.
                $startDate = $matches[2] === 'Ganjil' 
                    ? \Carbon\Carbon::create($startYear, 9, 1) 
                    : \Carbon\Carbon::create($startYear + 1, 2, 1);
                    
                $query->where(function($q) use ($startDate) {
                    $q->where('status', 'Aktif')
                      ->orWhereNull('tanggal_nonaktif')
                      ->orWhere('tanggal_nonaktif', '>=', $startDate)
                      ->orWhere('tanggal_dicabut', '>=', $startDate);
                });
            }
        }
    }

    /** IPK semester terakhir */
    public function getIpkTerakhirAttribute(): float
    {
        if (isset($this->attributes['ipk_calc'])) {
            return (float) $this->attributes['ipk_calc'];
        }
        $last = $this->ipkSemestrs()->where('status', 'Disetujui')->latest('semester')->first();
        return $last ? (float) $last->ipk : 0.0;
    }

    public function getSemesterAktifAttribute(): int
    {
        return \App\Helpers\TahunAjaranHelper::calculateSemester((int) $this->angkatan);
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

    /** Jumlah mata kuliah yang belum lulus */
    public function getMkBelumLulusAttribute(): int
    {
        return isset($this->attributes['mk_belum_lulus'])
            ? (int) $this->attributes['mk_belum_lulus']
            : 0;
    }
}
