import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 text-center min-w-0">
      {Icon && (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <Icon size={28} className="text-gray-300" />
        </div>
      )}
      <p className="text-sm sm:text-base font-500 text-gray-500 break-words">{title}</p>
      {description && <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xs break-words">{description}</p>}
      {action && <div className="mt-4 w-full sm:w-auto flex justify-center">{action}</div>}
    </div>
  );
}
