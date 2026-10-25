'use client';

import React, { useState, useEffect } from 'react';

export interface CustomSavedView {
  id: string;
  name: string;
  vendorFilter: string;
  categoryFilter: string;
  statusFilter: string;
}

export interface VisibleColumnsConfig {
  image: boolean;
  sku: boolean;
  vendor: boolean;
  status: boolean;
  inventory: boolean;
  price: boolean;
  category: boolean;
  compliance: boolean;
}

export const DEFAULT_COLUMNS: VisibleColumnsConfig = {
  image: true,
  sku: true,
  vendor: true,
  status: true,
  inventory: true,
  price: true,
  category: true,
  compliance: true,
};

interface SavedViewsManagerProps {
  activeViewId: string;
  onSelectView: (viewId: string) => void;
  onSaveCurrentView: (name: string) => void;
  onDeleteCustomView: (viewId: string) => void;
  customViews: CustomSavedView[];
  visibleColumns: VisibleColumnsConfig;
  onToggleColumn: (columnKey: keyof VisibleColumnsConfig) => void;
  counts: {
    all: number;
    active: number;
    drafts: number;
    lowStock: number;
    flagship: number;
    partner: number;
  };
}

export function SavedViewsManager({
  activeViewId,
  onSelectView,
  onSaveCurrentView,
  onDeleteCustomView,
  customViews,
  visibleColumns,
  onToggleColumn,
  counts,
}: SavedViewsManagerProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const presetViews = [
    { id: 'all', label: `All (${counts.all})` },
    { id: 'active', label: `Active (${counts.active})` },
    { id: 'drafts', label: `Drafts (${counts.drafts})` },
    { id: 'low_stock', label: `Low Stock (${counts.lowStock})` },
    { id: 'flagship', label: `Flagship (${counts.flagship})` },
    { id: 'partner', label: `Partners (${counts.partner})` },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;
    onSaveCurrentView(newViewName.trim());
    setNewViewName('');
    setShowSaveModal(false);
  };

  return (
    <div className="space-y-3">
      {/* View Tabs & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[#e5dcd0] pb-2 gap-3">
        {/* Scrollable Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {presetViews.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => onSelectView(view.id)}
              className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 whitespace-nowrap transition-colors border ${
                activeViewId === view.id
                  ? 'bg-[#131010] text-[#f7f1e8] border-[#131010]'
                  : 'bg-white text-[#7b7366] border-[#e5dcd0] hover:text-[#131010] hover:bg-[#faf6f0]'
              }`}
            >
              {view.label}
            </button>
          ))}

          {/* User Custom Saved Views */}
          {customViews.map((cv) => (
            <div
              key={cv.id}
              className={`inline-flex items-center font-mono text-[11px] uppercase tracking-wider border whitespace-nowrap ${
                activeViewId === cv.id
                  ? 'bg-[#131010] text-[#f7f1e8] border-[#131010]'
                  : 'bg-white text-[#7b7366] border-[#e5dcd0] hover:text-[#131010]'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectView(cv.id)}
                className="px-3 py-1.5"
              >
                ★ {cv.name}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCustomView(cv.id);
                }}
                className="px-1.5 py-1.5 hover:text-red-500 font-mono text-[10px]"
                title="Remove saved view"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1.5 whitespace-nowrap text-[#2d5508] hover:text-[#131010] border border-dashed border-[#2d5508]/40 hover:border-[#131010] transition-colors"
          >
            + Save View
          </button>
        </div>

        {/* Column Customizer Dropdown */}
        <div className="relative flex-shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
            className="px-3 py-1.5 bg-white border border-[#e5dcd0] hover:bg-[#faf6f0] text-[#131010] font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <span>Columns</span>
            <span className="text-[9px]">▼</span>
          </button>

          {showColumnsDropdown && (
            <div
              className="absolute right-0 mt-1 w-48 bg-white border border-[#e5dcd0] shadow-xl p-3 z-30 space-y-2 rounded-none animate-slide-up"
              onMouseLeave={() => setShowColumnsDropdown(false)}
            >
              <div className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] border-b border-[#e5dcd0] pb-1 mb-1">
                Toggle Table Columns
              </div>
              {(
                [
                  { key: 'image', label: 'Image Preview' },
                  { key: 'sku', label: 'SKU Code' },
                  { key: 'vendor', label: 'Brand / Vendor' },
                  { key: 'status', label: 'Status' },
                  { key: 'inventory', label: 'Inventory Units' },
                  { key: 'price', label: 'Price (₦)' },
                  { key: 'category', label: 'Category' },
                  { key: 'compliance', label: 'NAFDAC Caveat' },
                ] as const
              ).map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2 text-xs text-[#131010] cursor-pointer hover:text-[#2d5508]"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns[col.key]}
                    onChange={() => onToggleColumn(col.key)}
                    className="w-3.5 h-3.5 accent-[#2d5508] rounded-none"
                  />
                  <span>{col.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save View Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5dcd0] max-w-sm w-full p-6 space-y-4 rounded-none shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5dcd0] pb-3">
              <h4 className="font-serif text-lg text-[#131010]">Save Current View</h4>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="text-[#7b7366] font-mono text-sm px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#524b42]">
              Saves your active brand, category, and search filter combination as a quick-access tab.
            </p>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                  View Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="e.g. Abuja Herbal Lineup"
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#e5dcd0]">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#7b7366] border border-[#e5dcd0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] transition-colors"
                >
                  Save View
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
