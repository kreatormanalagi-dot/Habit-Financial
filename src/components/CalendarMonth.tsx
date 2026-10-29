import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { generateCalendarDays, formatMonthYear, getTodayDateString } from '../utils/date';

interface CalendarMonthProps {
  currentYear: number;
  currentMonth: number; // 0 to 11
  onChangeMonth: (year: number, month: number) => void;
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  // Optional badges
  habitBadges?: { [dateStr: string]: { total: number; completed: number } };
  financialBadges?: { [dateStr: string]: { hasIncome: boolean; hasExpense: boolean } };
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
  currentYear,
  currentMonth,
  onChangeMonth,
  selectedDateStr,
  onSelectDate,
  habitBadges,
  financialBadges,
}) => {
  const days = generateCalendarDays(currentYear, currentMonth);
  const todayStr = getTodayDateString();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      onChangeMonth(currentYear - 1, 11);
    } else {
      onChangeMonth(currentYear, currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      onChangeMonth(currentYear + 1, 0);
    } else {
      onChangeMonth(currentYear, currentMonth + 1);
    }
  };

  const handleGoToToday = () => {
    const today = new Date();
    onChangeMonth(today.getFullYear(), today.getMonth());
    onSelectDate(todayStr);
  };

  const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
      {/* Month & Year Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <CalendarIcon size={18} className="text-rose-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white capitalize">
            {formatMonthYear(currentYear, currentMonth)}
          </h2>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Quick jump to today */}
          <button
            onClick={handleGoToToday}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
          >
            Hari Ini
          </button>
          
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 text-center mb-1">
        {dayLabels.map((lbl, idx) => (
          <div
            key={lbl}
            className={`text-[11px] font-semibold tracking-wider ${
              idx >= 5 ? 'text-rose-500 dark:text-rose-400' : 'text-gray-400 dark:text-neutral-500'
            }`}
          >
            {lbl}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
        {days.map((item) => {
          const isSelected = item.dateStr === selectedDateStr;
          const isToday = item.isToday;
          const habitData = habitBadges ? habitBadges[item.dateStr] : null;
          const finData = financialBadges ? financialBadges[item.dateStr] : null;

          return (
            <button
              key={item.dateStr}
              onClick={() => onSelectDate(item.dateStr)}
              className={`relative h-11 flex flex-col items-center justify-center rounded-2xl text-xs transition-all duration-150 ${
                isSelected
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-md scale-105 z-10'
                  : item.isCurrentMonth
                  ? isToday
                    ? 'font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-gray-800 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800/60 font-medium'
                  : 'text-gray-300 dark:text-neutral-600 font-normal'
              }`}
            >
              {/* Day Number */}
              <span>{item.dayNumber}</span>

              {/* Indicator Dots */}
              <div className="flex items-center space-x-0.5 mt-0.5 h-1.5">
                {/* Habit indicator */}
                {habitData && habitData.total > 0 && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected
                        ? 'bg-amber-400'
                        : habitData.completed === habitData.total
                        ? 'bg-emerald-500'
                        : habitData.completed > 0
                        ? 'bg-amber-500'
                        : 'bg-transparent'
                    }`}
                  />
                )}

                {/* Financial indicators */}
                {finData?.hasIncome && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-300' : 'bg-emerald-500'
                    }`}
                    title="Ada Pemasukan"
                  />
                )}
                {finData?.hasExpense && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-rose-300' : 'bg-rose-500'
                    }`}
                    title="Ada Pengeluaran"
                  />
                )}
              </div>

              {/* "Today" small indicator badge */}
              {isToday && !isSelected && (
                <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
