<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'username', 'email', 'password',
        'role', 'is_password_changed', 'foto_profil', 'no_hp', 'prodi_id',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_password_changed' => 'boolean',
    ];

    public function mahasiswa()
    {
        return $this->hasOne(Mahasiswa::class);
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class)->latest();
    }

    public function contactHistories()
    {
        return $this->hasMany(ContactHistory::class)->latest();
    }
}
