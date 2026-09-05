import { Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description?: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4 px-4 py-10 text-center min-w-0">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
        <Construction size={28} className="text-gray-400" />
      </div>
      <div className="min-w-0">
        <h2 className="font-display font-700 text-lg sm:text-xl text-gray-700 break-words">{title}</h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 break-words">{description || "Halaman ini sedang dalam pengembangan."}</p>
      </div>
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-blue-600 max-w-full">
        <Construction size={14} className="flex-shrink-0" />
        <span className="break-words">Akan segera tersedia — SIMKIP-ITG v1.0</span>
      </div>
    </div>
  );
}
