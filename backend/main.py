import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import oracledb
from dotenv import load_dotenv
from openai import OpenAI

# 환경 변수 로드
load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_DSN = os.getenv("DB_DSN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=OPENAI_API_KEY)

# 전역 커넥션 풀 변수
db_pool = None

# --- 1. 서버 라이프사이클 관리 (시작할 때 풀 생성, 꺼질 때 풀 반환) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_pool
    try:
        # 최소 2개, 최대 10개의 커넥션을 유지하는 풀 생성
        db_pool = oracledb.create_pool(
            user=DB_USER,
            password=DB_PASSWORD,
            dsn=DB_DSN,
            min=2,
            max=10,
            increment=1
        )
        print("✅ 오라클 DB 커넥션 풀 생성 완료!")
        yield
    finally:
        if db_pool:
            db_pool.close()
            print("🛑 오라클 DB 커넥션 풀 종료")

# --- 2. FastAPI 앱 초기화 ---
app = FastAPI(title="부동산 매매지수 API", lifespan=lifespan)

# 프론트엔드(Next.js 등)에서 호출할 수 있도록 CORS 허용 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 실무에서는 실제 도메인으로 제한해야 합니다
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. API 엔드포인트 ---

@app.get("/")
def read_root():
    return {"status": "success", "message": "부동산 매매지수 API 서버가 정상 작동 중입니다. 🚀"}

@app.get("/api/regions")
def get_regions():
    """전체 지역 마스터 목록을 반환합니다."""
    try:
        with db_pool.acquire() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT REGION_ID, REGION_NAME FROM TB_REGION ORDER BY REGION_ID")
                # 컬럼명을 키로 하는 딕셔너리 리스트로 변환
                columns = [col[0] for col in cursor.description]
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
                return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ranking")
def get_ranking(
    target_month: str = Query(..., description="조회할 연월 (예: 202603)"),
    limit: int = Query(10, description="가져올 순위 개수")
):
    """특정 월을 기준으로 상승 지수가 가장 높은 지역 TOP N을 반환합니다."""
    try:
        with db_pool.acquire() as connection:
            with connection.cursor() as cursor:
                # 보안을 위한 바인드 변수(:month, :limit) 사용
                query = """
                    SELECT 
                        R.REGION_NAME, 
                        I.INDEX_VALUE
                    FROM TB_APT_PRICE_INDEX I
                    JOIN TB_REGION R ON I.REGION_ID = R.REGION_ID
                    WHERE I.BASE_YYYYMM = :month
                    ORDER BY I.INDEX_VALUE DESC
                    FETCH FIRST :limit ROWS ONLY
                """
                cursor.execute(query, month=target_month, limit=limit)
                
                columns = [col[0] for col in cursor.description]
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
                return {"status": "success", "target_month": target_month, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trend/{region_id}")
def get_trend(region_id: int):
    """특정 지역의 전체 시계열 매매지수 변화를 반환합니다 (선 그래프용)."""
    try:
        with db_pool.acquire() as connection:
            with connection.cursor() as cursor:
                query = """
                    SELECT BASE_YYYYMM, INDEX_VALUE 
                    FROM TB_APT_PRICE_INDEX 
                    WHERE REGION_ID = :reg_id
                    ORDER BY BASE_YYYYMM ASC
                """
                cursor.execute(query, reg_id=region_id)
                
                columns = [col[0] for col in cursor.description]
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
                return {"status": "success", "region_id": region_id, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai-insight")
def get_ai_insight(
    target_month: str = Query(..., description="분석할 연월 (예: 202603)")
):
    """부동산 데이터를 바탕으로 OpenAI가 냉철한 분석 보고서를 생성합니다."""
    try:
        # 1. 분석을 위한 데이터 조회 (TOP 5 Ranking 데이터 활용)
        with db_pool.acquire() as connection:
            with connection.cursor() as cursor:
                query = """
                    SELECT R.REGION_NAME, I.INDEX_VALUE
                    FROM TB_APT_PRICE_INDEX I
                    JOIN TB_REGION R ON I.REGION_ID = R.REGION_ID
                    WHERE I.BASE_YYYYMM = :month
                    ORDER BY I.INDEX_VALUE DESC
                    FETCH FIRST 5 ROWS ONLY
                """
                cursor.execute(query, month=target_month)
                rows = cursor.fetchall()
                
                if not rows:
                    return {"status": "success", "insight": "해당 월의 데이터가 부족하여 분석을 진행할 수 없습니다."}

                data_summary = ", ".join([f"{row[0]}({row[1]}pt)" for row in rows])

        # 2. OpenAI 프롬프트 구성 (냉철한 분석가 컨셉)
        system_prompt = "당신은 대한민국 부동산 시장을 분석하는 냉철하고 객관적인 전문 분석가입니다. 감정적인 수식어는 배제하고, 데이터에 기반하여 현상을 날카롭게 분석하십시오. 결과는 반드시 2~3문항의 불렛 포인트 형식으로 제공하십시오."
        
        user_prompt = f"{target_month[:4]}년 {target_month[4:]}월 기준, 아파트 매매가격지수 상위 5개 지역 데이터는 다음과 같습니다: {data_summary}. 이 데이터를 분석하여 현재 시장의 특징과 향후 주의해야 할 점을 보고하십시오. 한국어로 답변하십시오."

        # 3. OpenAI API 호출
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=600,
            temperature=0.3
        )

        insight_text = response.choices[0].message.content
        return {"status": "success", "target_month": target_month, "insight": insight_text}

    except Exception as e:
        print(f"AI Insight Error: {e}")
        return {"status": "error", "message": "AI 분석 중 오류가 발생했습니다. API 키 설정을 확인하세요."}