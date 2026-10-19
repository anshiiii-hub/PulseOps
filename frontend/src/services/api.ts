import { Alert, InventoryItem, AttendanceRecord, ActivityEvent, ThresholdRule, OverviewMetrics } from '../types';

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'PWR-LIPO-4S',
    name: 'LiPo Battery 4S 5000mAh',
    category: 'Power Systems',
    quantity: 11,
    threshold: 20,
    unit: 'units',
    status: 'low',
    dailyBurnRate: 3.4,
    daysUntilStockout: 3.2,
    stockoutDate: 'Oct 23, 2026',
    dynamicRop: 19,
    safetyStock: 8,
    lastUpdated: '18 minutes ago',
    hasAnomaly: false
  },
  {
    id: 'inv-2',
    sku: 'CMP-JETSON-ORIN',
    name: 'NVIDIA Jetson Orin Nano',
    category: 'Compute Modules',
    quantity: 18,
    threshold: 5,
    unit: 'boards',
    status: 'healthy',
    dailyBurnRate: 0.3,
    daysUntilStockout: 60.0,
    stockoutDate: 'Dec 18, 2026',
    dynamicRop: 4,
    safetyStock: 2,
    lastUpdated: '2 hours ago',
    hasAnomaly: false
  },
  {
    id: 'inv-3',
    sku: 'CBL-USB-TYPEC',
    name: 'Micro-USB to USB-C Cables',
    category: 'Cables & Accessories',
    quantity: 35,
    threshold: 15,
    unit: 'cables',
    status: 'healthy',
    dailyBurnRate: 1.2,
    daysUntilStockout: 29.1,
    stockoutDate: 'Nov 17, 2026',
    dynamicRop: 14,
    safetyStock: 6,
    lastUpdated: '4 hours ago',
    hasAnomaly: true
  },
  {
    id: 'inv-4',
    sku: 'FAB-SOLDER-8MM',
    name: 'Precision Soldering Wire 0.8mm',
    category: 'Fabrication',
    quantity: 0,
    threshold: 4,
    unit: 'spools',
    status: 'out_of_stock',
    dailyBurnRate: 0.8,
    daysUntilStockout: 0.0,
    stockoutDate: 'Stockout Active',
    dynamicRop: 6,
    safetyStock: 3,
    lastUpdated: '1 day ago',
    hasAnomaly: false
  },
  {
    id: 'inv-5',
    sku: 'ACT-SERVO-MG996R',
    name: 'MG996R Metal Gear Servos',
    category: 'Actuators',
    quantity: 28,
    threshold: 10,
    unit: 'servos',
    status: 'healthy',
    dailyBurnRate: 0.6,
    daysUntilStockout: 46.7,
    stockoutDate: 'Dec 04, 2026',
    dynamicRop: 8,
    safetyStock: 4,
    lastUpdated: 'Yesterday',
    hasAnomaly: false
  },
  {
    id: 'inv-6',
    sku: 'MED-GLOVES-NIT',
    name: 'Nitrile Surgical Gloves (M)',
    category: 'Medical & Safety',
    quantity: 42,
    threshold: 50,
    unit: 'boxes',
    status: 'low',
    dailyBurnRate: 4.8,
    daysUntilStockout: 8.7,
    stockoutDate: 'Oct 28, 2026',
    dynamicRop: 48,
    safetyStock: 16,
    lastUpdated: '3 hours ago',
    hasAnomaly: false
  },
  {
    id: 'inv-7',
    sku: 'CLN-ALC-SAN-1L',
    name: 'Hand Sanitizer Gel 1000ml',
    category: 'Medical & Safety',
    quantity: 120,
    threshold: 30,
    unit: 'bottles',
    status: 'healthy',
    dailyBurnRate: 2.1,
    daysUntilStockout: 57.1,
    stockoutDate: 'Dec 15, 2026',
    dynamicRop: 24,
    safetyStock: 10,
    lastUpdated: '5 hours ago',
    hasAnomaly: false
  }
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    memberId: 'mem-1',
    code: 'EMP-4011',
    name: 'Aarav Sharma',
    department: 'AI & Robotics Cohort',
    status: 'absent',
    checkInTime: undefined,
    currentPercentage: 64.3,
    presentDays: 9,
    totalDays: 14,
    absenceStreak: 3,
    riskTier: 'critical',
    trend: 'decaying',
    recommendation: 'Immediate advisor 1-on-1 required; absence streak exceeds threshold.'
  },
  {
    memberId: 'mem-2',
    code: 'EMP-4012',
    name: 'Priya Patel',
    department: 'AI & Robotics Cohort',
    status: 'present',
    checkInTime: '08:42 AM',
    currentPercentage: 92.9,
    presentDays: 13,
    totalDays: 14,
    absenceStreak: 0,
    riskTier: 'low',
    trend: 'improving',
    recommendation: 'Attendance is exemplary; engagement metrics high.'
  },
  {
    memberId: 'mem-3',
    code: 'EMP-4013',
    name: 'Rohan Mehta',
    department: 'Data Systems',
    status: 'late',
    checkInTime: '09:28 AM',
    currentPercentage: 71.4,
    presentDays: 10,
    totalDays: 14,
    absenceStreak: 0,
    riskTier: 'high',
    trend: 'decaying',
    recommendation: 'Frequent late check-ins on Mondays; issue preliminary advisory notice.'
  },
  {
    memberId: 'mem-4',
    code: 'EMP-4014',
    name: 'Ananya Iyer',
    department: 'Data Systems',
    status: 'present',
    checkInTime: '08:50 AM',
    currentPercentage: 100.0,
    presentDays: 14,
    totalDays: 14,
    absenceStreak: 0,
    riskTier: 'low',
    trend: 'consistent',
    recommendation: 'Perfect attendance record across tracking cycle.'
  },
  {
    memberId: 'mem-5',
    code: 'EMP-4015',
    name: 'Vikram Singh',
    department: 'Robotics Engineering',
    status: 'present',
    checkInTime: '08:35 AM',
    currentPercentage: 92.9,
    presentDays: 13,
    totalDays: 14,
    absenceStreak: 0,
    riskTier: 'low',
    trend: 'consistent',
    recommendation: 'Consistent participation across laboratory shifts.'
  },
  {
    memberId: 'mem-6',
    code: 'EMP-4016',
    name: 'Sneha Reddy',
    department: 'Robotics Engineering',
    status: 'present',
    checkInTime: '08:58 AM',
    currentPercentage: 78.6,
    presentDays: 11,
    totalDays: 14,
    absenceStreak: 0,
    riskTier: 'moderate',
    trend: 'consistent',
    recommendation: 'Borderline policy compliance; monitor over next 3 sessions.'
  },
  {
    memberId: 'mem-7',
    code: 'EMP-4017',
    name: 'Aditya Nair',
    department: 'ML Operations',
    status: 'present',
    checkInTime: '09:02 AM',
    currentPercentage: 85.7,
    presentDays: 12,
    totalDays: 14,
    absenceStreak: 0,
    riskTier: 'low',
    trend: 'consistent',
    recommendation: 'Above required institutional threshold.'
  },
  {
    memberId: 'mem-8',
    code: 'EMP-4018',
    name: 'Tanvi Joshi',
    department: 'ML Operations',
    status: 'excused',
    checkInTime: undefined,
    currentPercentage: 92.9,
    presentDays: 13,
    totalDays: 14,
    absenceStreak: 0,
    riskTier: 'low',
    trend: 'consistent',
    recommendation: 'Authorized medical leave recorded; baseline remains strong.'
  }
];

const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-1049',
    severity: 'critical',
    title: 'Zero Stock Outage: Soldering Wire 0.8mm',
    entity: 'Precision Soldering Wire 0.8mm (FAB-SOLDER-8MM)',
    category: 'inventory',
    actualValue: '0 spools',
    thresholdValue: 'Min 4 spools',
    timestamp: '1 day ago',
    status: 'active',
    recommendedAction: 'Place emergency restock order of 6 spools with primary vendor.'
  },
  {
    id: 'ALT-1048',
    severity: 'warning',
    title: 'Imminent Stockout Trajectory: LiPo Batteries',
    entity: 'LiPo Battery 4S 5000mAh (PWR-LIPO-4S)',
    category: 'inventory',
    actualValue: '11 units (3.2d horizon)',
    thresholdValue: 'Min 20 units',
    timestamp: '4 hours ago',
    status: 'active',
    recommendedAction: 'Approve pending replenishment purchase requisition of 25 units.'
  },
  {
    id: 'ALT-1047',
    severity: 'critical',
    title: 'Chronic Absenteeism: Aarav Sharma below 75%',
    entity: 'Aarav Sharma (EMP-4011)',
    category: 'attendance',
    actualValue: '64.3% (3-day streak)',
    thresholdValue: 'Min 75.0%',
    timestamp: 'Today at 09:30 AM',
    status: 'active',
    recommendedAction: 'Schedule mandatory counseling and review past medical records.'
  },
  {
    id: 'ALT-1046',
    severity: 'warning',
    title: 'Abnormal Consumption Surge: USB-C Cables',
    entity: 'Micro-USB to USB-C Cables (CBL-USB-TYPEC)',
    category: 'inventory',
    actualValue: '24 units drained in 1 batch',
    thresholdValue: 'Max drop 8 units/day',
    timestamp: '2 days ago',
    status: 'acknowledged',
    recommendedAction: 'Audit event log for hackathon hardware distribution authorization.',
    acknowledgedBy: 'Dr. Evelyn Vance',
    acknowledgedAt: 'Yesterday at 04:15 PM'
  },
  {
    id: 'ALT-1045',
    severity: 'info',
    title: 'Department Attendance Delta: Data Systems',
    entity: 'Data Systems Department',
    category: 'attendance',
    actualValue: '75.0% average',
    thresholdValue: 'Target 85.0%',
    timestamp: 'Oct 17, 2026',
    status: 'resolved',
    recommendedAction: 'Review class scheduling and morning transit options.'
  }
];

const INITIAL_ACTIVITY: ActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '12 minutes ago',
    type: 'attendance_checkin',
    title: 'Attendance Session Verified',
    description: '7 of 8 members recorded present for Oct 19, 2026 session.',
    actor: 'Dr. Evelyn Vance',
    severity: 'normal'
  },
  {
    id: 'act-2',
    timestamp: '35 minutes ago',
    type: 'alert_generated',
    title: 'Critical Alert Raised',
    description: 'Aarav Sharma absence streak reached 3 sessions; cumulative score 64.3%.',
    actor: 'System Rule Engine',
    severity: 'critical'
  },
  {
    id: 'act-3',
    timestamp: '2 hours ago',
    type: 'inventory_adjust',
    title: 'Stock Decrement: LiPo Batteries',
    description: 'Quantity adjusted from 15 to 11 units (-4 units) for robotics build session.',
    actor: 'Lab Manager',
    severity: 'warning'
  },
  {
    id: 'act-4',
    timestamp: '5 hours ago',
    type: 'threshold_updated',
    title: 'Dynamic ROP Recalculated',
    description: 'Safety stock for Nitrile Gloves optimized to 16 boxes based on 3-day lead variance.',
    actor: 'AI Model Worker',
    severity: 'normal'
  },
  {
    id: 'act-5',
    timestamp: 'Yesterday at 04:15 PM',
    type: 'alert_generated',
    title: 'Alert Acknowledged',
    description: 'Cable consumption surge acknowledged by Dr. Vance after hardware log review.',
    actor: 'Dr. Evelyn Vance',
    severity: 'normal'
  },
  {
    id: 'act-6',
    timestamp: 'Oct 17, 2026',
    type: 'report_exported',
    title: 'Quarterly Audit CSV Exported',
    description: 'Comprehensive inventory valuation and attendance register exported.',
    actor: 'Operations Admin',
    severity: 'normal'
  }
];

const INITIAL_RULES: ThresholdRule[] = [
  {
    id: 'rul-1',
    type: 'inventory',
    title: 'Critical Out-of-Stock Alarm',
    description: 'Triggers immediately when SKU available stock hits zero.',
    targetEntity: 'All Inventory SKUs',
    condition: 'Quantity <= 0',
    thresholdValue: 0,
    unit: 'units',
    severity: 'critical',
    isActive: true,
    lastTriggered: '1 day ago'
  },
  {
    id: 'rul-2',
    type: 'inventory',
    title: 'Minimum Reorder Threshold',
    description: 'Flags item when on-hand stock falls below minimum safety buffer.',
    targetEntity: 'All Inventory SKUs',
    condition: 'Quantity <= Threshold',
    thresholdValue: 15,
    unit: 'units',
    severity: 'warning',
    isActive: true,
    lastTriggered: '4 hours ago'
  },
  {
    id: 'rul-3',
    type: 'attendance',
    title: 'Minimum Policy Attendance Target',
    description: 'Monitors cumulative individual percentage against institutional requirement.',
    targetEntity: 'All Members',
    condition: 'Percentage < Threshold',
    thresholdValue: 75,
    unit: '%',
    severity: 'critical',
    isActive: true,
    lastTriggered: 'Today at 09:30 AM'
  },
  {
    id: 'rul-4',
    type: 'attendance',
    title: 'Repeated Absenteeism Review',
    description: 'Flags individual for review when unexcused absence streak reaches limit.',
    targetEntity: 'All Members',
    condition: 'Consecutive Absences >= Threshold',
    thresholdValue: 3,
    unit: 'days',
    severity: 'warning',
    isActive: true,
    lastTriggered: 'Today at 09:30 AM'
  },
  {
    id: 'rul-5',
    type: 'attendance',
    title: 'Cohort Daily Absenteeism Spike',
    description: 'Triggers departmental alert when single-day absent rate exceeds target.',
    targetEntity: 'Cohort Level',
    condition: 'Daily Absenteeism >= Threshold',
    thresholdValue: 30,
    unit: '%',
    severity: 'warning',
    isActive: true,
    lastTriggered: 'Oct 14, 2026'
  }
];

// In-Memory state store for live responsive interactions
let inventoryState = [...INITIAL_INVENTORY];
let attendanceState = [...INITIAL_ATTENDANCE];
let alertsState = [...INITIAL_ALERTS];
let activityState = [...INITIAL_ACTIVITY];
let rulesState = [...INITIAL_RULES];

export const PulseApi = {
  async getOverview(): Promise<OverviewMetrics> {
    const lowCount = inventoryState.filter(i => i.status === 'low').length;
    const outCount = inventoryState.filter(i => i.status === 'out_of_stock').length;
    const totalItems = inventoryState.length;
    const adequatePct = Math.round(((totalItems - lowCount - outCount) / totalItems) * 100);

    const presentCount = attendanceState.filter(a => a.status === 'present').length;
    const expectedCount = attendanceState.length;
    const turnoutPct = Math.round((presentCount / expectedCount) * 100);
    const atRiskCount = attendanceState.filter(a => a.riskTier === 'high' || a.riskTier === 'critical').length;

    const critAlerts = alertsState.filter(a => a.status === 'active' && a.severity === 'critical').length;
    const warnAlerts = alertsState.filter(a => a.status === 'active' && a.severity === 'warning').length;

    return {
      inventory: {
        totalItems,
        totalUnits: inventoryState.reduce((sum, i) => sum + i.quantity, 0),
        lowStockCount: lowCount,
        outOfStockCount: outCount,
        adequateStockPercentage: adequatePct
      },
      attendance: {
        presentToday: presentCount,
        expectedToday: expectedCount,
        turnoutPercentage: turnoutPct,
        deltaVsLastWeek: 2.4,
        atRiskCount
      },
      alerts: {
        criticalCount: critAlerts,
        warningCount: warnAlerts,
        resolvedToday: 1
      },
      operations: {
        unresolvedCount: critAlerts + warnAlerts,
        oldestUnresolvedHours: 18,
        primaryAction: 'Approve LiPo Battery 4S replenishment order (3.2d runout horizon)'
      }
    };
  },

  async getInventory(): Promise<InventoryItem[]> {
    return [...inventoryState];
  },

  async adjustStock(itemId: string, delta: number, note?: string): Promise<InventoryItem> {
    const item = inventoryState.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');
    
    item.quantity = Math.max(0, item.quantity + delta);
    item.status = item.quantity <= 0 ? 'out_of_stock' : (item.quantity <= item.threshold ? 'low' : 'healthy');
    item.daysUntilStockout = item.dailyBurnRate > 0 ? Number((item.quantity / item.dailyBurnRate).toFixed(1)) : 999;
    item.lastUpdated = 'Just now';

    activityState.unshift({
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'inventory_adjust',
      title: `Quantity Adjusted: ${item.name}`,
      description: `${delta > 0 ? '+' : ''}${delta} ${item.unit} (New total: ${item.quantity} ${item.unit})${note ? ` · Note: ${note}` : ''}`,
      actor: 'Current Operator',
      severity: item.status === 'out_of_stock' ? 'critical' : (item.status === 'low' ? 'warning' : 'normal')
    });

    return { ...item };
  },

  async addInventoryItem(data: Omit<InventoryItem, 'id' | 'dailyBurnRate' | 'daysUntilStockout' | 'stockoutDate' | 'dynamicRop' | 'safetyStock' | 'lastUpdated'>): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...data,
      id: `inv-${Date.now()}`,
      dailyBurnRate: Number((data.threshold * 0.15).toFixed(1)),
      daysUntilStockout: Number((data.quantity / (data.threshold * 0.15 || 1)).toFixed(1)),
      stockoutDate: 'Calculating',
      dynamicRop: Math.ceil(data.threshold * 1.2),
      safetyStock: Math.ceil(data.threshold * 0.4),
      lastUpdated: 'Just now'
    };

    inventoryState.unshift(newItem);

    activityState.unshift({
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'inventory_adjust',
      title: `New Item Registered: ${newItem.name}`,
      description: `Added SKU ${newItem.sku} with starting quantity ${newItem.quantity} ${newItem.unit}.`,
      actor: 'Current Operator',
      severity: 'normal'
    });

    return newItem;
  },

  async getAttendance(): Promise<AttendanceRecord[]> {
    return [...attendanceState];
  },

  async updateMemberStatus(memberId: string, status: 'present' | 'absent' | 'late' | 'excused'): Promise<AttendanceRecord> {
    const record = attendanceState.find(m => m.memberId === memberId);
    if (!record) throw new Error('Member not found');

    const previousStatus = record.status;
    record.status = status;
    record.checkInTime = (status === 'present' || status === 'late') ? (record.checkInTime || '09:00 AM') : undefined;

    if (status === 'absent' && previousStatus !== 'absent') {
      record.absenceStreak += 1;
    } else if (status === 'present') {
      record.absenceStreak = 0;
    }

    // Recalculate percentage
    const addPresent = (status === 'present' || status === 'late') ? 1 : 0;
    const oldPresent = (previousStatus === 'present' || previousStatus === 'late') ? 1 : 0;
    record.presentDays += (addPresent - oldPresent);
    record.currentPercentage = Number(((record.presentDays / record.totalDays) * 100).toFixed(1));

    if (record.currentPercentage < 75 || record.absenceStreak >= 3) {
      record.riskTier = 'critical';
    } else if (record.currentPercentage < 80) {
      record.riskTier = 'high';
    } else {
      record.riskTier = 'low';
    }

    activityState.unshift({
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'attendance_checkin',
      title: `Status Updated: ${record.name}`,
      description: `Status changed from ${previousStatus} to ${status}. Attendance running: ${record.currentPercentage}%.`,
      actor: 'Current Operator',
      severity: status === 'absent' ? 'warning' : 'normal'
    });

    return { ...record };
  },

  async getAlerts(): Promise<Alert[]> {
    return [...alertsState];
  },

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    const alert = alertsState.find(a => a.id === alertId);
    if (!alert) throw new Error('Alert not found');

    alert.status = 'acknowledged';
    alert.acknowledgedBy = 'Current Operator';
    alert.acknowledgedAt = 'Just now';

    activityState.unshift({
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'alert_generated',
      title: `Alert Acknowledged: ${alert.id}`,
      description: `Acknowledge status confirmed by operator. Action plan pending.`,
      actor: 'Current Operator',
      severity: 'normal'
    });

    return { ...alert };
  },

  async resolveAlert(alertId: string): Promise<Alert> {
    const alert = alertsState.find(a => a.id === alertId);
    if (!alert) throw new Error('Alert not found');

    alert.status = 'resolved';

    activityState.unshift({
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'alert_generated',
      title: `Alert Resolved: ${alert.id}`,
      description: `Operational exception ${alert.title} marked as successfully resolved.`,
      actor: 'Current Operator',
      severity: 'normal'
    });

    return { ...alert };
  },

  async getActivity(): Promise<ActivityEvent[]> {
    return [...activityState];
  },

  async getRules(): Promise<ThresholdRule[]> {
    return [...rulesState];
  },

  async toggleRule(ruleId: string): Promise<ThresholdRule> {
    const rule = rulesState.find(r => r.id === ruleId);
    if (!rule) throw new Error('Rule not found');
    rule.isActive = !rule.isActive;
    return { ...rule };
  },

  downloadCsv(type: 'inventory' | 'attendance' | 'alerts'): void {
    let csvContent = '';
    let filename = `pulseops_${type}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'inventory') {
      csvContent = 'SKU,Name,Category,Quantity,Unit,Threshold,Status,BurnRatePerDay,DaysToStockout,DynamicROP\n' +
        inventoryState.map(i => `"${i.sku}","${i.name}","${i.category}",${i.quantity},"${i.unit}",${i.threshold},"${i.status}",${i.dailyBurnRate},${i.daysUntilStockout},${i.dynamicRop}`).join('\n');
    } else if (type === 'attendance') {
      csvContent = 'Code,Name,Department,TodayStatus,CheckInTime,PresentDays,TotalDays,AttendancePct,AbsenceStreak,RiskTier\n' +
        attendanceState.map(a => `"${a.code}","${a.name}","${a.department}","${a.status}","${a.checkInTime || 'N/A'}",${a.presentDays},${a.totalDays},${a.currentPercentage},${a.absenceStreak},"${a.riskTier}"`).join('\n');
    } else {
      csvContent = 'AlertID,Severity,Title,Entity,Category,ActualValue,ThresholdValue,Status,Timestamp\n' +
        alertsState.map(a => `"${a.id}","${a.severity}","${a.title}","${a.entity}","${a.category}","${a.actualValue}","${a.thresholdValue}","${a.status}","${a.timestamp}"`).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
