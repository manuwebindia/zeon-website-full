import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

const VALID_STATUSES = ['new', 'contacted', 'converted', 'closed'];

// GET /api/admin/chatbot-leads/[id] — full lead with transcript
export async function GET(request, { params }) {
  try {
    const user = requirePermission(request, 'chatbot-leads.view');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const lead = await prisma.chatbotLead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead }, { status: 200 });
  } catch (err) {
    console.error('[admin/chatbot-leads/[id]] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/chatbot-leads/[id] — update status and/or notes
export async function PATCH(request, { params }) {
  try {
    const user = requirePermission(request, 'chatbot-leads.edit');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const existing = await prisma.chatbotLead.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const data = {};
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes === null ? null : String(notes);

    const updated = await prisma.chatbotLead.update({
      where: { id },
      data,
    });

    return NextResponse.json({ lead: updated }, { status: 200 });
  } catch (err) {
    console.error('[admin/chatbot-leads/[id]] PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/chatbot-leads/[id] — hard delete
export async function DELETE(request, { params }) {
  try {
    const user = requirePermission(request, 'chatbot-leads.delete');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.chatbotLead.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await prisma.chatbotLead.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[admin/chatbot-leads/[id]] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
