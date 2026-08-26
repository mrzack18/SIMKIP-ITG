<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Prestasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_id', 'nama_prestasi', 'tingkat', 'pencapaian', 'penyelenggara',
        'tanggal_mulai', 'tanggal_selesai', 'tempat', 'deskripsi', 'link_penyelenggara',
        'file_sertifikat', 'file_foto', 'status', 'catatan_admin', 'validated_by', 'validated_at',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'validated_at' => 'datetime',
    ];

    public function mahasiswa() { return $this->belongsTo(Mahasiswa::class); }
    public function validatedBy() { return $this->belongsTo(User::class, 'validated_by'); }
}
