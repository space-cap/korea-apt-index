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

export interface RankingTableData {
  REGION_NAME: string;
  CURRENT_INDEX: number;
  PREV_INDEX: number | null;
  CHANGE_VAL: number;
  CHANGE_PCT: number;
  AVG_DIFF: number;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  insight?: string;
  nat_avg?: number; // 전국 평균 값
  message?: string;
}
