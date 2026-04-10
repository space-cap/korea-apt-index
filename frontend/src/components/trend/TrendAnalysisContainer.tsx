"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Map, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { ApiResponse, Region, TrendPoint } from "@/types";
import TrendLineChart from "../charts/TrendLineChart";
import { cn } from "@/lib/utils";

interface TrendAnalysisContainerProps {
  initialRegions: Region[];
}

type Period = "1Y" | "3Y" | "5Y" | "ALL";

export default function TrendAnalysisContainer({ initialRegions }: TrendAnalysisContainerProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<Period>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // 지역 목록 필터링 (검색어 기준)
  const filteredRegions = useMemo(() => {
    if (!searchQuery) return initialRegions;
    return initialRegions.filter((r) =>
      r.REGION_NAME.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, initialRegions]);

  // 인기 지역 (전시용)
  const popularRegions = initialRegions.slice(0, 5);

  const fetchTrendData = async (regionId: number) => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<TrendPoint[]>>(`/api/trend/${regionId}`);
      setTrendData(res.data.data || []);
    } catch (error) {
      console.error("트렌드 데이터 조회 에러:", error);
      setTrendData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    fetchTrendData(region.REGION_ID);
  };

  // 기간에 따른 데이터 필터링
  const displayData = useMemo(() => {
    if (!trendData.length) return [];
    if (period === "ALL") return trendData;

    const monthsToSubtract = {
      "1Y": 12,
      "3Y": 36,
      "5Y": 60,
    }[period];

    // 현재 시스템 날짜 기준이 아니라 전체 데이터의 마지막 날짜 기준으로 역산
    return trendData.slice(-monthsToSubtract);
  }, [trendData, period]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* 1. 사이드바: 지역 목록 (리스트 방식) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-[650px]">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="지역 검색..."
              className="w-full bg-transparent border-none text-sm focus:ring-0 placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="font-bold text-slate-800 mb-3 px-2 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Map className="w-3 h-3 text-indigo-500" />
              지역 리스트
            </h3>
            <div className="space-y-1">
              {filteredRegions.map((region) => (
                <button
                  key={region.REGION_ID}
                  onClick={() => handleRegionSelect(region)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center justify-between group",
                    selectedRegion?.REGION_ID === region.REGION_ID
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <span className="font-medium">{region.REGION_NAME}</span>
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      selectedRegion?.REGION_ID === region.REGION_ID
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 메인: 차트 영역 */}
      <div className="lg:col-span-3 space-y-6">
        {/* 상단 툴바 (기간 버튼) */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            {selectedRegion ? (
              <h2 className="text-xl font-bold text-slate-800">
                {selectedRegion.REGION_NAME} <span className="text-indigo-600">지수 추이</span>
              </h2>
            ) : (
              <h2 className="text-xl font-bold text-slate-400 italic">분석할 지역을 선택해 주세요</h2>
            )}
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["1Y", "3Y", "5Y", "ALL"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  period === p
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {p === "ALL" ? "전체" : p}
              </button>
            ))}
          </div>
        </div>

        {/* 차트 캔버스 */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative h-[500px]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
              <p className="font-medium">데이터를 분석 중입니다...</p>
            </div>
          ) : selectedRegion ? (
            <TrendLineChart data={displayData} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                <Calendar className="w-10 h-10" />
              </div>
              <p className="font-semibold text-lg">데이터 탐색 준비 완료</p>
              <p className="text-sm mt-1">좌측 리스트에서 분석을 시작할 지역을 클릭해 주세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
