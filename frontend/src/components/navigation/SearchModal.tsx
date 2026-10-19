import React, { useState, useEffect } from 'react';
import { Search, Package, Users, AlertTriangle, X, ArrowRight } from 'lucide-react';
import { InventoryItem, AttendanceRecord, Alert } from '../../types';
import { NavTab } from '../layout/Sidebar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  attendance: AttendanceRecord[];
  alerts: Alert[];
  onNavigateTab: (tab: NavTab) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  inventory,
  attendance,
  alerts,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingInventory = q ? inventory.filter(i => 
    i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchingAttendance = q ? attendance.filter(a => 
    a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchingAlerts = q ? alerts.filter(a => 
    a.title.toLowerCase().includes(q) || a.entity.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 p-4 z-50">
      <div className="bg-[#FFFFFF] rounded-lg max-w-xl w-full shadow-2xl border border-[#E2E6E2] overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E8EBE8] flex items-center gap-3">
          <Search size={18} className="text-[#39745B]" />
          <input
            type="text"
            autoFocus
            placeholder="Search SKUs, members, exceptions across PulseOps..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-[#202824] placeholder-[#9BA39D] focus:outline-none"
          />
          <button onClick={onClose} className="text-[#777F79] hover:text-[#202824]">
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
          {!q ? (
            <div className="text-center py-8 text-[#777F79] font-mono">
              Type to search items, members, or operational alerts...
            </div>
          ) : (
            <>
              {/* Inventory results */}
              {matchingInventory.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#777F79] mb-2 flex items-center gap-1.5">
                    <Package size={12} className="text-[#39745B]" />
                    <span>Inventory SKUs ({matchingInventory.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingInventory.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigateTab('inventory');
                          onClose();
                        }}
                        className="w-full text-left p-2 rounded hover:bg-[#F4F7F4] flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-[#202824]">{item.name}</div>
                          <div className="text-[11px] font-mono text-[#777F79]">{item.sku} · {item.quantity} {item.unit} available</div>
                        </div>
                        <ArrowRight size={13} className="text-[#9BA39D] group-hover:text-[#39745B]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendance results */}
              {matchingAttendance.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#777F79] mb-2 flex items-center gap-1.5">
                    <Users size={12} className="text-[#39745B]" />
                    <span>Cohort Members ({matchingAttendance.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingAttendance.map(m => (
                      <button
                        key={m.memberId}
                        onClick={() => {
                          onNavigateTab('attendance');
                          onClose();
                        }}
                        className="w-full text-left p-2 rounded hover:bg-[#F4F7F4] flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-[#202824]">{m.name}</div>
                          <div className="text-[11px] font-mono text-[#777F79]">{m.code} · {m.department} ({m.currentPercentage}%)</div>
                        </div>
                        <ArrowRight size={13} className="text-[#9BA39D] group-hover:text-[#39745B]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerts results */}
              {matchingAlerts.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#777F79] mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={12} className="text-[#D99A32]" />
                    <span>Exceptions &amp; Alerts ({matchingAlerts.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingAlerts.map(a => (
                      <button
                        key={a.id}
                        onClick={() => {
                          onNavigateTab('alerts');
                          onClose();
                        }}
                        className="w-full text-left p-2 rounded hover:bg-[#F4F7F4] flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-[#202824]">{a.title}</div>
                          <div className="text-[11px] font-mono text-[#777F79]">{a.id} · {a.entity}</div>
                        </div>
                        <ArrowRight size={13} className="text-[#9BA39D] group-hover:text-[#39745B]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingInventory.length === 0 && matchingAttendance.length === 0 && matchingAlerts.length === 0 && (
                <div className="text-center py-8 text-[#777F79] font-mono">
                  No records matching "{query}".
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#FAFBF9] border-t border-[#E8EBE8] flex items-center justify-between text-[11px] text-[#777F79] font-mono">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
