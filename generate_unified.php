<?php

$dir = __DIR__ . '/app/Http/Controllers/Api';

$controllers = [
    'DashboardController' => '
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Api\Mahasiswa\DashboardController as MhsDashboard;
use App\Http\Controllers\Api\Prodi\DashboardController as ProdiDashboard;
use App\Http\Controllers\Api\Warek\DashboardController as WarekDashboard;

class DashboardController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "admin"     => app(AdminDashboard::class)->index($req),
            "mahasiswa" => app(MhsDashboard::class)->index($req),
            "prodi"     => app(ProdiDashboard::class)->index($req),
            "warek"     => app(WarekDashboard::class)->index($req),
            default     => abort(403),
        };
    }
}
',
    'MahasiswaController' => '
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Admin\MahasiswaController as AdminMahasiswa;
use App\Http\Controllers\Api\Prodi\MahasiswaController as ProdiMahasiswa;
use App\Models\Mahasiswa;

class MahasiswaController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "admin" => app(AdminMahasiswa::class)->index($req),
            "prodi" => app(ProdiMahasiswa::class)->index($req),
            "warek" => $this->warekIndex($req),
            default => abort(403),
        };
    }

    public function store(Request $req) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->store($req);
        abort(403);
    }

    public function show(Request $req, $id) {
        return match($req->user()->role) {
            "admin" => app(AdminMahasiswa::class)->show($id),
            "prodi" => app(ProdiMahasiswa::class)->show($id),
            default => abort(403),
        };
    }

    public function destroy(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->destroy($req, $id);
        abort(403);
    }

    public function checkNim(Request $req, $nim) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->checkNim($nim);
        abort(403);
    }

    private function warekIndex(Request $req) {
        $query = Mahasiswa::with("prodi");
        if ($s = $req->search) $query->where(fn($q) => $q->where("nim","like","%$s%")->orWhere("nama","like","%$s%"));
        $limit = (int)($req->limit ?? 10);
        $page  = (int)($req->page ?? 1);
        $total = $query->count();
        $data  = $query->skip(($page-1)*$limit)->take($limit)->get();
        return response()->json(["success"=>true,"data"=>$data,"total"=>$total,"page"=>$page,"limit"=>$limit,"total_pages"=>(int)ceil($total/$limit)]);
    }
}
',
    'IPKController' => '
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
}
',
    'PrestasiController' => '
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
        if ($req->user()->role === "mahasiswa") return app(MhsPrestasi::class)->destroy($id);
        abort(403);
    }

    public function validatePrestasi(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminAkademik::class)->validatePrestasi($req, $id);
        abort(403);
    }
}
',
    'OrganisasiController' => '
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
        if ($req->user()->role === "mahasiswa") return app(MhsOrganisasi::class)->destroy($id);
        abort(403);
    }

    public function validateOrganisasi(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminAkademik::class)->validateOrganisasi($req, $id);
        abort(403);
    }
}
',
    'PelatihanController' => '
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
',
    'DokumenController' => '
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
        if ($req->user()->role === "mahasiswa") return app(MhsDokumen::class)->destroy($id);
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
    public function approve(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminDokumen::class)->approve($req, $id);
        abort(403);
    }
    public function reject(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminDokumen::class)->reject($req, $id);
        abort(403);
    }
    public function serveFile(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminDokumen::class)->serveFile($id);
        abort(403);
    }
}
',
    'SPController' => '
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
                $m = $req->user()->mahasiswa()->with("suratPeringatans")->first();
                return response()->json(["success" => true, "data" => $m->suratPeringatans]);
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
}
',
    'BebasTanggunganController' => '
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
',
    'LaporanController' => '
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Admin\LaporanController as AdminLaporan;
use App\Http\Controllers\Api\Warek\LaporanController as WarekLaporan;

class LaporanController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "admin" => app(AdminLaporan::class)->index($req),
            "warek" => app(WarekLaporan::class)->index($req),
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
        if ($req->user()->role === "warek") return app(WarekLaporan::class)->return($req, $id);
        abort(403);
    }
    public function downloadPdf(Request $req, $id) {
        return match($req->user()->role) {
            "admin" => app(AdminLaporan::class)->downloadPdf($id),
            "warek" => app(WarekLaporan::class)->downloadPdf($id),
            default => abort(403),
        };
    }
}
'
];

foreach ($controllers as $name => $content) {
    file_put_contents($dir . '/' . $name . '.php', trim($content));
}

echo "Controllers created.\n";
