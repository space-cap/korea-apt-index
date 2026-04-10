import { api } from "@/lib/api";
import { ApiResponse, RankingData } from "@/types";
import RankingChart from "@/components/charts/RankingChart";

// Next.js 서버 컴포넌트: 검색 파라미터를 props로 받습니다.
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getRankingData(targetMonth: string) {
  try {
    // 서버 환경에서 FastAPI를 직접 호출합니다.
    const res = await api.get<ApiResponse<RankingData[]>>(`/api/ranking`, {
      params: { 
        target_month: targetMonth, 
        limit: 5 
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("데이터 호출 에러:", error);
    // 에러 발생 시 빈 배열 반환하여 클라이언트 에러 방지
    return [];
  }
}

export default async function Dashboard({ searchParams }: PageProps) {
  // searchParams에서 target_month 추출 (기본값 202603)
  const resolvedParams = await searchParams;
  const targetMonth = typeof resolvedParams.target_month === "string" 
    ? resolvedParams.target_month 
    : "202603";

  // SSR 단계에서 데이터 Fetch
  const data = await getRankingData(targetMonth);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 상단 웰컴 메시지 및 요약 (임시) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex justify-between items-center bg-gradient-to-tr from-white to-indigo-50">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 mb-2">
            지수 상승 지역 한눈에 보기
          </h1>
          <p className="text-slate-500">
            {targetMonth.slice(0, 4)}년 {targetMonth.slice(4)}월 기준 전국 주요 지역의 매매가격지수를 확인하세요.
          </p>
        </div>
      </div>

      {/* 메인 차트 카드 */}
      <div className="bg-white rounded-3xl shadow-md p-8 border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          🔥 가격지수 TOP 5 랭킹
        </h2>
        <div className="h-[400px] w-full">
          {/* 차트 시각화 부분만 클라이언트 컴포넌트로 렌더링 */}
          <RankingChart data={data} />
        </div>
      </div>

      {/* 추후 AI 조언 패널 영역을 위한 Placeholder */}
      <div className="bg-indigo-600 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 pointer-events-none blur-3xl"></div>
        <h2 className="text-2xl font-bold mb-4">✨ AI 시장 인사이트 (준비 중)</h2>
        <p className="text-indigo-100 italic">
          "해당 데이터들을 바탕으로 OpenAI를 연동하여 종합적인 시장 조언과 트렌드 분석 리포트를 제공할 예정입니다."
        </p>
      </div>
    </div>
  );
}