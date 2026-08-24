<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanReview extends Model
{
    protected $fillable = ['laporan_id', 'warek_id', 'aksi', 'catatan', 'reviewed_at'];
    protected $casts = ['reviewed_at' => 'datetime'];

    public function laporan() { return $this->belongsTo(Laporan::class); }
    public function warek() { return $this->belongsTo(User::class, 'warek_id'); }
}
