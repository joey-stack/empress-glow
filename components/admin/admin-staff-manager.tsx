'use client';
import React, { useState, useEffect } from 'react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'inventory_manager' | 'support_staff' | 'read_only';
  title: string;
  status: 'active' | 'invited' | 'suspended';
  created_at: string;
  last_active_at?: string;
}

interface RoleDefinition {
  id: string;
  label: string;
  description: string;
  permissions: string[];
}

export function AdminStaffManager() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [currentActor, setCurrentActor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Invite modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'super_admin' | 'inventory_manager' | 'support_staff' | 'read_only'>('support_staff');
  const [inviteTitle, setInviteTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active role filter / selected staff for details
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/staff');
      const data = await res.json();
      if (data.success) {
        setStaff(data.staff);
        setRoles(data.roles || []);
        setCurrentActor(data.currentActor);
      } else {
        setError(data.error || 'Failed to load staff accounts');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
          title: inviteTitle.trim() || 'Store Administrator',
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStaff(data.staff);
        setSuccessMessage(`Access invitation sent to ${inviteName} (${inviteRole}).`);
        setIsInviteOpen(false);
        setInviteName('');
        setInviteEmail('');
        setInviteTitle('');
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(data.error || 'Failed to invite staff member');
      }
    } catch (err: any) {
      setError(err.message || 'Invitation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (staffId: string, newRole: string) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: staffId, role: newRole }),
      });
      const data = await res.json();

      if (data.success) {
        setStaff(data.staff);
        setSuccessMessage(`Updated role to ${newRole}`);
        if (editingStaff?.id === staffId) {
          setEditingStaff((prev) => (prev ? { ...prev, role: newRole as any } : null));
        }
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setError(data.error || 'Failed to update role');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    }
  };

  const handleStatusToggle = async (staffMember: StaffUser) => {
    const nextStatus = staffMember.status === 'active' ? 'suspended' : 'active';
    try {
      setError(null);
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: staffMember.id, status: nextStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setStaff(data.staff);
        setSuccessMessage(`Status updated to ${nextStatus}`);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleDeleteStaff = async (staffId: string, name: string) => {
    if (!window.confirm(`Are you certain you wish to revoke all access for ${name}? This action is recorded in the immutable audit log.`)) {
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/admin/staff?id=${staffId}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setStaff(data.staff);
        setSuccessMessage(`Revoked access for ${name}`);
        if (editingStaff?.id === staffId) setEditingStaff(null);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setError(data.error || 'Failed to revoke staff access');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to revoke access');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#b88e4e] bg-[#b88e4e]/10 text-[#8c6b32] font-semibold">
            Super Admin
          </span>
        );
      case 'inventory_manager':
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#2d5508] bg-[#2d5508]/10 text-[#2d5508] font-semibold">
            Inventory Lead
          </span>
        );
      case 'support_staff':
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-purple-300 bg-purple-50 text-purple-900 font-semibold">
            Support Specialist
          </span>
        );
      case 'read_only':
      default:
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#7b7366] bg-[#7b7366]/10 text-[#7b7366] font-semibold">
            Auditor (Read-Only)
          </span>
        );
    }
  };

  const filteredStaff = roleFilter === 'all' ? staff : staff.filter((s) => s.role === roleFilter);

  return (
    <div className="space-y-6">
      {/* Toast Banners */}
      {successMessage && (
        <div className="p-3.5 bg-[#2d5508]/10 border border-[#2d5508] text-[#2d5508] text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#5a8210]" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-[#2d5508] hover:underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-900 hover:underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-[#e5dcd0] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            Access Control &bull; Governance
          </span>
          <h1 className="font-serif text-2xl text-[#131010] font-normal tracking-tight">
            Staff Accounts &amp; RBAC Permissions
          </h1>
          <p className="text-xs text-[#7b7366] max-w-2xl mt-1 leading-relaxed">
            Manage administrative personnel, assign granular operational roles (Super Admin, Inventory Manager, Support Staff, Auditor), and maintain strict compliance with NDPA statutory access boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] px-4 py-2 border border-[#131010] hover:border-[#2d5508] transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#5a8210]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Role Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roles.map((r) => {
          const count = staff.filter((s) => s.role === r.id).length;
          const isSelected = roleFilter === r.id;

          return (
            <button
              key={r.id}
              onClick={() => setRoleFilter(isSelected ? 'all' : r.id)}
              className={`text-left p-4 border transition-all ${
                isSelected
                  ? 'bg-white border-[#131010] shadow-xs'
                  : 'bg-white border-[#e5dcd0] hover:border-[#131010]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#131010] font-semibold">
                  {r.label}
                </span>
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#faf8f5] border border-[#e5dcd0] text-[#131010]">
                  {count}
                </span>
              </div>
              <p className="text-[11px] text-[#7b7366] line-clamp-2 leading-relaxed mb-3">
                {r.description}
              </p>
              <div className="font-mono text-[9px] text-[#5a8210] flex items-center gap-1">
                <span>{r.permissions.length} Permissions</span>
                <span>&rarr;</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Directory Header */}
      <div className="bg-white border border-[#e5dcd0] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Filter:</span>
          <div className="flex flex-wrap gap-1">
            {['all', 'super_admin', 'inventory_manager', 'support_staff', 'read_only'].map((f) => (
              <button
                key={f}
                onClick={() => setRoleFilter(f)}
                className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-colors ${
                  roleFilter === f
                    ? 'bg-[#131010] text-[#f7f1e8] border-[#131010]'
                    : 'bg-white text-[#7b7366] border-[#e5dcd0] hover:border-[#131010]'
                }`}
              >
                {f === 'all' ? 'All Roles' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="font-mono text-[10px] text-[#7b7366]">
          Showing {filteredStaff.length} of {staff.length} staff accounts
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white border border-[#e5dcd0] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e5dcd0] bg-[#faf8f5] font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366]">
              <th className="py-3 px-4">Member Name &amp; Title</th>
              <th className="py-3 px-4">Role Tier</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Activity</th>
              <th className="py-3 px-4 text-right">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dcd0]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-[#7b7366] font-mono">
                  Loading Empress Glow staff directory...
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-[#7b7366] font-mono">
                  No staff members match the selected role filter.
                </td>
              </tr>
            ) : (
              filteredStaff.map((member) => {
                const isSuperAdmin = member.role === 'super_admin';
                const isMe = currentActor?.id === member.id;

                return (
                  <tr key={member.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#131010] text-[#f7f1e8] font-mono text-xs flex items-center justify-center font-bold border border-[#262220]">
                          {member.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#131010] flex items-center gap-2">
                            <span>{member.name}</span>
                            {isMe && (
                              <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.2 bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/30">
                                Current User
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#7b7366] flex items-center gap-1.5 font-mono">
                            <span>{member.email}</span>
                            <span>&bull;</span>
                            <span className="text-[#131010] font-sans">{member.title}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getRoleBadge(member.role)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                          member.status === 'active'
                            ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#7b7366]">
                      {member.last_active_at
                        ? new Date(member.last_active_at).toLocaleString('en-NG', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : 'Never'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Role Selector dropdown */}
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className="bg-white border border-[#e5dcd0] text-[11px] font-mono px-2 py-1 text-[#131010] hover:border-[#131010] focus:outline-none"
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="inventory_manager">Inventory Manager</option>
                          <option value="support_staff">Support Staff</option>
                          <option value="read_only">Read-Only Auditor</option>
                        </select>

                        {/* Status Toggle */}
                        <button
                          onClick={() => handleStatusToggle(member)}
                          className="px-2 py-1 border border-[#e5dcd0] text-[10px] font-mono hover:bg-[#faf6f0] text-[#131010] transition-colors"
                          title="Toggle Active/Suspended status"
                        >
                          {member.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>

                        {/* Revoke button (disabled for self) */}
                        {!isMe && (
                          <button
                            onClick={() => handleDeleteStaff(member.id, member.name)}
                            className="p-1 text-[#7b7366] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                            title="Revoke access"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#e5dcd0] max-w-lg w-full p-6 space-y-5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-[#e5dcd0]">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5a8210] block">
                  Staff Invitation &bull; Access Provisioning
                </span>
                <h3 className="font-serif text-lg text-[#131010]">Invite New Administrator</h3>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="p-1 text-[#7b7366] hover:text-[#131010] border border-[#e5dcd0]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Zainab Sanusi"
                  className="w-full px-3 py-2 border border-[#e5dcd0] text-xs text-[#131010] focus:border-[#131010] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="zainab@empressglowemporium.com"
                  className="w-full px-3 py-2 border border-[#e5dcd0] text-xs text-[#131010] focus:border-[#131010] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
                  Administrative Title
                </label>
                <input
                  type="text"
                  value={inviteTitle}
                  onChange={(e) => setInviteTitle(e.target.value)}
                  placeholder="e.g. Saponification Specialist or Care Coordinator"
                  className="w-full px-3 py-2 border border-[#e5dcd0] text-xs text-[#131010] focus:border-[#131010] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
                  Assigned Operational Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#e5dcd0] text-xs text-[#131010] focus:border-[#131010] focus:outline-none bg-white font-mono"
                >
                  <option value="super_admin">Super Admin (Full Enterprise Access)</option>
                  <option value="inventory_manager">Inventory Manager (Catalog &amp; Stock)</option>
                  <option value="support_staff">Support Staff (Orders &amp; Client Inquiries)</option>
                  <option value="read_only">Read-Only Auditor (Regulatory Inspector)</option>
                </select>
              </div>

              {/* Role Permissions Preview Box */}
              <div className="p-3 bg-[#faf8f5] border border-[#e5dcd0] space-y-1 text-xs">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block">
                  Permissions Granted:
                </span>
                <p className="text-[11px] text-[#524b42]">
                  {roles.find((r) => r.id === inviteRole)?.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {roles
                    .find((r) => r.id === inviteRole)
                    ?.permissions.map((p) => (
                      <span
                        key={p}
                        className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 bg-white border border-[#e5dcd0] text-[#131010]"
                      >
                        {p.replace('_', ' ')}
                      </span>
                    ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e5dcd0]">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 border border-[#e5dcd0] text-xs font-mono uppercase tracking-wider text-[#7b7366] hover:text-[#131010]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Inviting...' : 'Confirm & Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
