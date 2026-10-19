import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Sliders, 
  Settings,
  ChevronRight
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'inventory' 
  | 'attendance' 
  | 'activity' 
  | 'alerts' 
  | 'reports' 
  | 'rules' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, activeAlertCount }) => {
  const navItems = [
    { id: 'overview' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory' as NavTab, label: 'Inventory', icon: Package },
    { id: 'attendance' as NavTab, label: 'Attendance', icon: Users },
    { id: 'activity' as NavTab, label: 'Live Activity', icon: Activity },
    { 
      id: 'alerts' as NavTab, 
      label: 'Alerts & Exceptions', 
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined 
    },
    { id: 'reports' as NavTab, label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'rules' as NavTab, label: 'Threshold Rules', icon: Sliders },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#192A27] text-[#EDF3F0] flex flex-col flex-shrink-0 min-h-screen border-r border-[#223733]">
      {/* Brand Header */}
      <div className="p-6 pb-5 border-b border-[#223733]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#39745B] flex items-center justify-center font-bold text-sm tracking-wider text-[#EDF3F0] border border-[#488A6E]">
            PO
          </div>
          <div>
            <div className="font-semibold text-base tracking-tight text-[#FFFFFF] font-sans">
              PulseOps
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#8FA29B] uppercase">
              By Anshita Dawar
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#6B8077]">
          Workspaces
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#2B4540] text-[#FFFFFF] font-semibold border-l-2 border-[#81C784]'
                  : 'text-[#B0C0B8] hover:bg-[#223733] hover:text-[#FFFFFF]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={isActive ? 'text-[#81C784]' : 'text-[#8FA29B]'} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#C85C52] text-[#FFFFFF]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Environment Status & Creator Footnote */}
      <div className="p-4 border-t border-[#223733] bg-[#142320]">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#223733]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
            <span className="text-[11px] font-mono text-[#A1B3AC]">Live Monitoring Active</span>
          </div>
          <span className="text-[10px] font-mono text-[#6E827A] px-1.5 py-0.5 rounded bg-[#1B2D29]">
            Local API
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#39745B] border border-[#488A6E] flex items-center justify-center text-xs font-bold text-[#FFFFFF] shadow-xs">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#EDF3F0] truncate">Anshita Dawar</div>
            <div className="text-[10px] font-mono text-[#8FA29B] truncate">Creator &amp; Lead Engineer</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
