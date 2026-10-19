import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Pause, 
  Play, 
  Filter, 
  RotateCw, 
  Package, 
  Users, 
  AlertTriangle, 
  Sliders, 
  FileText 
} from 'lucide-react';
import { ActivityEvent } from '../../types';

interface LiveActivityViewProps {
  activities: ActivityEvent[];
}

export const LiveActivityView: React.FC<LiveActivityViewProps> = ({ activities }) => {
  const [isStreaming, setIsStreaming] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [events, setEvents] = useState<ActivityEvent[]>(activities);

  useEffect(() => {
    setEvents(activities);
  }, [activities]);

  // Subtle real-time periodic simulator when stream is unpaused
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const mockEventTypes: ActivityEvent[] = [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          type: 'inventory_adjust',
          title: 'Stock Decrement: Micro-USB Cables',
          description: '1 cable checked out at workbench 4.',
          actor: 'Lab Technician B',
          severity: 'normal'
        },
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          type: 'attendance_checkin',
          title: 'Lab Badge Scanned',
          description: 'EMP-4015 (Vikram Singh) verified present at Robotics bay.',
          actor: 'Terminal Scanner #2',
          severity: 'normal'
        }
      ];

      const sample = mockEventTypes[Math.floor(Math.random() * mockEventTypes.length)];
      setEvents(prev => [sample, ...prev.slice(0, 40)]);
    }, 14000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredEvents = events.filter(e => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'inventory_adjust': return <Package size={14} className="text-[#39745B]" />;
      case 'attendance_checkin': return <Users size={14} className="text-[#39745B]" />;
      case 'alert_generated': return <AlertTriangle size={14} className="text-[#C85C52]" />;
      case 'threshold_updated': return <Sliders size={14} className="text-[#D99A32]" />;
      default: return <FileText size={14} className="text-[#777F79]" />;
    }
  };

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EBE8]">
        <div>
          <h2 className="text-2xl font-bold text-[#202824]">
            Live Operational Control Room
          </h2>
          <p className="text-xs text-[#777F79]">
            Real-time telemetry event stream capturing asset movements, threshold triggers, and attendance verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#DCE9DF] bg-[#EDF4F0] text-xs font-mono text-[#39745B]">
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-[#39745B] animate-pulse' : 'bg-[#777F79]'}`}></span>
            <span>{isStreaming ? 'Stream Active (14s tick)' : 'Stream Paused'}</span>
          </div>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#CBD2CC] bg-[#FFFFFF] text-xs font-semibold text-[#202824] hover:bg-[#F2F5F2]"
          >
            {isStreaming ? <Pause size={13} /> : <Play size={13} />}
            <span>{isStreaming ? 'Pause Feed' : 'Resume Feed'}</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E2E6E2] flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-[#777F79] mr-2">Filter Stream:</span>
        <button
          onClick={() => setFilterType('all')}
          className={`px-2.5 py-1 rounded font-medium ${filterType === 'all' ? 'bg-[#39745B] text-[#FFFFFF]' : 'bg-[#FAFBF9] text-[#555E58] border border-[#E2E6E2]'}`}
        >
          All Events ({events.length})
        </button>
        <button
          onClick={() => setFilterType('inventory_adjust')}
          className={`px-2.5 py-1 rounded font-medium ${filterType === 'inventory_adjust' ? 'bg-[#39745B] text-[#FFFFFF]' : 'bg-[#FAFBF9] text-[#555E58] border border-[#E2E6E2]'}`}
        >
          Inventory Movements
        </button>
        <button
          onClick={() => setFilterType('attendance_checkin')}
          className={`px-2.5 py-1 rounded font-medium ${filterType === 'attendance_checkin' ? 'bg-[#39745B] text-[#FFFFFF]' : 'bg-[#FAFBF9] text-[#555E58] border border-[#E2E6E2]'}`}
        >
          Attendance Marks
        </button>
        <button
          onClick={() => setFilterType('alert_generated')}
          className={`px-2.5 py-1 rounded font-medium ${filterType === 'alert_generated' ? 'bg-[#39745B] text-[#FFFFFF]' : 'bg-[#FAFBF9] text-[#555E58] border border-[#E2E6E2]'}`}
        >
          Alert Triggers
        </button>
      </div>

      {/* Real-time Ingestion Stream Feed */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E6E2] divide-y divide-[#EAEFEA] shadow-sm">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="p-4 flex items-start gap-3 hover:bg-[#FAFBF9] transition-colors">
            <div className="p-2 rounded bg-[#F4F6F4] border border-[#E5EAE5] mt-0.5">
              {getEventIcon(evt.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[#202824]">{evt.title}</span>
                <span className="text-[11px] font-mono text-[#9BA39D] flex items-center gap-1">
                  {evt.timestamp}
                </span>
              </div>
              <p className="text-xs text-[#555E58] mt-0.5 leading-relaxed">
                {evt.description}
              </p>
              <div className="text-[10px] font-mono text-[#777F79] mt-1 flex items-center gap-3">
                <span>Actor: {evt.actor}</span>
                <span>•</span>
                <span>Event ID: {evt.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
