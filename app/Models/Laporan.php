<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Laporan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_surat', 'judul', 'periode', 'tahun_akademik', 'semester',
        'tanggal_laporan', 'catatan_laporan', 'status', 'dibuat_oleh', 'submitted_at',
        'cakupan', 'angkatan', 'prodi', 'tujuan_prodi', 'tujuan_warek'
    ];

    protected $casts = [
        'tanggal_laporan' => 'date',
        'submitted_at' => 'datetime',
    ];

    public function dibuatOleh() { return $this->belongsTo(User::class, 'dibuat_oleh'); }
    public function reviews() { return $this->hasMany(LaporanReview::class)->latest(); }
    public function latestReview() { return $this->hasOne(LaporanReview::class)->latestOfMany(); }
}
