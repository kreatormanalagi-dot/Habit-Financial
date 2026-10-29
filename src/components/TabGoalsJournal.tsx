import React, { useState } from 'react';
import { 
  Target, BookHeart, Plus, CheckCircle, Trophy, 
  Trash2, X, Calendar, Smile, Heart, Sparkles, Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Goal, JournalEntry } from '../types';
import { formatCurrency, formatIndonesianDate, getTodayDateString } from '../utils/date';

interface TabGoalsJournalProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoalProgress: (goalId: string, addedAmount: number) => void;
  onToggleGoalStatus: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  journals: JournalEntry[];
  onSaveJournal: (entry: JournalEntry) => void;
  onDeleteJournal: (entryId: string) => void;
  selectedDateStr: string;
}

const MOODS: { id: JournalEntry['mood']; emoji: string; label: string }[] = [
  { id: 'amazing', emoji: '🤩', label: 'Luar Biasa' },
  { id: 'good', emoji: '😊', label: 'Bagus & Senang' },
  { id: 'calm', emoji: '🌿', label: 'Tenang & Damai' },
  { id: 'tired', emoji: '🥱', label: 'Lelah' },
  { id: 'stress', emoji: '🌧️', label: 'Butuh Istirahat' },
];

export const TabGoalsJournal: React.FC<TabGoalsJournalProps> = ({
  goals,
  onAddGoal,
  onUpdateGoalProgress,
  onToggleGoalStatus,
  onDeleteGoal,
  journals,
  onSaveJournal,
  onDeleteJournal,
  selectedDateStr,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'goals' | 'journal'>('goals');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddProgressModal, setShowAddProgressModal] = useState<string | null>(null);
  const [addedProgressStr, setAddedProgressStr] = useState('');

  // Form states for Goal
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<Goal['category']>('Tabungan');
  const [goalTargetAmount, setGoalTargetAmount] = useState('');
  const [goalCurrentAmount, setGoalCurrentAmount] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalNotes, setGoalNotes] = useState('');

  // Form states for Journal
  const todayStr = getTodayDateString();
  const [journalDate, setJournalDate] = useState(selectedDateStr || todayStr);

  // Find existing journal for this date or prepare new
  const existingJournal = journals.find((j) => j.date === journalDate);

  const [mood, setMood] = useState<JournalEntry['mood']>(existingJournal?.mood || 'amazing');
  const [gratitude, setGratitude] = useState(existingJournal?.gratitude || '');
  const [reflection, setReflection] = useState(existingJournal?.reflection || '');
  const [highlight, setHighlight] = useState(existingJournal?.highlight || '');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // When journalDate changes, update inputs with existing data if any
  const handleDateChange = (newDate: string) => {
    setJournalDate(newDate);
    const found = journals.find((j) => j.date === newDate);
    if (found) {
      setMood(found.mood);
      setGratitude(found.gratitude);
      setReflection(found.reflection);
      setHighlight(found.highlight);
    } else {
      setMood('amazing');
      setGratitude('');
      setReflection('');
      setHighlight('');
    }
  };

  // Submit Goal
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const targetVal = parseFloat(goalTargetAmount.replace(/[^0-9]/g, '')) || 0;
    const currentVal = parseFloat(goalCurrentAmount.replace(/[^0-9]/g, '')) || 0;

    const newGoal: Goal = {
      id: 'goal-' + Date.now(),
      title: goalTitle.trim(),
      category: goalCategory,
      targetAmount: targetVal,
      currentAmount: currentVal,
      deadline: goalDeadline || todayStr,
      status: currentVal >= targetVal && targetVal > 0 ? 'completed' : 'in_progress',
      notes: goalNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddGoal(newGoal);
    setGoalTitle('');
    setGoalTargetAmount('');
    setGoalCurrentAmount('');
    setGoalNotes('');
    setShowAddGoalModal(false);
  };

  // Submit Progress Increment
  const handleAddProgress = (goalId: string) => {
    const amt = parseFloat(addedProgressStr.replace(/[^0-9]/g, ''));
    if (!isNaN(amt) && amt > 0) {
      onUpdateGoalProgress(goalId, amt);
      setAddedProgressStr('');
      setShowAddProgressModal(null);
    }
  };

  // Submit Journal
  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: JournalEntry = {
      id: existingJournal ? existingJournal.id : 'j-' + Date.now(),
      date: journalDate,
      mood,
      gratitude,
      reflection,
      highlight,
      updatedAt: new Date().toISOString(),
    };

    onSaveJournal(entry);
    setSaveSuccessMessage(true);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    setTimeout(() => {
      setSaveSuccessMessage(false);
    }, 2500);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Sub-tab Switcher */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-neutral-800 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('goals')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'goals'
                ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-neutral-400'
            }`}
          >
            <Target size={15} />
            <span>Target & Goals</span>
          </button>
          <button
            onClick={() => setActiveSubTab('journal')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'journal'
                ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-neutral-400'
            }`}
          >
            <BookHeart size={15} />
            <span>Jurnal Catatan Harian</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-TAB: GOALS & TARGET */}
      {activeSubTab === 'goals' && (
        <div className="space-y-3">
          {/* Header & Add Button */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Daftar Impian & Target
              </h3>
              <p className="text-[11px] text-gray-400">
                Lacak kemajuan tabungan dan tujuanmu
              </p>
            </div>
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full insta-gradient text-white text-xs font-bold shadow-md shadow-rose-500/25 active:scale-95 transition"
            >
              <Plus size={15} />
              <span>Target Baru</span>
            </button>
          </div>

          {/* Goal Cards */}
          {goals.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 text-center text-gray-400 border border-gray-100 dark:border-neutral-800">
              <Target size={36} className="mx-auto mb-2 text-gray-300 dark:text-neutral-700" />
              <p className="text-xs font-semibold">Belum ada target yang dibuat.</p>
              <p className="text-[11px] mt-1">
                Tentukan target tabungan atau impianmu sekarang!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => {
                const targetAmt = goal.targetAmount || 1;
                const currAmt = goal.currentAmount || 0;
                const percent = Math.min(100, Math.round((currAmt / targetAmt) * 100));
                const isCompleted = goal.status === 'completed' || percent >= 100;

                return (
                  <div
                    key={goal.id}
                    className={`bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border transition-all ${
                      isCompleted
                        ? 'border-amber-200 dark:border-amber-900/40 bg-amber-50/20'
                        : 'border-gray-100 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                            {goal.category}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-amber-500 flex items-center">
                              <Trophy size={12} className="mr-0.5" />
                              Tercapai!
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                          {goal.title}
                        </h4>
                        {goal.notes && (
                          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                            {goal.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onToggleGoalStatus(goal.id)}
                          className={`p-1.5 rounded-xl transition ${
                            isCompleted
                              ? 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-950/40'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
                          }`}
                          title={isCompleted ? 'Batalkan Tercapai' : 'Tandai Tercapai'}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus target "${goal.title}"?`)) {
                              onDeleteGoal(goal.id);
                            }
                          }}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-neutral-800 transition"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Amounts */}
                    <div className="mt-3">
                      <div className="flex justify-between items-baseline text-xs mb-1">
                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                          {formatCurrency(currAmt)}
                        </span>
                        <span className="font-mono text-gray-400 text-[11px]">
                          Target: {formatCurrency(targetAmt)} ({percent}%)
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-amber-500' : 'insta-gradient'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Deadline & Quick Add Progress Button */}
                    <div className="mt-3 pt-2.5 border-t border-gray-50 dark:border-neutral-800/60 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-mono">
                        Tenggat: {goal.deadline}
                      </span>

                      {!isCompleted && (
                        <button
                          onClick={() => setShowAddProgressModal(goal.id)}
                          className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center space-x-1"
                        >
                          <Plus size={13} />
                          <span>+ Tambah Progres</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Add Progress Modal */}
          {showAddProgressModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 w-full max-w-sm shadow-xl border border-gray-100 dark:border-neutral-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Tambah Progres Tabungan (Rp)
                </h4>
                <input
                  type="number"
                  placeholder="Contoh: 500000"
                  value={addedProgressStr}
                  onChange={(e) => setAddedProgressStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm font-mono font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 mb-3"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAddProgressModal(null)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-neutral-700 text-gray-500"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleAddProgress(showAddProgressModal)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold insta-gradient text-white shadow-md shadow-rose-500/20"
                  >
                    Simpan Progres
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Goal Modal */}
          {showAddGoalModal && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
              <div className="bg-white dark:bg-neutral-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-gray-100 dark:border-neutral-800 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800 mb-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Buat Target / Goals Baru
                  </h3>
                  <button
                    onClick={() => setShowAddGoalModal(false)}
                    className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateGoal} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                      Judul Target
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Tabungan Dana Darurat, Beli Laptop"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                      Kategori
                    </label>
                    <select
                      value={goalCategory}
                      onChange={(e) => setGoalCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                    >
                      <option value="Tabungan">Tabungan</option>
                      <option value="Investasi">Investasi</option>
                      <option value="Habit">Habit & Kebiasaan</option>
                      <option value="Belanja Impian">Belanja Impian</option>
                      <option value="Karier">Karier & Edukasi</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                        Nominal Target (Rp)
                      </label>
                      <input
                        type="number"
                        placeholder="10000000"
                        value={goalTargetAmount}
                        onChange={(e) => setGoalTargetAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-mono dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                        Terkumpul Saat Ini (Rp)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={goalCurrentAmount}
                        onChange={(e) => setGoalCurrentAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-mono dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                      Batas Waktu (Deadline)
                    </label>
                    <input
                      type="date"
                      value={goalDeadline}
                      onChange={(e) => setGoalDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-mono dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                      Catatan / Strategi
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Sisihkan 20% gaji tiap tanggal 1"
                      value={goalNotes}
                      onChange={(e) => setGoalNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs dark:text-white"
                    />
                  </div>

                  <div className="pt-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddGoalModal(false)}
                      className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-neutral-700 text-xs font-bold text-gray-600 dark:text-neutral-400"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-2xl insta-gradient text-white text-xs font-bold shadow-md shadow-rose-500/25"
                    >
                      Simpan Target
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SUB-TAB: JURNAL CATATAN HARIAN */}
      {activeSubTab === 'journal' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
            {/* Header & Date Picker */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800 mb-4">
              <div className="flex items-center space-x-2">
                <BookHeart size={18} className="text-rose-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Jurnal & Catatan Harian
                </h3>
              </div>

              {/* Date Input */}
              <input
                type="date"
                value={journalDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-2.5 py-1 text-xs font-mono font-bold rounded-xl bg-gray-100 dark:bg-neutral-800 border-none dark:text-white focus:outline-none"
              />
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-4">
              {/* Mood Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-2">
                  Bagaimana perasaan & mood kamu hari ini?
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {MOODS.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                        mood === m.id
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 scale-105 shadow-sm'
                          : 'bg-gray-50 dark:bg-neutral-800/60 border border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-[9px] font-semibold text-gray-600 dark:text-neutral-400 mt-1 truncate max-w-full">
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gratitude Box (3 Hal Yang Disyukuri) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1 flex items-center">
                  <Heart size={14} className="text-rose-500 mr-1 fill-rose-500" />
                  Hal Yang Sangat Disyukuri Hari Ini
                </label>
                <textarea
                  rows={2}
                  placeholder="1. Kesehatan keluarga yang terjaga&#10;2. Pekerjaan berjalan lancar&#10;3. Waktu luang untuk belajar"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Highlight Box */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1 flex items-center">
                  <Sparkles size={14} className="text-amber-500 mr-1" />
                  Momen Terbaik / Kemenangan Kecil Hari Ini
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Menyelesaikan tugas tepat waktu tanpa terdistraksi"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Reflection / Catatan Evaluasi Harian */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1 flex items-center">
                  <Edit3 size={14} className="text-blue-500 mr-1" />
                  Catatan Harian & Evaluasi Diri
                </label>
                <textarea
                  rows={3}
                  placeholder="Tulis cerita harimu, apa yang berjalan baik, apa yang bisa diperbaiki besok..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Save Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl insta-gradient text-white text-xs font-bold shadow-md shadow-rose-500/25 active:scale-95 transition"
                >
                  {existingJournal ? 'Perbarui Jurnal Hari Ini' : 'Simpan Jurnal Hari Ini'}
                </button>

                {saveSuccessMessage && (
                  <p className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 animate-bounce">
                    ✓ Jurnal berhasil disimpan offline!
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Previous Journal History List */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Riwayat Jurnal Tersimpan ({journals.length})
            </h4>

            {journals.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                Belum ada jurnal tersimpan. Mulai tulis harimu di atas!
              </p>
            ) : (
              <div className="space-y-2.5">
                {journals.map((entry) => {
                  const entryMood = MOODS.find((m) => m.id === entry.mood);

                  return (
                    <div
                      key={entry.id}
                      onClick={() => handleDateChange(entry.date)}
                      className="p-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/60 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{entryMood?.emoji || '📝'}</span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white capitalize">
                            {formatIndonesianDate(entry.date)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Hapus jurnal tanggal ${entry.date}?`)) {
                              onDeleteJournal(entry.id);
                            }
                          }}
                          className="text-gray-300 hover:text-rose-500 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {entry.highlight && (
                        <p className="text-[11px] font-medium text-rose-500 mb-1">
                          ✨ {entry.highlight}
                        </p>
                      )}

                      {entry.reflection && (
                        <p className="text-[11px] text-gray-600 dark:text-neutral-400 line-clamp-2">
                          {entry.reflection}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
