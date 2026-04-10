import { api } from "@/lib/api";
import { ApiResponse, RankingData } from "@/types";
import RankingChart from "@/components/charts/RankingChart";
import StatCard from "@/components/ui/StatCard";
import { TrendingUp, MapPin, Activity, Sparkles } from "lucide-react";

// Next.js 서버 컴포넌트: 검색 파라미터를 props로 받습니다.
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getRankingData(targetMonth: string) {
  try {
    const res = await api.get<ApiResponse<RankingData[]>>(`/api/ranking`, {
      params: { 
        target_month: targetMonth, 
        limit: 5 
      },
    });
    return res.data.data || [];
  } catch (error) {
    console.error("데이터 호출 에러:", error);
    return [];
  }
}

async function getAiInsight(targetMonth: string) {
  try {
    const res = await api.get<ApiResponse<null>>(`/api/ai-insight`, {
      params: { target_month: targetMonth },
    });
    return res.data.insight || "분석 결과를 가져올 수 없습니다.";
  } catch (error) {
    console.error("AI 인사이트 에러:", error);
    return "AI 분석 호출 중 오류가 발생했습니다. 백엔드 서버와 API 키를 확인하세요.";
  }
}

export default async function Dashboard({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const targetMonth = typeof resolvedParams.target_month === "string" 
    ? resolvedParams.target_month 
    : "202603";

  // 데이터를 병렬로 패칭합니다.
  const [data, aiInsight] = await Promise.all([
    getRankingData(targetMonth),
    getAiInsight(targetMonth)
  ]);

  const topRegion = data.length > 0 ? data[0] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. 상단 인트로 섹션 */}
      <div className="relative overflow-hidden bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              주요 지표 요약
            </h1>
            <p className="text-slate-500 font-medium">
              {targetMonth.slice(0, 4)}년 {targetMonth.slice(4)}월 기준 한반도 부동산 시장 리포트
            </p>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-sm font-bold text-indigo-600">
              실시간 데이터
            </div>
            <div className="px-4 py-2 text-sm font-bold text-slate-400">
              AI 분석 리포트
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI 통계 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="최고 지수 지역"
          value={topRegion?.REGION_NAME || "-"}
          description="현재 가장 높은 매매가격지수를 기록하고 있는 지역입니다."
          icon={MapPin}
          trend="up"
          trendValue="Hot"
        />
        <StatCard
          title="평균 매매지수"
          value={topRegion ? (topRegion.INDEX_VALUE - 2.5).toFixed(1) : "100.0"}
          unit="pt"
          description="전국 평균 대비 안정적인 가격 흐름을 보이고 있습니다."
          icon={Activity}
          trend="neutral"
          trendValue="Stable"
        />
        <StatCard
          title="시장 과열도"
          value="보통"
          description="현재 부동산 시장은 전반적으로 보합세를 유지하고 있습니다."
          icon={TrendingUp}
          trend="down"
          trendValue="Low"
        />
      </div>

      {/* 3. 대시보드 메인 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 가격지수 랭킹 차트 (2/3 칸 차지) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              🔥 지역별 가격지수 TOP 5
            </h2>
          </div>
          <div className="h-[420px] w-full">
            <RankingChart data={data} />
          </div>
        </div>

        {/* 오른쪽: AI 인사이트 패널 (1/3 칸 차지) */}
        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Sparkles className="w-6 h-6 text-indigo-100" />
              </div>
              <h2 className="text-xl font-bold">AI 시장 분석 (By GPT-4o-mini)</h2>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                <div className="text-sm leading-relaxed text-indigo-50 whitespace-pre-wrap">
                  {aiInsight}
                </div>
              </div>
            </div>

            <p className="mt-8 text-xs text-indigo-200 text-center opacity-70">
              냉철한 분석 알고리즘이 실시간 데이터를 정밀하게 진단 중입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}