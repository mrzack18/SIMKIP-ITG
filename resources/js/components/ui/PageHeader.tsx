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
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        {(backTo !== undefined || onBack) && (
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white hover:bg-gray-50 transition-colors text-gray-500"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[#263F93]/10 flex items-center justify-center">
            <Icon size={18} className="text-[#263F93]" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-700 text-xl text-gray-900">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
