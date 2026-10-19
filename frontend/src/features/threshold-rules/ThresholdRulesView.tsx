import React, { useState } from 'react';
import { Sliders, Plus, Check, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ThresholdRule } from '../../types';

interface ThresholdRulesViewProps {
  rules: ThresholdRule[];
  onToggleRule: (ruleId: string) => void;
}

export const ThresholdRulesView: React.FC<ThresholdRulesViewProps> = ({ rules, onToggleRule }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [ruleType, setRuleType] = useState<'inventory' | 'attendance'>('inventory');
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleCondition, setRuleCondition] = useState('Quantity <= 10');
  const [ruleValue, setRuleValue] = useState(10);
  const [ruleUnit, setRuleUnit] = useState('units');

  const inventoryRules = rules.filter(r => r.type === 'inventory');
  const attendanceRules = rules.filter(r => r.type === 'attendance');

  return (
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EBE8]">
        <div>
          <h2 className="text-2xl font-bold text-[#202824]">
            Threshold Rules &amp; Triggers Engine
          </h2>
          <p className="text-xs text-[#777F79]">
            Configure mathematical evaluation limits that automatically dispatch alerts and operational escalations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#39745B] hover:bg-[#2E5E4A] text-[#FFFFFF] text-xs font-semibold shadow-xs"
        >
          <Plus size={14} />
          <span>New Threshold Rule</span>
        </button>
      </div>

      {/* Inventory Rules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#202824]">
              Inventory Stockout &amp; Replenishment Rules
            </h3>
            <p className="text-xs text-[#777F79]">
              Evaluated on every incoming stock decrement or physical count adjustment.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EDF4F0] text-[#39745B] font-semibold">
            {inventoryRules.filter(r => r.isActive).length} of {inventoryRules.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventoryRules.map((rule) => (
            <div 
              key={rule.id}
              className={`p-5 rounded-lg border bg-[#FFFFFF] transition-all flex flex-col justify-between gap-4 ${
                rule.isActive ? 'border-[#E2E6E2] shadow-xs' : 'border-[#E8EBE8] opacity-60 bg-[#FAFBF9]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    rule.severity === 'critical' ? 'bg-[#FAF0EE] text-[#C85C52]' : 'bg-[#FDF6EB] text-[#D99A32]'
                  }`}>
                    {rule.severity} Severity
                  </span>
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded border transition-colors ${
                      rule.isActive 
                        ? 'bg-[#EDF4F0] text-[#39745B] border-[#D1E3D7]' 
                        : 'bg-[#F2F5F2] text-[#777F79] border-[#D5DCD6]'
                    }`}
                  >
                    {rule.isActive ? 'Rule Active' : 'Disabled'}
                  </button>
                </div>

                <div className="font-semibold text-sm text-[#202824]">{rule.title}</div>
                <p className="text-xs text-[#555E58] leading-relaxed">{rule.description}</p>
              </div>

              <div className="pt-3 border-t border-[#F0F2EF] flex items-center justify-between text-xs font-mono text-[#777F79]">
                <span>Target: <strong>{rule.targetEntity}</strong></span>
                <span>Limit: <strong className="text-[#202824]">{rule.condition}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Rules */}
      <div className="space-y-4 pt-4 border-t border-[#E8EBE8]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#202824]">
              Attendance &amp; Absenteeism Rules
            </h3>
            <p className="text-xs text-[#777F79]">
              Evaluated dynamically as daily marks are verified against institutional policies.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EDF4F0] text-[#39745B] font-semibold">
            {attendanceRules.filter(r => r.isActive).length} of {attendanceRules.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attendanceRules.map((rule) => (
            <div 
              key={rule.id}
              className={`p-5 rounded-lg border bg-[#FFFFFF] transition-all flex flex-col justify-between gap-4 ${
                rule.isActive ? 'border-[#E2E6E2] shadow-xs' : 'border-[#E8EBE8] opacity-60 bg-[#FAFBF9]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    rule.severity === 'critical' ? 'bg-[#FAF0EE] text-[#C85C52]' : 'bg-[#FDF6EB] text-[#D99A32]'
                  }`}>
                    {rule.severity} Severity
                  </span>
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded border transition-colors ${
                      rule.isActive 
                        ? 'bg-[#EDF4F0] text-[#39745B] border-[#D1E3D7]' 
                        : 'bg-[#F2F5F2] text-[#777F79] border-[#D5DCD6]'
                    }`}
                  >
                    {rule.isActive ? 'Rule Active' : 'Disabled'}
                  </button>
                </div>

                <div className="font-semibold text-sm text-[#202824]">{rule.title}</div>
                <p className="text-xs text-[#555E58] leading-relaxed">{rule.description}</p>
              </div>

              <div className="pt-3 border-t border-[#F0F2EF] flex items-center justify-between text-xs font-mono text-[#777F79]">
                <span>Target: <strong>{rule.targetEntity}</strong></span>
                <span>Limit: <strong className="text-[#202824]">{rule.condition}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New Rule */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFFFF] rounded-lg max-w-md w-full p-6 shadow-xl border border-[#E2E6E2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F2EF]">
              <h3 className="font-semibold text-base text-[#202824]">Define Custom Threshold Rule</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#777F79] hover:text-[#202824]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#555E58] font-medium mb-1">Domain</label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824]"
                >
                  <option value="inventory">Inventory Quantities</option>
                  <option value="attendance">Attendance Records</option>
                </select>
              </div>

              <div>
                <label className="block text-[#555E58] font-medium mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Safety Stock Buffer Violation"
                  value={ruleTitle}
                  onChange={(e) => setRuleTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#555E58] font-medium mb-1">Trigger Condition</label>
                  <input
                    type="text"
                    value={ruleCondition}
                    onChange={(e) => setRuleCondition(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#555E58] font-medium mb-1">Threshold Value</label>
                  <input
                    type="number"
                    value={ruleValue}
                    onChange={(e) => setRuleValue(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F2EF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded border border-[#CBD2CC] text-[#555E58]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#39745B] text-[#FFFFFF] font-semibold hover:bg-[#2E5E4A]"
                >
                  Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
