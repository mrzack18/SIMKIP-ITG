<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Mahasiswa\PrestasiController as MhsPrestasi;
use App\Http\Controllers\Api\Admin\DataAkademikController as AdminAkademik;

class PrestasiController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "mahasiswa" => app(MhsPrestasi::class)->index($req),
            "admin"     => app(AdminAkademik::class)->indexPrestasi($req),
            default     => abort(403),
        };
    }

    public function store(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsPrestasi::class)->store($req);
        abort(403);
    }

    public function update(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsPrestasi::class)->update($req, $id);
        abort(403);
    }

    public function destroy(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsPrestasi::class)->destroy($req, $id);
        abort(403);
    }

    public function validatePrestasi(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminAkademik::class)->validatePrestasi($req, $id);
        abort(403);
    }
}