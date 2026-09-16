import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPrismaClient } from '@/lib/db';
import { requirePermission } from '@/lib/auth';

export async function GET(request) {
  if (!requirePermission(request, 'job-postings.view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') || null;
  const search = (searchParams.get('search') || searchParams.get('q') || '').trim();

  const where = {};
  if (statusFilter && statusFilter !== 'all') {
    where.status = statusFilter;
  }

  if (search) {
    where.OR = [
      { jobTitle: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

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

export async function POST(request) {
  const user = requirePermission(request, 'job-postings.create') || requirePermission(request, 'job-postings.edit');
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    companyName,
    companyLogo,
    jobTitle,
    phone,
    location,
    aboutCompany,
    skillsRequired,
    eligibility,
    jobTypes,
    shiftSchedule,
    status = 'approved',
    adminNotes,
  } = body;

  if (!companyName?.trim() || !jobTitle?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: 'Job title, company name, and phone number are required.' },
      { status: 400 }
    );
  }

  const validStatuses = ['pending', 'approved', 'rejected'];
  const finalStatus = validStatuses.includes(status) ? status : 'approved';

  try {
    const prisma = getPrismaClient();
    const posting = await prisma.jobPosting.create({
      data: {
        companyName: String(companyName).trim(),
        companyLogo: companyLogo ? String(companyLogo).trim() : null,
        jobTitle: String(jobTitle).trim(),
        phone: String(phone).trim(),
        location: location ? String(location).trim() : null,
        aboutCompany: aboutCompany ? String(aboutCompany).trim() : null,
        skillsRequired: skillsRequired ? String(skillsRequired).trim() : null,
        eligibility: eligibility ? String(eligibility).trim() : null,
        jobTypes: jobTypes ? String(jobTypes).trim() : null,
        shiftSchedule: shiftSchedule ? String(shiftSchedule).trim() : null,
        status: finalStatus,
        approvedAt: finalStatus === 'approved' ? new Date() : null,
        rejectedAt: finalStatus === 'rejected' ? new Date() : null,
        adminNotes: adminNotes ? String(adminNotes).trim() : null,
        source: 'admin',
      },
    });

    try {
      revalidatePath('/placements');
    } catch {
      // non-fatal
    }

    return NextResponse.json({ job: posting }, { status: 201 });
  } catch (err) {
    console.error('[admin/job-postings] POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

