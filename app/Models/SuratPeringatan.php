<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratPeringatan extends Model
{
    protected $fillable = [
        'mahasiswa_id', 'level', 'jenis_pelanggaran', 'deskripsi',
        'tanggal_terbit', 'batas_evaluasi', 'status', 'diterbitkan_oleh', 'catatan',
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
        return now()->diffInDays($this->batas_evaluasi, false);
    }
}
