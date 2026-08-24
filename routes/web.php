<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware([])->group(function () {
    Route::get('/dashboard', function () {
        if (request()->has('role')) {
            session(['mock_role' => request()->query('role')]);
        }
        $userRole = request()->user()?->role ?? session('mock_role', 'admin');
        
        if ($userRole === 'admin' || $userRole === 'superadmin') {
            return Inertia::render('Admin/Dashboard/Index', [
                'stats' => [
                    'total_mahasiswa' => 450,
                    'reguler' => 300,
                    'aspirasi' => 150,
                    'sp_aktif' => 12
                ]
            ]);
        } elseif ($userRole === 'mahasiswa') {
            return Inertia::render('Student/Dashboard/Index', [
                'status_akademik' => 'Aktif',
                'ipk_terakhir' => 3.4,
                'sp_aktif' => null // or ['level' => 1, 'reason' => 'IPK < 3.0']
            ]);
        } elseif ($userRole === 'prodi') {
            return Inertia::render('Prodi/Dashboard/Index');
        } elseif ($userRole === 'warek3') {
            return Inertia::render('Warek3/Dashboard/Index');
        }
        
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/mahasiswa', function () { return \Inertia\Inertia::render('Admin/Student/Index'); });
        Route::get('/mahasiswa/tambah', function () { return \Inertia\Inertia::render('Admin/Student/Create'); });
        Route::get('/mahasiswa/{id}', function () { return \Inertia\Inertia::render('Admin/Student/Detail'); });
        
        Route::get('/akademik', function () { return \Inertia\Inertia::render('Admin/Academic/Index'); });
        
        Route::get('/dokumen', function () { return \Inertia\Inertia::render('Admin/Document/Validation'); });
        
        Route::get('/sp', function () { return \Inertia\Inertia::render('Admin/WarningLetter/Index'); });
        Route::get('/sp/terbitkan', function () { return \Inertia\Inertia::render('Admin/WarningLetter/Create'); });
        Route::get('/sp/{id}', function () { return \Inertia\Inertia::render('Admin/WarningLetter/Detail'); });
        
        Route::get('/bebas-tanggungan', function () { return \Inertia\Inertia::render('Admin/Clearance/Index'); });
        Route::get('/bebas-tanggungan/{id}', function () { return \Inertia\Inertia::render('Admin/Clearance/Detail'); });
        
        Route::get('/laporan', function () { return \Inertia\Inertia::render('Admin/Report/Index'); });
        Route::get('/laporan/susun', function () { return \Inertia\Inertia::render('Admin/Report/Create'); });
        Route::get('/laporan/{id}', function () { return \Inertia\Inertia::render('Admin/Report/Detail'); });
        
        Route::get('/konfigurasi', function () { return \Inertia\Inertia::render('Admin/Settings/Index'); });
        
        Route::get('/audit', function () { return \Inertia\Inertia::render('Admin/Audit/Index'); });
    });

    // Student Routes
    Route::prefix('student')->group(function () {
        Route::get('/academic', function () {
            return Inertia::render('Student/Academic/Index', [
                'records' => [
                    ['semester' => 1, 'ipk' => 3.5],
                    ['semester' => 2, 'ipk' => 3.6],
                ]
            ]);
        });
        
        Route::get('/documents', function () {
            return Inertia::render('Student/Document/Index', [
                'documents' => [
                    ['type' => 'Sertifikat MABIM', 'status' => 'approved', 'file_url' => '#'],
                    ['type' => 'Sertifikat KKN', 'status' => 'pending', 'file_url' => '#'],
                ]
            ]);
        });
        
        Route::get('/clearance', function () {
            return Inertia::render('Student/Clearance/Index', [
                'can_apply' => true,
                'status' => null // 'pending', 'approved'
            ]);
        });
    });

    // Prodi Routes
    Route::prefix('prodi')->group(function () {
        Route::get('/students', function () {
            return Inertia::render('Prodi/Student/Index', [
                'students' => [
                    ['nim' => '2406001', 'name' => 'Budi Santoso', 'ipk_terakhir' => 3.5],
                ]
            ]);
        });
    });
    
    // Warek 3 Routes
    Route::prefix('warek3')->group(function () {
        Route::get('/reports', function () {
            return Inertia::render('Warek3/Report/Approval', [
                'reports' => [
                    ['id' => 2, 'semester' => 'Genap 2024/2025', 'status' => 'pending_approval']
                ]
            ]);
        });
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/change-password', [\App\Http\Controllers\Auth\ChangePasswordController::class, 'edit'])->name('password.change');
    Route::put('/change-password', [\App\Http\Controllers\Auth\ChangePasswordController::class, 'update'])->name('password.change.update');
});

require __DIR__.'/auth.php';
