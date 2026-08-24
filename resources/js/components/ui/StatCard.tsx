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
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgClass}`}>
          <Icon size={18} className={iconColorClass} />
        </div>
        <p className="text-xs font-500 text-gray-500 leading-tight">{label}</p>
      </div>
      <p className="text-3xl font-700 text-gray-800">{value}</p>
      {sub && <p className={`text-xs mt-1 ${subColorClass}`}>{sub}</p>}
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
