import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

// Fixed permission key list — reject anything not in this list
const VALID_PERMISSIONS = [
  'dashboard.view',
  'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete', 'blogs.publish',
  'media.view', 'media.upload',
  'settings.view', 'settings.edit',
  'users.view', 'users.create', 'users.edit', 'users.delete',
  'groups.manage',
  'analytics.view',
  'seo.manage',
  'chatbot-leads.view', 'chatbot-leads.edit', 'chatbot-leads.delete',
  'chat-analytics.view',
];

// GET — list all groups with user count
export async function GET(request) {
  try {
    const user = requirePermission(request, 'groups.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const groups = await prisma.group.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { users: true } } },
    });

    const result = groups.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      permissions: Array.isArray(g.permissions) ? g.permissions : JSON.parse(g.permissions || '[]'),
      userCount: g._count.users,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    }));

    return NextResponse.json({ groups: result }, { status: 200 });
  } catch (error) {
    console.error('Fetch groups error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — create a new group
export async function POST(request) {
  try {
    const user = requirePermission(request, 'groups.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { name, description, permissions } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    const perms = Array.isArray(permissions) ? permissions : [];
    const invalidPerms = perms.filter((p) => !VALID_PERMISSIONS.includes(p));
    if (invalidPerms.length > 0) {
      return NextResponse.json(
        { error: `Invalid permission keys: ${invalidPerms.join(', ')}` },
        { status: 400 }
      );
    }

    const existing = await prisma.group.findUnique({ where: { name: name.trim() } });
    if (existing) {
      return NextResponse.json({ error: 'A group with this name already exists' }, { status: 409 });
    }

    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        permissions: perms,
      },
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error('Create group error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
