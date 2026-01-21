'use client';

import { useState, useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import { useHouseholdData } from '@/app/hooks/useHouseholdData';
import { OverviewTab } from './components/OverviewTab';
import { HistoryTab } from './components/HistoryTab';
import { BreakdownTab } from './components/BreakdownTab';
import { TransactionDialog } from './components/TransactionDialog';

import type { Transaction } from '@/app/types/household';

/**
 * 家計簿アプリ - メインページ
 */
export default function HouseholdPage() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByMonth,
    getMonthlySummary,
    getCategorySummary,
    getTotalBalance,
  } = useHouseholdData();

  // 現在の年月（表示対象）
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  // ダイアログの状態
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  );

  // 現在の月のデータ
  const monthTransactions = useMemo(
    () => getTransactionsByMonth(currentYear, currentMonth),
    [transactions, currentYear, currentMonth]
  );

  const monthlySummary = useMemo(
    () => getMonthlySummary(currentYear, currentMonth),
    [transactions, currentYear, currentMonth]
  );

  const incomeSummary = useMemo(
    () => getCategorySummary(currentYear, currentMonth, 'income'),
    [transactions, currentYear, currentMonth]
  );

  const expenseSummary = useMemo(
    () => getCategorySummary(currentYear, currentMonth, 'expense'),
    [transactions, currentYear, currentMonth]
  );

  const totalBalance = useMemo(() => getTotalBalance(), [transactions]);

  // 取引追加ダイアログを開く
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  // 取引編集ダイアログを開く
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  // 取引を保存（追加または更新）
  const handleSaveTransaction = (
    transactionData: Omit<Transaction, 'id' | 'createdAt'>
  ) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
  };

  // 取引を削除
  const handleDeleteTransaction = (id: string) => {
    if (confirm('この取引を削除してもよろしいですか？')) {
      deleteTransaction(id);
    }
  };

  // 月を変更
  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              家計簿アプリ
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            収入と支出を記録して、資産を管理しましょう
          </p>
        </div>

        {/* 月選択 */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            aria-label="前月"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="text-xl font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
            {currentYear}年{currentMonth}月
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            aria-label="次月"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* タブUI */}
        <Tabs.Root defaultValue="overview" className="w-full">
          <Tabs.List className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-lg p-2 shadow">
            <Tabs.Trigger
              value="overview"
              className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:bg-gray-100 dark:data-[state=inactive]:hover:bg-gray-700"
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                概要
              </div>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="history"
              className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:bg-gray-100 dark:data-[state=inactive]:hover:bg-gray-700"
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                取引履歴
              </div>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="breakdown"
              className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:bg-gray-100 dark:data-[state=inactive]:hover:bg-gray-700"
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
                カテゴリ内訳
              </div>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="overview">
            <OverviewTab
              summary={monthlySummary}
              totalBalance={totalBalance}
              onAddTransaction={handleAddTransaction}
            />
          </Tabs.Content>

          <Tabs.Content value="history">
            <HistoryTab
              transactions={monthTransactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </Tabs.Content>

          <Tabs.Content value="breakdown">
            <BreakdownTab
              incomeSummary={incomeSummary}
              expenseSummary={expenseSummary}
              year={currentYear}
              month={currentMonth}
            />
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* 取引追加/編集ダイアログ */}
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
