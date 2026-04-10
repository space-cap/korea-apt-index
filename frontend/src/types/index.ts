export interface Region {
  REGION_ID: number;
  REGION_NAME: string;
  PARENT_REGION_ID: number | null;
  REGION_TYPE: string;
  USE_YN: string;
  CREATED_AT: string;
}

export interface RankingData {
  REGION_NAME: string;
  INDEX_VALUE: number;
}

export interface AiInsightData {
  target_month: string;
  insight: string;
}

export interface TrendPoint {
  BASE_YYYYMM: string;
  INDEX_VALUE: number;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  insight?: string; // AI 응답의 경우 insight 필드가 바로 올 수 있음
  message?: string;
}
