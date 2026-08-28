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
        $user = $request->user()->load(['mahasiswa.prodi', 'prodi', 'contactHistories']);
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
                'kategori' => $m?->kategori,
                'status'   => $m?->status,
                'nik'      => $m?->nik,
                'tempat_lahir' => $m?->tempat_lahir,
                'tanggal_lahir' => $m?->tanggal_lahir?->format('Y-m-d'),
                'jenis_kelamin' => $m?->jenis_kelamin,
                'alamat'   => $m?->alamat,
                'nama_ayah'=> $m?->nama_ayah,
                'nama_ibu' => $m?->nama_ibu,
                'tel_ayah' => $m?->tel_ayah,
                'tel_ibu'  => $m?->tel_ibu,
                'contact_histories' => $user->contactHistories->map(function($ch) {
                    return [
                        'nomor' => $ch->no_hp,
                        'sem' => $ch->keterangan ?? $ch->created_at->format('d M Y'),
                        'aktif' => false
                    ];
                }),
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
            'nik'        => 'sometimes|nullable|string|max:16',
            'tempat_lahir' => 'sometimes|nullable|string|max:100',
            'tanggal_lahir' => 'sometimes|nullable|date',
            'jenis_kelamin' => 'sometimes|nullable|in:Laki-laki,Perempuan',
            'alamat'     => 'sometimes|nullable|string|max:500',
            'nama_ayah'  => 'sometimes|nullable|string|max:100',
            'nama_ibu'   => 'sometimes|nullable|string|max:100',
            'tel_ayah'   => 'sometimes|nullable|string|max:20',
            'tel_ibu'    => 'sometimes|nullable|string|max:20',
        ]);

        $user = $request->user();
        
        \Illuminate\Support\Facades\DB::transaction(function () use ($request, $user) {
            $userData = $request->only(['email', 'no_hp']);
            
            if ($request->has('no_hp') && $request->no_hp !== $user->no_hp && !empty($user->no_hp)) {
                $user->contactHistories()->create([
                    'no_hp' => $user->no_hp,
                    'keterangan' => 'S/d ' . now()->format('M Y')
                ]);
            }

            if ($request->has('nama')) $userData['name'] = $request->nama;
            
            if ($request->hasFile('foto_profil')) {
                if ($user->foto_profil) \Illuminate\Support\Facades\Storage::disk('public')->delete($user->foto_profil);
                $userData['foto_profil'] = $request->file('foto_profil')->store("profil/{$user->id}", 'public');
            }

            $user->update($userData);

            if ($user->role === 'mahasiswa' && $user->mahasiswa) {
                $mhsData = $request->only([
                    'nik', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'alamat', 'nama_ayah', 'nama_ibu', 'tel_ayah', 'tel_ibu'
                ]);
                if (!empty($mhsData)) {
                    $user->mahasiswa->update($mhsData);
                }
            }
        });

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
