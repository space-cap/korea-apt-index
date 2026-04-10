-- =====================================================================
-- [DDL] 아파트 매매가격지수 대시보드 (korea-apt-index) 초기 스키마 생성
-- =====================================================================

-- ---------------------------------------------------------
-- 1. TB_REGION (지역 마스터) 테이블 생성 및 코멘트 추가
-- ---------------------------------------------------------
CREATE TABLE TB_REGION (
    REGION_ID         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    REGION_NAME       VARCHAR2(100) NOT NULL UNIQUE,
    PARENT_REGION_ID  NUMBER,
    REGION_TYPE       VARCHAR2(20), 
    USE_YN            CHAR(1) DEFAULT 'Y' NOT NULL,
    CREATED_AT        TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- 테이블 코멘트
COMMENT ON TABLE TB_REGION IS '지역 마스터 테이블';

-- 컬럼 코멘트
COMMENT ON COLUMN TB_REGION.REGION_ID IS '지역 고유 ID (PK, 자동증가)';
COMMENT ON COLUMN TB_REGION.REGION_NAME IS '지역명 (예: 전국, 서울, 서울 중구 등 계층형 이름 결합)';
COMMENT ON COLUMN TB_REGION.PARENT_REGION_ID IS '상위 지역 ID (자기 참조용)';
COMMENT ON COLUMN TB_REGION.REGION_TYPE IS '지역 구분 (시도, 시군구 등)';
COMMENT ON COLUMN TB_REGION.USE_YN IS '사용 여부 (Y/N)';
COMMENT ON COLUMN TB_REGION.CREATED_AT IS '레코드 생성 일시';


-- ---------------------------------------------------------
-- 2. TB_APT_PRICE_INDEX (아파트 매매가격지수) 테이블 생성 및 코멘트 추가
-- ---------------------------------------------------------
CREATE TABLE TB_APT_PRICE_INDEX (
    INDEX_ID          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    REGION_ID         NUMBER NOT NULL,
    BASE_YYYYMM       VARCHAR2(6) NOT NULL,
    INDEX_VALUE       NUMBER(10, 2) NOT NULL,
    CREATED_AT        TIMESTAMP DEFAULT SYSTIMESTAMP,
    
    CONSTRAINT FK_PRICE_REGION FOREIGN KEY (REGION_ID) REFERENCES TB_REGION(REGION_ID)
);

-- 테이블 코멘트
COMMENT ON TABLE TB_APT_PRICE_INDEX IS '아파트 매매가격지수 팩트 테이블';

-- 컬럼 코멘트
COMMENT ON COLUMN TB_APT_PRICE_INDEX.INDEX_ID IS '지수 데이터 고유 ID (PK, 자동증가)';
COMMENT ON COLUMN TB_APT_PRICE_INDEX.REGION_ID IS '지역 ID (TB_REGION.REGION_ID 외래키)';
COMMENT ON COLUMN TB_APT_PRICE_INDEX.BASE_YYYYMM IS '기준 연월 (YYYYMM 형식)';
COMMENT ON COLUMN TB_APT_PRICE_INDEX.INDEX_VALUE IS '매매가격지수 (기준시점 100.0)';
COMMENT ON COLUMN TB_APT_PRICE_INDEX.CREATED_AT IS '레코드 생성 일시';