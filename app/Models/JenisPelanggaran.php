<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPelanggaran extends Model
{
    protected $fillable = ['nama', 'deskripsi', 'eskalasi', 'aktif'];
    protected $casts = [
        'aktif' => 'boolean',
    ];
}
