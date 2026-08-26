<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Username atau password salah.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('simkip_token')->plainTextToken;
        AuditLog::catat('Login', "Login: {$user->name} ({$user->role})");

        $redirectMap = [
            'admin'     => '/admin',
            'mahasiswa' => '/mahasiswa',
            'prodi'     => '/prodi',
            'warek'     => '/warek',
        ];

        return response()->json([
            'success'            => true,
            'user'               => new UserResource($user),
            'token'              => $token,
            'redirectPath'       => $redirectMap[$user->role] ?? '/',
            'mustChangePassword' => ! $user->is_password_changed,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['mahasiswa.prodi', 'prodi']);

        return response()->json([
            'success' => true,
            'user'    => new UserResource($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logout berhasil.']);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'password_lama'  => 'required|string',
            'password_baru'  => 'required|string|min:8',
            'konfirmasi'     => 'required|same:password_baru',
        ]);

        $user = $request->user();

        if (! Hash::check($request->password_lama, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Password lama tidak sesuai.'], 422);
        }

        $user->update([
            'password'            => Hash::make($request->password_baru),
            'is_password_changed' => true,
        ]);

        return response()->json(['success' => true, 'message' => 'Password berhasil diubah.']);
    }
}
