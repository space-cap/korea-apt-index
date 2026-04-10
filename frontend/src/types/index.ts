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

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}
