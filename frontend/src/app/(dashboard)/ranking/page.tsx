import { api } from "@/lib/api";
import { ApiResponse, RankingTableData } from "@/types";
import MarketRankingTable from "@/components/ranking/MarketRankingTable";
import { Trophy } from "lucide-react";

async function getRankingFull(targetMonth: string) {
  try {
    const res = await api.get<ApiResponse<RankingTableData[]>>("/api/ranking/full", {
      params: { target_month: targetMonth },
    });
    return {
      data: res.data.data || [],
      natAvg: res.data.nat_avg || 0
    };
  } catch (error) {
    console.error("전체 랭킹 호출 에러:", error);
    return { data: [], natAvg: 0 };
  }
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RankingPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const targetMonth = typeof resolvedParams.target_month === "string" 
    ? resolvedParams.target_month 
    : "202603";

  const { data, natAvg } = await getRankingFull(targetMonth);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* 1. 헤더 섹션 */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 blur-3xl opacity-60"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="bg-amber-50 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              전국 시장 랭킹
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              대한민국 전역의 지수 변동 현황을 한눈에 비교하고 분석할 수 있는 데이터 시트입니다.
            </p>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">기준 연월</p>
            <p className="text-lg font-black text-slate-800">
              {targetMonth.slice(0, 4)}년 {targetMonth.slice(4)}월
            </p>
          </div>
        </div>
      </div>

      {/* 2. 랭킹 테이블 (클라이언트 컴포넌트) */}
      <MarketRankingTable data={data} natAvg={natAvg} />
      
      <p className="text-center text-xs text-slate-400 pb-8">
        * 본 데이터는 국토교통부 실거래가 기반으로 산출된 매매가격지수 통계 자료입니다.
      </p>
    </div>
  );
}
