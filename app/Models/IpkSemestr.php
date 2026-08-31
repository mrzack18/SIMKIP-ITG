<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IpkSemestr extends Model
{
    use HasFactory;

    protected $fillable = ['mahasiswa_id', 'semester', 'tahun_ajaran', 'ipk', 'ips', 'file_khs', 'status', 'catatan_admin'];
    protected $casts = ['ipk' => 'decimal:2', 'ips' => 'decimal:2'];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function mataKuliahs()
    {
        return $this->hasMany(MataKuliah::class, 'ipk_semester_id');
    }
}
