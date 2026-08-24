<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelatihan extends Model
{
    protected $fillable = [
        'mahasiswa_id', 'nama', 'jenis', 'penyelenggara',
        'tanggal_mulai', 'tanggal_selesai', 'tempat', 'deskripsi',
        'file_sertifikat', 'status', 'catatan_admin', 'validated_by', 'validated_at',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'validated_at' => 'datetime',
    ];

    public function mahasiswa() { return $this->belongsTo(Mahasiswa::class); }
    public function validatedBy() { return $this->belongsTo(User::class, 'validated_by'); }
}
