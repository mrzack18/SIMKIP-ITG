<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TahunAjaran extends Model
{
    protected $fillable = ['tahun_akademik', 'semester', 'is_aktif'];
    protected $casts = [
        'is_aktif' => 'boolean',
    ];
}
