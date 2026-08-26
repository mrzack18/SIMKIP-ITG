<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Organisasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_id', 'nama', 'jabatan', 'periode_mulai', 'periode_selesai',
        'deskripsi', 'file_sk', 'status', 'catatan_admin', 'validated_by', 'validated_at',
    ];

    protected $casts = [
        'periode_mulai' => 'date',
        'periode_selesai' => 'date',
        'validated_at' => 'datetime',
    ];

    public function mahasiswa() { return $this->belongsTo(Mahasiswa::class); }
    public function validatedBy() { return $this->belongsTo(User::class, 'validated_by'); }
}
