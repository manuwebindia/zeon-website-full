// src/app/api/admin/contact-leads/count/route.js
// GET — returns count of "new" contact leads for sidebar badge

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

export async function GET(request) {
  if (!requirePermission(request, 'contact-leads.view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await prisma.contactLead.count({ where: { status: 'new' } });
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    console.error('[admin/contact-leads/count] error:', err);
    return NextResponse.json({ count: 0 }, { status: 200 }); // non-critical, return 0 on failure
  }
}
