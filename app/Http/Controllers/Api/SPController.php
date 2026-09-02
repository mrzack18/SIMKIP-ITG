<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Admin\SPController as AdminSP;

class SPController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "mahasiswa" => (function() use ($req) {
                $m = $req->user()->mahasiswa()->first();
                $query = $m->suratPeringatans()->with(["mahasiswa.user", "mahasiswa.prodi"]);
                \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($query, 'surat_peringatans.created_at', $req->tahun_ajaran);
                return response()->json(["success" => true, "data" => \App\Http\Resources\SuratPeringatanResource::collection($query->get())]);
            })(),
            "admin" => app(AdminSP::class)->index($req),
            default => abort(403),
        };
    }
    public function store(Request $req) {
        if ($req->user()->role === "admin") return app(AdminSP::class)->store($req);
        abort(403);
    }
    public function show(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminSP::class)->show($id);
        abort(403);
    }
    public function updateStatus(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminSP::class)->updateStatus($req, $id);
        abort(403);
    }
    public function history(Request $req, $id) {
        return match($req->user()->role) {
            "admin" => app(AdminSP::class)->history($req, $id),
            "warek", "prodi" => app(AdminSP::class)->history($req, $id),
            default => abort(403),
        };
    }
}