<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LaporanReview extends Model
{
    use HasFactory;

    protected $fillable = ['laporan_id', 'warek_id', 'aksi', 'catatan', 'reviewed_at'];
    protected $casts = ['reviewed_at' => 'datetime'];

    public function laporan() { return $this->belongsTo(Laporan::class); }
    public function warek() { return $this->belongsTo(User::class, 'warek_id'); }
}
