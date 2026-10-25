import { NextResponse } from 'next/server';
import { runWorkflowRule, runAllWorkflowRules } from '@/lib/insforge/queries';
import { requireAdminPermission } from '@/lib/auth/admin-guard';

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminPermission('manage_automation', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json().catch(() => ({}));
    const { ruleId, all } = body;

    if (all) {
      const outcome = await runAllWorkflowRules();
      return NextResponse.json({
        success: true,
        message: `Successfully executed ${outcome.totalExecuted} automation rules.`,
        data: outcome,
      });
    }

    if (!ruleId) {
      return NextResponse.json(
        { success: false, error: 'ruleId or all: true is required' },
        { status: 400 }
      );
    }

    const outcome = await runWorkflowRule(ruleId);
    return NextResponse.json({
      success: true,
      message: `Successfully executed rule "${outcome.rule.title}".`,
      data: outcome,
    });
  } catch (error: any) {
    console.error('Automation trigger error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute automation rule' },
      { status: 500 }
    );
  }
}
