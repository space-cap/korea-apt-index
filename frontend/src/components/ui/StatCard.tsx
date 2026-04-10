import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-bold px-2 py-1 rounded-lg",
            trend === "up" ? "bg-rose-50 text-rose-500" : 
            trend === "down" ? "bg-blue-50 text-blue-500" : 
            "bg-slate-50 text-slate-500"
          )}>
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "•"} {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
        </div>
        {description && <p className="text-xs text-slate-400 mt-2">{description}</p>}
      </div>
    </div>
  );
}
