'use client';

import { useState, useEffect } from 'react';

import type { Transaction, MonthlySummary, CategorySummary } from '@/app/types/household';

const STORAGE_KEY = 'household-transactions';

/**
 * 家計簿データ管理フック
 */
export function useHouseholdData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // LocalStorageからデータを読み込み
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Transaction[];
        setTransactions(parsed);
      } catch (error) {
        console.error('Failed to parse stored transactions:', error);
      }
    }
  }, []);

  // データが変更されたらLocalStorageに保存
  useEffect(() => {
    if (transactions.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions]);

  /**
   * 取引を追加
   */
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  /**
   * 取引を更新
   */
  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  /**
   * 取引を削除
   */
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * 指定月の取引を取得
   */
  const getTransactionsByMonth = (year: number, month: number): Transaction[] => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    return transactions.filter((t) => t.date.startsWith(monthStr));
  };

  /**
   * 月次集計を取得
   */
  const getMonthlySummary = (year: number, month: number): MonthlySummary => {
    const monthTransactions = getTransactionsByMonth(year, month);

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      year,
      month,
      income,
      expense,
      balance: income - expense,
    };
  };

  /**
   * カテゴリ別集計を取得
   */
  const getCategorySummary = (
    year: number,
    month: number,
    type: 'income' | 'expense'
  ): CategorySummary[] => {
    const monthTransactions = getTransactionsByMonth(year, month).filter(
      (t) => t.type === type
    );

    const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, number>();
    monthTransactions.forEach((t) => {
      const current = categoryMap.get(t.category) ?? 0;
      categoryMap.set(t.category, current + t.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  /**
   * 資産残高を取得（全期間の収入 - 支出）
   */
  const getTotalBalance = (): number => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return income - expense;
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByMonth,
    getMonthlySummary,
    getCategorySummary,
    getTotalBalance,
  };
}
