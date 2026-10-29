export const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DAY_NAMES_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
export const FULL_DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseDateStr(dateStr);
  const dayName = FULL_DAY_NAMES_ID[date.getDay()];
  const day = date.getDate();
  const monthName = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${monthName} ${year}`;
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseDateStr(dateStr);
  const day = date.getDate();
  const monthName = MONTH_NAMES_ID[date.getMonth()].slice(0, 3);
  return `${day} ${monthName}`;
}

export function formatMonthYear(year: number, monthIndex: number): string {
  return `${MONTH_NAMES_ID[monthIndex]} ${year}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export interface CalendarDay {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function generateCalendarDays(year: number, monthIndex: number): CalendarDay[] {
  const todayStr = getTodayDateString();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  // We want Monday (1) to Sunday (0) or Sunday (0) to Saturday (6).
  // Standard Indo week usually starts Monday:
  // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  // Let's use Monday as first day:
  let firstDayIndex = firstDay.getDay(); // 0 is Sun
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // 0 for Mon, 6 for Sun

  const days: CalendarDay[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevDate = new Date(year, monthIndex - 1, dayNum);
    const dateStr = formatDateStr(prevDate);
    days.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  // Current month days
  const totalDays = lastDay.getDate();
  for (let i = 1; i <= totalDays; i++) {
    const currDate = new Date(year, monthIndex, i);
    const dateStr = formatDateStr(currDate);
    days.push({
      dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    });
  }

  // Next month padding to fill grid (multiple of 7)
  const remainingDays = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(year, monthIndex + 1, i);
    const dateStr = formatDateStr(nextDate);
    days.push({
      dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  return days;
}
