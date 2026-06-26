import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

// GET /api/admin/chatbot-leads/count
// Lightweight endpoint for sidebar badge — returns count of 'new' leads only.
// Requires: chatbot-leads.view
export async function GET(request) {
  try {
    const user = requirePermission(request, 'chatbot-leads.view');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const count = await prisma.chatbotLead.count({
      where: { status: 'new' },
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    console.error('[admin/chatbot-leads/count] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
