import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPrismaClient } from '@/lib/db';
import { requirePermission } from '@/lib/auth';

export async function GET(request, { params }) {
  if (!requirePermission(request, 'job-postings.view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const prisma = getPrismaClient();
    const job = await prisma.jobPosting.findUnique({ where: { id } });
    if (!job) return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    return NextResponse.json({ job }, { status: 200 });
  } catch (err) {
    console.error('[admin/job-postings/[id]] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  if (!requirePermission(request, 'job-postings.edit')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validStatuses = ['pending', 'approved', 'rejected'];
  const data = {};

  if (body.companyName !== undefined) {
    if (!String(body.companyName).trim()) {
      return NextResponse.json({ error: 'Company name cannot be empty' }, { status: 400 });
    }
    data.companyName = String(body.companyName).trim();
  }

  if (body.companyLogo !== undefined) {
    data.companyLogo = body.companyLogo ? String(body.companyLogo).trim() : null;
  }

  if (body.jobTitle !== undefined) {
    if (!String(body.jobTitle).trim()) {
      return NextResponse.json({ error: 'Job title cannot be empty' }, { status: 400 });
    }
    data.jobTitle = String(body.jobTitle).trim();
  }

  if (body.phone !== undefined) {
    if (!String(body.phone).trim()) {
      return NextResponse.json({ error: 'Phone number cannot be empty' }, { status: 400 });
    }
    data.phone = String(body.phone).trim();
  }

  if (body.location !== undefined) {
    data.location = body.location ? String(body.location).trim() : null;
  }

  if (body.aboutCompany !== undefined) {
    data.aboutCompany = body.aboutCompany ? String(body.aboutCompany).trim() : null;
  }

  if (body.skillsRequired !== undefined) {
    data.skillsRequired = body.skillsRequired ? String(body.skillsRequired).trim() : null;
  }

  if (body.eligibility !== undefined) {
    data.eligibility = body.eligibility ? String(body.eligibility).trim() : null;
  }

  if (body.jobTypes !== undefined) {
    data.jobTypes = body.jobTypes ? String(body.jobTypes).trim() : null;
  }

  if (body.shiftSchedule !== undefined) {
    data.shiftSchedule = body.shiftSchedule ? String(body.shiftSchedule).trim() : null;
  }

  if (body.status !== undefined) {
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    data.status = body.status;
    if (body.status === 'approved') {
      data.approvedAt = new Date();
      data.rejectedAt = null;
    } else if (body.status === 'rejected') {
      data.rejectedAt = new Date();
      data.approvedAt = null;
    } else {
      data.approvedAt = null;
      data.rejectedAt = null;
    }
  }

  if (body.adminNotes !== undefined) {
    data.adminNotes = body.adminNotes ? String(body.adminNotes).slice(0, 5000) : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  try {
    const prisma = getPrismaClient();
    const job = await prisma.jobPosting.update({ where: { id }, data });
    try {
      revalidatePath('/placements');
    } catch {
      // non-fatal
    }
    return NextResponse.json({ job }, { status: 200 });
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    console.error('[admin/job-postings/[id]] PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!requirePermission(request, 'job-postings.delete')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const prisma = getPrismaClient();
    await prisma.jobPosting.delete({ where: { id } });
    try {
      revalidatePath('/placements');
    } catch {
      // non-fatal
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    console.error('[admin/job-postings/[id]] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
