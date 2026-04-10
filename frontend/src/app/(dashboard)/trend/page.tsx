import { TrendingUp } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, Region } from "@/types";
import TrendAnalysisContainer from "@/components/trend/TrendAnalysisContainer";

async function getRegions() {
  try {
    const res = await api.get<ApiResponse<Region[]>>("/api/regions");
    return res.data.data || [];
  } catch (error) {
    console.error("지역 목록 호출 에러:", error);
    return [];
  }
}

export default async function TrendPage() {
  const regions = await getRegions();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* 1. Header 섹션 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-xl">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            지역별 트렌드 분석
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            대한민국 구석구석의 시계열 변동 추이와 시장 흐름을 데이터로 정밀 분석합니다.
          </p>
        </div>
        
        {/* 서비스 상태 요약 (고급스러운 대시보드 느낌) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">분석 대상 지역</p>
            <p className="text-xl font-black text-indigo-600">{regions.length} <span className="text-xs text-slate-600 font-medium">개</span></p>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">기준 기간</p>
            <p className="text-xl font-black text-slate-800">최근 5년</p>
          </div>
        </div>
      </div>

      {/* 2. 클라이언트 사이드 분석 컨테이너 (그리드 포함) */}
      <TrendAnalysisContainer initialRegions={regions} />
    </div>
  );
}


