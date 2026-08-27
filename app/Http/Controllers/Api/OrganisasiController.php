<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Mahasiswa\OrganisasiController as MhsOrganisasi;
use App\Http\Controllers\Api\Admin\DataAkademikController as AdminAkademik;

class OrganisasiController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "mahasiswa" => app(MhsOrganisasi::class)->index($req),
            "admin"     => app(AdminAkademik::class)->indexOrganisasi($req),
            default     => abort(403),
        };
    }

    public function store(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsOrganisasi::class)->store($req);
        abort(403);
    }

    public function update(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsOrganisasi::class)->update($req, $id);
        abort(403);
    }

    public function destroy(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsOrganisasi::class)->destroy($req, $id);
        abort(403);
    }

    public function validateOrganisasi(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminAkademik::class)->validateOrganisasi($req, $id);
        abort(403);
    }
}