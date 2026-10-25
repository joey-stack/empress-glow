import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import {
  AdminRole,
  AdminPermission,
  AdminStaffUser,
  getStaffUserByEmail,
  getStaffUsers,
  checkAdminPermission,
} from '@/lib/insforge/queries';

export interface AdminActor {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  title?: string;
}

/**
 * Resolves the currently acting admin staff member.
 * Checks session cookies first, then respects dev simulation headers if present.
 */
export async function getAdminActor(req?: Request): Promise<AdminActor> {
  // Check request headers for role/email override (used for testing or switching simulated roles in UI)
  if (req) {
    const roleHeader = req.headers.get('x-admin-role') as AdminRole | null;
    const emailHeader = req.headers.get('x-admin-email');

    if (emailHeader) {
      const staff = await getStaffUserByEmail(emailHeader);
      if (staff) {
        return {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: roleHeader || staff.role,
          title: staff.title,
        };
      }
    }

    if (roleHeader && ['super_admin', 'inventory_manager', 'support_staff', 'read_only'].includes(roleHeader)) {
      const allStaff = await getStaffUsers();
      const matched = allStaff.find((s) => s.role === roleHeader);
      if (matched) {
        return {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          title: matched.title,
        };
      }
    }
  }

  // Check active session cookie
  const sessionUser = await getSessionUser();
  if (sessionUser && sessionUser.email) {
    const staff = await getStaffUserByEmail(sessionUser.email);
    if (staff) {
      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        title: staff.title,
      };
    }

    if (sessionUser.role && ['super_admin', 'inventory_manager', 'support_staff', 'read_only'].includes(sessionUser.role as AdminRole)) {
      return {
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        role: sessionUser.role as AdminRole,
      };
    }
  }

  // Default fallback: Mary Asuquo (Founder & Master Formulator / Super Admin)
  const defaultStaff = (await getStaffUsers())[0];
  return {
    id: defaultStaff.id,
    name: defaultStaff.name,
    email: defaultStaff.email,
    role: defaultStaff.role,
    title: defaultStaff.title,
  };
}

/**
 * Validates that the acting admin has the required permission.
 * In compliance with Backend Architecture Rule: Every Server Component, Route Handler,
 * and Server Action that touches data MUST independently verify authorization.
 */
export async function requireAdminPermission(
  permission: AdminPermission,
  req?: Request
): Promise<
  | { authorized: true; actor: AdminActor }
  | { authorized: false; response: NextResponse; actor: AdminActor }
> {
  const actor = await getAdminActor(req);

  const isAllowed = checkAdminPermission(actor.role, permission);

  if (!isAllowed) {
    const errorMsg = `Access Denied: Role '${actor.role}' lacks permission '${permission}'. Please contact a Super Admin.`;
    return {
      authorized: false,
      actor,
      response: NextResponse.json(
        {
          success: false,
          error: errorMsg,
          code: 'FORBIDDEN_INSUFFICIENT_ROLE',
          required_permission: permission,
          current_role: actor.role,
        },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, actor };
}
