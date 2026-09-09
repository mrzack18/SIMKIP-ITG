<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query()->where('role', '!=', 'lsipd');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role') && $request->input('role') !== 'all') {
            $query->where('role', $request->input('role'));
        }

        $perPage = (int) $request->input('per_page', 10);
        $users = $query->with('prodi')->orderBy('name')->paginate($perPage);

        $data = $users->map(fn ($u) => [
            'id'                 => $u->id,
            'name'               => $u->name,
            'username'           => $u->username,
            'email'             => $u->email,
            'role'              => $u->role,
            'prodi_id'          => $u->prodi_id,
            'prodi_nama'        => $u->prodi?->nama,
            'is_active'         => $u->is_active,
            'is_password_changed'=> $u->is_password_changed,
            'created_at'         => $u->created_at->toIso8601String(),
        ]);

        return response()->json([
            'success' => true,
            'data'    => $data,
            'total'   => $users->total(),
            'current_page' => $users->currentPage(),
            'last_page'   => $users->lastPage(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username',
            'email'    => 'nullable|email|max:255|unique:users,email',
            'role'     => 'required|in:admin,mahasiswa,prodi,warek',
            'prodi_id' => 'nullable|exists:prodis,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $tempPassword = 'kipk' . $request->input('username') . '2026';

        $user = User::create([
            'name'               => $request->input('name'),
            'username'           => $request->input('username'),
            'email'             => $request->input('email'),
            'password'           => Hash::make($tempPassword),
            'role'               => $request->input('role'),
            'prodi_id'           => $request->input('role') === 'prodi' ? $request->input('prodi_id') : null,
            'is_password_changed' => false,
            'is_active'          => true,
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'User berhasil dibuat. Password sementara: ' . $tempPassword,
            'data'     => $user,
            'password' => $tempPassword,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::where('role', '!=', 'lsipd')->find($id);
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'     => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:50|unique:users,username,' . $id,
            'email'    => 'nullable|email|max:255|unique:users,email,' . $id,
            'role'     => 'sometimes|in:admin,mahasiswa,prodi,warek',
            'prodi_id' => 'nullable|exists:prodis,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $data = $request->only(['name', 'username', 'email', 'role']);
        if ($request->input('role') === 'prodi') {
            $data['prodi_id'] = $request->input('prodi_id');
        } else {
            $data['prodi_id'] = null;
        }

        $user->update($data);

        return response()->json(['success' => true, 'message' => 'User berhasil diperbarui.']);
    }

    public function toggleActive(int $id): JsonResponse
    {
        $user = User::where('role', '!=', 'lsipd')->find($id);
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }

        $user->update(['is_active' => ! $user->is_active]);

        return response()->json([
            'success' => true,
            'message' => $user->is_active ? 'User diaktifkan.' : 'User dinonaktifkan.',
            'is_active' => $user->is_active,
        ]);
    }

    public function resetPassword(int $id): JsonResponse
    {
        $user = User::where('role', '!=', 'lsipd')->find($id);
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }

        $newPassword = 'kipk' . $user->username . '2026';
        $user->update([
            'password'           => Hash::make($newPassword),
            'is_password_changed' => false,
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Password berhasil direset.',
            'password' => $newPassword,
        ]);
    }
}
