import { ChevronRight } from 'lucide-react';

interface TutorSidebarProps {
  user: any;
  navItems: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsModalOpen: (val: boolean) => void;
}

export const TutorSidebar = ({ user, navItems, activeTab, setActiveTab, setIsModalOpen }: TutorSidebarProps) => {
  return (
    <div className="hidden lg:flex flex-col w-64 bg-[var(--bg-card)] border-r border-[var(--border-light)] fixed h-[calc(100vh-4.5rem)] z-20 overflow-y-auto pb-6" style={{ top: '4.5rem' }}>
      
      {/* Tutor Profile */}
      <div className="px-5 py-6 border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8a76ff] to-[#6c5ce7] text-white flex items-center justify-center font-bold text-lg shadow-lg">
            {user?.avatar}
          </div>
          <div>
            <div className="font-bold text-sm text-[var(--text-main)] truncate max-w-[130px]">{user?.name}</div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Expert Tutor
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
        >
          Go Live
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-3 pt-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === item.id
                ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]'
            }`}
          >
            <span className="flex items-center gap-3">{item.icon}{item.label}</span>
            {item.badge ? (
              <span className="text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{item.badge}</span>
            ) : (
              activeTab === item.id && <ChevronRight size={14} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
