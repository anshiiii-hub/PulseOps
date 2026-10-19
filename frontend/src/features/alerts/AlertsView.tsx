import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Check, 
  X,
  ArrowRight
} from 'lucide-react';
import { Alert, AlertSeverity } from '../../types';

interface AlertsViewProps {
  alerts: Alert[];
  onAcknowledgeAlert: (id: string) => void;
  onResolveAlert: (id: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalAlert, setDetailModalAlert] = useState<Alert | null>(null);

  const filteredAlerts = alerts.filter(a => {
    const matchesSev = selectedSeverity === 'all' || 
                       (selectedSeverity === 'resolved' ? a.status === 'resolved' : (a.status !== 'resolved' && a.severity === selectedSeverity));
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.entity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const criticalCount = alerts.filter(a => a.status !== 'resolved' && a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.status !== 'resolved' && a.severity === 'warning').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EBE8]">
        <div>
          <h2 className="text-2xl font-bold text-[#202824]">
            Alerts &amp; Operational Exceptions
          </h2>
          <p className="text-xs text-[#777F79]">
            Continuous threshold evaluation queue with audited operator acknowledgement and resolution tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#FAF0EE] text-[#C85C52] font-bold border border-[#F2CCC7]">
            {criticalCount} Critical Active
          </span>
          <span className="px-2.5 py-1 rounded bg-[#FDF6EB] text-[#D99A32] font-bold border border-[#F5DEB4]">
            {warningCount} Warning Active
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E6E2] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedSeverity === 'all'
                ? 'bg-[#39745B] text-[#FFFFFF] font-bold'
                : 'text-[#777F79] hover:bg-[#F2F5F2]'
            }`}
          >
            All Active ({criticalCount + warningCount})
          </button>
          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedSeverity === 'critical'
                ? 'bg-[#C85C52] text-[#FFFFFF] font-bold'
                : 'text-[#777F79] hover:bg-[#F2F5F2]'
            }`}
          >
            Critical Only ({criticalCount})
          </button>
          <button
            onClick={() => setSelectedSeverity('warning')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedSeverity === 'warning'
                ? 'bg-[#D99A32] text-[#FFFFFF] font-bold'
                : 'text-[#777F79] hover:bg-[#F2F5F2]'
            }`}
          >
            Warnings ({warningCount})
          </button>
          <button
            onClick={() => setSelectedSeverity('resolved')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedSeverity === 'resolved'
                ? 'bg-[#202824] text-[#FFFFFF] font-bold'
                : 'text-[#777F79] hover:bg-[#F2F5F2]'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-2.5 text-[#777F79]" />
          <input
            type="text"
            placeholder="Search exceptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#D5DCD6] bg-[#FAFBF9] text-[#202824] focus:outline-none focus:border-[#39745B]"
          />
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#FFFFFF] p-12 text-center rounded-lg border border-[#E2E6E2] text-xs text-[#777F79] font-mono">
            No operational exceptions match current criteria. All monitored parameters healthy.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-lg border bg-[#FFFFFF] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alert.status === 'resolved'
                  ? 'border-[#E2E6E2] opacity-75'
                  : (alert.severity === 'critical' ? 'border-[#F2CCC7] bg-[#FFFAF9]' : 'border-[#F5DEB4] bg-[#FFFCF7]')
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    alert.status === 'resolved'
                      ? 'bg-[#EAEFEA] text-[#555E58]'
                      : (alert.severity === 'critical' ? 'bg-[#FAF0EE] text-[#C85C52]' : 'bg-[#FDF6EB] text-[#D99A32]')
                  }`}>
                    {alert.status === 'resolved' ? 'RESOLVED' : alert.severity}
                  </span>
                  <span className="text-xs font-mono text-[#9BA39D]">{alert.id}</span>
                  <span className="text-sm font-semibold text-[#202824]">{alert.title}</span>
                </div>

                <div className="text-xs text-[#555E58]">
                  <strong>Entity:</strong> {alert.entity}
                </div>

                <div className="text-xs text-[#777F79] flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>Actual: <strong className="font-mono text-[#202824]">{alert.actualValue}</strong></span>
                  <span>Threshold: <strong className="font-mono text-[#202824]">{alert.thresholdValue}</strong></span>
                  <span>Logged: <strong className="font-mono">{alert.timestamp}</strong></span>
                  {alert.acknowledgedBy && (
                    <span className="text-[#39745B] font-mono">
                      Acknowledged by {alert.acknowledgedBy} ({alert.acknowledgedAt})
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#39745B] bg-[#EDF4F0] px-3 py-1.5 rounded font-medium max-w-2xl mt-1">
                  <strong>Prescriptive Recommendation:</strong> {alert.recommendedAction}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setDetailModalAlert(alert)}
                  className="px-3 py-1.5 rounded border border-[#CBD2CC] bg-[#FFFFFF] text-xs font-medium text-[#202824] hover:bg-[#F2F5F2]"
                >
                  View Details
                </button>
                {alert.status === 'active' && (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 rounded border border-[#CBD2CC] bg-[#FFFFFF] text-xs font-medium text-[#202824] hover:bg-[#F2F5F2]"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-3.5 py-1.5 rounded bg-[#39745B] text-[#FFFFFF] text-xs font-semibold hover:bg-[#2E5E4A]"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Detail Modal Drawer */}
      {detailModalAlert && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFFFF] rounded-lg max-w-lg w-full p-6 shadow-xl border border-[#E2E6E2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F2EF]">
              <div>
                <span className="text-[10px] font-mono text-[#777F79] uppercase">{detailModalAlert.id} Incident Dossier</span>
                <h3 className="font-semibold text-base text-[#202824]">{detailModalAlert.title}</h3>
              </div>
              <button onClick={() => setDetailModalAlert(null)} className="text-[#777F79] hover:text-[#202824]">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#FAFBF9] p-3 rounded border border-[#EAEFEA] space-y-1.5">
                <div><strong>Monitored Entity:</strong> {detailModalAlert.entity}</div>
                <div><strong>Domain Category:</strong> {detailModalAlert.category.toUpperCase()}</div>
                <div><strong>Current Metric Value:</strong> <span className="font-mono font-bold text-[#C85C52]">{detailModalAlert.actualValue}</span></div>
                <div><strong>Trigger Policy Limit:</strong> <span className="font-mono">{detailModalAlert.thresholdValue}</span></div>
                <div><strong>Detected Timestamp:</strong> {detailModalAlert.timestamp}</div>
              </div>

              <div>
                <label className="block text-[#555E58] font-bold mb-1">Standard Operating Procedure</label>
                <div className="p-3 bg-[#EDF4F0] text-[#202824] rounded border border-[#D1E3D7] leading-relaxed">
                  {detailModalAlert.recommendedAction}
                </div>
              </div>

              {detailModalAlert.acknowledgedBy && (
                <div className="text-[11px] font-mono text-[#777F79]">
                  Verified acknowledgement by {detailModalAlert.acknowledgedBy} at {detailModalAlert.acknowledgedAt}.
                </div>
              )}

              <div className="pt-3 border-t border-[#F0F2EF] flex justify-end gap-2">
                <button
                  onClick={() => setDetailModalAlert(null)}
                  className="px-3 py-1.5 rounded border border-[#CBD2CC] text-[#555E58]"
                >
                  Close
                </button>
                {detailModalAlert.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      onResolveAlert(detailModalAlert.id);
                      setDetailModalAlert(null);
                    }}
                    className="px-4 py-1.5 rounded bg-[#39745B] text-[#FFFFFF] font-semibold hover:bg-[#2E5E4A]"
                  >
                    Confirm &amp; Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
