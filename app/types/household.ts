/**
 * 取引種別
 */
export type TransactionType = 'income' | 'expense';

/**
 * カテゴリ定義
 */
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

/**
 * 取引レコード
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

/**
 * 月次集計データ
 */
export interface MonthlySummary {
  year: number;
  month: number;
  income: number;
  expense: number;
  balance: number;
}

/**
 * カテゴリ別集計データ
 */
export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}
