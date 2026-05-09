import { Shield, ChevronRight } from 'lucide-react';

interface AdminSidebarProps {
  user: any;
  navItems: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminSidebar = ({ user, navItems, activeTab, setActiveTab }: AdminSidebarProps) => {
  return (
    <div className="hidden lg:flex flex-col w-64 bg-[var(--bg-card)] border-r border-[var(--border-light)] fixed h-[calc(100vh-4.5rem)] z-20 overflow-y-auto pb-6" style={{ top: '4.5rem' }}>
      
      {/* Admin Profile */}
      <div className="px-5 py-6 border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white flex items-center justify-center font-bold text-lg shadow-lg">
            {user?.avatar}
          </div>
          <div>
            <div className="font-bold text-sm text-[var(--text-main)] truncate max-w-[130px]">{user?.name}</div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold flex items-center gap-1">
              <Shield size={10} className="text-[var(--primary)]" /> Administrator
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 px-3 pt-4">
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
            {activeTab === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>
    </div>
  );
};
