/**
 * Mirrors App\Helpers\TahunAjaranHelper::calculateSemester
 * ta format: "2024/2025 Ganjil" | "2024/2025-1" | "Tahun 2024/2025 Genap" | "Semua"
 */
export function normalizeTA(ta: string): string {
  return ta
    .replace(/^Tahun\s+/i, "")
    .replace(/-1$/, " Ganjil")
    .replace(/-2$/, " Genap");
}

export function parseTA(ta: string): { startYear: number; termValue: number } | null {
  const normalized = normalizeTA(ta);
  const match = normalized.match(/^(\d{4})\/\d{4}\s+(Ganjil|Genap)$/);
  if (!match) return null;
  return {
    startYear: parseInt(match[1], 10),
    termValue: match[2] === "Genap" ? 2 : 1,
  };
}

export function calculateSemester(angkatan: number, tahunAjaran: string): number {
  if (!tahunAjaran || tahunAjaran === "Semua") {
    // Fallback: gunakan TA aktif default (backend handles this)
    return 0;
  }
  const parsed = parseTA(tahunAjaran);
  if (!parsed) return 0;
  return Math.max(0, (parsed.startYear - angkatan) * 2 + parsed.termValue);
}

/**
 * Parse taFilter string ke format yang dikirim backend
 * "2025/2026 Ganjil" → "2025/2026-1" (backend expects hyphen format)
 */
export function toBackendTA(ta: string): string {
  const normalized = normalizeTA(ta);
  return normalized
    .replace(" Ganjil", "-1")
    .replace(" Genap", "-2");
}
