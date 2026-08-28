<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SuratPeringatan extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_id', 'level', 'jenis_pelanggaran', 'deskripsi',
        'tanggal_terbit', 'batas_evaluasi', 'status', 'diterbitkan_oleh', 'catatan',
        'nomor_surat',
    ];

    protected $casts = [
        'tanggal_terbit' => 'date',
        'batas_evaluasi' => 'date',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function diterbitkanOleh()
    {
        return $this->belongsTo(User::class, 'diterbitkan_oleh');
    }

    public function getSisaHariAttribute(): int
    {
        if (!$this->batas_evaluasi) return 0;
        return (int) max(0, now()->diffInDays($this->batas_evaluasi, false));
    }
}
