import axios from "axios";

// 내부 환경변수 또는 기본 URL 사용 (여기서는 로컬 FastAPI 기준 설정)
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
