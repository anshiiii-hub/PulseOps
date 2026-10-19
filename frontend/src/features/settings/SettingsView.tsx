import React, { useState } from 'react';
import { Settings, Building2, Bell, Shield, Save, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [orgName, setOrgName] = useState('Metropolitan Research & Campus Operations');
  const [adminEmail, setAdminEmail] = useState('ops-admin@metrolab.org');
  const [leadTimeDays, setLeadTimeDays] = useState(3);
  const [minAttendanceTarget, setMinAttendanceTarget] = useState(75);
  const [enableDailyEmail, setEnableDailyEmail] = useState(true);
  const [enableCriticalSms, setEnableCriticalSms] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EBE8]">
        <div>
          <h2 className="text-2xl font-bold text-[#202824]">
            System &amp; Organization Configuration
          </h2>
          <p className="text-xs text-[#777F79]">
            Configure operational entities, baseline threshold rules, and automated notification dispatches.
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-[#39745B] font-semibold bg-[#EDF4F0] px-3 py-1.5 rounded border border-[#D1E3D7]">
            <Check size={14} />
            <span>Settings saved successfully</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Organization Profile */}
        <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E2E6E2] space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#202824] pb-2 border-b border-[#F0F2EF]">
            <Building2 size={16} className="text-[#39745B]" />
            <span>Institutional Profile</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#555E58] font-medium mb-1">Organization / Campus Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] text-xs"
              />
            </div>
            <div>
              <label className="block text-[#555E58] font-medium mb-1">Lead Administrative Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Default Threshold Baselines */}
        <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E2E6E2] space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#202824] pb-2 border-b border-[#F0F2EF]">
            <Shield size={16} className="text-[#39745B]" />
            <span>Global Threshold Baselines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#555E58] font-medium mb-1">Standard Vendor Replenishment Lead Time (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] text-xs font-mono"
              />
              <div className="text-[10px] text-[#777F79] mt-1">Used by AI dynamic safety stock optimizer.</div>
            </div>
            <div>
              <label className="block text-[#555E58] font-medium mb-1">Default Minimum Attendance Policy Target (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={minAttendanceTarget}
                onChange={(e) => setMinAttendanceTarget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] text-xs font-mono"
              />
              <div className="text-[10px] text-[#777F79] mt-1">Institutional requirement for compliance certification.</div>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Channels */}
        <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E2E6E2] space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#202824] pb-2 border-b border-[#F0F2EF]">
            <Bell size={16} className="text-[#39745B]" />
            <span>Automated Escalation Channels</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded border border-[#EAEFEA] bg-[#FAFBF9] cursor-pointer">
              <input
                type="checkbox"
                checked={enableDailyEmail}
                onChange={(e) => setEnableDailyEmail(e.target.checked)}
                className="w-4 h-4 accent-[#39745B]"
              />
              <div>
                <div className="font-semibold text-[#202824]">Daily Executive Operations Summary (Email)</div>
                <div className="text-[11px] text-[#777F79]">Dispatches 08:00 AM briefing detailing stockout horizons and at-risk members.</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded border border-[#EAEFEA] bg-[#FAFBF9] cursor-pointer">
              <input
                type="checkbox"
                checked={enableCriticalSms}
                onChange={(e) => setEnableCriticalSms(e.target.checked)}
                className="w-4 h-4 accent-[#39745B]"
              />
              <div>
                <div className="font-semibold text-[#202824]">Immediate Critical SMS Dispatch</div>
                <div className="text-[11px] text-[#777F79]">Sends instant SMS alerts for zero-stock events and emergency absenteeism spikes.</div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 rounded bg-[#39745B] hover:bg-[#2E5E4A] text-[#FFFFFF] font-semibold shadow-xs text-xs"
          >
            <Save size={14} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
