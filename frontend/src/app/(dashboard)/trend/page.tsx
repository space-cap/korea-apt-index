import { TrendingUp, Calendar, Map, Search } from "lucide-react";

export default function TrendPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. Header 섹션 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            지역별 트렌드 분석
          </h1>
          <p className="text-slate-500 text-sm mt-1">특정 지역의 시계열 변동 추이와 시장 흐름을 심층 분석합니다.</p>
        </div>
        
        {/* 필터 영역 (Placeholder) */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="지역 검색..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-colors">
            <Calendar className="w-4 h-4" />
            기간 설정
          </button>
        </div>
      </div>

      {/* 2. 메인 컨텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 사이드 영역: 최근 본 지역 / 인기 지역 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
              <Map className="w-4 h-4 text-slate-400" />
              인기 분석 지역
            </h3>
            <div className="space-y-2">
              {["서울 강남구", "경기 과천시", "인천 연수구", "세종특별자치시"].map((area) => (
                <button key={area} className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 메인 차트 영역 (Placeholder) */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="h-[500px] flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
               <TrendingUp className="w-8 h-8" />
            </div>
            <p className="font-medium">분석할 지역을 선택해 주세요.</p>
            <p className="text-xs mt-2">선택한 지역의 최근 5년간 매매가격지수 추이가 차트로 표시됩니다.</p>
            
            {/* 배경 차트 느낌의 데코레이션 */}
            <div className="absolute bottom-0 left-0 w-full opacity-[0.03] pointer-events-none">
               <svg viewBox="0 0 1000 100" className="w-full">
                 <path d="M0,80 Q150,20 300,50 T600,30 T900,70 L1000,60 L1000,100 L0,100 Z" fill="currentColor" />
               </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

