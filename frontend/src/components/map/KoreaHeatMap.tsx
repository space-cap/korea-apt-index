"use client";

import React, { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { RankingTableData } from "@/types";

interface KoreaHeatMapProps {
  data: RankingTableData[];
}

// TopoJSON URL
const TOPO_JSON_URL =
  "https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_provinces_topo_simple.json";

// TopoJSON의 긴 지역명을 백엔드의 짧은 지역명으로 매핑
const regionMapping: Record<string, string> = {
  제주특별자치도: "제주",
  경상남도: "경남",
  경상북도: "경북",
  전라남도: "전남",
  전라북도: "전북",
  충청남도: "충남",
  충청북도: "충북",
  경기도: "경기",
  강원도: "강원",
  세종특별자치시: "세종",
  울산광역시: "울산",
  대전광역시: "대전",
  광주광역시: "광주",
  인천광역시: "인천",
  대구광역시: "대구",
  부산광역시: "부산",
  서울특별시: "서울",
};

export default function KoreaHeatMap({ data }: KoreaHeatMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");

  // 시도(Provinces) 레벨 데이터만 필터링
  const validRegionNames = Object.values(regionMapping);
  const provincesData = useMemo(() => {
    return data.filter((item) => validRegionNames.includes(item.REGION_NAME));
  }, [data, validRegionNames]);

  // 최대 변동률(절대값)을 구해 색상 스케일의 도메인 설정
  const maxChange = useMemo(() => {
    if (provincesData.length === 0) return 1;
    const max = Math.max(...provincesData.map((d) => Math.abs(d.CHANGE_PCT)));
    return max === 0 ? 1 : max;
  }, [provincesData]);

  // D3 Color Scale (하락=Blue, 보합=연한 회색, 상승=Red)
  const colorScale = scaleLinear<string>()
    .domain([-maxChange, 0, maxChange])
    .range(["#2563eb", "#f8fafc", "#e11d48"]);

  // 특정 지역 정보 가져오기 헬퍼
  const getRegionData = (geoName: string) => {
    const mappedName = regionMapping[geoName] || geoName;
    return provincesData.find((d) => d.REGION_NAME === mappedName);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 4500,
          center: [127.5, 36.0], // 대한민국 중심 좌표
        }}
        width={600}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={TOPO_JSON_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoName = geo.properties.name;
              const regionData = getRegionData(geoName);
              
              // 변동률에 따른 색상 계산 (데이터 없으면 기본 회색)
              const changePct = regionData ? regionData.CHANGE_PCT : 0;
              const fillColor = regionData ? colorScale(changePct) : "#cbd5e1";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none", transition: "all 250ms" },
                    hover: { outline: "none", fill: "#4f46e5", cursor: "pointer", strokeWidth: 1.5 },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={() => {
                    if (regionData) {
                      const sign = changePct > 0 ? "+" : "";
                      setTooltipContent(`${regionData.REGION_NAME}: ${regionData.CURRENT_INDEX}pt (${sign}${changePct}%)`);
                    } else {
                      setTooltipContent(`${geoName}: 데이터 없음`);
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* 심플 커스텀 툴팁 */}
      {tooltipContent && (
        <div className="absolute top-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg pointer-events-none transform transition-opacity">
          {tooltipContent}
        </div>
      )}

      {/* 범례 (Legend) */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-sm text-xs font-bold text-slate-500">
        <div className="flex justify-between mb-1 px-1">
          <span className="text-blue-600">하락 (Blue)</span>
          <span className="text-slate-400">보합</span>
          <span className="text-rose-600">상승 (Red)</span>
        </div>
        <div className="w-48 h-3 rounded-full bg-gradient-to-r from-blue-600 via-slate-100 to-rose-600"></div>
        <div className="flex justify-between mt-1 px-1 text-[10px]">
          <span>-{maxChange.toFixed(2)}%</span>
          <span>+{maxChange.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}
