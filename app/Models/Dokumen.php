<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dokumen extends Model
{
    protected $fillable = [
        'mahasiswa_id', 'dokumen_jenis_id', 'nama_file', 'path_file',
        'ukuran', 'status', 'catatan_admin', 'approved_by', 'approved_at',
    ];

    protected $casts = ['approved_at' => 'datetime'];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function jenis()
    {
        return $this->belongsTo(DokumenJenis::class, 'dokumen_jenis_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
