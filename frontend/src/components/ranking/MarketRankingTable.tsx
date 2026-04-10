"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpRight, ArrowDownRight, Minus, ChevronUp, ChevronDown } from "lucide-react";
import { RankingTableData } from "@/types";
import { cn } from "@/lib/utils";

interface MarketRankingTableProps {
  data: RankingTableData[];
  natAvg: number;
}

type SortConfig = {
  key: keyof RankingTableData;
  direction: "asc" | "desc";
};

export default function MarketRankingTable({ data, natAvg }: MarketRankingTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "CHANGE_PCT",
    direction: "desc",
  });

  // 정렬 처리
  const handleSort = (key: keyof RankingTableData) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  // 검색 및 정렬된 데이터 계산
  const processedData = useMemo(() => {
    let result = [...data];

    // 필터링
    if (searchQuery) {
      result = result.filter((item) =>
        item.REGION_NAME.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    result.sort((a, b) => {
      const aValue = a[sortConfig.key] || 0;
      const bValue = b[sortConfig.key] || 0;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [data, searchQuery, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: keyof RankingTableData }) => {
    if (sortConfig.key !== columnKey) return <div className="w-4 h-4 opacity-0 group-hover:opacity-30 transition-opacity"><ChevronUp size={14} /></div>;
    return sortConfig.direction === "asc" ? <ChevronUp size={14} className="text-indigo-600" /> : <ChevronDown size={14} className="text-indigo-600" />;
  };

  return (
    <div className="space-y-6">
      {/* 1. 상단 컨트롤 바 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="지역 이름으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-2xl">
          <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            전국 평균 지수: <span className="text-indigo-600 ml-1">{natAvg} pt</span>
          </div>
        </div>
      </div>

      {/* 2. 테이블 영역 */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th 
                  onClick={() => handleSort("REGION_NAME")}
                  className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">지역명 <SortIcon columnKey="REGION_NAME" /></div>
                </th>
                <th 
                  onClick={() => handleSort("CURRENT_INDEX")}
                  className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group text-right"
                >
                  <div className="flex items-center justify-end gap-1">매매지수 <SortIcon columnKey="CURRENT_INDEX" /></div>
                </th>
                <th 
                  onClick={() => handleSort("CHANGE_PCT")}
                  className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group text-right"
                >
                  <div className="flex items-center justify-end gap-1">전월대비 <SortIcon columnKey="CHANGE_PCT" /></div>
                </th>
                <th 
                  onClick={() => handleSort("AVG_DIFF")}
                  className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group text-right"
                >
                  <div className="flex items-center justify-end gap-1">평균대비 <SortIcon columnKey="AVG_DIFF" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processedData.length > 0 ? (
                processedData.map((item, index) => (
                  <tr key={item.REGION_NAME} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-300 w-6">{(index + 1).toString().padStart(2, '0')}</span>
                        <span className="text-sm font-semibold text-slate-700">{item.REGION_NAME}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-slate-900">{item.CURRENT_INDEX.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                        item.CHANGE_PCT > 0 ? "text-rose-600 bg-rose-50" : 
                        item.CHANGE_PCT < 0 ? "text-blue-600 bg-blue-50" : 
                        "text-slate-500 bg-slate-50"
                      )}>
                        {item.CHANGE_PCT > 0 ? <ArrowUpRight size={14} /> : 
                         item.CHANGE_PCT < 0 ? <ArrowDownRight size={14} /> : 
                         <Minus size={14} />}
                        {Math.abs(item.CHANGE_PCT).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-sm font-bold",
                        item.AVG_DIFF > 0 ? "text-rose-500" : 
                        item.AVG_DIFF < 0 ? "text-blue-500" : 
                        "text-slate-400"
                      )}>
                        {item.AVG_DIFF > 0 ? "+" : ""}{item.AVG_DIFF.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
