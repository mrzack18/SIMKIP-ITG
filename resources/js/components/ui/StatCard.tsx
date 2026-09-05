import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface StatCardProps {
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  label: string;
  value: string | number;
  sub?: string;
  subColorClass?: string;
  href?: string;
  hrefLabel?: string;
}

export function StatCard({
  icon: Icon,
  iconBgClass,
  iconColorClass,
  label,
  value,
  sub,
  subColorClass = "text-gray-400",
  href,
  hrefLabel = "Lihat",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-sm p-3 sm:p-4 min-w-0">
      <div className="flex items-center gap-3 mb-3 min-w-0">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
          <Icon size={18} className={iconColorClass} />
        </div>
        <p className="text-xs font-500 text-gray-500 leading-tight break-words min-w-0">{label}</p>
      </div>
      <p className="text-xl sm:text-2xl font-700 text-gray-800 break-words">{value}</p>
      {sub && <p className={`text-xs mt-1 break-words ${subColorClass}`}>{sub}</p>}
      {href && (
        <Link
          to={href}
          className="inline-flex items-center gap-1 mt-2 text-xs text-[#263F93] hover:underline font-500"
        >
          {hrefLabel} <ArrowUpRight size={11} />
        </Link>
      )}
    </div>
  );
}
