import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { Modal } from "./Modal";

interface Props {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

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

  const options = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    // Determine the max academic year strictly based on the current real-world date.
    // If we are in Jan 2026, the academic year is 2025/2026 Ganjil.
    // If we are in Feb-Aug 2026, the academic year is 2025/2026 Genap.
    // If we are in Sep-Dec 2026, the academic year is 2026/2027 Ganjil.

    let maxStartYear = currentYear;
    let maxSemester = 1; // 1 = Ganjil, 2 = Genap

    if (currentMonth === 1) {
        maxStartYear = currentYear - 1;
        maxSemester = 1;
    } else if (currentMonth >= 2 && currentMonth <= 8) {
        maxStartYear = currentYear - 1;
        maxSemester = 2;
    } else {
        maxStartYear = currentYear;
        maxSemester = 1;
    }

    const startYear = 2022;
    const opts: string[] = []; 

    for (let y = maxStartYear; y >= startYear; y--) {
      // If we are on the max year, only push up to the max semester
      if (y === maxStartYear) {
          if (maxSemester === 2) {
              opts.push(`Tahun ${y}/${y + 1}-2`);
          }
          opts.push(`Tahun ${y}/${y + 1}-1`);
      } else {
          opts.push(`Tahun ${y}/${y + 1}-2`);
          opts.push(`Tahun ${y}/${y + 1}-1`);
      }
    }

    // Deduplicate and sort descending
    return Array.from(new Set(opts)).sort().reverse();
  }, []);

  const displayLabel = formatTahunAjaran(value);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-xl shadow-sm transition-colors ${className}`}
      >
        <Calendar size={16} className="text-[#263F93]" />
        <span className="text-[#263F93]">{displayLabel}</span>
        <svg className="w-3 h-3 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Filter Tahun Akademik" width="max-w-sm">
        <div className="space-y-2">
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
