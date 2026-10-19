import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  Calendar,
  TrendingDown,
  TrendingUp,
  Minus,
  Plus,
  X
} from 'lucide-react';
import { AttendanceRecord } from '../../types';

interface AttendanceViewProps {
  records: AttendanceRecord[];
  onUpdateMemberStatus: (memberId: string, status: 'present' | 'absent' | 'late' | 'excused') => void;
  onExportCsv: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  records,
  onUpdateMemberStatus,
  onExportCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const departments = ['all', ...Array.from(new Set(records.map(r => r.department)))];

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || r.department === selectedDept;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const excusedCount = records.filter(r => r.status === 'excused').length;
  const totalCount = records.length;
  const turnoutPct = totalCount > 0 ? Number(((presentCount / totalCount) * 100).toFixed(1)) : 0;

  const handleMarkAllPresent = () => {
    records.forEach(r => {
      if (r.status !== 'present') {
        onUpdateMemberStatus(r.memberId, 'present');
      }
    });
  };

  return (
    <div className="space-y-6 animate-enter">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EBE8]">
        <div>
          <h2 className="text-2xl font-bold text-[#202824]">
            Cohort &amp; Institutional Attendance
          </h2>
          <p className="text-xs text-[#777F79]">
            Daily check-in verification, multi-factor absenteeism risk classification, and policy threshold compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#CBD2CC] bg-[#FFFFFF] text-xs font-semibold text-[#202824] hover:bg-[#F2F5F2]"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#39745B] hover:bg-[#2E5E4A] text-[#FFFFFF] text-xs font-semibold shadow-xs"
          >
            <UserCheck size={14} />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#FFFFFF] p-3.5 rounded border border-[#E2E6E2]">
          <div className="text-[10px] font-mono uppercase text-[#777F79]">Today's Turnout</div>
          <div className="text-xl font-bold text-[#202824] mono-metric mt-1">{turnoutPct}%</div>
          <div className="text-[10px] text-[#39745B] font-mono mt-0.5">Policy Target: &gt;=75%</div>
        </div>
        <div className="bg-[#FFFFFF] p-3.5 rounded border border-[#E2E6E2]">
          <div className="text-[10px] font-mono uppercase text-[#39745B]">Present</div>
          <div className="text-xl font-bold text-[#39745B] mono-metric mt-1">{presentCount}</div>
          <div className="text-[10px] text-[#777F79] font-mono mt-0.5">Of {totalCount} members</div>
        </div>
        <div className="bg-[#FFFFFF] p-3.5 rounded border border-[#E2E6E2]">
          <div className="text-[10px] font-mono uppercase text-[#C85C52]">Absent</div>
          <div className="text-xl font-bold text-[#C85C52] mono-metric mt-1">{absentCount}</div>
          <div className="text-[10px] text-[#C85C52] font-mono mt-0.5">Unexcused check-ins</div>
        </div>
        <div className="bg-[#FFFFFF] p-3.5 rounded border border-[#E2E6E2]">
          <div className="text-[10px] font-mono uppercase text-[#D99A32]">Late Check-ins</div>
          <div className="text-xl font-bold text-[#D99A32] mono-metric mt-1">{lateCount}</div>
          <div className="text-[10px] text-[#777F79] font-mono mt-0.5">&gt;15m past session</div>
        </div>
        <div className="bg-[#FFFFFF] p-3.5 rounded border border-[#E2E6E2]">
          <div className="text-[10px] font-mono uppercase text-[#777F79]">Excused Leaves</div>
          <div className="text-xl font-bold text-[#555E58] mono-metric mt-1">{excusedCount}</div>
          <div className="text-[10px] text-[#777F79] font-mono mt-0.5">Authorized medical/admin</div>
        </div>
      </div>

      {/* Department Breakdown Mini-Bar */}
      <div className="bg-[#FAFBF9] p-4 rounded-lg border border-[#E2E6E2] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-xs font-semibold text-[#202824] uppercase font-mono tracking-wider">
          Cohort Turnout by Group:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-medium text-[#202824]">AI &amp; Robotics</span>
              <span className="font-mono font-bold text-[#39745B]">85.7%</span>
            </div>
            <div className="w-full bg-[#E8EBE8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#39745B] h-full rounded-full" style={{ width: '85.7%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-medium text-[#202824]">Data Systems</span>
              <span className="font-mono font-bold text-[#D99A32]">71.4%</span>
            </div>
            <div className="w-full bg-[#E8EBE8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#D99A32] h-full rounded-full" style={{ width: '71.4%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-medium text-[#202824]">Robotics Eng</span>
              <span className="font-mono font-bold text-[#39745B]">85.7%</span>
            </div>
            <div className="w-full bg-[#E8EBE8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#39745B] h-full rounded-full" style={{ width: '85.7%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-medium text-[#202824]">ML Operations</span>
              <span className="font-mono font-bold text-[#39745B]">89.3%</span>
            </div>
            <div className="w-full bg-[#E8EBE8] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#39745B] h-full rounded-full" style={{ width: '89.3%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E6E2] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-2.5 text-[#777F79]" />
            <input
              type="text"
              placeholder="Search member name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#D5DCD6] bg-[#FAFBF9] text-[#202824] focus:outline-none focus:border-[#39745B]"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs rounded border border-[#D5DCD6] bg-[#FAFBF9] px-2.5 py-1.5 text-[#202824] focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Departments' : d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs rounded border border-[#D5DCD6] bg-[#FAFBF9] px-2.5 py-1.5 text-[#202824] focus:outline-none"
          >
            <option value="all">All Check-in Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
        </div>

        <div className="text-xs font-mono text-[#777F79]">
          Showing {filteredRecords.length} of {records.length} records
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E6E2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F7] text-[#777F79] font-mono uppercase text-[11px] border-b border-[#E2E6E2]">
              <tr>
                <th className="py-3 px-4">Member &amp; ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Today's Check-in</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Cumulative %</th>
                <th className="py-3 px-4">Absence Streak</th>
                <th className="py-3 px-4">Risk Tier</th>
                <th className="py-3 px-4">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEFEA]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#777F79] font-mono">
                    No matching attendance records located.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((m) => {
                  return (
                    <tr key={m.memberId} className="hover:bg-[#FBFDFB] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#202824] text-sm">{m.name}</div>
                        <div className="text-[11px] font-mono text-[#777F79]">{m.code}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[#555E58]">
                        <span className="px-2 py-0.5 rounded bg-[#F2F5F2] text-[11px] font-mono">
                          {m.department}
                        </span>
                      </td>

                      {/* Interactive Status Selector */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex rounded border border-[#D5DCD6] bg-[#FFFFFF] p-0.5 text-[10px] font-mono">
                          {(['present', 'absent', 'late', 'excused'] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => onUpdateMemberStatus(m.memberId, s)}
                              className={`px-2 py-0.5 rounded uppercase font-semibold transition-colors ${
                                m.status === s
                                  ? (s === 'present' 
                                      ? 'bg-[#39745B] text-[#FFFFFF]' 
                                      : (s === 'absent' 
                                          ? 'bg-[#C85C52] text-[#FFFFFF]' 
                                          : (s === 'late' 
                                              ? 'bg-[#D99A32] text-[#FFFFFF]' 
                                              : 'bg-[#555E58] text-[#FFFFFF]')))
                                  : 'text-[#777F79] hover:bg-[#F2F5F2]'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#555E58]">
                        {m.checkInTime || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${m.currentPercentage < 75 ? 'text-[#C85C52]' : 'text-[#202824]'}`}>
                            {m.currentPercentage}%
                          </span>
                          <span className="text-[10px] text-[#777F79]">({m.presentDays}/{m.totalDays}d)</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        {m.absenceStreak > 0 ? (
                          <span className={`font-bold ${m.absenceStreak >= 3 ? 'text-[#C85C52]' : 'text-[#D99A32]'}`}>
                            {m.absenceStreak} day{m.absenceStreak > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-[#9BA39D]">0</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                          m.riskTier === 'critical'
                            ? 'bg-[#FAF0EE] text-[#C85C52] border border-[#F2CCC7]'
                            : (m.riskTier === 'high' 
                                ? 'bg-[#FDF6EB] text-[#D99A32] border border-[#F5DEB4]' 
                                : (m.riskTier === 'moderate' 
                                    ? 'bg-[#FEF9C3] text-[#854D0E] border border-[#FDE047]' 
                                    : 'bg-[#EDF4F0] text-[#39745B] border border-[#D1E3D7]'))
                        }`}>
                          {m.riskTier}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-[#555E58] max-w-xs truncate" title={m.recommendation}>
                        {m.recommendation}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
