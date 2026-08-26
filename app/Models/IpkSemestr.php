<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IpkSemestr extends Model
{
    use HasFactory;

    protected $fillable = ['mahasiswa_id', 'semester', 'tahun_ajaran', 'ipk', 'file_khs', 'is_verified'];
    protected $casts = ['ipk' => 'decimal:2', 'is_verified' => 'boolean'];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function mataKuliahs()
    {
        return $this->hasMany(MataKuliah::class, 'ipk_semester_id');
    }
}
