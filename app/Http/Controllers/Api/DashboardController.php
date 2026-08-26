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