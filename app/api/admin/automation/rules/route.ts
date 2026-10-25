import { NextResponse } from 'next/server';
import {
  getWorkflowRules,
  updateWorkflowRule,
  getWorkflowExecutionLogs,
  createAuditLog,
} from '@/lib/insforge/queries';
import { requireAdminPermission } from '@/lib/auth/admin-guard';

export async function GET(req: Request) {
  try {
    const authCheck = await requireAdminPermission('view_orders', req);
    if (!authCheck.authorized) return authCheck.response;

    const [rules, logs] = await Promise.all([
      getWorkflowRules(),
      getWorkflowExecutionLogs(30),
    ]);

    return NextResponse.json({
      success: true,
      rules,
      recentLogs: logs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch automation rules' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const authCheck = await requireAdminPermission('manage_automation', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, error: 'Rule id is required' },
        { status: 400 }
      );
    }

    const { id, is_enabled } = body;
    const updated = await updateWorkflowRule(id, {
      ...(is_enabled !== undefined ? { is_enabled: Boolean(is_enabled) } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }

    const operatorName = authCheck.actor?.name || 'Admin';
    await createAuditLog({
      actor: authCheck.actor,
      action: updated.is_enabled ? 'workflow.rule_enabled' : 'workflow.rule_disabled',
      category: 'automation',
      target_type: 'workflow_rule',
      target_id: updated.id,
      summary: `Operator ${operatorName} ${updated.is_enabled ? 'enabled' : 'disabled'} automation rule "${updated.title}"`,
      details: { rule_id: updated.id, is_enabled: updated.is_enabled },
    });

    return NextResponse.json({
      success: true,
      rule: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update automation rule' },
      { status: 500 }
    );
  }
}
