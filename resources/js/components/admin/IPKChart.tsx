/**
 * IPKChart — Reusable area chart for IPK history
 * Used by: admin/MahasiswaDetail, prodi/MahasiswaDetail, student pages
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { IPKHistory } from "@/types";

interface IPKChartProps {
  data: IPKHistory[];
  /** Minimum IPK threshold line, default 3.0 */
  minIPK?: number;
  height?: number;
}

function CustomLegend() {
  return (
    <div className="flex items-center gap-3 justify-center mt-1">
      <span className="flex items-center gap-1.5 text-xs" style={{ color: "#64748B" }}>
        <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#263F93" }} />
        IPK
      </span>
      <span className="flex items-center gap-1.5 text-xs" style={{ color: "#64748B" }}>
        <span className="inline-block w-5 border-t-2 border-dashed border-amber-500" />
        Batas Min 3.0
      </span>
    </div>
  );
}

export function IPKChart({ data, minIPK = 3.0, height = 220 }: IPKChartProps) {
  const chartData = data.map((h) => ({ ...h, ipkVal: h.ipk }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="ipkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#263F93" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#263F93" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis
          dataKey="semester"
          tickFormatter={(v: number) => `Sem ${v}`}
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[2, 4]}
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
          formatter={(value) => [(Number(value) || 0).toFixed(2), "IPK"] as [string, string]}
          labelFormatter={(label) => `Semester ${label}`}
        />
        <ReferenceLine
          y={minIPK}
          stroke="#F59E0B"
          strokeDasharray="5 4"
          label={{ value: `Min ${minIPK}`, fontSize: 10, fill: "#B45309", position: "right" }}
        />
        <Area
          type="monotone"
          dataKey="ipk"
          stroke="#263F93"
          strokeWidth={2.5}
          fill="url(#ipkGrad)"
          dot={{ fill: "#263F93", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
        <Legend content={<CustomLegend />} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── IPK mini stats strip ────────────────────────────────────────────────────
interface IPKStatsStripProps {
  data: IPKHistory[];
}

export function IPKStatsStrip({ data }: IPKStatsStripProps) {
  if (!data.length) return null;
  const highest = data.reduce((a, b) => (a.ipk > b.ipk ? a : b));
  const lowest = data.reduce((a, b) => (a.ipk < b.ipk ? a : b));
  const avg = data.reduce((s, h) => s + h.ipk, 0) / data.length;

  const stats = [
    { label: "IPK Tertinggi", value: highest.ipk.toFixed(2), sub: `di Sem ${highest.semester}` },
    { label: "IPK Terendah",  value: lowest.ipk.toFixed(2),  sub: `di Sem ${lowest.semester}` },
    { label: "IPK Rata-rata", value: avg.toFixed(2),          sub: `dari ${data.length} semester` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ label, value, sub }) => (
        <div
          key={label}
          className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-center"
        >
          <div className="text-2xl font-700 text-gray-900">{value}</div>
          <div className="text-xs font-600 text-gray-700 mt-0.5">{label}</div>
          <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
        </div>
      ))}
    </div>
  );
}
