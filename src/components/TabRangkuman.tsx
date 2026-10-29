import React, { useState } from 'react';
import { 
  Trophy, TrendingUp, TrendingDown, CheckCircle2, 
  Flame, Award, PieChart, Sparkles, Target, ArrowUpRight
} from 'lucide-react';
import { Habit, Transaction, Goal } from '../types';
import { formatCurrency, MONTH_NAMES_ID } from '../utils/date';

interface TabRangkumanProps {
  habits: Habit[];
  transactions: Transaction[];
  goals: Goal[];
  calendarYear: number;
  calendarMonth: number;
}

export const TabRangkuman: React.FC<TabRangkumanProps> = ({
  habits,
  transactions,
  goals,
  calendarYear,
  calendarMonth,
}) => {
  const [periodType, setPeriodType] = useState<'month' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState(calendarMonth);
  const [selectedYear, setSelectedYear] = useState(calendarYear);

  const monthStr = String(selectedMonth + 1).padStart(2, '0');
  const monthPrefix = `${selectedYear}-${monthStr}`;
  const yearPrefix = `${selectedYear}-`;

  // Filter transactions
  const filteredTx = transactions.filter((tx) =>
    periodType === 'month' ? tx.date.startsWith(monthPrefix) : tx.date.startsWith(yearPrefix)
  );

  const totalIncome = filteredTx
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = filteredTx
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Breakdown expense by category
  const expenseByCategory: { [cat: string]: number } = {};
  filteredTx
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
    });

  const sortedExpenseCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  // Habit Analytics for period
  // Count total completed checks within this period
  let habitChecksCount = 0;
  let totalHabitOpportunities = 0;

  // Days in selected period
  const daysInPeriod =
    periodType === 'month'
      ? new Date(selectedYear, selectedMonth + 1, 0).getDate()
      : 365;

  habits.forEach((habit) => {
    Object.entries(habit.completedDates || {}).forEach(([dStr, done]) => {
      const match = periodType === 'month' ? dStr.startsWith(monthPrefix) : dStr.startsWith(yearPrefix);
      if (match && done) {
        habitChecksCount++;
      }
    });
  });

  totalHabitOpportunities = habits.length * daysInPeriod;
  const habitRate =
    totalHabitOpportunities > 0
      ? Math.min(100, Math.round((habitChecksCount / totalHabitOpportunities) * 100))
      : 0;

  // Most consistent habit
  type BestHabitType = { title: string; count: number };
  let bestHabit: BestHabitType | null = null;
  for (const habit of habits) {
    let count = 0;
    for (const [dStr, done] of Object.entries(habit.completedDates || {})) {
      const match = periodType === 'month' ? dStr.startsWith(monthPrefix) : dStr.startsWith(yearPrefix);
      if (match && done) count++;
    }
    if (!bestHabit || count > bestHabit.count) {
      bestHabit = { title: habit.title, count };
    }
  }

  // Goals achieved (status completed or progress 100%)
  const completedGoals = goals.filter((g) => {
    if (g.status === 'completed') return true;
    if (g.targetAmount && g.currentAmount && g.currentAmount >= g.targetAmount) return true;
    return false;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Period Selector Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <PieChart size={18} className="text-purple-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Laporan & Rangkuman
            </h3>
          </div>

          {/* Toggle Per Bulan / Per Tahun */}
          <div className="flex bg-gray-100 dark:bg-neutral-800 p-0.5 rounded-full text-xs font-semibold">
            <button
              onClick={() => setPeriodType('month')}
              className={`px-3 py-1 rounded-full transition ${
                periodType === 'month'
                  ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white font-bold shadow-sm'
                  : 'text-gray-500 dark:text-neutral-400'
              }`}
            >
              Per Bulan
            </button>
            <button
              onClick={() => setPeriodType('year')}
              className={`px-3 py-1 rounded-full transition ${
                periodType === 'year'
                  ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white font-bold shadow-sm'
                  : 'text-gray-500 dark:text-neutral-400'
              }`}
            >
              Per Tahun
            </button>
          </div>
        </div>

        {/* Dropdowns for Month / Year */}
        <div className="flex items-center space-x-2">
          {periodType === 'month' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="flex-1 py-1.5 px-3 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-bold text-gray-800 dark:text-white focus:outline-none"
            >
              {MONTH_NAMES_ID.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="flex-1 py-1.5 px-3 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-bold text-gray-800 dark:text-white focus:outline-none"
          >
            {[selectedYear - 1, selectedYear, selectedYear + 1].map((yr) => (
              <option key={yr} value={yr}>
                Tahun {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Rangkuman Financial */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            Rangkuman Finansial {periodType === 'month' ? MONTH_NAMES_ID[selectedMonth] : selectedYear}
          </h4>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold">
            Saving Rate: {savingRate}%
          </span>
        </div>

        {/* Financial Cards Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/60">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Pemasukan</p>
            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 line-clamp-1">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/60">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Pengeluaran</p>
            <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-0.5 line-clamp-1">
              {formatCurrency(totalExpense)}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/60">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Tabungan Bersih</p>
            <p
              className={`text-xs font-extrabold font-mono mt-0.5 line-clamp-1 ${
                netSavings >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-rose-600'
              }`}
            >
              {formatCurrency(netSavings)}
            </p>
          </div>
        </div>

        {/* Breakdown Pengeluaran Per Kategori (Google Sheets Clean Borderless Layout) */}
        <div className="pt-2">
          <p className="text-xs font-bold text-gray-700 dark:text-neutral-300 mb-2">
            Rincian Pengeluaran Berdasarkan Kategori
          </p>

          {sortedExpenseCategories.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center">
              Tidak ada data pengeluaran pada periode ini.
            </p>
          ) : (
            <div className="space-y-2">
              {/* Sheets Clean Headers */}
              <div className="grid grid-cols-12 px-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                <div className="col-span-5">KATEGORI</div>
                <div className="col-span-4 text-right">TOTAL</div>
                <div className="col-span-3 text-right">PORSI</div>
              </div>

              {sortedExpenseCategories.map(([cat, amount]) => {
                const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="grid grid-cols-12 items-center px-2 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/40 transition">
                      <div className="col-span-5 text-xs font-semibold text-gray-800 dark:text-neutral-200">
                        {cat}
                      </div>
                      <div className="col-span-4 text-xs font-mono font-bold text-gray-900 dark:text-white text-right">
                        {formatCurrency(amount)}
                      </div>
                      <div className="col-span-3 text-xs font-mono text-gray-500 dark:text-neutral-400 text-right">
                        {percent}%
                      </div>
                    </div>
                    {/* Visual minimal bar */}
                    <div className="w-full bg-gray-100 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Rangkuman Habit */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
            Konsistensi Habit {periodType === 'month' ? MONTH_NAMES_ID[selectedMonth] : selectedYear}
          </h4>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 font-bold">
            {habitChecksCount} Checklist
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/60">
            <div className="flex items-center space-x-1.5 text-amber-500 mb-1">
              <Flame size={14} className="fill-amber-500" />
              <span className="text-[10px] font-bold uppercase text-gray-400">Habit Terkonsisten</span>
            </div>
            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {bestHabit && bestHabit.count > 0 ? bestHabit.title : 'Belum tercatat'}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {bestHabit ? `${bestHabit.count} hari berhasil` : '-'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/60">
            <div className="flex items-center space-x-1.5 text-emerald-500 mb-1">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-bold uppercase text-gray-400">Total Rutinitas</span>
            </div>
            <p className="text-xs font-bold text-gray-900 dark:text-white">
              {habits.length} Habit Aktif
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Siap dikerjakan tiap hari
            </p>
          </div>
        </div>
      </div>

      {/* 4. Target & Pencapaian yang Sudah Tercapai (Goals Achieved) */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="flex items-center space-x-2 mb-3">
          <Trophy size={18} className="text-amber-500" />
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            Target Yang Sudah Tercapai
          </h4>
        </div>

        {completedGoals.length === 0 ? (
          <div className="py-6 text-center text-gray-400 dark:text-neutral-500">
            <Award size={32} className="mx-auto mb-2 text-gray-300 dark:text-neutral-700" />
            <p className="text-xs font-medium">Belum ada target yang diselesaikan.</p>
            <p className="text-[11px] mt-1">
              Tetap semangat! Selesaikan targetmu di tab <strong>Goals & Jurnal</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white">
                      {goal.title}
                    </h5>
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      ✓ Target Berhasil Diraih
                    </span>
                  </div>
                </div>

                {goal.targetAmount && (
                  <span className="text-xs font-mono font-bold text-gray-800 dark:text-neutral-200">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
