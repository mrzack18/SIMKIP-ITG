import { Search } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
    width?: string;
  }>;
  actions?: React.ReactNode;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  filters = [],
  actions,
}: SearchFilterProps) {
  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-2 min-w-0">
      {/* Search */}
      <div className="relative col-span-1 min-[480px]:col-span-2 lg:col-span-1 lg:flex-none min-w-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full lg:w-56 pl-9 pr-4 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 focus:border-[#263F93]/40 transition-colors min-w-0"
        />
      </div>

      {/* Filters */}
      {filters.map((filter, idx) => (
        <select
          key={idx}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className={`text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#263F93]/20 w-full sm:w-auto max-w-full min-w-0 truncate ${filter.width ?? ""}`}
        >
          {filter.placeholder && <option value="">{filter.placeholder}</option>}
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {/* Actions */}
      {actions}
    </div>
  );
}
