import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Modal } from "./Modal";
import { api } from "@/services/api";

interface Props {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

/** Konversi format backend "2025/2026 Ganjil" -> internal "Tahun 2025/2026-1" */
function toInternalFormat(ta: string): string {
  const m = ta.trim().match(/^(\d{4}\/\d{4})\s+(Ganjil|Genap)$/);
  if (!m) return ta;
  const num = m[2] === "Ganjil" ? "1" : "2";
  return `Tahun ${m[1]}-${num}`;
}

/**
 * Fallback berbasis bulan (hanya dipakai sebelum data dari tabel tahun_ajarans
 * selesai dimuat). Sumber kebenaran utama tetap tabel tahun_ajarans.
 */
export function getCurrentTahunAjaran(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = Jan, 1 = Feb, 8 = Sep

  // Jika bulan Februari (1) sampai Agustus (7), maka Genap
  if (month >= 1 && month <= 7) {
    // Berada di paruh kedua tahun ajaran (misal Feb 2027 -> 2026/2027 Genap)
    return `Tahun ${year - 1}/${year}-2`;
  } else {
    // Bulan Sep-Des (8-11) ATAU Jan (0)
    if (month === 0) {
      // Januari (misal Jan 2027 -> masih bagian dari 2026/2027 Ganjil)
      return `Tahun ${year - 1}/${year}-1`;
    } else {
      // September - Desember (misal Sep 2026 -> 2026/2027 Ganjil)
      return `Tahun ${year}/${year + 1}-1`;
    }
  }
}

/** Convert internal format to readable label: "Tahun 2026/2027-1" → "2026/2027 Ganjil" */
export function formatTahunAjaran(val: string): string {
  return val
    .replace("Tahun ", "")
    .replace("-1", " Ganjil")
    .replace("-2", " Genap");
}

/** Convert internal format to split backend format: "Tahun 2026/2027-1" → { tahun: "2026/2027", semester: "Ganjil" } */
export function parseTahunAjaran(val: string): { tahun: string; semester: "Ganjil" | "Genap" } | null {
  if (!val || !val.startsWith("Tahun ")) return null;
  const match = val.match(/^Tahun (\d{4}\/\d{4})-([12])$/);
  if (!match) return null;
  return {
    tahun: match[1],
    semester: match[2] === "1" ? "Ganjil" : "Genap",
  };
}

export function TahunAjaranFilter({ value, onChange, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  // Ambil opsi tahun ajaran dari database (dikelola manual oleh admin di
  // halaman Konfigurasi -> Master Tahun Ajaran). Tidak lagi berbasis bulan.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res: any = await api.get("/konfigurasi/periode");
        const raw: string[] = res?.tahun_ajaran_options ?? [];
        const opts = raw.map(toInternalFormat).filter((o) => o.startsWith("Tahun "));
        if (!active) return;
        const unique = Array.from(new Set(opts)).sort().reverse();
        setOptions(unique);
        if (unique.length === 0) return;

        // Default = tahun ajaran yang ditandai aktif oleh admin (jika valid),
        // jika tidak ada yang aktif, pertahankan pilihan user yang masih valid
        // (jangan force-reset ke terbaru yang membuat halaman tampak kosong).
        const aktif = res?.tahun_ajaran_aktif ? toInternalFormat(res.tahun_ajaran_aktif) : null;
        let preferred: string | null = null;
        if (aktif && unique.includes(aktif)) {
          preferred = aktif;
        } else if (!value || !unique.includes(value)) {
          preferred = unique[0];
        }

        if (preferred && (!unique.includes(value) || preferred !== value)) {
          onChange(preferred);
        }
      } catch {
        // Gagal memuat -> fallback berbasis bulan biar UI tetap berfungsi.
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayLabel = formatTahunAjaran(value);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors max-w-full min-w-0 ${className}`}
      >
        <Calendar size={16} className="text-[#263F93] flex-shrink-0" />
        <span className="text-[#263F93] truncate">{displayLabel}</span>
        <svg className="w-3 h-3 text-gray-400 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Filter Tahun Akademik" width="max-w-sm">
        <div className="space-y-2">
          {options.length === 0 && (
            <div className="text-xs text-gray-400 px-4 py-3 text-center">
              Belum ada tahun ajaran yang tersedia.
            </div>
          )}
          {options.map((opt) => {
            const label = formatTahunAjaran(opt);
            const isActive = opt === value;
            return (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#263F93] text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
