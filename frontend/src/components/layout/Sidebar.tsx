"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, Map as MapIcon, ListOrdered, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "트렌드 분석", href: "/trend", icon: TrendingUp },
  { name: "시장 랭킹", href: "/ranking", icon: ListOrdered },
  { name: "전국 지도 뷰", href: "/map", icon: MapIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed top-0 left-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Home className="w-6 h-6" />
          <span>APT Index</span>
        </Link>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-500">
          <p className="font-semibold mb-1 text-slate-700">시스템 상태</p>
          <p>DB 연결: 정상 (10ms)</p>
          <p>마지막 업데이트: 오늘</p>
        </div>
      </div>
    </aside>
  );
}
