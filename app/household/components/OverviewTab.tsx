'use client';

import { useState } from 'react';

import type { MonthlySummary } from '@/app/types/household';

interface OverviewTabProps {
  summary: MonthlySummary;
  totalBalance: number;
  onAddTransaction: () => void;
}

/**
 * 概要タブ - 資産残高、月次収支、取引追加UIを表示
 */
export function OverviewTab({
  summary,
  totalBalance,
  onAddTransaction,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* 月次収支表示 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {summary.year}年{summary.month}月の収支
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 収入カード */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                収入
              </h3>
              <svg
                className="w-5 h-5 text-green-600"
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
            </div>
            <p className="text-3xl font-bold text-green-600">
              ¥{summary.income.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {summary.month}月の収引
            </p>
          </div>

          {/* 支出カード */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                支出
              </h3>
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-red-600">
              ¥{summary.expense.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {summary.month}月の支引
            </p>
          </div>

          {/* 収支カード */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                収支
              </h3>
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p
              className={`text-3xl font-bold ${
                summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}
            >
              {summary.balance >= 0 ? '' : '-'}¥
              {Math.abs(summary.balance).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">赤字</p>
          </div>
        </div>
      </div>

      {/* 新しい取引を追加 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          新しい取引を追加
        </h2>
        <button
          onClick={onAddTransaction}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          取引を追加
        </button>
      </div>
    </div>
  );
}
