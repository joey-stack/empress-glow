'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SavedAddress, Order } from '@/lib/insforge/queries';

interface AccountDashboardProps {
  initialUser: {
    id: string;
    email: string;
    name: string;
    phone: string;
    created_at: string;
    ndpa_consent_at: string;
  };
  initialAddresses: SavedAddress[];
  initialOrders: Order[];
}

export function AccountDashboard({
  initialUser,
  initialAddresses,
  initialOrders,
}: AccountDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'privacy'>('profile');

  // Profile form state
  const [name, setName] = useState(initialUser.name);
  const [phone, setPhone] = useState(initialUser.phone);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Addresses state
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Abuja');
  const [newState, setNewState] = useState('Abuja FCT');
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      setProfileMessage('Profile details saved successfully.');
    } catch (err: any) {
      setProfileMessage(`Error: ${err.message}`);
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaving(true);

    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newLabel,
          street: newStreet,
          city: newCity,
          state: newState,
          is_default: newIsDefault,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add address');

      setAddresses((prev) => {
        if (newIsDefault) {
          return [...prev.map((a) => ({ ...a, is_default: false })), data.address];
        }
        return [...prev, data.address];
      });

      setShowAddAddress(false);
      setNewStreet('');
    } catch (err: any) {
      alert(`Error adding address: ${err.message}`);
    } finally {
      setAddressSaving(false);
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await fetch(`/api/account/addresses?id=${addressId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete address');
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Handle NDPA Account Deletion
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to delete account');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      alert(`Deletion error: ${err.message}`);
      setDeleting(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner — Sharp Architectural Design */}
      <div className="bg-white rounded-none p-6 sm:p-8 border border-[#e5dcd0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block mb-1">
            Empress Member Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#131010]">
            Welcome, {initialUser.name || 'Empress Client'}
          </h1>
          <p className="font-mono text-xs text-[#7b7366] mt-1">
            Manage your personal profile, addresses, order history, and privacy settings.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="font-mono text-xs uppercase tracking-[0.16em] px-4 py-2.5 rounded-none border border-[#131010] text-[#131010] hover:bg-[#131010] hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Main Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-none font-mono text-xs uppercase tracking-wider transition-colors border ${
              activeTab === 'profile'
                ? 'bg-[#131010] text-white border-[#131010]'
                : 'bg-white text-[#524b42] border-[#e5dcd0] hover:border-[#131010]'
            }`}
          >
            <span>Personal Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-none font-mono text-xs uppercase tracking-wider transition-colors border flex items-center justify-between ${
              activeTab === 'addresses'
                ? 'bg-[#131010] text-white border-[#131010]'
                : 'bg-white text-[#524b42] border-[#e5dcd0] hover:border-[#131010]'
            }`}
          >
            <span>Saved Addresses</span>
            <span className="text-[10px] font-mono opacity-80">({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-none font-mono text-xs uppercase tracking-wider transition-colors border flex items-center justify-between ${
              activeTab === 'orders'
                ? 'bg-[#131010] text-white border-[#131010]'
                : 'bg-white text-[#524b42] border-[#e5dcd0] hover:border-[#131010]'
            }`}
          >
            <span>Order History</span>
            <span className="text-[10px] font-mono opacity-80">({initialOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full text-left px-4 py-3 rounded-none font-mono text-xs uppercase tracking-wider transition-colors border ${
              activeTab === 'privacy'
                ? 'bg-[#131010] text-white border-[#131010]'
                : 'bg-white text-[#524b42] border-[#e5dcd0] hover:border-[#131010]'
            }`}
          >
            <span>NDPA Privacy & Data</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="md:col-span-3">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-none p-6 sm:p-8 border border-[#e5dcd0] space-y-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#131010]">
                  Personal Profile
                </h2>
                <p className="font-mono text-xs text-[#7b7366] mt-0.5">
                  Update your contact details for orders and notifications.
                </p>
              </div>

              {profileMessage && (
                <div
                  className={`p-4 rounded-none text-xs font-mono border ${
                    profileMessage.startsWith('Error')
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-[#f7f5f0] text-[#2d5508] border-[#e5dcd0]'
                  }`}
                >
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-none border border-[#e5dcd0] font-mono text-xs text-[#131010] focus:outline-none focus:border-[#2d5508]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                    Email Address (Immutable)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={initialUser.email}
                    className="w-full px-3 py-2.5 rounded-none border border-[#e5dcd0] bg-[#faf6f0] font-mono text-xs text-[#7b7366] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                    Phone Number (WhatsApp & Delivery)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-none border border-[#e5dcd0] font-mono text-xs text-[#131010] focus:outline-none focus:border-[#2d5508]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="bg-[#2d5508] hover:bg-[#5a8210] text-white font-mono text-xs uppercase tracking-[0.18em] px-6 py-3 rounded-none transition-colors disabled:opacity-50"
                  >
                    {profileSaving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-none p-6 sm:p-8 border border-[#e5dcd0] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5dcd0]">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#131010]">
                    Saved Shipping Addresses
                  </h2>
                  <p className="font-mono text-xs text-[#7b7366] mt-0.5">
                    Addresses stored securely for fast checkout.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="bg-[#2d5508] hover:bg-[#5a8210] text-white font-mono text-xs uppercase tracking-[0.18em] px-4 py-2.5 rounded-none transition-colors"
                >
                  {showAddAddress ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="bg-[#faf6f0] p-6 rounded-none border border-[#e5dcd0] space-y-4"
                >
                  <h3 className="font-serif text-base text-[#131010]">
                    Add New Address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                        Label (e.g. Home, Office)
                      </label>
                      <input
                        type="text"
                        required
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="w-full px-3 py-2 rounded-none border border-[#e5dcd0] bg-white font-mono text-xs text-[#131010]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                        State
                      </label>
                      <select
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full px-3 py-2 rounded-none border border-[#e5dcd0] bg-white font-mono text-xs text-[#131010]"
                      >
                        <option value="Abuja FCT">Abuja FCT</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. 14 Maitama District, Plot 202"
                      className="w-full px-3 py-2 rounded-none border border-[#e5dcd0] bg-white font-mono text-xs text-[#131010]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-none border border-[#e5dcd0] bg-white font-mono text-xs text-[#131010]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newIsDefault}
                      onChange={(e) => setNewIsDefault(e.target.checked)}
                      className="rounded-none text-[#2d5508] focus:ring-[#2d5508]"
                    />
                    <label htmlFor="isDefault" className="font-mono text-xs text-[#524b42]">
                      Set as primary default address
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={addressSaving}
                      className="bg-[#2d5508] hover:bg-[#5a8210] text-white font-mono text-xs uppercase tracking-[0.18em] px-5 py-2.5 rounded-none transition-colors"
                    >
                      {addressSaving ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-10 bg-[#faf6f0] rounded-none border border-dashed border-[#e5dcd0]">
                  <p className="font-mono text-xs text-[#7b7366]">No saved addresses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-none border border-[#e5dcd0] bg-white space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-medium text-[#131010]">
                          {addr.label}
                        </span>
                        {addr.is_default && (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#2d5508] bg-[#f7f5f0] border border-[#e5dcd0] px-2 py-0.5 rounded-none">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-[#524b42]">{addr.street}</p>
                      <p className="font-mono text-xs text-[#7b7366]">
                        {addr.city}, {addr.state}
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="font-mono text-[10px] text-red-600 hover:underline uppercase tracking-wider"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-none p-6 sm:p-8 border border-[#e5dcd0] space-y-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#131010]">
                  Order History
                </h2>
                <p className="font-mono text-xs text-[#7b7366] mt-0.5">
                  Track deliveries and review previous botanical formulation purchases.
                </p>
              </div>

              {initialOrders.length === 0 ? (
                <div className="text-center py-12 bg-[#faf6f0] rounded-none border border-dashed border-[#e5dcd0] space-y-2">
                  <p className="font-serif text-base text-[#131010]">No past orders found.</p>
                  <p className="font-mono text-xs text-[#7b7366]">
                    Your completed purchases will appear here automatically.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block mt-3 bg-[#131010] hover:bg-[#2d5508] text-white font-mono text-xs uppercase tracking-[0.18em] px-5 py-2.5 rounded-none transition-colors"
                  >
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {initialOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-none border border-[#e5dcd0] hover:border-[#131010] transition-colors bg-white space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0ece4]">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block">
                            Order Reference
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#131010]">
                            {ord.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-[#7b7366]">
                            {new Date(ord.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span
                            className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-none border ${
                              ord.status === 'delivered'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : ord.status === 'paid'
                                ? 'bg-[#f7f5f0] text-[#2d5508] border-[#e5dcd0]'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 font-mono text-xs text-[#524b42]">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>
                              {item.name} ({item.variantName}) × {item.quantity}
                            </span>
                            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#f0ece4] flex justify-between font-mono text-xs">
                        <span className="text-[#7b7366]">Total (incl. delivery)</span>
                        <span className="font-serif text-sm font-semibold text-[#131010]">
                          ₦{ord.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-none p-6 sm:p-8 border border-[#e5dcd0] space-y-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#131010]">
                  NDPA 2023 Statutory Privacy Controls
                </h2>
                <p className="font-mono text-xs text-[#7b7366] mt-0.5">
                  Nigeria Data Protection Act rights to access, export, or delete your information.
                </p>
              </div>

              <div className="p-5 rounded-none border border-[#e5dcd0] bg-[#faf6f0] space-y-2 font-mono text-xs text-[#524b42]">
                <h3 className="font-serif text-base text-[#131010]">
                  Statutory Consent Record
                </h3>
                <p>
                  Affirmative consent recorded on{' '}
                  <span className="text-[#131010] font-semibold">
                    {initialUser.ndpa_consent_at
                      ? new Date(initialUser.ndpa_consent_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Registration'}
                  </span>
                  .
                </p>
                <p className="text-[11px] text-[#7b7366]">
                  Data protection inquiries: dpo@empressglowemporium.com
                </p>
              </div>

              <div className="p-5 rounded-none border border-red-200 bg-red-50/30 space-y-3">
                <h3 className="font-serif text-base text-red-900">
                  Right to Erasure (Delete Account)
                </h3>
                <p className="font-mono text-xs text-red-700 leading-relaxed">
                  Permanently deletes your account and addresses. Order records are anonymized per 6-year tax retention compliance.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="font-mono text-xs uppercase tracking-[0.16em] bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-none transition-colors"
                >
                  Request Account Deletion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none border border-[#e5dcd0] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="font-serif text-xl text-[#131010]">
              Confirm Account Erasure
            </h3>
            <p className="font-mono text-xs text-[#524b42] leading-relaxed">
              This action is permanent and cannot be undone. Are you sure you wish to proceed?
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 font-mono text-xs uppercase tracking-wider border border-[#e5dcd0] rounded-none hover:bg-[#faf6f0]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 font-mono text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-none disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
