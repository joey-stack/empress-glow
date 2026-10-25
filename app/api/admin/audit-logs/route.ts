import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs, createAuditLog } from '@/lib/insforge/queries';
import { requireAdminPermission, getAdminActor } from '@/lib/auth/admin-guard';

export async function GET(req: NextRequest) {
  try {
    const authCheck = await requireAdminPermission('view_audit_logs', req);
    if (!authCheck.authorized) return authCheck.response;

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const targetType = searchParams.get('target_type') || undefined;
    const actorEmail = searchParams.get('actor_email') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 100;
    const search = searchParams.get('search')?.toLowerCase().trim() || '';

    let logs = await getAuditLogs({
      category,
      target_type: targetType,
      actor_email: actorEmail,
      limit,
    });

    if (search) {
      logs = logs.filter(
        (l) =>
          l.summary.toLowerCase().includes(search) ||
          l.action.toLowerCase().includes(search) ||
          l.actor.name.toLowerCase().includes(search) ||
          l.actor.email.toLowerCase().includes(search) ||
          (l.target_id && l.target_id.toLowerCase().includes(search))
      );
    }

    const currentActor = await getAdminActor(req);

    return NextResponse.json({
      success: true,
      logs,
      data: { logs },
      total: logs.length,
      currentActor,
      categories: ['catalog', 'orders', 'finance', 'staff', 'settings', 'auth'],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await getAdminActor(req);
    const body = await req.json();
    const { action, category, target_type, target_id, summary, details } = body;

    if (!action || !summary) {
      return NextResponse.json({ success: false, error: 'Action and summary are required.' }, { status: 400 });
    }

    const newLog = await createAuditLog({
      actor,
      action,
      category: category || 'settings',
      target_type: target_type || 'store_settings',
      target_id,
      summary,
      details,
      ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({
      success: true,
      log: newLog,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
