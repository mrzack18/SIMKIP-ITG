import { Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description?: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
        <Construction size={28} className="text-gray-400" />
      </div>
      <div className="text-center">
        <h2 className="font-display font-700 text-xl text-gray-700">{title}</h2>
        <p className="text-gray-400 text-sm mt-1">{description || "Halaman ini sedang dalam pengembangan."}</p>
      </div>
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-blue-600">
        <Construction size={14} />
        Akan segera tersedia — SIMKIP-ITG v1.0
      </div>
    </div>
  );
}
