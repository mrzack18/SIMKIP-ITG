<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Mahasiswa\PelatihanController as MhsPelatihan;
use App\Http\Controllers\Api\Admin\DataAkademikController as AdminAkademik;

class PelatihanController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "mahasiswa" => app(MhsPelatihan::class)->index($req),
            "admin"     => app(AdminAkademik::class)->indexPelatihan($req),
            default     => abort(403),
        };
    }

    public function store(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsPelatihan::class)->store($req);
        abort(403);
    }

    public function update(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsPelatihan::class)->update($req, $id);
        abort(403);
    }

    public function show(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsPelatihan::class)->show($id);
        abort(403);
    }

    public function destroy(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsPelatihan::class)->destroy($id);
        abort(403);
    }

    public function validatePelatihan(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminAkademik::class)->validatePelatihan($req, $id);
        abort(403);
    }
}