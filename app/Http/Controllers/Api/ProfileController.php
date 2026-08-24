<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load(['mahasiswa.prodi', 'prodi']);
        $m    = $user->mahasiswa;

        return response()->json([
            'success' => true,
            'data'    => [
                'id'       => $user->id,
                'nama'     => $user->name,
                'username' => $user->username,
                'email'    => $user->email,
                'no_hp'    => $user->no_hp,
                'role'     => $user->role,
                'nim'      => $m?->nim,
                'prodi'    => $user->prodi?->nama ?? $m?->prodi?->nama,
                'angkatan' => $m?->angkatan,
                'foto'     => $user->foto_profil ? asset('storage/' . $user->foto_profil) : null,
                'is_password_changed' => $user->is_password_changed,
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'nama'       => 'sometimes|string|max:255',
            'email'      => 'sometimes|nullable|email',
            'no_hp'      => 'sometimes|nullable|string|max:20',
            'foto_profil'=> 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = $request->user();
        $data = $request->only(['email', 'no_hp']);

        if ($request->nama)  $data['name']  = $request->nama;
        if ($request->hasFile('foto_profil')) {
            $data['foto_profil'] = $request->file('foto_profil')->store("profil/{$user->id}", 'public');
        }

        $user->update($data);

        return response()->json(['success' => true, 'message' => 'Profil diperbarui.']);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'password_lama' => 'required|string',
            'password_baru' => 'required|string|min:8',
            'konfirmasi'    => 'required|same:password_baru',
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
