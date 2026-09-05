import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  /** Custom back handler instead of navigate */
  onBack?: () => void;
  actions?: React.ReactNode;
  icon?: LucideIcon;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  onBack,
  actions,
  icon: Icon,
  badge,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        {(backTo !== undefined || onBack) && (
          <button
            onClick={handleBack}
            aria-label="Kembali"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white hover:bg-gray-50 transition-colors text-gray-500 flex-shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {Icon && (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-[#263F93]" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-display font-700 text-lg sm:text-xl text-gray-900 leading-tight break-words min-w-0">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 break-words">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">{actions}</div>}
    </div>
  );
}
