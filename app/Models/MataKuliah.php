<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliahs';
    protected $fillable = ['ipk_semester_id', 'kode', 'nama', 'sks', 'nilai_huruf', 'nilai_mutu', 'lulus'];
    protected $casts = ['nilai_mutu' => 'decimal:1', 'lulus' => 'boolean'];

    public function ipkSemestr()
    {
        return $this->belongsTo(IpkSemestr::class, 'ipk_semester_id');
    }
}
