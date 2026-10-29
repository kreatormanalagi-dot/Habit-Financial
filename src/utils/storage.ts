import { Habit, Transaction, Goal, JournalEntry } from '../types';
import { getTodayDateString } from './date';

const STORAGE_KEYS = {
  HABITS: 'habit_fin_habits_v2',
  TRANSACTIONS: 'habit_fin_transactions_v2',
  GOALS: 'habit_fin_goals_v2',
  JOURNALS: 'habit_fin_journals_v2',
  THEME: 'habit_fin_theme_v2',
};

const today = getTodayDateString();
const [currentYear, currentMonth] = today.split('-');

// Generate sample transactions for this month so UI looks vivid from the get-go
const initialSampleTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 8500000,
    category: 'Gaji',
    description: 'Gaji Bulanan Utama',
    date: `${currentYear}-${currentMonth}-01`,
    time: '09:00',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 1500000,
    category: 'Belanja',
    description: 'Belanja Kebutuhan Bulanan & Groceries',
    date: `${currentYear}-${currentMonth}-02`,
    time: '14:20',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 350000,
    category: 'Tagihan',
    description: 'Internet & WiFi Rumah',
    date: `${currentYear}-${currentMonth}-05`,
    time: '10:00',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx-4',
    type: 'income',
    amount: 1200000,
    category: 'Bisnis',
    description: 'Hasil Freelance Desain & Side Project',
    date: `${currentYear}-${currentMonth}-10`,
    time: '16:45',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx-5',
    type: 'expense',
    amount: 65000,
    category: 'Makanan',
    description: 'Makan Siang & Kopi Barista',
    date: today,
    time: '12:30',
    createdAt: new Date().toISOString()
  }
];

const initialSampleHabits: Habit[] = [
  {
    id: 'h-1',
    title: 'Bangun Pagi & Sholat / Ibadah',
    category: 'Ibadah',
    targetTime: '05:00',
    reminderEnabled: true,
    color: '#833ab4',
    icon: 'Sun',
    createdAt: `${currentYear}-${currentMonth}-01`,
    completedDates: {
      [today]: true,
    }
  },
  {
    id: 'h-2',
    title: 'Minum 2 Liter Air Putih',
    category: 'Kesehatan',
    targetTime: '08:00',
    reminderEnabled: true,
    color: '#06b6d4',
    icon: 'Droplets',
    createdAt: `${currentYear}-${currentMonth}-01`,
    completedDates: {
      [today]: true,
    }
  },
  {
    id: 'h-3',
    title: 'Olahraga / Jalan 30 Menit',
    category: 'Kesehatan',
    targetTime: '16:30',
    reminderEnabled: true,
    color: '#10b981',
    icon: 'Activity',
    createdAt: `${currentYear}-${currentMonth}-01`,
    completedDates: {}
  },
  {
    id: 'h-4',
    title: 'Membaca Buku / Belajar 15 Menit',
    category: 'Belajar',
    targetTime: '20:00',
    reminderEnabled: true,
    color: '#f59e0b',
    icon: 'BookOpen',
    createdAt: `${currentYear}-${currentMonth}-01`,
    completedDates: {}
  },
  {
    id: 'h-5',
    title: 'Evaluasi & Catat Finansial Hari Ini',
    category: 'Keuangan',
    targetTime: '21:30',
    reminderEnabled: true,
    color: '#ec4899',
    icon: 'Wallet',
    createdAt: `${currentYear}-${currentMonth}-01`,
    completedDates: {
      [today]: true,
    }
  }
];

const initialSampleGoals: Goal[] = [
  {
    id: 'g-1',
    title: 'Dana Darurat 6 Bulan',
    category: 'Tabungan',
    targetAmount: 25000000,
    currentAmount: 18500000,
    deadline: `${Number(currentYear) + 1}-06-30`,
    status: 'in_progress',
    notes: 'Disimpan di Reksadana Pasar Uang / Tabungan Berbunga Tinggi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'g-2',
    title: 'Target Tabungan Investasi',
    category: 'Investasi',
    targetAmount: 10000000,
    currentAmount: 6200000,
    deadline: `${currentYear}-12-31`,
    status: 'in_progress',
    notes: 'Portofolio saham dividen & reksadana indeks',
    createdAt: new Date().toISOString()
  },
  {
    id: 'g-3',
    title: 'Rutin Membaca 12 Buku Tahun Ini',
    category: 'Habit',
    targetAmount: 12,
    currentAmount: 8,
    deadline: `${currentYear}-12-31`,
    status: 'in_progress',
    notes: '1 buku per bulan tentang pengembangan diri dan finansial',
    createdAt: new Date().toISOString()
  }
];

const initialSampleJournals: JournalEntry[] = [
  {
    id: 'j-1',
    date: today,
    mood: 'amazing',
    gratitude: '1. Tubuh sehat dan segar hari ini\n2. Finansial terkendali dan disiplin menabung\n3. Waktu luang berkualitas bersama keluarga',
    reflection: 'Hari ini produktivitas meningkat pesat. Berhasil menjaga pengeluaran tetap sesuai rencana dan menyelesaikan habit utama pagi hari.',
    highlight: 'Menyelesaikan rutinitas pagi tepat waktu dan mencatat keuangan tanpa terlewat.',
    updatedAt: new Date().toISOString()
  }
];

// Helper to safely read from localStorage
export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) {
      saveHabits(initialSampleHabits);
      return initialSampleHabits;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading habits:', e);
    return initialSampleHabits;
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Error saving habits:', e);
  }
}

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      saveTransactions(initialSampleTransactions);
      return initialSampleTransactions;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading transactions:', e);
    return initialSampleTransactions;
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Error saving transactions:', e);
  }
}

export function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      saveGoals(initialSampleGoals);
      return initialSampleGoals;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading goals:', e);
    return initialSampleGoals;
  }
}

export function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Error saving goals:', e);
  }
}

export function loadJournals(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    if (!raw) {
      saveJournals(initialSampleJournals);
      return initialSampleJournals;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading journals:', e);
    return initialSampleJournals;
  }
}

export function saveJournals(journals: JournalEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
  } catch (e) {
    console.error('Error saving journals:', e);
  }
}

export function exportBackupJSON(): string {
  const data = {
    version: '1.0',
    appName: 'Habit & Financial',
    exportedAt: new Date().toISOString(),
    habits: loadHabits(),
    transactions: loadTransactions(),
    goals: loadGoals(),
    journals: loadJournals(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.habits && Array.isArray(parsed.habits)) {
      saveHabits(parsed.habits);
    }
    if (parsed.transactions && Array.isArray(parsed.transactions)) {
      saveTransactions(parsed.transactions);
    }
    if (parsed.goals && Array.isArray(parsed.goals)) {
      saveGoals(parsed.goals);
    }
    if (parsed.journals && Array.isArray(parsed.journals)) {
      saveJournals(parsed.journals);
    }
    return true;
  } catch (e) {
    console.error('Failed to parse backup JSON:', e);
    return false;
  }
}
