import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Korea APT Index Dashboard",
  description: "전국 아파트 매매가격지수 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* 사이드바는 왼쪽에 고정 배치됨 */}
        <Sidebar />
        
        {/* 오른쪽 메인 컨텐츠 영역 (사이드바 폭 64=16rem(256px) 만큼 여백) */}
        <div className="ml-64 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
