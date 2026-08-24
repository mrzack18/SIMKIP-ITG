/**
 * MahasiswaSummaryCard — Card ringkasan mahasiswa
 * Used in: admin/MahasiswaList, widget on Dashboard
 */
import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";
import type { Mahasiswa } from "@/types";
import { SPProgressBadge } from "./SPProgressBadge";

interface MahasiswaSummaryCardProps {
  mahasiswa: Mahasiswa;
  /** Base route path for the detail link, e.g. '/admin' or '/prodi' */
  baseRoute?: string;
}

export function MahasiswaSummaryCard({
  mahasiswa,
  baseRoute = "/admin",
}: MahasiswaSummaryCardProps) {
  const initials = mahasiswa.nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const ipkColor =
    mahasiswa.ipk >= 3.5
      ? "text-green-600"
      : mahasiswa.ipk >= 3.0
      ? "text-blue-600"
      : "text-red-600";

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#263F93] flex items-center justify-center text-white text-sm font-600 flex-shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-600 text-gray-800 truncate">{mahasiswa.nama}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{mahasiswa.nim}</p>
            </div>
            <Link
              to={`${baseRoute}/mahasiswa/${mahasiswa.id}`}
              className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#263F93] transition-colors"
            >
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{mahasiswa.prodi}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-500">Ang. {mahasiswa.angkatan}</span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-700 ${ipkColor}`}>
                {mahasiswa.ipk.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400">IPK</span>
            </div>

            {mahasiswa.sp ? (
              <div className="flex items-center gap-1">
                <AlertTriangle size={11} className="text-amber-500" />
                <SPProgressBadge
                  level={mahasiswa.sp as "SP1" | "SP2" | "SP3"}
                  variant="pill"
                />
              </div>
            ) : (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                Normal
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
