"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

// Suspense 경고 방지를 위한 별도 컴포넌트
function HeaderSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // 기본값을 202603으로 설정 (URL 파라미터가 없으면 202603을 기본값으로 사용)
  const currentMonth = searchParams.get("target_month") || "202603";

  // 월을 변경하면 URL 쿼리 파라미터를 갱신하여 서버 컴포넌트들이 데이터를 재요청하도록 함
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("target_month", newMonth);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-slate-500">기준 연월</span>
      <select
        value={currentMonth}
        onChange={handleMonthChange}
        className="block w-40 pl-3 pr-10 py-2 text-base border-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white"
      >
        {/* 임시 하드코딩 옵션 (나중에 동적 데이터로 변경 가능) */}
        <option value="202603">2026년 03월</option>
        <option value="202602">2026년 02월</option>
        <option value="202601">2026년 01월</option>
        <option value="202512">2025년 12월</option>
      </select>
    </div>
  );
}

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-slate-800">Korea APT Index</h2>
      </div>
      
      <Suspense fallback={<div className="text-sm text-slate-400">필터 로딩 중...</div>}>
         <HeaderSelect />
      </Suspense>
    </header>
  );
}
