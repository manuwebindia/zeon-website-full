import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // ── PATH 1: Env super admin (checked first — no DB call) ─────────────────
    const envUsername = process.env.ADMIN_USERNAME || 'admin';
    const envPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (envPasswordHash && username === envUsername) {
      const isMatch = await bcrypt.compare(password, envPasswordHash);
      if (isMatch) {
        const token = signToken({
          userId: 'env-super-admin',
          username: envUsername,
          permissions: ['*'],
        });

        return NextResponse.json({
          token,
          user: {
            id: 'env-super-admin',
            username: envUsername,
            displayName: 'Super Admin',
            avatarUrl: null,
            groupName: 'Super Admin (System)',
            permissions: ['*'],
          },
        }, { status: 200 });
      }
    }

    // ── PATH 2: Database user ─────────────────────────────────────────────────
    const dbUser = await prisma.user.findUnique({
      where: { username },
      include: { group: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!dbUser.isActive) {
      return NextResponse.json(
        { error: 'Account has been deactivated. Contact the administrator.' },
        { status: 403 }
      );
    }

    // Parse permissions from the group's JSON field
    let permissions = [];
    try {
      permissions = Array.isArray(dbUser.group.permissions)
        ? dbUser.group.permissions
        : JSON.parse(dbUser.group.permissions || '[]');
    } catch {
      permissions = [];
    }

    // Update last login timestamp (fire-and-forget, non-blocking)
    prisma.user
      .update({ where: { id: dbUser.id }, data: { lastLoginAt: new Date() } })
      .catch((err) => console.error('Failed to update lastLoginAt:', err));

    const token = signToken({
      userId: dbUser.id,
      username: dbUser.username,
      permissions,
    });

    return NextResponse.json({
      token,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        displayName: dbUser.displayName || dbUser.username,
        avatarUrl: dbUser.avatarUrl || null,
        groupName: dbUser.group.name,
        permissions,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
