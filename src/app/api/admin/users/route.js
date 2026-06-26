import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

// GET — list all DB users with group info
export async function GET(request) {
  try {
    const user = requirePermission(request, 'users.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        isActive: true,
        groupId: true,
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — create a new user
export async function POST(request) {
  try {
    const user = requirePermission(request, 'users.create');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { username, email, displayName, password, avatarUrl, groupId } = await request.json();

    // Validation
    if (!username || !username.trim()) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {
      return NextResponse.json(
        { error: 'Username must be 3–30 characters, alphanumeric and underscores only' },
        { status: 400 }
      );
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (!groupId) {
      return NextResponse.json({ error: 'A group is required' }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check group exists
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      return NextResponse.json({ error: 'Selected group does not exist' }, { status: 400 });
    }

    // Check uniqueness
    const existingUsername = await prisma.user.findUnique({ where: { username: username.trim() } });
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: email.trim() } });
      if (existingEmail) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email?.trim() || null,
        displayName: displayName?.trim() || null,
        passwordHash,
        avatarUrl: avatarUrl?.trim() || null,
        groupId,
      },
      include: { group: { select: { id: true, name: true } } },
    });

    // Never return the password hash
    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
