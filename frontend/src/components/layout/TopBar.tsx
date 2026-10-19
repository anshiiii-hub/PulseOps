import React, { useState } from 'react';
import { Search, Bell, Clock, Building2, ChevronDown, Check, X } from 'lucide-react';
import { NavTab } from './Sidebar';

interface TopBarProps {
  currentTab: NavTab;
  onSearchClick: () => void;
  activeAlertCount: number;
  onSelectDepartment: (dept: string) => void;
  selectedDepartment: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSearchClick,
  activeAlertCount,
  onSelectDepartment,
  selectedDepartment,
}) => {
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  const tabTitles: Record<NavTab, { title: string; category: string }> = {
    overview: { title: 'Operations Overview', category: 'Executive Workspace' },
    inventory: { title: 'Inventory Management', category: 'Physical Asset Tracking' },
    attendance: { title: 'Attendance & Cohorts', category: 'Human Capital Analytics' },
    activity: { title: 'Live Control Room', category: 'Real-Time Ingestion Stream' },
    alerts: { title: 'Alerts & Operational Exceptions', category: 'Incident Management' },
    reports: { title: 'Reports & Audits', category: 'Analytics & Compliance' },
    rules: { title: 'Threshold Rules Engine', category: 'Policy Configuration' },
    settings: { title: 'System & Organization Settings', category: 'Administration' },
  };

  const departments = [
    'All Operations & Units',
    'Robotics & Hardware Lab',
    'AI & Autonomous Systems Cohort',
    'Data Systems Department',
    'ML Operations Team',
  ];

  const currentMeta = tabTitles[currentTab] || { title: 'PulseOps', category: 'System' };

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E8EBE8] px-8 flex items-center justify-between z-10 sticky top-0">
      {/* Breadcrumb & Section Name */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-[#777F79] font-mono">
            <span>PulseOps</span>
            <span>/</span>
            <span className="text-[#39745B] font-medium">{currentMeta.category}</span>
          </div>
          <h1 className="text-base font-semibold text-[#202824] leading-tight">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center gap-3">
        {/* Creator Attribution */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F4F7F4] border border-[#E0E7E2] text-xs">
          <span className="text-[#777F79]">Engineered by</span>
          <span className="font-semibold text-[#2B6149]">Anshita Dawar</span>
        </div>

        {/* Department / Unit Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDeptDropdown(!showDeptDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E2E6E2] bg-[#FAFBF9] text-xs font-medium text-[#202824] hover:bg-[#F2F5F2] transition-colors"
          >
            <Building2 size={14} className="text-[#39745B]" />
            <span className="max-w-[180px] truncate">{selectedDepartment}</span>
            <ChevronDown size={13} className="text-[#777F79]" />
          </button>

          {showDeptDropdown && (
            <div className="absolute right-0 mt-1 w-64 bg-[#FFFFFF] border border-[#E0E4E0] rounded-md shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#777F79] border-b border-[#EAEFEA]">
                Filter by Operational Unit
              </div>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    onSelectDepartment(dept);
                    setShowDeptDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#202824] hover:bg-[#F4F7F4] flex items-center justify-between"
                >
                  <span className={selectedDepartment === dept ? 'font-semibold text-[#39745B]' : ''}>
                    {dept}
                  </span>
                  {selectedDepartment === dept && <Check size={14} className="text-[#39745B]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Button */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E2E6E2] bg-[#FAFBF9] text-xs text-[#777F79] hover:border-[#39745B] hover:text-[#202824] transition-all w-48 justify-between"
        >
          <div className="flex items-center gap-1.5">
            <Search size={13} className="text-[#777F79]" />
            <span>Search records...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E8EBE8] text-[#555C57]">
            ⌘K
          </kbd>
        </button>

        {/* Sync Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-[#777F79] font-mono border-l border-[#E8EBE8] pl-4">
          <Clock size={13} className="text-[#9BA39D]" />
          <span>Synced 12s ago</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            className="p-2 rounded-md hover:bg-[#F2F5F2] text-[#555D57] transition-colors relative"
            title="Operational Alerts"
          >
            <Bell size={16} />
            {activeAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C85C52]"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
