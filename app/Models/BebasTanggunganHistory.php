<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BebasTanggunganHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'bebas_tanggungan_id',
        'status',
        'catatan',
        'reviewed_by'
    ];

    public function bebasTanggungan()
    {
        return $this->belongsTo(BebasTanggungan::class);
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
