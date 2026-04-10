"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendPoint } from "@/types";

interface TrendLineChartProps {
  data: TrendPoint[];
}

export default function TrendLineChart({ data }: TrendLineChartProps) {
  // 날짜 포맷팅 (YYYYMM -> YY/MM)
  const formatData = data.map((d) => ({
    ...d,
    dateLabel: `${d.BASE_YYYYMM.slice(2, 4)}/${d.BASE_YYYYMM.slice(4)}`,
  }));

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 italic">
        데이터가 충분하지 않습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={formatData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="dateLabel"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          minTickGap={30}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "12px",
          }}
          labelStyle={{ fontWeight: "bold", marginBottom: "4px", color: "#1e293b" }}
          itemStyle={{ color: "#4f46e5", fontWeight: "bold" }}
        />
        <Area
          type="monotone"
          dataKey="INDEX_VALUE"
          name="매매지수"
          stroke="#4f46e5"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorIndex)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
