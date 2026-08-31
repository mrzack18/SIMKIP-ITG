<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatatanInternal extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_id',
        'tahun_ajaran',
        'kategori',
        'deskripsi',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }
}
