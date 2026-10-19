export type AlertSeverity = 'critical' | 'warning' | 'info' | 'resolved';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  entity: string;
  category: 'inventory' | 'attendance' | 'system';
  actualValue: string | number;
  thresholdValue: string | number;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  recommendedAction: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  unit: string;
  status: 'healthy' | 'low' | 'out_of_stock';
  dailyBurnRate: number;
  daysUntilStockout: number;
  stockoutDate: string;
  dynamicRop: number;
  safetyStock: number;
  lastUpdated: string;
  hasAnomaly?: boolean;
}

export interface AttendanceRecord {
  memberId: string;
  code: string;
  name: string;
  department: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  currentPercentage: number;
  presentDays: number;
  totalDays: number;
  absenceStreak: number;
  riskTier: 'low' | 'moderate' | 'high' | 'critical';
  trend: 'improving' | 'consistent' | 'decaying';
  recommendation: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'inventory_adjust' | 'attendance_checkin' | 'alert_generated' | 'threshold_updated' | 'report_exported';
  title: string;
  description: string;
  actor: string;
  severity?: 'normal' | 'warning' | 'critical';
}

export interface ThresholdRule {
  id: string;
  type: 'inventory' | 'attendance';
  title: string;
  description: string;
  targetEntity: string;
  condition: string;
  thresholdValue: number;
  unit: string;
  severity: AlertSeverity;
  isActive: boolean;
  lastTriggered?: string;
}

export interface OverviewMetrics {
  inventory: {
    totalItems: number;
    totalUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
    adequateStockPercentage: number;
  };
  attendance: {
    presentToday: number;
    expectedToday: number;
    turnoutPercentage: number;
    deltaVsLastWeek: number;
    atRiskCount: number;
  };
  alerts: {
    criticalCount: number;
    warningCount: number;
    resolvedToday: number;
  };
  operations: {
    unresolvedCount: number;
    oldestUnresolvedHours: number;
    primaryAction: string;
  };
}
