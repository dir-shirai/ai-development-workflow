import type { Category } from '@/app/types/household';

/**
 * 収入カテゴリ
 */
export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: '給与', type: 'income' },
  { id: 'bonus', name: 'ボーナス', type: 'income' },
  { id: 'investment', name: '投資収益', type: 'income' },
  { id: 'other-income', name: 'その他', type: 'income' },
];

/**
 * 支出カテゴリ
 */
export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: '食費', type: 'expense' },
  { id: 'housing', name: '住居費', type: 'expense' },
  { id: 'utilities', name: '光熱費', type: 'expense' },
  { id: 'transport', name: '交通費', type: 'expense' },
  { id: 'entertainment', name: '娯楽費', type: 'expense' },
  { id: 'healthcare', name: '医療費', type: 'expense' },
  { id: 'education', name: '教育費', type: 'expense' },
  { id: 'other-expense', name: 'その他', type: 'expense' },
];

/**
 * すべてのカテゴリ
 */
export const ALL_CATEGORIES: Category[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
];

/**
 * カテゴリIDから名前を取得
 */
export function getCategoryName(categoryId: string): string {
  const category = ALL_CATEGORIES.find((c) => c.id === categoryId);
  return category?.name ?? categoryId;
}
