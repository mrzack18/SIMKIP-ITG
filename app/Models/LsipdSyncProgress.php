<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LsipdSyncProgress extends Model
{
    protected $table = 'lsipd_sync_progresses';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'status', 'phase', 'total', 'processed', 'inserted', 'updated',
        'skipped', 'unchanged', 'transkrip_success', 'transkrip_failed',
        'message', 'started_at', 'finished_at',
    ];

    protected $casts = [
        'started_at'  => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function getPercentAttribute(): int
    {
        if ($this->total <= 0) {
            return 0;
        }

        return (int) min(100, round(($this->processed / $this->total) * 100));
    }
}
