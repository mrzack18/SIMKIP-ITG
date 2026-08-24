<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['user_id', 'judul', 'pesan', 'tipe', 'is_read', 'link'];
    protected $casts = ['is_read' => 'boolean'];

    public function user() { return $this->belongsTo(User::class); }

    public static function kirim(int $userId, string $judul, string $pesan, string $tipe = 'info', ?string $link = null): void
    {
        static::create([
            'user_id' => $userId,
            'judul' => $judul,
            'pesan' => $pesan,
            'tipe' => $tipe,
            'link' => $link,
        ]);
    }
}
