import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  PlusCircle, 
  MinusCircle, 
  AlertTriangle, 
  ArrowUpDown,
  History,
  X,
  Check
} from 'lucide-react';
import { InventoryItem } from '../../types';

interface InventoryViewProps {
  items: InventoryItem[];
  onAdjustStock: (itemId: string, delta: number, note?: string) => void;
  onAddItem: (data: any) => void;
  onExportCsv: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  onAdjustStock,
  onAddItem,
  onExportCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'daysUntilStockout'>('daysUntilStockout');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState<InventoryItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(1);
  const [adjustNote, setAdjustNote] = useState('');

  // Add Item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Power Systems');
  const [newItemQuantity, setNewItemQuantity] = useState(25);
  const [newItemThreshold, setNewItemThreshold] = useState(10);
  const [newItemUnit, setNewItemUnit] = useState('units');

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    let factor = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'name') return a.name.localeCompare(b.name) * factor;
    if (sortBy === 'quantity') return (a.quantity - b.quantity) * factor;
    return (a.daysUntilStockout - b.daysUntilStockout) * factor;
  });

  const lowCount = items.filter(i => i.status === 'low').length;
  const outCount = items.filter(i => i.status === 'out_of_stock').length;
  const healthyCount = items.filter(i => i.status === 'healthy').length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemSku.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      sku: newItemSku.trim(),
      category: newItemCategory,
      quantity: Number(newItemQuantity),
      threshold: Number(newItemThreshold),
      unit: newItemUnit,
      status: Number(newItemQuantity) <= 0 ? 'out_of_stock' : (Number(newItemQuantity) <= Number(newItemThreshold) ? 'low' : 'healthy')
    });

    setNewItemName('');
    setNewItemSku('');
    setShowAddModal(false);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAdjustModal) return;
    onAdjustStock(showAdjustModal.id, adjustDelta, adjustNote);
    setShowAdjustModal(null);
    setAdjustNote('');
  };

  return (
    <div className="space-y-6 animate-enter">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EBE8]">
        <div>
          <h2 className="text-2xl font-bold text-[#202824]">
            Physical Inventory Stock
          </h2>
          <p className="text-xs text-[#777F79]">
            Real-time replenishment horizons, dynamic reorder points, and consumption logging.
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#39745B] hover:bg-[#2E5E4A] text-[#FFFFFF] text-xs font-semibold shadow-xs"
          >
            <Plus size={14} />
            <span>Register SKU</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-4 rounded border border-[#E2E6E2]">
          <div className="text-[11px] font-mono uppercase text-[#777F79]">Total Monitored SKUs</div>
          <div className="text-2xl font-bold text-[#202824] mono-metric mt-1">{items.length}</div>
        </div>
        <div className="bg-[#FFFFFF] p-4 rounded border border-[#E2E6E2]">
          <div className="text-[11px] font-mono uppercase text-[#39745B]">Healthy Reserves</div>
          <div className="text-2xl font-bold text-[#39745B] mono-metric mt-1">{healthyCount}</div>
        </div>
        <div className="bg-[#FFFFFF] p-4 rounded border border-[#E2E6E2]">
          <div className="text-[11px] font-mono uppercase text-[#D99A32]">Approaching Reorder</div>
          <div className="text-2xl font-bold text-[#D99A32] mono-metric mt-1">{lowCount}</div>
        </div>
        <div className="bg-[#FFFFFF] p-4 rounded border border-[#E2E6E2]">
          <div className="text-[11px] font-mono uppercase text-[#C85C52]">Critical Stockouts</div>
          <div className="text-2xl font-bold text-[#C85C52] mono-metric mt-1">{outCount}</div>
        </div>
      </div>

      {/* Controls Bar: Search, Category, Status, Sort */}
      <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E6E2] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-2.5 text-[#777F79]" />
            <input
              type="text"
              placeholder="Search by SKU or item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#D5DCD6] bg-[#FAFBF9] text-[#202824] focus:outline-none focus:border-[#39745B]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs rounded border border-[#D5DCD6] bg-[#FAFBF9] px-2.5 py-1.5 text-[#202824] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs rounded border border-[#D5DCD6] bg-[#FAFBF9] px-2.5 py-1.5 text-[#202824] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">Healthy Stock</option>
            <option value="low">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs text-[#777F79]">
          <span>Sort by:</span>
          <button
            onClick={() => {
              if (sortBy === 'daysUntilStockout') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              else setSortBy('daysUntilStockout');
            }}
            className={`px-2 py-1 rounded font-mono ${sortBy === 'daysUntilStockout' ? 'bg-[#EDF4F0] text-[#39745B] font-bold' : 'hover:bg-[#F2F5F2]'}`}
          >
            Runout Horizon {sortBy === 'daysUntilStockout' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => {
              if (sortBy === 'quantity') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              else setSortBy('quantity');
            }}
            className={`px-2 py-1 rounded font-mono ${sortBy === 'quantity' ? 'bg-[#EDF4F0] text-[#39745B] font-bold' : 'hover:bg-[#F2F5F2]'}`}
          >
            Qty {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E6E2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F7] text-[#777F79] font-mono uppercase text-[11px] border-b border-[#E2E6E2]">
              <tr>
                <th className="py-3 px-4">Item &amp; SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Available / Threshold</th>
                <th className="py-3 px-4">Burn Velocity</th>
                <th className="py-3 px-4">Depletion Horizon</th>
                <th className="py-3 px-4">Dynamic ROP</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEFEA]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#777F79] font-mono">
                    No matching inventory SKUs located for current filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const pct = Math.min(100, Math.round((item.quantity / (item.threshold * 2 || 1)) * 100));
                  return (
                    <tr key={item.id} className="hover:bg-[#FBFDFB] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#202824] text-sm">{item.name}</div>
                        <div className="text-[11px] font-mono text-[#777F79]">{item.sku}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[#555E58]">
                        <span className="px-2 py-0.5 rounded bg-[#F2F5F2] text-[11px] font-mono">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-[#202824] text-sm">
                            {item.quantity}
                          </span>
                          <span className="text-[11px] text-[#777F79]">/ min {item.threshold} {item.unit}</span>
                        </div>
                        <div className="w-24 bg-[#EAEFEA] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.status === 'out_of_stock' ? 'bg-[#C85C52]' : (item.status === 'low' ? 'bg-[#D99A32]' : 'bg-[#39745B]')
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#555E58]">
                        ~{item.dailyBurnRate} {item.unit}/day
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        {item.daysUntilStockout <= 0 ? (
                          <span className="text-[#C85C52] font-bold">Depleted</span>
                        ) : item.daysUntilStockout <= 5 ? (
                          <span className="text-[#D99A32] font-semibold">{item.daysUntilStockout}d ({item.stockoutDate})</span>
                        ) : (
                          <span className="text-[#39745B]">Stable (&gt;14d)</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#555E58]">
                        {item.dynamicRop} {item.unit} <span className="text-[10px] text-[#9BA39D]">(SS: {item.safetyStock})</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                          item.status === 'out_of_stock'
                            ? 'bg-[#FAF0EE] text-[#C85C52] border border-[#F2CCC7]'
                            : (item.status === 'low' ? 'bg-[#FDF6EB] text-[#D99A32] border border-[#F5DEB4]' : 'bg-[#EDF4F0] text-[#39745B] border border-[#D1E3D7]')
                        }`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAdjustStock(item.id, -1)}
                            className="w-6 h-6 rounded border border-[#CBD2CC] bg-[#FFFFFF] hover:bg-[#FAF0EE] hover:text-[#C85C52] flex items-center justify-center font-bold"
                            title="Decrement 1"
                          >
                            −
                          </button>
                          <button
                            onClick={() => onAdjustStock(item.id, 1)}
                            className="w-6 h-6 rounded border border-[#CBD2CC] bg-[#FFFFFF] hover:bg-[#EDF4F0] hover:text-[#39745B] flex items-center justify-center font-bold"
                            title="Increment 1"
                          >
                            +
                          </button>
                          <button
                            onClick={() => {
                              setShowAdjustModal(item);
                              setAdjustDelta(5);
                            }}
                            className="px-2 py-0.5 text-[10px] font-mono rounded border border-[#CBD2CC] bg-[#FAFBF9] text-[#555E58] hover:bg-[#F2F5F2]"
                          >
                            Adjust...
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Inventory Item */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFFFF] rounded-lg max-w-md w-full p-6 shadow-xl border border-[#E2E6E2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F2EF]">
              <h3 className="font-semibold text-base text-[#202824]">Register New Inventory Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#777F79] hover:text-[#202824]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#555E58] font-medium mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raspberry Pi 5 Single Board Computer"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#555E58] font-medium mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CMP-RPI-5-8GB"
                    value={newItemSku}
                    onChange={(e) => setNewItemSku(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#555E58] font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#555E58] font-medium mb-1">Initial Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#555E58] font-medium mb-1">Threshold</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemThreshold}
                    onChange={(e) => setNewItemThreshold(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#555E58] font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824]"
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
                  Save SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Stock Adjustment */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFFFF] rounded-lg max-w-sm w-full p-6 shadow-xl border border-[#E2E6E2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F2EF]">
              <h3 className="font-semibold text-base text-[#202824]">Stock Adjustment</h3>
              <button onClick={() => setShowAdjustModal(null)} className="text-[#777F79] hover:text-[#202824]">
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-[#555E58]">
              Adjusting: <strong>{showAdjustModal.name}</strong> ({showAdjustModal.quantity} {showAdjustModal.unit} on hand)
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#555E58] font-medium mb-1">Quantity Delta (+ or −)</label>
                <input
                  type="number"
                  required
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824] font-mono text-base"
                />
                <div className="text-[10px] text-[#777F79] mt-0.5">Use negative values to decrement stock.</div>
              </div>

              <div>
                <label className="block text-[#555E58] font-medium mb-1">Audit Log Note</label>
                <input
                  type="text"
                  placeholder="e.g. Lab build session distribution"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D5DCD6] rounded bg-[#FAFBF9] text-[#202824]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0F2EF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(null)}
                  className="px-3 py-1.5 rounded border border-[#CBD2CC] text-[#555E58]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#39745B] text-[#FFFFFF] font-semibold hover:bg-[#2E5E4A]"
                >
                  Apply Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
