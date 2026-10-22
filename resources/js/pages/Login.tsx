import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/services/authService";
import { api } from "@/services/api";
import logoItg from "@/imports/logo_itg.jpg";

interface LoginStats {
  mahasiswa_aktif: number;
  dokumen_tervalidasi: number;
  program_studi: number;
  angkatan: string | null;
}

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [stats, setStats] = useState<LoginStats | null>(null);

  useEffect(() => {
    let mounted = true;

    api.get<{ stats: LoginStats }>("/public-stats")
      .then(({ stats: fetchedStats }) => {
        if (mounted) setStats(fetchedStats);
      })
      .catch(() => {
        // The login form remains usable if the public stats request fails.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login({ username, password });
      setUser(result.user);
      navigate(result.redirectPath);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Hero Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #263F93 0%, #1B2F73 60%, #1B2F73 100%)" }}
      >
        {/* Geometric pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute border border-white/30 rounded-full"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                bottom: `-${(i + 1) * 30}px`,
                right: `-${(i + 1) * 20}px`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <img src={logoItg} alt="ITG" className="w-12 h-12 rounded-xl object-contain bg-white p-1" />
            <div>
              <div className="font-display font-800 text-white text-xl">SIMKIP-ITG</div>
              <div className="text-white/50 text-xs">Institut Teknologi Garut</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="font-display font-700 text-white text-4xl leading-tight mb-3">
              Sistem Monitoring<br />Mahasiswa KIP-K
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Platform terpusat untuk monitoring capaian akademik, dokumen kewajiban, dan prestasi mahasiswa penerima KIP-K ITG.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Mahasiswa Aktif", value: stats ? stats.mahasiswa_aktif : "—" },
              { label: "Dokumen Tervalidasi", value: stats ? stats.dokumen_tervalidasi : "—" },
              { label: "Program Studi", value: stats ? stats.program_studi : "—" },
              { label: "Angkatan", value: stats?.angkatan ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3">
                <div className="font-display font-700 text-[#D4A72C] text-xl">{value}</div>
                <div className="text-white/60 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/30 text-xs">
          © 2026 Institut Teknologi Garut — Biro Kemahasiswaan
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:p-8 bg-white min-w-0">
        <div className="w-full max-w-md min-w-0">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src={logoItg} alt="ITG" className="w-10 h-10 rounded-xl object-contain bg-[#263F93] p-1" />
            <div>
              <div className="font-display font-700 text-[#263F93] text-lg">SIMKIP-ITG</div>
              <div className="text-gray-400 text-xs">Institut Teknologi Garut</div>
            </div>
          </div>

          <div className="mb-6 sm:mb-8 min-w-0">
            <h2 className="font-display font-700 text-gray-900 text-lg sm:text-xl mb-1">Masuk ke SIMKIP-ITG</h2>
            <p className="text-gray-500 text-xs sm:text-sm break-words">Gunakan kredensial yang diberikan oleh Biro Kemahasiswaan</p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 min-w-0">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm break-words min-w-0">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">NIM / Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan NIM atau username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 focus:border-[#263F93] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-500 text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 focus:border-[#263F93] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#263F93]"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">Ingat Saya</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-600 text-sm transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: loading ? "#94A3B8" : "#263F93", color: "white" }}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2026 Institut Teknologi Garut
          </p>
        </div>
      </div>
    </div>
  );
}
