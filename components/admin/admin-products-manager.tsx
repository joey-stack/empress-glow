'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product, ProductVariant } from '@/lib/insforge/queries';

import { BulkActionBar } from './bulk-action-bar';
import {
  SavedViewsManager,
  CustomSavedView,
  VisibleColumnsConfig,
  DEFAULT_COLUMNS,
} from './saved-views-manager';
import { ImageDropzoneUploader } from './image-dropzone-uploader';

interface ProductWithVariants extends Product {
  variants?: ProductVariant[];
}

interface AdminProductsManagerProps {
  initialProducts: ProductWithVariants[];
}

const PRESET_IMAGES = [
  { label: 'Fruity Soap Lineup', url: '/images/fruity-soap-lineup.jpg' },
  { label: 'Fruity Soap Jar', url: '/images/fruity-soap-hero.jpg' },
  { label: 'Serum Dropper', url: '/images/serum.jpg' },
  { label: 'Moisturizer Cream', url: '/images/moisturizer.jpg' },
  { label: 'Sunscreen Tube', url: '/images/sunscreen.jpg' },
  { label: 'Face Cream Jar', url: '/images/face-cream.jpg' },
  { label: 'Sheet Mask', url: '/images/sheet-mask.jpg' },
  { label: 'Foam Cleanser', url: '/images/cleanser.jpg' },
];

export function AdminProductsManager({ initialProducts }: AdminProductsManagerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ProductWithVariants[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'edit'>('all');

  // Multi-select state
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Saved Views & Custom Views
  const [activeViewId, setActiveViewId] = useState<string>('all');
  const [customViews, setCustomViews] = useState<CustomSavedView[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumnsConfig>(DEFAULT_COLUMNS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Currently editing product
  const [editingProduct, setEditingProduct] = useState<ProductWithVariants | null>(null);

  // Load custom views and column visibility from localStorage on mount
  useEffect(() => {
    try {
      const savedViewsData = localStorage.getItem('eg_admin_custom_saved_views');
      if (savedViewsData) {
        setCustomViews(JSON.parse(savedViewsData));
      }
      const savedColsData = localStorage.getItem('eg_admin_visible_columns');
      if (savedColsData) {
        setVisibleColumns(JSON.parse(savedColsData));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSaveCurrentView = (name: string) => {
    const newView: CustomSavedView = {
      id: `view_${Date.now()}`,
      name,
      vendorFilter,
      categoryFilter,
      statusFilter,
    };
    const updated = [...customViews, newView];
    setCustomViews(updated);
    try {
      localStorage.setItem('eg_admin_custom_saved_views', JSON.stringify(updated));
    } catch {}
    setActiveViewId(newView.id);
  };

  const handleDeleteCustomView = (viewId: string) => {
    const updated = customViews.filter((v) => v.id !== viewId);
    setCustomViews(updated);
    try {
      localStorage.setItem('eg_admin_custom_saved_views', JSON.stringify(updated));
    } catch {}
    if (activeViewId === viewId) setActiveViewId('all');
  };

  const handleToggleColumn = (columnKey: keyof VisibleColumnsConfig) => {
    setVisibleColumns((prev) => {
      const next = { ...prev, [columnKey]: !prev[columnKey] };
      try {
        localStorage.setItem('eg_admin_visible_columns', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSelectView = (viewId: string) => {
    setActiveViewId(viewId);
    if (viewId === 'all') {
      setVendorFilter('all');
      setStatusFilter('all');
      setCategoryFilter('all');
    } else if (viewId === 'active') {
      setStatusFilter('active');
    } else if (viewId === 'drafts') {
      setStatusFilter('draft');
    } else if (viewId === 'flagship') {
      setVendorFilter('in_house');
    } else if (viewId === 'partner') {
      setVendorFilter('partner');
    } else {
      const custom = customViews.find((v) => v.id === viewId);
      if (custom) {
        setVendorFilter(custom.vendorFilter);
        setStatusFilter(custom.statusFilter);
        setCategoryFilter(custom.categoryFilter);
      }
    }
  };

  const handleBulkSuccess = (updatedProducts: Product[], message: string) => {
    setProducts((prev) => {
      const map = new Map(updatedProducts.map((p) => [p.id, p as ProductWithVariants]));
      return prev.map((p) => map.get(p.id) || p);
    });
    setAlertMessage({ text: message, type: 'success' });
  };

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newVendorType, setNewVendorType] = useState<'in_house' | 'partner'>('in_house');
  const [newCustomVendor, setNewCustomVendor] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('soap');
  const [newPrice, setNewPrice] = useState<number | ''>(5000);
  const [newComparePrice, setNewComparePrice] = useState<number | ''>('');
  const [newCostPerItem, setNewCostPerItem] = useState<number | ''>('');
  const [newSku, setNewSku] = useState('');
  const [newStock, setNewStock] = useState<number | ''>(50);
  const [newStatus, setNewStatus] = useState<Product['status']>('active');
  const [newImageUrl, setNewImageUrl] = useState('/images/fruity-soap-hero.jpg');
  const [newIngredients, setNewIngredients] = useState('');
  const [hasVariants, setHasVariants] = useState(false);
  const [newVariants, setNewVariants] = useState<Array<{ name: string; sku: string; price: number; stock: number }>>([
    { name: 'Small (150g)', sku: 'VAR-S', price: 3000, stock: 25 },
    { name: 'Large (350g)', sku: 'VAR-L', price: 7000, stock: 25 },
  ]);

  // Loading & Alert
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Check URL query parameters
  useEffect(() => {
    if (searchParams.get('tab') === 'new') {
      setActiveTab('new');
    }
  }, [searchParams]);

  // Auto-generate slug when title changes in new form
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewTitle(val);
    setNewSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  // Add / remove variant rows
  const handleAddVariantRow = () => {
    setNewVariants((prev) => [
      ...prev,
      {
        name: `Size ${prev.length + 1}`,
        sku: `VAR-${prev.length + 1}`,
        price: typeof newPrice === 'number' ? newPrice : 5000,
        stock: 20,
      },
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    setNewVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVariantRowChange = (index: number, field: string, val: any) => {
    setNewVariants((prev) =>
      prev.map((v, idx) => (idx === index ? { ...v, [field]: val } : v))
    );
  };

  // Extract all distinct vendors for filtering
  const distinctVendors = Array.from(
    new Set(products.map((p) => p.vendor || 'Empress Glow'))
  );

  // Counts for saved view tabs
  const viewCounts = {
    all: products.length,
    active: products.filter((p) => p.status === 'active').length,
    drafts: products.filter((p) => p.status === 'draft').length,
    lowStock: products.filter((p) => (p.stock || 0) < 15).length,
    flagship: products.filter((p) => !p.vendor || p.vendor === 'Empress Glow').length,
    partner: products.filter((p) => p.vendor && p.vendor !== 'Empress Glow').length,
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    // View specific filtering
    let matchesView = true;
    if (activeViewId === 'active') {
      matchesView = p.status === 'active';
    } else if (activeViewId === 'drafts') {
      matchesView = p.status === 'draft';
    } else if (activeViewId === 'low_stock') {
      matchesView = (p.stock || 0) < 15;
    } else if (activeViewId === 'flagship') {
      matchesView = !p.vendor || p.vendor === 'Empress Glow';
    } else if (activeViewId === 'partner') {
      matchesView = Boolean(p.vendor && p.vendor !== 'Empress Glow');
    } else if (activeViewId !== 'all') {
      const custom = customViews.find((v) => v.id === activeViewId);
      if (custom) {
        const pVendor = p.vendor || 'Empress Glow';
        const vMatch =
          custom.vendorFilter === 'all'
            ? true
            : custom.vendorFilter === 'in_house'
            ? pVendor === 'Empress Glow'
            : custom.vendorFilter === 'partner'
            ? pVendor !== 'Empress Glow'
            : pVendor === custom.vendorFilter;
        const sMatch = custom.statusFilter === 'all' ? true : p.status === custom.statusFilter;
        const cMatch =
          custom.categoryFilter === 'all'
            ? true
            : (p.category || '').toLowerCase() === custom.categoryFilter.toLowerCase();
        matchesView = vMatch && sMatch && cMatch;
      }
    }

    const pVendor = p.vendor || 'Empress Glow';
    const matchesVendor =
      vendorFilter === 'all'
        ? true
        : vendorFilter === 'in_house'
        ? pVendor === 'Empress Glow'
        : vendorFilter === 'partner'
        ? pVendor !== 'Empress Glow'
        : pVendor === vendorFilter;

    const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all'
        ? true
        : (p.category || '').toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesView && matchesVendor && matchesStatus && matchesCategory;
  });

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedProductIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Handle Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setAlertMessage({ text: 'Please enter a product title', type: 'error' });
      return;
    }

    setSubmitting(true);
    setAlertMessage(null);

    const vendor = newVendorType === 'in_house' ? 'Empress Glow' : (newCustomVendor.trim() || 'Partner Brand');
    const ingredientsArray = newIngredients
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTitle.trim(),
          slug: newSlug.trim() || undefined,
          vendor,
          description: newDescription.trim(),
          price: Number(newPrice) || 0,
          compare_at_price: newComparePrice ? Number(newComparePrice) : undefined,
          cost_per_item: newCostPerItem ? Number(newCostPerItem) : undefined,
          sku: newSku.trim() || undefined,
          category: newCategory,
          stock: Number(newStock) || 0,
          status: newStatus,
          images: [newImageUrl.trim() || '/images/fruity-soap-hero.jpg'],
          ingredients: ingredientsArray,
          variants: hasVariants ? newVariants : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      setProducts((prev) => [data.product, ...prev]);
      setAlertMessage({ text: `Product "${data.product.name}" created successfully!`, type: 'success' });

      // Reset form
      setNewTitle('');
      setNewSlug('');
      setNewDescription('');
      setNewCustomVendor('');
      setNewPrice(5000);
      setNewComparePrice('');
      setNewCostPerItem('');
      setNewSku('');
      setNewStock(50);
      setNewIngredients('');
      setHasVariants(false);
      setActiveTab('all');
    } catch (err: any) {
      setAlertMessage({ text: err.message || 'Error creating product', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Mode
  const handleOpenEdit = (product: ProductWithVariants) => {
    setEditingProduct(product);
    setActiveTab('edit');
    setAlertMessage(null);
  };

  // Handle Update Product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSubmitting(true);
    setAlertMessage(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product');

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? data.product : p))
      );
      setAlertMessage({ text: `Product "${data.product.name}" updated successfully!`, type: 'success' });
      setActiveTab('all');
      setEditingProduct(null);
    } catch (err: any) {
      setAlertMessage({ text: err.message || 'Error updating product', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setAlertMessage({ text: `Product "${name}" removed.`, type: 'success' });
    } catch (err: any) {
      setAlertMessage({ text: err.message || 'Error deleting product', type: 'error' });
    }
  };

  // Profit Margin Calculation Helper
  const priceNum = typeof newPrice === 'number' ? newPrice : 0;
  const costNum = typeof newCostPerItem === 'number' ? newCostPerItem : 0;
  const profit = priceNum - costNum;
  const marginPercent = priceNum > 0 ? Math.round((profit / priceNum) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-[#131010] tracking-tight">Products</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-none bg-[#faf8f5] text-[#7b7366]">
              {products.length} Total
            </span>
          </div>
          <p className="text-xs text-[#7b7366] mt-1">
            Manage Mary Asuquo&apos;s Empress Glow flagship formulas alongside curated partner beauty brands.
          </p>
        </div>

        {/* View Switcher / Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('all');
              setEditingProduct(null);
              setAlertMessage(null);
            }}
            className={`text-xs font-semibold px-3.5 py-2 rounded-none transition-colors ${
              activeTab === 'all'
                ? 'bg-[#131010] text-white shadow-none'
                : 'bg-[#faf8f5] text-[#7b7366] hover:bg-[#faf6f0]'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('new');
              setEditingProduct(null);
              setAlertMessage(null);
            }}
            className={`text-xs font-semibold px-3.5 py-2 rounded-none flex items-center gap-1.5 transition-colors ${
              activeTab === 'new'
                ? 'bg-[#131010] text-white shadow-none'
                : 'bg-[#131010] hover:bg-[#2d5508] text-white hover:bg-[#2d5508]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Global Alert Notification */}
      {alertMessage && (
        <div
          className={`p-4 rounded-none text-xs font-medium flex items-center justify-between ${
            alertMessage.type === 'success'
              ? 'bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/30'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{alertMessage.text}</span>
          <button
            onClick={() => setAlertMessage(null)}
            className="text-[#7b7366] hover:text-[#131010] ml-4 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* TAB 1: ALL PRODUCTS LIST (Shopify Table) */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Summary Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-none border border-[#e5dcd0] shadow-none">
              <div className="text-[11px] font-semibold text-[#7b7366] uppercase">In-House (Empress Glow)</div>
              <div className="text-xl font-bold text-[#131010] mt-1">
                {products.filter((p) => !p.vendor || p.vendor === 'Empress Glow').length}
              </div>
              <div className="text-[10px] text-[#7b7366] mt-0.5">Hero Fruity Soap + Core line</div>
            </div>

            <div className="bg-white p-4 rounded-none border border-[#e5dcd0] shadow-none">
              <div className="text-[11px] font-semibold text-[#7b7366] uppercase">Partner Brands</div>
              <div className="text-xl font-bold text-[#131010] mt-1">
                {products.filter((p) => p.vendor && p.vendor !== 'Empress Glow').length}
              </div>
              <div className="text-[10px] text-[#7b7366] mt-0.5">External curated botanicals</div>
            </div>

            <div className="bg-white p-4 rounded-none border border-[#e5dcd0] shadow-none">
              <div className="text-[11px] font-semibold text-[#7b7366] uppercase">Active Storefront</div>
              <div className="text-xl font-bold text-[#2d5508] mt-1">
                {products.filter((p) => p.status === 'active').length}
              </div>
              <div className="text-[10px] text-[#7b7366] mt-0.5">Visible to buyers</div>
            </div>

            <div className="bg-white p-4 rounded-none border border-[#e5dcd0] shadow-none">
              <div className="text-[11px] font-semibold text-[#7b7366] uppercase">Total Inventory Units</div>
              <div className="text-xl font-bold text-[#131010] mt-1">
                {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
              </div>
              <div className="text-[10px] text-[#7b7366] mt-0.5">Across all sizes & variants</div>
            </div>
          </div>

          {/* Saved Views Tabs & Column Customization */}
          <SavedViewsManager
            activeViewId={activeViewId}
            onSelectView={handleSelectView}
            onSaveCurrentView={handleSaveCurrentView}
            onDeleteCustomView={handleDeleteCustomView}
            customViews={customViews}
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
            counts={viewCounts}
          />

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-none border border-[#e5dcd0] shadow-none flex flex-col md:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7b7366]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Filter by title, slug, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#faf8f5] focus:bg-white border border-[#e5dcd0] focus:border-[#2d5508] rounded-none transition-colors placeholder:text-[#7b7366] focus:outline-none"
              />
            </div>

            {/* Vendor Filter */}
            <div className="w-full md:w-48">
              <select
                value={vendorFilter}
                onChange={(e) => {
                  setVendorFilter(e.target.value);
                  setActiveViewId('custom');
                }}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] rounded-none text-[#131010] focus:outline-none focus:border-[#2d5508]"
              >
                <option value="all">All Brands / Vendors</option>
                <option value="in_house">Empress Glow (In-House)</option>
                <option value="partner">Partner Brands Only</option>
                {distinctVendors
                  .filter((v) => v !== 'Empress Glow')
                  .map((vendor) => (
                    <option key={vendor} value={vendor}>
                      Brand: {vendor}
                    </option>
                  ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-36">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setActiveViewId('custom');
                }}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] rounded-none text-[#131010] focus:outline-none focus:border-[#2d5508]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-36">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setActiveViewId('custom');
                }}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] rounded-none text-[#131010] focus:outline-none focus:border-[#2d5508]"
              >
                <option value="all">All Categories</option>
                <option value="soap">Soap</option>
                <option value="serum">Serum</option>
                <option value="moisturizer">Moisturizer</option>
                <option value="sunscreen">Sunscreen</option>
                <option value="cream">Cream</option>
                <option value="mask">Mask</option>
                <option value="cleanser">Cleanser</option>
                <option value="oil">Oil</option>
                <option value="polish">Polish</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-none border border-[#e5dcd0] shadow-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf6f0] border-b border-[#e5dcd0] text-[#7b7366] font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    {/* Checkbox column */}
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        aria-label="Select all products"
                        className="w-4 h-4 rounded-none accent-[#2d5508] border-[#e5dcd0] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Product</th>
                    {visibleColumns.sku && <th className="py-3 px-4">SKU</th>}
                    {visibleColumns.vendor && <th className="py-3 px-4">Brand / Vendor</th>}
                    {visibleColumns.status && <th className="py-3 px-4">Status</th>}
                    {visibleColumns.inventory && <th className="py-3 px-4">Inventory</th>}
                    {visibleColumns.price && <th className="py-3 px-4">Price (₦)</th>}
                    {visibleColumns.category && <th className="py-3 px-4">Category</th>}
                    {visibleColumns.compliance && <th className="py-3 px-4">NAFDAC Compliance</th>}
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5dcd0]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-[#7b7366]">
                        No products match your active search, view, or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => {
                      const isEmpressGlow = !prod.vendor || prod.vendor === 'Empress Glow';
                      const isHero = prod.slug === 'empress-glow-fruity-soap';
                      const isLowStock = (prod.stock || 0) < 15;
                      const isSelected = selectedProductIds.includes(prod.id);

                      return (
                        <tr
                          key={prod.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-[#2d5508]/5' : 'hover:bg-[#faf8f5]'
                          }`}
                        >
                          {/* Row Checkbox */}
                          <td className="py-3 px-4 w-10">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectOne(prod.id)}
                              aria-label={`Select ${prod.name}`}
                              className="w-4 h-4 rounded-none accent-[#2d5508] border-[#e5dcd0] cursor-pointer"
                            />
                          </td>

                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {visibleColumns.image && (
                                <div className="w-10 h-10 rounded-none bg-[#faf8f5] border border-[#e5dcd0] overflow-hidden relative flex-shrink-0">
                                  <Image
                                    src={prod.images[0] || '/images/fruity-soap-hero.jpg'}
                                    alt={prod.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-semibold text-[#131010] truncate flex items-center gap-1.5">
                                  <span>{prod.name}</span>
                                  {isHero && (
                                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-none bg-[#b88e4e]/10 text-[#b88e4e] border border-[#b88e4e]/30">
                                      Flagship Hero
                                    </span>
                                  )}
                                </div>
                                {!visibleColumns.sku && (
                                  <div className="text-[11px] text-[#7b7366] font-mono truncate">
                                    {prod.sku || `SKU-${prod.slug.substring(0, 8).toUpperCase()}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          {visibleColumns.sku && (
                            <td className="py-3 px-4 font-mono text-[11px] text-[#7b7366]">
                              {prod.sku || `SKU-${prod.slug.substring(0, 8).toUpperCase()}`}
                            </td>
                          )}

                          {/* Brand / Vendor */}
                          {visibleColumns.vendor && (
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-none ${
                                  isEmpressGlow
                                    ? 'bg-[#131010] hover:bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/30 font-serif'
                                    : 'bg-[#faf6f0] text-[#131010] border border-[#e5dcd0]'
                                }`}
                              >
                                <span>{prod.vendor || 'Empress Glow'}</span>
                                {!isEmpressGlow && (
                                  <span className="text-[9px] uppercase px-1 rounded-none bg-[#faf6f0] text-[#131010] border border-[#e5dcd0]">
                                    Partner
                                  </span>
                                )}
                              </span>
                            </td>
                          )}

                          {/* Status */}
                          {visibleColumns.status && (
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-none capitalize ${
                                  prod.status === 'active'
                                    ? 'bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/30'
                                    : prod.status === 'draft'
                                    ? 'bg-[#b88e4e]/10 text-[#b88e4e] border border-[#b88e4e]/30'
                                    : 'bg-[#faf8f5] text-[#131010]'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-none ${
                                    prod.status === 'active'
                                      ? 'bg-[#5a8210]'
                                      : prod.status === 'draft'
                                      ? 'bg-[#b88e4e]'
                                      : 'bg-[#7b7366]'
                                  }`}
                                />
                                {prod.status}
                              </span>
                            </td>
                          )}

                          {/* Inventory */}
                          {visibleColumns.inventory && (
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-semibold ${isLowStock ? 'text-[#b88e4e]' : 'text-[#131010]'}`}>
                                  {prod.stock} in stock
                                </span>
                                {prod.variants && prod.variants.length > 1 && (
                                  <span className="text-[10px] text-[#7b7366]">
                                    ({prod.variants.length} sizes)
                                  </span>
                                )}
                              </div>
                            </td>
                          )}

                          {/* Price */}
                          {visibleColumns.price && (
                            <td className="py-3 px-4">
                              <div className="font-semibold text-[#131010]">
                                ₦{prod.price.toLocaleString('en-NG')}
                              </div>
                              {prod.compare_at_price && prod.compare_at_price > prod.price && (
                                <div className="text-[10px] text-[#7b7366] line-through">
                                  ₦{prod.compare_at_price.toLocaleString('en-NG')}
                                </div>
                              )}
                            </td>
                          )}

                          {/* Category */}
                          {visibleColumns.category && (
                            <td className="py-3 px-4 capitalize text-[#7b7366]">
                              {prod.category}
                            </td>
                          )}

                          {/* NAFDAC Compliance */}
                          {visibleColumns.compliance && (
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-none bg-[#faf8f5] text-[#2d5508] border border-[#2d5508]/20">
                                <span className="w-1.5 h-1.5 bg-[#2d5508] rounded-none"></span>
                                <span>Traditional Formulation</span>
                              </span>
                            </td>
                          )}

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEdit(prod)}
                                className="px-2.5 py-1 text-xs font-semibold text-[#131010] bg-[#faf8f5] hover:bg-[#faf6f0] rounded-none transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-none transition-colors"
                              >
                                Delete
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

          {/* Bulk Action Dock */}
          <BulkActionBar
            selectedIds={selectedProductIds}
            onClearSelection={() => setSelectedProductIds([])}
            onSuccess={handleBulkSuccess}
          />
        </div>
      )}

      {/* TAB 2: ADD NEW PRODUCT WIZARD (Shopify Two-Column Layout) */}
      {activeTab === 'new' && (
        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Main Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & Description Box */}
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7b7366] mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Pure Baobab Glow Elixir or Papaya Enzyme Cleanser"
                  value={newTitle}
                  onChange={handleTitleChange}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#e5dcd0] focus:border-[#2d5508] rounded-none focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7b7366] mb-1.5">
                  Store Slug (URL Identifier)
                </label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono bg-[#faf8f5] border border-[#e5dcd0] rounded-none focus:outline-none text-[#7b7366]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7b7366] mb-1.5">
                  Product Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail traditional botanical enzymes, African fruit extracts, hydration benefits, and usage instructions..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#e5dcd0] focus:border-[#2d5508] rounded-none focus:outline-none"
                />
              </div>
            </div>

            {/* Media / Image Box */}
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-4">
              <ImageDropzoneUploader
                value={newImageUrl}
                onChange={(url) => setNewImageUrl(url)}
                label="Product Image (Upload from Laptop or Drag & Drop)"
                helperText="Drag & drop your product image from your laptop, or click to browse files (JPG, PNG, WEBP, GIF up to 10MB)."
              />

              {/* Preset Quick Picks */}
              <div className="pt-2 border-t border-[#e5dcd0]/60 space-y-1">
                <div className="text-[10px] text-[#7b7366] font-semibold uppercase">Or select demo preset:</div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setNewImageUrl(preset.url)}
                      className={`text-[10px] px-2 py-0.5 rounded-none border transition-colors ${
                        newImageUrl === preset.url
                          ? 'bg-[#131010] text-white border-[#131010]'
                          : 'bg-[#faf8f5] text-[#7b7366] border-[#e5dcd0] hover:bg-[#faf6f0]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing & Profit Margin Box */}
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7b7366]">
                Pricing &amp; Margins
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#7b7366] mb-1">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] focus:border-[#2d5508] rounded-none focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7b7366] mb-1">
                    Compare-at Price (₦)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    placeholder="Optional strikethrough"
                    value={newComparePrice}
                    onChange={(e) =>
                      setNewComparePrice(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] focus:border-[#2d5508] rounded-none focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7b7366] mb-1">
                    Cost per Item (₦)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    placeholder="Wholesale formulation cost"
                    value={newCostPerItem}
                    onChange={(e) =>
                      setNewCostPerItem(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] focus:border-[#2d5508] rounded-none focus:outline-none"
                  />
                </div>
              </div>

              {costNum > 0 && priceNum > 0 && (
                <div className="p-3 bg-[#faf8f5] rounded-none flex items-center justify-between text-xs text-[#7b7366]">
                  <div>
                    Estimated Margin: <strong className="text-[#2d5508]">{marginPercent}%</strong>
                  </div>
                  <div>
                    Net Profit per Unit: <strong>₦{profit.toLocaleString('en-NG')}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Inventory & SKU Box */}
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7b7366]">
                Inventory Management
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#7b7366] mb-1">
                    SKU (Stock Keeping Unit)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., EG-BO-01"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] focus:border-[#2d5508] rounded-none focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7b7366] mb-1">
                    Available Quantity in Stock *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] focus:border-[#2d5508] rounded-none focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Variants (Multiple Sizes / Volumes) */}
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7b7366]">
                    Variants &amp; Options
                  </h3>
                  <p className="text-[11px] text-[#7b7366]">
                    Configure sizes like Small (150g), Medium (250g), Large (350g), XL (500g).
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    className="w-4 h-4 text-[#2d5508] rounded-none border-[#e5dcd0] focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-[#131010]">Has Multiple Sizes</span>
                </label>
              </div>

              {hasVariants && (
                <div className="space-y-3 pt-2">
                  <div className="border border-[#e5dcd0] rounded-none overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#faf6f0] border-b border-[#e5dcd0] text-[#7b7366] font-semibold uppercase text-[10px]">
                        <tr>
                          <th className="py-2 px-3">Option / Size Name</th>
                          <th className="py-2 px-3">SKU</th>
                          <th className="py-2 px-3">Price (₦)</th>
                          <th className="py-2 px-3">Stock</th>
                          <th className="py-2 px-2 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5dcd0]">
                        {newVariants.map((v, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={v.name}
                                onChange={(e) =>
                                  handleVariantRowChange(idx, 'name', e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs border border-[#e5dcd0] rounded-none"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) =>
                                  handleVariantRowChange(idx, 'sku', e.target.value)
                                }
                                className="w-24 px-2 py-1 text-xs font-mono border border-[#e5dcd0] rounded-none"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min={0}
                                step={100}
                                value={v.price}
                                onChange={(e) =>
                                  handleVariantRowChange(idx, 'price', Number(e.target.value))
                                }
                                className="w-24 px-2 py-1 text-xs border border-[#e5dcd0] rounded-none"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min={0}
                                value={v.stock}
                                onChange={(e) =>
                                  handleVariantRowChange(idx, 'stock', Number(e.target.value))
                                }
                                className="w-20 px-2 py-1 text-xs border border-[#e5dcd0] rounded-none"
                              />
                            </td>
                            <td className="py-2 px-2 text-right">
                              {newVariants.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariantRow(idx)}
                                  className="text-[#7b7366] hover:text-red-600 px-1 font-bold"
                                >
                                  &times;
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs font-semibold text-[#2d5508] hover:text-[#5a8210] flex items-center gap-1"
                  >
                    + Add another size variant
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Organization, Brand & Status (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Card */}
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7b7366]">
                Product Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Product['status'])}
                className="w-full px-3 py-2 text-xs bg-white border border-[#e5dcd0] rounded-none focus:outline-none focus:border-[#2d5508]"
              >
                <option value="active">Active (Available on Storefront)</option>
                <option value="draft">Draft (Hidden / Catalog Hold)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Brand / Vendor Card (CRITICAL USER REQUIREMENT) */}
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7b7366]">
                  Brand / Vendor *
                </label>
                <p className="text-[11px] text-[#7b7366]">
                  Mary Asuquo produces Empress Glow (fruity soap flagship) and also curates external partner brands.
                </p>
              </div>

              {/* Vendor Type Switcher */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-none border border-[#e5dcd0] hover:bg-[#faf8f5]">
                  <input
                    type="radio"
                    name="vendorType"
                    checked={newVendorType === 'in_house'}
                    onChange={() => setNewVendorType('in_house')}
                    className="w-4 h-4 text-[#2d5508] focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#131010] block">Empress Glow (In-House)</span>
                    <span className="text-[10px] text-[#7b7366]">Handcrafted by founder Mary Asuquo</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-none border border-[#e5dcd0] hover:bg-[#faf8f5]">
                  <input
                    type="radio"
                    name="vendorType"
                    checked={newVendorType === 'partner'}
                    onChange={() => setNewVendorType('partner')}
                    className="w-4 h-4 text-[#2d5508] focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#131010] block">Partner / External Brand</span>
                    <span className="text-[10px] text-[#7b7366]">Curated herbal &amp; skincare brand</span>
                  </div>
                </label>
              </div>

              {newVendorType === 'partner' && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#7b7366] mb-1">
                    Partner Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Aura Botanicals, Nectar Skin Labs..."
                    value={newCustomVendor}
                    onChange={(e) => setNewCustomVendor(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] focus:border-[#2d5508] rounded-none focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Product Category Card */}
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7b7366]">
                Product Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#e5dcd0] rounded-none focus:outline-none focus:border-[#2d5508]"
              >
                <option value="soap">Soap / Cleansing Bar</option>
                <option value="serum">Serum / Treatment Elixir</option>
                <option value="moisturizer">Moisturizer / Cream</option>
                <option value="sunscreen">Sunscreen SPF 50+</option>
                <option value="mask">Sheet Mask / Clay Mask</option>
                <option value="cleanser">Facial Foam Cleanser</option>
                <option value="oil">Botanical Facial Oil</option>
                <option value="polish">Body Polish / Scrub</option>
                <option value="toner">Herbal Toner / Mist</option>
              </select>
            </div>

            {/* Ingredients Tag Input */}
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7b7366]">
                Key Botanical Ingredients
              </label>
              <input
                type="text"
                placeholder="Papaya, Avocado, Shea Butter, Plantain..."
                value={newIngredients}
                onChange={(e) => setNewIngredients(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#e5dcd0] rounded-none focus:outline-none"
              />
              <p className="text-[10px] text-[#7b7366]">Separate multiple ingredients with commas.</p>
            </div>

            {/* Regulatory Notice Card */}
            <div className="bg-[#faf9f7] p-4 rounded-none border border-[#e5dcd0] space-y-1.5 text-xs text-[#7b7366]">
              <span className="font-semibold text-[#131010] block">NAFDAC Caveat Enforcement</span>
              <p className="text-[11px] leading-relaxed">
                All created products automatically present the statutory caveat: &ldquo;These claims have not been evaluated by NAFDAC.&rdquo;
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#131010] hover:bg-[#2d5508] text-white text-xs font-semibold rounded-none shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Publishing Product...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save &amp; Publish Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: EDIT PRODUCT VIEW */}
      {activeTab === 'edit' && editingProduct && (
        <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-4">
              <div className="flex items-center justify-between border-b border-[#e5dcd0] pb-3">
                <h2 className="text-base font-semibold text-[#131010]">
                  Edit Product: {editingProduct.name}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('all');
                    setEditingProduct(null);
                  }}
                  className="text-xs text-[#7b7366] hover:text-[#131010]"
                >
                  &larr; Back to Catalog
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7b7366] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] rounded-none focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7b7366] mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] rounded-none focus:outline-none"
                />
              </div>

              {/* Product Image Upload & Drag-and-Drop in Edit View */}
              <div className="bg-[#faf8f5] p-4 border border-[#e5dcd0]">
                <ImageDropzoneUploader
                  value={editingProduct.images?.[0] || ''}
                  onChange={(url) =>
                    setEditingProduct({
                      ...editingProduct,
                      images: url ? [url] : [],
                    })
                  }
                  label="Product Image (Upload from Laptop or Drag & Drop)"
                  helperText="Drop an image file from your laptop here, or click to browse files. The preview and photo will update automatically."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#7b7366] mb-1">Price (₦)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-[#e5dcd0] rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7b7366] mb-1">Compare-at Price (₦)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.compare_at_price || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        compare_at_price: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-[#e5dcd0] rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7b7366] mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-[#e5dcd0] rounded-none"
                  />
                </div>
              </div>

              {/* Variants Editor */}
              {editingProduct.variants && editingProduct.variants.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="text-xs font-semibold text-[#7b7366] uppercase">Variant Prices &amp; Stock</div>
                  <div className="border border-[#e5dcd0] rounded-none overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#faf6f0] border-b border-[#e5dcd0] text-[#7b7366] text-[10px] uppercase font-semibold">
                        <tr>
                          <th className="py-2 px-3">Variant</th>
                          <th className="py-2 px-3">Price (₦)</th>
                          <th className="py-2 px-3">Stock Units</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5dcd0]">
                        {editingProduct.variants.map((v) => (
                          <tr key={v.id}>
                            <td className="py-2 px-3 font-semibold">{v.name}</td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min={0}
                                step={100}
                                value={v.price}
                                onChange={(e) => {
                                  const updated = editingProduct.variants!.map((item) =>
                                    item.id === v.id ? { ...item, price: Number(e.target.value) } : item
                                  );
                                  setEditingProduct({ ...editingProduct, variants: updated });
                                }}
                                className="w-24 px-2 py-1 text-xs border border-[#e5dcd0] rounded-none"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min={0}
                                value={v.stock}
                                onChange={(e) => {
                                  const updated = editingProduct.variants!.map((item) =>
                                    item.id === v.id ? { ...item, stock: Number(e.target.value) } : item
                                  );
                                  setEditingProduct({ ...editingProduct, variants: updated });
                                }}
                                className="w-20 px-2 py-1 text-xs border border-[#e5dcd0] rounded-none"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-none border border-[#e5dcd0] shadow-none space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7b7366] mb-1">Status</label>
                <select
                  value={editingProduct.status}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      status: e.target.value as Product['status'],
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] rounded-none"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7b7366] mb-1">Brand / Vendor</label>
                <input
                  type="text"
                  value={editingProduct.vendor || 'Empress Glow'}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, vendor: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] rounded-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7b7366] mb-1">Category</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] rounded-none capitalize"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#131010] hover:bg-[#2d5508] text-white text-xs font-semibold rounded-none shadow-none transition-colors"
                >
                  {submitting ? 'Saving Changes...' : 'Save Product Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('all');
                    setEditingProduct(null);
                  }}
                  className="w-full py-2 bg-[#faf8f5] text-[#7b7366] text-xs font-semibold rounded-none hover:bg-[#faf6f0]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
