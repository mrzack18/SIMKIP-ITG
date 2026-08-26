<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DokumenJenis extends Model
{
    use HasFactory;

    protected $table = 'dokumen_jenis';
    protected $fillable = ['nama', 'is_wajib', 'urutan'];
    protected $casts = ['is_wajib' => 'boolean'];

    public function dokumens()
    {
        return $this->hasMany(Dokumen::class);
    }
}
