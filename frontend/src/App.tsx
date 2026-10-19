import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { SearchModal } from './components/navigation/SearchModal';
import { OverviewView } from './features/dashboard/OverviewView';
import { InventoryView } from './features/inventory/InventoryView';
import { AttendanceView } from './features/attendance/AttendanceView';
import { LiveActivityView } from './features/live-activity/LiveActivityView';
import { AlertsView } from './features/alerts/AlertsView';
import { ReportsView } from './features/reports/ReportsView';
import { ThresholdRulesView } from './features/threshold-rules/ThresholdRulesView';
import { SettingsView } from './features/settings/SettingsView';
import { PulseApi } from './services/api';
import { 
  InventoryItem, 
  AttendanceRecord, 
  Alert, 
  ActivityEvent, 
  ThresholdRule, 
  OverviewMetrics 
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [selectedDept, setSelectedDept] = useState('All Operations & Units');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core application data state
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [rules, setRules] = useState<ThresholdRule[]>([]);
  const [loading, setLoading] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    try {
      const [m, inv, att, alt, act, rul] = await Promise.all([
        PulseApi.getOverview(),
        PulseApi.getInventory(),
        PulseApi.getAttendance(),
        PulseApi.getAlerts(),
        PulseApi.getActivity(),
        PulseApi.getRules()
      ]);
      setMetrics(m);
      setInventory(inv);
      setAttendance(att);
      setAlerts(alt);
      setActivities(act);
      setRules(rul);
    } catch (err) {
      console.error('Failed to load telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustStock = async (itemId: string, delta: number, note?: string) => {
    try {
      const updated = await PulseApi.adjustStock(itemId, delta, note);
      showToast(`Stock updated: ${updated.name} (${updated.quantity} ${updated.unit})`);
      await loadData();
    } catch (err) {
      showToast('Failed to adjust stock');
    }
  };

  const handleAddItem = async (data: any) => {
    try {
      const created = await PulseApi.addInventoryItem(data);
      showToast(`Registered SKU: ${created.name}`);
      await loadData();
    } catch (err) {
      showToast('Failed to register item');
    }
  };

  const handleUpdateMemberStatus = async (memberId: string, status: any) => {
    try {
      const updated = await PulseApi.updateMemberStatus(memberId, status);
      showToast(`Updated ${updated.name} to ${status}`);
      await loadData();
    } catch (err) {
      showToast('Failed to update attendance');
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await PulseApi.acknowledgeAlert(id);
      showToast(`Exception ${id} acknowledged by operator`);
      await loadData();
    } catch (err) {
      showToast('Failed to acknowledge alert');
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await PulseApi.resolveAlert(id);
      showToast(`Exception ${id} successfully resolved`);
      await loadData();
    } catch (err) {
      showToast('Failed to resolve alert');
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    try {
      const updated = await PulseApi.toggleRule(ruleId);
      showToast(`Rule '${updated.title}' ${updated.isActive ? 'enabled' : 'disabled'}`);
      await loadData();
    } catch (err) {
      showToast('Failed to toggle rule');
    }
  };

  const handleDownloadCsv = (type: 'inventory' | 'attendance' | 'alerts') => {
    PulseApi.downloadCsv(type);
    showToast(`Generating ${type} audit CSV download`);
  };

  const activeAlertCount = alerts.filter(a => a.status !== 'resolved').length;

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#39745B] border-t-transparent animate-spin"></div>
          <div className="text-xs font-mono text-[#777F79] tracking-wider uppercase">Initializing PulseOps Telemetry...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F6F2]">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeAlertCount={activeAlertCount}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          currentTab={currentTab}
          onSearchClick={() => setIsSearchOpen(true)}
          activeAlertCount={activeAlertCount}
          onSelectDepartment={setSelectedDept}
          selectedDepartment={selectedDept}
        />

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewView
              metrics={metrics}
              alerts={alerts}
              activities={activities}
              onNavigateTab={setCurrentTab}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onResolveAlert={handleResolveAlert}
              onExportReport={() => handleDownloadCsv('inventory')}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryView
              items={inventory}
              onAdjustStock={handleAdjustStock}
              onAddItem={handleAddItem}
              onExportCsv={() => handleDownloadCsv('inventory')}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              records={attendance}
              onUpdateMemberStatus={handleUpdateMemberStatus}
              onExportCsv={() => handleDownloadCsv('attendance')}
            />
          )}

          {currentTab === 'activity' && (
            <LiveActivityView
              activities={activities}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onResolveAlert={handleResolveAlert}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              onDownloadCsv={handleDownloadCsv}
            />
          )}

          {currentTab === 'rules' && (
            <ThresholdRulesView
              rules={rules}
              onToggleRule={handleToggleRule}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}

          {/* Master Footer Attribution */}
          <footer className="mt-14 pt-6 border-t border-[#E4E8E4] flex flex-col sm:flex-row items-center justify-between text-xs text-[#777F79] gap-3 pb-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#202824]">PulseOps</span>
              <span>— Real-Time Operational Intelligence System</span>
            </div>
            <div>
              <span>Designed and Developed by </span>
              <span className="font-semibold text-[#39745B]">Anshita Dawar</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Cmd+K Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        inventory={inventory}
        attendance={attendance}
        alerts={alerts}
        onNavigateTab={setCurrentTab}
      />

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#202824] text-[#FFFFFF] px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-medium animate-enter">
          <CheckCircle2 size={15} className="text-[#81C784]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
