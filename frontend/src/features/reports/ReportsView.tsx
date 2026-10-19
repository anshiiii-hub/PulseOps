import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  BarChart2, 
  Package, 
  Users, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface ReportsViewProps {
  onDownloadCsv: (type: 'inventory' | 'attendance' | 'alerts') => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onDownloadCsv }) => {
  const [dateRange, setDateRange] = useState('October 01 – October 19, 2026');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (type: 'inventory' | 'attendance' | 'alerts', label: string) => {
    onDownloadCsv(type);
    setDownloadSuccess(label);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EBE8]">
        <div>
          <h2 className="text-2xl font-bold text-[#202824]">
            Reports &amp; Operational Audits
          </h2>
          <p className="text-xs text-[#777F79]">
            Structured analytical dossiers ready for institutional compliance, management review, and supplier procurement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#CBD2CC] bg-[#FFFFFF] text-xs font-semibold text-[#202824] hover:bg-[#F2F5F2]"
          >
            <Printer size={13} />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-[#EDF4F0] border border-[#D1E3D7] rounded text-xs text-[#39745B] flex items-center gap-2 font-medium">
          <CheckCircle2 size={15} />
          <span>Downloaded {downloadSuccess} successfully.</span>
        </div>
      )}

      {/* Date Range Selector Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E6E2] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#555E58]">
          <Calendar size={14} className="text-[#39745B]" />
          <span>Active Audit Window:</span>
          <span className="font-mono font-bold text-[#202824]">{dateRange}</span>
        </div>
        <span className="text-[11px] font-mono text-[#777F79]">
          Generated fresh from live operational store
        </span>
      </div>

      {/* Report Dossiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Report 1: Inventory Health Audit */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E6E2] shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-[#EDF4F0] text-[#39745B] flex items-center justify-center">
              <Package size={16} />
            </div>
            <h3 className="font-semibold text-base text-[#202824]">Physical Inventory &amp; Stockout Audit</h3>
            <p className="text-xs text-[#555E58] leading-relaxed">
              Complete line-item register containing burn velocities, remaining days-to-stockout, dynamic safety stocks, and active replenishment orders.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#777F79] space-y-1">
              <div>• Covers 7 monitored SKUs</div>
              <div>• Includes 14-day depletion trends</div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F0F2EF]">
            <button
              onClick={() => handleDownload('inventory', 'Inventory Health Audit (CSV)')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded bg-[#39745B] text-[#FFFFFF] text-xs font-semibold hover:bg-[#2E5E4A] transition-colors"
            >
              <Download size={13} />
              <span>Download CSV Report</span>
            </button>
          </div>
        </div>

        {/* Report 2: Attendance & Absenteeism Review */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E6E2] shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-[#EDF4F0] text-[#39745B] flex items-center justify-center">
              <Users size={16} />
            </div>
            <h3 className="font-semibold text-base text-[#202824]">Cohort Turnout &amp; Absenteeism Digest</h3>
            <p className="text-xs text-[#555E58] leading-relaxed">
              Individual participation records, cumulative percentages, multi-factor risk scores, and audited repeated absence streaks across departments.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#777F79] space-y-1">
              <div>• 8 active cohort members</div>
              <div>• Day-of-week slump analysis</div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F0F2EF]">
            <button
              onClick={() => handleDownload('attendance', 'Attendance Digest (CSV)')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded bg-[#39745B] text-[#FFFFFF] text-xs font-semibold hover:bg-[#2E5E4A] transition-colors"
            >
              <Download size={13} />
              <span>Download CSV Report</span>
            </button>
          </div>
        </div>

        {/* Report 3: Exceptions & Incident Log */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E6E2] shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-[#FDF6EB] text-[#D99A32] flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
            <h3 className="font-semibold text-base text-[#202824]">Operational Incidents &amp; Alerts Log</h3>
            <p className="text-xs text-[#555E58] leading-relaxed">
              Comprehensive log of threshold violations, critical stockout events, acknowledgement timestamps, and resolution records by operators.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#777F79] space-y-1">
              <div>• Chronological exception history</div>
              <div>• Audit timestamps &amp; operators</div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F0F2EF]">
            <button
              onClick={() => handleDownload('alerts', 'Operational Exceptions Log (CSV)')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded bg-[#39745B] text-[#FFFFFF] text-xs font-semibold hover:bg-[#2E5E4A] transition-colors"
            >
              <Download size={13} />
              <span>Download CSV Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
