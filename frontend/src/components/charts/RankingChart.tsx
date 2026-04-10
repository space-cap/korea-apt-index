"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { RankingData } from "@/types";

interface RankingChartProps {
  data: RankingData[];
}

export default function RankingChart({ data }: RankingChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
        <p>데이터가 없습니다.</p>
        <p className="text-sm mt-2">선택하신 조건에 해당하는 데이터가 서버에 없을 수 있습니다.</p>
      </div>
    );
  }

  // 지수 값의 최솟값 계산 (X축 시작점을 데이터에 맞추기 위함)
  const minValue = Math.min(...data.map(d => d.INDEX_VALUE));
  const minDomain = Math.floor(minValue - 5); // 조금 더 여유있게

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 60, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
        <XAxis type="number" domain={[minDomain, 'dataMax + 5']} hide />
        <YAxis
          dataKey="REGION_NAME"
          type="category"
          tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
          width={100}
        />
        <Tooltip
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
        />
        <Bar
          dataKey="INDEX_VALUE"
          radius={[0, 10, 10, 0]}
          barSize={45}
          label={{ position: 'right', fill: '#6366f1', fontWeight: 800, fontSize: 16 }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
