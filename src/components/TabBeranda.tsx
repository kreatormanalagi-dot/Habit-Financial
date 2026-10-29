import React, { useState } from 'react';
import { 
  Plus, Check, Bell, Flame, Trash2, Clock, 
  Sparkles, AlertCircle, X, CheckCircle, Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Habit, HabitCategory } from '../types';
import { formatIndonesianDate, getTodayDateString } from '../utils/date';
import { CalendarMonth } from './CalendarMonth';
import { notificationService } from '../services/notificationService';

interface TabBerandaProps {
  habits: Habit[];
  onAddHabit: (habit: Habit) => void;
  onToggleHabit: (habitId: string, dateStr: string) => void;
  onDeleteHabit: (habitId: string) => void;
  selectedDateStr: string;
  setSelectedDateStr: (date: string) => void;
  calendarYear: number;
  calendarMonth: number;
  setCalendarYear: (y: number) => void;
  setCalendarMonth: (m: number) => void;
}

const CATEGORIES: { label: HabitCategory; color: string }[] = [
  { label: 'Kesehatan', color: '#10b981' },
  { label: 'Ibadah', color: '#8b5cf6' },
  { label: 'Produktivitas', color: '#3b82f6' },
  { label: 'Belajar', color: '#f59e0b' },
  { label: 'Keuangan', color: '#ec4899' },
  { label: 'Lainnya', color: '#6b7280' },
];

export const TabBeranda: React.FC<TabBerandaProps> = ({
  habits,
  onAddHabit,
  onToggleHabit,
  onDeleteHabit,
  selectedDateStr,
  setSelectedDateStr,
  calendarYear,
  calendarMonth,
  setCalendarYear,
  setCalendarMonth,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>('Kesehatan');
  const [newTime, setNewTime] = useState('07:00');
  const [newReminder, setNewReminder] = useState(true);

  const todayStr = getTodayDateString();
  const isSelectedDateToday = selectedDateStr === todayStr;

  // Calculate habit badges for calendar
  const habitBadges: { [dateStr: string]: { total: number; completed: number } } = {};
  if (habits.length > 0) {
    // We check dates in habits
    habits.forEach((habit) => {
      Object.keys(habit.completedDates || {}).forEach((dStr) => {
        if (!habitBadges[dStr]) {
          habitBadges[dStr] = { total: habits.length, completed: 0 };
        }
        if (habit.completedDates[dStr]) {
          habitBadges[dStr].completed += 1;
        }
      });
    });
  }

  // Habits for selected date
  const completedCount = habits.filter(
    (h) => h.completedDates && h.completedDates[selectedDateStr]
  ).length;
  const totalHabits = habits.length;
  const progressPercent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  // Handle toggle checkmark
  const handleCheck = (habitId: string) => {
    const wasCompleted = habits.find((h) => h.id === habitId)?.completedDates[selectedDateStr];
    onToggleHabit(habitId, selectedDateStr);

    // If completing the last one, shoot confetti!
    if (!wasCompleted && completedCount + 1 === totalHabits && totalHabits > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  // Submit new habit
  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const habitColor = CATEGORIES.find((c) => c.label === newCategory)?.color || '#6366f1';

    const newHabit: Habit = {
      id: 'h-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      targetTime: newTime,
      reminderEnabled: newReminder,
      color: habitColor,
      icon: 'Check',
      createdAt: todayStr,
      completedDates: {},
    };

    onAddHabit(newHabit);

    if (newReminder && newTime) {
      await notificationService.requestPermission();
      await notificationService.scheduleHabitReminder(newHabit);
    }

    setNewTitle('');
    setShowAddModal(false);
  };

  // Calculate streak for a habit
  const calculateStreak = (habit: Habit): number => {
    let streak = 0;
    const checkDate = new Date();
    
    // Check backwards from today or yesterday
    for (let i = 0; i < 365; i++) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const dStr = `${year}-${month}-${day}`;

      if (habit.completedDates && habit.completedDates[dStr]) {
        streak++;
      } else {
        // Allow today to be unchecked without breaking streak from yesterday
        if (i > 0) break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  };

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Monthly Calendar */}
      <CalendarMonth
        currentYear={calendarYear}
        currentMonth={calendarMonth}
        onChangeMonth={(y, m) => {
          setCalendarYear(y);
          setCalendarMonth(m);
        }}
        selectedDateStr={selectedDateStr}
        onSelectDate={setSelectedDateStr}
        habitBadges={habitBadges}
      />

      {/* 2. Selected Date Header & Progress Banner */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-rose-500 uppercase">
              {isSelectedDateToday ? '• Hari Ini' : 'Tanggal Terpilih'}
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white capitalize">
              {formatIndonesianDate(selectedDateStr)}
            </h3>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full insta-gradient text-white text-xs font-bold shadow-md shadow-rose-500/25 active:scale-95 transition transform"
          >
            <Plus size={15} />
            <span>Habit Baru</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-gray-500 dark:text-neutral-400">
              Progres: {completedCount} dari {totalHabits} habit selesai
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full insta-gradient transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Google Sheets Clean Tabular Style Habit Tracker List (Without Lines) */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-amber-500" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Rutinitas Harian
            </h4>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">
            {totalHabits} Habit Terdaftar
          </span>
        </div>

        {/* Google Sheets Borderless Column Headers */}
        <div className="grid grid-cols-12 px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 dark:text-neutral-500 uppercase border-b border-gray-50 dark:border-neutral-800/50">
          <div className="col-span-2 text-center">STATUS</div>
          <div className="col-span-6">HABIT & KATEGORI</div>
          <div className="col-span-2 text-center">WAKTU</div>
          <div className="col-span-2 text-right">AKSI</div>
        </div>

        {/* Habit Rows */}
        {habits.length === 0 ? (
          <div className="py-10 text-center text-gray-400 dark:text-neutral-500">
            <AlertCircle size={32} className="mx-auto mb-2 text-gray-300 dark:text-neutral-600" />
            <p className="text-sm font-medium">Belum ada habit yang ditambahkan.</p>
            <p className="text-xs mt-1">
              Klik tombol <strong className="text-rose-500">+ Habit Baru</strong> di atas untuk memulai rutinitasmu!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-transparent space-y-1 mt-1">
            {habits.map((habit) => {
              const isChecked = !!(habit.completedDates && habit.completedDates[selectedDateStr]);
              const streak = calculateStreak(habit);

              return (
                <div
                  key={habit.id}
                  className={`grid grid-cols-12 items-center px-2 py-2.5 rounded-2xl transition-all duration-150 ${
                    isChecked
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  {/* Status Checkbox */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      onClick={() => handleCheck(habit.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isChecked
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                          : 'border-2 border-gray-300 dark:border-neutral-700 hover:border-emerald-400'
                      }`}
                    >
                      {isChecked && <Check size={16} strokeWidth={3} />}
                    </button>
                  </div>

                  {/* Habit Details */}
                  <div className="col-span-6 pl-1 pr-2">
                    <p
                      className={`text-xs font-semibold leading-snug transition-colors line-clamp-1 ${
                        isChecked
                          ? 'line-through text-gray-400 dark:text-neutral-500'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {habit.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white tracking-wide"
                        style={{ backgroundColor: habit.color }}
                      >
                        {habit.category}
                      </span>
                      {streak > 0 && (
                        <span className="flex items-center text-[10px] font-bold text-amber-500">
                          <Flame size={11} className="mr-0.5 fill-amber-500" />
                          {streak}h
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Time / Alarm */}
                  <div className="col-span-2 flex flex-col items-center justify-center">
                    <span className="text-[11px] font-mono font-medium text-gray-700 dark:text-neutral-300">
                      {habit.targetTime || '--:--'}
                    </span>
                    {habit.reminderEnabled && (
                      <span
                        className="text-amber-500 flex items-center text-[9px] mt-0.5"
                        title="Alarm Aktif"
                      >
                        <Bell size={10} className="fill-amber-500 mr-0.5" />
                        On
                      </span>
                    )}
                  </div>

                  {/* Action / Delete */}
                  <div className="col-span-2 flex items-center justify-end space-x-1 pr-1">
                    <button
                      onClick={() => {
                        if (confirm(`Hapus habit "${habit.title}" dari rutinitas?`)) {
                          onDeleteHabit(habit.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-300 dark:text-neutral-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-neutral-800 transition"
                      title="Hapus Habit"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Modal Tambah Habit Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-gray-100 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg insta-gradient flex items-center justify-center text-white">
                  <Plus size={16} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Tambah Habit Rutin
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              {/* Judul Habit */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                  Nama Habit / Rutinitas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bangun Jam 05.00 Pagi, Minum 2L Air"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1.5">
                  Kategori
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.label}
                      onClick={() => setNewCategory(cat.label)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                        newCategory === cat.label
                          ? 'text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: newCategory === cat.label ? cat.color : undefined,
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jam / Target Waktu */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1 flex items-center">
                  <Clock size={14} className="mr-1 text-gray-400" />
                  Waktu Pelaksanaan (Jam)
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                />
              </div>

              {/* Alarm & Notifikasi Switch */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/70 border border-gray-100 dark:border-neutral-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      Alarm & Notifikasi HP
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-neutral-500">
                      Berdering saat jam habit tiba
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReminder}
                    onChange={(e) => setNewReminder(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-neutral-700 text-xs font-bold text-gray-600 dark:text-neutral-400 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl insta-gradient text-white text-xs font-bold shadow-md shadow-rose-500/30 hover:opacity-95"
                >
                  Simpan Habit Rutin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
