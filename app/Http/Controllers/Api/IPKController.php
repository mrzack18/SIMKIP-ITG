<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Mahasiswa\IPKController as MhsIPK;
use App\Http\Controllers\Api\Admin\DataAkademikController as AdminAkademik;

class IPKController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "mahasiswa" => app(MhsIPK::class)->index($req),
            "admin"     => app(AdminAkademik::class)->indexIPK($req),
            default     => abort(403),
        };
    }

    public function store(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsIPK::class)->store($req);
        abort(403);
    }

    public function submit(Request $req) {
        if ($req->user()->role === "mahasiswa") return app(MhsIPK::class)->submit($req);
        abort(403);
    }
}