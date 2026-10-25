'use client';

import React, { useState } from 'react';

interface ContentEditorProps {
  initialContent: Record<string, any>;
}

export function ContentEditor({ initialContent }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'footer' | 'policies'>('hero');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleFieldChange = (section: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 600);
  };

  return (
    <div className="bg-white border border-[#e5dcd0] overflow-hidden">
      {/* Editor Header */}
      <div className="p-6 border-b border-[#e5dcd0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#faf8f5]">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            Storefront CMS &bull; Copywriter Studio
          </span>
          <h2 className="font-serif text-2xl text-[#131010] font-normal tracking-tight">
            Site Copy &amp; Story Editor
          </h2>
          <p className="text-xs text-[#7b7366] mt-1">
            Update customer-facing brand copy, rituals guidance, policies, and business attributes across all storefront pages.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="px-6 py-2.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] border border-[#131010] hover:border-[#2d5508] transition-colors flex items-center gap-2"
        >
          {saveStatus === 'saving' ? (
            <span>Saving Changes...</span>
          ) : saveStatus === 'saved' ? (
            <span>✓ Content Saved!</span>
          ) : (
            <span>Save All Content</span>
          )}
        </button>
      </div>

      {/* Unconfirmed Business Attributes Warning Banner */}
      <div className="bg-[#fffbeb] border-b border-[#fde68a] p-4 sm:px-6 flex items-start gap-3 text-xs text-[#92400e]">
        <span className="text-base leading-none">⚠️</span>
        <div className="space-y-1">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
            [PLACEHOLDER] Audit Warning &bull; 4 Unconfirmed Business Attributes
          </p>
          <p className="text-[11px] leading-relaxed text-[#78350f]">
            Founder identity (<span className="font-semibold underline">Mary Asuquo vs Mary Udoh</span>), physical studio address (<span className="font-semibold underline">Abuja</span>), CAC registration number, and Instagram account are tagged as <span className="font-mono font-bold bg-amber-200/80 px-1 py-0.5 text-[#78350f]">[PLACEHOLDER]</span>. Never publish these attributes to live production marketing without client sign-off.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5dcd0] px-6 flex space-x-6 bg-white overflow-x-auto">
        {[
          { key: 'hero', label: 'Homepage Hero' },
          { key: 'about', label: 'About & Founder' },
          { key: 'footer', label: 'Footer & Channels' },
          { key: 'policies', label: 'Legal Policies' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3.5 font-mono text-xs uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-[#2d5508] text-[#131010] font-semibold'
                : 'border-transparent text-[#7b7366] hover:text-[#131010]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Forms */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
        {/* HOMEPAGE HERO TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                Main Headline
              </label>
              <input
                type="text"
                value={content.homepage_hero?.headline || ''}
                onChange={(e) => handleFieldChange('homepage_hero', 'headline', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                Subheading
              </label>
              <input
                type="text"
                value={content.homepage_hero?.subhead || ''}
                onChange={(e) => handleFieldChange('homepage_hero', 'subhead', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                Primary Button Label (Pre-launch)
              </label>
              <input
                type="text"
                value={content.homepage_hero?.cta_text || ''}
                onChange={(e) => handleFieldChange('homepage_hero', 'cta_text', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>
          </div>
        )}

        {/* ABOUT & FOUNDER TAB */}
        {activeTab === 'about' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                  Founder Name
                </label>
                {content.about_story?.founder_placeholder && (
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5">
                    ⚠️ PLACEHOLDER &bull; Pending Sign-off
                  </span>
                )}
              </div>
              <input
                type="text"
                value={content.about_story?.founder || ''}
                onChange={(e) => handleFieldChange('about_story', 'founder', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
              <p className="font-mono text-[10px] text-[#7b7366] mt-1">
                Currently set to Mary Asuquo. Tagged as placeholder until confirmed between Mary Asuquo / Mary Udoh.
              </p>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                Inception Date
              </label>
              <input
                type="text"
                value={content.about_story?.founded || ''}
                onChange={(e) => handleFieldChange('about_story', 'founded', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={content.about_story?.tagline || ''}
                onChange={(e) => handleFieldChange('about_story', 'tagline', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                Mission Statement
              </label>
              <textarea
                rows={3}
                value={content.about_story?.mission || ''}
                onChange={(e) => handleFieldChange('about_story', 'mission', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>
          </div>
        )}

        {/* FOOTER & CHANNELS TAB */}
        {activeTab === 'footer' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                  Studio / Physical Address
                </label>
                {content.footer?.address_placeholder && (
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5">
                    ⚠️ PLACEHOLDER &bull; Exact Street Address Pending
                  </span>
                )}
              </div>
              <input
                type="text"
                value={content.footer?.address || ''}
                onChange={(e) => handleFieldChange('footer', 'address', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                WhatsApp DM Link
              </label>
              <input
                type="text"
                value={content.footer?.whatsapp_dm || ''}
                onChange={(e) => handleFieldChange('footer', 'whatsapp_dm', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                WhatsApp Catalog Link
              </label>
              <input
                type="text"
                value={content.footer?.whatsapp_catalog || ''}
                onChange={(e) => handleFieldChange('footer', 'whatsapp_catalog', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                  Instagram Handle
                </label>
                {content.footer?.instagram_placeholder && (
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5">
                    ⚠️ PLACEHOLDER &bull; Hidden in Public UI until Verified
                  </span>
                )}
              </div>
              <input
                type="text"
                value={content.footer?.instagram || ''}
                onChange={(e) => handleFieldChange('footer', 'instagram', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>
          </div>
        )}

        {/* POLICIES TAB */}
        {activeTab === 'policies' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                  CAC Registration Status
                </label>
                {content.policies?.cac_placeholder && (
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5">
                    ⚠️ PLACEHOLDER &bull; Registration Number Pending
                  </span>
                )}
              </div>
              <input
                type="text"
                value={content.policies?.cac || ''}
                onChange={(e) => handleFieldChange('policies', 'cac', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                FCCPC Returns Policy Statement
              </label>
              <textarea
                rows={2}
                value={content.policies?.refunds || ''}
                onChange={(e) => handleFieldChange('policies', 'refunds', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
              <p className="font-mono text-[10px] text-[#7b7366] mt-1">
                Must remain strictly compliant with FCCPC rules: 7-day refund guarantee on defective products.
              </p>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
                Monitored DPO Contact Email
              </label>
              <input
                type="email"
                value={content.policies?.ndpa_dpo || ''}
                onChange={(e) => handleFieldChange('policies', 'ndpa_dpo', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-sm text-[#131010] outline-none"
              />
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-[#e5dcd0] flex justify-end">
          <button
            type="submit"
            disabled={saveStatus === 'saving'}
            className="px-8 py-3 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] border border-[#131010] hover:border-[#2d5508] transition-colors"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save All Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
