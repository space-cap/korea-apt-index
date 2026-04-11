"use client";

import React, { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { RankingTableData } from "@/types";
import { ArrowLeft } from "lucide-react";

interface KoreaHeatMapProps {
  data: RankingTableData[];
}

// TopoJSON URL 설정
const PROVINCES_TOPO_URL =
  "https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_provinces_topo_simple.json";
const MUNICIPALITIES_TOPO_URL =
  "https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_municipalities_topo_simple.json";

// 기본 전국 뷰 센터 및 스케일 (react-simple-maps ZoomableGroup 중심)
const NATIONAL_VIEW = { center: [127.5, 36.0] as [number, number], zoom: 1 };

// 전국 지도 각 시도의 지역 코드 프리픽스 및 매핑
const REGION_CODES: Record<string, string> = {
  "11": "서울",
  "21": "부산",
  "22": "대구",
  "23": "인천",
  "24": "광주",
  "25": "대전",
  "26": "울산",
  "29": "세종",
  "31": "경기",
  "32": "강원",
  "33": "충북",
  "34": "충남",
  "35": "전북",
  "36": "전남",
  "37": "경북",
  "38": "경남",
  "39": "제주",
};

// 지역별 줌(Zoom) 설정
const PROVINCE_CONFIG: Record<string, { center: [number, number]; zoom: number }> = {
  "11": { center: [126.98, 37.56], zoom: 6.5 },   // 서울
  "21": { center: [129.07, 35.17], zoom: 6.5 },   // 부산
  "22": { center: [128.60, 35.87], zoom: 6.5 },   // 대구
  "23": { center: [126.55, 37.50], zoom: 4.5 },   // 인천
  "24": { center: [126.85, 35.15], zoom: 7.5 },   // 광주
  "25": { center: [127.38, 36.35], zoom: 8.5 },   // 대전
  "26": { center: [129.28, 35.53], zoom: 6.5 },   // 울산
  "29": { center: [127.28, 36.55], zoom: 7.5 },   // 세종
  "31": { center: [127.25, 37.60], zoom: 2.2 },   // 경기
  "32": { center: [128.55, 37.75], zoom: 1.8 },   // 강원
  "33": { center: [127.75, 36.85], zoom: 2.2 },   // 충북
  "34": { center: [126.85, 36.55], zoom: 2.2 },   // 충남
  "35": { center: [127.15, 35.75], zoom: 2.2 },   // 전북
  "36": { center: [126.85, 34.85], zoom: 1.9 },   // 전남
  "37": { center: [128.75, 36.25], zoom: 1.8 },   // 경북
  "38": { center: [128.25, 35.35], zoom: 2.0 },   // 경남
  "39": { center: [126.55, 33.35], zoom: 4.5 },   // 제주
};

export default function KoreaHeatMap({ data }: KoreaHeatMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");
  // 선택된 시도 코드 (null 이면 전국 뷰)
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | null>(null);

  // 현재 지도의 Zoom 및 Center 포지션
  const currentView = selectedProvinceCode
    ? PROVINCE_CONFIG[selectedProvinceCode] || NATIONAL_VIEW
    : NATIONAL_VIEW;

  // D3 Color Scale 설정 (데이터가 있는 모든 지역의 최대 절대 변동률 계산)
  const maxChange = useMemo(() => {
    if (data.length === 0) return 1;
    const max = Math.max(...data.map((d) => Math.abs(d.CHANGE_PCT)));
    return max === 0 ? 1 : max;
  }, [data]);

  const colorScale = scaleLinear<string>()
    .domain([-maxChange, 0, maxChange])
    .range(["#2563eb", "#f8fafc", "#e11d48"]); // 파랑 -> 보합(연회색) -> 빨강

  // 헬퍼: 전국 시도 구역용 지역 데이터 찾기
  const getProvinceData = (geoCode: string) => {
    const provinceCode = geoCode.slice(0, 2);
    const shortName = REGION_CODES[provinceCode];
    if (!shortName) return null;
    return data.find((d) => d.REGION_NAME === shortName);
  };

  // 헬퍼: 시군구(하위지역) 구역용 데이터 찾기 로직 고도화
  const getMunicipalityData = (geoCode: string, geoName: string) => {
    const provinceCode = geoCode.slice(0, 2);
    const provinceShortName = REGION_CODES[provinceCode] || "";
    
    // 1순위: "지역명" 정확히 일치 (예: "강남구")
    // 2순위: "시도명 지역명" 일치 (예: "부산 중구")
    // 3순위: DB REGION_NAME이 해당 지역명으로 끝나는 경우 (예: "경기 성남시 분당구".endsWith("분당구"))
    let rData = data.find(
      (d) =>
        d.REGION_NAME === geoName ||
        d.REGION_NAME === `${provinceShortName} ${geoName}` ||
        d.REGION_NAME.endsWith(` ${geoName}`)
    );

    // 4순위: 화성시 같이 띄어쓰기가 없는 경우 ("용인시수지구" -> "용인시 수지구" 매칭용)
    if (!rData) {
      const strippedGeo = geoName.replace(/\s+/g, "");
      rData = data.find((d) => d.REGION_NAME.replace(/\s+/g, "").endsWith(strippedGeo));
    }
    return rData;
  };

  // 구역 클릭 시 핸들러
  const handleGeographyClick = (geoCode: string) => {
    const provinceCode = geoCode.slice(0, 2);
    if (!selectedProvinceCode) {
      // 전국 뷰 -> 시/도 뷰 드릴다운
      setSelectedProvinceCode(provinceCode);
    }
    // 이미 시/도 뷰일 경우에는 추후 추가 기능(차트 팝업 등)을 위해 클릭만 방치
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      
      {/* 줌/드릴다운 작동 시 전체 보기(리셋) 버튼 제공 */}
      {selectedProvinceCode && (
        <button
          onClick={() => setSelectedProvinceCode(null)}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          전국 보기
        </button>
      )}

      {/* 대한민국 동적 지도 랜더러 */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 4500 }}
        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      >
        <ZoomableGroup center={currentView.center} zoom={currentView.zoom}>
          
          {/* 전국 시도 렌더링 파트 */}
          <Geographies geography={PROVINCES_TOPO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoCode = geo.properties.code;
                const rData = getProvinceData(geoCode);
                
                // 드릴다운 모드일 때 선택된 시도가 아니면 희미하게 표시하고 이벤트를 끕니다
                if (selectedProvinceCode && geoCode.slice(0,2) !== selectedProvinceCode) {
                   return (
                     <Geography
                       key={`prov-${geo.rsmKey}`}
                       geography={geo}
                       fill="#f1f5f9"
                       stroke="#e2e8f0"
                       strokeWidth={0.5}
                     />
                   );
                }

                // 드릴다운 된 상태의 '배경'으로는 선택된 시도를 투명하게 유지
                if (selectedProvinceCode && geoCode.slice(0,2) === selectedProvinceCode) {
                   return null; // 아래에서 시군구 데이터가 이 자리를 대신 렌더링함
                }

                // 일반 전국 뷰 렌더링
                const changePct = rData ? rData.CHANGE_PCT : 0;
                const fill = rData ? colorScale(changePct) : "#cbd5e1";
                const sign = changePct > 0 ? "+" : "";
                
                return (
                  <Geography
                    key={`prov-${geo.rsmKey}`}
                    geography={geo}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none", transition: "all 0.3s" },
                      hover: { outline: "none", strokeWidth: 1.5, cursor: "pointer", filter: "brightness(0.95)" },
                      pressed: { outline: "none" },
                    }}
                    onClick={() => handleGeographyClick(geoCode)}
                    onMouseEnter={() => {
                      setTooltipContent(rData ? `${rData.REGION_NAME}: ${rData.CURRENT_INDEX}pt (${sign}${changePct}%)` : `${geo.properties.name_eng}: 데이터 없음`);
                    }}
                    onMouseLeave={() => setTooltipContent("")}
                  />
                );
              })
            }
          </Geographies>

          {/* 시군구 상세 렌더링 파트 (특정 지역이 선택되었을 때만 그 지역에 해당하는 시군구 출력) */}
          {selectedProvinceCode && (
            <Geographies geography={MUNICIPALITIES_TOPO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoCode = geo.properties.code as string;
                  const geoName = geo.properties.name;
                  
                  // 선택된 시도 코드와 일치하는 시군구만 렌더링
                  if (!geoCode.startsWith(selectedProvinceCode)) return null;

                  const rData = getMunicipalityData(geoCode, geoName);
                  const changePct = rData ? rData.CHANGE_PCT : 0;
                  const fill = rData ? colorScale(changePct) : "#e2e8f0"; // 데이터 없으면 연회색
                  const sign = changePct > 0 ? "+" : "";

                  return (
                    <Geography
                      key={`muni-${geo.rsmKey}`}
                      geography={geo}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth={0.3} // 확대되었으므로 선을 얇게
                      style={{
                        default: { outline: "none", transition: "all 0.4s" },
                        hover: { outline: "none", filter: "brightness(0.9)", cursor: "pointer", strokeWidth: 0.8 },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={() => {
                        setTooltipContent(rData ? `${rData.REGION_NAME}: ${rData.CURRENT_INDEX}pt (${sign}${changePct}%)` : `${geoName}: 데이터 없음`);
                      }}
                      onMouseLeave={() => setTooltipContent("")}
                    />
                  );
                })
              }
            </Geographies>
          )}

        </ZoomableGroup>
      </ComposableMap>

      {/* 심플 커스텀 툴팁 */}
      {tooltipContent && (
        <div className="absolute top-4 right-4 z-30 bg-slate-900/90 backdrop-blur-sm text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-xl pointer-events-none transform transition-opacity flex items-center gap-3">
          <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: tooltipContent.includes('+') ? '#f43f5e' : tooltipContent.includes('-') ? '#3b82f6' : '#94a3b8' }}></span>
          {tooltipContent}
        </div>
      )}

      {/* 범례 (Legend) */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-xl text-xs font-bold text-slate-500">
        <div className="flex justify-between mb-2 px-1">
          <span className="text-blue-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span>하락</span>
          <span className="text-slate-400">보합</span>
          <span className="text-rose-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-600"></span>상승</span>
        </div>
        <div className="w-56 h-3 rounded-full bg-gradient-to-r from-blue-600 via-slate-100 to-rose-600"></div>
        <div className="flex justify-between mt-2 px-1 text-[10px] tracking-wider">
          <span>-{maxChange.toFixed(2)}%</span>
          <span>+{maxChange.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}
