<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DokumenJenisField extends Model
{
    protected $fillable = ['dokumen_jenis_id', 'label', 'tipe', 'opsi', 'is_required', 'urutan'];
    
    protected $casts = [
        'opsi' => 'array',
        'is_required' => 'boolean',
    ];

    public function jenis()
    {
        return $this->belongsTo(DokumenJenis::class, 'dokumen_jenis_id');
    }
}
