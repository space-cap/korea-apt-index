"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// API 데이터 구조 정의
interface RankingData {
  REGION_NAME: string;
  INDEX_VALUE: number;
}

export default function Dashboard() {
  const [data, setData] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 백엔드 FastAPI 서버에서 2026년 3월 TOP 5 데이터를 가져옵니다.
        const response = await axios.get("http://127.0.0.1:8000/api/ranking?target_month=202603&limit=5");
        setData(response.data.data);
      } catch (error) {
        console.error("데이터 호출 에러:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">

        {/* 상단 타이틀 섹션 */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600 mb-2">
            PRO 부동산 대시보드
          </h1>
          <p className="text-slate-500 text-lg">전국 아파트 매매가격지수 TOP 5 지역 (2026년 03월)</p>
        </header>

        {/* 메인 콘텐츠 카드 */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
          {loading ? (
            <div className="h-80 flex items-center justify-center text-indigo-400 font-bold animate-pulse">
              FastAPI 서버에서 데이터를 가져오는 중... 🚀
            </div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 20, right: 60, left: 40, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[100, 'dataMax + 10']} hide />
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
            </div>
          )}
        </div>

        {/* 하단 정보 섹션 */}
        <footer className="mt-8 text-center text-slate-400 text-sm">
          Oracle Cloud ADB + FastAPI + Next.js Stack
        </footer>
      </div>
    </div>
  );
}