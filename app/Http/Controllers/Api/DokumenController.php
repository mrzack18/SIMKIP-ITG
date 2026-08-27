<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Mahasiswa\DokumenController as MhsDokumen;
use App\Http\Controllers\Api\Admin\DokumenController as AdminDokumen;

class DokumenController extends Controller
{
    public function index(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsDokumen::class)->index($req);
        abort(403);
    }
    public function store(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsDokumen::class)->store($req);
        abort(403);
    }
    public function destroy(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") return app(MhsDokumen::class)->destroy($req, $id);
        abort(403);
    }
    public function arsip(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsDokumen::class)->arsip($req);
        abort(403);
    }
    public function queue(Request $req) {
        if ($req->user()->role === "admin") return app(AdminDokumen::class)->queue($req);
        abort(403);
    }
    public function validateDokumen(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminDokumen::class)->validateDokumen($req, $id);
        abort(403);
    }
}