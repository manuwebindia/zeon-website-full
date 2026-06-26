import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

const VALID_STATUSES = ['new', 'contacted', 'converted', 'closed'];

// GET /api/admin/chatbot-leads
// Requires: chatbot-leads.view
// Query params: status? (filter), format? ('csv')
export async function GET(request) {
  try {
    const user = requirePermission(request, 'chatbot-leads.view');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const format = searchParams.get('format');

    const where = statusFilter && VALID_STATUSES.includes(statusFilter)
      ? { status: statusFilter }
      : {};

    const leads = await prisma.chatbotLead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        source: true,
        pageUrl: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        // transcript excluded from list — only in single GET
      },
    });

    // ── CSV export (Decision 13) ───────────────────────────────────────────
    if (format === 'csv') {
      const header = 'Name,Phone,Source,Page URL,Status,Notes,Date Captured';
      const rows = leads.map((l) => {
        const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const date = new Date(l.createdAt).toISOString().slice(0, 19).replace('T', ' ');
        return [
          escape(l.name),
          escape(l.phone),
          escape(l.source),
          escape(l.pageUrl ?? ''),
          escape(l.status),
          escape(l.notes ?? ''),
          escape(date),
        ].join(',');
      });
      const csv = [header, ...rows].join('\n');
      const today = new Date().toISOString().slice(0, 10);
      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="chatbot-leads-${today}.csv"`,
        },
      });
    }

    // ── Status counts ──────────────────────────────────────────────────────
    const [newCount, contactedCount, convertedCount, closedCount] =
      await Promise.all(
        VALID_STATUSES.map((s) => prisma.chatbotLead.count({ where: { status: s } }))
      );

    return NextResponse.json({
      leads,
      total: leads.length,
      counts: {
        new: newCount,
        contacted: contactedCount,
        converted: convertedCount,
        closed: closedCount,
      },
    });
  } catch (err) {
    console.error('[admin/chatbot-leads] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
