<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    use HasFactory;

    protected $fillable = ['kode', 'nama', 'is_aktif'];

    protected $casts = ['is_aktif' => 'boolean'];

    public function mahasiswas()
    {
        return $this->hasMany(Mahasiswa::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
