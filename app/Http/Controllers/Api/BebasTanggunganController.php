<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Mahasiswa\BebasTanggunganController as MhsBT;
use App\Http\Controllers\Api\Admin\BebasTanggunganController as AdminBT;

class BebasTanggunganController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "mahasiswa" => app(MhsBT::class)->show($req),
            "admin"     => app(AdminBT::class)->index($req),
            default     => abort(403),
        };
    }
    public function store(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsBT::class)->store($req);
        abort(403);
    }
    public function show(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminBT::class)->show($id);
        abort(403);
    }
    public function approve(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminBT::class)->approve($req, $id);
        abort(403);
    }
    public function reject(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminBT::class)->reject($req, $id);
        abort(403);
    }
    public function downloadPdfMhs(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsBT::class)->downloadPdf($req);
        abort(403);
    }
    public function downloadPdfAdmin(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminBT::class)->downloadPdf($id);
        abort(403);
    }
}