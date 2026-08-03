import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/db';
import { requirePermission } from '@/lib/auth';

export async function GET(request) {
  if (!requirePermission(request, 'job-postings.view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') || null;
  const where = statusFilter ? { status: statusFilter } : {};

  try {
    const prisma = getPrismaClient();
    const [jobs, total, counts] = await Promise.all([
      prisma.jobPosting.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
      prisma.jobPosting.count({ where }),
      prisma.jobPosting.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    const countsMap = { pending: 0, approved: 0, rejected: 0 };
    counts.forEach(({ status, _count }) => {
      countsMap[status] = _count.status;
    });

    return NextResponse.json({ jobs, total, counts: countsMap }, { status: 200 });
  } catch (err) {
    console.error('[admin/job-postings] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
