export type HabitCategory = 'Kesehatan' | 'Produktivitas' | 'Ibadah' | 'Belajar' | 'Keuangan' | 'Lainnya';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  targetTime?: string; // e.g. "07:30"
  reminderEnabled: boolean;
  color: string; // e.g. "#6366f1"
  icon: string;
  createdAt: string; // "YYYY-MM-DD"
  // Map of date string "YYYY-MM-DD" -> boolean
  completedDates: { [dateStr: string]: boolean };
}

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Gaji' 
  | 'Bisnis' 
  | 'Investasi' 
  | 'Bonus' 
  | 'Makanan' 
  | 'Transport' 
  | 'Belanja' 
  | 'Tagihan' 
  | 'Hiburan' 
  | 'Kesehatan' 
  | 'Pendidikan' 
  | 'Sedekah' 
  | 'Lain-lain';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  category: 'Tabungan' | 'Habit' | 'Karier' | 'Investasi' | 'Belanja Impian';
  targetAmount?: number;
  currentAmount?: number;
  deadline: string; // "YYYY-MM-DD"
  status: 'in_progress' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  mood: 'amazing' | 'good' | 'calm' | 'tired' | 'stress';
  gratitude: string; // 1-3 hal yang disyukuri
  reflection: string; // Catatan refleksi & evaluasi
  highlight: string; // Momen terbaik hari ini
  updatedAt: string;
}

export type ActiveTab = 'beranda' | 'financial' | 'rangkuman' | 'goals_journal';
