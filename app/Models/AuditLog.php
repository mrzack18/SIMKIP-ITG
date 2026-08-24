<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false;
    protected $table = 'audit_logs';
    protected $fillable = ['user_id', 'jenis', 'aktivitas', 'deskripsi', 'terkait_nim', 'terkait_nama', 'ip_address'];
    protected $casts = ['created_at' => 'datetime'];

    public function user() { return $this->belongsTo(User::class); }

    public static function catat(string $jenis, string $aktivitas, array $extra = []): void
    {
        static::create(array_merge([
            'user_id' => auth()->id(),
            'jenis' => $jenis,
            'aktivitas' => $aktivitas,
            'ip_address' => request()->ip(),
        ], $extra));
    }
}
