<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Admin\LaporanController as AdminLaporan;
use App\Http\Controllers\Api\Warek\LaporanController as WarekLaporan;
use App\Http\Controllers\Api\Prodi\LaporanController as ProdiLaporan;

class LaporanController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "admin" => app(AdminLaporan::class)->index($req),
            "warek" => app(WarekLaporan::class)->index($req),
            "prodi" => app(ProdiLaporan::class)->index($req),
            default => abort(403),
        };
    }
    public function store(Request $req) {
        if ($req->user()->role === "admin") return app(AdminLaporan::class)->store($req);
        abort(403);
    }
    public function show(Request $req, $id) {
        return match($req->user()->role) {
            "admin" => app(AdminLaporan::class)->show($id),
            "warek" => app(WarekLaporan::class)->show($id),
            "prodi" => app(ProdiLaporan::class)->show($req, $id),
            default => abort(403),
        };
    }
    public function update(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminLaporan::class)->update($req, $id);
        abort(403);
    }
    public function submit(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminLaporan::class)->submit($id);
        abort(403);
    }
    public function approve(Request $req, $id) {
        if ($req->user()->role === "warek") return app(WarekLaporan::class)->approve($req, $id);
        abort(403);
    }
    public function returnLaporan(Request $req, $id) {
        if ($req->user()->role === "warek") return app(WarekLaporan::class)->returnLaporan($req, $id);
        abort(403);
    }
    public function downloadPdf(Request $req, $id) {
        return match($req->user()->role) {
            "admin" => app(AdminLaporan::class)->downloadPdf($id),
            "warek" => app(WarekLaporan::class)->downloadPdf($id),
            "prodi" => app(ProdiLaporan::class)->downloadPdf($req, $id),
            default => abort(403),
        };
    }
}