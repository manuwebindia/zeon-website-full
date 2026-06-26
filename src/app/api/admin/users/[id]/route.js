import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

// GET — fetch single user
export async function GET(request, { params }) {
  try {
    const user = requirePermission(request, 'users.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const dbUser = await prisma.user.findUnique({
      where: { id },
      include: { group: { select: { id: true, name: true } } },
    });

    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { passwordHash, ...safeUser } = dbUser;
    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error) {
    console.error('Fetch user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT — update user
export async function PUT(request, { params }) {
  try {
    const requester = requirePermission(request, 'users.edit');
    if (!requester) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const { username, email, displayName, password, avatarUrl, groupId, isActive } = await request.json();

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Prevent self-deactivation
    if (requester.userId === id && isActive === false) {
      return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 400 });
    }

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Username uniqueness (if changing)
    if (username && username.trim() !== existing.username) {
      if (!/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {
        return NextResponse.json(
          { error: 'Username must be 3–30 characters, alphanumeric and underscores only' },
          { status: 400 }
        );
      }
      const taken = await prisma.user.findUnique({ where: { username: username.trim() } });
      if (taken) return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    // Email uniqueness (if changing)
    if (email && email.trim() !== existing.email) {
      const taken = await prisma.user.findUnique({ where: { email: email.trim() } });
      if (taken) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    // Group existence
    if (groupId) {
      const group = await prisma.group.findUnique({ where: { id: groupId } });
      if (!group) return NextResponse.json({ error: 'Selected group does not exist' }, { status: 400 });
    }

    // Password re-hash if provided
    const updateData = {
      username: username?.trim() || existing.username,
      email: email !== undefined ? (email?.trim() || null) : existing.email,
      displayName: displayName !== undefined ? (displayName?.trim() || null) : existing.displayName,
      avatarUrl: avatarUrl !== undefined ? (avatarUrl?.trim() || null) : existing.avatarUrl,
      groupId: groupId || existing.groupId,
      isActive: isActive !== undefined ? isActive : existing.isActive,
    };

    if (password && password.length >= 8) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    } else if (password && password.length > 0) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { group: { select: { id: true, name: true } } },
    });

    const { passwordHash, ...safeUser } = updated;
    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — delete user (cannot delete yourself)
export async function DELETE(request, { params }) {
  try {
    const requester = requirePermission(request, 'users.delete');
    if (!requester) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;

    // Prevent self-deletion
    if (requester.userId === id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
