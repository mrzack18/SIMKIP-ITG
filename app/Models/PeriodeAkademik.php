<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PeriodeAkademik extends Model
{
    protected $fillable = ['tahun_akademik', 'semester', 'tanggal_buka', 'tanggal_tutup', 'is_aktif'];
    protected $casts = [
        'tanggal_buka' => 'date',
        'tanggal_tutup' => 'date',
        'is_aktif' => 'boolean',
    ];
}
