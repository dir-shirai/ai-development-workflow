'use client';

import { useState } from 'react';

import type { CategorySummary } from '@/app/types/household';
import { getCategoryName } from '@/app/constants/categories';

interface BreakdownTabProps {
  incomeSummary: CategorySummary[];
  expenseSummary: CategorySummary[];
  year: number;
  month: number;
}

/**
 * 円グラフコンポーネント（CSS実装）
 */
function PieChart({ data }: { data: CategorySummary[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        データがありません
      </div>
    );
  }

  const colors = [
    'rgb(59, 130, 246)', // blue
    'rgb(236, 72, 153)', // pink
    'rgb(34, 197, 94)', // green
    'rgb(251, 146, 60)', // orange
    'rgb(168, 85, 247)', // purple
    'rgb(234, 179, 8)', // yellow
    'rgb(20, 184, 166)', // teal
    'rgb(244, 63, 94)', // rose
  ];

  // 単純な棒グラフで表現（円グラフは複雑なため）
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.category} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-900 dark:text-white font-medium">
              {getCategoryName(item.category)}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div
              className="h-full flex items-center justify-end px-3 text-white text-xs font-medium transition-all duration-500"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: colors[index % colors.length],
              }}
            >
              ¥{item.amount.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 内訳タブ - カテゴリ別収支をグラフとテーブルで表示
 */
export function BreakdownTab({
  incomeSummary,
  expenseSummary,
  year,
  month,
}: BreakdownTabProps) {
  const [viewType, setViewType] = useState<'income' | 'expense'>('expense');

  const currentSummary = viewType === 'income' ? incomeSummary : expenseSummary;
  const total = currentSummary.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {year}年{month}月のカテゴリ内訳
        </h2>

        {/* 収入/支出切り替え */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('income')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewType === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            収入
          </button>
          <button
            onClick={() => setViewType('expense')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewType === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            支出
          </button>
        </div>
      </div>

      {/* グラフ表示 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {viewType === 'income' ? '収入' : '支出'}の内訳
        </h3>
        <PieChart data={currentSummary} />
      </div>

      {/* テーブル表示 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                カテゴリ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                金額
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                割合
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentSummary.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  データがありません
                </td>
              </tr>
            ) : (
              <>
                {currentSummary.map((item) => (
                  <tr
                    key={item.category}
                    className="hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {getCategoryName(item.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      ¥{item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                      {item.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 dark:bg-gray-700 font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    合計
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    ¥{total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                    100.0%
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
