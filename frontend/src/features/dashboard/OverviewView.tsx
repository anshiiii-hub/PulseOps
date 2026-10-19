import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Sliders, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { OverviewMetrics, Alert, ActivityEvent } from '../../types';

interface OverviewViewProps {
  metrics: OverviewMetrics;
  alerts: Alert[];
  activities: ActivityEvent[];
  onNavigateTab: (tab: any) => void;
  onAcknowledgeAlert: (id: string) => void;
  onResolveAlert: (id: string) => void;
  onExportReport: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  alerts,
  activities,
  onNavigateTab,
  onAcknowledgeAlert,
  onResolveAlert,
  onExportReport,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'attendance' | 'inventory' | 'shortages'>('attendance');
  const [chartRange, setChartRange] = useState<'7d' | '14d' | '30d'>('14d');

  const unresolvedAlerts = alerts.filter(a => a.status !== 'resolved');

  // Multi-day trend series data for interactive SVG chart
  const attendanceTrendData = [
    { day: 'Mon 06', pct: 68 },
    { day: 'Tue 07', pct: 92 },
    { day: 'Wed 08', pct: 95 },
    { day: 'Thu 09', pct: 88 },
    { day: 'Fri 10', pct: 82 },
    { day: 'Mon 13', pct: 72 },
    { day: 'Tue 14', pct: 90 },
    { day: 'Wed 15', pct: 94 },
    { day: 'Thu 16', pct: 88 },
    { day: 'Fri 17', pct: 80 },
    { day: 'Mon 20', pct: 87.5 },
  ];

  const consumptionTrendData = [
    { day: 'Oct 10', units: 18 },
    { day: 'Oct 11', units: 22 },
    { day: 'Oct 12', units: 14 },
    { day: 'Oct 13', units: 29 },
    { day: 'Oct 14', units: 48 }, // Hackathon surge
    { day: 'Oct 15', units: 19 },
    { day: 'Oct 16', units: 16 },
    { day: 'Oct 17', units: 12 },
    { day: 'Oct 18', units: 15 },
    { day: 'Oct 19', units: 14 },
  ];

  return (
    <div className="space-y-8 animate-enter">
      {/* A. Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8EBE8]">
        <div>
          <div className="text-xs font-mono tracking-wider uppercase text-[#39745B] font-semibold mb-1">
            Operational Intelligence
          </div>
          <h2 className="editorial-title text-3xl md:text-4xl text-[#202824] leading-tight">
            Operations at a glance
          </h2>
          <p className="text-sm text-[#777F79] mt-1">
            Your inventory quantities and cohort attendance, synthesized in one live workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-[#FAFBF9] border border-[#E2E6E2] text-xs font-mono text-[#555E58]">
            <Calendar size={13} className="text-[#39745B]" />
            <span>Monday, October 19, 2026</span>
          </div>
          <button
            onClick={onExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-[#39745B] hover:bg-[#2E5E4A] text-[#FFFFFF] text-xs font-semibold rounded shadow-sm transition-all"
          >
            <FileText size={14} />
            <span>Generate report</span>
          </button>
        </div>
      </div>

      {/* B. Differentiated KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Inventory Health */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E6E2] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#777F79] font-mono mb-2">
              <span className="uppercase tracking-wider">Inventory Health</span>
              <Package size={15} className="text-[#39745B]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="mono-metric text-3xl font-bold text-[#202824]">
                {metrics.inventory.adequateStockPercentage}%
              </span>
              <span className="text-xs text-[#777F79]">adequately stocked</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#F0F2EF]">
            <div className="w-full bg-[#EAEFEA] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#39745B] h-full rounded-full transition-all duration-500" 
                style={{ width: `${metrics.inventory.adequateStockPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#777F79] mt-2 font-mono">
              <span>{metrics.inventory.totalUnits} units in stock</span>
              <span className="text-[#C85C52] font-semibold">{metrics.inventory.lowStockCount + metrics.inventory.outOfStockCount} low/out</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Attendance Today */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E6E2] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#777F79] font-mono mb-2">
              <span className="uppercase tracking-wider">Attendance Today</span>
              <Users size={15} className="text-[#39745B]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="mono-metric text-3xl font-bold text-[#202824]">
                {metrics.attendance.turnoutPercentage}%
              </span>
              <span className="text-xs text-[#39745B] flex items-center font-medium">
                <ArrowUpRight size={13} /> +{metrics.attendance.deltaVsLastWeek}% vs Mon
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#F0F2EF]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#777F79]">Present</span>
              <span className="font-mono font-bold text-[#202824]">{metrics.attendance.presentToday} / {metrics.attendance.expectedToday} members</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-[#777F79]">Cohort Status</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EDF4F0] text-[#39745B] font-semibold">
                Operational Target Met
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Open Alerts */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E6E2] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#777F79] font-mono mb-2">
              <span className="uppercase tracking-wider">Open Alerts</span>
              <AlertTriangle size={15} className="text-[#D99A32]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="mono-metric text-3xl font-bold text-[#202824]">
                {metrics.alerts.criticalCount + metrics.alerts.warningCount}
              </span>
              <span className="text-xs text-[#777F79]">exceptions flagged</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#F0F2EF] grid grid-cols-2 gap-2">
            <div className="bg-[#FAF0EE] px-2.5 py-1.5 rounded border border-[#F2CCC7]">
              <div className="text-[10px] uppercase font-mono text-[#C85C52] font-semibold">Critical</div>
              <div className="mono-metric text-base font-bold text-[#C85C52]">{metrics.alerts.criticalCount}</div>
            </div>
            <div className="bg-[#FDF6EB] px-2.5 py-1.5 rounded border border-[#F5DEB4]">
              <div className="text-[10px] uppercase font-mono text-[#D99A32] font-semibold">Warning</div>
              <div className="mono-metric text-base font-bold text-[#D99A32]">{metrics.alerts.warningCount}</div>
            </div>
          </div>
        </div>

        {/* Metric 4: Operations Requiring Attention */}
        <div className="bg-[#FAFBF9] p-5 rounded-lg border-2 border-[#DCE9DF] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#39745B] font-mono mb-2">
              <span className="uppercase tracking-wider font-semibold">Primary Priority</span>
              <Clock size={15} className="text-[#39745B]" />
            </div>
            <div className="text-sm font-semibold text-[#202824] leading-snug">
              {metrics.operations.primaryAction}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E2EBE5] flex items-center justify-between">
            <span className="text-xs text-[#777F79]">
              Oldest unreviewed: <strong className="font-mono text-[#202824]">{metrics.operations.oldestUnresolvedHours}h ago</strong>
            </span>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="text-xs font-semibold text-[#39745B] hover:text-[#2E5E4A] flex items-center gap-1"
            >
              <span>Review</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* C. Operational Trend Visualization */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E2E6E2] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0F2EF]">
          <div>
            <h3 className="text-base font-semibold text-[#202824]">
              Operational Trajectories
            </h3>
            <p className="text-xs text-[#777F79]">
              Continuous telemetry trends for proactive bottleneck detection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Tabs */}
            <div className="flex rounded bg-[#F4F6F4] p-0.5 border border-[#E5E9E5] text-xs">
              <button
                onClick={() => setActiveChartTab('attendance')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeChartTab === 'attendance'
                    ? 'bg-[#FFFFFF] text-[#202824] font-semibold shadow-xs'
                    : 'text-[#777F79] hover:text-[#202824]'
                }`}
              >
                Attendance Turnout
              </button>
              <button
                onClick={() => setActiveChartTab('inventory')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeChartTab === 'inventory'
                    ? 'bg-[#FFFFFF] text-[#202824] font-semibold shadow-xs'
                    : 'text-[#777F79] hover:text-[#202824]'
                }`}
              >
                Consumption Velocity
              </button>
            </div>

            {/* Date Filters */}
            <div className="flex rounded bg-[#F4F6F4] p-0.5 border border-[#E5E9E5] text-xs">
              {(['7d', '14d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`px-2 py-0.5 rounded uppercase font-mono ${
                    chartRange === r
                      ? 'bg-[#FFFFFF] text-[#39745B] font-bold shadow-xs'
                      : 'text-[#777F79]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive SVG Chart Canvas */}
        <div className="pt-6">
          {activeChartTab === 'attendance' ? (
            <div>
              <div className="h-56 w-full flex items-end gap-2 sm:gap-4 px-2 pb-6 border-b border-[#E8EBE8]">
                {attendanceTrendData.map((d, i) => {
                  const isSlump = d.pct < 75;
                  const heightPct = (d.pct / 100) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#202824] text-[#FFFFFF] text-[10px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                        {d.day}: {d.pct}%
                      </div>
                      
                      <div className="text-[10px] font-mono text-[#777F79] font-medium">
                        {d.pct}%
                      </div>
                      <div 
                        className={`w-full max-w-[36px] rounded-t transition-all duration-300 ${
                          isSlump ? 'bg-[#C85C52]' : 'bg-[#39745B] group-hover:bg-[#2E5E4A]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <div className="text-[10px] font-mono text-[#777F79] whitespace-nowrap">
                        {d.day}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[#777F79] pt-3 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#39745B]"></span>
                  Target Compliance (&gt;=75%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#C85C52]"></span>
                  Monday Slump Anomaly (&lt;75%)
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="h-56 w-full flex items-end gap-2 sm:gap-4 px-2 pb-6 border-b border-[#E8EBE8]">
                {consumptionTrendData.map((d, i) => {
                  const maxVal = 50;
                  const heightPct = (d.units / maxVal) * 100;
                  const isSurge = d.units > 30;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#202824] text-[#FFFFFF] text-[10px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                        {d.day}: {d.units} units
                      </div>
                      <div className="text-[10px] font-mono text-[#777F79] font-medium">
                        {d.units}
                      </div>
                      <div 
                        className={`w-full max-w-[36px] rounded-t transition-all duration-300 ${
                          isSurge ? 'bg-[#D99A32]' : 'bg-[#488A6E] group-hover:bg-[#39745B]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <div className="text-[10px] font-mono text-[#777F79] whitespace-nowrap">
                        {d.day}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[#777F79] pt-3 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#488A6E]"></span>
                  Normal Daily Velocity
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#D99A32]"></span>
                  Abnormal Surge Spike (&gt;30 units)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* D & E. Two-Column Layout: Attention Required Panel & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* D. Attention Required Panel (2 Columns wide) */}
        <div className="lg:col-span-2 bg-[#FFFFFF] p-6 rounded-lg border border-[#E2E6E2] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0F2EF] mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#202824] flex items-center gap-2">
                <span>Operational Exceptions</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FAF0EE] text-[#C85C52] font-bold">
                  {unresolvedAlerts.length} Active
                </span>
              </h3>
              <p className="text-xs text-[#777F79]">
                Threshold crossings requiring operator review and confirmation.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="text-xs font-medium text-[#39745B] hover:underline"
            >
              View all alerts →
            </button>
          </div>

          <div className="space-y-3">
            {unresolvedAlerts.slice(0, 4).map((alert) => (
              <div 
                key={alert.id}
                className="p-4 rounded-md border border-[#E8EBE8] bg-[#FAFBF9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#D0D7D1] transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                        alert.severity === 'critical'
                          ? 'bg-[#FAF0EE] text-[#C85C52] border border-[#F2CCC7]'
                          : 'bg-[#FDF6EB] text-[#D99A32] border border-[#F5DEB4]'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-semibold text-[#202824]">{alert.title}</span>
                  </div>

                  <div className="text-xs text-[#555E58]">
                    <strong>Entity:</strong> {alert.entity}
                  </div>
                  
                  <div className="text-xs text-[#777F79]">
                    <span className="font-mono text-[#C85C52]">{alert.actualValue}</span> vs <span className="font-mono">{alert.thresholdValue}</span> · <span className="italic">{alert.recommendedAction}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {alert.status === 'active' && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 text-xs font-medium rounded border border-[#CBD2CC] bg-[#FFFFFF] text-[#202824] hover:bg-[#F2F5F2]"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-[#39745B] text-[#FFFFFF] hover:bg-[#2E5E4A]"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* E. Recent Activity Timeline (1 Column wide) */}
        <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E2E6E2] shadow-sm">
          <div className="pb-4 border-b border-[#F0F2EF] mb-4">
            <h3 className="text-base font-semibold text-[#202824]">
              Recent Activity
            </h3>
            <p className="text-xs text-[#777F79]">
              Live operational event feed.
            </p>
          </div>

          <div className="space-y-4">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex gap-3 text-xs">
                <div className="mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#39745B]"></div>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-medium text-[#202824] flex items-center justify-between">
                    <span>{act.title}</span>
                    <span className="text-[10px] font-mono text-[#9BA39D]">{act.timestamp}</span>
                  </div>
                  <p className="text-[#555E58] text-[11px] leading-relaxed">
                    {act.description}
                  </p>
                  <div className="text-[10px] text-[#777F79] font-mono">
                    Actor: {act.actor}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-[#F0F2EF] text-center">
            <button
              onClick={() => onNavigateTab('activity')}
              className="text-xs font-semibold text-[#39745B] hover:text-[#2E5E4A]"
            >
              Open Live Activity Control Room →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
