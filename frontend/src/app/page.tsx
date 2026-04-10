"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, BrainCircuit, LineChart, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-white font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -ml-[40rem] -mt-[10rem] w-[80rem] h-[40rem] bg-indigo-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50rem] h-[30rem] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation (Landing Only) */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">APT Index Pro</span>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            로그인
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Korea Real Estate AI Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400">
            데이터로 읽는<br />부동산의 미래
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
            전국 아파트 매매가격지수를 한눈에 파악하세요. 복잡한 수치와 차트 뒤에 숨은 흐름을 OpenAI 기술이 분석하여 직관적인 인사이트를 제공합니다.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-all bg-indigo-600 rounded-2xl hover:bg-indigo-500 hover:shadow-xl hover:-translate-y-0.5 hover:shadow-indigo-500/30 overflow-hidden"
            >
              <span className="relative z-10">대시보드 시작하기</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-8 pt-12 border-t border-slate-800">
            <div>
              <div className="bg-slate-800/50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-slate-700">
                <BarChart3 className="text-blue-400 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white mb-2">실시간 시장 트렌드</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                2만 건以上の 방대한 데이터베이스를 통해 지역별 상승 및 하락 랭킹을 즉시 시각화합니다.
              </p>
            </div>
            <div>
              <div className="bg-slate-800/50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-slate-700">
                <BrainCircuit className="text-indigo-400 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white mb-2">AI 기반 인사이트</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                OpenAI가 추세를 분석하여 복잡한 차트를 쉽고 명쾌한 조언으로 번역하여 제공합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Graphic */}
        <div className="relative lg:h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-[3rem] blur-2xl"></div>
          {/* We are using traditional img here to avoid Next.js Image config errors with unconfigured domains for now, but since it's local, next/image works fine. */}
          <div className="relative w-full h-[400px] lg:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/50 border border-slate-800">
            {/* 3D Glassmorphism Graphic placeholder */}
            <Image
              src="/hero_real_estate.png"
              alt="Real Estate Analytics Abstract 3D"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Glass Overlay Elements */}
            <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">서울 아파트 지수</p>
                  <p className="font-bold text-white text-lg">+ 2.45% 돌파</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
