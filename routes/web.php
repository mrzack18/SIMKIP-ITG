<?php

use Illuminate\Support\Facades\Route;

// Biarkan API routes ditangani oleh routes/api.php (otomatis oleh Laravel)

// Fallback untuk SPA React Router
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

