/**
 * SPProgressBadge — Visual SP1 → SP2 → SP3 progress indicator
 * Used in: admin/MahasiswaDetail, admin/SPList, admin/SPDetail, student/SPMahasiswa
 */

type SPLevel = "SP1" | "SP2" | "SP3";

interface SPProgressBadgeProps {
  level: SPLevel;
  /** Show as compact pill (default) or full progress chain */
  variant?: "pill" | "chain";
}

const LEVELS: SPLevel[] = ["SP1", "SP2", "SP3"];

const levelConfig: Record<SPLevel, { active: string; bg: string }> = {
  SP1: { active: "bg-amber-100 text-amber-700", bg: "bg-gray-100 text-gray-400" },
  SP2: { active: "bg-red-100 text-red-700",   bg: "bg-gray-100 text-gray-400" },
  SP3: { active: "bg-red-900/10 text-red-900", bg: "bg-gray-100 text-gray-400" },
};

/** Full chain: SP1 → SP2 → SP3, highlights active and past */
function SPChain({ level }: { level: SPLevel }) {
  const activeIdx = LEVELS.indexOf(level);
  return (
    <div className="flex items-center gap-1">
      {LEVELS.map((l, idx) => {
        const isPast   = idx < activeIdx;
        const isActive = idx === activeIdx;
        const cfg = levelConfig[l];
        return (
          <span
            key={l}
            className={`px-1.5 py-0.5 rounded text-xs font-500 ${
              (isActive || isPast) ? cfg.active : "bg-gray-50 text-gray-300"
            }`}
          >
            {l}
          </span>
        );
      })}
    </div>
  );
}

/** Simple pill badge just showing the current level */
function SPPill({ level }: { level: SPLevel }) {
  const colors: Record<SPLevel, string> = {
    SP1: "bg-amber-100 text-amber-700",
    SP2: "bg-red-100 text-red-700",
    SP3: "bg-red-900/10 text-red-900 font-700",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-500 ${colors[level]}`}>
      {level}
    </span>
  );
}

export function SPProgressBadge({ level, variant = "chain" }: SPProgressBadgeProps) {
  if (variant === "pill") return <SPPill level={level} />;
  return <SPChain level={level} />;
}

export type { SPLevel };
