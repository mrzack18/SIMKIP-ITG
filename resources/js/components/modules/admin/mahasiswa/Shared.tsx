import { AlertTriangle } from "lucide-react"

export function BackendNotReady({ feature }: { feature: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-amber-800 mb-1">Fitur Belum Tersedia</h4>
        <p className="text-xs text-amber-700 leading-relaxed">
          Modul <strong>{feature}</strong> belum tersedia di backend (mock).
          Kembali lagi nanti.
        </p>
      </div>
    </div>
  )
}
