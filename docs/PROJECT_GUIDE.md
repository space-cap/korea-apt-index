# 🏢 전국 아파트 매매지수 대시보드 (Korea APT Index)

이 문서는 AI 에이전트가 프로젝트의 전체 구조를 이해하고, 백엔드와 프론트엔드 간의 정합성을 유지하며 코드를 생성하기 위한 지침서입니다.

## 📁 프로젝트 구조 (Project Structure)
루트 폴더명: `korea-apt-index`
- **Backend**: `/backend` (FastAPI, Oracle DB)
- **Frontend**: `/frontend` (Next.js, Tailwind, Recharts)

## 🛠 기술 스택 (Tech Stack)
- **Database**: Oracle Cloud Autonomous Database (ADB)
- **Backend API**: Python 3.13+, FastAPI, python-oracledb
- **Frontend UI**: Next.js 16+ (App Router), TypeScript, Tailwind CSS, Recharts
- **Network**: Backend(Port 8000) <-> Frontend(Port 3000)

## 🗄 데이터베이스 스키마
1. **TB_REGION (지역 마스터)**
   - `REGION_ID` (PK, Identity)
   - `REGION_NAME`: '서울 중구', '경기 과천시' 등 계층형 이름
2. **TB_APT_PRICE_INDEX (매매가격지수)**
   - `INDEX_ID` (PK, Identity)
   - `REGION_ID` (FK)
   - `BASE_YYYYMM`: 연월 (YYYYMM 형식)
   - `INDEX_VALUE`: 매매가격지수 (Number)

## 📋 핵심 개발 규칙
1. **DB 연결**: `oracledb.create_pool`을 통한 커넥션 풀 사용 필수.
2. **ORA-12860 방지**: 데이터 적재 시 `ALTER SESSION DISABLE PARALLEL DML` 실행.
3. **API 응답**: JSON 형식으로 `{"status": "success", "data": [...]}` 형태를 유지한다.
4. **프론트엔드**: 모든 API 호출은 `axios`를 사용하며, 차트는 `recharts`로 시각화한다.

## 🚀 현재 진행 상황
- 데이터 마이그레이션 완료 (약 26,000건, 중복 및 결측치 처리 완료)
- FastAPI 기본 API 및 Next.js 대시보드 연동 완료 (TOP 5 랭킹 시각화)