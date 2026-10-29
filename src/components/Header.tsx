import React from 'react';
import { Bell, Download, Moon, Sun, Sparkles } from 'lucide-react';
import { notificationService } from '../services/notificationService';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenBackup: () => void;
  selectedDateStr: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenBackup,
}) => {
  const handleTestAlarm = async () => {
    await notificationService.sendTestNotification(
      '🔔 Habit & Financial Aktif',
      'Pengingat alarm & notifikasi perangkat Anda telah siap dan sinkron!'
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 transition-colors">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl insta-gradient flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
              Habit & Financial
            </h1>
            <p className="text-[10px] font-medium text-gray-400 dark:text-neutral-500 tracking-wide uppercase">
              Offline First • Daily Tracker
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Test Alarm Button */}
          <button
            onClick={handleTestAlarm}
            title="Uji Coba Alarm & Notifikasi"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Bell size={19} />
          </button>

          {/* Backup / Export / Import */}
          <button
            onClick={onOpenBackup}
            title="Cadangkan & Pulihkan Data"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Download size={19} />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Ganti Tema"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {darkMode ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} />}
          </button>
        </div>
      </div>
    </header>
  );
};
