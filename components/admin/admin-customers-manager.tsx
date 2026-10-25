'use client';

import React, { useState } from 'react';

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  ndpa_consent_at: string;
  orders_count: number;
  total_spent: number;
  last_order_date: string | null;
}

interface AdminCustomersManagerProps {
  initialCustomers: CustomerItem[];
}

export function AdminCustomersManager({ initialCustomers }: AdminCustomersManagerProps) {
  const [customers] = useState<CustomerItem[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = customers.reduce((acc, c) => acc + (c.total_spent || 0), 0);
  const customersWithOrders = customers.filter((c) => c.orders_count > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-[#e5dcd0]">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            Audience Directory &bull; NDPA 2023 Regulated
          </span>
          <h1 className="font-serif text-2xl font-normal text-[#131010] tracking-tight">
            Customer Directory &amp; Privacy Records
          </h1>
          <p className="text-xs text-[#7b7366] mt-1">
            Registered buyer profiles, order retention records, and NDPA compliance timestamps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/2348035650299"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-[0.18em] px-4 py-2 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] border border-[#131010] hover:border-[#2d5508] transition-colors flex items-center gap-1.5"
          >
            <span>WhatsApp Business ↗</span>
          </a>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-[#e5dcd0] space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366] block">
            Total Customers
          </span>
          <span className="font-serif text-2xl font-normal text-[#131010] block">
            {customers.length}
          </span>
          <span className="font-mono text-[10px] text-[#7b7366]">Registered profiles</span>
        </div>

        <div className="bg-white p-5 border border-[#e5dcd0] space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366] block">
            Purchasing Clients
          </span>
          <span className="font-serif text-2xl font-normal text-[#2d5508] block">
            {customersWithOrders}
          </span>
          <span className="font-mono text-[10px] text-[#2d5508]">&ge; 1 settled order</span>
        </div>

        <div className="bg-white p-5 border border-[#e5dcd0] space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366] block">
            Account GMV
          </span>
          <span className="font-serif text-2xl font-normal text-[#131010] block">
            ₦{totalRevenue.toLocaleString('en-NG')}
          </span>
          <span className="font-mono text-[10px] text-[#7b7366]">Paystack total</span>
        </div>

        <div className="bg-white p-5 border border-[#e5dcd0] space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366] block">
            NDPA Consent
          </span>
          <span className="font-serif text-2xl font-normal text-[#2d5508] block">
            100%
          </span>
          <span className="font-mono text-[10px] text-[#2d5508]">Statutory audit logged</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 border border-[#e5dcd0] flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7b7366]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search customers by name, email, or Nigerian phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf8f5] focus:bg-white border border-[#e5dcd0] focus:border-[#2d5508] transition-colors placeholder:text-[#7b7366] text-[#131010] outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#e5dcd0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf6f0] border-b border-[#e5dcd0] text-[#7b7366] font-mono text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Coordinates</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Total Settled (₦)</th>
                <th className="py-3 px-4">NDPA Consent Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5dcd0]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#7b7366] font-mono text-xs">
                    No customers found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const initials = cust.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  const cleanPhone = cust.phone.replace(/[^0-9]/g, '');

                  return (
                    <tr key={cust.id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-[#2d5508] text-[#f7f1e8] font-mono font-bold flex items-center justify-center text-xs border border-[#5a8210]">
                            {initials}
                          </div>
                          <div>
                            <div className="font-medium text-[#131010]">{cust.name}</div>
                            <div className="font-mono text-[10px] text-[#7b7366]">ID: {cust.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-[#131010]">{cust.email}</div>
                        <div className="font-mono text-[10px] text-[#7b7366]">{cust.phone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-[#131010]">
                          {cust.orders_count} orders
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-medium text-[#131010]">
                          ₦{cust.total_spent.toLocaleString('en-NG')}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#2d5508]/30 bg-[#2d5508]/10 text-[#2d5508] font-mono text-[9px] uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-[#5a8210]"></span>
                          <span>
                            {new Date(cust.ndpa_consent_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 text-[#2d5508] bg-[#2d5508]/10 hover:bg-[#2d5508]/20 border border-[#2d5508]/30 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              WhatsApp
                            </a>
                          )}
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 text-[#131010] bg-white hover:bg-[#faf6f0] border border-[#e5dcd0] transition-colors"
                          >
                            Dossier
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

      {/* Customer Inspector Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#e5dcd0] max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#e5dcd0] pb-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
                  Customer Dossier &bull; NDPA Profile
                </span>
                <h3 className="font-serif text-xl text-[#131010] font-normal">{selectedCustomer.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#7b7366] hover:text-[#131010] font-mono text-sm border border-[#e5dcd0] px-2 py-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#faf8f5] border border-[#e5dcd0]">
                <div>
                  <span className="font-mono text-[9px] uppercase text-[#7b7366] block">Email</span>
                  <span className="text-[#131010] font-medium">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase text-[#7b7366] block">Phone</span>
                  <span className="font-mono text-xs text-[#131010]">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase text-[#7b7366] block">Registered On</span>
                  <span className="font-mono text-[11px] text-[#131010]">
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase text-[#7b7366] block">NDPA Consent</span>
                  <span className="font-mono text-[11px] text-[#2d5508] font-medium">
                    Verified {new Date(selectedCustomer.ndpa_consent_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-1">
                <span className="font-mono text-[9px] uppercase text-[#7b7366] block">
                  Purchasing Activity
                </span>
                <div className="flex justify-between text-[#131010]">
                  <span>Lifetime Orders:</span>
                  <span className="font-mono font-medium">{selectedCustomer.orders_count}</span>
                </div>
                <div className="flex justify-between text-[#131010]">
                  <span>Total Settled Spend:</span>
                  <span className="font-mono font-bold text-[#2d5508]">₦{selectedCustomer.total_spent.toLocaleString('en-NG')}</span>
                </div>
              </div>

              <div className="p-3 bg-[#faf6f0] border border-[#e5dcd0] text-[11px] text-[#524b42] space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#131010] block font-semibold">
                  NDPA Compliance Notice
                </span>
                <p>
                  Customer has statutory rights to data access, modification, and deletion. Requests can be sent to dpo@empressglowemporium.com.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#e5dcd0]">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] border border-[#131010] hover:border-[#2d5508] transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
