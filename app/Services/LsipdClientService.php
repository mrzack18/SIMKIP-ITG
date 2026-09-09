<?php

namespace App\Services;

use App\Exceptions\LsipdException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LsipdClientService
{
    private const CACHE_KEY = 'lsipd:token';
    private const TRANSIENT_ERROR_CODES = [502, 503, 504];

    public static function login(): string
    {
        $username = config('services.lsipd.username');
        $password = config('services.lsipd.password');

        if (! $username || ! $password) {
            throw new LsipdException(
                'Kredensial LSIPD belum dikonfigurasi. Set LSIPD_USERNAME & LSIPD_PASSWORD di .env.',
            );
        }

        $response = self::rawHttp()
            ->post('/auth/login', ['username' => $username, 'password' => $password]);

        $token = data_get($response->json(), 'data.token');

        if (! $response->successful() || ! $token) {
            throw new LsipdException(
                'Login LSIPD gagal.',
                $response->status(),
                ['body' => $response->json()],
            );
        }

        Cache::put(self::CACHE_KEY, $token, now()->addSeconds((int) config('services.lsipd.cache_ttl', 7200)));

        return $token;
    }

    public static function getToken(): string
    {
        return Cache::get(self::CACHE_KEY) ?? self::login();
    }

    public static function invalidateToken(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Ambil daftar seluruh mahasiswa KIP-K dari LSIPD.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getMahasiswaList(): array
    {
        $body = self::requestJson('GET', '/kipk/mahasiswa');

        return (array) data_get($body, 'data', []);
    }

    /**
     * Ambil data transkrip + progres akademik mahasiswa berdasarkan NIM.
     *
     * @return array<string, mixed>|null
     */
    public static function getTranskrip(string $nim): ?array
    {
        $nim = trim($nim);
        if ($nim === '') {
            throw new LsipdException('NIM kosong.');
        }

        $body = self::requestJson('GET', '/kipk/transkrip', ['nim' => $nim]);

        return data_get($body, 'data');
    }

    private static function requestJson(string $method, string $path, array $payload = []): array
    {
        $token = self::getToken();
        $http = self::authHttp($token);

        $response = self::dispatch($http, $method, $path, $payload);

        if ($response->status() === 401 || $response->status() === 403) {
            self::invalidateToken();
            $token = self::login();
            $http = self::authHttp($token);

            $response = self::dispatch($http, $method, $path, $payload);
        }

        if (! $response->successful()) {
            Log::warning('LSIPD request gagal', [
                'method'   => $method,
                'path'     => $path,
                'status'   => $response->status(),
                'body'     => $response->json(),
            ]);

            throw new LsipdException(
                $response->json('message') ?? 'Permintaan ke LSIPD gagal.',
                $response->status(),
                ['path' => $path, 'payload' => $payload],
            );
        }

        return $response->json() ?? [];
    }

    private static function dispatch(\Illuminate\Http\Client\PendingRequest $http, string $method, string $path, array $payload): \Illuminate\Http\Client\Response
    {
        return match (strtoupper($method)) {
            'GET'    => $http->get($path, $payload),
            'POST'   => $http->post($path, $payload),
            'PUT'    => $http->put($path, $payload),
            'PATCH'  => $http->patch($path, $payload),
            'DELETE' => $http->delete($path, $payload),
            default  => throw new LsipdException("Method tidak didukung: {$method}"),
        };
    }

    private static function authHttp(string $token): \Illuminate\Http\Client\PendingRequest
    {
        return self::rawHttp()->withToken($token)->acceptJson();
    }

    private static function rawHttp(): \Illuminate\Http\Client\PendingRequest
    {
        return Http::baseUrl(rtrim((string) config('services.lsipd.base_url'), '/') . '/')
            ->timeout((int) config('services.lsipd.timeout', 30))
            ->withHeaders(['X-Client' => 'simkip-itg'])
            ->retry(2, 500, fn ($exception, $request) => $exception instanceof \Illuminate\Http\Client\ConnectionException)
            ->acceptJson();
    }
}
