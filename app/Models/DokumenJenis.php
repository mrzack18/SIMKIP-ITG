<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DokumenJenis extends Model
{
    protected $table = 'dokumen_jenis';
    protected $fillable = ['nama', 'is_wajib', 'urutan'];
    protected $casts = ['is_wajib' => 'boolean'];

    public function dokumens()
    {
        return $this->hasMany(Dokumen::class);
    }
}
