import React, { useState, useEffect } from 'react';
import { ActiveTab, Habit, Transaction, Goal, JournalEntry } from './types';
import { 
  loadHabits, saveHabits, 
  loadTransactions, saveTransactions, 
  loadGoals, saveGoals, 
  loadJournals, saveJournals 
} from './utils/storage';
import { getTodayDateString } from './utils/date';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TabBeranda } from './components/TabBeranda';
import { TabFinancial } from './components/TabFinancial';
import { TabRangkuman } from './components/TabRangkuman';
import { TabGoalsJournal } from './components/TabGoalsJournal';
import { BackupModal } from './components/BackupModal';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('habit_fin_theme_v2');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('habit_fin_theme_v2', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('habit_fin_theme_v2', 'light');
    }
  }, [darkMode]);

  // Tab navigation state
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');

  // Selected date & calendar state
  const todayStr = getTodayDateString();
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const now = new Date();
  const [calendarYear, setCalendarYear] = useState<number>(now.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(now.getMonth());

  // App data states
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());
  const [journals, setJournals] = useState<JournalEntry[]>(() => loadJournals());

  // Backup modal state
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);

  // Reload data from storage (after backup restore)
  const reloadData = () => {
    setHabits(loadHabits());
    setTransactions(loadTransactions());
    setGoals(loadGoals());
    setJournals(loadJournals());
  };

  // Habit handlers
  const handleAddHabit = (newHabit: Habit) => {
    const updated = [newHabit, ...habits];
    setHabits(updated);
    saveHabits(updated);
  };

  const handleToggleHabit = (habitId: string, dateStr: string) => {
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        const completed = { ...(h.completedDates || {}) };
        if (completed[dateStr]) {
          delete completed[dateStr];
        } else {
          completed[dateStr] = true;
        }
        return { ...h, completedDates: completed };
      }
      return h;
    });
    setHabits(updated);
    saveHabits(updated);
  };

  const handleDeleteHabit = (habitId: string) => {
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);
    saveHabits(updated);
  };

  // Transaction handlers
  const handleAddTransaction = (newTx: Transaction) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleDeleteTransaction = (txId: string) => {
    const updated = transactions.filter((t) => t.id !== txId);
    setTransactions(updated);
    saveTransactions(updated);
  };

  // Goal handlers
  const handleAddGoal = (newGoal: Goal) => {
    const updated = [newGoal, ...goals];
    setGoals(updated);
    saveGoals(updated);
  };

  const handleUpdateGoalProgress = (goalId: string, addedAmount: number) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const nextAmount = (g.currentAmount || 0) + addedAmount;
        const isDone = g.targetAmount ? nextAmount >= g.targetAmount : false;
        return {
          ...g,
          currentAmount: nextAmount,
          status: isDone ? ('completed' as const) : g.status,
        };
      }
      return g;
    });
    setGoals(updated);
    saveGoals(updated);
  };

  const handleToggleGoalStatus = (goalId: string) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const nextStatus = g.status === 'completed' ? ('in_progress' as const) : ('completed' as const);
        return { ...g, status: nextStatus };
      }
      return g;
    });
    setGoals(updated);
    saveGoals(updated);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = goals.filter((g) => g.id !== goalId);
    setGoals(updated);
    saveGoals(updated);
  };

  // Journal handlers
  const handleSaveJournal = (entry: JournalEntry) => {
    const existingIndex = journals.findIndex((j) => j.date === entry.date);
    let updated: JournalEntry[];
    if (existingIndex >= 0) {
      updated = [...journals];
      updated[existingIndex] = entry;
    } else {
      updated = [entry, ...journals];
    }
    setJournals(updated);
    saveJournals(updated);
  };

  const handleDeleteJournal = (entryId: string) => {
    const updated = journals.filter((j) => j.id !== entryId);
    setJournals(updated);
    saveJournals(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col transition-colors selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenBackup={() => setShowBackupModal(true)}
        selectedDateStr={selectedDateStr}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3">
        {activeTab === 'beranda' && (
          <TabBeranda
            habits={habits}
            onAddHabit={handleAddHabit}
            onToggleHabit={handleToggleHabit}
            onDeleteHabit={handleDeleteHabit}
            selectedDateStr={selectedDateStr}
            setSelectedDateStr={setSelectedDateStr}
            calendarYear={calendarYear}
            calendarMonth={calendarMonth}
            setCalendarYear={setCalendarYear}
            setCalendarMonth={setCalendarMonth}
          />
        )}

        {activeTab === 'financial' && (
          <TabFinancial
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            selectedDateStr={selectedDateStr}
            setSelectedDateStr={setSelectedDateStr}
            calendarYear={calendarYear}
            calendarMonth={calendarMonth}
            setCalendarYear={setCalendarYear}
            setCalendarMonth={setCalendarMonth}
          />
        )}

        {activeTab === 'rangkuman' && (
          <TabRangkuman
            habits={habits}
            transactions={transactions}
            goals={goals}
            calendarYear={calendarYear}
            calendarMonth={calendarMonth}
          />
        )}

        {activeTab === 'goals_journal' && (
          <TabGoalsJournal
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoalProgress={handleUpdateGoalProgress}
            onToggleGoalStatus={handleToggleGoalStatus}
            onDeleteGoal={handleDeleteGoal}
            journals={journals}
            onSaveJournal={handleSaveJournal}
            onDeleteJournal={handleDeleteJournal}
            selectedDateStr={selectedDateStr}
          />
        )}
      </main>

      {/* Modern Instagram-like Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Data Backup & Restore Modal */}
      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onDataReload={reloadData}
      />
    </div>
  );
};

export default App;
