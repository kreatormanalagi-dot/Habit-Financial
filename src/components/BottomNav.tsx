import React from 'react';
import { CheckCircle2, Wallet, BarChart3, BookOpen } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'beranda' as ActiveTab,
      label: 'Beranda',
      sublabel: 'Habits',
      icon: CheckCircle2,
    },
    {
      id: 'financial' as ActiveTab,
      label: 'Financial',
      sublabel: 'Keuangan',
      icon: Wallet,
    },
    {
      id: 'rangkuman' as ActiveTab,
      label: 'Rangkuman',
      sublabel: 'Laporan',
      icon: BarChart3,
    },
    {
      id: 'goals_journal' as ActiveTab,
      label: 'Goals & Jurnal',
      sublabel: 'Target & Diary',
      icon: BookOpen,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-gray-100 dark:border-neutral-800 transition-colors">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1 px-2 flex flex-col items-center justify-center transition-all duration-200 relative group ${
                isActive
                  ? 'text-gray-900 dark:text-white font-bold'
                  : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 font-medium'
              }`}
            >
              {/* Active top dot indicator */}
              {isActive && (
                <span className="absolute top-0 w-1.5 h-1.5 rounded-full insta-gradient" />
              )}

              <div
                className={`p-1 rounded-xl transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-rose-500 dark:text-rose-400' : ''}
                />
              </div>

              <span className="text-[11px] leading-tight tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
