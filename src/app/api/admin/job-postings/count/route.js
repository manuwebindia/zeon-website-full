import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/db';
import { requirePermission } from '@/lib/auth';

export async function GET(request) {
  if (!requirePermission(request, 'job-postings.view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const prisma = getPrismaClient();
    const count = await prisma.jobPosting.count({ where: { status: 'pending' } });
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    console.error('[admin/job-postings/count] error:', err);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
