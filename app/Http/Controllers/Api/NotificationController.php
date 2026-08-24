<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifs = $request->user()->notifications()->take(30)->get();
        return response()->json([
            'success' => true,
            'data'    => $notifs->map(fn($n) => [
                'id'         => $n->id,
                'judul'      => $n->judul,
                'pesan'      => $n->pesan,
                'tipe'       => $n->tipe,
                'is_read'    => $n->is_read,
                'link'       => $n->link,
                'waktu'      => $n->created_at->diffForHumans(),
            ]),
        ]);
    }

    public function count(Request $request): JsonResponse
    {
        $count = $request->user()->notifications()->where('is_read', false)->count();
        return response()->json(['success' => true, 'count' => $count]);
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        $request->user()->notifications()->where('id', $id)->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->notifications()->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }
}
