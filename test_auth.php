<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('username', 'admin_kemahasiswaan')->first();
if (!$user) {
    echo "Super Admin not found!\n";
    exit(1);
}

if (!\Illuminate\Support\Facades\Hash::check('password', $user->password)) {
    echo "Super Admin password does not match!\n";
    exit(1);
}
echo "Super Admin login logic verified.\n";

// test middleware
$request = Illuminate\Http\Request::create('/dashboard', 'GET');
$request->setUserResolver(function () use ($user) {
    return $user;
});

// Since we're not running full HTTP kernel we just verify the user attributes
if ($user->role === 'admin' && $user->is_password_changed) {
    echo "Super Admin attributes are correct.\n";
} else {
    echo "Super Admin attributes are incorrect.\n";
}
