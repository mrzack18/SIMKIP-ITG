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
    ];

    protected $casts = ['tanggal_sk' => 'date'];

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

    /** IPK semester terakhir */
    public function getIpkTerakhirAttribute(): float
    {
        $last = $this->ipkSemestrs()->latest('semester')->first();
        return $last ? (float) $last->ipk : 0.0;
    }

    /** Semester aktif (jumlah semester yang sudah diinput) */
    public function getSemesterAktifAttribute(): int
    {
        return $this->ipkSemestrs()->count();
    }

    /** SP aktif tertinggi */
    public function getSpAktifAttribute(): ?string
    {
        $sp = $this->suratPeringatans()
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->orderByDesc('level')
            ->first();
        return $sp?->level;
    }
}
