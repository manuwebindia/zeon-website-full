import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

export async function GET(request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  if (!requirePermission(request, 'contact-leads.view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') || null;
  const format       = searchParams.get('format') || null;

  const where = statusFilter ? { status: statusFilter } : {};

  // ── Fetch leads ──────────────────────────────────────────────────────────
  try {
    const [leads, total, counts] = await Promise.all([
      prisma.contactLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id:        true,
          name:      true,
          phone:     true,
          email:     true,
          service:   true,
          plan:      true,
          budget:    true,
          source:    true,
          status:    true,
          notes:     true,
          createdAt: true,
          updatedAt: true,
        },
        take: 500, // safety cap
      }),
      prisma.contactLead.count({ where }),
      // Count per status
      prisma.contactLead.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    // Normalise counts into { new: N, contacted: N, ... }
    const countsMap = { new: 0, contacted: 0, converted: 0, closed: 0 };
    counts.forEach(({ status, _count }) => {
      countsMap[status] = _count.status;
    });

    // ── CSV export ──────────────────────────────────────────────────────────
    if (format === 'csv') {
      const rows = [
        ['ID', 'Name', 'Phone', 'Email', 'Source', 'Service', 'Plan', 'Budget', 'Status', 'Created At'],
        ...leads.map((l) => [
          l.id, l.name, l.phone, l.email || '', l.source, l.service || '', l.plan || '', l.budget || '', l.status,
          new Date(l.createdAt).toLocaleString('en-IN'),
        ]),
      ];
      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="contact-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ leads, total, counts: countsMap }, { status: 200 });
  } catch (err) {
    console.error('[admin/contact-leads] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
