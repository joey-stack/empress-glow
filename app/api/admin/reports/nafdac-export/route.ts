import { NextResponse } from 'next/server';
import { getNafdacComplianceAudit, createAuditLog } from '@/lib/insforge/queries';
import { requireAdminPermission } from '@/lib/auth/admin-guard';

export async function GET(req: Request) {
  try {
    const authCheck = await requireAdminPermission('view_reports', req);
    if (!authCheck.authorized) return authCheck.response;

    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'csv';
    const auditReport = await getNafdacComplianceAudit();

    const timestamp = new Date().toISOString().split('T')[0];
    const operatorName = authCheck.actor?.name || 'Admin Compliance Officer';

    // Log the regulatory export event to the immutable audit store
    await createAuditLog({
      actor: authCheck.actor,
      action: 'compliance.dossier_exported',
      category: 'compliance',
      target_type: 'compliance_audit',
      summary: `Operator ${operatorName} exported NAFDAC Statutory Regulatory Compliance Dossier (${format.toUpperCase()}) with ${auditReport.total_products} formulations evaluated.`,
      details: {
        format,
        total_products: auditReport.total_products,
        compliant_count: auditReport.compliant_count,
        warning_count: auditReport.warning_count,
        fail_count: auditReport.fail_count,
        compliance_rate_pct: auditReport.compliance_rate_pct,
      },
    });

    if (format === 'json') {
      return new NextResponse(JSON.stringify(auditReport, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="empress-glow-nafdac-compliance-dossier-${timestamp}.json"`,
        },
      });
    }

    // Generate RFC-4180 compliant CSV format
    const escapeCsv = (val: string | number | boolean | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvHeaders = [
      'Product ID',
      'Formulation Name',
      'Brand / Vendor',
      'SKU',
      'Category',
      'Catalog Status',
      'Statutory Caveat Verified',
      'Prohibited Medical Terms',
      'Traditional Framing',
      'Active Ingredients Count',
      'Active Botanical Ingredients',
      'Compliance Status',
      'Regulatory Audit Notes',
    ];

    const rows = auditReport.products.map((p) => [
      escapeCsv(p.product_id),
      escapeCsv(p.name),
      escapeCsv(p.vendor),
      escapeCsv(p.sku || 'N/A'),
      escapeCsv(p.category),
      escapeCsv(p.status.toUpperCase()),
      escapeCsv(p.has_statutory_caveat ? 'YES (Verified)' : 'NO (Missing)'),
      escapeCsv(p.prohibited_medical_terms_found.length > 0 ? p.prohibited_medical_terms_found.join(', ') : 'NONE (Clean)'),
      escapeCsv(p.traditional_botanical_framing ? 'YES (Traditional Framing)' : 'NO'),
      escapeCsv(p.ingredients_declared_count),
      escapeCsv(p.ingredients.join('; ')),
      escapeCsv(p.compliance_status),
      escapeCsv(p.audit_notes),
    ]);

    // Metadata header block
    const metaBlock = [
      `# NAFDAC REGULATORY COMPLIANCE DOSSIER & BOTANICAL CERTIFICATE`,
      `# Generated for: Empress Glow Emporium - Abuja HQ`,
      `# Audit Date: ${auditReport.audited_at}`,
      `# Statutory Caveat: "${auditReport.statutory_caveat_verbatim}"`,
      `# Compliance Rate: ${auditReport.compliance_rate_pct}% (${auditReport.compliant_count}/${auditReport.total_products} Pass)`,
      `# Audited By: ${operatorName}`,
      '',
    ].join('\r\n');

    const csvContent = metaBlock + csvHeaders.join(',') + '\r\n' + rows.map((r) => r.join(',')).join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="empress-glow-nafdac-compliance-dossier-${timestamp}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('NAFDAC compliance export error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to export compliance report' },
      { status: 500 }
    );
  }
}
