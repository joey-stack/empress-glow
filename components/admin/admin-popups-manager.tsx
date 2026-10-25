'use client';

import React, { useState } from 'react';
import { MarketingPopup } from '@/lib/insforge/queries';

interface AdminPopupsManagerProps {
  initialPopups: MarketingPopup[];
}

export function AdminPopupsManager({ initialPopups }: AdminPopupsManagerProps) {
  const [popups, setPopups] = useState<MarketingPopup[]>(initialPopups);
  const [showCreate, setShowCreate] = useState(false);

  // New popup form state
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [ctaText, setCtaText] = useState('Explore Botanicals');
  const [ctaLink, setCtaLink] = useState('#notify');
  const [triggerType, setTriggerType] = useState<MarketingPopup['trigger_type']>('time_delay');
  const [triggerValue, setTriggerValue] = useState(5);
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleToggleActive = async (popup: MarketingPopup) => {
    const updatedStatus = !popup.is_active;

    try {
      const res = await fetch('/api/admin/popups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: popup.id,
          is_active: updatedStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to toggle status');

      setPopups((prev) =>
        prev.map((p) => (p.id === popup.id ? { ...p, is_active: updatedStatus } : p))
      );
      setMessage(`"${popup.name}" is now ${updatedStatus ? 'ACTIVE' : 'PAUSED'}.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/popups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          headline,
          body,
          cta_text: ctaText,
          cta_link: ctaLink,
          trigger_type: triggerType,
          trigger_value: triggerValue,
          is_active: isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create popup');

      setPopups((prev) => [data.popup, ...prev]);
      setShowCreate(false);
      setName('');
      setHeadline('');
      setBody('');
      setMessage('Marketing popup created successfully.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this popup?')) return;

    try {
      const res = await fetch(`/api/admin/popups?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete popup');

      setPopups((prev) => prev.filter((p) => p.id !== id));
      setMessage('Popup deleted successfully.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 border border-[#e5dcd0] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            Conversion &bull; Promotional Modals
          </span>
          <h1 className="font-serif text-2xl font-normal text-[#131010] tracking-tight">
            Marketing Popups &amp; Announcements
          </h1>
          <p className="text-xs text-[#7b7366] mt-1 max-w-2xl leading-relaxed">
            Manage pre-launch VIP reservation announcements, exit-intent overlays, and seasonal promotion banners.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] px-4 py-2.5 border border-[#131010] hover:border-[#2d5508] transition-colors"
        >
          {showCreate ? 'Close Form' : '+ New Marketing Popup'}
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 border font-mono text-xs ${
            message.startsWith('Error')
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
          }`}
        >
          {message}
        </div>
      )}

      {/* Create Popup Form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 sm:p-8 border border-[#e5dcd0] space-y-4 max-w-2xl"
        >
          <h3 className="font-serif text-lg font-normal text-[#131010]">Configure Marketing Popup</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                Internal Identifier
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pre-Launch VIP Reservation Banner"
                className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                Trigger Method
              </label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as MarketingPopup['trigger_type'])}
                className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
              >
                <option value="time_delay">Time Delay (Seconds)</option>
                <option value="exit_intent">Exit Intent (Mouse Leave)</option>
                <option value="scroll">Scroll Percentage (%)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
              Customer Facing Headline
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Reserve Your Spot in the Private Batch Circle"
              className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
              Promotional Copy
            </label>
            <textarea
              rows={2}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter promotional copy or special pre-launch reservation instructions..."
              className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none placeholder:text-[#7b7366]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                required
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Join VIP Waitlist"
                className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                CTA Target Anchor
              </label>
              <input
                type="text"
                required
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="e.g. #notify or /products"
                className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                Trigger Value ({triggerType === 'time_delay' ? 'Sec' : '%'})
              </label>
              <input
                type="number"
                min={0}
                value={triggerValue}
                onChange={(e) => setTriggerValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center pt-2">
            <label className="flex items-center text-xs text-[#131010] cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 text-[#2d5508] border-[#e5dcd0]"
              />
              <span className="ml-2 font-mono text-xs">Activate this modal immediately</span>
            </label>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#e5dcd0]">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] px-6 py-2.5 border border-[#131010] hover:border-[#2d5508] transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Save & Publish Modal'}
            </button>
          </div>
        </form>
      )}

      {/* Popups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {popups.map((pop) => (
          <div
            key={pop.id}
            className={`p-6 border bg-white space-y-4 ${
              pop.is_active ? 'border-[#2d5508]' : 'border-[#e5dcd0] opacity-80'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-[#131010] font-mono">{pop.name}</span>
                <div className="font-mono text-[10px] text-[#7b7366] mt-0.5">
                  Trigger:{' '}
                  <span className="capitalize text-[#131010]">
                    {pop.trigger_type.replace('_', ' ')}
                  </span>{' '}
                  ({pop.trigger_value}
                  {pop.trigger_type === 'time_delay' ? 's' : '%'})
                </div>
              </div>

              {/* Status Switch */}
              <button
                onClick={() => handleToggleActive(pop)}
                className={`font-mono text-[9px] uppercase tracking-wider px-3 py-1 border transition-colors ${
                  pop.is_active
                    ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/40'
                    : 'bg-[#faf8f5] text-[#7b7366] border-[#e5dcd0]'
                }`}
              >
                {pop.is_active ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="bg-[#faf8f5] p-4 border border-[#e5dcd0] space-y-1.5">
              <h4 className="font-serif font-normal text-sm text-[#131010]">&ldquo;{pop.headline}&rdquo;</h4>
              <p className="text-xs text-[#524b42] leading-relaxed">{pop.body}</p>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#7b7366]">CTA:</span>
                <span className="font-mono text-[10px] text-[#131010] bg-[#faf8f5] border border-[#e5dcd0] px-2 py-0.5">
                  {pop.cta_text} &rarr; {pop.cta_link}
                </span>
              </div>

              <button
                onClick={() => handleDelete(pop.id)}
                className="font-mono text-[10px] uppercase tracking-wider text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
