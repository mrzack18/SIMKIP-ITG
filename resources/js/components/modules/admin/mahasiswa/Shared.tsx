import { AlertTriangle } from "lucide-react"

export function BackendNotReady({ feature }: { feature: string }) {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl min-w-0">
      <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <h4 className="text-xs sm:text-sm font-semibold text-amber-800 mb-1 break-words">Fitur Belum Tersedia</h4>
        <p className="text-xs text-amber-700 leading-relaxed break-words">
          Modul <strong>{feature}</strong> belum tersedia di backend (mock).
          Kembali lagi nanti.
        </p>
      </div>
    </div>
  )
}
