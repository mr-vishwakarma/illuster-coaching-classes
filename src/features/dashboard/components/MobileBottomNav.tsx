import type { ReactNode } from 'react';

interface NavTab {
  id: string;
  icon: ReactNode;
  label: string;
  badge?: number;
}

interface MobileBottomNavProps {
  tabs: NavTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const MobileBottomNav = ({ tabs, activeTab, onTabChange }: MobileBottomNavProps) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)]/95 backdrop-blur-lg border-t border-[var(--border-light)] flex items-center justify-around px-2 py-2 safe-bottom">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 flex-1 py-2 px-1 rounded-xl transition-all relative ${
            activeTab === tab.id
              ? 'text-[var(--primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <div className="relative">
            <div className={`transition-all ${activeTab === tab.id ? 'scale-110' : ''}`}>
              {tab.icon}
            </div>
            {tab.badge ? (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full min-w-[14px] text-center leading-none">
                {tab.badge > 9 ? '9+' : tab.badge}
              </span>
            ) : null}
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-wider leading-none ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>
            {tab.label}
          </span>
          {activeTab === tab.id && (
            <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--primary)]" />
          )}
        </button>
      ))}
    </div>
  );
};

export default MobileBottomNav;
