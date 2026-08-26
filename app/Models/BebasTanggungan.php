<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BebasTanggungan extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_id', 'tanggal_ajukan', 'status', 'catatan_admin',
        'reviewed_by', 'reviewed_at', 'nomor_surat', 'tanggal_terbit',
    ];

    protected $casts = [
        'tanggal_ajukan' => 'date',
        'reviewed_at' => 'datetime',
        'tanggal_terbit' => 'date',
    ];

    public function mahasiswa() { return $this->belongsTo(Mahasiswa::class); }
    public function reviewedBy() { return $this->belongsTo(User::class, 'reviewed_by'); }
}
