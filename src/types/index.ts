// Prisma生成型を再エクスポート（型の一元管理・乖離防止）
export type {
  SalesPerson,
  Customer,
  DailyReport,
  VisitRecord,
  ManagerComment,
} from "@prisma/client";

// APIエラーレスポンス
export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
};

// ページネーション
export type Pagination = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

// 認証ユーザー（JWTペイロード）
export type AuthUser = {
  id: number;
  name: string;
  email: string;
  department: string;
  isManager: boolean;
};
