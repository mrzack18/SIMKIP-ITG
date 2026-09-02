<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\IpkSemestr;
use App\Models\Organisasi;
use App\Models\Pelatihan;
use App\Models\Prestasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    private const FIELD_MAP = [
        'prestasi'   => ['file_sertifikat' => 'file_sertifikat', 'file_foto' => 'file_foto'],
        'organisasi' => ['file_sk' => 'file_sk', 'foto_kegiatan' => 'foto_kegiatan'],
        'pelatihan'  => ['file_sertifikat' => 'file_sertifikat', 'foto_kegiatan' => 'foto_kegiatan'],
        'dokumen'    => ['path_file' => 'path_file'],
        'ipk'        => ['file_khs' => 'file_khs'],
    ];

    public function serve(Request $request, string $type, int $id, string $field, string $action = 'inline')
    {
        if (!isset(self::FIELD_MAP[$type][$field])) {
            abort(404);
        }
        $dbField = self::FIELD_MAP[$type][$field];

        $model = match ($type) {
            'prestasi'   => Prestasi::with('mahasiswa')->findOrFail($id),
            'organisasi' => Organisasi::with('mahasiswa')->findOrFail($id),
            'pelatihan'  => Pelatihan::with('mahasiswa')->findOrFail($id),
            'dokumen'    => Dokumen::with('mahasiswa')->findOrFail($id),
            'ipk'        => IpkSemestr::with('mahasiswa')->findOrFail($id),
            default      => abort(404),
        };

        $this->authorizeAccess($request->user(), $model);

        $path = $model->$dbField;
        if (!$path) {
            abort(404);
        }

        $fullPath = storage_path('app/public/' . $path);
        if (!file_exists($fullPath)) {
            abort(404);
        }

        $fileName = basename($path);

        if ($action === 'download') {
            return response()->download($fullPath, $fileName);
        }

        return response()->file($fullPath);
    }

    private function authorizeAccess($user, $model): void
    {
        $mhs = $model->mahasiswa ?? null;

        $allowed = match ($user->role) {
            'admin', 'warek' => true,
            'prodi'          => $mhs && $mhs->prodi_id === $user->prodi_id,
            'mahasiswa'      => $mhs && $mhs->user_id === $user->id,
            default          => false,
        };

        if (!$allowed) {
            abort(403, 'Anda tidak berhak mengakses file ini.');
        }
    }
}
