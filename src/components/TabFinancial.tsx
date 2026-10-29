import React, { useState } from 'react';
import { 
  Plus, TrendingUp, TrendingDown, Wallet, 
  ArrowDownLeft, ArrowUpRight, Trash2, X, Filter
} from 'lucide-react';
import { Transaction, TransactionType, TransactionCategory } from '../types';
import { 
  formatCurrency, formatIndonesianDate, getTodayDateString, 
  MONTH_NAMES_ID 
} from '../utils/date';
import { CalendarMonth } from './CalendarMonth';

interface TabFinancialProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (txId: string) => void;
  selectedDateStr: string;
  setSelectedDateStr: (date: string) => void;
  calendarYear: number;
  calendarMonth: number;
  setCalendarYear: (y: number) => void;
  setCalendarMonth: (m: number) => void;
}

const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'Makanan', 'Transport', 'Belanja', 'Tagihan', 
  'Hiburan', 'Kesehatan', 'Pendidikan', 'Sedekah', 'Lain-lain'
];

const INCOME_CATEGORIES: TransactionCategory[] = [
  'Gaji', 'Bisnis', 'Investasi', 'Bonus', 'Lain-lain'
];

const QUICK_AMOUNTS = [20000, 50000, 100000, 250000, 500000, 1000000];

export const TabFinancial: React.FC<TabFinancialProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  selectedDateStr,
  setSelectedDateStr,
  calendarYear,
  calendarMonth,
  setCalendarYear,
  setCalendarMonth,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [summaryView, setSummaryView] = useState<'month' | 'year'>('month');
  const [viewFilter, setViewFilter] = useState<'selected_date' | 'all_month'>('selected_date');

  // Form states
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Makanan');
  const [description, setDescription] = useState('');
  const [txDate, setTxDate] = useState(selectedDateStr);

  const todayStr = getTodayDateString();

  // Filter calculations:
  // 1. Month transactions (based on calendarYear and calendarMonth)
  const currentMonthStr = String(calendarMonth + 1).padStart(2, '0');
  const monthPrefix = `${calendarYear}-${currentMonthStr}`;

  const monthTransactions = transactions.filter((tx) => tx.date.startsWith(monthPrefix));
  const monthIncome = monthTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const monthExpense = monthTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const monthBalance = monthIncome - monthExpense;

  // 2. Year transactions (based on calendarYear)
  const yearPrefix = `${calendarYear}-`;
  const yearTransactions = transactions.filter((tx) => tx.date.startsWith(yearPrefix));
  const yearIncome = yearTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const yearExpense = yearTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const yearBalance = yearIncome - yearExpense;

  // Financial badges for the monthly calendar
  const financialBadges: { [dateStr: string]: { hasIncome: boolean; hasExpense: boolean } } = {};
  transactions.forEach((tx) => {
    if (!financialBadges[tx.date]) {
      financialBadges[tx.date] = { hasIncome: false, hasExpense: false };
    }
    if (tx.type === 'income') financialBadges[tx.date].hasIncome = true;
    if (tx.type === 'expense') financialBadges[tx.date].hasExpense = true;
  });

  // Displayed transactions below calendar
  const displayedTransactions =
    viewFilter === 'selected_date'
      ? transactions.filter((tx) => tx.date === selectedDateStr)
      : monthTransactions;

  // Submit new transaction
  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountStr.replace(/[^0-9]/g, ''));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Masukkan nominal yang valid');
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      type: txType,
      amount: parsedAmount,
      category,
      description: description.trim() || category,
      date: txDate,
      time: timeStr,
      createdAt: new Date().toISOString(),
    };

    onAddTransaction(newTx);
    setAmountStr('');
    setDescription('');
    setShowAddModal(false);
  };

  const openAddModal = (dateStr: string, defaultType: TransactionType = 'expense') => {
    setTxDate(dateStr);
    setTxType(defaultType);
    setCategory(defaultType === 'income' ? 'Gaji' : 'Makanan');
    setAmountStr('');
    setDescription('');
    setShowAddModal(true);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Summary Cards (Monthly vs Yearly Toggle) */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Wallet size={18} className="text-emerald-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Rangkuman Keuangan
            </h3>
          </div>

          {/* Toggle Bulan Ini vs Tahun Ini */}
          <div className="flex bg-gray-100 dark:bg-neutral-800 p-0.5 rounded-full text-xs font-semibold">
            <button
              onClick={() => setSummaryView('month')}
              className={`px-3 py-1 rounded-full transition ${
                summaryView === 'month'
                  ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm font-bold'
                  : 'text-gray-500 dark:text-neutral-400'
              }`}
            >
              Bulan {MONTH_NAMES_ID[calendarMonth].slice(0, 3)}
            </button>
            <button
              onClick={() => setSummaryView('year')}
              className={`px-3 py-1 rounded-full transition ${
                summaryView === 'year'
                  ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm font-bold'
                  : 'text-gray-500 dark:text-neutral-400'
              }`}
            >
              Tahun {calendarYear}
            </button>
          </div>
        </div>

        {summaryView === 'month' ? (
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Saldo Bersih Bulan Ini
            </div>
            <div
              className={`text-2xl font-extrabold tracking-tight font-mono ${
                monthBalance >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(monthBalance)}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-50 dark:border-neutral-800/60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <ArrowDownLeft size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Pemasukan</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-neutral-200 font-mono">
                    {formatCurrency(monthIncome)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Pengeluaran</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-neutral-200 font-mono">
                    {formatCurrency(monthExpense)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Total Bersih Tahun {calendarYear}
            </div>
            <div
              className={`text-2xl font-extrabold tracking-tight font-mono ${
                yearBalance >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(yearBalance)}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-50 dark:border-neutral-800/60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Pemasukan {calendarYear}</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-neutral-200 font-mono">
                    {formatCurrency(yearIncome)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <TrendingDown size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Pengeluaran {calendarYear}</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-neutral-200 font-mono">
                    {formatCurrency(yearExpense)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Monthly Interactive Calendar */}
      <CalendarMonth
        currentYear={calendarYear}
        currentMonth={calendarMonth}
        onChangeMonth={(y, m) => {
          setCalendarYear(y);
          setCalendarMonth(m);
        }}
        selectedDateStr={selectedDateStr}
        onSelectDate={setSelectedDateStr}
        financialBadges={financialBadges}
      />

      {/* 3. Date Action Banner */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">
              {selectedDateStr === todayStr ? '• Hari Ini' : 'Tanggal Terpilih'}
            </span>
            <h4 className="text-base font-bold text-gray-900 dark:text-white capitalize">
              {formatIndonesianDate(selectedDateStr)}
            </h4>
          </div>

          <button
            onClick={() => openAddModal(selectedDateStr)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full insta-gradient text-white text-xs font-bold shadow-md shadow-rose-500/25 active:scale-95 transition"
          >
            <Plus size={15} />
            <span>Catat Uang</span>
          </button>
        </div>
      </div>

      {/* 4. Google Sheets Style Data Presentation (Without Lines / Borders) */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            Rincian Transaksi
          </h4>

          {/* Filter: Selected Date vs All Month */}
          <div className="flex bg-gray-100 dark:bg-neutral-800 p-0.5 rounded-xl text-[11px] font-semibold">
            <button
              onClick={() => setViewFilter('selected_date')}
              className={`px-2.5 py-1 rounded-lg transition ${
                viewFilter === 'selected_date'
                  ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white font-bold shadow-xs'
                  : 'text-gray-500 dark:text-neutral-400'
              }`}
            >
              Tanggal Ini
            </button>
            <button
              onClick={() => setViewFilter('all_month')}
              className={`px-2.5 py-1 rounded-lg transition ${
                viewFilter === 'all_month'
                  ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white font-bold shadow-xs'
                  : 'text-gray-500 dark:text-neutral-400'
              }`}
            >
              Semua Bulan Ini
            </button>
          </div>
        </div>

        {/* Google Sheets Borderless Column Headers */}
        <div className="grid grid-cols-12 px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 dark:text-neutral-500 uppercase border-b border-gray-50 dark:border-neutral-800/50">
          <div className="col-span-2">WAKTU</div>
          <div className="col-span-3">KATEGORI</div>
          <div className="col-span-4">DESKRIPSI</div>
          <div className="col-span-3 text-right">NOMINAL</div>
        </div>

        {/* Google Sheets Borderless Data Rows */}
        {displayedTransactions.length === 0 ? (
          <div className="py-8 text-center text-gray-400 dark:text-neutral-500">
            <p className="text-xs font-medium">Belum ada transaksi pada tanggal ini.</p>
            <button
              onClick={() => openAddModal(selectedDateStr)}
              className="mt-2 text-xs font-bold text-rose-500 hover:underline"
            >
              + Catat Transaksi Baru
            </button>
          </div>
        ) : (
          <div className="divide-y divide-transparent space-y-1 mt-1">
            {displayedTransactions.map((tx) => {
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="grid grid-cols-12 items-center px-2 py-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
                >
                  {/* Waktu & Tanggal */}
                  <div className="col-span-2">
                    <p className="text-[11px] font-mono font-medium text-gray-600 dark:text-neutral-400">
                      {tx.time || '--:--'}
                    </p>
                    {viewFilter === 'all_month' && (
                      <p className="text-[9px] text-gray-400">
                        {tx.date.slice(8, 10)} {MONTH_NAMES_ID[Number(tx.date.slice(5, 7)) - 1].slice(0, 3)}
                      </p>
                    )}
                  </div>

                  {/* Kategori Pill */}
                  <div className="col-span-3 pr-1">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isIncome
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.category}
                    </span>
                  </div>

                  {/* Deskripsi */}
                  <div className="col-span-4 pr-1">
                    <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">
                      {tx.description}
                    </p>
                  </div>

                  {/* Nominal & Delete Button */}
                  <div className="col-span-3 flex items-center justify-end space-x-1">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus transaksi "${tx.description}"?`)) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-rose-500 rounded transition"
                      title="Hapus"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-gray-100 dark:border-neutral-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Catat Transaksi Finansial
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              {/* Type Switcher: Pengeluaran vs Pemasukan */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-neutral-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setTxType('expense');
                    setCategory('Makanan');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    txType === 'expense'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-gray-500 dark:text-neutral-400 hover:text-gray-800'
                  }`}
                >
                  Pengeluaran (-)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTxType('income');
                    setCategory('Gaji');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    txType === 'income'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-gray-500 dark:text-neutral-400 hover:text-gray-800'
                  }`}
                >
                  Pemasukan (+)
                </button>
              </div>

              {/* Nominal Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                />

                {/* Quick nominal chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setAmountStr(String(amt))}
                      className="text-[10px] font-mono px-2 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-700"
                    >
                      +{amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1.5">
                  Kategori
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                  {(txType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold transition ${
                        category === cat
                          ? txType === 'expense'
                            ? 'bg-rose-500 text-white'
                            : 'bg-emerald-500 text-white'
                          : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanggal & Keterangan */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-mono dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300 mb-1">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Makan siang"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-neutral-700 text-xs font-bold text-gray-600 dark:text-neutral-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-2xl text-white text-xs font-bold shadow-md ${
                    txType === 'expense'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
