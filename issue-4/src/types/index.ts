// 営業担当者
export type SalesPerson = {
  salesPersonId: number;
  name: string;
  email: string;
  department: string;
  isManager: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// 顧客
export type Customer = {
  customerId: number;
  companyName: string;
  contactPerson: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// 日報
export type DailyReport = {
  reportId: number;
  salesPersonId: number;
  reportDate: Date;
  problem: string;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
};

// 訪問記録
export type VisitRecord = {
  visitId: number;
  reportId: number;
  customerId: number;
  visitContent: string;
  visitTime: string | null;
  createdAt: Date;
};

// 上長コメント
export type ManagerComment = {
  commentId: number;
  reportId: number;
  managerId: number;
  comment: string;
  createdAt: Date;
};

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
