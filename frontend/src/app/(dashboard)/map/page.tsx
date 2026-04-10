import { api } from "@/lib/api";
import { ApiResponse, RankingTableData } from "@/types";
import { MapPin } from "lucide-react";
import KoreaHeatMap from "@/components/map/KoreaHeatMap";

async function getRankingFull(targetMonth: string) {
  try {
    const res = await api.get<ApiResponse<RankingTableData[]>>("/api/ranking/full", {
      params: { target_month: targetMonth },
    });
    return res.data.data || [];
  } catch (error) {
    console.error("전체 랭킹 데이터 호출 에러:", error);
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MapPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const targetMonth = typeof resolvedParams.target_month === "string" 
    ? resolvedParams.target_month 
    : "202603";

  const data = await getRankingFull(targetMonth);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* 1. 헤더 섹션 */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-3xl opacity-60"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-500" />
              </div>
              전국 히트맵 분석
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              전월 대비 변동률을 시각화하여 현재 대한민국 부동산 시장의 뜨거운 지역과 차가운 지역을 한눈에 조망합니다.
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

      {/* 2. 지도 컨테이너 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 설명 및 지표 요약 패널 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              분석 가이드
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              지도상의 색상은 <strong className="text-slate-800">전월 대비 매매지수 변동률</strong>을 나타냅니다. 
              상승 폭이 큰 지역일수록 진한 붉은색, 하락 폭이 큰 지역일수록 진한 푸른색으로 표시됩니다.
            </p>
            
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">최고 상승</span>
                <span className="text-rose-600 font-bold">Red</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">강보합</span>
                <span className="text-slate-400 font-bold">Gray</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">최대 하락</span>
                <span className="text-blue-600 font-bold">Blue</span>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 지도 영역 */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative h-[650px] overflow-hidden">
          <KoreaHeatMap data={data} />
        </div>
      </div>
    </div>
  );
}
