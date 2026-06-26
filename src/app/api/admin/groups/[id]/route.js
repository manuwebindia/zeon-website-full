import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

const VALID_PERMISSIONS = [
  'dashboard.view',
  'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete', 'blogs.publish',
  'media.view', 'media.upload',
  'settings.view', 'settings.edit',
  'users.view', 'users.create', 'users.edit', 'users.delete',
  'groups.manage',
  'analytics.view',
  'seo.manage',
];

// GET — fetch a single group
export async function GET(request, { params }) {
  try {
    const user = requirePermission(request, 'groups.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const group = await prisma.group.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

    return NextResponse.json({
      group: {
        ...group,
        permissions: Array.isArray(group.permissions)
          ? group.permissions
          : JSON.parse(group.permissions || '[]'),
        userCount: group._count.users,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Fetch group error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT — update group name, description, permissions
export async function PUT(request, { params }) {
  try {
    const user = requirePermission(request, 'groups.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const { name, description, permissions } = await request.json();

    const existing = await prisma.group.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

    // Validate permissions
    const perms = Array.isArray(permissions) ? permissions : [];
    const invalidPerms = perms.filter((p) => !VALID_PERMISSIONS.includes(p));
    if (invalidPerms.length > 0) {
      return NextResponse.json(
        { error: `Invalid permission keys: ${invalidPerms.join(', ')}` },
        { status: 400 }
      );
    }

    // Check name uniqueness if changing
    if (name && name.trim() !== existing.name) {
      const nameTaken = await prisma.group.findUnique({ where: { name: name.trim() } });
      if (nameTaken) {
        return NextResponse.json({ error: 'A group with this name already exists' }, { status: 409 });
      }
    }

    const updated = await prisma.group.update({
      where: { id },
      data: {
        name: name?.trim() || existing.name,
        description: description !== undefined ? (description?.trim() || null) : existing.description,
        permissions: perms,
      },
    });

    return NextResponse.json({ group: updated }, { status: 200 });
  } catch (error) {
    console.error('Update group error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — delete a group (only if no users assigned)
export async function DELETE(request, { params }) {
  try {
    const user = requirePermission(request, 'groups.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;

    const group = await prisma.group.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

    if (group._count.users > 0) {
      return NextResponse.json(
        { error: `Cannot delete — ${group._count.users} user(s) are assigned to this group. Reassign or remove them first.` },
        { status: 400 }
      );
    }

    await prisma.group.delete({ where: { id } });

    return NextResponse.json({ message: 'Group deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete group error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
