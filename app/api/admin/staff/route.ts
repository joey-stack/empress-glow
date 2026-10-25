import { NextRequest, NextResponse } from 'next/server';
import {
  getStaffUsers,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser,
  createAuditLog,
  ROLE_PERMISSIONS,
  AdminRole,
} from '@/lib/insforge/queries';
import { requireAdminPermission, getAdminActor } from '@/lib/auth/admin-guard';

export async function GET(req: NextRequest) {
  try {
    const staff = await getStaffUsers();
    const currentActor = await getAdminActor(req);

    return NextResponse.json({
      success: true,
      staff,
      currentActor,
      roles: [
        {
          id: 'super_admin',
          label: 'Super Admin',
          description: 'Unrestricted enterprise access to catalog, finance, refunds, staff, and system compliance.',
          permissions: ROLE_PERMISSIONS['super_admin'],
        },
        {
          id: 'inventory_manager',
          label: 'Inventory Manager',
          description: 'Catalog formulation management, bulk pricing, batch stock updates, and order visibility.',
          permissions: ROLE_PERMISSIONS['inventory_manager'],
        },
        {
          id: 'support_staff',
          label: 'Support & Care Specialist',
          description: 'Order inspection, customer care notes, WhatsApp tracking, and return status coordination.',
          permissions: ROLE_PERMISSIONS['support_staff'],
        },
        {
          id: 'read_only',
          label: 'Read-Only Auditor',
          description: 'Regulatory NAFDAC/NDPA inspector view. Full read-only access with zero write permissions.',
          permissions: ROLE_PERMISSIONS['read_only'],
        },
      ],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authCheck = await requireAdminPermission('manage_staff', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const { name, email, role, title } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Staff full name is required.' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid business email is required.' }, { status: 400 });
    }
    if (!role || !['super_admin', 'inventory_manager', 'support_staff', 'read_only'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Valid admin role is required.' }, { status: 400 });
    }

    const newStaff = await createStaffUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role as AdminRole,
      title: title ? title.trim() : 'Store Administrator',
      status: 'active',
      last_active_at: new Date().toISOString(),
    });

    // Record audit trail
    await createAuditLog({
      actor: authCheck.actor,
      action: 'staff.created',
      category: 'staff',
      target_type: 'staff',
      target_id: newStaff.id,
      summary: `Invited new team member '${newStaff.name}' with role '${newStaff.role}'`,
      details: {
        staff_id: newStaff.id,
        email: newStaff.email,
        role: newStaff.role,
        title: newStaff.title,
      },
    });

    const staffList = await getStaffUsers();

    return NextResponse.json({
      success: true,
      message: `Staff account created for ${newStaff.name} (${newStaff.role}).`,
      staff: staffList,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authCheck = await requireAdminPermission('manage_staff', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const { id, role, title, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required.' }, { status: 400 });
    }

    const updates: any = {};
    if (role && ['super_admin', 'inventory_manager', 'support_staff', 'read_only'].includes(role)) {
      updates.role = role;
    }
    if (title !== undefined) updates.title = title.trim();
    if (status && ['active', 'invited', 'suspended'].includes(status)) updates.status = status;

    const updated = await updateStaffUser(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Staff member not found.' }, { status: 404 });
    }

    // Record audit trail
    await createAuditLog({
      actor: authCheck.actor,
      action: 'staff.updated',
      category: 'staff',
      target_type: 'staff',
      target_id: updated.id,
      summary: `Updated credentials for '${updated.name}' (Role: ${updated.role}, Status: ${updated.status})`,
      details: {
        staff_id: updated.id,
        updates,
      },
    });

    const staffList = await getStaffUsers();

    return NextResponse.json({
      success: true,
      message: `Staff member ${updated.name} updated successfully.`,
      staff: staffList,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authCheck = await requireAdminPermission('manage_staff', req);
    if (!authCheck.authorized) return authCheck.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required.' }, { status: 400 });
    }

    if (id === authCheck.actor.id) {
      return NextResponse.json({ success: false, error: 'You cannot revoke your own admin account.' }, { status: 400 });
    }

    const removed = await deleteStaffUser(id);
    if (!removed) {
      return NextResponse.json({ success: false, error: 'Staff member not found.' }, { status: 404 });
    }

    // Record audit trail
    await createAuditLog({
      actor: authCheck.actor,
      action: 'staff.deleted',
      category: 'staff',
      target_type: 'staff',
      target_id: id,
      summary: `Revoked administrative access for staff ID '${id}'`,
      details: { revoked_staff_id: id },
    });

    const staffList = await getStaffUsers();

    return NextResponse.json({
      success: true,
      message: 'Staff access revoked successfully.',
      staff: staffList,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
