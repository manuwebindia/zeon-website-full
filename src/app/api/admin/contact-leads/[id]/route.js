// src/app/api/admin/contact-leads/[id]/route.js
// GET   — full lead detail
// PATCH — update status or notes
// DELETE — delete lead

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

// ── GET /api/admin/contact-leads/[id] ──────────────────────────────────────────
export async function GET(request, { params }) {
  if (!requirePermission(request, 'contact-leads.view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const lead = await prisma.contactLead.findUnique({ where: { id } });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    return NextResponse.json({ lead }, { status: 200 });
  } catch (err) {
    console.error('[admin/contact-leads/[id]] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── PATCH /api/admin/contact-leads/[id] ───────────────────────────────────────
export async function PATCH(request, { params }) {
  if (!requirePermission(request, 'contact-leads.edit')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validStatuses = ['new', 'contacted', 'converted', 'closed'];
  const data = {};
  if (body.status !== undefined) {
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.notes !== undefined) {
    data.notes = String(body.notes).slice(0, 5000);
  }

  try {
    const lead = await prisma.contactLead.update({ where: { id }, data });
    return NextResponse.json({ lead }, { status: 200 });
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    console.error('[admin/contact-leads/[id]] PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── DELETE /api/admin/contact-leads/[id] ──────────────────────────────────────
export async function DELETE(request, { params }) {
  if (!requirePermission(request, 'contact-leads.delete')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.contactLead.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    console.error('[admin/contact-leads/[id]] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
