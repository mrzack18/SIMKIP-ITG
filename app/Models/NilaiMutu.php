<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiMutu extends Model
{
    protected $fillable = ['min', 'max', 'huruf', 'poin', 'lulus'];
    protected $casts = [
        'min' => 'float',
        'max' => 'float',
        'poin' => 'float',
        'lulus' => 'boolean',
    ];
}
