<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DokumenFieldValue extends Model
{
    protected $fillable = ['dokumen_id', 'dokumen_jenis_field_id', 'value'];

    public function dokumen()
    {
        return $this->belongsTo(Dokumen::class);
    }

    public function field()
    {
        return $this->belongsTo(DokumenJenisField::class, 'dokumen_jenis_field_id');
    }
}
