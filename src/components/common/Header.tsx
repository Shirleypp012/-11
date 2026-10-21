import React, { useState, useEffect } from 'react';
import { NavTab } from '../../types';
import { 
  Flame, 
  Search, 
  Sparkles, 
  Store, 
  Workflow, 
  MessageSquareText, 
  Clock,
  Compass
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onQuickScan: () => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onQuickScan,
  isScanning,
}) => {
  // Dual 11 Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 22,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'warroom', label: '作战指挥部', icon: Flame },
    { id: 'selection', label: '选品研究', icon: Search },
    { id: 'social_insight', label: '社媒洞察', icon: Compass },
    { id: 'visuals', label: '素材工坊', icon: Sparkles },
    { id: 'store', label: '店铺系统', icon: Store },
    { id: 'automation', label: '自动化运营', icon: Workflow },
    { id: 'support', label: '客服转化', icon: MessageSquareText },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Zone 1: Wordmark with domain character */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectTab('warroom')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-200">
            <Flame className="w-4 h-4 fill-amber-200 text-amber-200" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
              赤霄 11.11 运营中枢
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links (Clean light segmented/subtle buttons) */}
      <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-red-600 font-semibold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-600' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions & Dual 11 Ticker */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Countdown Ticker */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span className="text-slate-500 font-medium">大促爆发倒计时:</span>
          <span className="font-mono tabular-nums text-red-600 font-semibold">
            {timeLeft.days}天{String(timeLeft.hours).padStart(2, '0')}时{String(timeLeft.minutes).padStart(2, '0')}分{String(timeLeft.seconds).padStart(2, '0')}秒
          </span>
        </div>

        {/* Global Quick Scan Action */}
        <button
          onClick={onQuickScan}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all disabled:opacity-60 whitespace-nowrap cursor-pointer"
        >
          <Search className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? '全网巡检中...' : '全网巡检'}</span>
        </button>
      </div>
    </header>
  );
};
